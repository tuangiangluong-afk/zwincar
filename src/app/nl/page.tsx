import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Auto Huren Marokko Zonder Borg • ZwinCar",
    description: "Huur een auto in Marokko zonder creditcard borg. Directe luchthavenoverdracht in Marrakech, Agadir, Casablanca en Tanger. Gegarandeerde modellen.",
    alternates: {
        canonical: "https://zwincar.com/nl",
        languages: {
            fr: "https://zwincar.com",
            "fr-FR": "https://zwincar.com",
            en: "https://zwincar.com/en",
            "en-US": "https://zwincar.com/en",
            "en-GB": "https://zwincar.com/en",
            es: "https://zwincar.com/es",
            "es-ES": "https://zwincar.com/es",
            nl: "https://zwincar.com/nl",
            "nl-NL": "https://zwincar.com/nl",
            "x-default": "https://zwincar.com/en",
        },
    },
};

export default function DutchHomePage() {
    return <HomePage locale="nl" />;
}
