import type { Metadata } from "next";
import PriceIndexPage from "@/components/PriceIndexPage";

export const revalidate = 604800;

export const metadata: Metadata = {
    title: "Prix location voiture Maroc 2026 : tarifs par ville et saison",
    description: "Combien coûte une location de voiture au Maroc ? Prix par jour par catégorie, saison et ville, exemple sur une semaine, caution et acompte. Tarifs réels ZwinCar.",
    alternates: {
        canonical: "https://zwincar.com/prix-location-voiture-maroc",
        languages: {
            fr: "https://zwincar.com/prix-location-voiture-maroc",
            en: "https://zwincar.com/en/car-rental-prices-morocco",
            "x-default": "https://zwincar.com/en/car-rental-prices-morocco",
        },
    },
};

export default function Page() {
    return <PriceIndexPage locale="fr" />;
}
