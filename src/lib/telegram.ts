const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID; // ex: -1001234567890 (canal des chauffeurs)

const API = "https://api.telegram.org/bot" + (TELEGRAM_BOT_TOKEN || "");

interface TelegramResult {
    success: boolean;
    error?: unknown;
    data?: unknown;
}

async function call(method: string, payload: Record<string, unknown>): Promise<TelegramResult> {
    if (!TELEGRAM_BOT_TOKEN) {
        console.warn("⚠️ TELEGRAM_BOT_TOKEN missing.");
        return { success: false, error: "Missing config" };
    }

    try {
        const response = await fetch(`${API}/${method}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!data.ok) {
            console.error(`Telegram ${method} error:`, data);
            return { success: false, error: data };
        }
        return { success: true, data };
    } catch (error) {
        console.error(`Telegram ${method} fetch error:`, error);
        return { success: false, error };
    }
}

function formatDate(pickupTime: Date): string {
    return new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Europe/Paris",
    }).format(pickupTime);
}

export interface BroadcastLead {
    id: string;
    clientName: string;
    pickupLocation: string;
    dropoffLocation: string;
    pickupTime: Date;
    price: string;
    checkoutUrl?: string;
    claimDeepLink?: string; // https://t.me/<bot>?start=claim_<bookingId>
}

/**
 * ÉTAPE 2 — Diffusion sur le canal Telegram (l'arène).
 * Envoie le lead avec un bouton inline pointant vers la session Stripe.
 * Retourne { messageId, chatId } pour pouvoir éditer le message (FOMO) ensuite.
 */
export async function broadcastLeadToChannel(lead: BroadcastLead): Promise<TelegramResult & { messageId?: number; chatId?: string }> {
    if (!TELEGRAM_CHANNEL_ID) {
        console.warn("⚠️ TELEGRAM_CHANNEL_ID missing.");
        return { success: false, error: "Missing config" };
    }

    const text = [
        "🟢 *NOUVEAU LEAD VÉRIFIÉ (Client confirmé WhatsApp)*",
        "──────────────────",
        `📍 *Départ :* ${lead.pickupLocation}`,
        `🏁 *Arrivée :* ${lead.dropoffLocation}`,
        `📅 *Date :* ${formatDate(lead.pickupTime)}`,
        `💰 *Valeur Estimée :* ~${lead.price}`,
        "",
        `🛒 *Prix du Lead :* 5.00 €`,
        "👇 *Le premier qui paie reçoit le numéro du client en DM.*",
    ].join("\n");

    // Le bouton pointe soit vers la session Stripe (legacy), soit vers le
    // deep-link du bot (recommandé) pour créer une session par chauffeur
    // et permettre la livraison du numéro en DM au bon gagnant.
    const buttonUrl = lead.claimDeepLink || lead.checkoutUrl;
    if (!buttonUrl) {
        console.warn("⚠️ Pas d'URL d'achat pour le broadcast Telegram.");
        return { success: false, error: "Missing buy url" };
    }

    const result = await call("sendMessage", {
        chat_id: TELEGRAM_CHANNEL_ID,
        text,
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🛒 ACHETER CE LEAD (5€)", url: buttonUrl }],
            ],
        },
    });

    if (result.success && (result.data as any)?.result) {
        return {
            ...result,
            messageId: (result.data as any).result.message_id as number,
            chatId: TELEGRAM_CHANNEL_ID,
        };
    }
    return result;
}

/**
 * ÉTAPE 3b — FOMO : édite le message du canal une fois le lead vendu.
 */
export async function editLeadSold(chatId: string, messageId: number): Promise<TelegramResult> {
    const text = [
        "🔴 *TROP TARD — COURSE VENDUE*",
        "──────────────────",
        "Ce lead vient d'être acheté par un autre chauffeur.",
        "💪 *La prochaine fois, soyez plus rapide !*",
        "",
        "🔔 Activez les notifications du canal pour ne rien rater.",
    ].join("\n");

    return call("editMessageText", {
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: "Markdown",
    });
}

/**
 * ÉTAPE 3c — Livraison : envoie le numéro du client en DM au chauffeur gagnant.
 */
export async function sendDriverDM(telegramUserId: string | number, lead: {
    clientName: string;
    phone: string;
    pickupLocation: string;
    dropoffLocation: string;
    pickupTime: Date;
}): Promise<TelegramResult> {
    const text = [
        "✅ *PAIEMENT REÇU — VOICI VOTRE CLIENT*",
        "──────────────────",
        `👤 *Nom :* ${lead.clientName}`,
        `📞 *Téléphone :* ${lead.phone}`,
        "",
        `📍 *Départ :* ${lead.pickupLocation}`,
        `🏁 *Arrivée :* ${lead.dropoffLocation}`,
        `🕒 *Date :* ${formatDate(lead.pickupTime)}`,
        "",
        "Bonnes routes ! 🚕",
    ].join("\n");

    return call("sendMessage", {
        chat_id: telegramUserId,
        text,
        parse_mode: "Markdown",
    });
}

/**
 * Message d'accueil quand un chauffeur démarre le bot.
 */
export async function sendDriverWelcome(telegramUserId: string | number, firstName?: string): Promise<TelegramResult> {
    const text = [
        `🚕 Bienvenue${firstName ? ` ${firstName}` : ""} dans la *Bourse aux Leads Taxi France* !`,
        "",
        "📲 Vous recevrez ici les leads vérifiés (client ayant confirmé sur WhatsApp).",
        "🛒 Pour acheter un lead : cliquez sur le bouton *ACHETER*.",
        "✅ Le premier payé reçoit le numéro du client en message privé.",
        "",
        "💡 Astuce : activez les notifications pour être le plus rapide !",
    ].join("\n");

    return call("sendMessage", {
        chat_id: telegramUserId,
        text,
        parse_mode: "Markdown",
    });
}

/**
 * DM avec le bouton d'achat personnel du chauffeur (sa session Stripe).
 */
export async function sendClaimCheckout(telegramUserId: string | number, lead: {
    clientName: string;
    pickupLocation: string;
    dropoffLocation: string;
    pickupTime: Date;
    price: string;
    checkoutUrl: string;
}): Promise<TelegramResult> {
    const text = [
        "🟢 *Lead disponible !*",
        "──────────────────",
        `📍 *Départ :* ${lead.pickupLocation}`,
        `🏁 *Arrivée :* ${lead.dropoffLocation}`,
        `📅 *Date :* ${formatDate(lead.pickupTime)}`,
        `💰 *Valeur Estimée :* ~${lead.price}`,
        "",
        "⚠️ *Premier payé, premier servi.*",
        "Si quelqu'un paie avant vous, vous serez remboursé automatiquement.",
    ].join("\n");

    return call("sendMessage", {
        chat_id: telegramUserId,
        text,
        parse_mode: "Markdown",
        reply_markup: {
            inline_keyboard: [
                [{ text: "🛒 PAYER 5€ ET RECEVOIR LE CLIENT", url: lead.checkoutUrl }],
            ],
        },
    });
}

/**
 * Message "trop lent" : le lead a déjà été acheté par un autre chauffeur.
 */
export async function sendDriverTooSlow(telegramUserId: string | number): Promise<TelegramResult> {
    const text = [
        "⏱️ *TROP LENT — lead déjà vendu*",
        "──────────────────",
        "Un autre chauffeur a payé avant vous.",
        "💳 Votre paiement ne sera pas débité (ou sera remboursé s'il était en cours).",
        "",
        "🔔 Activez les notifications du canal et soyez le plus rapide la prochaine fois !",
    ].join("\n");

    return call("sendMessage", {
        chat_id: telegramUserId,
        text,
        parse_mode: "Markdown",
    });
}
