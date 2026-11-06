import type { Metadata } from "next";
import ContactPage from "@/app/contact/page";

export const metadata: Metadata = {
    title: "Contact & 24/7 VIP Klantenservice • ZwinCar.com",
    description: "Neem 24/7 contact op met ZwinCar via WhatsApp of email hello@zwincar.com. Snelle ondersteuning in Marokko, reserveringshulp en luchthavenbezorging.",
    alternates: {
        canonical: "https://zwincar.com/nl/contact",
        languages: {
            "fr-FR": "https://zwincar.com/contact",
            "en-US": "https://zwincar.com/en/contact",
            "es-ES": "https://zwincar.com/es/contact",
            "nl-NL": "https://zwincar.com/nl/contact",
            "x-default": "https://zwincar.com/en/contact",
        },
    },
};

export default function DutchContactPage() {
    return <ContactPage locale="nl" />;
}
