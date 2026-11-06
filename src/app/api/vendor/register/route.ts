import { NextResponse } from "next/server";
import { registerVendorAgency } from "@/lib/vendor-store";
import { jsonError, readJson } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    const body = await readJson(request);
    if (!body) return jsonError("Corps de requête JSON manquant", 400);

    const agencyName = typeof body.agencyName === "string" ? body.agencyName.trim() : "";
    const cityHub = typeof body.cityHub === "string" ? body.cityHub.trim() : "marrakech";
    const iceNumber = typeof body.iceNumber === "string" ? body.iceNumber.trim() : "";
    const managerName = typeof body.managerName === "string" ? body.managerName.trim() : "";
    const managerPhone = typeof body.managerPhone === "string" ? body.managerPhone.trim() : "";
    const managerEmail = typeof body.managerEmail === "string" ? body.managerEmail.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!agencyName) return jsonError("Le nom de l'agence est requis.", 422);
    if (!iceNumber || iceNumber.length < 8) return jsonError("Numéro ICE requis (format marocain).", 422);
    if (!managerName) return jsonError("Le nom du gérant est requis.", 422);
    if (!managerPhone || managerPhone.length < 8) return jsonError("Numéro WhatsApp valide requis.", 422);
    if (!managerEmail || !managerEmail.includes("@")) return jsonError("Email professionnel valide requis.", 422);
    if (password.length < 6) return jsonError("Mot de passe trop court (min 6 caractères).", 422);

    const firstCar = (body.firstCar as Record<string, unknown>) || {};
    const model = typeof firstCar.model === "string" ? firstCar.model : "Dacia Sandero Stepway";
    const plate = typeof firstCar.plate === "string" ? firstCar.plate.trim() : "";

    if (!plate) return jsonError("L'immatriculation du premier véhicule est requise.", 422);

    try {
        const { agency, token } = await registerVendorAgency({
            agencyName,
            cityHub,
            iceNumber,
            rcNumber: typeof body.rcNumber === "string" ? body.rcNumber : undefined,
            address: typeof body.address === "string" ? body.address : undefined,
            managerName,
            managerPhone,
            managerEmail,
            password,
            fleetSizeEstimate: typeof body.fleetSizeEstimate === "string" ? body.fleetSizeEstimate : undefined,
            firstCar: {
                model,
                plate,
                color: typeof firstCar.color === "string" ? firstCar.color : undefined,
                year: Number(firstCar.year) || 2024,
                transmission: firstCar.transmission === "Automatique" ? "Automatique" : "Manuelle",
                fuel: firstCar.fuel === "Essence" ? "Essence" : "Diesel",
                dailyPriceMad: Number(firstCar.dailyPriceMad) || 280,
                dailyPriceEur: Number(firstCar.dailyPriceEur) || 25,
            },
        });

        const res = NextResponse.json({ success: true, agency, token }, { status: 201 });
        res.cookies.set("zwincar_vendor_token", token, {
            path: "/",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 30 * 86400,
        });

        return res;
    } catch (e: any) {
        return jsonError(e.message || "Impossible d'enregistrer l'agence.", 409);
    }
}
