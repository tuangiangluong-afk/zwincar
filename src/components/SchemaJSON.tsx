import { speakableSpecification } from "@/lib/seo-meta";
import { CityHub, VehicleModel } from "@/lib/morocco-data";

interface SchemaJSONProps {
    type?: "AutoRental" | "LocalBusiness" | "Vehicle" | "Breadcrumb" | "FAQPage" | "Organization" | "Custom";
    schema?: Record<string, unknown>;
    hub?: CityHub;
    vehicle?: VehicleModel;
    breadcrumbItems?: { name: string; item: string }[];
    faqs?: { q: string; a: string }[];
}

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

    let schema: Record<string, unknown> = {};

    const baseUrl = "https://zwincar.com";

    if (type === "AutoRental" || type === "LocalBusiness") {
        const canonicalUrl = hub ? `${baseUrl}/maroc/${hub.slug}` : baseUrl;
        schema = {
            "@context": "https://schema.org",
            "@type": ["AutoRental", "LocalBusiness"],
            "@id": canonicalUrl,
            name: hub ? `ZwinCar — Location Voiture ${hub.name} Sans Caution CB` : "ZwinCar — Location de Voiture au Maroc Sans Caution",
            url: canonicalUrl,
            telephone: "+212522000000",
            email: "contact@zwincar.com",
            image: hub?.heroImage || `${baseUrl}/og-cover.jpg`,
            priceRange: "20€ - 110€",
            currenciesAccepted: "EUR, MAD, USD, GBP",
            paymentAccepted: "Cash, Credit Card, Debit Card, Stripe",
            address: {
                "@type": "PostalAddress",
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
                          { "@type": "City", name: hub.name },
                          { "@type": "Airport", name: hub.airportName, iataCode: hub.airportCode },
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
                    name: "Location de véhicule sans empreinte de carte de crédit",
                    description: "Mise à disposition de véhicules récents avec dépôt cash souple ou franchise zéro, livraison aéroport et riad offerte.",
                },
            },
            speakable: speakableSpecification(["h1", "[data-speakable]", "article p:first-of-type"]),
        };
    } else if (type === "Vehicle" && vehicle) {
        schema = {
            "@context": "https://schema.org",
            "@type": "Product",
            name: `Location ${vehicle.name} au Maroc`,
            image: vehicle.image,
            description: `${vehicle.highlight} ${vehicle.idealFor} Caution 0€ CB, livraison aéroport incluse.`,
            brand: {
                "@type": "Brand",
                name: vehicle.name.split(" ")[0],
            },
            offers: {
                "@type": "Offer",
                price: vehicle.dailyPriceEur,
                priceCurrency: "EUR",
                priceValidUntil: "2027-12-31",
                availability: "https://schema.org/InStock",
                itemCondition: "https://schema.org/NewCondition",
                seller: {
                    "@type": "Organization",
                    name: "ZwinCar",
                },
            },
            speakable: speakableSpecification(["h1", "[data-speakable]"]),
        };
    } else if (type === "Organization") {
        schema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "ZwinCar",
            url: baseUrl,
            logo: `${baseUrl}/logo.svg`,
            sameAs: [
                "https://www.instagram.com/zwincar",
                "https://twitter.com/zwincar",
            ],
            contactPoint: {
                "@type": "ContactPoint",
                telephone: "+212522000000",
                contactType: "customer service",
                areaServed: "MA",
                availableLanguage: ["French", "English", "Spanish", "Arabic"],
            },
        };
    } else if (type === "Breadcrumb" && breadcrumbItems) {
        schema = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbItems.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.name,
                item: item.item,
            })),
        };
    } else if (type === "FAQPage" && faqs) {
        schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.a,
                },
            })),
        };
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
