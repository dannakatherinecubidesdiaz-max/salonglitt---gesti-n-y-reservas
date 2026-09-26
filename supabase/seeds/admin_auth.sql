do $$
declare
  admin_user_id uuid;
begin
  update auth.users
  set email_confirmed_at = coalesce(email_confirmed_at, timezone('utc', now())),
      updated_at = timezone('utc', now())
  where lower(email) = lower('admin@salonglitt.com')
  returning id into admin_user_id;

  if admin_user_id is null then
    raise exception 'Create admin@salonglitt.com in Supabase Auth before running this seed';
  end if;

  insert into public.profiles (id, full_name, email, role, is_active)
  select
    id,
    coalesce(nullif(raw_user_meta_data ->> 'full_name', ''), 'Sofía Glam (Directora)'),
    email,
    'ADMIN',
    true
  from auth.users
  where id = admin_user_id
  on conflict (id) do update
  set email = excluded.email,
      role = 'ADMIN',
      is_active = true;
end;
$$;
