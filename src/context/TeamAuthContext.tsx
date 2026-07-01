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

/** Guarda el user en userStorage para que __loadSession() no cree un proxy */
function saveUserToStorage(user: User) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('supabase.auth.token-user', JSON.stringify({ user }));
  } catch { /* storage lleno o deshabilitado */ }
}

export function TeamAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<TeamProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Timeout de seguridad — si auth se cuelga (sesión inválida), forza stop del loading
    const safetyTimeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 5000);

    async function init() {
      try {
        const currentSession = await getSession();
        if (!mounted) return;

        if (currentSession) {
          // Cacheamos el token de acceso para evitar que supabase.from().select()
          // se cuelgue llamando a getSession() → initializePromise colgado
          ;(supabase as any).accessToken = async () => currentSession.access_token ?? null;

          // Si el usuario es proxy, intentamos resolverlo con getUser() y
          // guardarlo en userStorage para que __loadSession() no lo recreé
          if ((currentSession.user as any)?.__isUserNotAvailableProxy === true) {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                currentSession.user = user;
                saveUserToStorage(user);
              }
            } catch { /* getUser falló, usamos proxy */ }
          } else if (currentSession.user) {
            // Ya tenemos usuario real — aseguramos que esté en userStorage
            saveUserToStorage(currentSession.user);
          }

          setSession(currentSession);
          const currentProfile = await getCurrentProfile();
          if (mounted) {
            if (!currentProfile) {
              // Sesión inválida/stale — usuario fue borrado o recreado
              await authSignOut().catch(() => {});
              setSession(null);
            }
            setProfile(currentProfile);
          }
        }
      } catch (e) {
        console.error('Auth init error:', e);
      } finally {
        if (mounted) {
          setLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        ;(supabase as any).accessToken = undefined;
        setSession(null);
        setProfile(null);
      } else if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        if (newSession) {
          ;(supabase as any).accessToken = async () => newSession.access_token ?? null;
          // Guardar user real en userStorage para evitar proxy en __loadSession()
          if (newSession.user) saveUserToStorage(newSession.user);
        }
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
