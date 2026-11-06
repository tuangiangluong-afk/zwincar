import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Administration ZwinCar • Connexion",
    robots: {
        index: false,
        follow: false,
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
