import type { Metadata } from "next";
import ContactPage from "@/app/contact/page";

export const metadata: Metadata = {
    title: "24/7 VIP Support & Contact • ZwinCar.com",
    description: "Reach the ZwinCar team on WhatsApp 24/7 or via email hello@zwincar.com. Fast English-speaking support in Morocco, airport delivery & booking updates.",
    alternates: {
        canonical: "https://zwincar.com/en/contact",
        languages: {
            "fr-FR": "https://zwincar.com/contact",
            "en-US": "https://zwincar.com/en/contact",
            "es-ES": "https://zwincar.com/es/contact",
            "nl-NL": "https://zwincar.com/nl/contact",
            "x-default": "https://zwincar.com/en/contact",
        },
    },
};

export default function EnglishContactPage() {
    return <ContactPage locale="en" />;
}
