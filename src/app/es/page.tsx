import type { Metadata } from "next";
import HomePage from "@/app/home/page";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Alquiler Coche Marruecos Sin Fianza • ZwinCar",
    description: "Alquile un coche en Marruecos sin bloqueo de fianza en tarjeta. Entrega directa en Marrakech, Casablanca, Agadir y Tánger. Modelos garantizados.",
    alternates: {
        canonical: "https://zwincar.com/es",
        languages: {
            "fr-FR": "https://zwincar.com",
            "en-US": "https://zwincar.com/en",
            "es-ES": "https://zwincar.com/es",
            "nl-NL": "https://zwincar.com/nl",
            "x-default": "https://zwincar.com/en",
        },
    },
};

export default function SpanishHomePage() {
    return <HomePage locale="es" />;
}
