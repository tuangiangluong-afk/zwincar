import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact & Assistance VIP 24/7 • ZwinCar.com",
    description: "Contactez l'équipe ZwinCar par WhatsApp 24/7 ou email hello@zwincar.com. Assistance francophone au Maroc, suivi de réservation et livraison aéroport.",
    alternates: {
        canonical: "https://zwincar.com/contact",
        languages: {
            "fr-FR": "https://zwincar.com/contact",
            "en-US": "https://zwincar.com/en/contact",
            "es-ES": "https://zwincar.com/es/contact",
            "nl-NL": "https://zwincar.com/nl/contact",
            "x-default": "https://zwincar.com/en/contact",
        },
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
