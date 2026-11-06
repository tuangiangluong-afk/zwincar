import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MOROCCAN_HUBS, VEHICLE_FLEET, CityHub, VehicleModel } from "@/lib/morocco-data";
import { PURCHASE_INTENTS, PurchaseIntent, getPurchaseIntent } from "@/lib/intent-data";
import { Locale, getTranslation, getHreflangAlternates } from "@/lib/i18n";
import { clampTitle, clampDescription } from "@/lib/seo-meta";

export function getLocalizedStaticParams(locale: Locale) {
    const paramsList: { hub: string; subslug: string }[] = [];

    MOROCCAN_HUBS.forEach((hub) => {
        // 1. Vehicle Pages
        VEHICLE_FLEET.forEach((vehicle) => {
            paramsList.push({
                hub: hub.slug,
                subslug: vehicle.id,
            });
        });

        // 2. Intent Pages for this locale
        PURCHASE_INTENTS.forEach((intent) => {
            paramsList.push({
                hub: hub.slug,
                subslug: intent.slugs[locale],
            });
        });
    });

    return paramsList;
}

export function getLocalizedMetadata(
    locale: Locale,
    hubSlug: string,
    subslug: string
): Metadata {
    const hub = MOROCCAN_HUBS.find((h) => h.slug === hubSlug);
    if (!hub) return { title: "Page Not Found" };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";

    // 1. Intent check
    const intent = PURCHASE_INTENTS.find(
        (i) => i.id === subslug || i.slugs[locale] === subslug || i.slugs.fr === subslug
    );

    if (intent) {
        const title = clampTitle(intent.titles[locale].replace(/\{hub\}/g, hub.name));
        const description = clampDescription(
            intent.metaDescriptions[locale].replace(/\{hub\}/g, hub.name)
        );

        return {
            title,
            description,
            alternates: {
                canonical: `${baseUrl}/${locale}/${hub.slug}/${intent.slugs[locale]}`,
                languages: {
                    "fr-FR": `${baseUrl}/maroc/${hub.slug}/${intent.slugs.fr}`,
                    "en-US": `${baseUrl}/en/${hub.slug}/${intent.slugs.en}`,
                    "es-ES": `${baseUrl}/es/${hub.slug}/${intent.slugs.es}`,
                    "nl-NL": `${baseUrl}/nl/${hub.slug}/${intent.slugs.nl}`,
                    "x-default": `${baseUrl}/en/${hub.slug}/${intent.slugs.en}`,
                },
            },
            openGraph: {
                title,
                description,
                url: `${baseUrl}/${locale}/${hub.slug}/${intent.slugs[locale]}`,
                images: [{ url: hub.heroImage, width: 1200, height: 630 }],
            },
        };
    }

    // 2. Vehicle check
    const vehicle = VEHICLE_FLEET.find((v) => v.id === subslug);
    if (vehicle) {
        const t = getTranslation(locale);
        const title = clampTitle(
            locale === "en"
                ? `${vehicle.name} Rental ${hub.name} (${hub.airportCode}) • 0€ Deposit`
                : locale === "es"
                ? `Alquiler ${vehicle.name} en ${hub.name} (${hub.airportCode}) • 0€ Fianza`
                : `Huur ${vehicle.name} in ${hub.name} (${hub.airportCode}) • 0€ Borg`
        );

        const description = clampDescription(
            locale === "en"
                ? `Rent a guaranteed ${vehicle.name} in ${hub.name} (${hub.airportName}). Zero credit card hold, free delivery to airport or riad. From ${vehicle.dailyPriceEur} €/day.`
                : locale === "es"
                ? `Alquile un ${vehicle.name} garantizado en ${hub.name} (${hub.airportName}). Sin bloqueo en tarjeta, entrega gratis en aeropuerto o riad. Desde ${vehicle.dailyPriceEur} €/día.`
                : `Huur een gegarandeerde ${vehicle.name} in ${hub.name} (${hub.airportName}). Geen creditcard borg, gratis levering op luchthaven of riad. Vanaf ${vehicle.dailyPriceEur} €/dag.`
        );

        return {
            title,
            description,
            alternates: {
                canonical: `${baseUrl}/${locale}/${hub.slug}/${vehicle.id}`,
                languages: {
                    "fr-FR": `${baseUrl}/maroc/${hub.slug}/${vehicle.id}`,
                    "en-US": `${baseUrl}/en/${hub.slug}/${vehicle.id}`,
                    "es-ES": `${baseUrl}/es/${hub.slug}/${vehicle.id}`,
                    "nl-NL": `${baseUrl}/nl/${hub.slug}/${vehicle.id}`,
                    "x-default": `${baseUrl}/en/${hub.slug}/${vehicle.id}`,
                },
            },
            openGraph: {
                title,
                description,
                url: `${baseUrl}/${locale}/${hub.slug}/${vehicle.id}`,
                images: [{ url: vehicle.image, width: 1200, height: 630 }],
            },
        };
    }

    return { title: "Page Not Found" };
}
