import { CityConfig } from "@/lib/db";
import { getCityAggregateRating, getCityReviews, Review } from "@/lib/reviews";
import { generateFAQSchema } from "@/lib/faq-generator";

interface BreadcrumbItem {
    name: string;
    item: string;
}

interface StructuredDataProps {
    city: CityConfig;
    breadcrumbs?: BreadcrumbItem[];
}

export function StructuredData({ city, breadcrumbs }: StructuredDataProps) {
    // 1. Consistent Ratings (Matches UI)
    const ratingData = getCityAggregateRating(city.city);
    const reviews = getCityReviews(city.city);

    // 2. AI-Generated FAQ Schema
    const faqSchemaItems = generateFAQSchema(city);

    // 3. Services Schema
    const services = [
        {
            "@type": "Service",
            "name": `Transport Médical ${city.city}`,
            "description": `Transport assis professionnalisé (TAP) vers hôpitaux et cliniques depuis ${city.city}. Agréé CPAM.`,
            "provider": { "@id": `https://${city.domain}/#localbusiness` },
            "areaServed": { "@type": "City", "name": city.city },
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Transport Sanitaire",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "Taxi VSL",
                            "description": "Véhicule Sanitaire Léger pour transport de malade assis."
                        }
                    }
                ]
            }
        },
        {
            "@type": "Service",
            "name": `Navette Aéroport ${city.city}`,
            "description": `Transfert privé vers aéroports depuis ${city.city} avec suivi de vol en temps réel.`,
            "provider": { "@id": `https://${city.domain}/#localbusiness` },
            "areaServed": { "@type": "AdministrativeArea", "name": "France" }
        },
        {
            "@type": "Service",
            "name": `Taxi Longue Distance ${city.city}`,
            "description": `Forfaits longue distance au départ de ${city.city} vers toute la France et l'Europe, berline confort et van 7 places.`,
            "provider": { "@id": `https://${city.domain}/#localbusiness` },
            "areaServed": { "@type": "Country", "name": "France" }
        },
        {
            "@type": "Service",
            "name": `Taxi PMR ${city.city}`,
            "description": `Véhicules équipés d'une rampe d'accès pour personnes à mobilité réduite, chauffeurs formés à l'aide à l'embarquement.`,
            "provider": { "@id": `https://${city.domain}/#localbusiness` },
            "areaServed": { "@type": "City", "name": city.city }
        }
    ];

    // 4. Breadcrumbs Logic
    const breadcrumbList = {
        "@type": "BreadcrumbList",
        "@id": `https://${city.domain}/#breadcrumb`,
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": `Taxi ${city.city}`,
                "item": `https://${city.domain}`
            },
            ...(breadcrumbs || []).map((b, i) => ({
                "@type": "ListItem",
                "position": i + 2,
                "name": b.name,
                "item": `https://${city.domain}${b.item.startsWith('/') ? b.item : '/' + b.item}`
            }))
        ]
    };

    // 5. Main LocalBusiness Schema
    const localBusiness = {
        "@type": "LocalBusiness",
        "additionalType": "https://schema.org/TaxiService",
        "@id": `https://${city.domain}/#localbusiness`,
        "name": `Taxi ${city.city}`, // More SEO friendly name
        "alternateName": city.name,
        "image": city.heroImage.startsWith('http') ? city.heroImage : `https://${city.domain}${city.heroImage}`,
        "telephone": city.phoneNumber,
        "email": city.email,
        "url": `https://${city.domain}`,
        "priceRange": "€€",
        "paymentAccepted": ["Cash", "Credit Card", "Invoice", "Amex"],
        "currenciesAccepted": "EUR",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": city.city,
            "addressRegion": city.department || undefined,
            "addressCountry": "FR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": city.latitude ? String(city.latitude) : "48.8566",
            "longitude": city.longitude ? String(city.longitude) : "2.3522"
        },
        "areaServed": [
            { "@type": "City", "name": city.city },
            ...(city.neighborhoods || []).map(n => ({ "@type": "City", "name": `${city.city} - ${n}` })),
            ...(city.department ? [{ "@type": "AdministrativeArea", "name": `Département ${city.department}` }] : []),
        ],
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "00:00",
                "closes": "23:59"
            }
        ],
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": ratingData.ratingValue,
            "reviewCount": ratingData.reviewCount,
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": reviews.map((r: Review) => ({
            "@type": "Review",
            "author": { "@type": "Person", "name": r.author_name },
            "datePublished": r.date,
            "reviewBody": r.content,
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5"
            }
        }))
    };

    // 6. WebSite entity (helps Google understand the site + AI crawlers)
    const webSite = {
        "@type": "WebSite",
        "@id": `https://${city.domain}/#website`,
        "url": `https://${city.domain}`,
        "name": `Taxi ${city.city}`,
        "description": `Réservation de taxi à ${city.city} : gares, aéroports, transport médical CPAM (VSL), longue distance et PMR.`,
        "inLanguage": "fr-FR",
        "publisher": { "@id": `https://${city.domain}/#organization` },
        "potentialAction": {
            "@type": "SearchAction",
            "target": `https://${city.domain}/?s={search_term_string}`,
            "query-input": "required name=search_term_string"
        }
    };

    // 7. Organization entity
    const organization = {
        "@type": "Organization",
        "@id": `https://${city.domain}/#organization`,
        "name": `Taxi ${city.city}`,
        "url": `https://${city.domain}`,
        "telephone": city.phoneNumber,
        "email": city.email,
        "logo": city.heroImage.startsWith('http') ? city.heroImage : `https://${city.domain}${city.heroImage}`,
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": city.phoneNumber,
            "contactType": "reservations",
            "availableLanguage": "French",
            "areaServed": "FR"
        }
    };

    // 8. HowTo schema (procédural — réservation)
    const howTo = {
        "@type": "HowTo",
        "@id": `https://${city.domain}/#howto`,
        "name": `Comment réserver un taxi à ${city.city}`,
        "description": `Réserver un taxi à ${city.city} en quelques étapes : en ligne ou par téléphone au ${city.phoneNumber}.`,
        "totalTime": "PT5M",
        "step": [
            {
                "@type": "HowToStep",
                "position": 1,
                "name": "Choisissez votre trajet",
                "text": `Indiquez l'adresse de départ, la destination et la date/heure souhaitées à ${city.city}.`
            },
            {
                "@type": "HowToStep",
                "position": 2,
                "name": "Obtenez votre tarif",
                "text": "Pour les trajets gares et aéroports, le forfait fixe vous est communiqué à l'avance."
            },
            {
                "@type": "HowToStep",
                "position": 3,
                "name": "Confirmez votre réservation",
                "text": `Validez en ligne ou par téléphone. Un chauffeur est attribué et vous recevez la confirmation.`
            },
            {
                "@type": "HowToStep",
                "position": 4,
                "name": "Payez à bord",
                "text": "Réglez en espèces ou par carte bancaire à la fin de la course."
            }
        ]
    };

    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            organization,
            webSite,
            localBusiness,
            breadcrumbList,
            ...services, // Add distinct Service entities
            howTo,
            {
                "@type": "FAQPage",
                "@id": `https://${city.domain}/#faq`,
                "mainEntity": faqSchemaItems
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
