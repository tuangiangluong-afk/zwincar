import type { Metadata } from "next";
import HomePage from "@/app/home/page";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Car Rental Morocco with Zero Deposit • Verified Local Fleets | ZwinCar",
    description: "Rent a car in Morocco without a €1,500 credit card hold. Direct airport handover in Marrakech, Agadir, Casablanca, Tangier, and Fes. Guaranteed models & 24/7 VIP support.",
    alternates: {
        canonical: "https://zwincar.com/en",
        languages: {
            "fr": "https://zwincar.com",
            "en": "https://zwincar.com/en",
            "es": "https://zwincar.com/es",
            "nl": "https://zwincar.com/nl",
        },
    },
};

export default function EnglishHomePage() {
    return <HomePage locale="en" />;
}
