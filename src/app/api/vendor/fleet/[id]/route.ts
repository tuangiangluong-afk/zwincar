import { NextResponse } from "next/server";
import { getVendorFromToken, setVendorVehicleStatus } from "@/lib/vendor-store";
import { jsonError, readJson } from "@/lib/api-helpers";

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

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const token = extractToken(request);
    if (!token) return jsonError("Non authentifié", 401);

    const agency = getVendorFromToken(token);
    if (!agency) return jsonError("Session loueur invalide", 401);

    const body = await readJson(request);
    if (!body) return jsonError("Corps JSON manquant", 400);

    const status = body.status as "available" | "blocked" | "rented";
    if (!["available", "blocked", "rented"].includes(status)) {
        return jsonError("Statut invalide (available, blocked, rented)", 422);
    }

    const updated = setVendorVehicleStatus(agency.id, id, status);
    if (!updated) return jsonError("Véhicule introuvable ou non autorisé", 404);

    return NextResponse.json({ success: true, vehicle: updated });
}
