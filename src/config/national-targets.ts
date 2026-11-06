// ========================================
// NATIONAL TARGETS - 30 HIGH-VALUE ZONES
// Ghost Broker Strategy - Dropshipping Taxi
// ========================================

export interface NationalTarget {
    slug: string;
    name: string;
    heroTitle: string;
    geo: { lat: number; lng: number };
    price_start: number; // Tarif préfectoral prise en charge
    top_places: string[];
    zip: string;
    tier: 'BIG5' | 'GOLDEN' | 'HUB' | 'STRATEGIC';
    heroImage?: string;
}

export const NATIONAL_TARGETS: NationalTarget[] = [
    // ========================================
    // 👑 TIER 1: BIG 5 (60% du CA)
    // ========================================
    {
        slug: "taxi-lyon",
        name: "Lyon",
        heroTitle: "Taxi Lyon & Gare Part-Dieu",
        geo: { lat: 45.764, lng: 4.835 },
        price_start: 2.50,
        top_places: ["Gare Part-Dieu", "Place Bellecour", "Groupama Stadium", "Fourvière"],
        zip: "69000",
        tier: 'BIG5',
        heroImage: "https://images.unsplash.com/photo-1620647833074-ce49b6b90710?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-marseille",
        name: "Marseille",
        heroTitle: "Taxi Marseille & Vieux-Port",
        geo: { lat: 43.296, lng: 5.369 },
        price_start: 2.40,
        top_places: ["Gare Saint-Charles", "Vieux-Port", "Notre-Dame de la Garde", "Stade Vélodrome"],
        zip: "13000",
        tier: 'BIG5',
        heroImage: "https://images.unsplash.com/photo-1589561454226-796a8aa89b05?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-nice",
        name: "Nice",
        heroTitle: "Taxi Nice Côte d'Azur",
        geo: { lat: 43.710, lng: 7.262 },
        price_start: 3.00,
        top_places: ["Promenade des Anglais", "Aéroport Nice Côte d'Azur", "Vieux Nice", "Place Masséna"],
        zip: "06000",
        tier: 'BIG5',
        heroImage: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-bordeaux",
        name: "Bordeaux",
        heroTitle: "Taxi Bordeaux & Gare Saint-Jean",
        geo: { lat: 44.837, lng: -0.579 },
        price_start: 2.50,
        top_places: ["Gare Saint-Jean", "Place de la Bourse", "Cité du Vin", "Stade Matmut"],
        zip: "33000",
        tier: 'BIG5',
        heroImage: "https://images.unsplash.com/photo-1559087867-ce4c91325525?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-toulouse",
        name: "Toulouse",
        heroTitle: "Taxi Toulouse & Aéroport Blagnac",
        geo: { lat: 43.604, lng: 1.444 },
        price_start: 2.40,
        top_places: ["Aéroport Blagnac", "Gare Matabiau", "Place du Capitole", "Cité de l'Espace"],
        zip: "31000",
        tier: 'BIG5',
        heroImage: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?q=80&w=2670&auto=format&fit=crop"
    },

    // ========================================
    // 💎 TIER 2: GOLDEN CITIES (Panier Moyen Explosif)
    // ========================================
    {
        slug: "taxi-cannes",
        name: "Cannes",
        heroTitle: "Taxi Cannes & Palais des Festivals",
        geo: { lat: 43.552, lng: 7.017 },
        price_start: 3.20,
        top_places: ["Palais des Festivals", "La Croisette", "Port de Cannes", "Vieux Port"],
        zip: "06400",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-aix-en-provence",
        name: "Aix-en-Provence",
        heroTitle: "Navette TGV Aix & Centre Ville",
        geo: { lat: 43.529, lng: 5.447 },
        price_start: 2.60,
        top_places: ["Gare Aix TGV", "Cours Mirabeau", "Jas de Bouffan", "Atelier Cézanne"],
        zip: "13100",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1596422846543-75c6fc197825?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-antibes",
        name: "Antibes",
        heroTitle: "Taxi Antibes & Juan-les-Pins",
        geo: { lat: 43.580, lng: 7.125 },
        price_start: 3.00,
        top_places: ["Port Vauban", "Cap d'Antibes", "Juan-les-Pins", "Marineland"],
        zip: "06600",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-biarritz",
        name: "Biarritz",
        heroTitle: "Taxi Biarritz & Côte Basque",
        geo: { lat: 43.483, lng: -1.558 },
        price_start: 2.80,
        top_places: ["Grande Plage", "Casino Barrière", "Aéroport Biarritz", "Rocher de la Vierge"],
        zip: "64200",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1597466765990-64ad1c35dafc?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-deauville",
        name: "Deauville",
        heroTitle: "Taxi Deauville & Trouville",
        geo: { lat: 49.359, lng: 0.077 },
        price_start: 2.80,
        top_places: ["Casino Barrière", "Les Planches", "Hippodrome", "CID"],
        zip: "14800",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-annecy",
        name: "Annecy",
        heroTitle: "Taxi Annecy & Lac d'Annecy",
        geo: { lat: 45.899, lng: 6.129 },
        price_start: 2.60,
        top_places: ["Lac d'Annecy", "Vieille Ville", "Gare d'Annecy", "Palais de l'Île"],
        zip: "74000",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1601461953939-36fbe4ed0b16?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-strasbourg",
        name: "Strasbourg",
        heroTitle: "Taxi Strasbourg & Parlement Européen",
        geo: { lat: 48.573, lng: 7.752 },
        price_start: 2.50,
        top_places: ["Gare de Strasbourg", "Parlement Européen", "Petite France", "Cathédrale"],
        zip: "67000",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-lille",
        name: "Lille",
        heroTitle: "Taxi Lille & Gare Lille Europe",
        geo: { lat: 50.629, lng: 3.057 },
        price_start: 2.40,
        top_places: ["Gare Lille Flandres", "Gare Lille Europe", "Aéroport Lesquin", "Grand'Place"],
        zip: "59000",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1577866068998-24bc8d46db6d?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-vincennes",
        name: "Vincennes",
        heroTitle: "Taxi Vincennes & Val-de-Marne",
        geo: { lat: 48.847, lng: 2.439 },
        price_start: 2.50,
        top_places: ["Château de Vincennes", "Bois de Vincennes", "Parc Floral", "Hippodrome"],
        zip: "94300",
        tier: 'GOLDEN',
        heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673&auto=format&fit=crop"
    },

    // ========================================
    // 🚄 TIER 3: HUBS RÉGIONAUX
    // ========================================
    {
        slug: "taxi-nantes",
        name: "Nantes",
        heroTitle: "Taxi Nantes & Gare TGV",
        geo: { lat: 47.218, lng: -1.553 },
        price_start: 2.40,
        top_places: ["Gare de Nantes", "Château des Ducs", "Machines de l'Île", "Aéroport Atlantique"],
        zip: "44000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1609671188873-b3a01e77d59c?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-rennes",
        name: "Rennes",
        heroTitle: "Taxi Rennes & Gare TGV",
        geo: { lat: 48.117, lng: -1.677 },
        price_start: 2.40,
        top_places: ["Gare de Rennes", "Place de la République", "Parc du Thabor", "Aéroport Saint-Jacques"],
        zip: "35000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1580657018950-e16b6d6db77c?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-montpellier",
        name: "Montpellier",
        heroTitle: "Taxi Montpellier & Gare Saint-Roch",
        geo: { lat: 43.611, lng: 3.877 },
        price_start: 2.40,
        top_places: ["Gare Saint-Roch", "Place de la Comédie", "Aéroport Méditerranée", "Antigone"],
        zip: "34000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1593259037804-f6e9b11adceb?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-grenoble",
        name: "Grenoble",
        heroTitle: "Taxi Grenoble & Stations de Ski",
        geo: { lat: 45.188, lng: 5.724 },
        price_start: 2.50,
        top_places: ["Gare de Grenoble", "Bastille", "Chamrousse", "Alpe d'Huez"],
        zip: "38000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-toulon",
        name: "Toulon",
        heroTitle: "Taxi Toulon & Port Militaire",
        geo: { lat: 43.124, lng: 5.928 },
        price_start: 2.40,
        top_places: ["Gare de Toulon", "Port de Toulon", "Mont Faron", "Aéroport Hyères"],
        zip: "83000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1576494231340-2e9d3a98e0df?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-avignon",
        name: "Avignon",
        heroTitle: "Taxi Avignon TGV & Provence",
        geo: { lat: 43.949, lng: 4.805 },
        price_start: 2.50,
        top_places: ["Gare Avignon TGV", "Palais des Papes", "Pont d'Avignon", "Gordes"],
        zip: "84000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1557171611-9b5377d4c3b0?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-reims",
        name: "Reims",
        heroTitle: "Taxi Reims & Route du Champagne",
        geo: { lat: 49.258, lng: 4.031 },
        price_start: 2.50,
        top_places: ["Gare de Reims", "Cathédrale Notre-Dame", "Caves de Champagne", "Maisons de Champagne"],
        zip: "51100",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-dijon",
        name: "Dijon",
        heroTitle: "Taxi Dijon & Route des Vins",
        geo: { lat: 47.322, lng: 5.041 },
        price_start: 2.40,
        top_places: ["Gare de Dijon", "Palais des Ducs", "Climats de Bourgogne", "Clos de Vougeot"],
        zip: "21000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-rouen",
        name: "Rouen",
        heroTitle: "Taxi Rouen & Normandie",
        geo: { lat: 49.443, lng: 1.099 },
        price_start: 2.40,
        top_places: ["Gare de Rouen", "Cathédrale Notre-Dame", "Gros-Horloge", "Panorama XXL"],
        zip: "76000",
        tier: 'HUB',
        heroImage: "https://images.unsplash.com/photo-1595838788874-a9df08cbf069?q=80&w=2670&auto=format&fit=crop"
    },

    // ========================================
    // ✈️ TIER 4: STRATEGIC SPOTS (Aéroports)
    // ========================================
    {
        slug: "taxi-roissy-cdg",
        name: "Roissy CDG",
        heroTitle: "Taxi Aéroport Roissy Charles de Gaulle",
        geo: { lat: 49.009, lng: 2.547 },
        price_start: 55.00, // Forfait Paris
        top_places: ["Terminal 1", "Terminal 2", "Terminal 3", "Roissypole"],
        zip: "95700",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-orly",
        name: "Orly",
        heroTitle: "Taxi Aéroport Paris Orly",
        geo: { lat: 48.726, lng: 2.365 },
        price_start: 36.00, // Forfait Paris
        top_places: ["Orly 1", "Orly 2", "Orly 3", "Orly 4"],
        zip: "94310",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-beauvais",
        name: "Beauvais",
        heroTitle: "Taxi Aéroport Beauvais-Tillé",
        geo: { lat: 49.455, lng: 2.113 },
        price_start: 150.00, // Course longue vers Paris
        top_places: ["Terminal Ryanair", "Cathédrale", "Centre-ville"],
        zip: "60000",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1606768666853-403c90a981ad?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-saint-exupery",
        name: "Lyon Saint-Exupéry",
        heroTitle: "Taxi Aéroport Lyon Saint-Exupéry",
        geo: { lat: 45.723, lng: 5.081 },
        price_start: 65.00,
        top_places: ["Terminal 1", "Terminal 2", "Gare TGV", "Centre Commercial"],
        zip: "69125",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-nice-aeroport",
        name: "Nice Côte d'Azur Aéroport",
        heroTitle: "Taxi Aéroport Nice Côte d'Azur",
        geo: { lat: 43.666, lng: 7.215 },
        price_start: 35.00,
        top_places: ["Terminal 1", "Terminal 2", "Monaco", "Cannes"],
        zip: "06200",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1558979158-65a1eaa08691?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-geneve",
        name: "Genève (Ferney-Voltaire)",
        heroTitle: "Taxi Aéroport Genève Côté France",
        geo: { lat: 46.238, lng: 6.109 },
        price_start: 50.00,
        top_places: ["Aéroport de Genève", "Ferney-Voltaire", "Annemasse", "Divonne-les-Bains"],
        zip: "01210",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1580477371194-e8de0a57a04a?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-bale-mulhouse",
        name: "Bâle-Mulhouse",
        heroTitle: "Taxi Aéroport Bâle-Mulhouse-Fribourg",
        geo: { lat: 47.590, lng: 7.529 },
        price_start: 45.00,
        top_places: ["Terminal Principal", "Mulhouse", "Bâle", "Colmar"],
        zip: "68300",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1515861461893-af66afaf3f1f?q=80&w=2670&auto=format&fit=crop"
    },
    {
        slug: "taxi-disneyland",
        name: "Disneyland Paris",
        heroTitle: "Taxi Disneyland Paris & Chessy",
        geo: { lat: 48.876, lng: 2.779 },
        price_start: 70.00,
        top_places: ["Parc Disneyland", "Walt Disney Studios", "Disney Village", "Gare de Chessy"],
        zip: "77700",
        tier: 'STRATEGIC',
        heroImage: "https://images.unsplash.com/photo-1495753132225-3d4d2c8ce2e9?q=80&w=2670&auto=format&fit=crop"
    }
];

// Helper to get a target by slug
export function getTargetBySlug(slug: string): NationalTarget | undefined {
    return NATIONAL_TARGETS.find(t => t.slug === slug);
}

// ========================================
// ADAPTER: Convert NationalTarget to CityConfig
// Uses Spintax for unique content per city
// ========================================
import { CityConfig } from "@/lib/db";
import { getHelpfulContent } from "@/lib/content";

export function getTargetAsCityConfig(slug: string): CityConfig | undefined {
    const target = NATIONAL_TARGETS.find(t => t.slug === slug);
    if (!target) return undefined;

    // Pricing logic: Flat rate (>10€) vs Meter start
    const isFlatRate = target.price_start > 10;
    const priceDisplay = isFlatRate
        ? `${target.price_start}€`
        : `Dès ${target.price_start.toFixed(2)}€`;
    const priceDesc = isFlatRate
        ? "Forfait Aéroport Estimé"
        : "Prise en charge tarifaire";

    // SPINTAX-GENERATED unique description
    const uniqueDescription = getHelpfulContent("partner_description", target.name, 'HUB');
    const uniqueMetaDescription = getHelpfulContent("partner_meta_description", target.name, 'HUB');

    return {
        slug: target.slug,
        city: target.name,
        name: `Taxi ${target.name}`,
        domain: `taxifrance.fr/ville/${target.slug}`,
        heroImage: target.heroImage || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2940&auto=format&fit=crop",

        // SPINTAX-INJECTED unique content
        description: uniqueDescription,

        // Tier-based features
        features: [
            "Chauffeurs Locaux",
            "Berline Confort",
            "Prix Réglementé",
            "CB Acceptée",
            ...(target.tier === 'STRATEGIC' ? ["Suivi de Vol", "Attente Pancarte"] : ["Transport Médical"])
        ],

        // Smart extraction from top_places
        stations: target.top_places.filter(p =>
            p.toLowerCase().includes('gare') ||
            p.toLowerCase().includes('aéroport') ||
            p.toLowerCase().includes('terminal')
        ),
        hospitals: [`Hôpital ${target.name} Sud`, `Clinique ${target.name}`, "Centre Hospitalier"],
        neighborhoods: target.top_places.filter(p =>
            !p.toLowerCase().includes('gare') &&
            !p.toLowerCase().includes('aéroport') &&
            !p.toLowerCase().includes('terminal')
        ).slice(0, 4),

        points_of_interest: {
            hotels: [],
            nightlife: target.top_places.slice(0, 3),
            monuments: target.top_places,
            parking_difficulty: "Variable"
        },

        pricing: {
            base: priceDisplay,
            description: priceDesc,
            km: target.tier === 'STRATEGIC' ? 0 : 2.20 // 0 si forfait aéroport, sinon 2.20€/km
        },

        phoneNumber: "09 72 50 12 50", // National standard
        email: "contact@taxifrance.fr",
        type: "PARTNER",

        meta: {
            title: target.heroTitle,
            description: uniqueMetaDescription.substring(0, 160)
        }
    };
}

