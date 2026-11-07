import { NextResponse } from "next/server";
import Stripe from "stripe";
import { cancellationPolicy, isCancellable } from "@/lib/booking-engine";
import { VersionConflictError, getBookingStore } from "@/lib/booking-store";
import { authorizeBooking, jsonError, readJson, unauthorized } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ ref: string }> }) {
    const { ref } = await params;
    const body = (await readJson(request)) ?? {};

    const store = getBookingStore();
    const record = await store.get(ref.toUpperCase());

    const token = typeof body.token === "string" ? body.token : null;
    const email = typeof body.email === "string" ? body.email : null;
    if (!authorizeBooking(record, { token, email })) return unauthorized();

    if (!isCancellable(record.status)) {
        return jsonError("Ce dossier ne peut plus être annulé en ligne.", 409, { status: record.status });
    }

    const policy = cancellationPolicy(record, new Date());
    if (!policy.allowed) return jsonError(policy.message, 409);

    const now = new Date().toISOString();
    const updated = {
        ...record,
        status: "cancelled" as const,
        updatedAt: now,
        events: [
            ...record.events,
            {
                at: now,
                type: "booking_cancelled",
                actor: "client" as const,
                note: `${policy.tier} · remboursement ${policy.refundEur} €`,
            },
        ],
    };

    try {
        let saved = await store.save(updated, record.version);
        // Remboursement après l'enregistrement de l'annulation : un échec Stripe laisse une trace à traiter à la main, jamais un remboursement sans annulation.
        const refund = await refundDeposit(saved.ref, saved.stripeSessionId, policy.refundEur);
        if (refund) {
            try {
                saved = await store.save(
                    { ...saved, updatedAt: new Date().toISOString(), events: [...saved.events, { at: new Date().toISOString(), type: refund.type, actor: "system" as const, note: refund.note }] },
                    saved.version
                );
            } catch (error) {
                console.error("Refund event not saved:", saved.ref, refund, error);
            }
        }
        return NextResponse.json(
            { status: saved.status, policy, refundEur: policy.refundEur, creditNoteEur: policy.creditNoteEur, refundStatus: refund?.type ?? "none" },
            { headers: { "Cache-Control": "private, no-store" } }
        );
    } catch (error) {
        if (error instanceof VersionConflictError) {
            return jsonError("Le dossier a changé entre-temps, rechargez la page.", 409);
        }
        console.error("Cancel error:", error);
        return jsonError("Annulation impossible pour le moment.", 500);
    }
}

/** Rembourse l'acompte via Stripe, plafonné au montant encore remboursable du dernier paiement. */
async function refundDeposit(ref: string, sessionId: string | undefined, refundEur: number) {
    if (refundEur <= 0) return null;
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || !sessionId) {
        return { type: "refund_manual_required", note: `${refundEur} € à rembourser manuellement (pas de paiement Stripe lié)` };
    }
    try {
        const stripe = new Stripe(key, { apiVersion: "2025-01-27.acacia" as never });
        const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ["payment_intent.latest_charge"] });
        const intent = session.payment_intent as Stripe.PaymentIntent | null;
        const charge = intent?.latest_charge as Stripe.Charge | null | undefined;
        if (!intent || !charge) throw new Error("payment intent introuvable");
        const wantedCents = Math.round(refundEur * 100);
        const cents = Math.min(wantedCents, charge.amount_captured - charge.amount_refunded);
        if (cents <= 0) return { type: "refund_manual_required", note: `${refundEur} € : rien de remboursable sur ${intent.id}` };
        await stripe.refunds.create(
            { payment_intent: intent.id, amount: cents, metadata: { ref } },
            { idempotencyKey: `cancel-refund-${ref}` }
        );
        // shortcut: only the latest Stripe session is refunded; after a paid date change the remainder is flagged for manual refund.
        const rest = (wantedCents - cents) / 100;
        return rest > 0
            ? { type: "refund_partial_manual", note: `${cents / 100} € remboursés via Stripe, ${rest} € à rembourser manuellement` }
            : { type: "refund_issued", note: `${cents / 100} € remboursés via Stripe (${intent.id})` };
    } catch (error) {
        console.error("Stripe refund error:", ref, error);
        return { type: "refund_failed", note: `${refundEur} € : échec du remboursement Stripe, à traiter manuellement` };
    }
}
