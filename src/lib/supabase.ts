import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irhbkkfvcawklbahivii.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyaGJra2Z2Y2F3a2xiYWhpdmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4Mzk5MDYsImV4cCI6MjA5MTQxNTkwNn0.ZwFd14KhtXXJ1iuyGhJL5iptiEzK3oS3cr9NeexB0GQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
