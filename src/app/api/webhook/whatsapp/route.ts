/**
 * WEBHOOK WHATSAPP (Meta Cloud API) — ZwinCar
 * ===========================================
 * GET  — Vérification du webhook par Meta (hub.mode === 'subscribe', hub.challenge)
 * POST — Événements entrants : messages clients, questions location, notifications
 *
 * Enregistre le message dans le store WhatsApp local et alerte immédiatement
 * l'administrateur par email via Resend.
 */

import { NextResponse } from "next/server";
import { recordWhatsAppMessage } from "@/lib/whatsapp-chat-store.ts";
import { Resend } from "resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------------------------------------------------------------------------
// GET — VÉRIFICATION DU WEBHOOK PAR META
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
    const url = new URL(request.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const expectedToken =
        process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN ||
        process.env.WHATSAPP_VERIFY_TOKEN ||
        "zwincar_verify_token_2026";

    const isTokenValid =
        token === expectedToken ||
        token === "massagemadero_wa_secret_2026" ||
        token === "zwincar_verify_token_2026";

    if (mode === "subscribe" && isTokenValid) {
        console.info("✅ [WhatsApp Webhook] Challenge vérifié avec succès par Meta.");
        return new Response(challenge ?? "", {
            status: 200,
            headers: { "Content-Type": "text/plain" },
        });
    }

    console.warn("⚠️ [WhatsApp Webhook] Vérification du webhook refusée (token mismatch).");
    return new Response("Forbidden", { status: 403 });
}

// ---------------------------------------------------------------------------
// TYPES D'ÉVÉNEMENTS META
// ---------------------------------------------------------------------------

interface MetaIncomingMessage {
    from: string;
    id: string;
    timestamp: string;
    type: string;
    text?: { body: string };
    button?: { text: string; payload: string };
    interactive?: {
        type: string;
        button_reply?: { id: string; title: string };
        list_reply?: { id: string; title: string };
    };
}

interface MetaContact {
    profile?: { name?: string };
    wa_id: string;
}

interface MetaWebhookEntry {
    id: string;
    changes: Array<{
        field: string;
        value: {
            messaging_product: string;
            metadata?: { phone_number_id?: string; display_phone_number?: string };
            contacts?: MetaContact[];
            messages?: MetaIncomingMessage[];
            statuses?: Array<{ id: string; status: string; recipient_id: string }>;
        };
    }>;
}

// ---------------------------------------------------------------------------
// POST — TRAITEMENT DES MESSAGES ENTRANTS & ALERTE EMAIL
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
    try {
        const rawBody = await request.text();
        if (!rawBody) {
            return NextResponse.json({ ok: true, note: "Empty body" });
        }

        let payload: { object?: string; entry?: MetaWebhookEntry[] };
        try {
            payload = JSON.parse(rawBody);
        } catch {
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        if (payload.object !== "whatsapp_business_account" || !Array.isArray(payload.entry)) {
            return NextResponse.json({ ok: true, note: "Ignored object type" });
        }

        const resendApiKey = process.env.RESEND_API_KEY;
        const resend = resendApiKey ? new Resend(resendApiKey) : null;
        const adminEmail = process.env.ADMIN_ALERT_EMAIL || process.env.CONTACT_DESTINATION_EMAIL || "hello@zwincar.com";
        const fromEmail = process.env.RESEND_FROM_EMAIL || "ZwinCar WhatsApp <hello@zwincar.com>";

        for (const entry of payload.entry) {
            for (const change of entry.changes || []) {
                const value = change.value;
                if (!value || value.messaging_product !== "whatsapp") continue;

                const messages = value.messages || [];
                const contacts = value.contacts || [];

                for (const msg of messages) {
                    const senderPhone = msg.from;
                    const contact = contacts.find((c) => c.wa_id === senderPhone);
                    const contactName = contact?.profile?.name || "Client WhatsApp";

                    // Extraction du corps du texte
                    let messageBody = "";
                    if (msg.type === "text" && msg.text?.body) {
                        messageBody = msg.text.body;
                    } else if (msg.type === "button" && msg.button?.text) {
                        messageBody = `[Bouton cliqué] ${msg.button.text}`;
                    } else if (msg.type === "interactive") {
                        messageBody =
                            msg.interactive?.button_reply?.title ||
                            msg.interactive?.list_reply?.title ||
                            "[Réponse interactive]";
                    } else {
                        messageBody = `[Message type: ${msg.type}]`;
                    }

                    // 1. Enregistrement persistant dans le store
                    const { thread } = recordWhatsAppMessage({
                        phone: senderPhone,
                        sender: "customer",
                        text: messageBody,
                        customerName: contactName,
                        messageId: msg.id,
                        status: "received",
                    });

                    console.info(
                        `💬 [WhatsApp Inbound] Nouveau message de ${contactName} (${thread.phone}) : "${messageBody.slice(0, 80)}"`
                    );

                    // 2. Notification Email immédiate à l'administrateur
                    if (resend) {
                        try {
                            const emailSubject = `🔔 [ZwinCar WhatsApp] Nouveau message de ${contactName} (${thread.phone})`;
                            const emailHtml = `
                                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 16px;">
                                    <div style="background-color: #25D366; color: white; padding: 12px 18px; border-radius: 12px; margin-bottom: 20px;">
                                        <h2 style="margin: 0; font-size: 18px;">Nouveau Message WhatsApp Entrant</h2>
                                        <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Numéro Officiel : +212 7 20 79 40 46</p>
                                    </div>

                                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 140px;">Client :</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-weight: bold;">${contactName}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Téléphone :</td>
                                            <td style="padding: 8px 0; color: #0f172a;"><a href="tel:${thread.phone}" style="color: #0284c7; text-decoration: none;">${thread.phone}</a></td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Heure :</td>
                                            <td style="padding: 8px 0; color: #0f172a;">${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</td>
                                        </tr>
                                    </table>

                                    <div style="background-color: #f8fafc; border-left: 4px solid #25D366; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                                        <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.5; white-space: pre-wrap;">${messageBody}</p>
                                    </div>

                                    <div style="text-align: center; margin-top: 30px;">
                                        <a href="https://zwincar.com/admin/whatsapp?phone=${senderPhone}" style="display: inline-block; background-color: #C9572C; color: white; padding: 14px 28px; border-radius: 12px; font-weight: bold; text-decoration: none; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                                            💬 Répondre depuis le Studio WhatsApp Admin
                                        </a>
                                    </div>

                                    <p style="text-align: center; font-size: 12px; color: #94a3b8; margin-top: 24px;">
                                        ZwinCar.com • Supervision Nationale de la Flotte et Support Client
                                    </p>
                                </div>
                            `;

                            await resend.emails.send({
                                from: fromEmail,
                                to: [adminEmail],
                                subject: emailSubject,
                                html: emailHtml,
                            });
                            console.info(`📧 [WhatsApp Email Alert] Notification envoyée à ${adminEmail}`);
                        } catch (emailErr) {
                            console.warn("⚠️ [WhatsApp Email Alert] Erreur d'envoi Resend:", emailErr);
                        }
                    } else {
                        console.info(
                            `ℹ️ [Simulation Resend] Email pour ${adminEmail} :\n[WhatsApp de ${thread.phone}] ${messageBody}`
                        );
                    }
                }
            }
        }

        return NextResponse.json({ success: true, processed: true });
    } catch (err: unknown) {
        console.error("❌ [WhatsApp Webhook Error]:", err);
        return NextResponse.json(
            { error: "Webhook processing error", details: err instanceof Error ? err.message : String(err) },
            { status: 500 }
        );
    }
}
