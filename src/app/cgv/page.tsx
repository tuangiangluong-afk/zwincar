export const revalidate = 604800; // 7 days ISR cache // 24h ISR cache
import type { Metadata } from "next";
import { CGVClientView } from "@/components/CGVClientView";

export const metadata: Metadata = {
    title: "Conditions Générales de Vente & d'Utilisation • ZwinCar.com",
    description: "Conditions Générales de Vente et d'Utilisation de la plateforme ZwinCar : réservation par catégorie garantie, surclassement offert, caution 0€ ou 300€.",
    alternates: {
        canonical: "https://zwincar.com/cgv",
    },
};

export default function CGV() {
    return <CGVClientView />;
}
