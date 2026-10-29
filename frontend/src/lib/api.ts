import { 
  FacialTraits, 
  WitnessAnalysisResult, 
  CompositeRevision, 
  CaseStudy 
} from '../types';
import { supabase } from './supabase';

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || '';
export const API_BASE_URL = rawBaseUrl.endsWith('/') 
  ? rawBaseUrl.slice(0, -1) 
  : (rawBaseUrl || 'http://localhost:8000');

export const resolveImageUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

async function getAuthHeaders(): Promise<HeadersInit> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  try {
    const { data } = await supabase.auth.getSession();
    const session = data?.session;
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  } catch (err) {
    console.debug('No active supabase session attached');
  }
  return headers;
}

export const api = {
  async getHealth() {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error('Backend health check failed');
    return res.json();
  },

  async analyzeWitnessStatement(witness_statement: string, case_context?: string): Promise<WitnessAnalysisResult> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/forensic/analyze`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ witness_statement, case_context }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Analysis failed' }));
      throw new Error(err.detail || 'Witness statement analysis failed');
    }
    return res.json();
  },

  async generateComposite(payload: {
    traits: FacialTraits;
    custom_prompt_enhancements?: string;
    witness_notes?: string;
    case_id?: string;
  }): Promise<CompositeRevision> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/forensic/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Composite generation failed' }));
      throw new Error(err.detail || 'Failed to generate facial composite');
    }
    return res.json();
  },

  async refineComposite(payload: {
    previous_image_url: string;
    current_traits: FacialTraits;
    correction_feedback: string;
    case_id?: string;
    revision_number: number;
  }): Promise<CompositeRevision> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/forensic/refine`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Refinement failed' }));
      throw new Error(err.detail || 'Correction refinement failed');
    }
    return res.json();
  },

  async getCases(status?: string): Promise<CaseStudy[]> {
    const headers = await getAuthHeaders();
    const url = status && status !== 'All' 
      ? `${API_BASE_URL}/api/cases?status=${encodeURIComponent(status)}`
      : `${API_BASE_URL}/api/cases`;
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error('Failed to load forensic cases');
    }
    return res.json();
  },

  async getCaseById(caseId: string): Promise<CaseStudy> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/cases/${caseId}`, { headers });
    if (!res.ok) {
      throw new Error('Failed to load case dossier');
    }
    return res.json();
  },

  async createCase(caseData: Partial<CaseStudy> & {
    primary_composite_url?: string;
    initial_traits?: FacialTraits;
    witness_statement?: string;
  }): Promise<CaseStudy> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/cases`, {
      method: 'POST',
      headers,
      body: JSON.stringify(caseData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Case creation failed' }));
      throw new Error(err.detail || 'Failed to register case');
    }
    return res.json();
  },

  async updateCase(caseId: string, updates: Partial<CaseStudy>): Promise<CaseStudy> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/api/cases/${caseId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Case update failed' }));
      throw new Error(err.detail || 'Failed to update case dossier');
    }
    return res.json();
  }
};
