import frData from "./morocco-guides-fr.json";
import enData from "./morocco-guides-en.json";

export interface GuideCardSummary {
    slug: string;
    title: string;
    shortTitle: string;
    category: string;
    heroImage: string;
    readTimeMinutes: number;
    metaDescription: string;
    alternateSlug: string;
    publishedAt: string;
    author: {
        name: string;
        role: string;
        avatar: string;
    };
}

export const GUIDES_SUMMARY_FR: GuideCardSummary[] = (frData as any[]).map((g) => ({
    slug: g.slug,
    title: g.title,
    shortTitle: g.shortTitle || g.title,
    category: g.category,
    heroImage: g.heroImage,
    readTimeMinutes: g.readTimeMinutes || 5,
    metaDescription: g.metaDescription,
    alternateSlug: g.alternateSlug,
    publishedAt: g.publishedAt,
    author: {
        name: g.author.name,
        role: g.author.role,
        avatar: g.author.avatar,
    },
}));

export const GUIDES_SUMMARY_EN: GuideCardSummary[] = (enData as any[]).map((g) => ({
    slug: g.slug,
    title: g.title,
    shortTitle: g.shortTitle || g.title,
    category: g.category,
    heroImage: g.heroImage,
    readTimeMinutes: g.readTimeMinutes || 5,
    metaDescription: g.metaDescription,
    alternateSlug: g.alternateSlug,
    publishedAt: g.publishedAt,
    author: {
        name: g.author.name,
        role: g.author.role,
        avatar: g.author.avatar,
    },
}));

export function getHubGuidesSummary(hubSlug: string, isEn: boolean): GuideCardSummary[] {
    const list: string[] = [];

    if (hubSlug === "marrakech") {
        list.push("marrakech-menara-airport-rak-car-rental-terminal-guide");
        list.push("tizi-n-tichka-pass-driving-guide-atlas-road-conditions");
    } else if (hubSlug === "agadir") {
        list.push("agadir-al-massira-airport-aga-car-rental-taghazout");
        list.push("atlantic-coast-roadtrip-marrakech-essaouira-taghazout-agadir");
    } else if (hubSlug === "casablanca") {
        list.push("casablanca-mohammed-v-airport-cmn-car-rental-guide");
        list.push("morocco-toll-highways-adm-jawaz-pass-cash");
    } else if (hubSlug === "tanger" || hubSlug === "tangier") {
        list.push("tangier-airport-tng-port-car-rental-guide");
        list.push("fes-to-chefchaouen-tangier-rif-mountains-drive");
    } else if (hubSlug === "fes" || hubSlug === "fez") {
        list.push("fes-to-chefchaouen-tangier-rif-mountains-drive");
        list.push("marrakech-to-merzouga-sahara-desert-roadtrip");
    } else {
        list.push("do-you-really-need-a-4x4-in-morocco");
        list.push("morocco-toll-highways-adm-jawaz-pass-cash");
    }

    list.push("morocco-car-rental-no-credit-card-debit-cards");
    list.push("morocco-speed-cameras-400-mad-fine-rules");

    const pool = isEn ? GUIDES_SUMMARY_EN : GUIDES_SUMMARY_FR;

    if (isEn) {
        return list
            .slice(0, 4)
            .map((s) => pool.find((g) => g.slug === s))
            .filter(Boolean) as GuideCardSummary[];
    }

    // FR: match via alternateSlug from English topic slug
    return list
        .slice(0, 4)
        .map((enSlug) => {
            const enItem = GUIDES_SUMMARY_EN.find((g) => g.slug === enSlug);
            if (enItem && enItem.alternateSlug) {
                return pool.find((g) => g.slug === enItem.alternateSlug);
            }
            return null;
        })
        .filter(Boolean) as GuideCardSummary[];
}
