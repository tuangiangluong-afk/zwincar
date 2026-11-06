import { NextResponse } from "next/server";
import { registerVendorAgency } from "@/lib/vendor-store";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp, jsonError, readJson, tooManyRequests } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`vendor:register:${ip}`, 5, 15 * 60 * 1000);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

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
    if (password.length < 12) return jsonError("Mot de passe trop court (min 12 caractères).", 422);

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

        // Notifications email automatiques via Resend
        if (process.env.RESEND_API_KEY) {
            const from = process.env.RESEND_FROM_EMAIL || "ZwinCar <hello@zwincar.com>";
            fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from,
                    to: ["hello@zwincar.com"],
                    reply_to: managerEmail,
                    subject: `[Partenaire ZwinCar] Nouvelle agence inscrite : ${agencyName} (${cityHub})`,
                    html: `
                        <h2>Nouvelle Inscription Agence Partenaire</h2>
                        <p><strong>Agence :</strong> ${agencyName}</p>
                        <p><strong>Hub :</strong> ${cityHub}</p>
                        <p><strong>ICE :</strong> ${iceNumber}</p>
                        <p><strong>Gérant :</strong> ${managerName}</p>
                        <p><strong>Téléphone / WhatsApp :</strong> ${managerPhone}</p>
                        <p><strong>Email :</strong> ${managerEmail}</p>
                        <p><strong>Véhicule déclaré :</strong> ${model} (${plate})</p>
                    `,
                }),
            }).catch((err) => console.error("Vendor admin notification error:", err));

            fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                },
                body: JSON.stringify({
                    from,
                    to: [managerEmail],
                    reply_to: "hello@zwincar.com",
                    subject: "Bienvenue sur le Réseau ZwinCar Partenaires",
                    html: `
                        <h2>Bienvenue chez ZwinCar, ${managerName}</h2>
                        <p>Votre agence <strong>${agencyName}</strong> a été enregistrée avec succès pour le hub de <strong>${cityHub}</strong>.</p>
                        <p>Vous pouvez dès à présent accéder à votre espace loueur pour gérer votre flotte et vos réservations :</p>
                        <p><a href="https://zwincar.com/vendor/dashboard" style="display:inline-block;background:#C9572C;color:#ffffff;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:bold;font-size:13px;">Accéder à mon Espace Loueur</a></p>
                        <hr style="margin-top:20px;border:none;border-top:1px solid #eee;"/>
                        <p style="font-size:12px;color:#777;">L'équipe Partenaires ZwinCar • hello@zwincar.com</p>
                    `,
                }),
            }).catch((err) => console.error("Vendor welcome email error:", err));
        }

        return res;
    } catch (e: any) {
        return jsonError(e.message || "Impossible d'enregistrer l'agence.", 409);
    }
}
