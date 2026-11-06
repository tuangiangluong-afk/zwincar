/**
 * ZwinCar.com — Normes d'affichage SERP & AEO (SEO/AEO/GEO)
 * Spécifiquement calibré pour Google, Perplexity, ChatGPT et Google AI Overviews.
 */

export const TITLE_MAX = 58;
export const DESCRIPTION_MAX = 152;

function normalize(value: string): string {
    return (value || "").replace(/[\s\u00a0\u202f]+/g, " ").trim();
}

function cut(value: string, max: number): string {
    if (value.length <= max) return value;
    const window = value.slice(0, max);
    const lastSpace = window.lastIndexOf(" ");
    const head = (lastSpace > Math.floor(max * 0.5) ? window.slice(0, lastSpace) : window)
        .replace(/[\s|·•,;:/\-–—]+$/u, "")
        .trim();
    return head || window.trim();
}

export function clampTitle(value: string, max: number = TITLE_MAX): string {
    return cut(normalize(value), max);
}

export function clampDescription(value: string, max: number = DESCRIPTION_MAX): string {
    const text = normalize(value);
    if (text.length <= max) return text;
    const head = cut(text, max - 1);
    return head.length < text.length ? `${head}\u2026` : head;
}

export function ogImageUrl(
    params: { q?: string; sub?: string; badge?: string; baseUrl?: string } = {},
): string {
    const baseUrl = (params.baseUrl || "https://zwincar.com").replace(/\/$/, "");
    const search = new URLSearchParams();
    if (params.q) search.set("q", params.q.slice(0, 64));
    if (params.sub) search.set("sub", params.sub.slice(0, 120));
    if (params.badge) search.set("badge", params.badge.slice(0, 36));
    const query = search.toString();
    return `${baseUrl}/api/og${query ? `?${query}` : ""}`;
}

export function breadcrumbList(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function speakableSpecification(
    cssSelector: string[] = ["h1", "[data-speakable]", "article p:first-of-type", "article h2"],
) {
    return {
        "@type": "SpeakableSpecification",
        cssSelector,
    };
}
