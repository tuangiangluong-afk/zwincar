import type { Metadata } from "next";
import PriceIndexPage from "@/components/PriceIndexPage";

export const revalidate = 604800;

export const metadata: Metadata = {
    title: "Car Rental Prices in Morocco 2026: by City and Season",
    description: "How much does car rental cost in Morocco? Daily prices by category, season and city, a one-week example, deposit and payment terms. Real ZwinCar rates.",
    alternates: {
        canonical: "https://zwincar.com/en/car-rental-prices-morocco",
        languages: {
            fr: "https://zwincar.com/prix-location-voiture-maroc",
            en: "https://zwincar.com/en/car-rental-prices-morocco",
            "x-default": "https://zwincar.com/en/car-rental-prices-morocco",
        },
    },
};

export default function Page() {
    return <PriceIndexPage locale="en" />;
}
