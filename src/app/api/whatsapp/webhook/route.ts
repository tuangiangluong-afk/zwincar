import { NextRequest, NextResponse } from "next/server";
import { handleLeadConfirmationReply } from "@/lib/lead-dispatch";

const META_VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN;

/**
 * GET — Vérification du webhook par Meta (abonnement aux messages entrants).
 * Dans Meta Business Manager > WhatsApp > Configuration API :
 * URL de rappel : https://<votre-domaine>/api/whatsapp/webhook
 * Jeton de vérification : la valeur de META_WEBHOOK_VERIFY_TOKEN
 * Champs à abonner : messages
 */
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    if (mode === "subscribe" && token === META_VERIFY_TOKEN && challenge) {
        return new NextResponse(challenge, { status: 200 });
    }

    return new NextResponse("Forbidden", { status: 403 });
}

/**
 * POST — Réception des messages entrants.
 * Dès qu'un client répond "OUI" à la confirmation, on vérifie le lead
 * et on le diffuse sur Telegram avec un bouton d'achat.
 */
export async function POST(request: NextRequest) {
    const body = await request.json();

    // Meta envoie des notifications d'état aussi ; on ne traite que les messages
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    if (!value?.messages?.[0]) {
        return NextResponse.json({ received: true, ignored: "no_message" });
    }

    const message = value.messages[0];
    const waId = value.contacts?.[0]?.wa_id || message.from;

    // On ne traite que les messages texte
    if (message.type !== "text") {
        return NextResponse.json({ received: true, ignored: "not_text" });
    }

    const text = message.text?.body || "";

    try {
        const result = await handleLeadConfirmationReply(waId, text);
        console.log("WhatsApp reply handled:", waId, JSON.stringify(result));
    } catch (error) {
        console.error("WhatsApp webhook handler error:", error);
    }

    return NextResponse.json({ received: true });
}
