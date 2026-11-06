import type { Metadata } from "next";
import HomePage from "@/app/home/page";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Auto Huren Marokko Zonder Borg • ZwinCar",
    description: "Huur een auto in Marokko zonder creditcard borg. Directe luchthavenoverdracht in Marrakech, Agadir, Casablanca en Tanger. Gegarandeerde modellen.",
    alternates: {
        canonical: "https://zwincar.com/nl",
        languages: {
            "fr-FR": "https://zwincar.com",
            "en-US": "https://zwincar.com/en",
            "es-ES": "https://zwincar.com/es",
            "nl-NL": "https://zwincar.com/nl",
            "x-default": "https://zwincar.com/en",
        },
    },
};

export default function DutchHomePage() {
    return <HomePage locale="nl" />;
}
