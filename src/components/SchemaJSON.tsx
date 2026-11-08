import { speakableSpecification } from "@/lib/seo-meta";
import { CityHub, VehicleModel, SOCIAL_SAME_AS } from "@/lib/morocco-data";

interface SchemaJSONProps {
    type?: "AutoRental" | "LocalBusiness" | "Vehicle" | "Breadcrumb" | "FAQPage" | "Organization" | "Custom";
    schema?: Record<string, unknown>;
    hub?: CityHub;
    vehicle?: VehicleModel;
    breadcrumbItems?: { name: string; item: string }[];
    faqs?: { q: string; a: string }[];
}

const HUB_WIKIDATA: Record<string, { city: string; airport: string }> = {
    marrakech: { city: "https://www.wikidata.org/wiki/Q101625", airport: "https://www.wikidata.org/wiki/Q1364506" },
    casablanca: { city: "https://www.wikidata.org/wiki/Q7903", airport: "https://www.wikidata.org/wiki/Q500132" },
    agadir: { city: "https://www.wikidata.org/wiki/Q170516", airport: "https://www.wikidata.org/wiki/Q548816" },
    tanger: { city: "https://www.wikidata.org/wiki/Q126148", airport: "https://www.wikidata.org/wiki/Q1417088" },
    fes: { city: "https://www.wikidata.org/wiki/Q80985", airport: "https://www.wikidata.org/wiki/Q1431326" },
    rabat: { city: "https://www.wikidata.org/wiki/Q3551", airport: "https://www.wikidata.org/wiki/Q1369324" },
    ouarzazate: { city: "https://www.wikidata.org/wiki/Q505232", airport: "https://www.wikidata.org/wiki/Q1432289" },
    nador: { city: "https://www.wikidata.org/wiki/Q849492", airport: "https://www.wikidata.org/wiki/Q1432144" },
};

export default function SchemaJSON({
    type = "Custom",
    schema: providedSchema,
    hub,
    vehicle,
    breadcrumbItems,
    faqs,
}: SchemaJSONProps) {
    if (providedSchema) {
        return (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(providedSchema) }}
            />
        );
    }

    const baseUrl = "https://zwincar.com";
    const toAbsoluteUrl = (path?: string) => {
        if (!path) return `${baseUrl}/images/hero-morocco.webp`;
        return path.startsWith("http") ? path : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    };

    const graph: Record<string, unknown>[] = [];

    if (type === "AutoRental" || type === "LocalBusiness" || (type === "Vehicle" && hub)) {
        const canonicalUrl = hub ? `${baseUrl}/maroc/${hub.slug}` : baseUrl;
        graph.push({
            "@type": ["AutoRental", "LocalBusiness"],
            "@id": `${canonicalUrl}#autorental`,
            name: hub
                ? `ZwinCar — Location Voiture ${hub.name} (${hub.airportCode}) Sans Caution CB`
                : "ZwinCar — Location de Voiture au Maroc Sans Caution CB",
            url: canonicalUrl,
            telephone: "+212720794046",
            email: "hello@zwincar.com",
            sameAs: SOCIAL_SAME_AS,
            image: toAbsoluteUrl(hub?.heroImage),
            priceRange: "26€ - 95€",
            currenciesAccepted: "EUR, MAD, USD, GBP",
            paymentAccepted: "Cash, Debit Card, Credit Card, Stripe",
            knowsAbout: [
                "https://www.wikidata.org/wiki/Q1107",
                "https://www.wikidata.org/wiki/Q1025",
                "No-deposit car rental",
                "Moroccan highway police checkpoints",
                "High Atlas Tizi n'Tichka driving protocols",
            ],
            address: {
                "@type": "PostalAddress",
                streetAddress: hub ? hub.airportName : "Aéroport Marrakech-Ménara (RAK)",
                addressLocality: hub ? hub.name : "Marrakech",
                addressCountry: "MA",
            },
            ...(hub
                ? {
                      geo: {
                          "@type": "GeoCoordinates",
                          latitude: hub.lat,
                          longitude: hub.lng,
                      },
                      areaServed: [
                          {
                              "@type": "City",
                              name: hub.name,
                              ...(HUB_WIKIDATA[hub.slug]?.city ? { sameAs: HUB_WIKIDATA[hub.slug].city } : {}),
                          },
                          {
                              "@type": "Airport",
                              name: hub.airportName,
                              iataCode: hub.airportCode,
                              ...(HUB_WIKIDATA[hub.slug]?.airport ? { sameAs: HUB_WIKIDATA[hub.slug].airport } : {}),
                          },
                      ],
                  }
                : {}),
            openingHoursSpecification: [
                {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                    ],
                    opens: "00:00",
                    closes: "23:59",
                },
            ],
            makesOffer: {
                "@type": "Offer",
                itemOffered: {
                    "@type": "Service",
                    name: "Location de véhicule sans empreinte de carte de crédit au Maroc",
                    description:
                        "Mise à disposition de véhicules récents avec Pack Franchise Zéro (0€ de caution bloquée), cartes de débit et espèces acceptées, livraison aéroport et riad incluse.",
                },
            },
            speakable: speakableSpecification(["h1", "[data-speakable]", "article p:first-of-type"]),
        });
    }

    if (type === "Vehicle" && vehicle) {
        const productUrl = hub
            ? `${baseUrl}/maroc/${hub.slug}/${vehicle.id}`
            : `${baseUrl}/vehicules/${vehicle.id}`;
        const skuCode = `ZWIN-${vehicle.id.toUpperCase()}${hub ? `-${hub.airportCode}` : ""}`;

        graph.push({
            "@type": "Product",
            "@id": `${productUrl}#product`,
            name: hub
                ? `Location ${vehicle.name} — ${hub.name} (${hub.airportCode})`
                : `Location ${vehicle.name} au Maroc Sans Caution CB`,
            image: [toAbsoluteUrl(vehicle.image)],
            description: `${vehicle.highlight} ${vehicle.idealFor} Caution 0€ avec l'option Franchise Zéro (sinon 300 €), livraison aéroport et riad offerte, kilométrage illimité.`,
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
                priceValidUntil: "2027-12-31",
                availability: "https://schema.org/InStock",
                seller: {
                    "@type": "Organization",
                    name: "ZwinCar",
                    url: baseUrl,
                    sameAs: SOCIAL_SAME_AS,
                },
            },
            speakable: speakableSpecification(["h1", "[data-speakable]"]),
        });
    }

    if (type === "Organization") {
        graph.push({
            "@type": "Organization",
            "@id": `${baseUrl}#organization`,
            name: "ZwinCar",
            url: baseUrl,
            logo: `${baseUrl}/logo.svg`,
            sameAs: SOCIAL_SAME_AS,
            contactPoint: {
                "@type": "ContactPoint",
                telephone: "+212720794046",
                contactType: "customer service",
                areaServed: "MA",
                availableLanguage: ["French", "English", "Spanish", "Dutch", "Arabic"],
            },
        });
    }

    if (breadcrumbItems && breadcrumbItems.length > 0) {
        graph.push({
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbItems.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                item: item.item,
            })),
        });
    }

    if (faqs && faqs.length > 0) {
        graph.push({
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.a,
                },
            })),
        });
    }

    const finalSchema =
        graph.length === 1
            ? { "@context": "https://schema.org", ...graph[0] }
            : { "@context": "https://schema.org", "@graph": graph };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(finalSchema) }}
        />
    );
}
