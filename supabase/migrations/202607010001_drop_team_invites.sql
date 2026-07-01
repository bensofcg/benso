-- Remove team_invites table — invite link system replaced by direct admin creation
-- Admin now adds members with name, email, and password directly.

DROP TABLE IF EXISTS public.team_invites;
