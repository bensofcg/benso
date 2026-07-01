# Team Auth Setup

## Crear el primer usuario admin

### Opción 1: Supabase Dashboard (recomendada)

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard/project/irhbkkfvcawklbahivii)
2. Ve a **Authentication → Users**
3. Haz clic en **Invite user** o **Add user**
4. Ingresa el email y contraseña del admin
5. Confirma el usuario (email confirmado)

6. Luego ve a **SQL Editor** y ejecuta:

```sql
INSERT INTO public.team_profiles (id, role, email)
VALUES (
  '<UUID del usuario creado>',  -- Copia el ID desde Authentication > Users
  'admin',
  'email-del-admin@ejemplo.com'
);
```

### Opción 2: Todo desde SQL Editor

```sql
-- 1. Crear usuario en auth (reemplaza email y password)
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, email_change,
  email_change_token_new, recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@benso.com',
  crypt('contraseña-segura-123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- 2. Crear el perfil admin
INSERT INTO public.team_profiles (id, role, email)
SELECT id, 'admin', email
FROM auth.users
WHERE email = 'admin@benso.com';
```

## Crear usuarios adicionales (desde la UI)

Una vez que el admin existe y ha iniciado sesión:

1. Ir a `/team`
2. En el sidebar, hacer clic en **Ajustes**
3. Usar el formulario "Crear usuario" (email + contraseña + rol)
4. Luego ir a **Equipo** para crear/editar miembros y vincularlos a las cuentas

## Estructura de datos

- `auth.users` — Credenciales de login (gestionado por Supabase Auth)
- `team_profiles` — Rol (admin/user) vinculado a auth.users
- `team_members` — Datos del miembro, vinculado a team_profiles vía `profile_id`
