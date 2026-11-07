import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminFromToken } from "@/lib/admin-auth.ts";
import { getAllWhatsAppThreads, getWhatsAppThreadById, markWhatsAppThreadAsRead } from "@/lib/whatsapp-chat-store.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("zwincar_admin_token")?.value;
        const admin = token ? getAdminFromToken(token) : null;

        // Autoriser aussi le bearer token en header pour les tests et integrations
        const authHeader = request.headers.get("authorization");
        const isHeaderAuthed = authHeader && authHeader.replace(/^Bearer\s+/i, "") === (process.env.ADMIN_JWT_SECRET || "zwincar_admin_secret_key_2026");

        if (!admin && !isHeaderAuthed) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const url = new URL(request.url);
        const phone = url.searchParams.get("phone");

        if (phone) {
            markWhatsAppThreadAsRead(phone);
            const thread = getWhatsAppThreadById(phone);
            return NextResponse.json({ success: true, thread });
        }

        const threads = getAllWhatsAppThreads();
        const totalUnread = threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);

        return NextResponse.json({
            success: true,
            threads,
            totalUnread,
            count: threads.length,
        });
    } catch (err: unknown) {
        console.error("❌ [API /admin/whatsapp/inbox] Error:", err);
        return NextResponse.json(
            { error: "Internal server error", details: err instanceof Error ? err.message : String(err) },
            { status: 500 }
        );
    }
}
