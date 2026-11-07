import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Car Rental Morocco No Credit Card Hold • ZwinCar",
    description: "Rent a car in Morocco with no €1,500 deposit. Direct airport handover in Marrakech, Agadir, Casablanca & Tangier. Zero excess & guaranteed models.",
    alternates: {
        canonical: "https://zwincar.com/en",
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

export default function EnglishHomePage() {
    return <HomePage locale="en" />;
}
