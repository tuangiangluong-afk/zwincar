import { NextResponse } from "next/server";
import { getVendorFromToken, getVendorFleet, addVendorVehicle } from "@/lib/vendor-store";
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

export async function GET(request: Request) {
    const token = extractToken(request);
    if (!token) return jsonError("Non authentifié", 401);

    const agency = getVendorFromToken(token);
    if (!agency) return jsonError("Session loueur invalide", 401);

    const fleet = getVendorFleet(agency.id);
    return NextResponse.json({ fleet });
}

export async function POST(request: Request) {
    const token = extractToken(request);
    if (!token) return jsonError("Non authentifié", 401);

    const agency = getVendorFromToken(token);
    if (!agency) return jsonError("Session loueur invalide", 401);

    const body = await readJson(request);
    if (!body) return jsonError("Corps JSON manquant", 400);

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const plate = typeof body.plate === "string" ? body.plate.trim() : "";

    if (!name || !plate) {
        return jsonError("Modèle et plaque d'immatriculation requis.", 422);
    }

    const newCar = addVendorVehicle(agency.id, {
        name,
        plate,
        color: typeof body.color === "string" ? body.color : undefined,
        year: Number(body.year) || 2024,
        transmission: body.transmission === "Automatique" ? "Automatique" : "Manuelle",
        fuel: body.fuel === "Essence" ? "Essence" : "Diesel",
        dailyPriceMad: Number(body.dailyPriceMad) || 280,
        dailyPriceEur: Number(body.dailyPriceEur) || 25,
        currentLocation: typeof body.currentLocation === "string" ? body.currentLocation : undefined,
    });

    return NextResponse.json({ success: true, vehicle: newCar }, { status: 201 });
}
