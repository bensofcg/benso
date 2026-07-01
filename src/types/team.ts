// Shared types for the Team module

export interface TeamProfile {
  id: string;           // UUID from auth.users
  role: 'admin' | 'user';
  email: string;
  created_at: string;
}

export interface AuthState {
  session: import('@supabase/supabase-js').Session | null;
  profile: TeamProfile | null;
  role: 'admin' | 'user' | null;
  loading: boolean;
}

export interface TeamMember {
  id: number;
  name: string;
  profile_id: string | null;
  task_counts: {
    pending: number;
    in_progress: number;
    completed: number;
  };
}

export interface Task {
  id: number;
  member_id: number;
  title: string;
  description: string;
  due_date: string | null;
  payment: number;
  status: 'pending' | 'in_progress' | 'completed';
  position: number;
  created_at: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface MonthlyReportTask {
  id: number;
  title: string;
  payment: number;
}

export interface TeamProfileWithMember extends TeamProfile {
  team_member: TeamMember | null;
}

export interface MonthlyReportRow {
  member_id: number;
  name: string;
  completed_count: number;
  total_payment: number;
  tasks: MonthlyReportTask[];
}
