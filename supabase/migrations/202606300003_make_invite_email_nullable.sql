-- Make team_invites.email nullable so admins can generate invite links
-- without specifying an email upfront. The email can be added later.

ALTER TABLE public.team_invites
  ALTER COLUMN email DROP NOT NULL;
