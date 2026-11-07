/**
 * Meta WhatsApp Cloud API — Client ZwinCar
 *
 * Envoie les alertes instantanées de réservation aux loueurs partenaires (vendors)
 * et aux clients via l'API officielle WhatsApp Cloud de Meta (Graph v21.0).
 * Compatible avec la configuration de expertepilation / massagemadero.
 */

const GRAPH_VERSION = "v21.0";
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

export interface SendWhatsAppTextOptions {
    toPhone: string;
    message: string;
}

export interface WhatsAppSendResult {
    success: boolean;
    simulated?: boolean;
    messageId?: string;
    error?: string;
    errorCode?: number;
    details?: unknown;
}

/**
 * Nettoie et formate les numéros internationaux en format E.164 sans '+' pour Meta
 * - Maroc : "+212 7 20 79 40 46" -> "212720794046", "06 12 34 56 78" -> "212612345678"
 * - France : "+33 6 12 34 56 78" -> "33612345678", "06 12 34 56 78" -> "33612345678"
 */
export function formatWhatsAppRecipientPhone(rawPhone: string, defaultCountry = "212"): string {
    const cleaned = rawPhone.replace(/[^0-9]/g, "");
    if (!cleaned) return "";

    // Si commence déjà par un indicatif pays connu
    if (cleaned.startsWith("212") || cleaned.startsWith("33") || cleaned.startsWith("34") || cleaned.startsWith("31") || cleaned.startsWith("32") || cleaned.startsWith("44")) {
        return cleaned;
    }

    // Format local marocain 06 / 07
    if ((cleaned.startsWith("06") || cleaned.startsWith("07") || cleaned.startsWith("05")) && cleaned.length === 10) {
        return `212${cleaned.slice(1)}`;
    }

    // Format local français 06 / 07
    if (defaultCountry === "33" && (cleaned.startsWith("06") || cleaned.startsWith("07")) && cleaned.length === 10) {
        return `33${cleaned.slice(1)}`;
    }

    return cleaned;
}

/**
 * Envoie un message texte libre via Meta WhatsApp Cloud API
 */
export async function sendWhatsAppDirectText({
    toPhone,
    message,
}: SendWhatsAppTextOptions): Promise<WhatsAppSendResult> {
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN || process.env.WHATSAPP_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    const recipient = formatWhatsAppRecipientPhone(toPhone);
    if (!recipient) {
        return { success: false, error: "Numéro de téléphone destinataire invalide" };
    }

    // Mode simulation si les clés Meta ne sont pas configurées
    if (!accessToken || !phoneNumberId) {
        console.info(
            `ℹ️ [WhatsApp Simulation] Pas de clés Meta configurées — Notification vers ${recipient} :\n${message.slice(0, 120)}...`
        );
        return {
            success: true,
            simulated: true,
            messageId: `sim_${Date.now()}`,
        };
    }

    try {
        const payload = {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: recipient,
            type: "text",
            text: {
                preview_url: true,
                body: message,
            },
        };

        const res = await fetch(`${GRAPH_BASE}/${phoneNumberId}/messages`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = (await res.json()) as {
            messages?: { id: string }[];
            error?: { code?: number; message?: string };
        };

        if (!res.ok) {
            console.error("[WhatsApp Cloud API] Erreur envoi Meta :", JSON.stringify(data));
            return {
                success: false,
                error: data.error?.message || "Erreur API Meta WhatsApp",
                errorCode: data.error?.code,
                details: data,
            };
        }

        const messageId = data.messages?.[0]?.id;
        console.info(`✅ [WhatsApp Cloud API] Message délivré avec succès à ${recipient} (ID: ${messageId})`);
        return {
            success: true,
            messageId,
        };
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Erreur inconnue";
        console.error("[WhatsApp Cloud API] Exception d'envoi :", err);
        return { success: false, error: msg };
    }
}

/**
 * Notifie automatiquement le loueur partenaire du hub lors d'une nouvelle réservation confirmée.
 */
export async function notifyVendorNewBooking(booking: {
    ref: string;
    clientName: string;
    clientPhone: string;
    vehicleName: string;
    hubName: string;
    airportCode?: string;
    meetingPointDetail?: string;
    pickupDate: string;
    pickupTime?: string;
    returnDate: string;
    returnTime?: string;
    days: number;
    balanceOnSiteMad: number;
    balanceOnSiteEur: number;
    hasFranchiseZero: boolean;
    flightNumber?: string;
    vendorPhone?: string;
}): Promise<WhatsAppSendResult> {
    const targetPhone = booking.vendorPhone || process.env.WHATSAPP_VENDOR_ALERT_PHONE || "212720794046";

    const airport = booking.airportCode ? ` (${booking.airportCode})` : "";
    const cautionText = booking.hasFranchiseZero
        ? "0 € (Pack Franchise Zéro souscrit)"
        : "300 € (Caution standard à bloquer/restituer)";

    const message = `🚨 *NOUVELLE RÉSERVATION ZWINCAR — HUB ${booking.hubName.toUpperCase()}${airport}*

📋 *Dossier :* ${booking.ref}
🚗 *Véhicule :* ${booking.vehicleName}
👤 *Client :* ${booking.clientName}
📞 *Tél Client :* ${booking.clientPhone}
✈️ *Vol :* ${booking.flightNumber || "Non spécifié"}
📍 *Point RDV :* ${booking.meetingPointDetail || `Aéroport ${booking.airportCode || ""} P2`}

📅 *Dates :* Du ${booking.pickupDate} (${booking.pickupTime || "11:00"}) au ${booking.returnDate} (${booking.returnTime || "11:00"}) — ${booking.days} jours

💰 *SOLDE À ENCAISSER SUR PLACE :* ${booking.balanceOnSiteMad} MAD (~${booking.balanceOnSiteEur} €)
🛡️ *Caution :* ${cautionText}

👉 *Espace Loueur :* https://zwincar.com/vendor/dashboard`;

    return sendWhatsAppDirectText({
        toPhone: targetPhone,
        message,
    });
}
