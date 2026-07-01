import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from '@supabase/supabase-js';

interface AddMemberBody {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
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
    const body: AddMemberBody = await req.json();
    const { name, email, password, role } = body;

    if (!name?.trim() || !email || !password || !role) {
      return new Response(
        JSON.stringify({ success: false, error: 'name, email, password, and role are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid email format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ success: false, error: 'La contraseña debe tener al menos 6 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (!['admin', 'user'].includes(role)) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid role. Must be admin or user' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
        JSON.stringify({ success: false, error: 'Forbidden - only admins can add members' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { data: existingProfile } = await supabase
      .from('team_profiles')
      .select('id, role')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (existingProfile) {
      // Check if this is an orphan (no team_member linked) — if so, clean up and proceed
      const { data: linkedMember } = await supabase
        .from('team_members')
        .select('id')
        .eq('profile_id', existingProfile.id)
        .maybeSingle();

      if (!linkedMember) {
        // Orphan profile — delete auth user + profile so we can re-invite cleanly
        const { error: delAuthErr } = await supabase.auth.admin.deleteUser(existingProfile.id);
        if (delAuthErr) {
          return new Response(
            JSON.stringify({ success: false, error: 'Error al limpiar usuario huérfano: ' + delAuthErr.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
          );
        }
        await supabase.from('team_profiles').delete().eq('id', existingProfile.id);
      } else {
        // Real existing user — reject
        return new Response(
          JSON.stringify({ success: false, error: 'Este email ya tiene una cuenta en el equipo' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
    }

    const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
    });

    if (createError || !authUser?.user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Error al crear usuario: ' + (createError?.message || 'unknown') }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const userId = authUser.user.id;

    const { error: profileError } = await supabase
      .from('team_profiles')
      .insert({ id: userId, email: email.toLowerCase(), role });

    if (profileError) {
      try { await supabase.auth.admin.deleteUser(userId) } catch {}
      return new Response(
        JSON.stringify({ success: false, error: 'Error al crear perfil: ' + profileError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { error: memberError } = await supabase
      .from('team_members')
      .insert({ name: name.trim(), profile_id: userId });

    if (memberError) {
      try { await supabase.from('team_profiles').delete().eq('id', userId) } catch {}
      try { await supabase.auth.admin.deleteUser(userId) } catch {}
      return new Response(
        JSON.stringify({ success: false, error: 'Error al crear miembro: ' + memberError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, profile_id: userId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
