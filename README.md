<<<<<<< HEAD
# CRIMEFACE AI - Forensic Biometric Reconstruction System

CRIMEFACE AI is a full-stack forensic application designed to transform verbal eyewitness descriptions into photorealistic facial composites using Google Gemini 2.5 Flash and iteratively refine them with witness feedback.

---

## 🏛️ System Architecture

```text
crimeface-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── deps.py               # Supabase JWT & Session dependency
│   │   │   └── routes/
│   │   │       ├── forensic.py       # Witness analysis & AI composite generation
│   │   │       └── cases.py          # Investigation archives & dossiers
│   │   ├── schemas/                  # Pydantic schemas (traits, cases, composites)
│   │   ├── services/
│   │   │   ├── gemini_service.py     # Gemini 2.5 Flash + Image synthesis
│   │   │   └── supabase_service.py   # Supabase DB & Storage manager
│   │   ├── config.py                 # Pydantic settings & environment validation
│   │   └── main.py                   # FastAPI server entrypoint
│   ├── schema.sql                    # Supabase SQL table migrations & storage policies
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/common/Navbar.tsx
    │   ├── context/AuthContext.tsx   # Supabase Auth with investigator session
    │   ├── lib/
    │   │   ├── api.ts                # API client connected to FastAPI
    │   │   └── supabase.ts           # Supabase client initializer
    │   ├── pages/
    │   │   ├── AuthPage.tsx          # 1. Login / Registration
    │   │   ├── ForensicStudioPage.tsx# 2. Witness Description + AI Generation + Correction
    │   │   └── CaseStudiesPage.tsx   # 3. Case Studies & Forensic Archives
    │   ├── types/index.ts
    │   ├── App.tsx
    │   └── index.css                 # Dark forensic theme with electric cyan accents
    ├── package.json
    └── vite.config.ts
```

---

## 🚀 The Three Application Pages

1. **Investigator Authentication (`/auth`)**:
   - Secure Supabase Auth login and registration.
   - Badge number and agency designation verification.
   - Instant Demo Bypass for offline or immediate testing.

2. **Witness Studio (`/`)**:
   - Eyewitness narrative input with preset crime scenarios.
   - **Gemini 2.5 Flash** text analysis extracting anatomical biometric traits (jawline, ocular spacing, nose, scars).
   - Photorealistic facial composite synthesis.
   - Real-time **Witness Correction Loop** (revise jaw, age, hair, marks).
   - Direct persistence into Case Studies archives.

3. **Case Studies (`/cases`)**:
   - Classified forensic archives with status filters (`Active Investigation`, `Solved`, `Cold Case`).
   - High-resolution composite preview with biometric reticles.
   - Interactive Dossier Inspector with historical revision timelines.

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)
```env
PORT=8000
CORS_ORIGINS=["http://localhost:5173"]

# Google Gemini API Key (Get from https://aistudio.google.com/)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
GEMINI_IMAGE_MODEL=imagen-3.0-generate-002

# Supabase Credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
STORAGE_BUCKET_NAME=crimeface-sketches
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🛠️ How to Run

### 1. Start the Backend
```bash
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```
API Documentation will be accessible at: `http://localhost:8000/docs`

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```
Frontend interface will be accessible at: `http://localhost:5173`
=======
# SENTINAL-VISION
>>>>>>> 25a0842cd076230643e64a98cc29a06b39f07328
