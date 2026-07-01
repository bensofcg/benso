import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

interface DeleteMemberBody {
  memberId: number;
}

serve(async (req: Request) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }

  try {
    const body: DeleteMemberBody = await req.json();
    const { memberId } = body;

    if (!memberId) {
      return new Response(
        JSON.stringify({ success: false, error: 'memberId is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify caller is admin via JWT payload
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    let callerId: string;
    try {
      const payloadBase64 = authHeader.replace('Bearer ', '').split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      callerId = payload.sub;
      if (!callerId) throw new Error('no sub');
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { data: callerProfile } = await supabase
      .from('team_profiles')
      .select('role')
      .eq('id', callerId)
      .single();

    if (callerProfile?.role !== 'admin') {
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden — only admins can delete members' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Get the member's profile_id before deleting
    const { data: member, error: memberError } = await supabase
      .from('team_members')
      .select('profile_id')
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      return new Response(
        JSON.stringify({ success: false, error: 'Miembro no encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const profileId = member.profile_id;

    // Delete from team_members
    const { error: deleteMemberError } = await supabase
      .from('team_members')
      .delete()
      .eq('id', memberId);

    if (deleteMemberError) {
      return new Response(
        JSON.stringify({ success: false, error: 'Error al eliminar miembro: ' + deleteMemberError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (profileId) {
      // Delete from team_profiles
      try { await supabase.from('team_profiles').delete().eq('id', profileId) } catch {}

      // Delete auth user
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(profileId);
      if (deleteAuthError) {
        console.error('Failed to delete auth user:', deleteAuthError.message);
      }
    }

    return new Response(
      JSON.stringify({ success: true, deletedMemberId: memberId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('delete-team-member error:', err);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
