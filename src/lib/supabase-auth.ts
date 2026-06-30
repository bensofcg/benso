'use client';

import { supabase } from '@/lib/supabase';
import type { TeamProfile } from '@/types/team';

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  return data.session;
}

export async function getCurrentProfile(): Promise<TeamProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('team_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error || !data) return null;
  return data as TeamProfile;
}

export async function getUserRole(): Promise<'admin' | 'user' | null> {
  const profile = await getCurrentProfile();
  return profile?.role ?? null;
}

export async function signIn(login: string, password: string): Promise<{
  user: import('@supabase/supabase-js').User | null;
  error: string | null;
}> {
  // Resolve username to email if not already an email
  let email = login;
  if (!login.includes('@')) {
    const { data: profile, error: lookupError } = await supabase
      .from('team_profiles')
      .select('email')
      .eq('username', login)
      .maybeSingle();

    if (lookupError || !profile?.email) {
      return { user: null, error: 'Usuario no encontrado' };
    }
    email = profile.email;
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}

export async function signOut(): Promise<void> {
  try {
    await Promise.race([
      supabase.auth.signOut(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000)),
    ]);
  } catch {
    // Timeout o error de red — forzar limpieza local
    await supabase.auth.setSession({ access_token: '', refresh_token: '' }).catch(() => {});
  }

  if (typeof window !== 'undefined') {
    // Barrer localStorage
    const keys = Object.keys(localStorage).filter(k =>
      k.startsWith('sb-') || k.includes('supabase') || k.includes('-auth-token')
    );
    keys.forEach(k => localStorage.removeItem(k));

    // Barrer IndexedDB — Supabase stores the session there in newer versions
    try {
      const dbs = typeof indexedDB.databases === 'function' ? await indexedDB.databases() : [];
      for (const db of dbs) {
        if (db.name && (db.name.startsWith('sb-') || db.name.startsWith('supabase') || db.name.includes('auth'))) {
          indexedDB.deleteDatabase(db.name);
        }
      }
    } catch {
      // indexedDB.databases no soportado — barrer nombres comunes
      for (const name of ['supabase-auth', 'sb-session', 'SupabaseAuth']) {
        indexedDB.deleteDatabase(name);
      }
    }
  }
}
