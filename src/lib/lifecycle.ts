/**
 * Emails du cycle de vie de la réservation, en 4 langues.
 *
 * C'est cette séquence qui porte le taux de conversion réel : rappel de voyage,
 * instructions de retrait, check-in, demande d'avis, relance de re-réservation.
 * Chaque email est identifié par une clé stable (`REF:type`) pour garantir un
 * envoi unique même si le cron tourne plusieurs fois.
 */

import type { BookingRecord, LifecycleEmailType, Locale } from "./booking-engine";

export interface EmailContent {
    subject: string;
    html: string;
    text: string;
}

export interface EmailData {
    ref: string;
    firstName: string;
    vehicleName: string;
    hubName: string;
    meetingPoint: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    days: number;
    balanceEur: number;
    balanceMad: number;
    depositEur: number;
    zeroDeposit: boolean;
    voucherUrl: string;
    whatsappUrl: string;
    reviewUrl: string;
    rebookUrl: string;
}

type Copy = {
    subject: string;
    heading: string;
    paragraphs: string[];
    cta?: { label: string; hrefKey: "voucherUrl" | "whatsappUrl" | "reviewUrl" | "rebookUrl" };
};

const COPY: Record<Locale, Record<LifecycleEmailType, Copy>> = {
    fr: {
        j7_prepare: {
            subject: "Votre {{vehicle}} vous attend dans 7 jours — préparez votre arrivée",
            heading: "J-7 : tout est prêt pour votre location au Maroc",
            paragraphs: [
                "Bonjour {{firstName}}, votre {{vehicle}} est réservé à {{hubName}} du {{pickupDate}} au {{returnDate}} ({{days}} jours).",
                "Pensez à vérifier la validité de votre permis (1 an minimum) et de votre passeport. Le solde de {{balanceEur}} € sera réglé à la remise des clés.",
                "Point de rencontre : {{meetingPoint}}.",
            ],
            cta: { label: "Voir mon voucher", hrefKey: "voucherUrl" },
        },
        j1_pickup: {
            subject: "Demain : retrait de votre {{vehicle}} à {{hubName}}",
            heading: "J-1 : voici exactement où et quand nous retrouver",
            paragraphs: [
                "Bonjour {{firstName}}, votre vol est suivi automatiquement : si vous avez du retard, le véhicule reste réservé sans frais.",
                "Retrait le {{pickupDate}} à {{pickupTime}} — {{meetingPoint}}.",
                "Caution à prévoir : {{depositLine}}. Cartes de débit et espèces acceptées, aucune empreinte bancaire abusive.",
            ],
            cta: { label: "Contacter mon agent sur WhatsApp", hrefKey: "whatsappUrl" },
        },
        j0_checkin: {
            subject: "C'est aujourd'hui — votre {{vehicle}} vous attend",
            heading: "Jour J : récupérez vos clés en moins de 5 minutes",
            paragraphs: [
                "Bonjour {{firstName}}, votre {{vehicle}} est sur le parking, contrôlé et photographié.",
                "Ayez sous la main : permis de conduire original, passeport ou CNI, et le solde de {{balanceEur}} € (ou {{balanceMad}} MAD).",
                "Un imprévu ? Écrivez-nous sur WhatsApp, nous répondons en moins de 2 minutes pendant les heures d'arrivée.",
            ],
            cta: { label: "Ouvrir WhatsApp", hrefKey: "whatsappUrl" },
        },
        j1_review: {
            subject: "Comment s'est passée votre location, {{firstName}} ?",
            heading: "Votre avis aide les prochains voyageurs",
            paragraphs: [
                "Bonjour {{firstName}}, merci d'avoir choisi ZwinCar pour votre {{vehicle}}.",
                "Un avis honnête (même critique) nous aide à sélectionner les meilleures agences locales du Maroc. Cela prend 30 secondes.",
                "Votre caution {{depositLine}} a été traitée au retour : contactez-nous si vous constatez un écart.",
            ],
            cta: { label: "Laisser un avis", hrefKey: "reviewUrl" },
        },
        j30_rebook: {
            subject: "−10 % sur votre prochaine location au Maroc",
            heading: "Votre prochain voyage se prépare maintenant",
            paragraphs: [
                "Bonjour {{firstName}}, votre dernier séjour au Maroc date d'un mois.",
                "Retrouvez votre {{vehicle}} ou un autre modèle avec 10 % de remise fidélité, valable 6 mois, cumulable avec la remise longue durée.",
                "Les prix de juillet et août montent vite : réservez tôt, annulez gratuitement jusqu'à 48h.",
            ],
            cta: { label: "Relouer avec −10 %", hrefKey: "rebookUrl" },
        },
    },
    en: {
        j7_prepare: {
            subject: "Your {{vehicle}} is ready in 7 days — plan your arrival",
            heading: "7 days to go: your Morocco rental is confirmed",
            paragraphs: [
                "Hi {{firstName}}, your {{vehicle}} is booked at {{hubName}} from {{pickupDate}} to {{returnDate}} ({{days}} days).",
                "Please check your driving licence (held at least 1 year) and passport. The {{balanceEur}} € balance is payable when you collect the keys.",
                "Meeting point: {{meetingPoint}}.",
            ],
            cta: { label: "View my voucher", hrefKey: "voucherUrl" },
        },
        j1_pickup: {
            subject: "Tomorrow: pick up your {{vehicle}} at {{hubName}}",
            heading: "1 day to go — here is exactly where to meet us",
            paragraphs: [
                "Hi {{firstName}}, we track your flight: if it is delayed, the car stays reserved at no extra cost.",
                "Pick-up on {{pickupDate}} at {{pickupTime}} — {{meetingPoint}}.",
                "Deposit: {{depositLine}}. Debit cards and cash accepted, no abusive card pre-authorisation.",
            ],
            cta: { label: "Message my agent on WhatsApp", hrefKey: "whatsappUrl" },
        },
        j0_checkin: {
            subject: "Today is the day — your {{vehicle}} is waiting",
            heading: "Pick-up day: keys in under 5 minutes",
            paragraphs: [
                "Hi {{firstName}}, your {{vehicle}} is on the parking lot, inspected and photographed.",
                "Have ready: original driving licence, passport or ID, and the {{balanceEur}} € balance (or {{balanceMad}} MAD).",
                "Something unexpected? Message us on WhatsApp — we answer within 2 minutes during arrival hours.",
            ],
            cta: { label: "Open WhatsApp", hrefKey: "whatsappUrl" },
        },
        j1_review: {
            subject: "How was your rental, {{firstName}}?",
            heading: "Your review helps the next travellers",
            paragraphs: [
                "Hi {{firstName}}, thank you for choosing ZwinCar for your {{vehicle}}.",
                "An honest review (even a critical one) helps us select the best local agencies in Morocco. It takes 30 seconds.",
                "Your {{depositLine}} was settled on return — contact us if anything looks off.",
            ],
            cta: { label: "Leave a review", hrefKey: "reviewUrl" },
        },
        j30_rebook: {
            subject: "10% off your next Morocco rental",
            heading: "Your next trip starts here",
            paragraphs: [
                "Hi {{firstName}}, it has been a month since your last trip to Morocco.",
                "Book the same {{vehicle}} or another model with 10% loyalty discount, valid 6 months, combinable with the long-stay discount.",
                "July and August prices rise fast: book early, cancel free up to 48h before pick-up.",
            ],
            cta: { label: "Rebook with 10% off", hrefKey: "rebookUrl" },
        },
    },
    es: {
        j7_prepare: {
            subject: "Su {{vehicle}} le espera en 7 días — prepare su llegada",
            heading: "Faltan 7 días: su alquiler en Marruecos está confirmado",
            paragraphs: [
                "Hola {{firstName}}, su {{vehicle}} está reservado en {{hubName}} del {{pickupDate}} al {{returnDate}} ({{days}} días).",
                "Compruebe la validez del permiso de conducir (mínimo 1 año) y del pasaporte. El saldo de {{balanceEur}} € se paga al recoger las llaves.",
                "Punto de encuentro: {{meetingPoint}}.",
            ],
            cta: { label: "Ver mi voucher", hrefKey: "voucherUrl" },
        },
        j1_pickup: {
            subject: "Mañana: recogida de su {{vehicle}} en {{hubName}}",
            heading: "Falta 1 día: aquí está el punto de encuentro exacto",
            paragraphs: [
                "Hola {{firstName}}, seguimos su vuelo: si se retrasa, el coche sigue reservado sin coste adicional.",
                "Recogida el {{pickupDate}} a las {{pickupTime}} — {{meetingPoint}}.",
                "Fianza: {{depositLine}}. Aceptamos tarjetas de débito y efectivo, sin bloqueos abusivos.",
            ],
            cta: { label: "Escribir a mi agente por WhatsApp", hrefKey: "whatsappUrl" },
        },
        j0_checkin: {
            subject: "Hoy es el día — su {{vehicle}} le espera",
            heading: "Día de recogida: llaves en menos de 5 minutos",
            paragraphs: [
                "Hola {{firstName}}, su {{vehicle}} está en el parking, revisado y fotografiado.",
                "Tenga a mano: permiso de conducir original, pasaporte o DNI y el saldo de {{balanceEur}} € (o {{balanceMad}} MAD).",
                "¿Algún imprevisto? Escríbanos por WhatsApp, respondemos en menos de 2 minutos.",
            ],
            cta: { label: "Abrir WhatsApp", hrefKey: "whatsappUrl" },
        },
        j1_review: {
            subject: "¿Qué tal fue su alquiler, {{firstName}}?",
            heading: "Su opinión ayuda a los próximos viajeros",
            paragraphs: [
                "Hola {{firstName}}, gracias por elegir ZwinCar para su {{vehicle}}.",
                "Una opinión honesta nos ayuda a seleccionar las mejores agencias locales de Marruecos. Solo tarda 30 segundos.",
                "Su {{depositLine}} se gestionó en la devolución: contáctenos si detecta alguna diferencia.",
            ],
            cta: { label: "Dejar una opinión", hrefKey: "reviewUrl" },
        },
        j30_rebook: {
            subject: "−10 % en su próximo alquiler en Marruecos",
            heading: "Su próximo viaje empieza ahora",
            paragraphs: [
                "Hola {{firstName}}, ha pasado un mes desde su último viaje a Marruecos.",
                "Reserve el mismo {{vehicle}} u otro modelo con un 10 % de descuento fidelidad, válido 6 meses y acumulable con la tarifa de larga duración.",
                "Los precios de julio y agosto suben rápido: reserve pronto y cancele gratis hasta 48 h antes.",
            ],
            cta: { label: "Reservar con −10 %", hrefKey: "rebookUrl" },
        },
    },
    nl: {
        j7_prepare: {
            subject: "Uw {{vehicle}} staat over 7 dagen klaar — plan uw aankomst",
            heading: "Nog 7 dagen: uw huurauto in Marokko is bevestigd",
            paragraphs: [
                "Hallo {{firstName}}, uw {{vehicle}} is gereserveerd in {{hubName}} van {{pickupDate}} tot {{returnDate}} ({{days}} dagen).",
                "Controleer of uw rijbewijs (minimaal 1 jaar) en paspoort geldig zijn. Het restbedrag van {{balanceEur}} € betaalt u bij het ophalen van de sleutels.",
                "Ontmoetingspunt: {{meetingPoint}}.",
            ],
            cta: { label: "Bekijk mijn voucher", hrefKey: "voucherUrl" },
        },
        j1_pickup: {
            subject: "Morgen: uw {{vehicle}} ophalen in {{hubName}}",
            heading: "Nog 1 dag — hier vindt u ons precies",
            paragraphs: [
                "Hallo {{firstName}}, wij volgen uw vlucht: bij vertraging blijft de auto kosteloos gereserveerd.",
                "Ophalen op {{pickupDate}} om {{pickupTime}} — {{meetingPoint}}.",
                "Borg: {{depositLine}}. Debetkaarten en contant geld worden geaccepteerd, zonder buitensporige blokkades.",
            ],
            cta: { label: "Stuur mijn agent een WhatsApp", hrefKey: "whatsappUrl" },
        },
        j0_checkin: {
            subject: "Het is vandaag — uw {{vehicle}} staat klaar",
            heading: "Ophaaldag: sleutels binnen 5 minuten",
            paragraphs: [
                "Hallo {{firstName}}, uw {{vehicle}} staat op de parkeerplaats, gecontroleerd en gefotografeerd.",
                "Houd klaar: origineel rijbewijs, paspoort of ID en het restbedrag van {{balanceEur}} € (of {{balanceMad}} MAD).",
                "Iets onverwachts? Stuur ons een WhatsApp — tijdens aankomsturen antwoorden we binnen 2 minuten.",
            ],
            cta: { label: "Open WhatsApp", hrefKey: "whatsappUrl" },
        },
        j1_review: {
            subject: "Hoe was uw huurperiode, {{firstName}}?",
            heading: "Uw review helpt de volgende reizigers",
            paragraphs: [
                "Hallo {{firstName}}, bedankt dat u voor ZwinCar koos voor uw {{vehicle}}.",
                "Een eerlijke review helpt ons de beste lokale verhuurders in Marokko te selecteren. Het kost 30 seconden.",
                "Uw {{depositLine}} is bij inleveren verwerkt: neem contact op als er iets niet klopt.",
            ],
            cta: { label: "Schrijf een review", hrefKey: "reviewUrl" },
        },
        j30_rebook: {
            subject: "10 % korting op uw volgende huur in Marokko",
            heading: "Uw volgende reis begint nu",
            paragraphs: [
                "Hallo {{firstName}}, het is een maand geleden sinds uw laatste reis naar Marokko.",
                "Boek dezelfde {{vehicle}} of een ander model met 10 % loyaliteitskorting, 6 maanden geldig en combineerbaar met de langdurige korting.",
                "Prijzen voor juli en augustus stijgen snel: boek vroeg en annuleer gratis tot 48 uur voor ophalen.",
            ],
            cta: { label: "Opnieuw boeken met 10 % korting", hrefKey: "rebookUrl" },
        },
    },
};

const LANG: Record<Locale, string> = { fr: "fr", en: "en", es: "es", nl: "nl" };

function fill(template: string, data: EmailData): string {
    return template
        .replace(/\{\{firstName\}\}/g, data.firstName)
        .replace(/\{\{vehicle\}\}/g, data.vehicleName)
        .replace(/\{\{hubName\}\}/g, data.hubName)
        .replace(/\{\{days\}\}/g, String(data.days))
        .replace(/\{\{pickupDate\}\}/g, data.pickupDate)
        .replace(/\{\{returnDate\}\}/g, data.returnDate)
        .replace(/\{\{pickupTime\}\}/g, data.pickupTime)
        .replace(/\{\{returnTime\}\}/g, data.returnTime)
        .replace(/\{\{meetingPoint\}\}/g, data.meetingPoint)
        .replace(/\{\{balanceEur\}\}/g, String(data.balanceEur))
        .replace(/\{\{balanceMad\}\}/g, String(data.balanceMad));
}

function depositLine(data: EmailData, locale: Locale): string {
    if (data.zeroDeposit) {
        return locale === "fr"
            ? "0 € (Franchise Zéro active)"
            : locale === "es"
              ? "0 € (Franquicia Cero activa)"
              : locale === "nl"
                ? "0 € (Eigen risico nul actief)"
                : "€0 (Zero-excess active)";
    }
    return `${data.depositEur} €`;
}

export function renderLifecycleEmail(type: LifecycleEmailType, locale: Locale, data: EmailData): EmailContent {
    const copy = COPY[locale][type];
    const subject = fill(copy.subject, data);
    const heading = fill(copy.heading, data);
    const paragraphs = copy.paragraphs.map((paragraph) =>
        fill(paragraph, data).replace("{{depositLine}}", depositLine(data, locale))
    );

    const href = copy.cta ? data[copy.cta.hrefKey] : data.voucherUrl;

    const html = `<!DOCTYPE html>
<html lang="${LANG[locale]}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px 12px;background:#FAF7F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;color:#12161E;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;margin:0 auto;background:#ffffff;border:1px solid #E7DFD5;border-radius:20px;overflow:hidden;">
    <tr><td style="background:#12161E;padding:24px;">
      <div style="color:#E58B24;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">ZwinCar • ${data.ref}</div>
      <div style="color:#ffffff;font-size:20px;font-weight:800;margin-top:8px;line-height:1.25;">${heading}</div>
    </td></tr>
    <tr><td style="padding:24px;">
      ${paragraphs.map((p) => `<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:#3D4657;">${p}</p>`).join("")}
      ${copy.cta ? `<p style="margin:22px 0 6px;"><a href="${href}" style="display:inline-block;background:#C9572C;color:#ffffff;text-decoration:none;padding:13px 22px;border-radius:12px;font-weight:700;font-size:14px;">${copy.cta.label}</a></p>` : ""}
      <p style="margin:18px 0 0;font-size:12px;color:#8A93A3;">${data.ref} · ${data.pickupDate} → ${data.returnDate} · ${data.vehicleName}</p>
    </td></tr>
    <tr><td style="background:#FAF7F2;border-top:1px solid #E7DFD5;padding:16px 24px;font-size:11px;color:#8A93A3;">
      ZwinCar.com — ${locale === "fr" ? "Location de voiture au Maroc, sans caution abusive." : locale === "es" ? "Alquiler de coches en Marruecos sin fianza abusiva." : locale === "nl" ? "Autohuur in Marokko zonder onredelijke borg." : "Car rental in Morocco without abusive deposits."}
    </td></tr>
  </table>
</body></html>`;

    const text = [heading, "", ...paragraphs, "", copy.cta ? `${copy.cta.label}: ${href}` : "", "", `${data.ref} — ZwinCar.com`].join(
        "\n"
    );

    return { subject, html, text };
}

export function emailDataFromRecord(record: BookingRecord, siteUrl = "https://zwincar.com"): EmailData {
    return {
        ref: record.ref,
        firstName: record.client.fullName.split(" ")[0] || record.client.fullName,
        vehicleName: record.rental.vehicleName,
        hubName: record.rental.hubName,
        meetingPoint: record.rental.meetingPointDetail ?? record.rental.hubName,
        pickupDate: record.rental.pickupDate,
        pickupTime: record.rental.pickupTime,
        returnDate: record.rental.returnDate,
        returnTime: record.rental.returnTime,
        days: record.rental.days,
        balanceEur: record.quote.balanceEur,
        balanceMad: record.quote.balanceMad,
        depositEur: record.quote.depositEur,
        zeroDeposit: record.quote.hasZeroDeposit,
        voucherUrl: `${siteUrl}/booking/${record.ref}?t=${record.accessToken}`,
        whatsappUrl: `https://wa.me/212600000000?text=${encodeURIComponent(`ZwinCar ${record.ref}`)}`,
        reviewUrl: `${siteUrl}/booking/${record.ref}/avis?t=${record.accessToken}`,
        rebookUrl: `${siteUrl}/maroc/${record.rental.pickupHub}?promo=LOYALTY10`,
    };
}

export interface SendEmailResult {
    success: boolean;
    simulated?: boolean;
    id?: string;
    error?: string;
}

export async function sendEmail(to: string, content: EmailContent): Promise<SendEmailResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.RESEND_FROM_EMAIL || "ZwinCar <reservations@zwincar.com>";

    if (!apiKey) {
        return { success: true, simulated: true };
    }

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ from, to: [to], subject: content.subject, html: content.html, text: content.text }),
        });
        const data = (await response.json()) as { id?: string; message?: string };
        if (!response.ok) return { success: false, error: data?.message ?? "Erreur Resend" };
        return { success: true, id: data?.id };
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : "Erreur réseau" };
    }
}
