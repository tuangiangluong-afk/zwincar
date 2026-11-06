import { NextResponse } from "next/server";
import { authenticateVendor } from "@/lib/vendor-store";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp, jsonError, readJson, tooManyRequests } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`vendor:login:${ip}`, 10, 10 * 60 * 1000);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

    const body = await readJson(request);
    if (!body) return jsonError("Corps de requête JSON manquant", 400);

    const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!identifier || !password) {
        return jsonError("Identifiant et mot de passe requis.", 422);
    }

    const auth = await authenticateVendor(identifier, password);
    if (!auth) {
        return jsonError("Identifiants incorrects ou agence introuvable.", 401);
    }

    const res = NextResponse.json({ success: true, agency: auth.agency, token: auth.token });
    res.cookies.set("zwincar_vendor_token", auth.token, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 86400,
    });

    return res;
}
