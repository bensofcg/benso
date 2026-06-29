-- Migration: Team Authentication & RBAC — Foundation
-- Creates team_profiles table, adds profile_id to team_members,
-- drops public policies, and creates RLS policies.

-- Step 1: Create team_profiles table
CREATE TABLE public.team_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  role text NOT NULL CHECK (role IN ('admin', 'user')),
  email text NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_auth_user FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX idx_team_profiles_email ON public.team_profiles(email);

ALTER TABLE public.team_profiles ENABLE ROW LEVEL SECURITY;

-- Step 2: Add profile_id to team_members (nullable — existing members keep working)
ALTER TABLE public.team_members ADD COLUMN profile_id uuid REFERENCES public.team_profiles(id) ON DELETE SET NULL;

CREATE INDEX idx_team_members_profile_id ON public.team_members(profile_id);

-- Step 3: Drop existing public policies
DROP POLICY IF EXISTS "Enable all for public" ON public.team_members;
DROP POLICY IF EXISTS "Enable all for public" ON public.team_tasks;

-- Step 4: RLS policies for team_members
CREATE POLICY "team_members_select_auth" ON public.team_members
  FOR SELECT USING (
    auth.role() = 'authenticated'
  );

CREATE POLICY "team_members_admin_insert" ON public.team_members
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM public.team_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "team_members_admin_update" ON public.team_members
  FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM public.team_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "team_members_admin_delete" ON public.team_members
  FOR DELETE USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM public.team_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Step 5: RLS policies for team_tasks
CREATE POLICY "team_tasks_select_auth" ON public.team_tasks
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND (
      EXISTS (SELECT 1 FROM public.team_profiles WHERE id = auth.uid() AND role = 'admin')
      OR EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_members.id = team_tasks.member_id
        AND team_members.profile_id = auth.uid()
      )
    )
  );

CREATE POLICY "team_tasks_admin_insert" ON public.team_tasks
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM public.team_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "team_tasks_update_owner" ON public.team_tasks
  FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND (
      EXISTS (SELECT 1 FROM public.team_profiles WHERE id = auth.uid() AND role = 'admin')
      OR EXISTS (
        SELECT 1 FROM public.team_members
        WHERE team_members.id = team_tasks.member_id
        AND team_members.profile_id = auth.uid()
      )
    )
  );

CREATE POLICY "team_tasks_admin_delete" ON public.team_tasks
  FOR DELETE USING (
    auth.role() = 'authenticated'
    AND EXISTS (SELECT 1 FROM public.team_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Step 6: RLS policies for team_profiles
CREATE POLICY "team_profiles_select" ON public.team_profiles
  FOR SELECT USING (
    auth.role() = 'authenticated'
    AND (
      id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.team_profiles tp WHERE tp.id = auth.uid() AND tp.role = 'admin'
      )
    )
  );
