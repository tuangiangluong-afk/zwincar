import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Administration ZwinCar • Connexion",
    description: "Portail sécurisé de gestion et d'administration interne ZwinCar Maroc.",
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: "https://zwincar.com/login",
    },
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
