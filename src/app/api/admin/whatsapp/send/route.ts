import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminFromToken } from "@/lib/admin-auth.ts";
import { sendWhatsAppDirectText } from "@/lib/whatsapp.ts";
import { recordWhatsAppMessage, getWhatsAppThreadById } from "@/lib/whatsapp-chat-store.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("zwincar_admin_token")?.value;
        const admin = token ? getAdminFromToken(token) : null;

        const authHeader = request.headers.get("authorization");
        const isHeaderAuthed = authHeader && authHeader.replace(/^Bearer\s+/i, "") === (process.env.ADMIN_JWT_SECRET || "zwincar_admin_secret_key_2026");

        if (!admin && !isHeaderAuthed) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const body = await request.json();
        const { phone, message } = body;

        if (!phone || typeof phone !== "string" || !phone.trim()) {
            return NextResponse.json({ error: "Numéro de téléphone requis" }, { status: 400 });
        }

        if (!message || typeof message !== "string" || !message.trim()) {
            return NextResponse.json({ error: "Le message ne peut pas être vide" }, { status: 400 });
        }

        const cleanPhone = phone.trim();
        const cleanMessage = message.trim();

        // 1. Envoi officiel via Meta WhatsApp Cloud API
        const sendResult = await sendWhatsAppDirectText({
            toPhone: cleanPhone,
            message: cleanMessage,
        });

        if (!sendResult.success) {
            return NextResponse.json(
                {
                    error: sendResult.error || "Échec de l'envoi WhatsApp via Meta",
                    details: sendResult.details,
                },
                { status: 502 }
            );
        }

        // 2. Enregistrement dans la conversation
        const { thread, message: recordedMsg } = recordWhatsAppMessage({
            phone: cleanPhone,
            sender: "admin",
            text: cleanMessage,
            messageId: sendResult.messageId,
            status: sendResult.simulated ? "sent" : "delivered",
        });

        return NextResponse.json({
            success: true,
            messageId: sendResult.messageId,
            simulated: sendResult.simulated || false,
            message: recordedMsg,
            thread,
        });
    } catch (err: unknown) {
        console.error("❌ [API /admin/whatsapp/send] Error:", err);
        return NextResponse.json(
            { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
            { status: 500 }
        );
    }
}
