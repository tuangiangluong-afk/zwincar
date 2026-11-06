import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";
import { getCity } from "@/lib/db";
import { createLeadAndRequestConfirmation } from "@/lib/lead-dispatch";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            clientName,
            phone,
            pickupLocation,
            dropoffLocation,
            pickupTime,
            price,
            tenantId,
            domain
        } = body;

        // Basic validation
        if (!phone || !pickupLocation || !dropoffLocation || !pickupTime) {
            return NextResponse.json(
                { success: false, error: "Champs obligatoires manquants" },
                { status: 400 }
            );
        }

        // 1. Get Tenant Config (for Email)
        let cityConfig = null;
        if (domain) {
            cityConfig = getCity(domain);
        }
        const destEmail = cityConfig?.email || "contact@taxifrance.fr";
        const cityLabel = cityConfig?.name || "Taxi France";

        const bookingDetails = {
            clientName: clientName || "Client Web",
            phone,
            pickupLocation,
            dropoffLocation,
            pickupTime: new Date(pickupTime),
            price,
        };

        // 2. LEAD DISPATCH : sauvegarde + demande de confirmation WhatsApp (OUI)
        const leadResult = await createLeadAndRequestConfirmation(
            bookingDetails,
            tenantId || "unknown",
            domain || ""
        );

        // 3. Email backup (toujours envoyé, permet de ne perdre aucun lead)
        try {
            await resend.emails.send({
                from: 'Taxi France <onboarding@resend.dev>',
                to: ['compareandcash@gmail.com'],
                subject: `📢 Nouvelle Course : ${pickupLocation?.split(',')[0]} -> ${dropoffLocation?.split(',')[0]}`,
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">🚖 Nouvelle Réservation - ${cityLabel}</h2>
                        <div style="background: #f4f4f4; padding: 20px; border-radius: 10px;">
                            <p><strong>Client :</strong> ${clientName || 'Internet'}</p>
                            <p><strong>Téléphone :</strong> <a href="tel:${phone}">${phone}</a></p>
                            <hr style="border: 0; border-top: 1px solid #ddd; margin: 15px 0;">
                            <p><strong>📍 Départ :</strong> ${pickupLocation}</p>
                            <p><strong>🏁 Arrivée :</strong> ${dropoffLocation}</p>
                            <p><strong>📅 Date :</strong> ${new Date(pickupTime).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
                            <p><strong>💰 Prix Estimé :</strong> ${price || 'Au compteur'}</p>
                        </div>
                        <p style="margin-top: 20px; color: #666; font-size: 12px;">
                            Statut WhatsApp : ${leadResult.success ? '✅ Confirmation envoyée au client' : '⚠️ WhatsApp indisponible (email de secours)'}
                        </p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error("Resend Error:", emailError);
        }

        return NextResponse.json({ success: true, lead: leadResult.success });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
