'use client';

import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session, User } from '@supabase/supabase-js';
import type { TeamProfile } from '@/types/team';
import { getSession, getCurrentProfile, signIn as authSignIn, signOut as authSignOut } from '@/lib/supabase-auth';

export interface TeamAuthContextValue {
  session: Session | null;
  profile: TeamProfile | null;
  role: 'admin' | 'user' | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<void>;
}

export const TeamAuthContext = createContext<TeamAuthContextValue | undefined>(undefined);

export function TeamAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<TeamProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const currentSession = await getSession();
      if (!mounted) return;

      if (currentSession) {
        setSession(currentSession);
        const currentProfile = await getCurrentProfile();
        if (mounted) {
          setProfile(currentProfile);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setSession(null);
        setProfile(null);
      } else if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        setSession(newSession);
        if (newSession) {
          const currentProfile = await getCurrentProfile();
          if (mounted) {
            setProfile(currentProfile);
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const role = profile?.role ?? null;

  const signInFn = async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    // The onAuthStateChange listener will update session/profile
    return result;
  };

  const signOutFn = async () => {
    try {
      await authSignOut();
    } catch {
      // Si falla (timeout/red), forzar limpieza local igual
    }
    // Limpiar estado siempre, incluso si signOut timeout
    setSession(null);
    setProfile(null);
  };

  return (
    <TeamAuthContext.Provider
      value={{
        session,
        profile,
        role,
        loading,
        signIn: signInFn,
        signOut: signOutFn,
      }}
    >
      {children}
    </TeamAuthContext.Provider>
  );
}

export function useTeamAuth(): TeamAuthContextValue {
  const context = useContext(TeamAuthContext);
  if (!context) {
    throw new Error('useTeamAuth must be used within a TeamAuthProvider');
  }
  return context;
}
