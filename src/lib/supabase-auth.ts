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

export async function signIn(email: string, password: string): Promise<{
  user: import('@supabase/supabase-js').User | null;
  error: string | null;
}> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { user: null, error: error.message };
  }

  return { user: data.user, error: null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
