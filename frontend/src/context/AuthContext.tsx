import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signIn: (email: string, pass: string) => Promise<{ error?: string }>;
  signUp: (email: string, pass: string, badgeNumber?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  signInDemoInvestigator: () => void;
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    // Check local storage for active investigator session
    const saved = localStorage.getItem('crimeface_session_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      const session: Session | null = data?.session;
      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || 'investigator@forensic.internal',
          badgeNumber: session.user.user_metadata?.badge_number || 'INV-9021',
          agency: 'Metropolitan Forensic AI Bureau',
          role: 'Lead Forensic Examiner'
        };
        setUser(profile);
        localStorage.setItem('crimeface_session_user', JSON.stringify(profile));
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      if (session?.user) {
        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || 'investigator@forensic.internal',
          badgeNumber: session.user.user_metadata?.badge_number || 'INV-9021',
          agency: 'Metropolitan Forensic AI Bureau',
          role: 'Lead Forensic Examiner'
        };
        setUser(profile);
        localStorage.setItem('crimeface_session_user', JSON.stringify(profile));
      } else {
        setUser(null);
        localStorage.removeItem('crimeface_session_user');
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, pass: string) => {
    if (!isSupabaseConfigured) {
      // Demo authentication fallback
      const demoUser: UserProfile = {
        id: 'inv-' + Math.random().toString(36).substring(2, 9),
        email,
        badgeNumber: 'INV-4029',
        agency: 'Forensic Biometrics Division',
        role: 'Special Agent'
      };
      setUser(demoUser);
      localStorage.setItem('crimeface_session_user', JSON.stringify(demoUser));
      return {};
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) return { error: error.message };

    if (data.user) {
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        badgeNumber: data.user.user_metadata?.badge_number || 'INV-9021',
        agency: 'Metropolitan Forensic AI Bureau',
        role: 'Lead Forensic Examiner'
      };
      setUser(profile);
      localStorage.setItem('crimeface_session_user', JSON.stringify(profile));
    }
    return {};
  };

  const signUp = async (email: string, pass: string, badgeNumber?: string) => {
    if (!isSupabaseConfigured) {
      const newUser: UserProfile = {
        id: 'inv-' + Math.random().toString(36).substring(2, 9),
        email,
        badgeNumber: badgeNumber || 'INV-8812',
        agency: 'Department of Criminal Identification',
        role: 'Detective Forensic Artist'
      };
      setUser(newUser);
      localStorage.setItem('crimeface_session_user', JSON.stringify(newUser));
      return {};
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          badge_number: badgeNumber || 'INV-NEW',
          agency: 'Department of Criminal Identification',
        }
      }
    });

    if (error) return { error: error.message };
    if (data.user) {
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        badgeNumber: badgeNumber || 'INV-NEW',
        agency: 'Department of Criminal Identification',
        role: 'Investigator'
      };
      setUser(profile);
      localStorage.setItem('crimeface_session_user', JSON.stringify(profile));
    }
    return {};
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('crimeface_session_user');
  };

  const signInDemoInvestigator = () => {
    const demoUser: UserProfile = {
      id: 'demo-agent-007',
      email: 'investigator.vance@crimeface.internal',
      badgeNumber: 'BF-7709',
      agency: 'Cyber & Forensic Intelligence Command',
      role: 'Chief Biometric Examiner'
    };
    setUser(demoUser);
    localStorage.setItem('crimeface_session_user', JSON.stringify(demoUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        signInDemoInvestigator,
        isConfigured: isSupabaseConfigured
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
