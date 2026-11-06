import { NextRequest, NextResponse } from "next/server";
import { getBookingStore } from "@/lib/booking-store";

type Locale = "fr" | "en" | "es" | "nl";

const EMAIL_I18N: Record<
    Locale,
    {
        subject: (ref: string, car: string, hub: string) => string;
        badge: string;
        title: (ref: string) => string;
        greeting: (name: string) => string;
        lead: (car: string, hub: string, code: string) => string;
        vehicle: string;
        dates: string;
        datesVal: (p: string, r: string, d: number) => string;
        pickup: string;
        meetingPoint: string;
        defaultMeeting: string;
        depositPaid: string;
        balanceDue: string;
        caution: string;
        cautionZero: string;
        cautionStd: string;
        arrivalNoteTitle: string;
        arrivalNoteBody: string;
        btnVoucher: string;
        footerHelp: string;
        footerRights: string;
    }
> = {
    fr: {
        subject: (ref, car, hub) => `Confirmation de Réservation ${ref} • ${car} à ${hub}`,
        badge: "ZwinCar • Confirmation & Bon de Réservation",
        title: (ref) => `Réservation Confirmée : ${ref}`,
        greeting: (name) => `Bonjour <strong>${name}</strong>,`,
        lead: (car, hub, code) =>
            `Votre réservation pour le véhicule <strong>${car}</strong> à <strong>${hub} (${code})</strong> est définitivement validée. Votre modèle exact est garanti.`,
        vehicle: "Véhicule :",
        dates: "Dates :",
        datesVal: (p, r, d) => `Du ${p} au ${r} (${d} jours)`,
        pickup: "Prise en charge :",
        meetingPoint: "Point de rendez-vous :",
        defaultMeeting: "Terminal 1 Arrivées, Parking P2 (l'agent vous attend avec pancarte nominative)",
        depositPaid: "Acompte réglé en ligne (Stripe) :",
        balanceDue: "Solde à régler sur place :",
        caution: "Caution :",
        cautionZero: "0 € (Option Franchise Zéro active)",
        cautionStd: "300 € (restituée au retour)",
        arrivalNoteTitle: "Accueil aéroport personnalisé :",
        arrivalNoteBody:
            "Notre agent d'astreinte vous attendra directement à la sortie du terminal avec une pancarte à votre nom. Aucun passage en guichet, pas de file d'attente.",
        btnVoucher: "Voir mon Bon de Réservation (Voucher)",
        footerHelp: "Assistance VIP WhatsApp & SOS 24/7 : +212 6 00 00 00 00",
        footerRights: `© ${new Date().getFullYear()} ZwinCar.com • Location de voiture sereine au Maroc`,
    },
    en: {
        subject: (ref, car, hub) => `Booking Confirmation ${ref} • ${car} in ${hub}`,
        badge: "ZwinCar • Official Booking Confirmation & Voucher",
        title: (ref) => `Booking Confirmed: ${ref}`,
        greeting: (name) => `Hello <strong>${name}</strong>,`,
        lead: (car, hub, code) =>
            `Your booking for <strong>${car}</strong> at <strong>${hub} (${code})</strong> is confirmed. Your exact vehicle model is guaranteed.`,
        vehicle: "Vehicle:",
        dates: "Dates:",
        datesVal: (p, r, d) => `From ${p} to ${r} (${d} days)`,
        pickup: "Pick-up location:",
        meetingPoint: "Meeting point:",
        defaultMeeting: "Terminal Arrivals, Parking P2 (representative waiting with your name sign)",
        depositPaid: "Online deposit paid (Stripe):",
        balanceDue: "Remaining balance at pick-up:",
        caution: "Security deposit:",
        cautionZero: "€0 (Zero Deposit waiver active)",
        cautionStd: "€300 (refunded at return)",
        arrivalNoteTitle: "Personalized Airport Meet & Greet:",
        arrivalNoteBody:
            "Our on-duty agent will welcome you right outside the arrivals gate with a sign displaying your name. No rental counters, zero waiting lines.",
        btnVoucher: "View My Official Voucher",
        footerHelp: "24/7 Dedicated WhatsApp Support: +212 6 00 00 00 00",
        footerRights: `© ${new Date().getFullYear()} ZwinCar.com • Worry-free car rental in Morocco`,
    },
    es: {
        subject: (ref, car, hub) => `Confirmación de Reserva ${ref} • ${car} en ${hub}`,
        badge: "ZwinCar • Confirmación Oficial y Voucher de Reserva",
        title: (ref) => `Reserva Confirmada: ${ref}`,
        greeting: (name) => `Hola <strong>${name}</strong>,`,
        lead: (car, hub, code) =>
            `Su reserva para el vehículo <strong>${car}</strong> en <strong>${hub} (${code})</strong> está confirmada. Su modelo exacto está garantizado.`,
        vehicle: "Vehículo:",
        dates: "Fechas:",
        datesVal: (p, r, d) => `Del ${p} al ${r} (${d} días)`,
        pickup: "Lugar de recogida:",
        meetingPoint: "Punto de encuentro:",
        defaultMeeting: "Terminal Llegadas, Parking P2 (agente esperándole con cartel con su nombre)",
        depositPaid: "Anticipo pagado en línea (Stripe):",
        balanceDue: "Saldo a pagar a la entrega:",
        caution: "Fianza / Depósito:",
        cautionZero: "0 € (Opción Cero Fianza activa)",
        cautionStd: "300 € (reembolsada a la devolución)",
        arrivalNoteTitle: "Bienvenida personalizada en el aeropuerto:",
        arrivalNoteBody:
            "Nuestro agente le esperará a la salida de llegadas con un cartel con su nombre. Sin mostrador, sin colas de espera.",
        btnVoucher: "Ver mi Voucher Oficial",
        footerHelp: "Asistencia VIP WhatsApp & SOS 24/7: +212 6 00 00 00 00",
        footerRights: `© ${new Date().getFullYear()} ZwinCar.com • Alquiler de coches sin sorpresas en Marruecos`,
    },
    nl: {
        subject: (ref, car, hub) => `Boekingsbevestiging ${ref} • ${car} in ${hub}`,
        badge: "ZwinCar • Officiële Boekingsbevestiging & Voucher",
        title: (ref) => `Reservering Bevestigd: ${ref}`,
        greeting: (name) => `Hallo <strong>${name}</strong>,`,
        lead: (car, hub, code) =>
            `Uw reservering voor het voertuig <strong>${car}</strong> in <strong>${hub} (${code})</strong> is bevestigd. Uw exacte model is gegarandeerd.`,
        vehicle: "Voertuig:",
        dates: "Data:",
        datesVal: (p, r, d) => `Van ${p} tot ${r} (${d} dagen)`,
        pickup: "Ophaallocatie:",
        meetingPoint: "Ontmoetingspunt:",
        defaultMeeting: "Terminal Aankomsthal, Parking P2 (chauffeur wacht op u met een naambordje)",
        depositPaid: "Online aanbetaling voldaan (Stripe):",
        balanceDue: "Resterend saldo bij aflevering:",
        caution: "Waarborgsom:",
        cautionZero: "€0 (Geen borg dekking actief)",
        cautionStd: "€300 (teruggestort bij inlevering)",
        arrivalNoteTitle: "Persoonlijke VIP-ontvangst op de luchthaven:",
        arrivalNoteBody:
            "Onze medewerker wacht op u direct bij de uitgang van de terminal met een bordje met uw naam. Geen balies, geen wachttijden.",
        btnVoucher: "Bekijk mijn officiële voucher",
        footerHelp: "24/7 WhatsApp Klantenservice: +212 6 00 00 00 00",
        footerRights: `© ${new Date().getFullYear()} ZwinCar.com • Zorgeloze autoverhuur in Marokko`,
    },
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            bookingRef,
            clientEmail,
            clientName,
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

        // Détection de la langue du client : prop explicite ou enregistrée sur le dossier
        let locale: Locale = (body.locale as Locale) || "fr";
        if (!["fr", "en", "es", "nl"].includes(locale)) {
            locale = "fr";
        }

        // Tenter de retrouver la langue exacte stockée dans le dossier si non spécifiée
        if (!body.locale) {
            try {
                const store = getBookingStore();
                const record = await store.get(bookingRef.toUpperCase());
                if (record?.locale && ["fr", "en", "es", "nl"].includes(record.locale)) {
                    locale = record.locale;
                }
            } catch {
                // fallback to locale
            }
        }

        const t = EMAIL_I18N[locale] || EMAIL_I18N.fr;
        const resendApiKey = process.env.RESEND_API_KEY;

        const emailHtml = `
            <!DOCTYPE html>
            <html lang="${locale}">
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
                        <div style="font-size: 11px; color: #E58B24; font-weight: bold; text-transform: uppercase;">${t.badge}</div>
                        <h1>${t.title(bookingRef)}</h1>
                    </div>
                    <div class="content">
                        <p>${t.greeting(clientName || "Voyageur")}</p>
                        <p>${t.lead(vehicleName || "Véhicule", hubName || "Maroc", airportCode || "Hub")}</p>
                        
                        <div class="recap-box">
                            <div class="row"><span><strong>${t.vehicle}</strong></span><span>${vehicleName}</span></div>
                            <div class="row"><span><strong>${t.dates}</strong></span><span>${t.datesVal(pickupDate || "", returnDate || "", days || 1)}</span></div>
                            <div class="row"><span><strong>${t.pickup}</strong></span><span>${hubName} (${airportCode})</span></div>
                            <div class="row"><span><strong>${t.meetingPoint}</strong></span><span>${meetingPointDetail || t.defaultMeeting}</span></div>
                            <div class="row" style="border-top: 1px solid #ECE5D9; padding-top: 8px; margin-top: 8px;">
                                <span><strong>${t.depositPaid}</strong></span>
                                <span style="color: #C9572C; font-weight: bold;">${depositAcompteEur} €</span>
                            </div>
                            <div class="row">
                                <span><strong>${t.balanceDue}</strong></span>
                                <span style="font-weight: bold;">${balanceOnSiteEur} € (~${balanceOnSiteMad} DH)</span>
                            </div>
                            <div class="row">
                                <span><strong>${t.caution}</strong></span>
                                <span>${hasFranchiseZero ? t.cautionZero : t.cautionStd}</span>
                            </div>
                        </div>

                        <p style="font-size: 13px; color: #555555;">
                            <strong>${t.arrivalNoteTitle}</strong> ${t.arrivalNoteBody}
                        </p>

                        <div style="text-align: center;">
                            <a href="https://zwincar.com/booking/${bookingRef}" class="btn">
                                ${t.btnVoucher}
                            </a>
                        </div>
                    </div>
                    <div class="footer">
                        ${t.footerHelp}<br>
                        ${t.footerRights}
                    </div>
                </div>
            </body>
            </html>
        `;

        if (resendApiKey) {
            const fromEmail = process.env.RESEND_FROM_EMAIL || "ZwinCar <hello@zwincar.com>";
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${resendApiKey}`,
                },
                body: JSON.stringify({
                    from: fromEmail,
                    reply_to: "hello@zwincar.com",
                    to: [clientEmail],
                    subject: t.subject(bookingRef, vehicleName || "Véhicule", hubName || "Maroc"),
                    html: emailHtml,
                }),
            });

            const resData = await res.json();
            return NextResponse.json({ success: true, locale, resendId: resData?.id });
        }

        // Si RESEND_API_KEY non encore configurée dans Vercel, confirmation simulée
        return NextResponse.json({
            success: true,
            simulated: true,
            locale,
            subject: t.subject(bookingRef, vehicleName || "Véhicule", hubName || "Maroc"),
            message: `Email de confirmation prêt (${locale.toUpperCase()}) pour ${clientEmail}`,
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
