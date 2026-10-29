import os
import uuid
import logging
from typing import Optional, List, Dict, Any, Tuple
from app.config import settings

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        self.url = settings.SUPABASE_URL or os.environ.get("SUPABASE_URL", "")
        self.key = settings.SUPABASE_SERVICE_ROLE_KEY or os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
        self.bucket = settings.STORAGE_BUCKET_NAME
        self.client = None

        if self.url and self.key:
            try:
                from supabase import create_client, Client
                self.client: Client = create_client(self.url, self.key)
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")

    def is_configured(self) -> bool:
        return bool(self.client and self.url and self.key)

    def upload_sketch_image(self, image_bytes: bytes, filename: Optional[str] = None) -> Tuple[str, str]:
        """
        Uploads composite image bytes to Supabase Storage bucket 'crimeface-sketches'.
        If Supabase is not configured, saves to local public storage directory as a working fallback.
        """
        if not filename:
            filename = f"composite_{uuid.uuid4().hex[:10]}.jpg"

        storage_path = f"composites/{filename}"

        if self.is_configured():
            try:
                # Ensure bucket exists
                try:
                    self.client.storage.get_bucket(self.bucket)
                except Exception:
                    try:
                        self.client.storage.create_bucket(self.bucket, options={"public": True})
                    except Exception as b_err:
                        logger.warning(f"Bucket check/create: {b_err}")

                # Upload file
                res = self.client.storage.from_(self.bucket).upload(
                    path=storage_path,
                    file=image_bytes,
                    file_options={"content-type": "image/jpeg", "upsert": "true"}
                )

                # Get public url
                public_url = self.client.storage.from_(self.bucket).get_public_url(storage_path)
                return public_url, storage_path
            except Exception as e:
                logger.error(f"Supabase storage upload failed: {e}. Falling back to local storage.")

        # Local fallback storage
        local_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "composites")
        os.makedirs(local_dir, exist_ok=True)
        local_file_path = os.path.join(local_dir, filename)
        with open(local_file_path, "wb") as f:
            f.write(image_bytes)

        local_url = f"/static/composites/{filename}"
        return local_url, storage_path

    # Case Management
    def get_cases(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        if self.is_configured():
            try:
                query = self.client.table("cases").select("*, suspect_composites(*)").order("created_at", desc=True)
                if status and status != "All":
                    query = query.eq("status", status)
                res = query.execute()
                return res.data or []
            except Exception as e:
                logger.error(f"Error fetching cases from Supabase: {e}")

        # In-memory / file fallback store for initial test or offline mode
        return self._get_fallback_cases(status)

    def get_case_by_id(self, case_id: str) -> Optional[Dict[str, Any]]:
        if self.is_configured():
            try:
                res = self.client.table("cases").select("*, suspect_composites(*)").eq("id", case_id).single().execute()
                return res.data
            except Exception as e:
                logger.error(f"Error fetching case {case_id}: {e}")

        for c in self._get_fallback_cases():
            if c.get("id") == case_id:
                return c
        return None

    def create_case(self, case_data: Dict[str, Any]) -> Dict[str, Any]:
        if self.is_configured():
            try:
                res = self.client.table("cases").insert(case_data).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                logger.error(f"Error creating case in Supabase: {e}")

        case_data["id"] = case_data.get("id") or str(uuid.uuid4())
        FALLBACK_CASES.insert(0, case_data)
        return case_data

    def update_case(self, case_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if self.is_configured():
            try:
                res = self.client.table("cases").update(updates).eq("id", case_id).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                logger.error(f"Error updating case {case_id} in Supabase: {e}")

        # Fallback in-memory update
        for c in FALLBACK_CASES:
            if c.get("id") == case_id:
                c.update(updates)
                return c
        return None

    def record_composite(self, record_data: Dict[str, Any]) -> Dict[str, Any]:
        if self.is_configured():
            try:
                res = self.client.table("suspect_composites").insert(record_data).execute()
                if res.data:
                    return res.data[0]
            except Exception as e:
                logger.error(f"Error inserting composite record: {e}")

        record_data["id"] = record_data.get("id") or str(uuid.uuid4())
        if record_data.get("case_id"):
            for c in FALLBACK_CASES:
                if c.get("id") == record_data["case_id"]:
                    c.setdefault("composites", []).append(record_data)
        return record_data

    def _get_fallback_cases(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        if not status or status == "All":
            return FALLBACK_CASES
        return [c for c in FALLBACK_CASES if c.get("status") == status]


Tuple_Url = tuple[str, str]

# Initial realistic case studies representing solved and active forensic investigations
FALLBACK_CASES: List[Dict[str, Any]] = [
    {
        "id": "c1f88764-2824-4d2a-88fa-038e93234a91",
        "case_number": "CF-2026-0814",
        "title": "Neon District Armored Transport Intercept",
        "incident_type": "Armed Robbery",
        "incident_date": "2026-10-18",
        "location": "Metro Transit Vault, Sector 4",
        "summary": "Suspect intercepted cash transit van using electronic EMP pulse. Eyewitness described a tall male in his late 30s with a distinctive horizontal facial scar running across his right eyebrow and piercing pale blue eyes.",
        "status": "Active Investigation",
        "primary_composite_url": "/static/composites/male_30s_sharp_jaw_blue_eyes_scar_v1.jpg",
        "created_at": "2026-10-19T08:30:00Z",
        "composites": [
            {
                "id": "comp-01",
                "revision_number": 1,
                "image_url": "/static/composites/male_30s_sharp_jaw_blue_eyes_scar_v1.jpg",
                "extracted_traits": {
                    "gender": "Male",
                    "age_range": "32-36",
                    "face_shape": "Angular Rectangular",
                    "jawline": "Chiseled, sharp square jawline",
                    "eyes": "Pale blue, deep-set with heavy brow",
                    "distinctive_features": ["Thin diagonal scar through right eyebrow", "Chin stubble"]
                },
                "witness_notes": "First generation composite based on guard's perimeter testimony."
            },
            {
                "id": "comp-01-rev2",
                "revision_number": 2,
                "image_url": "/static/composites/male_30s_sharp_jaw_blue_eyes_scar_v2.jpg",
                "extracted_traits": {
                    "gender": "Male",
                    "age_range": "32-36",
                    "face_shape": "Angular Rectangular",
                    "jawline": "Chiseled, sharp square jawline",
                    "eyes": "Pale blue, deep-set with heavy brow",
                    "distinctive_features": ["Thin diagonal scar through right eyebrow", "Clean shaved chin"]
                },
                "witness_notes": "Revision 2 applied correction: Clean shave chin, slightly broader nasal bridge."
            }
        ]
    },
    {
        "id": "c2a99112-9134-4b4f-9e12-881249fa0021",
        "case_number": "CF-2026-0492",
        "title": "Quantum Lab Cyber-Infiltration",
        "incident_type": "Corporate Espionage",
        "incident_date": "2026-09-02",
        "location": "Aether Dynamics Core Facility",
        "summary": "Female intruder gained physical server room entry using cloned biometric credentials. Witness described high cheekbones, dark hair tied in ponytail, and distinct birthmark below right eye.",
        "status": "Solved",
        "primary_composite_url": "/static/composites/female_30s_heart_face_mole_v1.jpg",
        "created_at": "2026-09-03T14:15:00Z",
        "composites": [
            {
                "id": "comp-02",
                "revision_number": 1,
                "image_url": "/static/composites/female_30s_heart_face_mole_v1.jpg",
                "extracted_traits": {
                    "gender": "Female",
                    "age_range": "28-32",
                    "face_shape": "Heart-shaped",
                    "jawline": "Tapered chin, prominent cheekbones",
                    "eyes": "Hazel, almond-shaped",
                    "hair": "Jet black hair in ponytail",
                    "distinctive_features": ["Small beauty mark / mole below right eye"]
                },
                "witness_notes": "Revision matched surveillance footage at 96.4% biometric confidence. Suspect apprehended."
            }
        ]
    },
    {
        "id": "c3e44510-1883-4a11-b112-990141bb7741",
        "case_number": "CF-2025-1108",
        "title": "Harbor Warehouse Smuggling Syndicate",
        "incident_type": "Extortion & Contraband",
        "incident_date": "2025-11-20",
        "location": "Pier 19 Dockside Terminal",
        "summary": "Suspect operated as primary logistics broker. Unidentified male in late 40s to 50s, weathered skin texture, heavy brow ridge, and prominent broken nose with thick greying goatee.",
        "status": "Cold Case",
        "primary_composite_url": "/static/composites/male_50s_weathered_broken_nose_goatee.jpg",
        "created_at": "2025-11-22T19:00:00Z",
        "composites": [
            {
                "id": "comp-03",
                "revision_number": 1,
                "image_url": "/static/composites/male_50s_weathered_broken_nose_goatee.jpg",
                "extracted_traits": {
                    "gender": "Male",
                    "age_range": "48-54",
                    "face_shape": "Broad Square weathered",
                    "nose": "Prominent bridge, healed fracture deviation",
                    "hair": "Salt and pepper wavy hair with trimmed goatee"
                },
                "witness_notes": "Compiled from harbor guard's late night observation under sodium vapor light."
            }
        ]
    }
]

supabase_service = SupabaseService()
