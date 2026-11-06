import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Connexion Loueur Partenaire • ZwinCar Maroc",
    description: "Espace d'administration et de gestion de flotte réservé aux agences locales partenaires ZwinCar au Maroc.",
    alternates: {
        canonical: "https://zwincar.com/vendor/login",
    },
};

export default function VendorLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
