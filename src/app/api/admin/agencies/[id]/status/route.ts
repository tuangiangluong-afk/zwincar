import { NextResponse } from "next/server";
import { getAdminFromToken } from "@/lib/admin-auth";
import { setVendorAgencyStatus } from "@/lib/vendor-store";
import { jsonError, readJson } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function extractAdminToken(request: Request): string | null {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.substring(7).trim();
    }
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/zwincar_admin_token=([^;]+)/);
    return match ? match[1].trim() : null;
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = extractAdminToken(request);
    if (!token) return jsonError("Non autorisé", 401);

    const admin = getAdminFromToken(token);
    if (!admin) return jsonError("Session invalide", 401);

    const body = await readJson(request);
    const status = body?.status as "active" | "suspended" | "onboarding";
    if (!status || !["active", "suspended", "onboarding"].includes(status)) {
        return jsonError("Statut invalide", 422);
    }

    const success = setVendorAgencyStatus(id, status);
    if (!success) return jsonError("Agence introuvable", 404);

    return NextResponse.json({ success: true, agencyId: id, status });
}
