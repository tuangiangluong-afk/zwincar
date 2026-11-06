import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp, jsonError, readJson, tooManyRequests } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`admin:login:${ip}`, 5, 15 * 60 * 1000);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

    const body = await readJson(request);
    if (!body) return jsonError("Corps de requête JSON manquant", 400);

    const email = typeof body.email === "string" ? body.email.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
        return jsonError("Email et mot de passe requis.", 422);
    }

    const auth = await authenticateAdmin(email, password);
    if (!auth) {
        return jsonError("Identifiants administrateur incorrects.", 401);
    }

    const res = NextResponse.json({ success: true, admin: auth.admin, token: auth.token });
    res.cookies.set("zwincar_admin_token", auth.token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 14 * 86400,
    });

    return res;
}
