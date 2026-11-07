import type { Metadata } from "next";
import HomePage from "@/components/HomePage";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Location de Voiture au Maroc Sans Caution CB • ZwinCar",
    description: "Louez votre voiture au Maroc sans blocage de carte bancaire. Agences locales vérifiées à Marrakech, Casablanca, Agadir, Tanger. 0€ caution franchise zéro.",
    alternates: {
        canonical: "https://zwincar.com",
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

export default function RootHomePage() {
    return <HomePage locale="fr" />;
}
