import type { Metadata } from "next";
import HomePage from "@/app/home/page";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Alquiler de Coches en Marruecos Sin Fianza • Agencias Locales | ZwinCar",
    description: "Alquile un coche en Marruecos sin bloqueo de 1.500 € en su tarjeta. Entrega directa en aeropuertos de Marrakech, Agadir, Casablanca, Tánger y Fez. Modelos garantizados.",
    alternates: {
        canonical: "https://zwincar.com/es",
        languages: {
            "fr": "https://zwincar.com",
            "en": "https://zwincar.com/en",
            "es": "https://zwincar.com/es",
            "nl": "https://zwincar.com/nl",
        },
    },
};

export default function SpanishHomePage() {
    return <HomePage locale="es" />;
}
