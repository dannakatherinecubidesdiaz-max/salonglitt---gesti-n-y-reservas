create or replace function public.salonglitt_current_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select p.role::text
  from public.profiles p
  where p.id::text = auth.uid()::text
  limit 1
$$;

create or replace function public.salonglitt_guard_profile_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if session_user in ('postgres', 'supabase_admin') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.role::text <> 'CLIENT'
      and coalesce(public.salonglitt_current_role(), '') <> 'ADMIN' then
      raise exception 'Only administrators can create staff profiles';
    end if;
  elsif new.role::text is distinct from old.role::text
    and coalesce(public.salonglitt_current_role(), '') <> 'ADMIN' then
    raise exception 'Only administrators can change user roles';
  end if;

  return new;
end;
$$;

drop trigger if exists salonglitt_guard_profile_role on public.profiles;
create trigger salonglitt_guard_profile_role
before insert or update of role on public.profiles
for each row execute function public.salonglitt_guard_profile_role();

alter table public.profiles enable row level security;
drop policy if exists salonglitt_profiles_read on public.profiles;
create policy salonglitt_profiles_read on public.profiles
for select to authenticated
using (
  id::text = auth.uid()::text
  or role::text = 'STYLIST'
  or public.salonglitt_current_role() in ('ADMIN', 'STYLIST')
);

drop policy if exists salonglitt_profiles_insert on public.profiles;
create policy salonglitt_profiles_insert on public.profiles
for insert to authenticated
with check (
  (id::text = auth.uid()::text and role::text = 'CLIENT')
  or public.salonglitt_current_role() = 'ADMIN'
);

drop policy if exists salonglitt_profiles_update on public.profiles;
create policy salonglitt_profiles_update on public.profiles
for update to authenticated
using (id::text = auth.uid()::text or public.salonglitt_current_role() = 'ADMIN')
with check (id::text = auth.uid()::text or public.salonglitt_current_role() = 'ADMIN');

alter table public.appointments enable row level security;
drop policy if exists salonglitt_appointments_read on public.appointments;
create policy salonglitt_appointments_read on public.appointments
for select to authenticated
using (
  client_id::text = auth.uid()::text
  or public.salonglitt_current_role() in ('ADMIN', 'STYLIST')
);

drop policy if exists salonglitt_appointments_insert on public.appointments;
create policy salonglitt_appointments_insert on public.appointments
for insert to authenticated
with check (
  client_id::text = auth.uid()::text
  or public.salonglitt_current_role() in ('ADMIN', 'STYLIST')
);

drop policy if exists salonglitt_appointments_update on public.appointments;
create policy salonglitt_appointments_update on public.appointments
for update to authenticated
using (
  client_id::text = auth.uid()::text
  or public.salonglitt_current_role() in ('ADMIN', 'STYLIST')
)
with check (
  client_id::text = auth.uid()::text
  or public.salonglitt_current_role() in ('ADMIN', 'STYLIST')
);

create or replace function public.salonglitt_prevent_stylist_overlap()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_duration integer;
  has_overlap boolean;
begin
  perform pg_advisory_xact_lock(hashtextextended(new.stylist_id::text, 0));

  select coalesce(s.duration_minutes, 60)
  into requested_duration
  from public.services s
  where s.id::text = new.service_id::text;

  if requested_duration is null then
    raise exception 'Service not found';
  end if;

  select exists (
    select 1
    from public.appointments a
    join public.services s on s.id::text = a.service_id::text
    where a.stylist_id::text = new.stylist_id::text
      and a.id::text <> new.id::text
      and a.status::text <> 'CANCELLED'
      and tstzrange(
        a.appointment_date,
        a.appointment_date + make_interval(mins => coalesce(s.duration_minutes, 60)),
        '[)'
      ) && tstzrange(
        new.appointment_date,
        new.appointment_date + make_interval(mins => requested_duration),
        '[)'
      )
  ) into has_overlap;

  if has_overlap then
    raise exception 'This stylist already has an appointment during that time';
  end if;

  return new;
end;
$$;

drop trigger if exists salonglitt_prevent_stylist_overlap on public.appointments;
create trigger salonglitt_prevent_stylist_overlap
before insert or update of stylist_id, service_id, appointment_date, status
on public.appointments
for each row
when (new.status::text <> 'CANCELLED')
execute function public.salonglitt_prevent_stylist_overlap();