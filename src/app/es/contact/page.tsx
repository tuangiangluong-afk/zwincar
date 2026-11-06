import type { Metadata } from "next";
import ContactPage from "@/app/contact/page";

export const metadata: Metadata = {
    title: "Contacto & Soporte VIP 24/7 • ZwinCar.com",
    description: "Contacte al equipo de ZwinCar por WhatsApp 24/7 o por email en hello@zwincar.com. Asistencia en español en Marruecos y entrega en aeropuertos.",
    alternates: {
        canonical: "https://zwincar.com/es/contact",
        languages: {
            "fr-FR": "https://zwincar.com/contact",
            "en-US": "https://zwincar.com/en/contact",
            "es-ES": "https://zwincar.com/es/contact",
            "nl-NL": "https://zwincar.com/nl/contact",
            "x-default": "https://zwincar.com/en/contact",
        },
    },
};

export default function SpanishContactPage() {
    return <ContactPage locale="es" />;
}
