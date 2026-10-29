from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class SuspectCompositeRecord(BaseModel):
    id: Optional[str] = None
    case_id: Optional[str] = None
    image_url: str
    revision_number: int = 1
    extracted_traits: Dict[str, Any]
    witness_notes: Optional[str] = None
    correction_prompt: Optional[str] = None
    created_at: Optional[datetime] = None


class CaseCreateRequest(BaseModel):
    case_number: str = Field(..., description="Unique investigation number, e.g. CR-2026-9042")
    title: str = Field(..., min_length=3, description="Incident title")
    incident_type: str = Field(..., description="Robbery, Burglary, Assault, Homicide, etc.")
    incident_date: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    status: str = Field("Active Investigation", description="Active Investigation, Solved, Cold Case")
    primary_composite_url: Optional[str] = None
    initial_traits: Optional[Dict[str, Any]] = None
    witness_statement: Optional[str] = None


class CaseUpdateRequest(BaseModel):
    title: Optional[str] = None
    incident_type: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    status: Optional[str] = None
    primary_composite_url: Optional[str] = None


class CaseResponse(BaseModel):
    id: str
    case_number: str
    title: str
    incident_type: str
    incident_date: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    status: str
    primary_composite_url: Optional[str] = None
    witness_statement: Optional[str] = None
    initial_traits: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    composites: Optional[List[SuspectCompositeRecord]] = []
