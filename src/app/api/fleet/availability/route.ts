import { NextResponse } from "next/server";
import { VEHICLE_FLEET } from "@/lib/morocco-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const hub = url.searchParams.get("hub") || "marrakech";

    // Modèles disponibles avec stock garanti par les agences locales
    const modelsAvailability = VEHICLE_FLEET.map((v) => ({
        id: v.id,
        name: v.name,
        available: true,
        stockCount: v.category === "Compacte" || v.category === "Citadine" ? 4 : 2,
        guaranteedModel: true,
        hub,
    }));

    return NextResponse.json({
        hub,
        availableModelsCount: modelsAvailability.length,
        models: modelsAvailability,
    });
}
