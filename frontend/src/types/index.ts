export interface UserProfile {
  id: string;
  email: string;
  badgeNumber?: string;
  agency?: string;
  role?: string;
}

export interface FacialTraits {
  gender?: string;
  age_range?: string;
  face_shape?: string;
  forehead?: string;
  eyebrows?: string;
  eyes?: string;
  nose?: string;
  lips_and_mouth?: string;
  jawline?: string;
  chin?: string;
  hair?: string;
  facial_hair?: string;
  skin_tone_texture?: string;
  distinctive_features?: string[];
  uncertain_traits?: string[];
  contradictions?: string[];
  confidence_score?: number;
}

export interface WitnessAnalysisResult {
  raw_statement: string;
  traits: FacialTraits;
  forensic_summary: string;
  synthesis_prompt: string;
  uncertain_traits?: string[];
  contradictions?: string[];
}

export interface CompositeRevision {
  id?: string;
  case_id?: string;
  image_url: string;
  image_base64?: string;
  revision_number: number;
  extracted_traits: FacialTraits;
  traits?: FacialTraits;
  witness_notes?: string;
  correction_instruction?: string;
  correction_prompt?: string;
  prompt_used?: string;
  storage_path?: string;
  created_at?: string;
}

export interface CaseStudy {
  id: string;
  case_number: string;
  title: string;
  incident_type: string;
  incident_date?: string;
  location?: string;
  summary?: string;
  status: 'Active Investigation' | 'Solved' | 'Cold Case' | string;
  primary_composite_url?: string;
  initial_traits?: FacialTraits;
  witness_statement?: string;
  created_at?: string;
  composites?: CompositeRevision[];
}
