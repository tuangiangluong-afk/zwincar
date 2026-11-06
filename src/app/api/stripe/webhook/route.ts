import { NextRequest, NextResponse } from "next/server";
import { handleCheckoutSuccess } from "@/lib/lead-dispatch";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

/**
 * Webhook Stripe (Dashboard > Développeurs > Webhooks)
 * URL : https://<votre-domaine>/api/stripe/webhook
 * Événement à abonner : checkout.session.completed
 *
 * Déclenche la vente atomique (premier payé = gagnant), le message
 * "VENDU" sur le canal Telegram (FOMO) et la livraison du numéro en DM.
 */
export async function POST(request: NextRequest) {
    const payload = await request.text();
    const signature = request.headers.get("stripe-signature");

    // Vérification de signature (nécessite le secret du webhook Stripe)
    if (STRIPE_WEBHOOK_SECRET && signature) {
        const crypto = await import("node:crypto");
        const [t, sig] = (signature || "").split(",").map((s) => s.trim());
        const timestamp = t?.split("=")[1];
        const expectedSig = sig?.split("=")[1];

        const signedPayload = `${timestamp}.${payload}`;
        const computed = crypto
            .createHmac("sha256", STRIPE_WEBHOOK_SECRET)
            .update(signedPayload)
            .digest("hex");

        if (computed !== expectedSig) {
            return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
        }
    } else if (!STRIPE_SECRET_KEY) {
        // Pas de config du tout -> on refuse
        return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    let event;
    try {
        event = JSON.parse(payload);
    } catch {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        try {
            const result = await handleCheckoutSuccess({
                id: session.id,
                client_reference_id: session.client_reference_id || session.metadata?.booking_id,
                payment_intent: session.payment_intent || null,
            });
            console.log("Checkout completed:", JSON.stringify(result));
        } catch (error) {
            console.error("Checkout completion error:", error);
        }
    }

    return NextResponse.json({ received: true });
}
