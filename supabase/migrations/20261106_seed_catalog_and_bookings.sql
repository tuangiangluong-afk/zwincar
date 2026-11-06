-- ============================================================================
-- ZwinCar.com — Migration & Seed : rental_bookings, Catalogue & Flotte Loueur
-- À exécuter dans le SQL Editor Supabase de votre projet https://mgstrqmopyxtmgrviwds.supabase.co
-- ============================================================================

-- 1. Table rental_bookings (utilisée par le booking engine ZwinCar)
CREATE TABLE IF NOT EXISTS public.rental_bookings (
    ref TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    pickup_at TIMESTAMPTZ NOT NULL,
    return_at TIMESTAMPTZ NOT NULL,
    client_email TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS rental_bookings_status_idx ON public.rental_bookings (status);
CREATE INDEX IF NOT EXISTS rental_bookings_pickup_idx ON public.rental_bookings (pickup_at);
CREATE INDEX IF NOT EXISTS rental_bookings_email_idx ON public.rental_bookings (client_email);

-- Activation RLS
ALTER TABLE public.rental_bookings ENABLE ROW LEVEL SECURITY;

-- 2. Insertion des 6 Modèles Maîtres du Catalogue ZwinCar
INSERT INTO public.catalog_models (
    id, brand, model, name, category, transmission, fuel, seats, doors, luggage, 
    trunk_liters, ground_clearance_cm, fuel_consumption, engine, horsepower, image_url
)
VALUES
('dacia-sandero-stepway', 'Dacia', 'Sandero Stepway', 'Dacia Sandero Stepway', 'Compacte', 'Manuelle', 'Diesel', 5, 5, 3, 328, 18, '4.2 L/100km', '1.5 dCi 95 ch', 95, '/images/vehicles/dacia-sandero-stepway.webp'),
('renault-clio-5-auto', 'Renault', 'Clio 5', 'Renault Clio 5 Automatique', 'Citadine', 'Automatique', 'Essence', 5, 5, 2, 300, 14, '5.1 L/100km', '1.0 TCe 90 ch X-Tronic', 90, '/images/vehicles/renault-clio-5-auto.webp'),
('dacia-duster-4x4', 'Dacia', 'Duster Prestige', 'Dacia Duster Prestige 4x4', 'SUV & 4x4', 'Manuelle', 'Diesel', 5, 5, 4, 475, 21, '5.3 L/100km', '1.5 Blue dCi 115 ch 4WD', 115, '/images/vehicles/dacia-duster-4x4.webp'),
('hyundai-tucson-auto', 'Hyundai', 'Tucson BVA', 'Hyundai Tucson BVA Luxe', 'SUV & 4x4', 'Automatique', 'Diesel', 5, 5, 5, 546, 17, '5.6 L/100km', '1.6 CRDi 136 ch DCT-7', 136, '/images/vehicles/hyundai-tucson-auto.webp'),
('peugeot-208-puretech', 'Peugeot', '208', 'Peugeot 208 PureTech', 'Citadine', 'Manuelle', 'Essence', 5, 5, 2, 311, 14, '4.8 L/100km', '1.2 PureTech 75 ch', 75, '/images/vehicles/peugeot-208-puretech.webp'),
('toyota-prado-tx-7places', 'Toyota', 'Land Cruiser Prado TX', 'Toyota Land Cruiser Prado TX (7 Places)', 'Familiale & 7 Places', 'Automatique', 'Diesel', 7, 5, 6, 621, 22, '8.2 L/100km', '2.8 D-4D 204 ch 4WD', 204, '/images/vehicles/toyota-prado-tx-7places.webp')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    transmission = EXCLUDED.transmission,
    fuel = EXCLUDED.fuel,
    image_url = EXCLUDED.image_url;

-- 3. Agence Partenaire Témoin à Marrakech (Atlas Drive)
INSERT INTO public.agencies (id, name, city_slug, manager_name, whatsapp_phone, backup_phone, email, reliability_score, status)
VALUES
('a0000000-0000-0000-0000-000000000001', 'Atlas Drive Marrakech', 'marrakech', 'Youssef Benjelloun', '+212600000000', '+212524000000', 'contact@atlasdrive-marrakech.ma', 4.95, 'active')
ON CONFLICT (id) DO NOTHING;

-- 4. Flotte Réelle rattachée à Atlas Drive
INSERT INTO public.fleet_units (agency_id, catalog_model_id, license_plate, color, year, mileage, price_low, price_mid, price_high, status)
VALUES
('a0000000-0000-0000-0000-000000000001', 'dacia-sandero-stepway', '45821-B-26', 'Gris Comète', 2024, 28000, 23.00, 28.00, 35.00, 'active'),
('a0000000-0000-0000-0000-000000000001', 'renault-clio-5-auto', '12944-A-26', 'Blanc Glacier', 2024, 21000, 32.00, 38.00, 48.00, 'active'),
('a0000000-0000-0000-0000-000000000001', 'dacia-duster-4x4', '87102-D-26', 'Orange Atacama', 2024, 34000, 45.00, 52.00, 68.00, 'active'),
('a0000000-0000-0000-0000-000000000001', 'hyundai-tucson-auto', '63819-B-26', 'Noir Fantôme', 2024, 18000, 62.00, 72.00, 95.00, 'active')
ON CONFLICT (agency_id, license_plate) DO UPDATE SET
    mileage = EXCLUDED.mileage,
    price_low = EXCLUDED.price_low;
