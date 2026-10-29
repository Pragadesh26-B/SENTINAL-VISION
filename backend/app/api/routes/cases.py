import uuid
from typing import List, Optional
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, Query, status
from app.schemas.cases import (
    CaseResponse,
    CaseCreateRequest,
    CaseUpdateRequest,
)
from app.services.supabase_service import supabase_service
from app.api.deps import get_current_investigator, InvestigatorIdentity

router = APIRouter(prefix="/cases", tags=["Case Studies"])


@router.get("", response_model=List[CaseResponse])
async def list_cases(
    status_filter: Optional[str] = Query(None, alias="status"),
    investigator: InvestigatorIdentity = Depends(get_current_investigator)
):
    """
    Retrieves all forensic cases, filterable by status ('Active Investigation', 'Solved', 'Cold Case').
    """
    cases = supabase_service.get_cases(status=status_filter)
    return cases


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case_dossier(
    case_id: str,
    investigator: InvestigatorIdentity = Depends(get_current_investigator)
):
    """
    Retrieves a single case dossier including all historical suspect composites and revisions.
    """
    case = supabase_service.get_case_by_id(case_id)
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case record with ID '{case_id}' was not found in archives."
        )
    return case


@router.post("", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
async def create_case(
    req: CaseCreateRequest,
    investigator: InvestigatorIdentity = Depends(get_current_investigator)
):
    """
    Creates a new forensic case file and links any initial composite image and investigator id.
    """
    now = datetime.now(timezone.utc).isoformat()
    case_id = str(uuid.uuid4())

    new_case = {
        "id": case_id,
        "case_number": req.case_number,
        "title": req.title,
        "incident_type": req.incident_type,
        "incident_date": req.incident_date or now[:10],
        "location": req.location,
        "summary": req.summary,
        "status": req.status,
        "primary_composite_url": req.primary_composite_url,
        "investigator_id": investigator.user_id if investigator.is_authenticated else None,
        "created_at": now,
        "updated_at": now,
        "composites": []
    }

    if req.primary_composite_url:
        comp_record = {
            "case_id": case_id,
            "image_url": req.primary_composite_url,
            "revision_number": 1,
            "extracted_traits": req.initial_traits or {},
            "witness_notes": req.witness_statement,
        }
        saved_comp = supabase_service.record_composite(comp_record)
        new_case["composites"].append(saved_comp)

    created = supabase_service.create_case(new_case)
    return created


@router.patch("/{case_id}", response_model=CaseResponse)
async def update_case(
    case_id: str,
    req: CaseUpdateRequest,
    investigator: InvestigatorIdentity = Depends(get_current_investigator)
):
    """
    Updates case details such as status ('Solved', 'Cold Case', 'Active Investigation') or summary.
    """
    now = datetime.now(timezone.utc).isoformat()
    update_data = {k: v for k, v in req.model_dump().items() if v is not None}
    update_data["updated_at"] = now

    updated = supabase_service.update_case(case_id, update_data)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Case record with ID '{case_id}' was not found."
        )
    return updated
