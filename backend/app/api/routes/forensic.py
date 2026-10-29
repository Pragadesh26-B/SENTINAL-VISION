import os
import base64
import uuid
import logging
import httpx
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.forensic import (
    WitnessAnalysisRequest,
    WitnessAnalysisResponse,
    CompositeGenerationRequest,
    CompositeRefinementRequest,
    CompositeResponse,
)
from app.services.gemini_service import gemini_service
from app.services.supabase_service import supabase_service
from app.api.deps import get_current_investigator, InvestigatorIdentity

router = APIRouter(prefix="/forensic", tags=["Forensic AI"])
logger = logging.getLogger(__name__)


def load_reference_image_bytes(image_url: str) -> Optional[bytes]:
    """
    Safely resolves reference image bytes from data URI, local storage, or public URL.
    """
    if not image_url:
        return None

    # 1. Base64 data URI
    if image_url.startswith("data:image"):
        try:
            _, b64 = image_url.split(",", 1)
            return base64.b64decode(b64)
        except Exception as e:
            logger.warning(f"Failed to decode base64 reference image: {e}")
            return None

    # 2. Local static storage resolution
    if "/static/composites/" in image_url:
        filename = image_url.split("/static/composites/")[-1].split("?")[0]
        base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
        local_path = os.path.join(base_dir, "static", "composites", filename)
        if os.path.exists(local_path):
            try:
                with open(local_path, "rb") as f:
                    return f.read()
            except Exception as e:
                logger.warning(f"Failed to read local composite from {local_path}: {e}")

    # 3. HTTP URL fetch
    if image_url.startswith("http://") or image_url.startswith("https://"):
        try:
            with httpx.Client(timeout=6.0) as client:
                res = client.get(image_url)
                if res.status_code == 200:
                    return res.content
        except Exception as e:
            logger.warning(f"Remote fetch for reference image {image_url} failed: {e}")

    return None


@router.post("/analyze", response_model=WitnessAnalysisResponse)
async def analyze_witness_statement(
    req: WitnessAnalysisRequest,
    investigator: InvestigatorIdentity = Depends(get_current_investigator)
):
    """
    Extracts structured biometric facial traits from raw witness narration using Gemini.
    Tracks uncertainty, missing traits as 'unknown', and contradictions without inventing features.
    """
    if not req.witness_statement or len(req.witness_statement.strip()) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Witness statement is too brief for forensic facial reconstruction (minimum 5 characters)."
        )

    try:
        traits, forensic_summary, synthesis_prompt, uncertain, contradictions = gemini_service.analyze_witness_statement(
            statement=req.witness_statement,
            context=req.case_context
        )
        return WitnessAnalysisResponse(
            raw_statement=req.witness_statement,
            traits=traits,
            forensic_summary=forensic_summary,
            synthesis_prompt=synthesis_prompt,
            uncertain_traits=uncertain,
            contradictions=contradictions
        )
    except Exception as e:
        logger.error(f"Witness analysis failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Forensic Analysis Error: {str(e)}"
        )


@router.post("/generate", response_model=CompositeResponse)
async def generate_facial_composite(
    req: CompositeGenerationRequest,
    investigator: InvestigatorIdentity = Depends(get_current_investigator)
):
    """
    Synthesizes a realistic facial composite portrait following clinical forensic constraints.
    Uploads the resulting image to persistent storage and records revision metadata.
    """
    try:
        # Build prompt from explicit traits
        prompt = gemini_service.build_prompt_from_traits(
            traits=req.traits,
            enhancements=req.custom_prompt_enhancements or req.witness_notes
        )

        # Generate image bytes via Gemini / Biometric synthesis
        image_bytes = gemini_service.generate_composite_image(prompt, traits=req.traits)

        if not image_bytes or len(image_bytes) < 100:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail="Image generation produced an empty or invalid payload. Please try again."
            )

        # Upload to Supabase Storage (or local fallback)
        unique_filename = f"composite_{uuid.uuid4().hex[:10]}_rev1.jpg"
        public_url, storage_path = supabase_service.upload_sketch_image(image_bytes, filename=unique_filename)

        now = datetime.now(timezone.utc).isoformat()

        # If linked to a case, persist the composite record
        if req.case_id:
            supabase_service.record_composite({
                "case_id": req.case_id,
                "image_url": public_url,
                "revision_number": 1,
                "extracted_traits": req.traits.model_dump(),
                "witness_notes": req.witness_notes or req.custom_prompt_enhancements,
                "prompt_used": prompt,
                "storage_path": storage_path,
                "created_at": now
            })

        # Base64 data for immediate frontend preview
        b64_data = f"data:image/jpeg;base64,{base64.b64encode(image_bytes).decode('utf-8')}"

        return CompositeResponse(
            image_url=public_url,
            image_base64=b64_data,
            traits=req.traits,
            revision_number=1,
            prompt_used=prompt,
            storage_path=storage_path,
            case_id=req.case_id,
            created_at=now
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Generation failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Composite Generation Error: {str(e)}"
        )


@router.post("/refine", response_model=CompositeResponse)
async def refine_facial_composite(
    req: CompositeRefinementRequest,
    investigator: InvestigatorIdentity = Depends(get_current_investigator)
):
    """
    Applies conversational eyewitness correction feedback to modify ONLY requested features.
    Uses the previous generated image as reference, preserving untouched attributes,
    and saves the new revision separately without overwriting original files.
    """
    if not req.correction_feedback or len(req.correction_feedback.strip()) < 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Eyewitness correction feedback must specify which feature to modify (minimum 3 characters)."
        )

    if not req.previous_image_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing reference image URL from previous revision. Cannot perform iterative correction."
        )

    try:
        # Load reference image bytes
        ref_bytes = load_reference_image_bytes(req.previous_image_url)

        # Refine traits and prompt
        updated_traits, new_prompt = gemini_service.refine_traits_and_prompt(
            current_traits=req.current_traits,
            feedback=req.correction_feedback
        )

        # Generate refined image using reference image
        image_bytes = gemini_service.generate_composite_image(
            prompt=new_prompt,
            traits=updated_traits,
            reference_image_bytes=ref_bytes,
            edit_instruction=req.correction_feedback
        )

        new_rev = req.revision_number + 1
        unique_filename = f"composite_{uuid.uuid4().hex[:10]}_rev{new_rev}.jpg"
        public_url, storage_path = supabase_service.upload_sketch_image(image_bytes, filename=unique_filename)
        now = datetime.now(timezone.utc).isoformat()

        if req.case_id:
            supabase_service.record_composite({
                "case_id": req.case_id,
                "image_url": public_url,
                "revision_number": new_rev,
                "extracted_traits": updated_traits.model_dump(),
                "correction_prompt": req.correction_feedback,
                "prompt_used": new_prompt,
                "storage_path": storage_path,
                "created_at": now
            })

        b64_data = f"data:image/jpeg;base64,{base64.b64encode(image_bytes).decode('utf-8')}"

        return CompositeResponse(
            image_url=public_url,
            image_base64=b64_data,
            traits=updated_traits,
            revision_number=new_rev,
            prompt_used=new_prompt,
            correction_instruction=req.correction_feedback,
            storage_path=storage_path,
            case_id=req.case_id,
            created_at=now
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Refinement failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Correction Refinement Error: {str(e)}"
        )
