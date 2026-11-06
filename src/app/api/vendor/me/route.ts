import { NextResponse } from "next/server";
import { getVendorFromToken, getVendorFleet } from "@/lib/vendor-store";
import { jsonError, getClientIp, tooManyRequests } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function extractToken(request: Request): string | null {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.substring(7).trim();
    }
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/zwincar_vendor_token=([^;]+)/);
    return match ? match[1].trim() : null;
}

export async function GET(request: Request) {
    const ip = getClientIp(request);
    const rl = checkRateLimit(`vendor:me:${ip}`, 30, 60 * 1000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfterSeconds);

    const token = extractToken(request);
    if (!token) return jsonError("Non authentifié", 401);

    const agency = getVendorFromToken(token);
    if (!agency) return jsonError("Session loueur expirée ou invalide", 401);

    const fleet = getVendorFleet(agency.id);
    return NextResponse.json({ agency, fleet });
}
