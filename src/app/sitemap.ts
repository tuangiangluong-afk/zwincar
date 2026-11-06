import { MetadataRoute } from "next";
import { MOROCCAN_HUBS, VEHICLE_FLEET } from "@/lib/morocco-data";
import { PURCHASE_INTENTS } from "@/lib/intent-data";
import { MOROCCO_GUIDES } from "@/data/morocco-guides";
import { MOROCCO_GUIDES_EN } from "@/data/morocco-guides-en";
import { SUPPORTED_LOCALES } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";
    const now = new Date();

    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${baseUrl}/guides`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/en/guides`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/vendor/login`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.5,
        },
        {
            url: `${baseUrl}/vendor/register`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];

    // 1. Hub Routes in 4 Languages (FR: /maroc/[slug], Others: /[locale]/[slug])
    const hubRoutes: MetadataRoute.Sitemap = [];
    MOROCCAN_HUBS.forEach((hub) => {
        // FR
        hubRoutes.push({
            url: `${baseUrl}/maroc/${hub.slug}`,
            lastModified: now,
            changeFrequency: "daily",
            priority: 0.95,
        });

        // EN, ES, NL
        (["en", "es", "nl"] as const).forEach((locale) => {
            hubRoutes.push({
                url: `${baseUrl}/${locale}/${hub.slug}`,
                lastModified: now,
                changeFrequency: "daily",
                priority: 0.9,
            });
        });
    });

    // 2. National Vehicle Authority Pages (/vehicules/[id])
    const vehicleRoutes: MetadataRoute.Sitemap = VEHICLE_FLEET.map((vehicle) => ({
        url: `${baseUrl}/vehicules/${vehicle.id}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.85,
    }));

    // 3. City x Vehicle Landing Pages across 4 Languages (48 x 4 = 192 URLs)
    const cityVehicleRoutes: MetadataRoute.Sitemap = [];
    MOROCCAN_HUBS.forEach((hub) => {
        VEHICLE_FLEET.forEach((vehicle) => {
            // FR
            cityVehicleRoutes.push({
                url: `${baseUrl}/maroc/${hub.slug}/${vehicle.id}`,
                lastModified: now,
                changeFrequency: "weekly",
                priority: 0.85,
            });

            // EN, ES, NL
            (["en", "es", "nl"] as const).forEach((locale) => {
                cityVehicleRoutes.push({
                    url: `${baseUrl}/${locale}/${hub.slug}/${vehicle.id}`,
                    lastModified: now,
                    changeFrequency: "weekly",
                    priority: 0.8,
                });
            });
        });
    });

    // 4. City x Purchase Intent Landing Pages across 4 Languages (40 x 4 = 160 URLs)
    const cityIntentRoutes: MetadataRoute.Sitemap = [];
    MOROCCAN_HUBS.forEach((hub) => {
        PURCHASE_INTENTS.forEach((intent) => {
            // FR
            cityIntentRoutes.push({
                url: `${baseUrl}/maroc/${hub.slug}/${intent.slugs.fr}`,
                lastModified: now,
                changeFrequency: "daily",
                priority: 0.9,
            });

            // EN, ES, NL
            (["en", "es", "nl"] as const).forEach((locale) => {
                cityIntentRoutes.push({
                    url: `${baseUrl}/${locale}/${hub.slug}/${intent.slugs[locale]}`,
                    lastModified: now,
                    changeFrequency: "daily",
                    priority: 0.85,
                });
            });
        });
    });

    // 5. Roadtrip & Driving Guides (/guides/[slug] & /en/guides/[slug])
    const guideRoutes: MetadataRoute.Sitemap = MOROCCO_GUIDES.map((guide) => ({
        url: `${baseUrl}/guides/${guide.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
    }));

    const guideEnRoutes: MetadataRoute.Sitemap = (MOROCCO_GUIDES_EN || []).map((guide) => ({
        url: `${baseUrl}/en/guides/${guide.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
    }));

    return [
        ...staticRoutes,
        ...hubRoutes,
        ...vehicleRoutes,
        ...cityVehicleRoutes,
        ...cityIntentRoutes,
        ...guideRoutes,
        ...guideEnRoutes,
    ];
}
