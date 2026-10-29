import logging
from typing import Optional
from pydantic import BaseModel
from fastapi import Header, HTTPException, status
from app.config import settings
from app.services.supabase_service import supabase_service

logger = logging.getLogger(__name__)


class InvestigatorIdentity(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    badge_number: Optional[str] = None
    agency: Optional[str] = "Metropolitan Forensic Division"
    role: str = "Forensic Examiner"
    is_authenticated: bool = False


async def get_current_investigator(
    authorization: Optional[str] = Header(None)
) -> InvestigatorIdentity:
    """
    Validates Supabase JWT from Authorization: Bearer <token>.
    Extracts investigator metadata, or provides guest investigator identity in dev.
    """
    if not authorization:
        # Dev / unauthenticated guest mode
        return InvestigatorIdentity(
            user_id="inv-guest",
            email="investigator@crimeface.internal",
            badge_number="INV-9021",
            is_authenticated=False
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization format. Must be 'Bearer <token>'"
        )

    token = authorization.replace("Bearer ", "").strip()

    # If Supabase client is configured, verify the token
    if supabase_service.is_configured():
        try:
            user_response = supabase_service.client.auth.get_user(token)
            if user_response and user_response.user:
                u = user_response.user
                metadata = u.user_metadata or {}
                return InvestigatorIdentity(
                    user_id=u.id,
                    email=u.email,
                    badge_number=metadata.get("badge_number", "INV-VERIFIED"),
                    agency=metadata.get("agency", "Metropolitan Forensic Division"),
                    role=metadata.get("role", "Lead Forensic Examiner"),
                    is_authenticated=True
                )
        except Exception as e:
            logger.warning(f"Supabase JWT validation failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Authentication token invalid or expired: {str(e)}"
            )

    # If Supabase is not configured yet, accept valid bearer token
    return InvestigatorIdentity(
        user_id="inv-demo-session",
        email="demo.agent@forensic.internal",
        badge_number="INV-DEMO",
        is_authenticated=True
    )
