import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            bookingRef,
            amountEur,
            vehicleName,
            hubName,
            customerEmail,
            customerName,
            days,
            pickupDate,
            returnDate,
        } = body;

        if (!bookingRef || !amountEur) {
            return NextResponse.json(
                { error: "Paramètres manquants (bookingRef et amountEur requis)" },
                { status: 400 }
            );
        }

        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
        const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

        // Si la clé Stripe n'est pas encore configurée dans .env.local, fallback élégant et sécurisé
        if (!stripeSecretKey) {
            return NextResponse.json({
                url: `${origin}/booking/${bookingRef}?payment_mode=mock`,
                isMock: true,
                message: "Stripe en mode simulation locale",
            });
        }

        const stripe = new Stripe(stripeSecretKey, {
            apiVersion: "2025-01-27.acacia" as any,
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            customer_email: customerEmail || undefined,
            client_reference_id: bookingRef,
            metadata: {
                bookingRef,
                vehicleName,
                hubName,
                customerName: customerName || "Voyageur ZwinCar",
                pickupDate,
                returnDate,
                days: String(days || 1),
            },
            line_items: [
                {
                    price_data: {
                        currency: "eur",
                        unit_amount: Math.round(Number(amountEur) * 100),
                        product_data: {
                            name: `Acompte Réservation • ${vehicleName}`,
                            description: `Location à ${hubName} du ${pickupDate} au ${returnDate} (${days}j). Modèle garanti & Caution Franchise Zéro.`,
                        },
                    },
                    quantity: 1,
                },
            ],
            success_url: `${origin}/booking/${bookingRef}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/booking/${bookingRef}?canceled=true`,
        });

        return NextResponse.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json(
            { error: error?.message || "Erreur de création de session Stripe" },
            { status: 500 }
        );
    }
}
