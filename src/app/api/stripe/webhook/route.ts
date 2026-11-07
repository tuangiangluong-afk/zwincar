import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getBookingStore } from "@/lib/booking-store";
import { notifyVendorNewBooking } from "@/lib/whatsapp";
import { getVendorPhoneForHub } from "@/lib/vendor-store";

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

                        // Déclenchement automatique de l'email de confirmation dès validation Stripe
                        const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";
                        fetch(`${siteOrigin}/api/booking/send-confirmation`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                bookingRef: updated.ref,
                                clientName: updated.client.fullName,
                                clientEmail: updated.client.email,
                                vehicleName: updated.rental.vehicleName,
                                hubName: updated.rental.hubName,
                                airportCode: updated.rental.airportCode,
                                meetingPointDetail: updated.rental.meetingPointDetail,
                                pickupDate: updated.rental.pickupDate,
                                returnDate: updated.rental.returnDate,
                                days: updated.rental.days,
                                depositAcompteEur: updated.paidEur,
                                balanceOnSiteEur: updated.quote.balanceEur,
                                balanceOnSiteMad: updated.quote.balanceMad,
                                hasFranchiseZero: updated.quote.hasZeroDeposit,
                                locale: updated.locale || "fr",
                            }),
                        }).catch((err) => console.error("Webhook async email error:", err));

                        // Alerte instantanée WhatsApp au loueur du hub (ou au numéro officiel ZwinCar)
                        const vendorPhone = getVendorPhoneForHub(updated.rental.pickupHub) || "212720794046";
                        notifyVendorNewBooking({
                            ref: updated.ref,
                            clientName: updated.client.fullName,
                            clientPhone: updated.client.phone,
                            vehicleName: updated.rental.vehicleName,
                            hubName: updated.rental.hubName,
                            airportCode: updated.rental.airportCode,
                            meetingPointDetail: updated.rental.meetingPointDetail,
                            pickupDate: updated.rental.pickupDate,
                            pickupTime: updated.rental.pickupTime,
                            returnDate: updated.rental.returnDate,
                            returnTime: updated.rental.returnTime,
                            days: updated.rental.days,
                            balanceOnSiteMad: updated.quote.balanceMad,
                            balanceOnSiteEur: updated.quote.balanceEur,
                            hasFranchiseZero: updated.quote.hasZeroDeposit,
                            flightNumber: updated.client.flightNumber,
                            vendorPhone,
                        }).catch((err) => console.error("Webhook async WhatsApp alert error:", err));
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
    }

    return NextResponse.json({ received: true });
}
