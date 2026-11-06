import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOROCCAN_HUBS } from "@/lib/morocco-data";
import LocalizedHubView from "@/components/pSEO/LocalizedHubView";
import { clampTitle, clampDescription } from "@/lib/seo-meta";

interface PageProps {
    params: Promise<{ hub: string }>;
}

export async function generateStaticParams() {
    return MOROCCAN_HUBS.map((hub) => ({ hub: hub.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { hub: hubSlug } = await params;
    const hub = MOROCCAN_HUBS.find((h) => h.slug === hubSlug);
    if (!hub) return { title: "Aeropuerto no encontrado" };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";
    const title = clampTitle(`Alquiler Coche ${hub.name} (${hub.airportCode}) Sin Fianza • ZwinCar`);
    const description = clampDescription(
        `Alquile coche en ${hub.name} (${hub.airportName}) sin bloqueo de tarjeta de crédito. Tarjetas de débito y efectivo aceptados. Entrega rápida en aeropuerto y riad.`
    );

    return {
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/es/${hub.slug}`,
            languages: {
                "fr-FR": `${baseUrl}/maroc/${hub.slug}`,
                "en-US": `${baseUrl}/en/${hub.slug}`,
                "es-ES": `${baseUrl}/es/${hub.slug}`,
                "nl-NL": `${baseUrl}/nl/${hub.slug}`,
                "x-default": `${baseUrl}/en/${hub.slug}`,
            },
        },
        openGraph: {
            title,
            description,
            url: `${baseUrl}/es/${hub.slug}`,
            images: [{ url: hub.heroImage, width: 1200, height: 630 }],
        },
    };
}

export default async function SpanishHubPage({ params }: PageProps) {
    const { hub: hubSlug } = await params;
    const hub = MOROCCAN_HUBS.find((h) => h.slug === hubSlug);
    if (!hub) notFound();

    return <LocalizedHubView hub={hub} locale="es" />;
}
