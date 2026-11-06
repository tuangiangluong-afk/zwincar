import { NextRequest, NextResponse } from "next/server";
import { handleDriverClaim } from "@/lib/lead-dispatch";
import { sendDriverWelcome } from "@/lib/telegram";

/**
 * Webhook Telegram (BotFather -> /setwebhook)
 * URL : https://<votre-domaine>/api/telegram/webhook
 *
 * Gère :
 * - /start (accueil du chauffeur)
 * - /start claim_<bookingId> (le chauffeur veut acheter un lead précis)
 */
export async function POST(request: NextRequest) {
    const body = await request.json();

    const message = body?.message;
    if (!message) {
        return NextResponse.json({ ok: true });
    }

    const chatId = message.chat?.id;
    const username = message.chat?.username || message.from?.username || message.from?.first_name;
    const text = (message.text || "").trim();

    if (!chatId) {
        return NextResponse.json({ ok: true });
    }

    try {
        // /start claim_<bookingId>
        const claimMatch = text.match(/^\/start\s+claim_(.+)$/i);
        if (claimMatch) {
            const bookingId = claimMatch[1];
            const result = await handleDriverClaim(chatId, bookingId, username);
            console.log("Telegram claim:", chatId, bookingId, JSON.stringify(result));
        } else if (text.startsWith("/start")) {
            await sendDriverWelcome(chatId, message.from?.first_name);
        }
    } catch (error) {
        console.error("Telegram webhook error:", error);
    }

    return NextResponse.json({ ok: true });
}
