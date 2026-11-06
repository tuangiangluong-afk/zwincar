import { BookingDetails, generateGoogleCalendarLink } from "./calendar";

const META_API_VERSION = "v18.0";
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const DRIVER_PHONE_NUMBER = process.env.DRIVER_PHONE_NUMBER; // The driver receiving leads

interface MetaSendResult {
    success: boolean;
    error?: unknown;
    data?: unknown;
}

async function sendMessage(to: string, payload: Record<string, unknown>): Promise<MetaSendResult> {
    if (!META_PHONE_NUMBER_ID || !META_ACCESS_TOKEN) {
        console.warn("⚠️ Meta WhatsApp API keys missing.");
        return { success: false, error: "Missing config" };
    }

    const url = `https://graph.facebook.com/${META_API_VERSION}/${META_PHONE_NUMBER_ID}/messages`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${META_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to,
                ...payload,
            }),
        });

        const data = await response.json();
        if (!response.ok) {
            console.error("Meta API Error:", data);
            return { success: false, error: data };
        }

        return { success: true, data };
    } catch (error) {
        console.error("Send WhatsApp Error:", error);
        return { success: false, error };
    }
}

/**
 * ÉTAPE 1 — Double opt-in client.
 * Envoie un message TEMPLATE approuvé Meta (catégorie "utility") demandant
 * de répondre OUI pour confirmer la réservation et la diffuser aux chauffeurs.
 *
 * ⚠️ REQUIS : créer le template "lead_confirmation" dans Meta Business Manager
 * (WhatsApp > Gestion des messages > Modèles de messages), langue FR :
 *   Corps : "Bonjour {{1}}, votre demande de taxi est bien reçue.
 *            Pour confirmer votre réservation et l'envoyer à nos chauffeurs,
 *            répondez simplement OUI."
 * Composant : {{1}} = nom du client (ex. "Marie").
 *
 * Le template est OBLIGATOIRE pour les messages initiés par l'entreprise
 * (les 1000 premières conversations "service" du mois sont gratuites).
 */
export async function sendLeadConfirmation(
    booking: BookingDetails,
    opts?: { templateName?: string }
): Promise<MetaSendResult> {
    const templateName = opts?.templateName || "lead_confirmation";
    const clientFirstName = (booking.clientName || "Client").split(" ")[0];

    return sendMessage(booking.phone, {
        type: "template",
        template: {
            name: templateName,
            language: { code: "fr" },
            components: [
                {
                    type: "body",
                    parameters: [{ type: "text", text: clientFirstName }],
                },
            ],
        },
    });
}

/**
 * Message de relance (24h après) si le client n'a pas répondu OUI.
 * Utilise le même template (conversation déjà ouverte -> texte libre possible).
 */
export async function sendLeadReminder(booking: BookingDetails): Promise<MetaSendResult> {
    const clientFirstName = (booking.clientName || "Client").split(" ")[0];
    const text = `Bonjour ${clientFirstName}, votre demande de taxi (${booking.pickupLocation} → ${booking.dropoffLocation}) est toujours en attente. Répondez OUI pour confirmer et l'envoyer à nos chauffeurs.`;

    return sendMessage(booking.phone, {
        type: "text",
        text: { preview_url: false, body: text },
    });
}

/**
 * Message de confirmation au client après son OUI.
 */
export async function sendLeadConfirmed(booking: BookingDetails): Promise<MetaSendResult> {
    const clientFirstName = (booking.clientName || "Client").split(" ")[0];
    const formattedDate = new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Europe/Paris",
    }).format(booking.pickupTime);

    const text = `✅ Merci ${clientFirstName} ! Votre taxi est confirmé :\n📍 Départ : ${booking.pickupLocation}\n🏁 Arrivée : ${booking.dropoffLocation}\n🕒 ${formattedDate}\n\nUn chauffeur vous contactera très rapidement. À très vite ! 🚕`;

    return sendMessage(booking.phone, {
        type: "text",
        text: { preview_url: false, body: text },
    });
}

/**
 * Notification au chauffeur/répartiteur quand un lead est VERIFIÉ (OUI reçu).
 * Le lead n'est plus diffusé ici : il part sur Telegram (voir telegram.ts).
 * Cette fonction reste pour la sauvegarde / notification directe.
 */
export async function sendLeadToDriver(booking: BookingDetails): Promise<MetaSendResult> {
    if (!DRIVER_PHONE_NUMBER) {
        console.warn("⚠️ DRIVER_PHONE_NUMBER missing.");
        return { success: false, error: "Missing config" };
    }

    const calendarUrl = generateGoogleCalendarLink(booking);
    const formattedDate = new Intl.DateTimeFormat("fr-FR", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Europe/Paris",
    }).format(booking.pickupTime);

    const messageBody = `🚖 *NOUVEAU LEAD CONFIRMÉ (OUI WhatsApp)*\n------------------\n👤 *${booking.clientName}*\n📞 ${booking.phone}\n\n📍 *De :* ${booking.pickupLocation}\n🏁 *Vers :* ${booking.dropoffLocation}\n🕒 *Date :* ${formattedDate}\n💰 *Prix Est. :* ${booking.price || "Sur devis"}\n\n👇 *ACTIONS :*\n📅 *Ajouter au Planning :*\n${calendarUrl}\n`;

    return sendMessage(DRIVER_PHONE_NUMBER, {
        type: "text",
        text: { preview_url: false, body: messageBody },
    });
}
