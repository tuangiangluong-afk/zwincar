import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Devenir Loueur Partenaire au Maroc • ZwinCar",
    description: "Rejoignez le réseau d'agences locales partenaires ZwinCar au Maroc. Zéro caution abusive, modèle exact garanti et réservations directes.",
    alternates: {
        canonical: "https://zwincar.com/vendor/register",
    },
};

export default function VendorRegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
