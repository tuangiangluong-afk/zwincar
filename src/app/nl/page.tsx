import type { Metadata } from "next";
import HomePage from "@/app/home/page";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Autoverhuur in Marokko Zonder Borg • Lokale Partners | ZwinCar",
    description: "Huur een auto in Marokko zonder € 1.500 creditcard borg. Directe luchthavenoverdracht in Marrakech, Agadir, Casablanca, Tanger en Fez. Gegarandeerde modellen.",
    alternates: {
        canonical: "https://zwincar.com/nl",
        languages: {
            "fr": "https://zwincar.com",
            "en": "https://zwincar.com/en",
            "es": "https://zwincar.com/es",
            "nl": "https://zwincar.com/nl",
        },
    },
};

export default function DutchHomePage() {
    return <HomePage locale="nl" />;
}
