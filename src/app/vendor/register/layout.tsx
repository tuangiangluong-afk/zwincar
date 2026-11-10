import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Devenir Loueur Partenaire au Maroc • ZwinCar",
    description: "Rejoignez le réseau d'agences locales partenaires ZwinCar au Maroc. Zéro caution abusive, modèle exact garanti et réservations directes.",
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: "https://zwincar.com/vendor/register",
        languages: {
            "fr-FR": "https://zwincar.com/vendor/register",
            "en-US": "https://zwincar.com/en/vendor/register",
            "x-default": "https://zwincar.com/vendor/register",
        },
    },
};

export default function VendorRegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
