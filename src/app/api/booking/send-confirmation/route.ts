import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            bookingRef,
            clientEmail,
            clientName,
            clientPhone,
            vehicleName,
            hubName,
            airportCode,
            meetingPointDetail,
            pickupDate,
            returnDate,
            days,
            depositAcompteEur,
            balanceOnSiteEur,
            balanceOnSiteMad,
            hasFranchiseZero,
        } = body;

        if (!clientEmail || !bookingRef) {
            return NextResponse.json(
                { error: "Email et référence de réservation requis" },
                { status: 400 }
            );
        }

        const resendApiKey = process.env.RESEND_API_KEY;

        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF7F2; color: #12161E; margin: 0; padding: 20px; }
                    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #E7DFD5; overflow: hidden; }
                    .header { background: #12161E; color: #ffffff; padding: 25px; }
                    .header h1 { margin: 0; font-size: 20px; font-weight: 900; }
                    .content { padding: 25px; }
                    .badge { display: inline-block; background: #C9572C; color: #ffffff; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
                    .recap-box { background: #FAF7F2; border: 1px solid #ECE5D9; border-radius: 14px; padding: 15px; margin: 20px 0; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
                    .footer { text-align: center; padding: 20px; font-size: 11px; color: #888888; }
                    .btn { display: inline-block; background: #C9572C; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; font-size: 13px; margin-top: 15px; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="header">
                        <div style="font-size: 11px; color: #E58B24; font-weight: bold; text-transform: uppercase;">ZwinCar • Confirmation & Bon de Réservation</div>
                        <h1>Réservation Confirmée : ${bookingRef}</h1>
                    </div>
                    <div class="content">
                        <p>Bonjour <strong>${clientName || "Voyageur"}</strong>,</p>
                        <p>Votre réservation pour le véhicule <strong>${vehicleName}</strong> à <strong>${hubName} (${airportCode})</strong> est définitivement validée. Votre modèle exact est réservé.</p>
                        
                        <div class="recap-box">
                            <div class="row"><span><strong>Véhicule :</strong></span><span>${vehicleName}</span></div>
                            <div class="row"><span><strong>Dates :</strong></span><span>Du ${pickupDate} au ${returnDate} (${days} jours)</span></div>
                            <div class="row"><span><strong>Prise en charge :</strong></span><span>${hubName} (${airportCode})</span></div>
                            <div class="row"><span><strong>Point de rendez-vous :</strong></span><span>${meetingPointDetail || "Terminal 1 Arrivées, Parking P2 (pancarte nominative)"}</span></div>
                            <div class="row" style="border-top: 1px solid #ECE5D9; padding-top: 8px; margin-top: 8px;">
                                <span><strong>Acompte réglé en ligne (Stripe) :</strong></span>
                                <span style="color: #C9572C; font-weight: bold;">${depositAcompteEur} €</span>
                            </div>
                            <div class="row">
                                <span><strong>Solde à régler sur place :</strong></span>
                                <span style="font-weight: bold;">${balanceOnSiteEur} € (~${balanceOnSiteMad} DH)</span>
                            </div>
                            <div class="row">
                                <span><strong>Caution :</strong></span>
                                <span>${hasFranchiseZero ? "0 € (Option Franchise Zéro active)" : "300 € (restituée au retour)"}</span>
                            </div>
                        </div>

                        <p style="font-size: 13px; color: #555555;">
                            <strong>Accueil aéroport :</strong> Notre agent d'astreinte vous attendra directement à la sortie du terminal avec une pancarte à votre nom. Aucun passage en guichet, pas de file d'attente.
                        </p>

                        <div style="text-align: center;">
                            <a href="https://zwincar.com/booking/${bookingRef}" class="btn">
                                Voir mon Bon de Réservation (Voucher)
                            </a>
                        </div>
                    </div>
                    <div class="footer">
                        Assistance Conciergerie WhatsApp 24/7 : +212 6 00 00 00 00<br>
                        © ${new Date().getFullYear()} ZwinCar.com • Location de voiture sereine au Maroc
                    </div>
                </div>
            </body>
            </html>
        `;

        if (resendApiKey) {
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${resendApiKey}`,
                },
                body: JSON.stringify({
                    from: "ZwinCar <reservations@zwincar.com>",
                    to: [clientEmail],
                    subject: `Confirmation de Réservation ${bookingRef} • ${vehicleName} à ${hubName}`,
                    html: emailHtml,
                }),
            });

            const resData = await res.json();
            return NextResponse.json({ success: true, resendId: resData?.id });
        }

        // Si RESEND_API_KEY non configurée localement, simulation propre
        return NextResponse.json({
            success: true,
            simulated: true,
            message: `Email de confirmation simulé pour ${clientEmail}`,
            bookingRef,
        });
    } catch (error: any) {
        console.error("Email send error:", error);
        return NextResponse.json(
            { error: error?.message || "Erreur d'envoi d'email" },
            { status: 500 }
        );
    }
}
