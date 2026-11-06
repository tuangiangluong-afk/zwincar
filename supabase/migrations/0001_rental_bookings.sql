-- ZwinCar — dossiers de location (source de vérité serveur)
-- À exécuter dans le SQL Editor Supabase, une seule fois.

create table if not exists public.rental_bookings (
    ref text primary key,
    status text not null,
    pickup_at timestamptz not null,
    return_at timestamptz not null,
    client_email text not null,
    payload jsonb not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists rental_bookings_status_idx on public.rental_bookings (status);
create index if not exists rental_bookings_pickup_idx on public.rental_bookings (pickup_at);
create index if not exists rental_bookings_email_idx on public.rental_bookings (client_email);

-- Le backend utilise la clé service_role : RLS activée sans policy publique.
alter table public.rental_bookings enable row level security;

-- Aucune policy n'est créée volontairement : seules les requêtes service_role
-- (routes API Next.js) peuvent lire/écrire. Le navigateur n'a jamais accès à cette table.

comment on table public.rental_bookings is
    'Dossiers de location ZwinCar. payload = BookingRecord complet (devis, caution, check-in/out, cycle de vie).';
