create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text,
  role text not null default 'CLIENT' check (role in ('CLIENT', 'ADMIN', 'STYLIST')),
  avatar_url text,
  specialty text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.services (
  id text primary key,
  name text not null,
  description text not null default '',
  price numeric(12, 2) not null default 0 check (price >= 0),
  duration_minutes integer not null default 60 check (duration_minutes > 0),
  category text not null,
  is_active boolean not null default true,
  color_code text,
  image_url text,
  badge text,
  tags text[] not null default array[]::text[],
  icon_name text
);

create table if not exists public.appointments (
  id text primary key,
  client_id uuid not null references public.profiles(id),
  stylist_id text not null,
  service_id text not null references public.services(id),
  appointment_date timestamptz not null,
  status text not null default 'PENDING'
    check (status in ('CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING')),
  notes text,
  created_at timestamptz not null default now()
);

insert into public.services (
  id, name, description, price, duration_minutes, category, is_active,
  color_code, image_url, badge, tags, icon_name
) values
  ('srv-nails-1', 'Manicura Tradicional Glitt', 'Limpieza de cutículas, limado anatómico, exfoliación e hidratación profunda con esmaltado tradicional brillante de larga fijación.', 35000, 45, 'Uñas & Manicura', true, '#FF70A6', 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=500&auto=format&fit=crop&q=80', 'Básico Chic', array['Esmaltado', 'Exfoliación', 'Manicura'], 'Sparkles'),
  ('srv-nails-2', 'Pedicura Spa Relajante & Sales', 'Baño de burbujas aromatizadas, exfoliación con sales marinas, remoción de asperezas, masaje podal relajante y esmaltado duradero.', 55000, 60, 'Uñas & Manicura', true, '#70D6FF', 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=500&auto=format&fit=crop&q=80', 'Spa Relax', array['Pedicura', 'Sales Marinas', 'Bienestar'], 'Sparkles'),
  ('srv-5', 'Uñas en Semi-permanente Glow', 'Limpieza rusa combinada, nivelación con base rubber fortalecedora y esmaltado semipermanente de alta densidad intacto por 21 días.', 75000, 50, 'Uñas & Manicura', true, '#38E54D', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&auto=format&fit=crop&q=80', 'Más Vendido ✦', array['Semipermanente', 'Base Rubber', '21 Días'], 'Sparkles'),
  ('srv-3', 'Acrílicas Esculpidas & 3D Charms Y2K', 'Esculpido milimétrico en acrílico o polygel con encapsulado glitter, efecto aurora boreal holográfico y pedrería nostálgica estilo 2000s.', 135000, 90, 'Uñas & Manicura', true, '#FF70A6', 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=500&auto=format&fit=crop&q=80', 'Y2K Icon ✦', array['Acrílicas', 'Efecto Gel 3D', 'Glitter'], 'Sparkles'),
  ('srv-2', 'Corte Mariposa Y2K + Blowout', 'Corte en capas dinámicas y degrafilado estilo 2000s con acabado voluminoso en cepillo redondo térmico y sérum iluminador anti-frizz.', 85000, 60, 'Peluquería & Cabello', true, '#FF70A6', 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=500&auto=format&fit=crop&q=80', 'Tendencia Top', array['Capas Butterfly', 'Blowout', 'Estilo 2000s'], 'Scissors'),
  ('srv-hair-blower', 'Blower & Cepillado Voluminoso Glam', 'Lavado capilar con masaje craneal relajante, secado profesional con cepillado redondo para volumen extremo y fijación sedosa.', 45000, 45, 'Peluquería & Cabello', true, '#FFD670', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80', 'Express Glam', array['Lavado', 'Cepillado', 'Volumen'], 'Scissors'),
  ('srv-1', 'Balayage Y2K Glitt + Matizado', 'Técnica artesanal de decoloración con reflejos perlados, degradado sin marcas agresivas y baño de gloss protector de fibra capilar.', 280000, 150, 'Peluquería & Cabello', true, '#70D6FF', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=500&auto=format&fit=crop&q=80', 'Premium Color', array['Balayage', 'Decoloración', 'Gloss'], 'Scissors'),
  ('srv-4', 'Keratina Orgánica Brillo Espejo', 'Alisado termodinámico progresivo 100% orgánico sin formol, nutrición ultra hidratante de aminoácidos y sellado de puntas.', 220000, 120, 'Peluquería & Cabello', true, '#FFD670', 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&auto=format&fit=crop&q=80', 'Alisado Orgánico', array['Keratina', 'Sin Formol', 'Efecto Espejo'], 'Scissors'),
  ('srv-6', 'Babylights & Tonalización Pastel', 'Micro mechas ultra delgadas para un efecto rubio luminoso natural con matiz pastel lavanda, vainilla o melocotón.', 240000, 160, 'Peluquería & Cabello', true, '#70D6FF', 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=500&auto=format&fit=crop&q=80', 'Efecto Sun-Kissed', array['Babylights', 'Pastel', 'Rubio'], 'Scissors'),
  ('srv-skin-1', 'Limpieza Facial Profunda & Desintoxicante', 'Vapor de ozono herbal, extracción ultrasónica de impurezas, microdermoabrasión suave con punta de diamante y mascarilla descongestiva.', 95000, 60, 'Cuidado & Piel', true, '#38E54D', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=80', 'Detox Facial', array['Punta Diamante', 'Vapor Ozono', 'Skin Detox'], 'Sparkles'),
  ('srv-skin-2', 'Hidratación Facial Glow & Ácido Hialurónico', 'Shock de hidratación intensiva con electroporación transdérmica de sérums concentrados, velo de colágeno y masaje linfático rejuvenecedor.', 115000, 50, 'Cuidado & Piel', true, '#FF70A6', 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&auto=format&fit=crop&q=80', 'Glass Skin', array['Ácido Hialurónico', 'Lifting', 'Glow'], 'Sparkles'),
  ('srv-skin-3', 'Exfoliación Botánica & Renovación Skin-Care', 'Peeling enzimático botánico no abrasivo, exfoliación corporal/facial con microgránulos de albaricoque y suero antioxidante de vitamina C.', 85000, 45, 'Cuidado & Piel', true, '#FFD670', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&auto=format&fit=crop&q=80', 'Antioxidante', array['Vitamina C', 'Peeling Enzimático', 'Suavidad'], 'Sparkles'),
  ('srv-skin-4', 'Rejuvenecimiento Skin-Care & Terapia LED', 'Protocolo regenerativo avanzado con máscara de fototerapia LED policromática, bioestimulación celular de colágeno y ampolla revitalizante.', 145000, 75, 'Cuidado & Piel', true, '#70D6FF', 'https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=500&auto=format&fit=crop&q=80', 'Terapia LED ✦', array['Fototerapia LED', 'Colágeno', 'Anti-Age'], 'Sparkles')
on conflict (id) do nothing;

grant select, insert, update on public.profiles to authenticated;
grant select on public.services to anon, authenticated;
grant select, insert, update on public.appointments to authenticated;

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
  if session_user in ('postgres', 'supabase_admin') or auth.role() = 'service_role' then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.role::text <> 'CLIENT'
      and coalesce(public.salonglitt_current_role(), '') <> 'ADMIN' then
      raise exception 'Only administrators can create staff profiles';
    end if;
  else
    if new.role::text is distinct from old.role::text
      and coalesce(public.salonglitt_current_role(), '') <> 'ADMIN' then
      raise exception 'Only administrators can change user roles';
    end if;

    if new.is_active is distinct from old.is_active
      and coalesce(public.salonglitt_current_role(), '') <> 'ADMIN' then
      raise exception 'Only administrators can change profile active status';
    end if;

    if new.id::text = auth.uid()::text and not old.is_active and new.is_active then
      raise exception 'Administrators cannot reactivate their own profile';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists salonglitt_guard_profile_role on public.profiles;
create trigger salonglitt_guard_profile_role
before insert or update of role, is_active on public.profiles
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

alter table public.services enable row level security;
drop policy if exists salonglitt_services_read on public.services;
create policy salonglitt_services_read on public.services
for select to anon, authenticated
using (is_active);

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

create or replace function public.salonglitt_validate_appointment_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  booking_details_changed boolean;
  caller_role text;
begin
  if tg_op = 'INSERT' then
    if new.status::text not in ('CONFIRMED', 'PENDING') then
      raise exception 'New appointments must be pending or confirmed';
    end if;

    if new.appointment_date < now() + interval '72 hours'
      or new.appointment_date > now() + interval '168 hours' then
      raise exception 'Appointments must be booked between 72 and 168 hours in advance';
    end if;
    return new;
  end if;

  caller_role := coalesce(public.salonglitt_current_role(), '');
  if new.status::text is distinct from old.status::text
    and new.status::text <> 'CANCELLED'
    and caller_role not in ('ADMIN', 'STYLIST')
    and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Only staff can change an appointment status to something other than cancelled';
  end if;

  if new.status::text = 'CANCELLED' and old.status::text <> 'CANCELLED'
    and old.appointment_date < now() + interval '24 hours' then
    raise exception 'Appointments can only be cancelled at least 24 hours in advance';
  end if;

  booking_details_changed :=
    new.client_id is distinct from old.client_id
    or new.stylist_id is distinct from old.stylist_id
    or new.service_id is distinct from old.service_id
    or new.appointment_date is distinct from old.appointment_date
    or new.notes is distinct from old.notes;

  if booking_details_changed then
    if old.status::text = 'CANCELLED' then
      raise exception 'Cancelled appointments cannot be modified';
    end if;

    if old.appointment_date < now() + interval '24 hours' then
      raise exception 'Appointments can only be modified at least 24 hours in advance';
    end if;

    if new.appointment_date is distinct from old.appointment_date
      and (new.appointment_date < now() + interval '72 hours'
        or new.appointment_date > now() + interval '168 hours') then
      raise exception 'Rescheduled appointments must be between 72 and 168 hours in the future';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists salonglitt_validate_appointment_rules on public.appointments;
create trigger salonglitt_validate_appointment_rules
before insert or update of client_id, stylist_id, service_id, appointment_date, status, notes
on public.appointments
for each row execute function public.salonglitt_validate_appointment_rules();

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