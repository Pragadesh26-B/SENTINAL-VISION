import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Fingerprint, FolderArchive, UserCheck, LogOut, Radio, Activity, Menu, X, Cpu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toTimeString().split(' ')[0] + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#06070a]/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      
      {/* Top Tactical Telemetry Bar */}
      <div className="bg-[#030406] border-b border-[#121622] px-4 sm:px-6 lg:px-8 py-1 hidden sm:flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 text-cyan-400">
            <Radio className="w-3 h-3 text-[#00f0ff] animate-pulse" />
            <span className="font-semibold tracking-wider">SEC-LINK: ONLINE</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center space-x-1 text-slate-300">
            <Cpu className="w-3 h-3 text-cyan-500" />
            <span>CORE: <span className="text-cyan-300">GEMINI 2.5 FLASH</span></span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">SYS_CLOCK: <span className="text-slate-200">{currentTime}</span></span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-slate-500">CLEARANCE:</span>
          <span className="px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-[9px] font-bold">
            {user ? 'LEVEL-4 FIELD INVESTIGATOR' : 'PUBLIC EVIDENCE TERMINAL'}
          </span>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Agency Logo */}
        <NavLink to="/" className="flex items-center space-x-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#0e1424] to-[#080a10] border border-cyan-500/40 flex items-center justify-center group-hover:border-[#00f0ff] transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Fingerprint className="w-6 h-6 text-[#00f0ff] group-hover:scale-105 transition-transform" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#00f0ff] cyan-pulse-indicator" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-heading font-extrabold text-xl tracking-wider text-white">CRIMEFACE</span>
              <span className="text-[#00f0ff] text-[10px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                AI BIO-STUDIO
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight flex items-center gap-1 -mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>FORENSIC FACIAL RECONSTRUCTION</span>
            </p>
          </div>
        </NavLink>

        {/* Desktop 3 App Pages Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/70 to-slate-900/80 text-[#00f0ff] border border-[#00f0ff]/50 shadow-[0_0_15px_rgba(0,240,255,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e1320] border border-transparent'
              }`
            }
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>1. WITNESS STUDIO</span>
          </NavLink>

          <NavLink
            to="/cases"
            className={({ isActive }) =>
              `relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/70 to-slate-900/80 text-[#00f0ff] border border-[#00f0ff]/50 shadow-[0_0_15px_rgba(0,240,255,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e1320] border border-transparent'
              }`
            }
          >
            <FolderArchive className="w-4 h-4 text-cyan-400" />
            <span>2. CASE STUDIES</span>
          </NavLink>

          <NavLink
            to="/auth"
            className={({ isActive }) =>
              `relative flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/70 to-slate-900/80 text-[#00f0ff] border border-[#00f0ff]/50 shadow-[0_0_15px_rgba(0,240,255,0.2)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0e1320] border border-transparent'
              }`
            }
          >
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>3. INVESTIGATOR AUTH</span>
          </NavLink>
        </nav>

        {/* User Identity / Logout */}
        <div className="hidden sm:flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3 bg-[#0c101a] border border-[#1b2336] px-3 py-1.5 rounded-lg">
              <div className="flex flex-col text-right">
                <span className="text-xs font-mono text-cyan-300 font-bold tracking-wider">
                  {user.badgeNumber || 'BADGE #719-X'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                  {user.email}
                </span>
              </div>
              <button
                onClick={signOut}
                title="Disconnect forensic terminal session"
                className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <NavLink
              to="/auth"
              className="flex items-center space-x-2 text-xs font-mono text-cyan-300 hover:text-white border border-cyan-500/40 hover:border-cyan-400 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 shadow-[0_0_10px_rgba(0,240,255,0.15)] transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>TERMINAL ACCESS</span>
            </NavLink>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-[#0f1422] border border-[#1d263b]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#07090e] border-b border-cyan-500/20 px-4 pt-2 pb-4 space-y-2 font-mono text-xs">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-3 py-2 rounded-md ${
                isActive ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40' : 'text-slate-300 hover:bg-[#121622]'
              }`
            }
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>1. WITNESS STUDIO</span>
          </NavLink>
          <NavLink
            to="/cases"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-3 py-2 rounded-md ${
                isActive ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40' : 'text-slate-300 hover:bg-[#121622]'
              }`
            }
          >
            <FolderArchive className="w-4 h-4 text-cyan-400" />
            <span>2. CASE STUDIES</span>
          </NavLink>
          <NavLink
            to="/auth"
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center space-x-2 px-3 py-2 rounded-md ${
                isActive ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/40' : 'text-slate-300 hover:bg-[#121622]'
              }`
            }
          >
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>3. INVESTIGATOR AUTH</span>
          </NavLink>
        </div>
      )}
    </header>
  );
};
