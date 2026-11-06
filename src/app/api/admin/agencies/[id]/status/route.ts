import { NextResponse } from "next/server";
import { getAdminFromToken, extractAdminToken } from "@/lib/admin-auth";
import { setVendorAgencyStatus } from "@/lib/vendor-store";
import { jsonError, readJson, getClientIp, tooManyRequests } from "@/lib/api-helpers";
import { checkRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const ip = getClientIp(request);
    const rl = checkRateLimit(`admin:agency:${ip}`, 20, 60 * 1000);
    if (!rl.allowed) return tooManyRequests(rl.retryAfterSeconds);

    const token = extractAdminToken(request);
    if (!token) return jsonError("Non autorisé", 401);

    const admin = getAdminFromToken(token);
    if (!admin) return jsonError("Session invalide", 401);

    const body = await readJson(request);
    const VALID_STATUSES = ["active", "suspended", "onboarding"] as const;
    const rawStatus = typeof body?.status === "string" ? body.status : "";
    if (!VALID_STATUSES.includes(rawStatus as typeof VALID_STATUSES[number])) {
        return jsonError("Statut invalide", 422);
    }
    const status = rawStatus as typeof VALID_STATUSES[number];

    const success = setVendorAgencyStatus(id, status);
    if (!success) return jsonError("Agence introuvable", 404);

    return NextResponse.json({ success: true, agencyId: id, status });
}
