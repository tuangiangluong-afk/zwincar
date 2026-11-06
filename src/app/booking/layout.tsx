import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Suivi & Voucher de Réservation • ZwinCar",
    description: "Consultez votre bon de réservation ZwinCar, coordonnées de remise des clés et assistance 24/7.",
    robots: {
        index: false,
        follow: true,
    },
};

export default function BookingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
