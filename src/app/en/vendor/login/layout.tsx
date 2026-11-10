import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Partner Car Rental Agency Login • ZwinCar Morocco",
    description: "Fleet management and booking dispatch portal reserved for verified local car rental agencies in Morocco.",
    robots: {
        index: false,
        follow: true,
    },
    alternates: {
        canonical: "https://zwincar.com/en/vendor/login",
        languages: {
            "fr-FR": "https://zwincar.com/vendor/login",
            "en-US": "https://zwincar.com/en/vendor/login",
            "x-default": "https://zwincar.com/vendor/login",
        },
    },
};

export default function EnglishVendorLoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
