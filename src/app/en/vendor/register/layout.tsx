import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Become a Partner Rental Agency in Morocco • ZwinCar",
    description: "Join the verified Moroccan local rental network on ZwinCar. Zero deposit extortion, exact model guarantee and direct airport customer handovers.",
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: "https://zwincar.com/en/vendor/register",
        languages: {
            "fr-FR": "https://zwincar.com/vendor/register",
            "en-US": "https://zwincar.com/en/vendor/register",
            "x-default": "https://zwincar.com/vendor/register",
        },
    },
};

export default function EnglishVendorRegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
