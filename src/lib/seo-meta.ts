/**
 * ZwinCar.com — Normes d'affichage SERP & AEO (SEO/AEO/GEO)
 * Spécifiquement calibré pour Google, Perplexity, ChatGPT et Google AI Overviews.
 */
import { SOCIAL_SAME_AS } from "./morocco-data.ts";
import type { CityHub, VehicleModel } from "./morocco-data.ts";
import { isHubInAffiliateFallback } from "./affiliate.ts";
import type { ReviewSummary } from "./booking-engine.ts";

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

export function buildVehicleProductSchema(
    vehicle: VehicleModel,
    hub?: CityHub,
    reviewSummary?: ReviewSummary
): Record<string, unknown> {
    const baseUrl = "https://zwincar.com";
    const toAbsoluteUrl = (path?: string) => {
        if (!path) return `${baseUrl}/images/hero-morocco.webp`;
        return path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    };
    const productUrl = hub
        ? `${baseUrl}/maroc/${hub.slug}/${vehicle.id}`
        : `${baseUrl}/vehicules/${vehicle.id}`;
    const skuCode = `ZWIN-${vehicle.id.toUpperCase()}${hub ? `-${hub.airportCode}` : ""}`;
    const isAffiliate = hub ? isHubInAffiliateFallback(hub.slug) : false;

    const description = isAffiliate
        ? `${vehicle.highlight} ${vehicle.idealFor} Comparatif et prise en charge au comptoir partenaire vérifié à l'aéroport.`
        : `${vehicle.highlight} ${vehicle.idealFor} Caution 0€ avec l'option Franchise Zéro (sinon 300 €), prise en charge aéroport incluse, kilométrage illimité.`;

    const product: Record<string, unknown> = {
        "@type": "Product",
        "@id": `${productUrl}#product`,
        name: hub
            ? `Location ${vehicle.name} — ${hub.name} (${hub.airportCode})`
            : `Location ${vehicle.name} au Maroc Sans Caution CB`,
        image: [toAbsoluteUrl(vehicle.image)],
        description,
        sku: skuCode,
        mpn: skuCode,
        brand: {
            "@type": "Brand",
            name: vehicle.brand || vehicle.name.split(" ")[0],
        },
        offers: {
            "@type": "Offer",
            url: productUrl,
            price: vehicle.dailyPriceEur,
            priceCurrency: "EUR",
            validFrom: "2026-01-01T00:00:00Z",
            priceValidUntil: "2027-12-31",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingRate: {
                    "@type": "MonetaryAmount",
                    value: 0,
                    currency: "EUR",
                },
                shippingDestination: {
                    "@type": "DefinedRegion",
                    addressCountry: "MA",
                },
                deliveryTime: {
                    "@type": "ShippingDeliveryTime",
                    handlingTime: {
                        "@type": "QuantitativeValue",
                        minValue: 0,
                        maxValue: 0,
                        unitCode: "DAY",
                    },
                    transitTime: {
                        "@type": "QuantitativeValue",
                        minValue: 0,
                        maxValue: 0,
                        unitCode: "DAY",
                    },
                },
            },
            hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: "MA",
                returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                merchantReturnDays: 2,
                returnMethod: "https://schema.org/ReturnInStore",
                returnFees: "https://schema.org/FreeReturn",
            },
            seller: {
                "@type": "Organization",
                name: "ZwinCar",
                url: baseUrl,
                sameAs: SOCIAL_SAME_AS,
            },
        },
        speakable: speakableSpecification(["h1", "[data-speakable]"]),
    };

    if (reviewSummary && reviewSummary.count > 0) {
        product.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: reviewSummary.average,
            reviewCount: reviewSummary.count,
            bestRating: 5,
            worstRating: 1,
        };
        if (reviewSummary.latest.length > 0) {
            product.review = reviewSummary.latest.map((r) => ({
                "@type": "Review",
                author: {
                    "@type": "Person",
                    name: r.firstName,
                },
                datePublished: r.at.split("T")[0],
                reviewBody: r.comment,
                reviewRating: {
                    "@type": "Rating",
                    ratingValue: r.rating,
                    bestRating: 5,
                    worstRating: 1,
                },
            }));
        }
    }

    return product;
}
