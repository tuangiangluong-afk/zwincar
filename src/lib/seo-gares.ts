// ========================================
// SEO GARES - Phase 2 Programmatic SEO
// High-intent keywords: "Taxi Gare Part-Dieu", "Taxi Gare Montparnasse"
// ========================================
import { CityConfig } from "@/lib/db";
import { getHelpfulContent } from "@/lib/content";

export interface SeoGare {
    slug: string;
    name: string;
    city: string;
    heroTitle: string;
    description: string;
    geo: { lat: number; lng: number };
    linkedCity?: string; // Slug of the partner city for internal linking
    transfers: string[]; // Common destinations from this station
    heroImage?: string;
}

export const SEO_GARES: SeoGare[] = [
    // ========================================
    // PARIS GARES (Mega Volume)
    // ========================================
    {
        slug: "taxi-gare-montparnasse",
        name: "Gare Montparnasse",
        city: "Paris",
        heroTitle: "Taxi Gare Montparnasse | Paris 15e",
        description: "Réservez votre taxi à la Gare Montparnasse. Transfert immédiat vers Paris et banlieue. Suivi TGV et attente gratuite.",
        geo: { lat: 48.841, lng: 2.319 },
        transfers: ["Orly", "Roissy CDG", "La Défense", "Versailles"],
        heroImage: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-de-lyon",
        name: "Gare de Lyon",
        city: "Paris",
        heroTitle: "Taxi Gare de Lyon | Paris 12e",
        description: "Taxi disponible immédiatement à la Gare de Lyon. Liaison Aéroport, Bercy et Sud-Est parisien.",
        geo: { lat: 48.844, lng: 2.373 },
        transfers: ["Orly", "Bercy", "Vincennes", "Disneyland"],
        heroImage: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-du-nord",
        name: "Gare du Nord",
        city: "Paris",
        heroTitle: "Taxi Gare du Nord | Eurostar & Thalys",
        description: "Le point de chute des voyageurs Eurostar et Thalys. Taxi immédiat vers Paris et les aéroports.",
        geo: { lat: 48.881, lng: 2.355 },
        transfers: ["Roissy CDG", "Orly", "La Défense", "Châtelet"],
        heroImage: "https://images.unsplash.com/photo-1534351450181-ea9f78427fe8?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-saint-lazare",
        name: "Gare Saint-Lazare",
        city: "Paris",
        heroTitle: "Taxi Gare Saint-Lazare | Paris 8e",
        description: "Taxi à la Gare Saint-Lazare. Liaison Normandie, Ouest parisien et aéroports.",
        geo: { lat: 48.876, lng: 2.324 },
        transfers: ["Roissy CDG", "Orly", "La Défense", "Deauville"],
        linkedCity: "taxi-deauville",
        heroImage: "https://images.unsplash.com/photo-1503221043305-f7498f8b7888?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-de-lest",
        name: "Gare de l'Est",
        city: "Paris",
        heroTitle: "Taxi Gare de l'Est | TGV Est & ICE",
        description: "Taxi et navette depuis la Gare de l'Est. Liaison TGV Strasbourg, Reims et aéroports parisiens.",
        geo: { lat: 48.876, lng: 2.358 },
        transfers: ["Roissy CDG", "Orly", "Strasbourg", "Reims"],
        linkedCity: "taxi-strasbourg",
        heroImage: "https://images.unsplash.com/photo-1560114928-40f1f1eb26a0?q=80&w=2670&auto=format&fit=crop"
    },

    // ========================================
    // GARES RÉGIONALES TGV (High Value)
    // ========================================
    {
        slug: "taxi-gare-part-dieu",
        name: "Gare Lyon Part-Dieu",
        city: "Lyon",
        heroTitle: "Taxi Gare Part-Dieu | Lyon",
        description: "Le hub TGV lyonnais. Taxi immédiat vers le centre-ville, l'aéroport Saint-Exupéry et toute la région.",
        geo: { lat: 45.760, lng: 4.859 },
        linkedCity: "taxi-lyon",
        transfers: ["Saint-Exupéry", "Centre-Ville", "Confluence", "Villeurbanne"],
        heroImage: "https://images.unsplash.com/photo-1620647833074-ce49b6b90710?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-perrache",
        name: "Gare Lyon Perrache",
        city: "Lyon",
        heroTitle: "Taxi Gare Perrache | Lyon Centre",
        description: "Taxi disponible à la Gare de Perrache. Liaison vers Part-Dieu, Saint-Exupéry et hôtels du centre.",
        geo: { lat: 45.748, lng: 4.827 },
        linkedCity: "taxi-lyon",
        transfers: ["Part-Dieu", "Saint-Exupéry", "Vieux Lyon", "Confluence"],
        heroImage: "https://images.unsplash.com/photo-1620647833074-ce49b6b90710?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-saint-charles",
        name: "Gare Saint-Charles",
        city: "Marseille",
        heroTitle: "Taxi Gare Saint-Charles | Marseille",
        description: "Au pied de l'escalier monumental. Taxi immédiat vers le Vieux-Port, l'aéroport et toute la Provence.",
        geo: { lat: 43.303, lng: 5.380 },
        linkedCity: "taxi-marseille",
        transfers: ["Aéroport Provence", "Vieux-Port", "Calanques", "Cassis"],
        heroImage: "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-saint-jean",
        name: "Gare Saint-Jean",
        city: "Bordeaux",
        heroTitle: "Taxi Gare Saint-Jean | Bordeaux",
        description: "Le terminus TGV bordelais. Taxi vers le centre, les vignobles et l'aéroport de Mérignac.",
        geo: { lat: 44.826, lng: -0.556 },
        linkedCity: "taxi-bordeaux",
        transfers: ["Aéroport Mérignac", "Place de la Bourse", "Cité du Vin", "Saint-Émilion"],
        heroImage: "https://images.unsplash.com/photo-1559087867-ce4c91325525?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-matabiau",
        name: "Gare Matabiau",
        city: "Toulouse",
        heroTitle: "Taxi Gare Matabiau | Toulouse",
        description: "La gare centrale toulousaine. Taxi vers Blagnac, le Capitole et la Cité de l'Espace.",
        geo: { lat: 43.610, lng: 1.454 },
        linkedCity: "taxi-toulouse",
        transfers: ["Aéroport Blagnac", "Capitole", "Cité de l'Espace", "Airbus"],
        heroImage: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-lille-flandres",
        name: "Gare Lille Flandres",
        city: "Lille",
        heroTitle: "Taxi Gare Lille Flandres | TGV Nord",
        description: "Au cœur de Lille. Taxi immédiat vers Lille Europe, l'aéroport Lesquin et le centre-ville.",
        geo: { lat: 50.636, lng: 3.070 },
        linkedCity: "taxi-lille",
        transfers: ["Gare Lille Europe", "Aéroport Lesquin", "Grand'Place", "Vieux Lille"],
        heroImage: "https://images.unsplash.com/photo-1577866068998-24bc8d46db6d?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-lille-europe",
        name: "Gare Lille Europe",
        city: "Lille",
        heroTitle: "Taxi Gare Lille Europe | Eurostar",
        description: "Point d'arrivée Eurostar et Thalys. Taxi vers le centre de Lille, Lesquin et la Belgique.",
        geo: { lat: 50.638, lng: 3.075 },
        linkedCity: "taxi-lille",
        transfers: ["Gare Flandres", "Aéroport Lesquin", "Bruxelles", "Gand"],
        heroImage: "https://images.unsplash.com/photo-1577866068998-24bc8d46db6d?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-strasbourg",
        name: "Gare de Strasbourg",
        city: "Strasbourg",
        heroTitle: "Taxi Gare de Strasbourg | TGV Est",
        description: "La gare la plus spectaculaire de France. Taxi vers le Parlement Européen, l'aéroport et l'Allemagne.",
        geo: { lat: 48.585, lng: 7.734 },
        linkedCity: "taxi-strasbourg",
        transfers: ["Parlement Européen", "Petite France", "Aéroport Entzheim", "Kehl"],
        heroImage: "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-nice",
        name: "Gare Nice-Ville",
        city: "Nice",
        heroTitle: "Taxi Gare Nice-Ville | Côte d'Azur",
        description: "Au cœur de Nice. Taxi vers l'aéroport, la Promenade des Anglais et Monaco.",
        geo: { lat: 43.704, lng: 7.262 },
        linkedCity: "taxi-nice",
        transfers: ["Aéroport Nice", "Promenade des Anglais", "Monaco", "Cannes"],
        heroImage: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-avignon-tgv",
        name: "Gare Avignon TGV",
        city: "Avignon",
        heroTitle: "Taxi Gare Avignon TGV | Provence",
        description: "La gare excentrée à 5km du centre. Taxi obligatoire vers le centre-ville, Luberon et Alpilles.",
        geo: { lat: 43.922, lng: 4.786 },
        linkedCity: "taxi-avignon",
        transfers: ["Centre-Ville", "Gordes", "Luberon", "Alpilles"],
        heroImage: "https://images.unsplash.com/photo-1557171611-9b5377d4c3b0?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-gare-aix-tgv",
        name: "Gare Aix-en-Provence TGV",
        city: "Aix-en-Provence",
        heroTitle: "Taxi Gare Aix TGV | Centre-Ville 20km",
        description: "La gare la plus éloignée du centre de France (20km). Course garantie à 50€+ vers le Cours Mirabeau.",
        geo: { lat: 43.455, lng: 5.317 },
        linkedCity: "taxi-aix-en-provence",
        transfers: ["Centre-Ville", "Cours Mirabeau", "Marseille", "Aéroport Provence"],
        heroImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197825?q=80&w=2670&auto=format&fit=crop"
    },
];

// Helper to get a gare by slug
export function getGareBySlug(slug: string): SeoGare | undefined {
    return SEO_GARES.find(g => g.slug === slug);
}

// ADAPTATEUR : Transforme une Gare en Page Landing
export function getGareAsCityConfig(slug: string): CityConfig | undefined {
    const gare = SEO_GARES.find(g => g.slug === slug);
    if (!gare) return undefined;

    // Spintax spécifique "Station"
    // Assure-toi d'avoir un template 'station_description' dans ton spintax
    const uniqueDescription = getHelpfulContent("station_description", gare.name, 'HUB');
    const uniqueMeta = getHelpfulContent("station_meta_description", gare.name, 'HUB');

    return {
        slug: gare.slug,
        city: gare.city, // On garde la ville parente pour le contexte
        name: `Taxi ${gare.name}`,
        domain: `taxifrance.fr/gare/${gare.slug}`,
        heroImage: gare.heroImage || "https://images.unsplash.com/photo-1515165592879-18497943c47e?q=80&w=2670&auto=format&fit=crop",

        description: uniqueDescription,

        // Features spécifiques "Voyageur Pressé"
        features: [
            "Accueil Quai de Gare",
            "Aide aux Bagages",
            "Pas de file d'attente",
            "Van 7 places dispo",
            "Liaison Aéroport"
        ],

        // On inverse la logique : La "Station" est le point central
        stations: [gare.name],

        // Les quartiers deviennent les destinations populaires (transfers)
        neighborhoods: gare.transfers,

        hospitals: [], // Pas prioritaire pour une gare

        points_of_interest: {
            hotels: [],
            nightlife: [],
            monuments: gare.transfers, // On remplit avec les transferts pour le maillage
            // C'est ici qu'on triche pour afficher les transferts dans le bloc "Destinations"
            parking_difficulty: "Gare (Dépose-minute)"
        },

        pricing: {
            base: "Dès 15€",
            description: "Tarif compteur ou Forfait",
            km: 2.20
        },

        phoneNumber: "09 72 50 12 50",
        email: "contact@taxifrance.fr",
        type: "PARTNER",

        // MAILLAGE INTERNE PUISSANT (SILO)
        // (Propriété temporairement désactivée pour le build)
        // parentSlug: gare.linkedCity,

        meta: {
            title: gare.heroTitle,
            description: uniqueMeta.substring(0, 160)
        }
    };
}
