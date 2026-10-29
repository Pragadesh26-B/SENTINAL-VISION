import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  KeyRound, 
  Mail, 
  BadgeCheck, 
  Lock, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle,
  Fingerprint,
  Cpu,
  Radio,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [agency, setAgency] = useState('Metro Forensic Division');
  const [clearanceRole, setClearanceRole] = useState('Lead Forensic Examiner');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signIn, signUp, signInDemoInvestigator, user, isConfigured } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      if (isRegister) {
        const res = await signUp(email, password, badgeNumber);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg('Investigator identity credential initialized. You are now logged in.');
          setTimeout(() => navigate('/'), 1000);
        }
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          setSuccessMsg('Biometric authentication confirmed. Clearance granted.');
          setTimeout(() => navigate('/'), 700);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication sequence failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoSignIn = () => {
    signInDemoInvestigator();
    setSuccessMsg('Forensic Field Investigator demo credentials active.');
    setTimeout(() => navigate('/'), 600);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] forensic-grid flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg">
        
        {/* Terminal Header Card */}
        <div className="forensic-glass rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.85)] border border-cyan-500/30 corner-bracket">
          
          {/* Top Terminal Status Bar */}
          <div className="bg-[#07090f] border-b border-[#1b2336] px-6 py-3.5 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2.5">
              <Terminal className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-slate-200 tracking-wider font-bold">
                SECURE AUTH GATEWAY // TERMINAL 01
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-400' : 'bg-cyan-400 cyan-pulse-indicator'}`} />
              <span className="text-[10px] text-slate-400">
                {isConfigured ? 'SUPABASE_LIVE' : 'DEMO_STANDALONE'}
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            
            {/* Biometric Hologram Badge Graphic */}
            <div className="text-center mb-6">
              <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#101729] to-[#080b14] border border-cyan-500/40 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                <Fingerprint className="w-9 h-9 text-[#00f0ff]" />
                <div className="absolute inset-0 rounded-2xl border border-cyan-400/30 border-t-transparent animate-radar pointer-events-none" />
              </div>
              
              <h1 className="text-2xl font-heading font-extrabold text-white tracking-wide">
                {isRegister ? 'REGISTER INVESTIGATOR DOSSIER' : 'INVESTIGATOR AUTHENTICATION'}
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1 max-w-sm mx-auto">
                Authorized law enforcement clearance required to access the central biometric facial composite archives.
              </p>
            </div>

            {/* Notification messages */}
            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/50 border border-red-500/60 flex items-start space-x-2.5 text-xs text-red-200 font-mono">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/60 flex items-start space-x-2.5 text-xs text-emerald-200 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#06080e] rounded-xl border border-[#1b2336] mb-6">
              <button
                type="button"
                onClick={() => { setIsRegister(false); setErrorMsg(''); }}
                className={`py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                  !isRegister
                    ? 'bg-gradient-to-r from-cyan-950 to-slate-900 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ACCESS TERMINAL
              </button>
              <button
                type="button"
                onClick={() => { setIsRegister(true); setErrorMsg(''); }}
                className={`py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                  isRegister
                    ? 'bg-gradient-to-r from-cyan-950 to-slate-900 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                CREATE DOSSIER
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
                  Investigator Official Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="w-4 h-4 text-cyan-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="agent.surname@forensic.gov"
                    className="w-full bg-[#07090f] border border-[#1b2336] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl py-2.5 pl-10 pr-3 text-xs font-mono text-white placeholder-slate-600 outline-none transition-all"
                  />
                </div>
              </div>

              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
                      Badge / Shield ID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                        <BadgeCheck className="w-4 h-4 text-cyan-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={badgeNumber}
                        onChange={(e) => setBadgeNumber(e.target.value)}
                        placeholder="INV-9824"
                        className="w-full bg-[#07090f] border border-[#1b2336] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl py-2.5 pl-10 pr-3 text-xs font-mono text-white placeholder-slate-600 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
                      Forensic Agency & Jurisdiction
                    </label>
                    <input
                      type="text"
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                      className="w-full bg-[#07090f] border border-[#1b2336] focus:border-cyan-400 rounded-xl py-2.5 px-3 text-xs font-mono text-white placeholder-slate-600 outline-none"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase tracking-wider">
                  Biometric Passcode / Security Token
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#07090f] border border-[#1b2336] focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 rounded-xl py-2.5 pl-10 pr-3 text-xs font-mono text-white placeholder-slate-600 outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-300 to-sky-400 hover:from-cyan-300 hover:to-sky-300 text-slate-950 font-heading font-extrabold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(0,240,255,0.3)] disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4 text-slate-950" />
                <span>
                  {submitting 
                    ? 'VERIFYING CREDENTIALS...' 
                    : isRegister ? 'INITIALIZE CREDENTIAL DOSSIER' : 'AUTHENTICATE FORENSIC CLEARANCE'}
                </span>
              </button>
            </form>

            {/* Quick Demo Bypass for Instant Access */}
            <div className="mt-6 pt-5 border-t border-[#182133]">
              <button
                type="button"
                onClick={handleDemoSignIn}
                className="w-full py-3 px-3 rounded-xl bg-[#0f1524] hover:bg-[#151e33] border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-bold transition-all flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(0,240,255,0.1)]"
              >
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>INSTANT INVESTIGATOR DEMO ACCESS (ONE-CLICK)</span>
              </button>
              <p className="text-[10px] text-center font-mono text-slate-500 mt-2">
                Bypass external authentication to immediately access and test all forensic reconstruction tools.
              </p>
            </div>

          </div>
        </div>

        {/* Current status footer if already logged in */}
        {user && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#090d18] border border-cyan-500/30 text-center text-xs font-mono text-cyan-300 flex items-center justify-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Active Investigator Session: <strong className="text-white">{user.email}</strong> [{user.badgeNumber || 'INV-LEAD'}]</span>
          </div>
        )}

      </div>
    </div>
  );
};
