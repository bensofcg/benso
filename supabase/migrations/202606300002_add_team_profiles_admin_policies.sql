-- Migration: Add INSERT, UPDATE, DELETE policies for admin on team_profiles
-- Required for client-side role changes, member linking, and profile management in Ajustes view.

CREATE POLICY "team_profiles_admin_insert" ON public.team_profiles
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM public.team_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "team_profiles_admin_update" ON public.team_profiles
  FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM public.team_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "team_profiles_admin_delete" ON public.team_profiles
  FOR DELETE USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM public.team_profiles WHERE id = auth.uid() AND role = 'admin')
  );
