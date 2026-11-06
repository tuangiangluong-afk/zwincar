-- ============================================================================
-- ZwinCar.com — Schéma Relationnel Multi-Vendor Pool & WhatsApp Dispatch
-- ============================================================================

-- 1. CATALOGUE MAÎTRE (Géré exclusivement par ZwinCar)
CREATE TABLE IF NOT EXISTS public.catalog_models (
    id TEXT PRIMARY KEY, -- e.g. 'dacia-duster-4x4'
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    transmission TEXT NOT NULL,
    fuel TEXT NOT NULL,
    seats INTEGER NOT NULL DEFAULT 5,
    doors INTEGER NOT NULL DEFAULT 5,
    luggage INTEGER NOT NULL DEFAULT 3,
    trunk_liters INTEGER NOT NULL DEFAULT 400,
    ground_clearance_cm INTEGER NOT NULL DEFAULT 18,
    fuel_consumption TEXT,
    engine TEXT,
    horsepower INTEGER,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. AGENCES LOCALES PARTENAIRES (Vérifiées)
CREATE TABLE IF NOT EXISTS public.agencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    city_slug TEXT NOT NULL, -- 'marrakech', 'agadir', 'casablanca', etc.
    manager_name TEXT NOT NULL,
    whatsapp_phone TEXT NOT NULL, -- Format E.164 (+2126...)
    backup_phone TEXT,
    email TEXT,
    reliability_score NUMERIC(3,2) DEFAULT 5.00, -- Score d'acceptation et ponctualité
    total_bookings_handled INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'onboarding')),
    rib_bank_details TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agencies_city ON public.agencies(city_slug, status);

-- 3. UNITÉS DE FLOTTE PHYSIQUES (Rattachées au catalogue maître)
CREATE TABLE IF NOT EXISTS public.fleet_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
    catalog_model_id TEXT NOT NULL REFERENCES public.catalog_models(id) ON DELETE RESTRICT,
    license_plate TEXT NOT NULL, -- e.g. '45821-B-26' (usage interne contrat & BO uniquement)
    color TEXT NOT NULL DEFAULT 'Blanc',
    year INTEGER NOT NULL DEFAULT 2024,
    mileage INTEGER DEFAULT 35000,
    price_low NUMERIC(10,2) NOT NULL, -- Basse saison (Nov - Mars)
    price_mid NUMERIC(10,2) NOT NULL, -- Moyenne saison (Avril - Juin, Sept - Oct)
    price_high NUMERIC(10,2) NOT NULL, -- Haute saison (Juillet - Août, Fêtes)
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'maintenance', 'rented_offline', 'retired')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(agency_id, license_plate)
);

CREATE INDEX IF NOT EXISTS idx_fleet_units_agency ON public.fleet_units(agency_id);
CREATE INDEX IF NOT EXISTS idx_fleet_units_model ON public.fleet_units(catalog_model_id, status);

-- 4. CALENDRIER DE DISPONIBILITÉ & STOP-SELL EN 1 SWIPE
CREATE TABLE IF NOT EXISTS public.availability_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fleet_unit_id UUID NOT NULL REFERENCES public.fleet_units(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL DEFAULT 'manual_agency_block' 
        CHECK (reason IN ('booking', 'manual_agency_block', 'whatsapp_voice_block', 'maintenance')),
    booking_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_avail_blocks_unit_dates ON public.availability_blocks(fleet_unit_id, start_date, end_date);

-- 5. RÉSERVATIONS & SPLIT PAYMENT
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_reference TEXT NOT NULL UNIQUE, -- e.g. 'ZW-84920'
    client_name TEXT NOT NULL,
    client_whatsapp TEXT NOT NULL,
    client_email TEXT,
    client_language TEXT DEFAULT 'fr',
    flight_number TEXT,
    pickup_city TEXT NOT NULL,
    pickup_location_detail TEXT,
    dropoff_location_detail TEXT,
    start_date DATE NOT NULL,
    start_time TEXT NOT NULL DEFAULT '11:00',
    end_date DATE NOT NULL,
    end_time TEXT NOT NULL DEFAULT '11:00',
    total_days INTEGER NOT NULL DEFAULT 1,
    
    -- Rattachement Modèle & Attribution Agence
    catalog_model_id TEXT NOT NULL REFERENCES public.catalog_models(id),
    assigned_agency_id UUID REFERENCES public.agencies(id),
    assigned_fleet_unit_id UUID REFERENCES public.fleet_units(id),
    
    -- Split Financier
    deposit_eur NUMERIC(10,2) NOT NULL, -- 100% encaissé Stripe ZwinCar (com 20% + options plateforme)
    balance_mad NUMERIC(10,2) NOT NULL, -- Solde à encaisser en cash ou TPE par l'agence à la livraison
    total_amount_eur NUMERIC(10,2) NOT NULL,
    selected_upsells JSONB DEFAULT '[]'::jsonb,
    has_zero_deposit_pack BOOLEAN DEFAULT FALSE,
    
    -- Stripe & Cascade
    stripe_payment_intent_id TEXT,
    stripe_charge_status TEXT DEFAULT 'requires_capture' CHECK (stripe_charge_status IN ('requires_capture', 'captured', 'refunded', 'cancelled')),
    status TEXT NOT NULL DEFAULT 'pending_vendor' 
        CHECK (status IN ('pending_vendor', 'confirmed', 'delivered', 'completed', 'cancelled', 'no_show')),
    
    -- Horodatages Cascade WhatsApp Loueur
    first_pinged_agency_id UUID REFERENCES public.agencies(id),
    pinged_at TIMESTAMPTZ,
    ping_timeout_at TIMESTAMPTZ,
    vendor_accepted_at TIMESTAMPTZ,
    
    -- Check-in Photo 60s & Same-to-Same Carburant
    checkin_photos JSONB, -- 4 angles photos
    checkin_fuel_level TEXT, -- '1/4', '1/2', '3/4', 'Full'
    checkin_mileage INTEGER,
    checkin_completed_at TIMESTAMPTZ,
    checkout_fuel_level TEXT,
    checkout_mileage INTEGER,
    checkout_completed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bookings_status_dates ON public.bookings(status, start_date);
CREATE INDEX IF NOT EXISTS idx_bookings_agency ON public.bookings(assigned_agency_id, status);

-- Enable RLS
ALTER TABLE public.catalog_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Public Read for Catalog
CREATE POLICY "Public catalog is viewable by everyone" ON public.catalog_models
    FOR SELECT USING (true);
