from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class FacialTraits(BaseModel):
    gender: Optional[str] = Field("unknown", description="Estimated gender: male, female, non-binary, or unknown")
    age_range: Optional[str] = Field("unknown", description="Estimated age range, e.g. 30-35, or unknown")
    face_shape: Optional[str] = Field("unknown", description="Oval, square, heart, angular, round, or unknown")
    forehead: Optional[str] = Field("unknown", description="Forehead height, width, slope, or unknown")
    eyebrows: Optional[str] = Field("unknown", description="Eyebrow shape, thickness, arch, or unknown")
    eyes: Optional[str] = Field("unknown", description="Eye shape, color, spacing, eyelids, or unknown")
    nose: Optional[str] = Field("unknown", description="Nose bridge, tip, width, prominence, or unknown")
    lips_and_mouth: Optional[str] = Field("unknown", description="Lip shape, thickness, philtrum, or unknown")
    jawline: Optional[str] = Field("unknown", description="Jawline width, sharpness, angle, or unknown")
    chin: Optional[str] = Field("unknown", description="Chin prominence, cleft, shape, or unknown")
    hair: Optional[str] = Field("unknown", description="Hair length, texture, color, hairline, or unknown")
    facial_hair: Optional[str] = Field("unknown", description="Beard, mustache, stubble type, or unknown")
    skin_tone_texture: Optional[str] = Field("unknown", description="Skin tone, complexion, wrinkles, or unknown")
    distinctive_features: List[str] = Field(default_factory=list, description="Scars, birthmarks, tattoos, piercings")
    uncertain_traits: List[str] = Field(default_factory=list, description="Traits witness expressed uncertainty about")
    contradictions: List[str] = Field(default_factory=list, description="Contradictory witness statements detected")
    confidence_score: Optional[float] = Field(0.85, description="Confidence in extraction 0.0-1.0")


class WitnessAnalysisRequest(BaseModel):
    witness_statement: str = Field(..., min_length=5, description="Raw witness verbal or written report")
    case_context: Optional[str] = Field(None, description="Crime type or lighting conditions if known")


class WitnessAnalysisResponse(BaseModel):
    raw_statement: str
    traits: FacialTraits
    forensic_summary: str
    synthesis_prompt: str
    uncertain_traits: List[str] = Field(default_factory=list)
    contradictions: List[str] = Field(default_factory=list)


class CompositeGenerationRequest(BaseModel):
    traits: FacialTraits
    custom_prompt_enhancements: Optional[str] = None
    witness_notes: Optional[str] = None
    style: Optional[str] = Field("photorealistic_forensic", description="photorealistic_forensic")
    case_id: Optional[str] = None


class CompositeRefinementRequest(BaseModel):
    previous_image_url: str = Field(..., description="URL of previous sketch version")
    current_traits: FacialTraits
    correction_feedback: str = Field(..., min_length=3, description="Specific feedback from witness")
    case_id: Optional[str] = None
    revision_number: int = Field(1, description="Sequential revision count")
    original_prompt: Optional[str] = None


class CompositeResponse(BaseModel):
    image_url: str
    image_base64: Optional[str] = None
    traits: FacialTraits
    revision_number: int
    prompt_used: str
    correction_instruction: Optional[str] = None
    storage_path: Optional[str] = None
    case_id: Optional[str] = None
    created_at: Optional[str] = None
