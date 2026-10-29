import React, { useState, useEffect } from 'react';
import { 
  FolderArchive, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  FileText, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  ExternalLink, 
  X,
  Layers,
  ChevronRight,
  ShieldCheck,
  Download,
  Sliders,
  Check,
  User,
  Activity,
  Printer,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../lib/api';
import { CaseStudy } from '../types';
import { Link } from 'react-router-dom';

const resolveImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`;
};

export const CaseStudiesPage: React.FC = () => {
  const [cases, setCases] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseStudy | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [modalActiveImageUrl, setModalActiveImageUrl] = useState<string>('');

  useEffect(() => {
    loadCases();
  }, [statusFilter]);

  useEffect(() => {
    if (selectedCase) {
      setModalActiveImageUrl(selectedCase.primary_composite_url || '');
    }
  }, [selectedCase]);

  const loadCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCases(statusFilter);
      setCases(data);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve case studies');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCaseStatus = async (newStatus: string) => {
    if (!selectedCase) return;
    setUpdatingStatus(true);
    try {
      const updated = await api.updateCase(selectedCase.id, { status: newStatus });
      setSelectedCase(updated);
      setCases(prev => prev.map(c => c.id === updated.id ? updated : c));
    } catch (err: any) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDownloadModalComposite = async () => {
    if (!modalActiveImageUrl) return;
    const downloadFilename = `${selectedCase?.case_number || 'CrimeFace'}_Composite.jpg`;
    const resolved = resolveImageUrl(modalActiveImageUrl);

    try {
      const res = await fetch(resolved);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      const link = document.createElement('a');
      link.href = resolved;
      link.download = downloadFilename;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrintDossier = () => {
    window.print();
  };

  const filteredCases = cases.filter(c => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.case_number.toLowerCase().includes(q) ||
      c.incident_type.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q))
    );
  });

  const activeCount = cases.filter(c => c.status === 'Active Investigation').length;
  const solvedCount = cases.filter(c => c.status === 'Solved').length;
  const coldCount = cases.filter(c => c.status === 'Cold Case').length;

  return (
    <div className="min-h-[calc(100vh-5rem)] p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Classified Evidence Header Ribbon */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0a0e1a] via-[#0f1424] to-[#070a12] border border-cyan-500/30 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.8)] corner-bracket">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 cyan-pulse-indicator" />
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest">
                ARCHIVE INDEX // REPOSITORY 03
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-white tracking-wide mt-1">
              FORENSIC CASE STUDIES & CRIMINAL DOSSIERS
            </h1>
            
            <p className="text-xs text-slate-400 font-mono mt-1 max-w-2xl">
              Central criminal intelligence archives preserving AI-synthesized facial composites, eyewitness depositions, and anatomical profiles across criminal investigations.
            </p>
          </div>

          {/* Quick Stats telemetry */}
          <div className="flex items-center space-x-3 bg-[#06080e]/90 border border-[#1b2336] p-2.5 rounded-xl text-center">
            <div className="px-3 border-r border-[#1b2336]">
              <span className="block text-lg font-heading font-extrabold text-cyan-300">{cases.length}</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">TOTAL</span>
            </div>
            <div className="px-3 border-r border-[#1b2336]">
              <span className="block text-lg font-heading font-extrabold text-amber-400">{activeCount}</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">ACTIVE</span>
            </div>
            <div className="px-3">
              <span className="block text-lg font-heading font-extrabold text-emerald-400">{solvedCount}</span>
              <span className="text-[9px] font-mono text-slate-500 uppercase">SOLVED</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-5 pt-4 border-t border-[#182033] flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Status Filter Badges */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {['All', 'Active Investigation', 'Solved', 'Cold Case'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all active:scale-95 ${
                  statusFilter === status
                    ? 'bg-cyan-950/90 text-[#00f0ff] border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)] font-bold'
                    : 'bg-[#0f1422] hover:bg-[#151c2e] text-slate-400 border border-[#1b2336]'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box with Clear Button */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case ID, suspect, offense..."
              className="w-full bg-[#080b13] border border-[#1c2438] focus:border-cyan-400 rounded-lg py-1.5 pl-9 pr-8 text-xs font-mono text-white placeholder-slate-600 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-xs font-mono text-red-200 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadCases} className="px-2 py-1 bg-red-900/60 rounded text-[11px] underline">Retry</button>
        </div>
      )}

      {/* Cases Cards Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-cyan-300 tracking-wider">
            QUERYING CLASSIFIED FORENSIC DOSSIERS...
          </p>
        </div>
      ) : filteredCases.length === 0 ? (
        <div className="forensic-glass rounded-2xl p-16 text-center space-y-4 border border-dashed border-[#1c2438]">
          <FolderArchive className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-mono text-slate-300 font-bold">No Case Studies Found</h3>
          <p className="text-xs font-mono text-slate-500 max-w-sm mx-auto">
            {statusFilter !== 'All' 
              ? `No cases match status filter '${statusFilter}'.` 
              : 'No investigation records logged yet in this filter view.'}
          </p>
          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>RECONSTRUCT NEW SUSPECT IN STUDIO</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCases.map((caseItem) => (
            <div
              key={caseItem.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedCase(caseItem)}
              onKeyDown={(e) => { if (e.key === 'Enter') setSelectedCase(caseItem); }}
              className="forensic-glass rounded-2xl overflow-hidden border border-[#1b2336] hover:border-cyan-500/50 shadow-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.15)] transition-all duration-300 cursor-pointer flex flex-col group text-left"
            >
              {/* Composite Image Header */}
              <div className="relative aspect-[4/3] bg-[#030407] overflow-hidden">
                {caseItem.primary_composite_url ? (
                  <img
                    src={resolveImageUrl(caseItem.primary_composite_url)}
                    alt={caseItem.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-xs">
                    No Composite Recorded
                  </div>
                )}
                
                {/* Scanline filter */}
                <div className="absolute inset-0 pointer-events-none scanline opacity-30" />

                {/* Status Pill */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${
                      caseItem.status === 'Solved'
                        ? 'bg-emerald-950/90 border border-emerald-500/60 text-emerald-300'
                        : caseItem.status === 'Active Investigation'
                        ? 'bg-cyan-950/90 border border-cyan-500/60 text-cyan-300'
                        : 'bg-amber-950/90 border border-amber-500/60 text-amber-300'
                    }`}
                  >
                    {caseItem.status}
                  </span>
                </div>

                {/* Case Number Badge */}
                <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md border border-cyan-500/30 px-2.5 py-0.5 rounded text-[10px] font-mono text-cyan-300 font-bold">
                  {caseItem.case_number}
                </div>
              </div>

              {/* Case Body Metadata */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-1.5">
                    <span className="font-bold">{caseItem.incident_type}</span>
                    <span className="text-slate-500 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{caseItem.incident_date || 'Classified'}</span>
                    </span>
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {caseItem.title}
                  </h3>

                  {caseItem.location && (
                    <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 mt-1">
                      <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                      <span className="truncate">{caseItem.location}</span>
                    </div>
                  )}

                  {caseItem.summary && (
                    <p className="text-xs font-mono text-slate-400 mt-2.5 line-clamp-2 leading-relaxed bg-[#06080e]/60 p-2.5 rounded-lg border border-[#161d2d]">
                      "{caseItem.summary}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-[#182133] flex items-center justify-between text-xs font-mono text-cyan-400 group-hover:text-cyan-300">
                  <span className="font-bold">OPEN CLASSIFIED DOSSIER</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Case Dossier Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#080b13] border border-cyan-500/40 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl corner-bracket">
            
            {/* Modal Header Bar */}
            <div className="p-5 sm:p-6 border-b border-[#1b2336] flex items-center justify-between sticky top-0 bg-[#080b13]/95 backdrop-blur-md z-10">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    CLASSIFIED CASE DOSSIER // {selectedCase.case_number}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300">
                    RESTRICTED
                  </span>
                </div>
                <h2 className="text-xl font-heading font-extrabold text-white mt-1">
                  {selectedCase.title}
                </h2>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handlePrintDossier}
                  title="Print dossier report"
                  className="p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-[#131a2b] border border-[#1b2438] transition-all"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#131a2b] border border-[#1b2438] transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                
                {/* Left: Composite Image Canvas */}
                <div className="space-y-3">
                  <div className="relative aspect-square rounded-2xl bg-black overflow-hidden border border-cyan-500/30 shadow-lg">
                    {modalActiveImageUrl ? (
                      <img
                        src={resolveImageUrl(modalActiveImageUrl)}
                        alt={selectedCase.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-500 font-mono text-xs">
                        No Image Recorded
                      </div>
                    )}
                    <div className="absolute inset-0 pointer-events-none scanline opacity-35" />
                    
                    {/* Watermark Tag */}
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-cyan-500/40 px-2.5 py-1 rounded text-[10px] font-mono text-cyan-300 font-bold">
                      PRIMARY SUSPECT COMPOSITE
                    </div>
                  </div>

                  {/* Export Composite Button */}
                  <button
                    type="button"
                    onClick={handleDownloadModalComposite}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#101626] hover:bg-[#17223b] text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 font-mono text-xs font-bold transition-all flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>EXPORT COMPOSITE PORTRAIT</span>
                  </button>
                </div>

                {/* Right: Case Parameters & Status Management */}
                <div className="space-y-4">
                  
                  {/* Status switcher */}
                  <div className="bg-[#0b0f1a] p-3.5 rounded-xl border border-[#1c253a]">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
                      Investigation Status (Update Clearance):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Active Investigation', 'Solved', 'Cold Case'].map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleUpdateCaseStatus(st)}
                          disabled={updatingStatus}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all active:scale-95 ${
                            selectedCase.status === st
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                              : 'bg-[#101524] text-slate-400 hover:text-white border border-[#1e273e]'
                          }`}
                        >
                          {selectedCase.status === st ? `✓ ${st}` : st}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="bg-[#0b0f1a] p-3 rounded-xl border border-[#1c253a]">
                      <span className="text-[10px] text-slate-500 block uppercase">Incident Classification</span>
                      <span className="text-white font-bold">{selectedCase.incident_type}</span>
                    </div>

                    <div className="bg-[#0b0f1a] p-3 rounded-xl border border-[#1c253a]">
                      <span className="text-[10px] text-slate-500 block uppercase">Sector / Location</span>
                      <span className="text-white font-bold">{selectedCase.location || 'Metro Sector'}</span>
                    </div>
                  </div>

                  {/* Summary & Statement */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                      Eyewitness Deposition Transcript:
                    </span>
                    <p className="text-xs font-mono text-slate-300 leading-relaxed bg-[#06080e] p-3.5 rounded-xl border border-[#172033] max-h-48 overflow-y-auto">
                      "{selectedCase.witness_statement || selectedCase.summary || 'No testimony recorded.'}"
                    </p>
                  </div>

                </div>
              </div>

              {/* Anatomical Traits Breakdown if attached */}
              {selectedCase.initial_traits && (
                <div className="border-t border-[#182133] pt-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center space-x-2">
                    <Sliders className="w-4 h-4" />
                    <span>Cataloged Anatomical Parameters</span>
                  </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                    {Object.entries(selectedCase.initial_traits)
                      .filter(([key, val]) => typeof val === 'string' && val.toLowerCase() !== 'unknown')
                      .map(([key, val]) => (
                        <div key={key} className="bg-[#0b0f1a] p-2 rounded-lg border border-[#1a2338]">
                          <span className="text-slate-500 block text-[9px] uppercase">{key.replace(/_/g, ' ')}</span>
                          <span className="text-cyan-200 font-semibold truncate block">{String(val)}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Revision History if available */}
              {selectedCase.composites && selectedCase.composites.length > 0 && (
                <div className="border-t border-[#182133] pt-4">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Facial Composite Revision Log ({selectedCase.composites.length}) - Click to preview</span>
                  </h4>

                  <div className="space-y-2.5">
                    {selectedCase.composites.map((comp, idx) => {
                      const isViewingThis = modalActiveImageUrl === comp.image_url;
                      return (
                        <div
                          key={idx}
                          role="button"
                          tabIndex={0}
                          onClick={() => setModalActiveImageUrl(comp.image_url)}
                          className={`p-3 rounded-xl flex items-center space-x-3 text-xs font-mono cursor-pointer transition-all ${
                            isViewingThis
                              ? 'bg-cyan-950/70 border border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                              : 'bg-[#0b0f1a] border border-[#1b2438] hover:border-cyan-500/40'
                          }`}
                        >
                          <img
                            src={resolveImageUrl(comp.image_url)}
                            alt={`Revision ${comp.revision_number}`}
                            className="w-12 h-12 rounded-lg object-cover border border-[#20293d] shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-cyan-300 font-bold">Revision #{comp.revision_number}</span>
                              <span className="text-[10px] text-slate-500">{comp.created_at || 'Archived'}</span>
                            </div>
                            {comp.witness_notes && (
                              <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                Note: "{comp.witness_notes}"
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default CaseStudiesPage;
