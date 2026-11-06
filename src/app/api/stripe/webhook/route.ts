import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getBookingStore } from "@/lib/booking-store";
import { handleCheckoutSuccess } from "@/lib/lead-dispatch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

function verifySignature(payload: string, header: string | null, secret: string): boolean {
    if (!header) return false;
    const parts = header.split(",").reduce<Record<string, string>>((acc, part) => {
        const [key, value] = part.split("=");
        if (key && value) acc[key.trim()] = value.trim();
        return acc;
    }, {});

    const timestamp = parts["t"];
    const signature = parts["v1"];
    if (!timestamp || !signature) return false;

    const computed = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
    const a = Buffer.from(computed, "utf8");
    const b = Buffer.from(signature, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Webhook Stripe — `checkout.session.completed`.
 *
 * 1. Marque le dossier de location comme payé et confirmé (idempotent).
 * 2. Continue d'alimenter l'ancien tunnel "lead taxi" si le metadata.booking_id
 *    est présent, sans casser l'existant.
 */
export async function POST(request: NextRequest) {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (STRIPE_WEBHOOK_SECRET) {
        if (!verifySignature(payload, signature, STRIPE_WEBHOOK_SECRET)) {
            return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
        }
    } else if (process.env.NODE_ENV === "production") {
        // En production, refuser un webhook non signé : sinon n'importe qui peut
        // marquer des réservations comme payées.
        return NextResponse.json({ error: "STRIPE_WEBHOOK_SECRET manquant" }, { status: 500 });
    } else if (!STRIPE_SECRET_KEY) {
        return NextResponse.json({ error: "Stripe non configuré" }, { status: 500 });
    }

    let event: { type?: string; data?: { object?: Record<string, unknown> } };
    try {
        event = JSON.parse(payload);
    } catch {
        return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = (event.data?.object ?? {}) as Record<string, unknown>;
        const metadata = (session.metadata ?? {}) as Record<string, unknown>;
        const ref =
            (typeof metadata.ref === "string" && metadata.ref) ||
            (typeof session.client_reference_id === "string" ? session.client_reference_id : "");

        if (ref && ref.startsWith("ZW-")) {
            try {
                const store = getBookingStore();
                const record = await store.get(ref.toUpperCase());

                if (record) {
                    const amountPaid =
                        typeof session.amount_total === "number" ? session.amount_total / 100 : record.quote.acompteEur;
                    const now = new Date().toISOString();

                    const updated = {
                        ...record,
                        status:
                            record.status === "awaiting_payment" ? ("confirmed" as const) : record.status,
                        paidEur: Math.max(record.paidEur, Math.round(amountPaid)),
                        pendingPayment: undefined,
                        stripeSessionId: typeof session.id === "string" ? session.id : record.stripeSessionId,
                        updatedAt: now,
                        events: [
                            ...record.events,
                            {
                                at: now,
                                type: "payment_confirmed",
                                actor: "system" as const,
                                note: `${amountPaid} € via Stripe`,
                            },
                        ],
                    };

                    try {
                        await store.save(updated, record.version);
                    } catch (error) {
                        // Double livraison du webhook : ce n'est pas une erreur bloquante.
                        console.warn("Webhook: dossier déjà mis à jour", ref, error);
                    }
                }
            } catch (error) {
                console.error("Webhook booking update error:", error);
                return NextResponse.json({ error: "Mise à jour impossible" }, { status: 500 });
            }
        }

        // Compatibilité tunnel taxi existant.
        if (typeof metadata.booking_id === "string") {
            try {
                await handleCheckoutSuccess({
                    id: String(session.id ?? ""),
                    client_reference_id: metadata.booking_id,
                    payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
                });
            } catch (error) {
                console.error("Legacy lead dispatch error:", error);
            }
        }
    }

    return NextResponse.json({ received: true });
}
