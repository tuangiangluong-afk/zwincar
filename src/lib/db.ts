
export interface CityConfig {
    slug: string;
    domain: string;
    aliases?: string[];
    name: string;
    city: string;
    phoneNumber: string;
    email: string;
    heroImage: string;
    description: string;
    meta: {
        title: string;
        description: string;
    };
    features: string[];
    pricing: {
        base: string;
        description: string;
        km?: number; // Tarif au kilomètre (optionnel)
    };
    // Iceberg Extend
    hospitals: string[];
    stations: string[];
    neighborhoods: string[];
    points_of_interest: {
        hotels: string[];
        nightlife: string[];
        monuments: string[];
        parking_difficulty: string;
    };
    department?: string; // e.g. "78", "92"
    // GEO: Coordinates for Schema.org LocalBusiness & Google Maps
    latitude?: number;
    longitude?: number;
    ga_id?: string; // Google Analytics G-XXXXXXXXXX
    gtm_id?: string; // Google Tag Manager GTM-XXXXXX
    // Ghost Broker Strategy
    type?: 'OWNED' | 'PARTNER'; // Default to OWNED if undefined
    partnerPhone?: string; // Number to forward to if PARTNER
}

export function getCity(domain: string): CityConfig | null {
    // Normalize: remove port and www.
    domain = domain.split(':')[0];
    domain = domain.replace(/^www\./, '');

    // DEV: Handle localhost
    if (domain.endsWith('.localhost')) {
        const subdomain = domain.split('.')[0]; // taxirueil
        // Find matching city config ignoring TLD
        const found = Object.values(CITIES).find(c => c.domain.startsWith(`${subdomain}.`));
        if (found) return found;
    }

    if (CITIES[domain]) return CITIES[domain];

    // Fallback for aliases if not explicit (but we are making everything explicit now)
    const cityKey = Object.keys(CITIES).find((key) => {
        const city = CITIES[key];
        return (
            city.domain === domain ||
            city.aliases?.includes(domain)
        );
    });

    if (cityKey) return CITIES[cityKey];
    return null;
}

export function getCityBySlug(slug: string): CityConfig | null {
    return Object.values(CITIES).find(c => c.slug === slug) || null;
}


const TEMPLATE_FEATURES = [
    "Navette Aéroport",
    "Gare TGV / RER",
    "Berline Affaires",
    "Transport VSL"
];

const TEMPLATE_PRICING = {
    base: "25€",
    description: "Tarif estimatif jour"
};

// Helper to clone base config for .com domains
// Usage: clone(_base, "domain.com", "slug_com", "G-ANALYTICS-ID")
const clone = (base: CityConfig, domain: string, slug: string, ga_id?: string): CityConfig => ({
    ...base,
    slug,
    domain,
    aliases: [], // No aliases for the clone
    email: `contact@${domain}`,
    ga_id: ga_id // Set GA ID specifically if provided
});

// --- BASE CITIES DEFINITIONS ---

const _taxiaplaisir: CityConfig = {
    slug: "taxiaplaisir",
    domain: "taxiaplaisir.com",
    name: "Taxi Plaisir 78",
    city: "Plaisir",
    department: "78",
    latitude: 48.8208,
    longitude: 1.9483,
    phoneNumber: "01 84 60 78 78",
    email: "contact@taxiaplaisir.com",
    heroImage: "https://images.unsplash.com/photo-1549247690-3ae8e6a25691?q=80&w=2670&auto=format&fit=crop", // Suburban / Train
    description: "Votre taxi à Plaisir (78370). Transport vers gares et aéroports parisiens.",
    meta: {
        title: "Taxi Plaisir 78370 | Réservation Immédiate & VSL",
        description: "Taxi à Plaisir (78). Service de transport local et longue distance. Navette Gares & Aéroports. Conventionné CPAM."
    },
    features: TEMPLATE_FEATURES,
    pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Privé de l'Ouest Parisien", "Hôpital Mignot"],
    stations: ["Gare de Plaisir-Grignon", "Gare de Plaisir-Les Clayes"],
    neighborhoods: ["Valibout", "Les Gâtines", "Aqueduc de l'Avre"],
    points_of_interest: {
        hotels: ["Première Classe Plaisir", "Campanile Plaisir"],
        nightlife: ["Cinéma UGC Plaisir", "Théâtre Coluche", "Bowling de Plaisir"],
        monuments: ["Château de Plaisir"],
        parking_difficulty: "Moyenne"
    }
};

const _taxiasnieres: CityConfig = {
    slug: "taxiasnieres",
    domain: "taxiasnieres.com",
    name: "Taxi Asnières 92",
    city: "Asnières-sur-Seine",
    department: "92",
    latitude: 48.9147,
    longitude: 2.2886,
    phoneNumber: "01 84 60 92 92",
    email: "contact@taxiasnieres.com",
    heroImage: "https://images.unsplash.com/photo-1579782522776-9c4749f7ba30?q=80&w=2670&auto=format&fit=crop", // Seine / Bridge
    description: "Taxi Asnières-sur-Seine. Déplacements rapides vers Paris et La Défense.",
    meta: { title: "Taxi Asnières-sur-Seine (92) | Moto Taxi & VSL", description: "Réservez un taxi à Asnières-sur-Seine." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Beaujon"], stations: ["Gare d'Asnières"], neighborhoods: ["Bécon-les-Bruyères"],
    points_of_interest: {
        hotels: ["Ibis Styles Asnières", "Hotel Terminus"],
        nightlife: ["Théâtre Armande Béjart", "Rosa Bonheur à l'Ouest"],
        monuments: ["Cimetière des Chiens"],
        parking_difficulty: "Difficile"
    }
};

const _taxiboulogne: CityConfig = {
    slug: "taxiboulogne",
    domain: "taxiboulogne.com",
    name: "Taxi Boulogne 92",
    city: "Boulogne-Billancourt",
    department: "92",
    latitude: 48.8397,
    longitude: 2.2399,
    phoneNumber: "01 84 60 92 00",
    email: "contact@taxiboulogne.com",
    heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2670&auto=format&fit=crop", // Business / Modern
    description: "Taxi Boulogne-Billancourt. Service premium 92.",
    meta: { title: "Taxi Boulogne-Billancourt (92) | Réservation Taxi", description: "Taxi Boulogne." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Ambroise-Paré"], stations: ["Pont de Sèvres"], neighborhoods: ["Billancourt", "Parchamp"],
    points_of_interest: {
        hotels: ["Radisson Blu", "Marriott"],
        nightlife: ["La Seine Musicale", "Carré Seine"],
        monuments: ["La Seine Musicale"],
        parking_difficulty: "Enfer"
    }
};

const _taxichambourcy: CityConfig = {
    slug: "taxichambourcy",
    domain: "taxichambourcy.com",
    name: "Taxi Chambourcy 78",
    city: "Chambourcy",
    department: "78",
    latitude: 48.9139,
    longitude: 2.0444,
    phoneNumber: "01 84 60 78 00",
    email: "contact@taxichambourcy.com",
    heroImage: "https://images.unsplash.com/photo-1596726915077-d64e97669d2d?q=80&w=2670&auto=format&fit=crop", // Green / Residential
    description: "Taxi Chambourcy.",
    meta: { title: "Taxi Chambourcy (78) | Transport", description: "Taxi Chambourcy." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital de Poissy"], stations: ["Gare de Poissy"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Ibis Saint-Germain-en-Laye", "Campanile Chambourcy"],
        nightlife: ["Bowlcenter Orgeval", "Cinéma CGR Poissy"],
        monuments: ["Désert de Retz"],
        parking_difficulty: "Facile"
    }
};

const _taxicolombes: CityConfig = {
    slug: "taxicolombes",
    domain: "taxicolombes.com",
    name: "Taxi Colombes 92",
    city: "Colombes",
    department: "92",
    latitude: 48.9231,
    longitude: 2.2517,
    phoneNumber: "01 84 60 92 01",
    email: "contact@taxicolombes.com",
    heroImage: "https://images.unsplash.com/photo-1517582082645-88547214e21a?q=80&w=2670&auto=format&fit=crop", // Residential / Stadium
    description: "Taxi Colombes.",
    meta: { title: "Taxi Colombes (92) | Transport", description: "Taxi Colombes." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Louis-Mourier"], stations: ["Gare de Colombes"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Kyriad Colombes", "Courtyard Marriott"],
        nightlife: ["L'Avant Seine", "Patinoire de Colombes"],
        monuments: ["Le Stade Yves-du-Manoir"],
        parking_difficulty: "Moyenne"
    }
};

const _taxicourbevoie: CityConfig = {
    slug: "taxicourbevoie",
    domain: "taxicourbevoie.com",
    name: "Taxi Courbevoie 92",
    city: "Courbevoie",
    department: "92",
    latitude: 48.8966,
    longitude: 2.2567,
    phoneNumber: "01 84 60 92 02",
    email: "contact@taxicourbevoie.com",
    heroImage: "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?q=80&w=2670&auto=format&fit=crop", // La Défense / Skyscrapers
    description: "Taxi Courbevoie.",
    meta: { title: "Taxi Courbevoie (92) | La Défense", description: "Taxi Courbevoie." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Courbevoie"], stations: ["Gare de Courbevoie"], neighborhoods: ["La Défense"],
    points_of_interest: {
        hotels: ["Pullman La Défense", "Melia Paris La Défense"],
        nightlife: ["Paris La Défense Arena", "Rooftop Skyline"],
        monuments: ["Grande Arche"],
        parking_difficulty: "Difficile"
    }
};

const _taxifeucherolles: CityConfig = {
    slug: "taxifeucherolles",
    domain: "taxifeucherolles.com",
    name: "Taxi Feucherolles 78",
    city: "Feucherolles",
    department: "78",
    latitude: 48.8653,
    longitude: 1.9714,
    phoneNumber: "01 84 60 78 01",
    email: "contact@taxifeucherolles.com",
    heroImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2670&auto=format&fit=crop", // Countryside aspect
    description: "Taxi Feucherolles.",
    meta: { title: "Taxi Feucherolles (78)", description: "Taxi Feucherolles." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: [], stations: [], neighborhoods: [],
    points_of_interest: {
        hotels: ["La Maison de Feucherolles"],
        nightlife: ["Golf de Feucherolles", "Restaurant du Golf"],
        monuments: ["Eglise Saint-Denis"],
        parking_difficulty: "Facile"
    }
};

const _taxifourqueux: CityConfig = {
    slug: "taxifourqueux",
    domain: "taxifourqueux.com",
    name: "Taxi Fourqueux 78",
    city: "Fourqueux",
    department: "78",
    latitude: 48.8903,
    longitude: 2.0611,
    phoneNumber: "01 84 60 78 02",
    email: "contact@taxifourqueux.com",
    heroImage: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2670&auto=format&fit=crop", // Peaceful Residential
    description: "Taxi Fourqueux.",
    meta: { title: "Taxi Fourqueux (78)", description: "Taxi Fourqueux." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: [], stations: ["Gare St Germain GC"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Pavillon Henri IV", "Ibis St Germain"],
        nightlife: ["Golf de Fourqueux", "Théâtre Alexandre Dumas"],
        monuments: ["Villa Savoye"],
        parking_difficulty: "Facile"
    }
};

const _taxiguyancourt: CityConfig = {
    slug: "taxiguyancourt",
    domain: "taxiguyancourt.com",
    name: "Taxi Guyancourt 78",
    city: "Guyancourt",
    department: "78",
    latitude: 48.7714,
    longitude: 2.0758,
    phoneNumber: "01 84 60 78 03",
    email: "contact@taxiguyancourt.com",
    heroImage: "https://images.unsplash.com/photo-1435686858161-59da32dfd4b4?q=80&w=2674&auto=format&fit=crop", // Technocentre / Modern
    description: "Taxi Guyancourt.",
    meta: { title: "Taxi Guyancourt (78)", description: "Taxi Guyancourt." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: [], stations: ["Gare SQY"], neighborhoods: ["Villaroy"],
    points_of_interest: {
        hotels: ["Mercure Saint-Quentin", "Best Western The Wish"],
        nightlife: ["Golf National", "La Batterie"],
        monuments: ["Technocentre Renault"],
        parking_difficulty: "Moyenne"
    }
};

const _taxiissy: CityConfig = {
    slug: "taxiissy",
    domain: "taxiissy.com",
    name: "Taxi Issy 92",
    city: "Issy-les-Moulineaux",
    department: "92",
    latitude: 48.8240,
    longitude: 2.2700,
    phoneNumber: "01 84 60 92 03",
    email: "contact@taxiissy.com",
    heroImage: "https://images.unsplash.com/photo-1534353875273-b5887cc17a5a?q=80&w=2670&auto=format&fit=crop", // Media / Modern
    description: "Taxi Issy.",
    meta: { title: "Taxi Issy-les-Moulineaux (92)", description: "Taxi Issy." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Suisse"], stations: ["Val de Seine"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Novotel Cœur d'Orléans", "Ibis Issy Val de Seine"],
        nightlife: ["Le Réacteur", "Musée de la Carte à Jouer"],
        monuments: ["Ile Saint-Germain"],
        parking_difficulty: "Difficile"
    }
};

const _taxilepecq: CityConfig = {
    slug: "taxilepecq",
    domain: "taxilepecq.com",
    name: "Taxi Le Pecq 78",
    city: "Le Pecq",
    department: "78",
    latitude: 48.8931,
    longitude: 2.1072,
    phoneNumber: "01 84 60 78 04",
    email: "contact@taxilepecq.com",
    heroImage: "https://images.unsplash.com/photo-1574087961230-03975ba6bf0a?q=80&w=2670&auto=format&fit=crop", // River / Green
    description: "Taxi Le Pecq.",
    meta: { title: "Taxi Le Pecq (78)", description: "Taxi Le Pecq." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: [], stations: ["RER A Le Vésinet-Le Pecq"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Aparthotel Adagio", "Hotel Paris-Saint-Germain"],
        nightlife: ["L'Ermitage", "Théâtre du Vésinet"],
        monuments: ["Parc Corbière"],
        parking_difficulty: "Moyenne"
    }
};

const _taxilevallois: CityConfig = {
    slug: "taxilevallois",
    domain: "taxilevallois.com",
    name: "Taxi Levallois 92",
    city: "Levallois-Perret",
    department: "92",
    latitude: 48.8950,
    longitude: 2.2876,
    phoneNumber: "01 84 60 92 04",
    email: "contact@taxilevallois.com",
    heroImage: "https://images.unsplash.com/photo-1444723121867-26fe31533ad7?q=80&w=2670&auto=format&fit=crop", // Density / Business
    description: "Taxi Levallois.",
    meta: { title: "Taxi Levallois-Perret (92)", description: "Taxi Levallois." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Franco-Britannique"], stations: ["Gare de Clichy-Levallois"], neighborhoods: [],
    points_of_interest: {
        hotels: ["EverGreen Laurel", "Ibis Paris Levallois"],
        nightlife: ["So Ouest", "Polyclinique de Levallois ( urgence )"],
        monuments: ["Mairie de Levallois"],
        parking_difficulty: "Difficile"
    }
};

const _taxilevesinet: CityConfig = {
    slug: "taxilevesinet",
    domain: "taxilevesinet.com",
    name: "Taxi Le Vésinet 78",
    city: "Le Vésinet",
    department: "78",
    latitude: 48.8922,
    longitude: 2.1311,
    phoneNumber: "01 84 60 78 05",
    email: "contact@taxilevesinet.com",
    heroImage: "https://images.unsplash.com/photo-1594968412030-8451f28b2a3c?q=80&w=2670&auto=format&fit=crop", // Park / Lake
    description: "Taxi Le Vésinet.",
    meta: { title: "Taxi Le Vésinet (78)", description: "Taxi Le Vésinet." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: [], stations: ["RER Le Vésinet Centre"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Maison Blanche", "Ibis Chatou"],
        nightlife: ["Théâtre du Vésinet", "Cinéma Jean Marais"],
        monuments: ["Les Ibis"],
        parking_difficulty: "Facile"
    }
};

const _taxilouveciennes: CityConfig = {
    slug: "taxilouveciennes",
    domain: "taxilouveciennes.com",
    name: "Taxi Louveciennes 78",
    city: "Louveciennes",
    department: "78",
    latitude: 48.8614,
    longitude: 2.1183,
    phoneNumber: "01 84 60 78 06",
    email: "contact@taxilouveciennes.com",
    heroImage: "https://images.unsplash.com/photo-1563725656116-24e5482e9b09?q=80&w=2670&auto=format&fit=crop", // Aqueduct / Historic
    description: "Taxi Louveciennes.",
    meta: { title: "Taxi Louveciennes (78)", description: "Taxi Louveciennes." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: [], stations: ["Gare de Louveciennes"], neighborhoods: [],
    points_of_interest: {
        hotels: ["B&B Hotel", "Campanile"],
        nightlife: ["Pavillon de Musique", "Seine Lounge"],
        monuments: ["Aqueduc de Louveciennes"],
        parking_difficulty: "Facile"
    }
};

const _taximarly: CityConfig = {
    slug: "taximarly",
    domain: "taximarly.com",
    name: "Taxi Marly 78",
    city: "Marly-le-Roi",
    department: "78",
    latitude: 48.8672,
    longitude: 2.0931,
    phoneNumber: "01 84 60 78 07",
    email: "contact@taximarly.com",
    heroImage: "https://images.unsplash.com/photo-1620397228833-289b5314eb49?q=80&w=2670&auto=format&fit=crop", // Park / Historic
    description: "Taxi Marly.",
    meta: { title: "Taxi Marly-le-Roi (78)", description: "Taxi Marly." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: [], stations: ["Gare de Marly-le-Roi"], neighborhoods: [],
    points_of_interest: {
        hotels: ["L'Ermitage des Loges"],
        nightlife: ["Centre Culturel Jean Vilar", "Le Fontenoy"],
        monuments: ["Parc de Marly", "Abreuvoir"],
        parking_difficulty: "Facile"
    }
};

const _taximontreuil: CityConfig = {
    slug: "taximontreuil",
    domain: "taximontreuil.com",
    name: "Taxi Montreuil 93",
    city: "Montreuil",
    department: "93",
    latitude: 48.8638,
    longitude: 2.4433,
    phoneNumber: "01 84 60 93 00",
    email: "contact@taximontreuil.com",
    heroImage: "https://images.unsplash.com/photo-1600853760458-45a90940507d?q=80&w=2670&auto=format&fit=crop", // Urban / Street Art
    description: "Taxi Montreuil.",
    meta: { title: "Taxi Montreuil (93)", description: "Taxi Montreuil." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital André Grégoire"], stations: ["Mairie de Montreuil"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Ibis Styles Mairie", "Novotel Montreuil"],
        nightlife: ["La Parole Errante", "Le Chinois"],
        monuments: ["Murs à Pêches"],
        parking_difficulty: "Difficile"
    }
};

const _taxinanterre: CityConfig = {
    slug: "taxinanterre",
    domain: "taxinanterre.fr",
    name: "Taxi Nanterre 92",
    city: "Nanterre",
    department: "92",
    latitude: 48.8924,
    longitude: 2.2069,
    phoneNumber: "01 84 60 92 05",
    email: "contact@taxinanterre.com",
    heroImage: "https://images.unsplash.com/photo-1577713451555-d3dceb22570b?q=80&w=3181&auto=format&fit=crop", // Nanterre / Towers (La def)
    description: "Taxi Nanterre.",
    meta: { title: "Taxi Nanterre (92)", description: "Taxi Nanterre." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Nanterre"], stations: ["Nanterre Université"], neighborhoods: [],
    points_of_interest: {
        hotels: ["CitizenM La Défense", "Arena Hotel"],
        nightlife: ["Nanterre Amandiers", "Paris La Défense Arena"],
        monuments: ["Parc André Malraux"],
        parking_difficulty: "Moyenne"
    }
};

const _taxineuilly: CityConfig = {
    slug: "taxineuilly",
    domain: "taxineuilly.com",
    name: "Taxi Neuilly 92",
    city: "Neuilly-sur-Seine",
    department: "92",
    latitude: 48.8848,
    longitude: 2.2686,
    phoneNumber: "01 84 60 92 06",
    email: "contact@taxineuilly.com",
    heroImage: "https://images.unsplash.com/photo-1551101968-3e414168c818?q=80&w=2670&auto=format&fit=crop", // Luxury / Avenue
    description: "Taxi Neuilly.",
    meta: { title: "Taxi Neuilly-sur-Seine (92)", description: "Taxi Neuilly." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Américain"], stations: ["Pont de Neuilly"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Le Neuilly Park Hotel", "Mövenpick"],
        nightlife: ["Théâtre des Sablons", "Cinéma Le Village"],
        monuments: ["Fondation Louis Vuitton"],
        parking_difficulty: "Difficile"
    }
};

const _taxipoissy: CityConfig = {
    slug: "taxipoissy",
    domain: "taxipoissy.com",
    name: "Taxi Poissy 78",
    city: "Poissy",
    department: "78",
    latitude: 48.9283,
    longitude: 2.0486,
    phoneNumber: "01 84 60 78 08",
    email: "contact@taxipoissy.com",
    heroImage: "https://images.unsplash.com/photo-1588691888273-0972740994cc?q=80&w=2670&auto=format&fit=crop", // Poissy / River
    description: "Taxi Poissy.",
    meta: { title: "Taxi Poissy (78)", description: "Taxi Poissy." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["CHIPS Poissy"], stations: ["Gare de Poissy"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Ibis Poissy", "Novotel Poissy Orgeval"],
        nightlife: ["Théâtre de Poissy", "Cinéma CGR"],
        monuments: ["Villa Savoye", "Collégiale Notre-Dame"],
        parking_difficulty: "Moyenne"
    }
};

const _taxirueil: CityConfig = {
    slug: "taxirueil",
    domain: "taxirueil.com",
    name: "Taxi Rueil 92",
    city: "Rueil-Malmaison",
    department: "92",
    latitude: 48.8764,
    longitude: 2.1797,
    phoneNumber: "01 84 60 92 07",
    email: "contact@taxirueil.com",
    heroImage: "https://images.unsplash.com/photo-1572025442641-51874911eb34?q=80&w=2670&auto=format&fit=crop", // Rueil / Chateau substitute
    description: "Taxi Rueil.",
    meta: { title: "Taxi Rueil-Malmaison (92)", description: "Taxi Rueil." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Clinique des Martinets"], stations: ["RER Rueil"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Novotel Rueil", "Ibis Saint-Germain"],
        nightlife: ["Théâtre André Malraux", "Cinéma Ariel"],
        monuments: ["Château de Malmaison"],
        parking_difficulty: "Moyenne"
    }
};

const _taxisaintcloud: CityConfig = {
    slug: "taxisaintcloud",
    domain: "taxisaintcloud.com",
    name: "Taxi Saint-Cloud 92",
    city: "Saint-Cloud",
    department: "92",
    latitude: 48.8444,
    longitude: 2.2161,
    phoneNumber: "01 84 60 92 08",
    email: "contact@taxisaintcloud.com",
    heroImage: "https://images.unsplash.com/photo-1558284564-96cce29fa757?q=80&w=2670&auto=format&fit=crop", // Saint-Cloud / View
    description: "Taxi Saint-Cloud.",
    meta: { title: "Taxi Saint-Cloud (92)", description: "Taxi Saint-Cloud." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Huguenin"], stations: ["Gare de Saint-Cloud"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Hotel Quorum", "Mercure Paris Saint-Cloud"],
        nightlife: ["Hippodrome de Saint-Cloud", "Domaine National"],
        monuments: ["Parc de Saint-Cloud"],
        parking_difficulty: "Difficile"
    }
};

const _taxisaintcyr: CityConfig = {
    slug: "taxisaintcyr",
    domain: "taxisaintcyr.com",
    name: "Taxi Saint-Cyr 78",
    city: "Saint-Cyr-l'École",
    department: "78",
    latitude: 48.7997,
    longitude: 2.0686,
    phoneNumber: "01 84 60 78 09",
    email: "contact@taxisaintcyr.com",
    heroImage: "https://images.unsplash.com/photo-1453749024868-697896193389?q=80&w=2670&auto=format&fit=crop", // Saint-Cyr / Classic
    description: "Taxi Saint-Cyr.",
    meta: { title: "Taxi Saint-Cyr-l'École (78)", description: "Taxi Saint-Cyr." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: [], stations: ["Gare de Saint-Cyr"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Aerotel", "Kyriad Versailles"],
        nightlife: ["Théâtre Gérard Philipe"],
        monuments: ["Ecole Militaire"],
        parking_difficulty: "Moyenne"
    }
};

const _taxisaintdenis: CityConfig = {
    slug: "taxisaintdenis",
    domain: "taxisaintdenis.com",
    name: "Taxi Saint-Denis 93",
    city: "Saint-Denis",
    department: "93",
    latitude: 48.9362,
    longitude: 2.3572,
    phoneNumber: "01 84 60 93 01",
    email: "contact@taxisaintdenis.com",
    heroImage: "https://images.unsplash.com/photo-1510952267577-d9580d859188?q=80&w=2670&auto=format&fit=crop", // Saint-Denis / Basilica
    description: "Taxi Saint-Denis.",
    meta: { title: "Taxi Saint-Denis (93)", description: "Taxi Saint-Denis." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Delafontaine"], stations: ["Gare de Saint-Denis"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Novotel Stade de France", "Ibis Saint-Denis"],
        nightlife: ["Le 6B", "La Ligne 13"],
        monuments: ["Stade de France", "Basilique"],
        parking_difficulty: "Difficile"
    }
};

const _taxisaintgermain: CityConfig = {
    slug: "taxisaintgermain",
    domain: "taxisaintgermain.com",
    name: "Taxi Saint-Germain 78",
    city: "Saint-Germain-en-Laye",
    department: "78",
    latitude: 48.8986,
    longitude: 2.0936,
    phoneNumber: "01 84 60 78 10",
    email: "contact@taxisaintgermain.com",
    heroImage: "https://images.unsplash.com/photo-1528659550302-7c8567584090?q=80&w=2670&auto=format&fit=crop", // Saint-Germain / Chateau
    description: "Taxi Saint-Germain.",
    meta: { title: "Taxi Saint-Germain-en-Laye (78)", description: "Taxi Saint-Germain." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital de Poissy-St-Germain"], stations: ["RER A St Germain"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Pavillon Henri IV", "Ibis Centre"],
        nightlife: ["Théâtre Alexandre Dumas", "L'Estrella"],
        monuments: ["Château de St Germain", "Grande Terrasse"],
        parking_difficulty: "Moyenne"
    }
};

const _taxisaintnom: CityConfig = {
    slug: "taxisaintnom",
    domain: "taxisaintnom.com",
    name: "Taxi Saint-Nom 78",
    city: "Saint-Nom-la-Bretèche",
    department: "78",
    latitude: 48.8611,
    longitude: 2.0181,
    phoneNumber: "01 84 60 78 11",
    email: "contact@taxisaintnom.com",
    heroImage: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2676&auto=format&fit=crop", // Saint-Nom / Golf
    description: "Taxi Saint-Nom.",
    meta: { title: "Taxi Saint-Nom-la-Bretèche (78)", description: "Taxi Saint-Nom." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital de Poissy", "Clinique de Saint-Germain"], stations: ["Gare de Saint-Nom-la-Bretèche", "Gare de Saint-Germain-en-Laye (RER A)", "Gare de Marly-le-Roi"], neighborhoods: ["Le Village", "Les Fontenelles"],
    points_of_interest: {
        hotels: ["Domaine de la Tuilerie"],
        nightlife: ["Golf de Saint-Nom", "Club House"],
        monuments: ["Forêt de Marly"],
        parking_difficulty: "Facile"
    }
};

const _taxisaintouen: CityConfig = {
    slug: "taxisaintouen",
    domain: "taxisaintouen.com",
    name: "Taxi Saint-Ouen 93",
    city: "Saint-Ouen",
    department: "93",
    latitude: 48.9119,
    longitude: 2.3344,
    phoneNumber: "01 84 60 93 02",
    email: "contact@taxisaintouen.com",
    heroImage: "https://images.unsplash.com/photo-1552560229-edf081308aeb?q=80&w=2674&auto=format&fit=crop", // Saint-Ouen / Flea Market
    description: "Taxi Saint-Ouen.",
    meta: { title: "Taxi Saint-Ouen (93)", description: "Taxi Saint-Ouen." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: [], stations: ["Gare de St Ouen"], neighborhoods: [],
    points_of_interest: {
        hotels: ["Mercure Saint-Ouen", "Mob Hotel"],
        nightlife: ["La Commune", "Mains d'Œuvres"],
        monuments: ["Puces de St Ouen", "Château de Saint-Ouen"],
        parking_difficulty: "Difficile"
    }
};

const _taxisaintquentin: CityConfig = {
    slug: "taxisaintquentin",
    domain: "taxisaintquentin.com",
    name: "Taxi SQY 78",
    city: "Saint-Quentin-en-Yvelines",
    department: "78",
    latitude: 48.7867,
    longitude: 2.0286,
    phoneNumber: "01 84 60 78 12",
    email: "contact@taxisaintquentin.com",
    heroImage: "https://images.unsplash.com/photo-1586526749045-8c01d1c8153c?q=80&w=2670&auto=format&fit=crop", // SQY / Architecture
    description: "Taxi SQY.",
    meta: { title: "Taxi Saint-Quentin-en-Yvelines (78)", description: "Taxi SQY." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Privé de l'Ouest Parisien", "Hôpital Mignot"],
    stations: ["Gare de Saint-Quentin-en-Yvelines", "Gare de Trappes"],
    neighborhoods: ["Le Pas du Lac", "Sourderie", "Villaroy"],
    points_of_interest: {
        hotels: ["Ibis Budget Saint-Quentin", "Campanile Saint-Quentin", "Mercure Maurepas"],
        nightlife: ["Vélodrome National", "Théâtre de Saint-Quentin", "UGC Ciné Cité SQY Ouest"],
        monuments: ["Porte des Merogis"],
        parking_difficulty: "Moyenne"
    }

};

const _taxisversailles: CityConfig = {
    slug: "taxisversailles",
    domain: "taxisversailles.com",
    name: "Taxi Versailles 78",
    city: "Versailles",
    department: "78",
    latitude: 48.8014,
    longitude: 2.1301,
    phoneNumber: "01 84 60 78 13",
    email: "contact@taxisversailles.com",
    heroImage: "https://images.unsplash.com/photo-1555543666-3d604eeb64b0?q=80&w=2670&auto=format&fit=crop", // Versailles / Chateau
    description: "Taxi Versailles.",
    meta: { title: "Taxi Versailles (78)", description: "Taxi Versailles." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Mignot"], stations: ["Gare Versailles Chantiers", "Gare Rive Droite"], neighborhoods: ["Notre-Dame", "Saint-Louis"],
    points_of_interest: {
        hotels: ["Trianon Palace", "L'Orangerie", "Ibis Versailles"],
        nightlife: ["Place du Marché", "Royale Factory"],
        monuments: ["Château de Versailles", "Jardins"],
        parking_difficulty: "Difficile"
    }
};

const _taxivincennes: CityConfig = {
    slug: "taxivincennes",
    domain: "taxivincennes.com",
    name: "Taxi Vincennes 94",
    city: "Vincennes",
    department: "94",
    latitude: 48.8474,
    longitude: 2.4386,
    phoneNumber: "01 84 60 94 00",
    email: "contact@taxivincennes.com",
    heroImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2673&auto=format&fit=crop", // Chateau / Royal
    description: "Taxi Vincennes.",
    meta: { title: "Taxi Vincennes (94) | Château & Bois", description: "Taxi Vincennes." },
    features: TEMPLATE_FEATURES, pricing: TEMPLATE_PRICING,
    hospitals: ["Hôpital Begin"],
    stations: ["RER A Vincennes", "Château de Vincennes (M1)"],
    neighborhoods: ["Le Vigner", "Diderot", "Domaine du Bois"],
    points_of_interest: {
        hotels: ["Royal Regency", "Apparthotel Adagio"],
        nightlife: ["Hippodrome de Vincennes", "Parc Floral"],
        monuments: ["Château de Vincennes", "Donjon"],
        parking_difficulty: "Difficile"
    }
};

// ========================================
// PARTNER CITIES (Ghost Broker Strategy)
// ========================================
const _taxilyon: CityConfig = {
    slug: "taxi-lyon",
    domain: "taxilyon.fr", // Virtual - Not a real owned domain yet
    type: 'PARTNER',
    partnerPhone: "+33478282323", // Placeholder - Allo Taxi Lyon
    name: "Taxi Lyon",
    city: "Lyon",
    department: "69",
    latitude: 45.7640,
    longitude: 4.8357,
    phoneNumber: "04 78 28 23 23",
    email: "contact@taxifrance.fr", // Route to our central
    heroImage: "https://images.unsplash.com/photo-1620647833074-ce49b6b90710?q=80&w=2670&auto=format&fit=crop",
    description: "Réservez votre Taxi à Lyon. Partenaires officiels Gare Part-Dieu et Aéroport Saint-Exupéry.",
    meta: {
        title: "Taxi Lyon | Réservation Taxi Gare Part-Dieu & Aéroport St Exupéry",
        description: "Taxi Lyon : Service de réservation immédiate. Chauffeurs lyonnais indépendants. Transfert Gare Part-Dieu, Perrache et Aéroport Saint-Exupéry."
    },
    features: ["Gare Part-Dieu", "Aéroport St Exupéry", "Conventionné CPAM", "Longue Distance"],
    pricing: {
        base: "2.50€",
        description: "Prise en charge (Tarif Préfectoral Rhône)"
    },
    hospitals: ["Hôpital Edouard Herriot", "Hôpital de la Croix-Rousse", "Centre Léon Bérard", "Clinique de la Sauvegarde"],
    stations: ["Gare Lyon Part-Dieu", "Gare Lyon Perrache", "Gare Saint-Exupéry TGV"],
    neighborhoods: ["Presqu'île", "Vieux Lyon", "La Part-Dieu", "Confluence", "Croix-Rousse", "Gerland"],
    points_of_interest: {
        hotels: ["InterContinental Lyon - Hotel Dieu", "Radisson Blu", "Mama Shelter Lyon", "Sofitel Lyon Bellecour"],
        nightlife: ["Le Sucre", "Rue Mercière", "Ninkasi Gerland", "Transbordeur"],
        monuments: ["Basilique de Fourvière", "Place Bellecour", "Parc de la Tête d'Or", "Vieux Lyon"],
        parking_difficulty: "Enfer (Zone LEZ)"
    }
};


export const CITIES: Record<string, CityConfig> = {
    // --- .COM DOMAINS ONLY ---
    // Each entry uses the clone() helper to set domain and slug correctly
    // Usage: clone(base, "domain.com", "slug_com", "G-ANALYTICS-ID")

    "taxiaplaisir_com": clone(_taxiaplaisir, "taxiaplaisir.com", "taxiaplaisir_com", "G-0N4C1PP3YG"),
    "taxiasnieres_com": clone(_taxiasnieres, "taxiasnieres.com", "taxiasnieres_com"),
    "taxiboulogne_com": clone(_taxiboulogne, "taxiboulogne.com", "taxiboulogne_com"),
    "taxichambourcy_com": clone(_taxichambourcy, "taxichambourcy.com", "taxichambourcy_com"),
    "taxicolombes_com": clone(_taxicolombes, "taxicolombes.com", "taxicolombes_com"),
    "taxicourbevoie_com": clone(_taxicourbevoie, "taxicourbevoie.com", "taxicourbevoie_com"),
    "taxifeucherolles_com": clone(_taxifeucherolles, "taxifeucherolles.com", "taxifeucherolles_com"),
    "taxifourqueux_com": clone(_taxifourqueux, "taxifourqueux.com", "taxifourqueux_com"),
    "taxiguyancourt_com": clone(_taxiguyancourt, "taxiguyancourt.com", "taxiguyancourt_com"),
    "taxiissy_com": clone(_taxiissy, "taxiissy.com", "taxiissy_com"),
    "taxilepecq_com": clone(_taxilepecq, "taxilepecq.com", "taxilepecq_com"),
    "taxilevallois_com": clone(_taxilevallois, "taxilevallois.com", "taxilevallois_com"),
    "taxilevesinet_com": clone(_taxilevesinet, "taxilevesinet.com", "taxilevesinet_com"),
    "taxilouveciennes_com": clone(_taxilouveciennes, "taxilouveciennes.com", "taxilouveciennes_com"),
    "taximarly_com": clone(_taximarly, "taximarly.com", "taximarly_com"),
    "taximontreuil_com": clone(_taximontreuil, "taximontreuil.com", "taximontreuil_com"),
    "taxineuilly_com": clone(_taxineuilly, "taxineuilly.com", "taxineuilly_com"),
    "taxipoissy_com": clone(_taxipoissy, "taxipoissy.com", "taxipoissy_com"),
    "taxirueil_com": clone(_taxirueil, "taxirueil.com", "taxirueil_com"),
    "taxisaintcloud_com": clone(_taxisaintcloud, "taxisaintcloud.com", "taxisaintcloud_com"),
    "taxisaintcyr_com": clone(_taxisaintcyr, "taxisaintcyr.com", "taxisaintcyr_com"),
    "taxisaintdenis_com": clone(_taxisaintdenis, "taxisaintdenis.com", "taxisaintdenis_com"),
    "taxisaintgermain_com": clone(_taxisaintgermain, "taxisaintgermain.com", "taxisaintgermain_com"),
    "taxisaintnom_com": clone(_taxisaintnom, "taxisaintnom.com", "taxisaintnom_com"),
    "taxisaintouen_com": clone(_taxisaintouen, "taxisaintouen.com", "taxisaintouen_com"),
    "taxisaintquentin_com": clone(_taxisaintquentin, "taxisaintquentin.com", "taxisaintquentin_com"),
    "taxisversailles_com": clone(_taxisversailles, "taxisversailles.com", "taxisversailles_com"),
    "taxinanterre.fr": clone(_taxinanterre, "taxinanterre.fr", "taxinanterre_fr"),
    "taxivincennes.com": clone(_taxivincennes, "taxivincennes.com", "taxivincennes_com", "G-FZYD3C4XZF"),

    // --- PARTNER CITIES (Ghost Broker - Auto-Generated) ---
    ...generatePartnerCities(),
};

// ========================================
// PARTNER CITY GENERATOR
// ========================================
import { NATIONAL_TARGETS, NationalTarget } from "@/config/national-targets";

function generatePartnerCities(): Record<string, CityConfig> {
    const result: Record<string, CityConfig> = {};

    for (const target of NATIONAL_TARGETS) {
        // Derive department from zip code (first 2 digits, or first 3 for DOM-TOM)
        const dept = target.zip.startsWith('97') ? target.zip.substring(0, 3) : target.zip.substring(0, 2);

        const config: CityConfig = {
            slug: target.slug,
            domain: `${target.slug.replace('taxi-', '')}.taxifrance.fr`, // Virtual subdomain
            type: 'PARTNER',
            partnerPhone: "+33970000000", // Default - Replace with real partner phone
            name: `Taxi ${target.name}`,
            city: target.name,
            department: dept,
            latitude: target.geo.lat,
            longitude: target.geo.lng,
            phoneNumber: "09 72 50 12 50", // National standard
            email: "contact@taxifrance.fr",
            heroImage: target.heroImage || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2940&auto=format&fit=crop",
            description: `Réservez votre taxi à ${target.name}. Service de transport disponible 24h/24 avec nos partenaires locaux.`,
            meta: {
                title: target.heroTitle,
                description: `Taxi ${target.name} : Réservation immédiate. Chauffeurs locaux indépendants. Transfert gares, aéroports et transport médical.`
            },
            features: ["Disponible 24h/24", "Prix Fixe", "Chauffeurs Locaux", "Transport Médical"],
            pricing: {
                base: `${target.price_start.toFixed(2)}€`,
                description: "Prise en charge"
            },
            hospitals: [], // Will be enriched per-city
            stations: target.top_places.filter(p => p.toLowerCase().includes('gare') || p.toLowerCase().includes('aéroport')),
            neighborhoods: target.top_places.filter(p => !p.toLowerCase().includes('gare') && !p.toLowerCase().includes('aéroport')),
            points_of_interest: {
                hotels: [],
                nightlife: [],
                monuments: target.top_places,
                parking_difficulty: "Variable"
            }
        };
        result[target.slug] = config;
    }

    return result;
}

