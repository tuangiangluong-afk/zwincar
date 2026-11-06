import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { authorizeBooking } from "@/lib/api-helpers";
import { getBookingStore } from "@/lib/booking-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Création de la session Stripe.
 *
 * Sécurité : le montant n'est JAMAIS lu depuis le corps de la requête. Il est
 * relu dans le dossier serveur (acompte de 20 %, ou complément après
 * modification de dates). Un client malveillant ne peut donc pas payer 1 €
 * pour une location de 400 €.
 */
export async function POST(request: NextRequest) {
    let body: Record<string, unknown>;
    try {
        body = (await request.json()) as Record<string, unknown>;
    } catch {
        return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
    }

    const ref = typeof body.ref === "string" ? body.ref.toUpperCase() : "";
    const token = typeof body.token === "string" ? body.token : null;
    const email = typeof body.email === "string" ? body.email : null;

    if (!ref) {
        return NextResponse.json(
            { error: "Référence de dossier requise. Le montant est calculé côté serveur." },
            { status: 400 }
        );
    }

    const store = getBookingStore();
    const record = await store.get(ref);

    if (!authorizeBooking(record, { token, email })) {
        return NextResponse.json({ error: "Dossier introuvable" }, { status: 404 });
    }

    if (record.status !== "awaiting_payment" && record.status !== "confirmed") {
        return NextResponse.json({ error: "Ce dossier n'attend plus de paiement" }, { status: 409 });
    }

    const amountEur = record.pendingPayment?.amountEur ?? record.quote.acompteEur;
    if (!Number.isFinite(amountEur) || amountEur <= 0) {
        return NextResponse.json({ error: "Montant invalide" }, { status: 422 });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const origin =
        request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Mode simulation locale : sans clé Stripe, on ne peut pas encaisser. On
    // confirme le dossier uniquement hors production (ou sur opt-in explicite),
    // sinon un site déployé sans clé confirmerait des locations impayées.
    if (!stripeSecretKey) {
        const mockAllowed = process.env.NODE_ENV !== "production" || process.env.ALLOW_MOCK_PAYMENTS === "true";
        if (!mockAllowed) {
            return NextResponse.json(
                { error: "Paiement indisponible : STRIPE_SECRET_KEY non configurée." },
                { status: 503 }
            );
        }

        const now = new Date().toISOString();
        const updated = {
            ...record,
            status: record.status === "awaiting_payment" ? ("confirmed" as const) : record.status,
            paidEur: Math.max(record.paidEur, amountEur),
            pendingPayment: undefined,
            updatedAt: now,
            events: [
                ...record.events,
                {
                    at: now,
                    type: "payment_simulated",
                    actor: "system" as const,
                    note: `${amountEur} € (mode démo, sans Stripe)`,
                },
            ],
        };

        try {
            await store.save(updated, record.version);
        } catch (error) {
            console.warn("Paiement simulé : dossier déjà mis à jour", error);
        }

        return NextResponse.json({
            url: `${origin}/booking/${record.ref}?t=${record.accessToken}&payment_mode=mock`,
            isMock: true,
            amountEur,
            message: "Stripe en mode simulation locale — dossier confirmé pour test.",
        });
    }

    const stripe = new Stripe(stripeSecretKey, { apiVersion: "2025-01-27.acacia" as never });

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: record.client.email,
            client_reference_id: record.ref,
            metadata: {
                ref: record.ref,
                kind: record.pendingPayment ? "change" : "deposit",
                vehicleName: record.rental.vehicleName,
                hubName: record.rental.hubName,
                pickupDate: record.rental.pickupDate,
                returnDate: record.rental.returnDate,
                days: String(record.quote.days),
            },
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        unit_amount: Math.round(amountEur * 100),
                        product_data: {
                            name: record.pendingPayment
                                ? `Complément modification — ${record.rental.vehicleName}`
                                : `Acompte réservation — ${record.rental.vehicleName}`,
                            description: `${record.ref} · ${record.rental.hubName} du ${record.rental.pickupDate} au ${record.rental.returnDate} (${record.quote.days} j).`,
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${origin}/booking/${record.ref}?t=${record.accessToken}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/booking/${record.ref}?t=${record.accessToken}&canceled=true`,
        });

        return NextResponse.json({ url: session.url, sessionId: session.id, amountEur });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Erreur Stripe" },
            { status: 502 }
        );
    }
}
