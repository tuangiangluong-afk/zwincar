import { supabase } from "@/lib/supabase";
import { BookingDetails } from "@/lib/calendar";
import { sendLeadConfirmation, sendLeadConfirmed } from "@/lib/whatsapp";
import { broadcastLeadToChannel, editLeadSold, sendDriverDM, sendClaimCheckout } from "@/lib/telegram";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const LEAD_PRICE_CENTS = Number(process.env.LEAD_PRICE_CENTS || 500); // 5.00 €
const SUCCESS_URL = process.env.LEAD_SUCCESS_URL || "https://zwincar.com";
const CANCEL_URL = process.env.LEAD_CANCEL_URL || "https://zwincar.com";
const TELEGRAM_BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME; // ex: "TaxiFranceLeadsBot"

export const LEAD_STATUS = {
    NEW: "new",
    PENDING_CONFIRMATION: "pending_confirmation",
    VERIFIED: "verified",
    AVAILABLE: "available",
    SOLD: "sold",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    EXPIRED: "expired",
} as const;

// ----------------------------------------------------------------------------
// ÉTAPE 1 — Création du lead + demande de confirmation WhatsApp (double opt-in)
// ----------------------------------------------------------------------------
export async function createLeadAndRequestConfirmation(
    booking: BookingDetails,
    tenantId: string,
    domain: string
) {
    const confirmationCode = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`.toUpperCase();
    const pickupTime = booking.pickupTime;

    // 1. Save booking with status pending_confirmation
    const { data: bookingRow, error: dbError } = await (supabase as any)
        .from("bookings")
        .insert({
            tenant_id: tenantId,
            client_name: booking.clientName,
            phone: booking.phone,
            pickup_address: booking.pickupLocation,
            dropoff_address: booking.dropoffLocation,
            pickup_time: pickupTime,
            price_estimate: booking.price,
            status: LEAD_STATUS.PENDING_CONFIRMATION,
            confirmation_code: confirmationCode,
            lead_price_cents: LEAD_PRICE_CENTS,
            expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1h pour confirmer
        })
        .select()
        .single();

    if (dbError) {
        console.error("Lead creation DB error:", dbError);
        return { success: false, error: dbError, bookingId: null };
    }

    // 2. Send WhatsApp confirmation template (DOES NOT BLOCK on failure)
    const waResult = await sendLeadConfirmation({
        clientName: booking.clientName,
        phone: booking.phone,
        pickupLocation: booking.pickupLocation,
        dropoffLocation: booking.dropoffLocation,
        pickupTime,
        price: booking.price,
    });

    // 3. If WhatsApp works, record the WA ID so we can match the reply
    if (waResult.success && (waResult.data as any)?.contacts?.[0]?.wa_id) {
        const waId = (waResult.data as any).contacts[0].wa_id as string;
        await (supabase as any)
            .from("bookings")
            .update({ whatsapp_wa_id: waId })
            .eq("id", bookingRow.id);
    }

    return { success: true, bookingId: bookingRow.id, waResult, domain };
}

// ----------------------------------------------------------------------------
// ÉTAPE 2 — Réception du "OUI" (webhook WhatsApp) -> vérifie le lead puis
// diffuse sur Telegram (bouton = deep-link du bot, pas la session Stripe).
// ----------------------------------------------------------------------------
export async function handleLeadConfirmationReply(waId: string, replyText: string) {
    const normalized = (replyText || "").trim().toUpperCase();

    // Trouver le lead en attente pour ce numéro WhatsApp
    const { data: booking } = await (supabase as any)
        .from("bookings")
        .select("*")
        .eq("whatsapp_wa_id", waId)
        .eq("status", LEAD_STATUS.PENDING_CONFIRMATION)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (!booking) {
        return { success: false, reason: "no_pending_lead" };
    }

    const isYes = normalized === "OUI" || normalized.startsWith("OUI ") || normalized === "OUI!" || normalized === "OUI." || normalized === "OUI,";
    if (!isYes) {
        return { success: false, reason: "not_yes" };
    }

    // Marquer vérifié
    await (supabase as any)
        .from("bookings")
        .update({
            status: LEAD_STATUS.VERIFIED,
            confirmed_at: new Date().toISOString(),
        })
        .eq("id", booking.id);

    // Confirmer au client
    await sendLeadConfirmed({
        clientName: booking.client_name,
        phone: booking.phone,
        pickupLocation: booking.pickup_address,
        dropoffLocation: booking.dropoff_address,
        pickupTime: new Date(booking.pickup_time),
        price: booking.price_estimate,
    });

    // Diffuser sur Telegram — le bouton envoie les chauffeurs vers le bot
    // (deep-link /start claim_<bookingId>) pour créer leur session Stripe
    // personnelle et permettre la livraison en DM au bon chauffeur.
    if (!TELEGRAM_BOT_USERNAME) {
        console.warn("⚠️ TELEGRAM_BOT_USERNAME missing — le bouton d'achat ne fonctionnera pas.");
    }

    const broadcast = await broadcastLeadToChannel({
        id: booking.id,
        clientName: booking.client_name || "Client",
        pickupLocation: booking.pickup_address,
        dropoffLocation: booking.dropoff_address,
        pickupTime: new Date(booking.pickup_time),
        price: booking.price_estimate || "Sur devis",
        claimDeepLink: TELEGRAM_BOT_USERNAME
            ? `https://t.me/${TELEGRAM_BOT_USERNAME}?start=claim_${booking.id}`
            : undefined,
    });

    if (broadcast.success && broadcast.messageId && broadcast.chatId) {
        await (supabase as any)
            .from("bookings")
            .update({
                telegram_message_id: broadcast.messageId,
                telegram_chat_id: broadcast.chatId,
            })
            .eq("id", booking.id);
    }

    return { success: true, bookingId: booking.id, broadcast };
}

// ----------------------------------------------------------------------------
// ÉTAPE 2b — Un chauffeur tape "ACHETER" -> /start claim_<bookingId> sur le bot.
// On crée UNE session Stripe PAR chauffeur (livraison DM au bon gagnant).
// ----------------------------------------------------------------------------
export async function handleDriverClaim(chatId: string | number, bookingId: string, username?: string) {
    const { data: booking } = await (supabase as any)
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .maybeSingle();

    if (!booking) {
        return { success: false, reason: "booking_not_found" };
    }

    const status = booking.status as string;
    if (status !== LEAD_STATUS.VERIFIED && status !== LEAD_STATUS.AVAILABLE) {
        // Déjà vendu ou expiré
        return { success: false, reason: "not_available" };
    }

    // Session Stripe personnelle
    const checkout = await createCheckoutSession({
        bookingId: booking.id,
        clientName: booking.client_name,
        priceCents: booking.lead_price_cents || LEAD_PRICE_CENTS,
        description: `${booking.pickup_address} → ${booking.dropoff_address}`,
    });

    if (!checkout.success || !checkout.url) {
        return { success: false, reason: "stripe_failed" };
    }

    // Enregistrer la prétention du chauffeur (pending)
    await (supabase as any)
        .from("lead_claims")
        .insert({
            booking_id: booking.id,
            driver_telegram_id: String(chatId),
            driver_username: username || null,
            stripe_session_id: checkout.sessionId,
            price_cents: booking.lead_price_cents || LEAD_PRICE_CENTS,
            status: "pending",
        });

    // Mémoriser le dernier toucher (fallback livraison)
    await (supabase as any)
        .from("bookings")
        .update({ claimed_by_telegram: String(chatId) })
        .eq("id", booking.id);

    // DM au chauffeur avec SON bouton d'achat
    await sendClaimCheckout(chatId, {
        clientName: booking.client_name || "Client",
        pickupLocation: booking.pickup_address,
        dropoffLocation: booking.dropoff_address,
        pickupTime: new Date(booking.pickup_time),
        price: booking.price_estimate || "Sur devis",
        checkoutUrl: checkout.url,
    });

    return { success: true, bookingId: booking.id, checkoutUrl: checkout.url };
}

// ----------------------------------------------------------------------------
// Stripe Checkout Session
// ----------------------------------------------------------------------------
export async function createCheckoutSession(opts: {
    bookingId: string;
    clientName: string;
    priceCents: number;
    description: string;
}) {
    if (!STRIPE_SECRET_KEY) {
        console.warn("⚠️ STRIPE_SECRET_KEY missing.");
        return { success: false, error: "Missing config" };
    }

    const body = new URLSearchParams({
        mode: "payment",
        success_url: `${SUCCESS_URL}?lead_paid=1`,
        cancel_url: CANCEL_URL,
        client_reference_id: opts.bookingId,
        "line_items[0][quantity]": "1",
        "line_items[0][price_data][currency]": "eur",
        "line_items[0][price_data][unit_amount]": String(opts.priceCents),
        "line_items[0][price_data][product_data][name]": `Lead Taxi — ${opts.description}`,
        "line_items[0][price_data][product_data][description]": `Vente de lead taxi vérifié (client ayant confirmé sa réservation sur WhatsApp).`,
        "metadata[booking_id]": opts.bookingId,
        "payment_intent_data[metadata][booking_id]": opts.bookingId,
    });

    try {
        const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Stripe Checkout error:", data);
            return { success: false, error: data };
        }

        return { success: true, url: data.url as string, sessionId: data.id as string };
    } catch (error) {
        console.error("Stripe fetch error:", error);
        return { success: false, error };
    }
}

// ----------------------------------------------------------------------------
// ÉTAPE 3 — Paiement Stripe confirmé -> vente atomique + livraison DM
// ----------------------------------------------------------------------------
export async function handleCheckoutSuccess(session: {
    id: string;
    client_reference_id?: string;
    payment_intent?: string;
}) {
    // 1. Trouver la prétention du chauffeur liée à cette session
    const { data: claim } = await (supabase as any)
        .from("lead_claims")
        .select("*")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

    const bookingId = session.client_reference_id || claim?.booking_id;

    if (!bookingId) {
        return { success: false, reason: "booking_not_found" };
    }

    const { data: booking } = await (supabase as any)
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .maybeSingle();

    if (!booking) {
        return { success: false, reason: "booking_not_found" };
    }

    const status = booking.status as string;

    // 2. Vente ATOMIQUE : seul le premier paiement passe
    if (status === LEAD_STATUS.SOLD || status === LEAD_STATUS.DELIVERED) {
        // Quelqu'un d'autre a payé avant : on prévient ce chauffeur (trop lent)
        if (claim?.driver_telegram_id) {
            await sendDriverTooSlow(claim.driver_telegram_id);
        }
        return { success: false, reason: "already_sold" };
    }

    const { data: claimed, error: claimError } = await (supabase as any)
        .from("bookings")
        .update({ status: LEAD_STATUS.SOLD, claimed_at: new Date().toISOString() })
        .eq("id", booking.id)
        .in("status", [LEAD_STATUS.VERIFIED, LEAD_STATUS.AVAILABLE])
        .select()
        .single();

    if (claimError || !claimed) {
        if (claim?.driver_telegram_id) {
            await sendDriverTooSlow(claim.driver_telegram_id);
        }
        return { success: false, reason: "already_sold" };
    }

    // 3. Marquer la prétention comme gagnante
    if (claim) {
        await (supabase as any)
            .from("lead_claims")
            .update({
                status: "claimed",
                stripe_payment_intent: session.payment_intent || null,
            })
            .eq("id", claim.id);
    }

    // 4. FOMO : marquer le message du canal comme vendu
    if (booking.telegram_chat_id && booking.telegram_message_id) {
        await editLeadSold(booking.telegram_chat_id, booking.telegram_message_id);
    }

    // 5. Livraison en DM au chauffeur gagnant (celui de la prétention)
    const winnerTelegramId = claim?.driver_telegram_id || booking.claimed_by_telegram;
    if (winnerTelegramId) {
        await sendDriverDM(winnerTelegramId, {
            clientName: booking.client_name || "Client",
            phone: booking.phone,
            pickupLocation: booking.pickup_address,
            dropoffLocation: booking.dropoff_address,
            pickupTime: new Date(booking.pickup_time),
        });
        await (supabase as any)
            .from("bookings")
            .update({ status: LEAD_STATUS.DELIVERED })
            .eq("id", booking.id);
    }

    return { success: true, bookingId: booking.id };
}

// Petit import local pour éviter une dépendance circulaire
import { sendDriverTooSlow } from "@/lib/telegram";
