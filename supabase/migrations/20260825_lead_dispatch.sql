-- =====================================================
-- LEAD DISPATCH SYSTEM ("Bourse aux Leads")
-- 2026-08-25
--
-- Flux : Client réserve -> WhatsApp double opt-in (OUI)
--        -> Statut 'verified' -> Broadcast Telegram (bouton Stripe)
--        -> Paiement Stripe -> 'sold' -> Livraison du numéro en DM
-- =====================================================

-- 1. Extend bookings table with lead-dispatch columns
ALTER TABLE public.bookings
    ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';
    -- status lifecycle: new -> pending_confirmation -> verified -> available
    --                   -> sold -> delivered -> cancelled | expired

ALTER TABLE public.bookings
    ADD COLUMN IF NOT EXISTS whatsapp_wa_id TEXT,          -- WhatsApp ID du client (pour relancer)
    ADD COLUMN IF NOT EXISTS confirmation_code TEXT,       -- Code unique pour tracer la réponse OUI
    ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ,     -- Quand le client a dit OUI
    ADD COLUMN IF NOT EXISTS telegram_message_id BIGINT,   -- Message Telegram du canal (pour edit FOMO)
    ADD COLUMN IF NOT EXISTS telegram_chat_id TEXT,        -- Canal (-100xxxxxxxxx)
    ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,       -- Session Checkout Stripe
    ADD COLUMN IF NOT EXISTS stripe_payment_intent TEXT,   -- PaymentIntent Stripe
    ADD COLUMN IF NOT EXISTS claimed_by_telegram TEXT,     -- Username Telegram du chauffeur gagnant
    ADD COLUMN IF NOT EXISTS claimed_by_phone TEXT,        -- Téléphone du chauffeur gagnant
    ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ,       -- Timestamp de la vente
    ADD COLUMN IF NOT EXISTS lead_price_cents INT DEFAULT 500, -- Prix du lead en centimes (5.00 €)
    ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;       -- Expiration du lead (auto-expire)

-- 2. Lead claims table (trace des ventes)
CREATE TABLE IF NOT EXISTS public.lead_claims (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    driver_telegram_id TEXT NOT NULL,
    driver_username TEXT,
    driver_phone TEXT,
    stripe_session_id TEXT,
    stripe_payment_intent TEXT,
    price_cents INT DEFAULT 500,
    status TEXT DEFAULT 'claimed' -- claimed | refunded
);

-- 3. RLS: allow anon insert (public form) but not reads
ALTER TABLE public.lead_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable insert for anon" ON public.lead_claims
    FOR INSERT TO anon
    WITH CHECK (true);

-- 4. Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings (status);
CREATE INDEX IF NOT EXISTS idx_bookings_confirmation_code ON public.bookings (confirmation_code);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session ON public.bookings (stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_lead_claims_booking ON public.lead_claims (booking_id);
