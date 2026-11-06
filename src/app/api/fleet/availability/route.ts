import { NextResponse } from "next/server";
import { VEHICLE_FLEET } from "@/lib/morocco-data";
import { getHubModelAvailability } from "@/lib/vendor-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const hub = url.searchParams.get("hub") || "marrakech";

    // Modèles disponibles croisés en temps réel avec le stock et le Stop-Sell des agences locales
    const modelsAvailability = VEHICLE_FLEET.map((v) => {
        const defaultStock = v.category === "Compacte" || v.category === "Citadine" ? 4 : 2;
        const { available, stockCount } = getHubModelAvailability(hub, v.id, v.name, defaultStock);
        return {
            id: v.id,
            name: v.name,
            available,
            stockCount,
            guaranteedModel: true,
            hub,
        };
    });

    return NextResponse.json({
        hub,
        availableModelsCount: modelsAvailability.filter((m) => m.available).length,
        models: modelsAvailability,
    });
}
