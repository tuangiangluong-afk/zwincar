import { MetadataRoute } from 'next';
import { NATIONAL_TARGETS } from '@/config/national-targets';
import { SEO_ROUTES } from '@/lib/seo-routes';
import { SEO_SERVICES } from '@/lib/seo-data';
import { SEO_GARES } from '@/lib/seo-gares';
import { NATIONAL_CONFIG } from '@/config/national';
import { slugify } from '@/lib/slugify';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://taxifrance.fr';

    // ========================================
    // 1. CORE STATIC PAGES
    // ========================================
    const coreRoutes: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${baseUrl}/mentions-legales`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/cgv`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    // ========================================
    // 2. PARTNER CITIES (30 Ghost Broker Pages)
    // ========================================
    const cityRoutes: MetadataRoute.Sitemap = NATIONAL_TARGETS.map((target) => ({
        url: `${baseUrl}/ville/${target.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9, // High priority - main money pages
    }));

    // ========================================
    // 3. GARES (Train Station SEO Pages)
    // ========================================
    const gareRoutes: MetadataRoute.Sitemap = SEO_GARES.map((gare) => ({
        url: `${baseUrl}/gare/${gare.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9, // High priority - immediate intent
    }));

    // ========================================
    // 4. LONG DISTANCE ROUTES (Trajet Pages)
    // ========================================
    const trajetRoutes: MetadataRoute.Sitemap = SEO_ROUTES.map((route) => ({
        url: `${baseUrl}/trajet/${route.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // ========================================
    // 5. SERVICE PAGES
    // ========================================
    const serviceRoutes: MetadataRoute.Sitemap = SEO_SERVICES.map((service) => ({
        url: `${baseUrl}/service/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // ========================================
    // 6. GUIDE PAGES (POIs)
    // ========================================
    const allPois = [
        ...NATIONAL_CONFIG.points_of_interest.hotels,
        ...NATIONAL_CONFIG.points_of_interest.nightlife,
        ...NATIONAL_CONFIG.points_of_interest.monuments
    ];

    const guideRoutes: MetadataRoute.Sitemap = allPois.map((poi) => ({
        url: `${baseUrl}/guides/${slugify(poi)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [
        ...coreRoutes,
        ...cityRoutes,
        ...gareRoutes,
        ...trajetRoutes,
        ...serviceRoutes,
        ...guideRoutes,
    ];
}
