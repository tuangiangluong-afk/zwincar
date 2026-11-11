/**
 * ZwinCar.com — Données Réseau Maroc, Aéroports, Flotte Réelle, Upsells & Split Comptable
 * Conforme aux pratiques locales marocaines (Dirhams, cash, zéro empreinte CB bloquante).
 */

import type { Locale } from "./i18n";

export const ZWINCAR_PHONE = "+212 7 20 79 40 46";
export const ZWINCAR_PHONE_TEL = "+212720794046";
export const ZWINCAR_WHATSAPP_NUMBER = "212720794046";
export const ZWINCAR_WHATSAPP_LINK = "https://wa.me/212720794046";

export const SOCIAL_LINKS = {
    facebook: "https://www.facebook.com/zwincar/",
    instagram: "https://www.instagram.com/zwincar/",
    youtube: "https://www.youtube.com/@ZwinCarcom",
    tiktok: "https://www.tiktok.com/@zwincar",
} as const;

export const SOCIAL_SAME_AS: string[] = [
    "https://www.facebook.com/zwincar/",
    "https://www.instagram.com/zwincar/",
    "https://www.youtube.com/@ZwinCarcom",
    "https://www.tiktok.com/@zwincar",
];

export interface CityHub {
    slug: string;
    name: string;
    nameAr: string;
    airportCode: string;
    airportName: string;
    popularSpots: string[];
    avgDailyPriceEur: number;
    description: string;
    heroImage: string;
    lat: number;
    lng: number;
    localDelivery: string;
    meetingPointDetail: string; // Ex: "Terminal 1 Arrivées, face au Café Paul (Parking P2)"
    // Non-Doorway Authentic Local Knowledge
    airportDistanceKm: number;
    airportTransitMinutes: number;
    taxiComparisonText: string;
    parkingAdvice: string;
    localRoadTraps: string;
    recommendedItinerary: {
        title: string;
        stops: string[];
        recommendedCar: string;
    };
}

export interface VehicleModel {
    id: string;
    name: string;
    brand: string;
    model: string;
    category: "Citadine" | "Compacte" | "SUV & 4x4" | "Familiale & 7 Places" | "Premium";
    categoryEn: "City" | "Compact" | "SUV & 4WD" | "Family 7-Seater" | "Premium";
    seats: number;
    doors: number;
    transmission: "Manuelle" | "Automatique";
    transmissionEn: "Manual" | "Automatic";
    fuel: "Essence" | "Diesel";
    luggage: number;
    hasAC: boolean;
    dailyPriceEur: number;
    dailyPriceMad: number;
    marketPriceEur: number;
    marketPriceMad: number;
    equivalentCategoryFr: string;
    equivalentCategoryEn: string;
    equivalentCategoryEs: string;
    equivalentCategoryNl: string;
    depositPolicy: string;
    depositPolicyEn: string;
    image: string;
    highlight: string;
    highlightEn: string;
    idealFor: string;
    idealForEn: string;
    // Technical Specs (High Info Gain for SEO / Product Page)
    engine: string;
    horsepower: number;
    trunkLiters: number;
    groundClearanceCm: number;
    fuelConsumption: string;
    fuelPolicy: "Niveau identique (Same-to-Same)" | "Plein à plein";
    fuelPolicyNote: string;
    pistePolicy: "Pistes carrossables & auberges autorisées (Hors tout-terrain franchissement)" | "Franchissement & Pistes désert 100% autorisés" | "Asphalte uniquement";
    features: string[];
    moroccoRoadRating: {
        highway: number; // /10
        mountainAtlas: number; // /10
        medinaParking: number; // /10
        desertPiste: number; // /10
    };
    expertVerdictMorocco: string;
    faqs: { q: string; a: string }[];
}

export interface UpsellOption {
    id: string;
    name: string;
    tagline: string;
    taglineEn?: string;
    description: string;
    descriptionEn?: string;
    nameEn?: string;
    priceEur: number;
    priceMad: number;
    type: "per_day" | "fixed";
    provider: "platform" | "vendor"; // 'platform' = 100% ZwinCar Stripe | 'vendor' = 20% Stripe / 80% solde loueur
    badge?: string;
    isDefault?: boolean;
}

export const UPSELL_OPTIONS: UpsellOption[] = [
    {
        id: "franchise-zero",
        name: "Pack Sérénité : Zéro Caution (0 €) & Rachat Total",
        nameEn: "Serenity Pack: Zero Deposit (€0) & Full Waiver",
        tagline: "Caution 0 € absolue (au lieu de 300 €) • Rachat franchise rayures, bris de glace et pneus",
        taglineEn: "Strict €0 deposit (instead of €300) • Full scratch, glass & tire waiver",
        description: "Zéro euro de dépôt de garantie (ni cash, ni CB). Remise des clés express sans blocage bancaire.",
        descriptionEn: "Zero deposit required (no cash, no credit card block). Express key delivery at airport.",
        priceEur: 8,
        priceMad: 90,
        type: "per_day",
        provider: "platform",
    },
    {
        id: "esim-maroc",
        name: "eSIM Maroc 5 Go (Airalo) ou SIM Locale 20 Go",
        nameEn: "Morocco eSIM (5 GB Airalo) or 20 GB Local SIM",
        tagline: "Connexion data immédiate dès l'atterrissage à l'aéroport",
        taglineEn: "Instant high-speed mobile data upon airport landing",
        description: "QR Code eSIM Airalo 5 Go envoyé par e-mail ou carte SIM 20 Go remise en main propre par l'agent. Zéro file d'attente.",
        descriptionEn: "Airalo 5 GB eSIM QR code sent via email or 20 GB physical SIM handed directly by agent. Skip terminal queues.",
        priceEur: 19,
        priceMad: 210,
        type: "fixed",
        provider: "platform",
    },
    {
        id: "badge-jawaz",
        name: "Pass Télépéage Jawaz",
        nameEn: "Jawaz Highway Toll Pass",
        tagline: "Voies réservées 30 km/h aux péages d'autoroute",
        taglineEn: "30 km/h express non-stop electronic toll lanes",
        description: "Badge pré-chargé fixé au pare-brise. Passage sans arrêt sur les autoroutes A1, A3 et A7.",
        descriptionEn: "Pre-loaded transponder on windshield for non-stop passing on Moroccan motorways.",
        priceEur: 7,
        priceMad: 75,
        type: "fixed",
        provider: "vendor",
    },
    {
        id: "siege-bebe",
        name: "Siège Enfant / Rehausseur ISOFIX",
        nameEn: "Child Seat / ISOFIX Booster",
        tagline: "Homologué ECE R129, installé avant votre arrivée",
        taglineEn: "ECE R129 certified, fitted before your arrival",
        description: "Installé dans le véhicule selon l'âge de l'enfant. Évite de transporter un siège en avion.",
        descriptionEn: "Fitted according to child age. Avoid carrying bulky car seats on flights.",
        priceEur: 4,
        priceMad: 45,
        type: "per_day",
        provider: "vendor",
    },
    {
        id: "conducteur-additionnel",
        name: "2ème Conducteur Enregistré",
        nameEn: "2nd Registered Driver",
        tagline: "Inclus sans supplément",
        taglineEn: "Included at zero extra cost",
        description: "Partagez le volant en toute légalité sur les longs trajets.",
        descriptionEn: "Share the driving legally on long scenic Moroccan road trips.",
        priceEur: 0,
        priceMad: 0,
        type: "fixed",
        provider: "vendor",
        isDefault: true,
    },
    {
        id: "restitution-flexible",
        name: "Restitution Flexible (+3h)",
        nameEn: "Flexible Drop-off (+3h)",
        tagline: "Tolérance horaire pour l'embarquement",
        taglineEn: "3-hour delay tolerance for boarding",
        description: "Tolérance de retour jusqu'à 3h après l'horaire contractuel sans journée supplémentaire.",
        descriptionEn: "Drop off up to 3 hours after scheduled time without being charged an extra full day.",
        priceEur: 15,
        priceMad: 165,
        type: "fixed",
        provider: "vendor",
    }
];

export const MOROCCAN_HUBS: CityHub[] = [
    {
        slug: "marrakech",
        name: "Marrakech",
        nameAr: "مراكش",
        airportCode: "RAK",
        airportName: "Aéroport Marrakech Menara",
        popularSpots: ["Aéroport Menara (RAK)", "Guéliz", "Hivernage", "Médina / Riad", "Palmeraie"],
        avgDailyPriceEur: 31,
        description: "Livraison directe dès la sortie du terminal Menara ou à la porte de votre Riad. Aucun blocage de carte de crédit.",
        heroImage: "/images/hubs/marrakech.webp",
        lat: 31.6295,
        lng: -7.9811,
        localDelivery: "Gratuite à l'aéroport Menara et aux Riads de la Médina",
        meetingPointDetail: "Terminal 1 Arrivées, sortie principale, Parking P2 (l'agent vous attend avec pancarte nominative)",
        airportDistanceKm: 5,
        airportTransitMinutes: 15,
        taxiComparisonText: "Un taxi aéroport vers Guéliz ou la Médina est négocié entre 100 et 150 MAD le jour (200 MAD de nuit). Avec deux trajets par jour, louer chez ZwinCar dès 340 MAD/j est amorti immédiatement avec la liberté totale de visiter Agafay ou l'Ourika.",
        parkingAdvice: "Ne tentez jamais de pénétrer dans le dédale de la Médina en voiture. Laissez votre véhicule aux parkings gardés Bab Doukkala, Bab Nkob ou Koutoubia (20 à 30 MAD pour 24h avec gardien assermenté avec gilet).",
        localRoadTraps: "Contrôles radars mobiles très fréquents sur l'Avenue Mohammed VI et la Route de l'Ourika (P2017). Aux carrefours giratoires historiques, soyez attentifs aux panneaux de priorité qui peuvent être inversés.",
        recommendedItinerary: {
            title: "Boucle Haut-Atlas & Palmeraie",
            stops: ["Guéliz", "Vallée de l'Ourika", "Plateau du Kik", "Désert d'Agafay"],
            recommendedCar: "Dacia Sandero Stepway ou Duster"
        }
    },
    {
        slug: "agadir",
        name: "Agadir",
        nameAr: "أكادير",
        airportCode: "AGA",
        airportName: "Aéroport Agadir Al Massira",
        popularSpots: ["Aéroport Al Massira (AGA)", "Marina d'Agadir", "Taghazout Bay", "Imi Ouaddar", "Tamraght"],
        avgDailyPriceEur: 31,
        description: "Le spot idéal pour récupérer votre SUV ou compacte pour rider Taghazout, Imsouane et la côte atlantique.",
        heroImage: "/images/hubs/agadir.webp",
        lat: 30.4278,
        lng: -9.5981,
        localDelivery: "Gratuite Aéroport Al Massira & Hôtels bord de mer / Taghazout",
        meetingPointDetail: "Hall Arrivées Al Massira, face au dépose-minute (remise des clés en 3 min)",
        airportDistanceKm: 25,
        airportTransitMinutes: 30,
        taxiComparisonText: "Le Grand Taxi officiel Aéroport Al Massira vers Agadir centre ou Taghazout coûte entre 220 et 350 MAD par trajet simple. Une location ZwinCar dès 22 €/j (240 MAD) rentabilise votre séjour dès l'atterrissage.",
        parkingAdvice: "Stationnement très facile le long du front de mer et de la Marina. À Taghazout et Anchor Point, privilégiez les esplanades gardées de falaises (10 à 20 MAD la journée entière).",
        localRoadTraps: "Contrôle radar laser quasi-quotidien à l'entrée de la voie express Agadir-Taghazout (limitée à 80 km/h) et au péage de l'autoroute A3 vers Marrakech.",
        recommendedItinerary: {
            title: "Surftrip Côtier Atlantique",
            stops: ["Agadir Marina", "Taghazout Bay", "Imsouane", "Parc National de Souss-Massa"],
            recommendedCar: "Dacia Duster 4x4 ou Clio 5 Diesel"
        }
    },
    {
        slug: "casablanca",
        name: "Casablanca",
        nameAr: "الدار البيضاء",
        airportCode: "CMN",
        airportName: "Aéroport Mohammed V",
        popularSpots: ["Aéroport Mohammed V (CMN)", "Maârif", "Gauthier", "Gare Casa-Voyageurs", "Ain Diab"],
        avgDailyPriceEur: 26,
        description: "Accueil personnalisé à l'arrivée terminal 1 & 2. Évitez les 45 min de file d'attente aux comptoirs franchisés.",
        heroImage: "/images/hubs/casablanca.webp",
        lat: 33.5731,
        lng: -7.5898,
        localDelivery: "Prise en charge express Terminal 1 & 2 Mohammed V",
        meetingPointDetail: "Terminal 1 & 2 zone arrivées, point de rencontre face au guichet ONCF / Taxis officiels",
        airportDistanceKm: 32,
        airportTransitMinutes: 45,
        taxiComparisonText: "Le Grand Taxi blanc aéroport Mohammed V vers Maârif ou Gauthier est à 300 MAD fixe le jour (350 MAD nuit). Pour 26 €/j (280 MAD), votre voiture privée est livrée sans file d'attente à la sortie de la douane.",
        parkingAdvice: "Circulation dense : privilégiez les parkings souterrains gardés (Place des Nations Unies, Triangle d'Or, Marina Shopping). Gardiens de rue officiels au gilet jaune (5 MAD jour, 10 MAD nuit).",
        localRoadTraps: "Radars automatiques fixes nouvelle génération sur la Rocade Sud (Autoroute urbaine A1 limitée à 80 km/h) et feux tricolores surveillés par caméras à Maârif.",
        recommendedItinerary: {
            title: "Échappée Côtier & Patrimoine",
            stops: ["Mosquée Hassan II", "La Corniche Ain Diab", "Cité Portugaise d'El Jadida", "Azemmour"],
            recommendedCar: "Renault Clio 5 ou Peugeot 208"
        }
    },
    {
        slug: "tanger",
        name: "Tanger",
        nameAr: "طنجة",
        airportCode: "TNG",
        airportName: "Aéroport Tanger Ibn Battouta",
        popularSpots: ["Aéroport Ibn Battouta (TNG)", "Gare Tanger Ville (TGV)", "Port Tanger Med", "Malabata"],
        avgDailyPriceEur: 25,
        description: "Porte d'entrée du Nord du Maroc et de Chefchaouen. Prise en charge à l'aéroport ou à la descente du ferry.",
        heroImage: "/images/hubs/tanger.webp",
        lat: 35.7595,
        lng: -5.8340,
        localDelivery: "Aéroport Ibn Battouta, Port Tanger Ville & Tanger Med",
        meetingPointDetail: "Parking Départs/Arrivées Ibn Battouta ou quai de débarquement Port Tanger-Ville",
        airportDistanceKm: 12,
        airportTransitMinutes: 20,
        taxiComparisonText: "Le taxi aéroport vers le centre ou le port coûte 120 à 150 MAD. Pour explorer le Cap Spartel, les Grottes d'Hercule et Chefchaouen, une voiture louée dès 270 MAD/j offre une indépendance incomparable.",
        parkingAdvice: "Parkings surveillés autour du Grand Socco et de la Corniche Malabata (15 à 20 MAD/jour). Évitez le quartier Marshan aux heures de sortie d'écoles.",
        localRoadTraps: "Radars fréquents sur la RN2 vers Tétouan et sur la route côtière du Cap Spartel. Contrôles de vitesse stricts à 60 km/h aux abords des bourgs du Rif.",
        recommendedItinerary: {
            title: "Circuit Perle Bleue & Falaises du Détroit",
            stops: ["Cap Spartel", "Grottes d'Hercule", "Tétouan", "Chefchaouen"],
            recommendedCar: "Dacia Sandero Stepway ou Duster"
        }
    },
    {
        slug: "fes",
        name: "Fès",
        nameAr: "فاس",
        airportCode: "FEZ",
        airportName: "Aéroport Fès Saïss",
        popularSpots: ["Aéroport Fès Saïss (FEZ)", "Bab Boujloud", "Ville Nouvelle", "Gare de Fès"],
        avgDailyPriceEur: 23,
        description: "Véhicules récents et climatisés prêts pour visiter la plus ancienne médina du monde et les ruines de Volubilis.",
        heroImage: "/images/hubs/fes.webp",
        lat: 34.0181,
        lng: -5.0078,
        localDelivery: "Gratuite Aéroport Saïss & accès Médina",
        meetingPointDetail: "Sortie Terminal Saïss, parking réservé agences vérifiées",
        airportDistanceKm: 15,
        airportTransitMinutes: 25,
        taxiComparisonText: "Le trajet en Grand Taxi aéroport Saïss vers Bab Boujloud est à 120-150 MAD. Louer à 23 €/j (250 MAD) vous permet de rayonner facilement sur Meknès, Volubilis et Moulay Idriss sans négocier chaque course.",
        parkingAdvice: "Stationnez impérativement aux grands parkings extérieurs de la Médina : Parking Bab Boujloud ou Parking Ain Zleten. Ne tentez aucune pénétration dans la médina piétonne.",
        localRoadTraps: "Ralentisseurs hauts non signalés sur la route de Meknès (N8) et contrôles mobiles de gendarmerie réguliers sur la montée vers Ifrane.",
        recommendedItinerary: {
            title: "Triangle Impérial & Moyen Atlas",
            stops: ["Fès Médina", "Volubilis & Meknès", "Ifrane (Petite Suisse)", "Forêt des Cèdres Azrou"],
            recommendedCar: "Hyundai Accent Automatique ou Dacia Sandero"
        }
    },
    {
        slug: "rabat",
        name: "Rabat",
        nameAr: "الرباط",
        airportCode: "RBA",
        airportName: "Aéroport Rabat-Salé",
        popularSpots: ["Aéroport Rabat-Salé (RBA)", "Agdal", "Hassan", "Gare Rabat Ville", "Marina Bouregreg"],
        avgDailyPriceEur: 25,
        description: "La capitale administrative en toute sérénité. Véhicules business et citadines livrés à l'heure exacte.",
        heroImage: "/images/hubs/rabat.webp",
        lat: 34.0209,
        lng: -6.8416,
        localDelivery: "Aéroport Rabat-Salé & Centre-ville Agdal",
        meetingPointDetail: "Terminal Rabat-Salé, zone dépose express",
        airportDistanceKm: 10,
        airportTransitMinutes: 20,
        taxiComparisonText: "Taxi aéroport Salé vers Rabat Centre : 150 à 200 MAD. Pour 25 €/j (270 MAD), disposez d'un véhicule propre pour vos déplacements professionnels ou vers la Marina.",
        parkingAdvice: "Stationnement horodateur très rigoureux à Rabat (Rabat Parking). Payez via parcmètre ou application. Les parkings souterrains Bab El Had et Agdal sont très sécurisés.",
        localRoadTraps: "Respect absolu des priorités piétons et des feux tricolores (caméras urbaines actives sur l'Avenue Mohammed V). Radars sur le pont Hassan II reliant Rabat à Salé.",
        recommendedItinerary: {
            title: "Littoral & Forêt de Maâmora",
            stops: ["Tour Hassan & Mausolée", "Kasbah des Oudayas", "Marina Bouregreg", "Plage des Nations"],
            recommendedCar: "Peugeot 208 ou Hyundai Accent"
        }
    },
    {
        slug: "ouarzazate",
        name: "Ouarzazate",
        nameAr: "ورزازات",
        airportCode: "OZZ",
        airportName: "Aéroport Ouarzazate",
        popularSpots: ["Aéroport OZZ", "Aït Benhaddou", "Vallée du Dadès", "Gorges du Todra", "Merzouga"],
        avgDailyPriceEur: 35,
        description: "Le camp de base du Grand Sud et des pistes du Sahara. Spécialiste Duster 4x4 et Toyota Prado tout-terrain.",
        heroImage: "/images/hubs/ouarzazate.webp",
        lat: 30.9335,
        lng: -6.9370,
        localDelivery: "Aéroport Ouarzazate & Hôtels Vallée",
        meetingPointDetail: "Hall unique Arrivées Ouarzazate OZZ",
        airportDistanceKm: 3,
        airportTransitMinutes: 8,
        taxiComparisonText: "Les taxis refusent les longues pistes ou demandent 1000 à 1500 MAD par jour avec chauffeur. Louer un Duster 4x4 chez ZwinCar dès 35 €/j (380 MAD) garantit liberté totale sur les pistes du Sud.",
        parkingAdvice: "Stationnement très facile et gratuit partout en ville. À Aït Benhaddou, utilisez le parking officiel face à l'Oued (10 MAD avec gardien).",
        localRoadTraps: "La traversée du Col du Tichka (N9, 2260m) comporte des virages serrés : respectez scrupuleusement les lignes continues. Ne doublez jamais sans visibilité totale.",
        recommendedItinerary: {
            title: "Route des Kasbahs & Dunes du Sahara",
            stops: ["Ksar Aït Benhaddou", "Gorges du Dadès", "Gorges du Todra", "Dunes de Merzouga Erg Chebbi"],
            recommendedCar: "Dacia Duster 4x4 ou Toyota Prado TX"
        }
    },
    {
        slug: "nador",
        name: "Nador",
        nameAr: "الناظور",
        airportCode: "NDR",
        airportName: "Aéroport Nador Al Aroui",
        popularSpots: ["Aéroport Al Aroui (NDR)", "Port Beni Ensar", "Marchica", "Al Hoceïma"],
        avgDailyPriceEur: 27,
        description: "Service privilégié pour la diaspora et les vacanciers de la côte méditerranéenne et du Rif.",
        heroImage: "/images/hubs/nador.webp",
        lat: 35.1688,
        lng: -2.9335,
        localDelivery: "Aéroport Al Aroui & Port Beni Ensar",
        meetingPointDetail: "Parking Al Aroui face aux arrivées ou quai ferry Beni Ensar",
        airportDistanceKm: 28,
        airportTransitMinutes: 30,
        taxiComparisonText: "Le taxi de l'aéroport Al Aroui vers le centre ou le port de Beni Ensar coûte entre 200 et 300 MAD. À 27 €/j (290 MAD), vous profitez de votre véhicule dès le tarmac.",
        parkingAdvice: "Stationnement aisé le long de la lagune de Marchica. Au port de Beni Ensar, parkings gardés disponibles si vous prenez le ferry passager.",
        localRoadTraps: "Contrôles fréquents de gendarmerie sur la N19 et la rocade méditerranéenne vers Ras El Ma et Al Hoceïma. Radars mobiles sur les longues lignes droites d'Al Aroui.",
        recommendedItinerary: {
            title: "Boucle Côtière Méditerranée & Falaises du Rif",
            stops: ["Lagune Marchica", "Cap des Trois Fourches", "Plage Ras El Ma", "Al Hoceïma"],
            recommendedCar: "Dacia Sandero Stepway ou Duster"
        }
    }
];

export const VEHICLE_FLEET: VehicleModel[] = [
    {
        id: "dacia-sandero-stepway",
        name: "Dacia Sandero Stepway",
        brand: "Dacia",
        model: "Sandero Stepway",
        category: "Compacte",
        categoryEn: "Compact",
        seats: 5,
        doors: 5,
        transmission: "Manuelle",
        transmissionEn: "Manual",
        fuel: "Diesel",
        luggage: 3,
        hasAC: true,
        dailyPriceEur: 32,
        dailyPriceMad: 350,
        marketPriceEur: 39,
        marketPriceMad: 430,
        equivalentCategoryFr: "Dacia Sandero, Renault Clio ou équivalent même catégorie",
        equivalentCategoryEn: "Dacia Sandero, Renault Clio or equivalent category",
        equivalentCategoryEs: "Dacia Sandero, Renault Clio o equivalente misma categoría",
        equivalentCategoryNl: "Dacia Sandero, Renault Clio of gelijkwaardig model",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 300 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €300 standard deposit)",
        image: "/images/vehicles/dacia-sandero-stepway.webp",
        highlight: "La reine des routes marocaines : garde au sol rehaussée à 18 cm, moteur 1.5 dCi éprouvé, conso 4.2L/100km.",
        highlightEn: "Morocco's road champion: elevated 18cm ground clearance, proven 1.5 dCi engine, 4.2L/100km.",
        idealFor: "Idéale pour couples et petites familles explorant ville et routes secondaires de l'Atlas.",
        idealForEn: "Perfect for couples & small families touring towns and Atlas secondary roads.",
        engine: "1.5 dCi 95 ch Turbo Diesel",
        horsepower: 95,
        trunkLiters: 328,
        groundClearanceCm: 18,
        fuelConsumption: "4.2 L / 100 km (Diesel)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Restituez le véhicule avec le même niveau qu'au départ. Une photo du compteur est prise lors du check-in.",
        pistePolicy: "Pistes carrossables & auberges autorisées (Hors tout-terrain franchissement)",
        features: [
            "Écran tactile 8'' avec Apple CarPlay & Android Auto",
            "Climatisation renforcée spécifique climat chaud",
            "Barres de toit modulables (surfs, bagages)",
            "Radars de recul & aide au démarrage en côte",
            "Vraie roue de secours (taille normale)",
            "Régulateur et limiteur de vitesse",
        ],
        moroccoRoadRating: {
            highway: 8.5,
            mountainAtlas: 8.0,
            medinaParking: 9.0,
            desertPiste: 6.5,
        },
        expertVerdictMorocco: "C'est la voiture la plus populaire au Maroc et il y a une raison : avec ses 18 cm de garde au sol, elle encaisse les ralentisseurs géants de Marrakech et les nids-de-poule des routes secondaires sans jamais frotter le châssis. Le moteur diesel 1.5 dCi permet de faire 850 km avec un plein de 45 litres.",
        faqs: [
            {
                q: "La Sandero Stepway peut-elle monter le col du Tichka vers Ouarzazate ?",
                a: "Absolument. Son couple diesel à bas régime lui permet d'avaler les lacets du Tichka sans forcer, même avec 4 passagers et des bagages."
            },
            {
                q: "Comment fonctionne la règle du carburant ?",
                a: "Politique Same-to-Same : l'agent prend une photo du tableau de bord à la livraison. Vous rendez simplement la voiture avec le même quart ou moitié de plein. Zéro obligation de faire le plein complet à 5h du matin avant votre vol !"
            }
        ]
    },
    {
        id: "renault-clio-5-auto",
        name: "Renault Clio 5 Automatique",
        brand: "Renault",
        model: "Clio 5",
        category: "Citadine",
        categoryEn: "City",
        seats: 5,
        doors: 5,
        transmission: "Automatique",
        transmissionEn: "Automatic",
        fuel: "Essence",
        luggage: 2,
        hasAC: true,
        dailyPriceEur: 42,
        dailyPriceMad: 460,
        marketPriceEur: 52,
        marketPriceMad: 570,
        equivalentCategoryFr: "Renault Clio 5 BVA, Peugeot 208 BVA ou équivalent même catégorie",
        equivalentCategoryEn: "Renault Clio 5 Auto, Peugeot 208 Auto or equivalent category",
        equivalentCategoryEs: "Renault Clio 5 Auto, Peugeot 208 Auto o equivalente misma categoría",
        equivalentCategoryNl: "Renault Clio 5 Automaat, Peugeot 208 of gelijkwaardig model",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 300 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €300 standard deposit)",
        image: "/images/vehicles/renault-clio-5-auto.webp",
        highlight: "Boîte automatique EDC ultra-douce, insonorisation de berline, écran tactile CarPlay / Android Auto.",
        highlightEn: "Silky EDC automatic gearbox, quiet highway cruise, wireless CarPlay.",
        idealFor: "Conduite urbaine sans stress à Marrakech et Casablanca + trajets autoroutiers.",
        idealForEn: "Effortless city driving in Marrakech & Casablanca + highway comfort.",
        engine: "1.0 TCe 90 ch X-Tronic / EDC",
        horsepower: 90,
        trunkLiters: 391,
        groundClearanceCm: 14,
        fuelConsumption: "5.1 L / 100 km (Essence)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Restituez le véhicule avec le même niveau qu'au départ. Une photo du compteur est prise lors du check-in.",
        pistePolicy: "Asphalte uniquement",
        features: [
            "Boîte automatique à double embrayage EDC",
            "Écran tactile 7'' EasyLink avec réplication smartphone",
            "Aide au maintien dans la voie & freinage d'urgence",
            "Feux Full LED Pure Vision (idéal conduite de nuit)",
            "Caméra de recul haute définition",
            "Double prise USB à l'avant",
        ],
        moroccoRoadRating: {
            highway: 9.0,
            mountainAtlas: 7.0,
            medinaParking: 9.5,
            desertPiste: 4.0,
        },
        expertVerdictMorocco: "La reine de la ville. Les embouteillages de Casablanca ou le rond-point de Bab Doukkala à Marrakech deviennent une simple formalité grâce à la boîte automatique très réactive. Le coffre de 391 L est l'un des plus généreux de la catégorie citadine.",
        faqs: [
            {
                q: "La boîte automatique est-elle une vraie boîte séquentielle ou un variateur ?",
                a: "Nos modèles sont équipés de la transmission automatique réactive X-Tronic / EDC, avec passage de rapports fluide et sans à-coups."
            },
            {
                q: "Est-elle adaptée pour un trajet Marrakech - Essaouira ?",
                a: "C'est la voiture parfaite pour cette route : 2h30 sur un ruban d'asphalte bien revêtu, régulateur calé à 100 km/h, consommation minime."
            }
        ]
    },
    {
        id: "dacia-duster-4x4",
        name: "Dacia Duster Prestige 4x4",
        brand: "Dacia",
        model: "Duster Prestige 4x4",
        category: "SUV & 4x4",
        categoryEn: "SUV & 4WD",
        seats: 5,
        doors: 5,
        transmission: "Manuelle",
        transmissionEn: "Manual",
        fuel: "Diesel",
        luggage: 4,
        hasAC: true,
        dailyPriceEur: 58,
        dailyPriceMad: 640,
        marketPriceEur: 72,
        marketPriceMad: 790,
        equivalentCategoryFr: "Dacia Duster 4x4 ou SUV compact tout-chemin équivalent",
        equivalentCategoryEn: "Dacia Duster 4WD or equivalent all-terrain compact SUV",
        equivalentCategoryEs: "Dacia Duster 4x4 o SUV compacto equivalente",
        equivalentCategoryNl: "Dacia Duster 4x4 of gelijkwaardige compacte SUV",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 300 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €300 standard deposit)",
        image: "/images/vehicles/dacia-duster-4x4.webp",
        highlight: "Vrai baroudeur 4 roues motrices : passe partout, coffre géant 475L, garde au sol 21 cm, transmission 4WD Lock.",
        highlightEn: "True all-terrain 4WD: handles any piste, massive 475L trunk, 21cm clearance, 4WD Lock.",
        idealFor: "La référence pour l'Atlas, les gorges du Dadès, l'accès aux camps d'Agafay et pistes carrossables.",
        idealForEn: "The undisputed choice for the Atlas passes, Dadès gorges & Agafay carrossable tracks.",
        engine: "1.5 Blue dCi 115 ch 4WD All-Mode",
        horsepower: 115,
        trunkLiters: 475,
        groundClearanceCm: 21,
        fuelConsumption: "5.3 L / 100 km (Diesel)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo du compteur enregistrée sur WhatsApp à la livraison.",
        pistePolicy: "Pistes carrossables & auberges autorisées (Hors tout-terrain franchissement)",
        features: [
            "Transmission intégrale 4x4 (2WD, Auto, 4WD Lock)",
            "Garde au sol surélevée de 21 cm avec plaques de protection",
            "Contrôle de descente en pente (Hill Descent Control)",
            "Caméra multivues 4 angles (idéal passages de pierres)",
            "Climatisation automatique régulée",
            "Écran tactile GPS avec boussole et altimètre intégrés",
        ],
        moroccoRoadRating: {
            highway: 8.5,
            mountainAtlas: 9.8,
            medinaParking: 7.5,
            desertPiste: 8.5,
        },
        expertVerdictMorocco: "Si vous prévoyez de rouler vers Ouarzazate, les vallées de l'Atlas ou les auberges du désert d'Agafay, c'est l'outil parfait. Note importante : il est homologué pour toutes les pistes carrossables et voies non goudronnées d'accès aux hôtels/lodges. Pour le vrai franchissement dunaire de l'Erg Chebbi, nous recommandons le Toyota Prado.",
        faqs: [
            {
                q: "Peut-on aller dans les camps du désert d'Agafay avec ce Duster ?",
                a: "Oui à 100% : les pistes d'accès aux camps d'Agafay (Inara, Scarabeo, Terre des Étoiles) sont des pistes carrossables parfaitement autorisées avec ce Duster 4x4."
            },
            {
                q: "Combien de valises entrent dans le coffre ?",
                a: "Le coffre de 475 litres engloutit sans peine 3 grandes valises soute de 23 kg plus 2 sacs de cabine."
            }
        ]
    },
    {
        id: "hyundai-tucson-auto",
        name: "Hyundai Tucson BVA Luxe",
        brand: "Hyundai",
        model: "Tucson",
        category: "SUV & 4x4",
        categoryEn: "SUV & 4WD",
        seats: 5,
        doors: 5,
        transmission: "Automatique",
        transmissionEn: "Automatic",
        fuel: "Diesel",
        luggage: 5,
        hasAC: true,
        dailyPriceEur: 79,
        dailyPriceMad: 870,
        marketPriceEur: 98,
        marketPriceMad: 1080,
        equivalentCategoryFr: "Hyundai Tucson BVA, Kia Sportage BVA ou SUV Premium équivalent",
        equivalentCategoryEn: "Hyundai Tucson Auto, Kia Sportage Auto or equivalent Premium SUV",
        equivalentCategoryEs: "Hyundai Tucson Auto, Kia Sportage Auto o SUV Premium equivalente",
        equivalentCategoryNl: "Hyundai Tucson Automaat, Kia Sportage of gelijkwaardige Premium SUV",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 300 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €300 standard deposit)",
        image: "/images/vehicles/hyundai-tucson.webp",
        highlight: "Grand SUV premium, sellerie cuir, insonorisation VIP, aides à la conduite complètes et coffre de 546 L.",
        highlightEn: "Full-size premium SUV, leather interior, top-tier safety tech, 546L trunk, silent ride.",
        idealFor: "Voyageurs exigeants et familles cherchant un confort maximal sur de longues distances.",
        idealForEn: "Discerning travelers and families wanting first-class long-distance comfort.",
        engine: "1.6 CRDi 136 ch Smartstream DCT-7",
        horsepower: 136,
        trunkLiters: 546,
        groundClearanceCm: 17,
        fuelConsumption: "5.6 L / 100 km (Diesel)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo du niveau de carburant envoyée par WhatsApp à la remise des clés.",
        pistePolicy: "Pistes carrossables & auberges autorisées (Hors tout-terrain franchissement)",
        features: [
            "Boîte automatique à 7 rapports DCT ultra-rapide",
            "Sellerie cuir avec sièges ventilés / chauffants",
            "Double écran numérique panoramique 10.25 pouces",
            "Système audio haute fidélité Krell",
            "Hayon électrique mains libres",
            "Régulateur adaptatif avec fonction Stop & Go",
        ],
        moroccoRoadRating: {
            highway: 9.8,
            mountainAtlas: 8.5,
            medinaParking: 7.0,
            desertPiste: 7.0,
        },
        expertVerdictMorocco: "Le luxe discret. Sur l'autoroute Tanger - Casablanca ou Marrakech - Agadir, c'est un véritable tapis volant. Les passagers arrière ont un espace aux jambes digne d'une limousine d'affaires et la climatisation tri-zone garde tout le monde au frais même par 46°C.",
        faqs: [
            {
                q: "Le véhicule dispose-t-il d'un coffre électrique ?",
                a: "Oui, le hayon s'ouvre automatiquement au passage de la clé, très pratique quand on a les bras chargés de bagages à l'aéroport."
            }
        ]
    },
    {
        id: "peugeot-208-puretech",
        name: "Peugeot 208 PureTech",
        brand: "Peugeot",
        model: "208",
        category: "Citadine",
        categoryEn: "City",
        seats: 5,
        doors: 5,
        transmission: "Manuelle",
        transmissionEn: "Manual",
        fuel: "Essence",
        luggage: 2,
        hasAC: true,
        dailyPriceEur: 33,
        dailyPriceMad: 360,
        marketPriceEur: 41,
        marketPriceMad: 450,
        equivalentCategoryFr: "Peugeot 208, Citroën C3, Hyundai i20 ou citadine équivalente",
        equivalentCategoryEn: "Peugeot 208, Citroën C3, Hyundai i20 or equivalent city car",
        equivalentCategoryEs: "Peugeot 208, Citroën C3, Hyundai i20 o urbano equivalente",
        equivalentCategoryNl: "Peugeot 208, Citroën C3 of gelijkwaardige stadsauto",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 300 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €300 standard deposit)",
        image: "/images/vehicles/peugeot-208.webp",
        highlight: "Design acéré, i-Cockpit moderne, facile à garer partout en ville et médina, consommation plume.",
        highlightEn: "Striking design, modern i-Cockpit, effortless parking in dense historic centers.",
        idealFor: "Solos et couples pour un week-end découverte ou roadtrip côtier à budget maîtrisé.",
        idealForEn: "Solo & couple getaways for coastal touring and quick city breaks.",
        engine: "1.2 PureTech 75 ch",
        horsepower: 75,
        trunkLiters: 311,
        groundClearanceCm: 14,
        fuelConsumption: "5.2 L / 100 km (Essence)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo du compteur enregistrée au départ.",
        pistePolicy: "Asphalte uniquement",
        features: [
            "Volant compact sport à double méplat",
            "Combiné tête haute numérique",
            "Écran tactile 7'' avec Bluetooth audio",
            "Climatisation manuelle réactive",
            "Régulateur de vitesse",
        ],
        moroccoRoadRating: {
            highway: 8.0,
            mountainAtlas: 6.8,
            medinaParking: 9.8,
            desertPiste: 3.5,
        },
        expertVerdictMorocco: "La citadine stylée par excellence. Sa direction ultra-légère permet de se faufiler dans les ruelles du Guéliz ou de trouver un trou de souris pour se garer devant le Riad.",
        faqs: [
            {
                q: "Combien consomme la 208 en ville à Marrakech ?",
                a: "Elle tourne autour de 5.5L aux 100 km même avec la climatisation allumée."
            }
        ]
    },
    {
        id: "toyota-prado-tx-7places",
        name: "Toyota Land Cruiser Prado TX (7 Places)",
        brand: "Toyota",
        model: "Land Cruiser Prado",
        category: "Familiale & 7 Places",
        categoryEn: "Family 7-Seater",
        seats: 7,
        doors: 5,
        transmission: "Automatique",
        transmissionEn: "Automatic",
        fuel: "Diesel",
        luggage: 6,
        hasAC: true,
        dailyPriceEur: 139,
        dailyPriceMad: 1530,
        marketPriceEur: 170,
        marketPriceMad: 1870,
        equivalentCategoryFr: "Toyota Land Cruiser Prado TX (7 Places) ou grand 4x4 équivalent",
        equivalentCategoryEn: "Toyota Land Cruiser Prado TX (7 Seats) or equivalent large 4WD",
        equivalentCategoryEs: "Toyota Prado TX (7 Plazas) o gran 4x4 equivalente",
        equivalentCategoryNl: "Toyota Prado TX (7 Zitplaatsen) of gelijkwaardige 4x4",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 300 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €300 standard deposit)",
        image: "/images/vehicles/toyota-prado.webp",
        highlight: "L'icône absolue des expéditions marocaines : 7 vraies places, châssis séparé indestructible, motricité totale.",
        highlightEn: "The undisputed Moroccan expedition icon. 7 real seats, ladder frame, bulletproof.",
        idealFor: "Grands groupes, familles nombreuses et expéditions franchissement désert Merzouga, M'Hamid, Dakhla.",
        idealForEn: "Large groups, big families, and deep-desert Sahara expeditions.",
        engine: "2.8 D-4D 204 ch 4WD Permanent",
        horsepower: 204,
        trunkLiters: 640,
        groundClearanceCm: 22,
        fuelConsumption: "7.9 L / 100 km (Diesel)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo du niveau de carburant au départ.",
        pistePolicy: "Franchissement & Pistes désert 100% autorisés",
        features: [
            "Véritable transmission 4x4 permanente avec boîte courte et blocage de différentiel central",
            "7 vraies places avec 3ème rangée escamotable sous le plancher",
            "Réservoir grande autonomie de 87 Litres (plus de 1 000 km)",
            "Climatisation quadri-zone indépendante pour chaque rangée",
            "Système Multi-Terrain Select (Sable, Rocher, Boue)",
            "Crochet d'attelage et marchepieds aluminium latéraux",
        ],
        moroccoRoadRating: {
            highway: 9.0,
            mountainAtlas: 10.0,
            medinaParking: 5.5,
            desertPiste: 10.0,
        },
        expertVerdictMorocco: "Au Maroc, le Prado n'est pas une simple voiture : c'est un passeport pour le grand sud. C'est le SEUL véhicule de notre flotte officiellement homologué pour le franchissement dunaire, les pistes profondes de M'Hamid El Ghizlane et les grands ergs sahariens. Confort de suspension royal sur les pistes ondulées (tôle ondulée).",
        faqs: [
            {
                q: "Peut-on aller dans les dunes de Merzouga ?",
                a: "Oui, le Prado est 100% autorisé et équipé pour les pistes du désert et l'accès aux dunes (avec dégonflage approprié des pneumatiques)."
            },
            {
                q: "Les 7 places sont-elles confortables pour des adultes ?",
                a: "Oui, la 3ème rangée accueille des adultes de taille moyenne confortablement sur des trajets de 2 à 3 heures."
            }
        ]
    },
    {
        id: "hyundai-i10",
        name: "Hyundai Grand i10",
        brand: "Hyundai",
        model: "Grand i10",
        category: "Citadine",
        categoryEn: "City",
        seats: 5,
        doors: 5,
        transmission: "Manuelle",
        transmissionEn: "Manual",
        fuel: "Essence",
        luggage: 2,
        hasAC: true,
        dailyPriceEur: 26,
        dailyPriceMad: 280,
        marketPriceEur: 32,
        marketPriceMad: 350,
        equivalentCategoryFr: "Hyundai i10, Peugeot 208 ou citadine économique équivalente",
        equivalentCategoryEn: "Hyundai i10, Peugeot 208 or equivalent economy city car",
        equivalentCategoryEs: "Hyundai i10, Peugeot 208 o urbano económico equivalente",
        equivalentCategoryNl: "Hyundai i10, Peugeot 208 of gelijkwaardige stadsauto",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 300 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €300 standard deposit)",
        image: "/images/vehicles/hyundai-i10.webp",
        highlight: "Ultra-maniable, rayon de braquage court pour les ruelles, climatisation efficace et budget ultra-serré.",
        highlightEn: "Ultra-maneuverable, tight turning radius for historic medinas, crisp AC and unbeatable budget.",
        idealFor: "Voyageurs solo et couples recherchant le prix le plus bas pour visiter la ville et les alentours.",
        idealForEn: "Solo travelers and couples seeking the best budget rate for city breaks and day trips.",
        engine: "1.0 MPi 67 ch",
        horsepower: 67,
        trunkLiters: 252,
        groundClearanceCm: 15,
        fuelConsumption: "4.8 L / 100 km (Essence)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo du niveau de carburant au départ sur WhatsApp.",
        pistePolicy: "Asphalte uniquement",
        features: [
            "Climatisation manuelle réactive",
            "Connexion Bluetooth & prise USB",
            "Direction assistée ultra-douce",
            "Aide au démarrage en côte",
            "Fixations Isofix pour siège enfant",
            "Format passe-partout 3.67m facile à garer",
        ],
        moroccoRoadRating: {
            highway: 7.5,
            mountainAtlas: 6.5,
            medinaParking: 10.0,
            desertPiste: 3.0,
        },
        expertVerdictMorocco: "La championne du stationnement à Marrakech et Agadir. Sa longueur de 3,67 mètres permet de se garer dans n'importe quel recoin sans transpirer. Moteur 1.0L très sobre consommant moins de 5L aux 100 km.",
        faqs: [
            {
                q: "La voiture est-elle climatisée ?",
                a: "Oui, tous nos véhicules sans exception sont équipés d'une climatisation testée avant chaque mise à disposition."
            },
            {
                q: "Peut-on mettre des valises dans le coffre ?",
                a: "Le coffre de 252L accueille facilement 2 valises de cabine ou 1 grande valise de soute."
            }
        ]
    },
    {
        id: "hyundai-accent",
        name: "Hyundai Accent 1.6 CRDi",
        brand: "Hyundai",
        model: "Accent CRDi",
        category: "Compacte",
        categoryEn: "Compact",
        seats: 5,
        doors: 4,
        transmission: "Manuelle",
        transmissionEn: "Manual",
        fuel: "Diesel",
        luggage: 4,
        hasAC: true,
        dailyPriceEur: 35,
        dailyPriceMad: 380,
        marketPriceEur: 43,
        marketPriceMad: 470,
        equivalentCategoryFr: "Hyundai Accent Diesel, Dacia Logan ou berline tri-corps équivalente",
        equivalentCategoryEn: "Hyundai Accent Diesel, Dacia Logan or equivalent compact sedan",
        equivalentCategoryEs: "Hyundai Accent Diésel, Dacia Logan o sedán equivalente",
        equivalentCategoryNl: "Hyundai Accent Diesel, Dacia Logan of gelijkwaardige sedan",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 300 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €300 standard deposit)",
        image: "/images/vehicles/hyundai-accent.webp",
        highlight: "La berline diesel des grands rouleurs au Maroc : coffre malle géant de 480L, moteur 1.6 CRDi infatigable.",
        highlightEn: "The Moroccan highway legend: huge 480L trunk, proven 1.6 CRDi turbo diesel torque.",
        idealFor: "Familles avec 3 valises et voyageurs prévoyant de longues distances inter-villes.",
        idealForEn: "Families with luggage and travelers touring inter-city routes across Morocco.",
        engine: "1.6 CRDi 128 ch Turbo Diesel",
        horsepower: 128,
        trunkLiters: 480,
        groundClearanceCm: 16,
        fuelConsumption: "4.5 L / 100 km (Diesel)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo du compteur transmise lors de la remise des clés.",
        pistePolicy: "Asphalte uniquement",
        features: [
            "Coffre malle séparé de 480 Litres (sécurisé, bagages invisibles)",
            "Climatisation renforcée grand froid",
            "Écran multimédia avec connectivité smartphone",
            "Accoudoir central avant & arrière avec porte-gobelets",
            "Régulateur de vitesse autoroute",
            "Réservoir 45L pour plus de 900 km d'autonomie",
        ],
        moroccoRoadRating: {
            highway: 9.2,
            mountainAtlas: 8.0,
            medinaParking: 8.0,
            desertPiste: 5.0,
        },
        expertVerdictMorocco: "La berline préférée des voyageurs longue distance au Maroc. Son coffre séparé de 480L est un vrai avantage sécurité : aucun sac n'est visible de l'extérieur. Le moteur 1.6 CRDi de 128 ch est puissant et avale les autoroutes avec une consommation record de 4.5L/100km.",
        faqs: [
            {
                q: "Combien de valises peuvent entrer dans le coffre ?",
                a: "Le coffre de 480 litres peut accueillir 3 grandes valises rigides et plusieurs sacs souples sans gêner la visibilité arrière."
            }
        ]
    },
    {
        id: "dacia-jogger-7places",
        name: "Dacia Jogger (7 Places)",
        brand: "Dacia",
        model: "Jogger Extreme",
        category: "Familiale & 7 Places",
        categoryEn: "Family 7-Seater",
        seats: 7,
        doors: 5,
        transmission: "Manuelle",
        transmissionEn: "Manual",
        fuel: "Essence",
        luggage: 4,
        hasAC: true,
        dailyPriceEur: 52,
        dailyPriceMad: 570,
        marketPriceEur: 64,
        marketPriceMad: 700,
        equivalentCategoryFr: "Dacia Jogger 7 Places ou monospace familial 7 places équivalent",
        equivalentCategoryEn: "Dacia Jogger 7-Seater or equivalent 7-seater family MPV",
        equivalentCategoryEs: "Dacia Jogger 7 Plazas o monovolumen 7 plazas equivalente",
        equivalentCategoryNl: "Dacia Jogger 7 Zitplaatsen of gelijkwaardige 7-persoons auto",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 300 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €300 standard deposit)",
        image: "/images/vehicles/dacia-jogger.webp",
        highlight: "Le 7 places le plus économique du Maroc : 7 vraies places modulables, garde au sol 20 cm, barres de toit intégrées.",
        highlightEn: "The smartest 7-seater in Morocco: 7 modular seats, 20cm ground clearance, integrated roof rails.",
        idealFor: "Familles nombreuses, voyages entre amis et groupes de surfeurs (Taghazout, Imsouane).",
        idealForEn: "Large families, groups of friends and surf trips (Taghazout, Imsouane).",
        engine: "1.0 TCe 110 ch Turbo",
        horsepower: 110,
        trunkLiters: 565,
        groundClearanceCm: 20,
        fuelConsumption: "5.6 L / 100 km (Essence)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo du niveau d'essence envoyée par WhatsApp.",
        pistePolicy: "Pistes carrossables & auberges autorisées (Hors tout-terrain franchissement)",
        features: [
            "7 vraies places adultes avec 3ème rangée escamotable",
            "Garde au sol haute de 20 cm pour passer partout sans frotter",
            "Barres de toit intelligentes pivotantes à 90° (porte-surfs / bagages)",
            "Écran tactile 8 pouces avec Apple CarPlay & Android Auto",
            "Radars de recul & caméra arrière",
            "Climatisation avant et diffuseurs arrière",
        ],
        moroccoRoadRating: {
            highway: 8.8,
            mountainAtlas: 8.2,
            medinaParking: 7.2,
            desertPiste: 7.0,
        },
        expertVerdictMorocco: "Le compromis parfait pour les groupes. Louer un grand 4x4 7 places coûte souvent 140€/jour, alors que ce Jogger permet de voyager à 7 personnes pour 52€/jour seulement. Sa garde au sol de 20 cm lui permet d'emprunter sans problème les pistes des spots de surf ou les accès aux maisons d'hôtes de l'Atlas.",
        faqs: [
            {
                q: "Peut-on rabattre la 3ème rangée pour avoir un coffre géant ?",
                a: "Oui, en configuration 5 places, le coffre offre un volume colossal de 708 litres pour transporter planches de surf, poussettes et matériel volumineux."
            }
        ]
    },
    {
        id: "hyundai-staria-9places",
        name: "Hyundai Staria (9 Places)",
        brand: "Hyundai",
        model: "Staria",
        category: "Familiale & 7 Places",
        categoryEn: "Family 7-Seater",
        seats: 9,
        doors: 5,
        transmission: "Automatique",
        transmissionEn: "Automatic",
        fuel: "Diesel",
        luggage: 6,
        hasAC: true,
        dailyPriceEur: 115,
        dailyPriceMad: 1265,
        marketPriceEur: 145,
        marketPriceMad: 1595,
        equivalentCategoryFr: "Hyundai Staria 9 places, Mercedes Vito ou minibus équivalent",
        equivalentCategoryEn: "Hyundai Staria 9-seater, Mercedes Vito or equivalent minibus",
        equivalentCategoryEs: "Hyundai Staria 9 plazas, Mercedes Vito o minibús equivalente",
        equivalentCategoryNl: "Hyundai Staria 9 zitplaatsen, Mercedes Vito of gelijkwaardige minibus",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 500 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €500 standard deposit)",
        image: "/images/vehicles/hyundai-staria.webp",
        highlight: "Le minibus VIP du Maroc : 9 places confort Business, portes coulissantes électriques, boîte auto 8 rapports, clim tri-zone.",
        highlightEn: "Morocco's VIP shuttle: 9 business-class seats, electric sliding doors, 8-speed auto, tri-zone climate.",
        idealFor: "Familles MRE, groupes d'amis (8+1), transferts aéroport et circuits grand sud en tout confort.",
        idealForEn: "MRE families, groups of 8+1, airport transfers and grand south tours in total comfort.",
        engine: "2.2 CRDi 177 ch Turbo Diesel",
        horsepower: 177,
        trunkLiters: 831,
        groundClearanceCm: 17,
        fuelConsumption: "7.2 L / 100 km (Diesel)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo du compteur WhatsApp à la livraison. Le réservoir de 75L offre 1 000 km d'autonomie.",
        pistePolicy: "Asphalte uniquement",
        features: [
            "9 places individuelles avec accoudoirs et appuie-tête réglables",
            "Portes coulissantes électriques gauche et droite",
            "Boîte automatique à 8 rapports ultra-douce",
            "Climatisation tri-zone avant / milieu / arrière",
            "Écran tactile 10.25'' avec Apple CarPlay & Android Auto",
            "Caméra de recul + capteurs de stationnement 360°",
        ],
        moroccoRoadRating: {
            highway: 9.5,
            mountainAtlas: 7.5,
            medinaParking: 5.0,
            desertPiste: 4.0,
        },
        expertVerdictMorocco: "C'est le roi des transferts aéroport et des circuits famille au Maroc. 9 passagers avec leurs bagages dans un confort de Business Class. Seul point faible : son gabarit le rend inadapté aux ruelles des médinas et aux pistes. Privilégiez-le pour les autoroutes et circuits organisés (Marrakech–Essaouira–Agadir ou Fès–Chefchaouen–Tanger).",
        faqs: [
            {
                q: "Les 9 places sont-elles de vraies places adultes ?",
                a: "Oui, 9 sièges individuels avec ceintures 3 points, accoudoirs et prises USB. Pas de banquette rabattable : chaque passager a un vrai siège."
            },
            {
                q: "Combien de valises 23 kg rentrent dans le coffre ?",
                a: "En configuration 9 places, le coffre de 831 litres avale 5 à 6 grandes valises soute. En rabattant la 3ème rangée, c'est presque un utilitaire."
            }
        ]
    },
    {
        id: "toyota-hilux-4x4",
        name: "Toyota Hilux 4x4 Double Cabine",
        brand: "Toyota",
        model: "Hilux",
        category: "SUV & 4x4",
        categoryEn: "SUV & 4WD",
        seats: 5,
        doors: 4,
        transmission: "Automatique",
        transmissionEn: "Automatic",
        fuel: "Diesel",
        luggage: 5,
        hasAC: true,
        dailyPriceEur: 95,
        dailyPriceMad: 1045,
        marketPriceEur: 120,
        marketPriceMad: 1320,
        equivalentCategoryFr: "Toyota Hilux 4x4, Ford Ranger ou pick-up tout-terrain équivalent",
        equivalentCategoryEn: "Toyota Hilux 4WD, Ford Ranger or equivalent all-terrain pickup",
        equivalentCategoryEs: "Toyota Hilux 4x4, Ford Ranger o pickup todoterreno equivalente",
        equivalentCategoryNl: "Toyota Hilux 4x4, Ford Ranger of gelijkwaardige terreinpickup",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 500 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €500 standard deposit)",
        image: "/images/vehicles/toyota-hilux.webp",
        highlight: "L'indestructible des pistes marocaines : 4x4 robuste, bloquerifferentiel arrière, garde au sol 28 cm, benne pour matériel surf/bivouac.",
        highlightEn: "The indestructible Moroccan trail king: rugged 4WD, rear diff lock, 28cm clearance, bed for surf/camping gear.",
        idealFor: "Grand sud (Ouarzazate, Zagora, Merzouga), pistes désert, surfeurs Dakhla/Imsouane, aventuriers bivouac.",
        idealForEn: "Deep south (Ouarzazate, Zagora, Merzouga), desert tracks, Dakhla/Imsouane surfers, overland camping.",
        engine: "2.4 D-4D 150 ch Turbo Diesel",
        horsepower: 150,
        trunkLiters: 0,
        groundClearanceCm: 28,
        fuelConsumption: "7.8 L / 100 km (Diesel)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo du compteur par WhatsApp. Le réservoir de 80L offre plus de 1 000 km d'autonomie.",
        pistePolicy: "Franchissement & Pistes désert 100% autorisés",
        features: [
            "Transmission intégrale permanente avec blocage de différentiel arrière",
            "Garde au sol de 28 cm avec plaques de protection renforcées",
            "Benne arrière 1 515 mm pour planches de surf, matériel bivouac ou jerricans",
            "Boîte automatique 6 rapports avec mode séquentiel",
            "Climatisation automatique renforcée pour climat extrême",
            "Attelage de remorquage 3.5 tonnes",
        ],
        moroccoRoadRating: {
            highway: 7.5,
            mountainAtlas: 9.5,
            medinaParking: 4.0,
            desertPiste: 10.0,
        },
        expertVerdictMorocco: "Le véhicule de légende des pistes marocaines. Là où les SUV de luxe s'arrêtent, le Hilux continue. Seul véhicule de la flotte autorisé en franchissement total (dunes de l'Erg Chebbi, pistes Zagora–M'Hamid, côte atlantique sauvage jusqu'à Dakhla). La benne est un atout énorme pour les surfeurs qui voyagent avec 3-4 planches.",
        faqs: [
            {
                q: "Le Hilux peut-il aller dans les dunes de Merzouga ?",
                a: "Oui, c'est l'un des seuls véhicules de notre flotte homologué en franchissement désertique total. Avec ses 28 cm de garde au sol et son blocage de différentiel, il encaisse les pistes sableuses sans broncher."
            },
            {
                q: "Peut-on dormir dans la benne avec une tente de toit ?",
                a: "Absolument. La benne supporte jusqu'à 500 kg de charge. Beaucoup de nos clients surfeurs installent une tente de benne pour bivouaquer entre Taghazout et Imsouane."
            }
        ]
    },
    {
        id: "volkswagen-golf-8-auto",
        name: "Volkswagen Golf 8 Automatique",
        brand: "Volkswagen",
        model: "Golf 8",
        category: "Premium",
        categoryEn: "Premium",
        seats: 5,
        doors: 5,
        transmission: "Automatique",
        transmissionEn: "Automatic",
        fuel: "Essence",
        luggage: 3,
        hasAC: true,
        dailyPriceEur: 65,
        dailyPriceMad: 715,
        marketPriceEur: 82,
        marketPriceMad: 900,
        equivalentCategoryFr: "Volkswagen Golf 8, Audi A3 ou compacte premium automatique équivalente",
        equivalentCategoryEn: "Volkswagen Golf 8, Audi A3 or equivalent premium automatic compact",
        equivalentCategoryEs: "Volkswagen Golf 8, Audi A3 o compacto premium automático equivalente",
        equivalentCategoryNl: "Volkswagen Golf 8, Audi A3 of gelijkwaardige premium automatische compacte",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 300 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €300 standard deposit)",
        image: "/images/vehicles/volkswagen-golf-8.webp",
        highlight: "La référence premium : boîte DSG 7 rapports, cockpit digital, insonorisation de berline, conduite européenne.",
        highlightEn: "The premium benchmark: 7-speed DSG, digital cockpit, sedan-level refinement, true European drive.",
        idealFor: "Diaspora MRE, voyageurs d'affaires et couples exigeants qui veulent conduire une voiture allemande au Maroc.",
        idealForEn: "MRE diaspora, business travelers and discerning couples wanting a proper German car in Morocco.",
        engine: "1.5 TSI 150 ch EVO2 DSG-7",
        horsepower: 150,
        trunkLiters: 381,
        groundClearanceCm: 14,
        fuelConsumption: "5.4 L / 100 km (Essence)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo du tableau de bord digital envoyée par WhatsApp au check-in.",
        pistePolicy: "Asphalte uniquement",
        features: [
            "Boîte automatique DSG à 7 rapports ultra-réactive",
            "Cockpit digital intégral avec instrumentation paramétrable 10.25''",
            "Écran tactile 10'' Discover Pro avec navigation GPS intégrée",
            "Détection de fatigue, freinage d'urgence et maintien de voie",
            "Sellerie sport tissu/Alcantara avec réglage lombaire",
            "Phares matriciels IQ.LIGHT LED adaptatifs",
        ],
        moroccoRoadRating: {
            highway: 9.8,
            mountainAtlas: 7.5,
            medinaParking: 8.5,
            desertPiste: 3.0,
        },
        expertVerdictMorocco: "Pour ceux qui refusent de rouler en Dacia ou Hyundai pendant leurs vacances, la Golf 8 est la réponse. Insonorisation, tenue de route et finition allemande sur l'autoroute Casablanca–Marrakech, c'est une vraie expérience premium. Pas faite pour les pistes, mais parfaite pour le triangle Casablanca–Rabat–Marrakech–Essaouira.",
        faqs: [
            {
                q: "La Golf 8 est-elle confortable sur les longs trajets autoroutiers ?",
                a: "C'est son terrain de jeu préféré. L'insonorisation est au niveau d'une berline deux segments au-dessus, la boîte DSG passe les rapports sans à-coup, et le régulateur adaptatif gère les portions autoroute presque tout seul."
            },
            {
                q: "Pourquoi choisir la Golf plutôt qu'un Tucson ou un Duster ?",
                a: "Si vous restez sur le bitume (Casablanca, Marrakech, Essaouira, Tanger), la Golf offre un niveau de finition, de conduite et de plaisir au volant qu'aucun SUV de la même gamme de prix ne peut égaler."
            }
        ]
    },
    {
        id: "dacia-logan",
        name: "Dacia Logan 3 Berline",
        brand: "Dacia",
        model: "Logan",
        category: "Citadine",
        categoryEn: "City",
        seats: 5,
        doors: 4,
        transmission: "Manuelle",
        transmissionEn: "Manual",
        fuel: "Diesel",
        luggage: 4,
        hasAC: true,
        dailyPriceEur: 26,
        dailyPriceMad: 285,
        marketPriceEur: 34,
        marketPriceMad: 375,
        equivalentCategoryFr: "Dacia Logan 3, Peugeot 301 ou berline économique équivalente",
        equivalentCategoryEn: "Dacia Logan 3, Peugeot 301 or equivalent economy family sedan",
        equivalentCategoryEs: "Dacia Logan 3, Peugeot 301 o sedán económico equivalente",
        equivalentCategoryNl: "Dacia Logan 3, Peugeot 301 of gelijkwaardige economische sedan",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 250 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €250 standard deposit)",
        image: "/images/vehicles/dacia-logan.webp",
        highlight: "Le champion imbattable du rapport prix/coffre : 528 L de coffre pour les familles avec valises, moteur diesel 1.5 dCi increvable (4.1L/100km).",
        highlightEn: "Unbeatable luggage-to-price champion: massive 528L trunk for families, ultra-reliable 1.5 dCi diesel (4.1L/100km).",
        idealFor: "Familles voyageant avec de nombreuses valises, MRE et séjours longue durée au meilleur tarif économique du Maroc.",
        idealForEn: "Families traveling with multiple suitcases, MRE diaspora and long-term economical stays in Morocco.",
        engine: "1.5 dCi 95 ch Turbo Diesel",
        horsepower: 95,
        trunkLiters: 528,
        groundClearanceCm: 16,
        fuelConsumption: "4.1 L / 100 km (Diesel)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo de la jauge carburant prise lors de la remise des clés.",
        pistePolicy: "Pistes carrossables & auberges autorisées (Hors tout-terrain franchissement)",
        features: [
            "Coffre géant de 528 L (le plus grand de sa catégorie au Maroc)",
            "Climatisation renforcée pour les étés marocains",
            "Système multimédia avec support smartphone et prises USB",
            "Feux de jour à LED avec nouvelle signature lumineuse en Y Dacia",
            "Direction assistée électrique et régulateur de vitesse",
            "Vraie roue de secours taille réelle",
        ],
        moroccoRoadRating: {
            highway: 8.5,
            mountainAtlas: 8.0,
            medinaParking: 8.5,
            desertPiste: 6.5,
        },
        expertVerdictMorocco: "La Dacia Logan est la reine incontournable des aéroports marocains. Une famille de 4 personnes qui atterrit avec 3 grosses valises ne rentre pas dans une Clio ou une i10. Avec 528 litres de coffre et son moteur dCi qui consomme à peine 4 litres aux 100 km, c'est le choix rationnel numéro 1 pour voyager sans se ruiner.",
        faqs: [
            {
                q: "Combien de grandes valises rentrent dans le coffre de la Logan ?",
                a: "Facilement 3 grandes valises rigides de soute (23 kg) plus 2 valises cabine ou sacs souples. C'est le plus grand coffre de tout le segment économique au Maroc."
            },
            {
                q: "La Logan est-elle adaptée pour voyager entre Marrakech, Ouarzazate et Agadir ?",
                a: "Parfaitement. Son moteur diesel 1.5 dCi est le même que celui des Duster et Stepway : il grimpe sans problème les cols montagneux et dispose d'une autonomie de plus de 900 km par plein."
            }
        ]
    },
    {
        id: "fiat-500-cabriolet",
        name: "Fiat 500 Cabriolet Automatique",
        brand: "Fiat",
        model: "500C",
        category: "Citadine",
        categoryEn: "City",
        seats: 4,
        doors: 3,
        transmission: "Automatique",
        transmissionEn: "Automatic",
        fuel: "Essence",
        luggage: 2,
        hasAC: true,
        dailyPriceEur: 39,
        dailyPriceMad: 430,
        marketPriceEur: 52,
        marketPriceMad: 570,
        equivalentCategoryFr: "Fiat 500 Cabriolet, Mini Cabriolet ou décapotable urbaine équivalente",
        equivalentCategoryEn: "Fiat 500 Convertible, Mini Convertible or equivalent stylish cabriolet",
        equivalentCategoryEs: "Fiat 500 Descapotable o cabriolet urbano equivalente",
        equivalentCategoryNl: "Fiat 500 Cabriolet of vergelijkbare stijlvolle cabrio",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 300 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €300 standard deposit)",
        image: "/images/vehicles/fiat-500-cabriolet.webp",
        highlight: "L'icône chic de Marrakech : capote électrique en toile, format passe-partout pour la Médina, Guéliz et l'Hivernage.",
        highlightEn: "Marrakech's chic icon: electric soft-top roof, nimble size for navigating Gueliz, Hivernage and Medina gates.",
        idealFor: "Couples, virées romantiques, week-ends ensoleillés et escapades vers le désert d'Agafay cheveux au vent.",
        idealForEn: "Couples, romantic getaways, sunny weekends and open-air sunset drives to Agafay desert.",
        engine: "1.0 Hybrid 70 ch Dualogic",
        horsepower: 70,
        trunkLiters: 185,
        groundClearanceCm: 14,
        fuelConsumption: "4.7 L / 100 km (Essence)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo du compteur et de la jauge carburant prise lors de la livraison.",
        pistePolicy: "Asphalte uniquement",
        features: [
            "Capote électrique en toile ouvrable jusqu'à 100 km/h",
            "Écran tactile Uconnect 7'' avec Apple CarPlay & Android Auto",
            "Climatisation automatique renforcée",
            "Radars de recul pour stationnement facile en centre-ville",
            "Mode City pour braquage ultra-léger dans les ruelles étroites",
            "Jantes alliage 16'' et sellerie tissu/cuir ivoire",
        ],
        moroccoRoadRating: {
            highway: 7.0,
            mountainAtlas: 6.5,
            medinaParking: 10.0,
            desertPiste: 2.0,
        },
        expertVerdictMorocco: "C'est la reine du charme à Marrakech. Décapoter au coucher du soleil entre Guéliz et la Palmeraie ou filer vers Agafay offre une expérience magique. Grâce à son gabarit de 3,57 m et sa direction City, vous trouvez une place partout devant les restaurants de l'Hivernage où les gros SUV restent coincés.",
        faqs: [
            {
                q: "Peut-on rouler décapoté en été à Marrakech ?",
                a: "Oui, tôt le matin ou après 18h au coucher du soleil quand la température redescend. En pleine journée sous 42°C, refermez la capote en 15 secondes d'une simple pression sur le bouton et activez la climatisation."
            },
            {
                q: "Les bagages de 2 personnes rentrent-ils dans le coffre ?",
                a: "Le coffre de 185 L accueille 2 valises cabine (format avion) ou 1 grande valise. Les 2 places arrière permettent d'ajouter facilement vos sacs supplémentaires."
            }
        ]
    },
    {
        id: "volkswagen-t-roc",
        name: "Volkswagen T-Roc R-Line Automatique",
        brand: "Volkswagen",
        model: "T-Roc",
        category: "SUV & 4x4",
        categoryEn: "SUV & 4WD",
        seats: 5,
        doors: 5,
        transmission: "Automatique",
        transmissionEn: "Automatic",
        fuel: "Diesel",
        luggage: 4,
        hasAC: true,
        dailyPriceEur: 52,
        dailyPriceMad: 570,
        marketPriceEur: 68,
        marketPriceMad: 750,
        equivalentCategoryFr: "Volkswagen T-Roc, Audi Q2 ou SUV compact premium automatique équivalent",
        equivalentCategoryEn: "Volkswagen T-Roc, Audi Q2 or equivalent premium compact automatic SUV",
        equivalentCategoryEs: "Volkswagen T-Roc, Audi Q2 o SUV compacto premium automático equivalente",
        equivalentCategoryNl: "Volkswagen T-Roc, Audi Q2 of gelijkwaardige premium compacte automaat SUV",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 300 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €300 standard deposit)",
        image: "/images/vehicles/volkswagen-t-roc.webp",
        highlight: "Le SUV compact le plus équilibré : boîte DSG 7 rapports, garde au sol 17 cm, feux IQ.Light LED, toit bi-ton.",
        highlightEn: "The sharpest compact SUV: 7-speed DSG, 17cm ground clearance, IQ.Light LED headlights, dual-tone roof.",
        idealFor: "Familles et voyageurs exigeants cherchant l'assise haute d'un SUV et l'agilité d'une Golf sur les routes marocaines.",
        idealForEn: "Families & travelers wanting higher driving position and Golf-like agility across Morocco.",
        engine: "2.0 TDI 150 ch DSG-7",
        horsepower: 150,
        trunkLiters: 445,
        groundClearanceCm: 17,
        fuelConsumption: "4.9 L / 100 km (Diesel)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo numérique du cockpit digital réalisée à la remise des clés.",
        pistePolicy: "Pistes carrossables & auberges autorisées (Hors tout-terrain franchissement)",
        features: [
            "Boîte automatique DSG 7 rapports avec palettes au volant",
            "Cockpit digital Digital Cockpit Pro 10.25'' personnalisable",
            "Projecteurs Matrix LED IQ.Light avec bandeau lumineux avant",
            "Régulateur de vitesse adaptatif ACC & Lane Assist",
            "Coffre spacieux de 445 L avec plancher modulable",
            "Climatisation automatique bi-zone Climatronic tactile",
        ],
        moroccoRoadRating: {
            highway: 9.5,
            mountainAtlas: 8.8,
            medinaParking: 8.5,
            desertPiste: 6.0,
        },
        expertVerdictMorocco: "Le T-Roc est le compromis idéal au Maroc. Ses 17 cm de garde au sol permettent d'aborder sans aucune appréhension les dos d'âne XXL de Marrakech et les accès d'auberges sur pistes roulantes dans l'Ourika ou l'Atlas, tout en offrant la précision de conduite d'une berline allemande sur autoroute.",
        faqs: [
            {
                q: "Le T-Roc peut-il aller à Essaouira ou dans le désert d'Agafay ?",
                a: "Parfaitement. Sur la voie rapide vers Essaouira, il avale les kilomètres avec une consommation remarquable (< 5L/100km). Pour Agafay, toutes les pistes principales menant aux camps de tentes sont autorisées."
            },
            {
                q: "Le T-Roc est-il adapté avec 3 enfants et bagages ?",
                a: "Oui, la banquette arrière offre 3 vraies places et le coffre de 445 L accueille sans difficulté 3 grandes valises et des sacs souples."
            }
        ]
    },
    {
        id: "audi-a3-sportback",
        name: "Audi A3 Sportback S-Line Automatique",
        brand: "Audi",
        model: "A3 Sportback",
        category: "Premium",
        categoryEn: "Premium",
        seats: 5,
        doors: 5,
        transmission: "Automatique",
        transmissionEn: "Automatic",
        fuel: "Diesel",
        luggage: 3,
        hasAC: true,
        dailyPriceEur: 69,
        dailyPriceMad: 760,
        marketPriceEur: 92,
        marketPriceMad: 1010,
        equivalentCategoryFr: "Audi A3 Sportback S-Line, BMW Série 1 M-Sport ou compacte premium allemande équivalente",
        equivalentCategoryEn: "Audi A3 Sportback S-Line, BMW 1 Series M-Sport or equivalent German premium compact",
        equivalentCategoryEs: "Audi A3 Sportback S-Line, BMW Serie 1 o compacto premium alemán equivalente",
        equivalentCategoryNl: "Audi A3 Sportback S-Line, BMW 1-Serie of gelijkwaardige premium compact",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 400 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €400 standard deposit)",
        image: "/images/vehicles/audi-a3-sportback.webp",
        highlight: "Prestige et dynamisme : finition S-Line, Virtual Cockpit, boîte S-Tronic 7, calandre Singleframe nid d'abeille.",
        highlightEn: "Prestige & dynamics: S-Line styling, Audi Virtual Cockpit, 7-speed S-Tronic, honeycomb Singleframe grille.",
        idealFor: "Voyageurs d'affaires, MRE et couples recherchant le raffinement des anneaux Audi pour sillonner le Maroc.",
        idealForEn: "Business travelers, MRE diaspora and couples wanting genuine Audi refinement in Morocco.",
        engine: "35 TDI 150 ch S-Tronic 7",
        horsepower: 150,
        trunkLiters: 380,
        groundClearanceCm: 14,
        fuelConsumption: "4.6 L / 100 km (Diesel)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo numérique du Virtual Cockpit prise au check-in.",
        pistePolicy: "Asphalte uniquement",
        features: [
            "Pack extérieur et intérieur S-Line avec sièges sport enveloppants",
            "Boîte automatique S-Tronic 7 rapports à double embrayage",
            "Audi Virtual Cockpit Plus 12.3'' avec vue cartographique 3D",
            "Phares avant Audi Matrix LED avec clignotants dynamiques",
            "Système audio Audi Sound System haute fidélité",
            "Sélecteur de modes de conduite Audi Drive Select",
        ],
        moroccoRoadRating: {
            highway: 9.8,
            mountainAtlas: 8.0,
            medinaParking: 8.5,
            desertPiste: 2.5,
        },
        expertVerdictMorocco: "L'Audi A3 Sportback S-Line est la compacte la plus convoitée pour les séjours à Marrakech, Rabat et Casablanca. Son moteur 2.0 TDI de 150 ch a un couple impressionnant pour doubler en toute sécurité, tout en restant sous la barre des 5L/100km sur l'autoroute.",
        faqs: [
            {
                q: "L'A3 S-Line est-elle autorisée sur les pistes en terre ?",
                a: "Non. Avec son châssis sport S-Line surbaissé et ses jantes alliage, elle est strictement réservée au réseau routier goudronné pour préserver les pneus et le bas de caisse."
            },
            {
                q: "Comment se passe la prise en charge à l'aéroport Marrakech Menara ?",
                a: "Livraison VIP directe au parking P2. L'agent ZwinCar vous remet le véhicule propre, désinfecté et contrôlé. Pas de navette, pas d'attente au guichet."
            }
        ]
    },
    {
        id: "audi-q3-sportback",
        name: "Audi Q3 Sportback Black Edition",
        brand: "Audi",
        model: "Q3 Sportback",
        category: "Premium",
        categoryEn: "Premium",
        seats: 5,
        doors: 5,
        transmission: "Automatique",
        transmissionEn: "Automatic",
        fuel: "Diesel",
        luggage: 4,
        hasAC: true,
        dailyPriceEur: 89,
        dailyPriceMad: 980,
        marketPriceEur: 115,
        marketPriceMad: 1265,
        equivalentCategoryFr: "Audi Q3 Sportback, BMW X2 M-Sport ou SUV coupé premium équivalent",
        equivalentCategoryEn: "Audi Q3 Sportback, BMW X2 M-Sport or equivalent premium compact SUV coupé",
        equivalentCategoryEs: "Audi Q3 Sportback, BMW X2 o SUV coupé premium equivalente",
        equivalentCategoryNl: "Audi Q3 Sportback, BMW X2 of gelijkwaardige premium SUV coupé",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 500 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €500 standard deposit)",
        image: "/images/vehicles/audi-q3-sportback.webp",
        highlight: "Le SUV Coupé de référence : ligne de toit fuyante athlétique, Pack Black Optics, sellerie sport cuir, toit ouvrant.",
        highlightEn: "The benchmark SUV Coupé: athletic sweeping roofline, Black Optics styling pack, sport leather, panoramic roof.",
        idealFor: "Voyageurs VIP, séjours dans les palaces de Marrakech et escapades grand confort entre ville et désert.",
        idealForEn: "VIP travelers, luxury palace stays in Marrakech and supreme comfort cruising between city and desert.",
        engine: "35 TDI 150 ch S-Tronic Black Edition",
        horsepower: 150,
        trunkLiters: 530,
        groundClearanceCm: 17,
        fuelConsumption: "5.3 L / 100 km (Diesel)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo du tableau de bord horodatée transmise sur WhatsApp.",
        pistePolicy: "Pistes carrossables & auberges autorisées (Hors tout-terrain franchissement)",
        features: [
            "Pack Esthétique Noir Brillant (calandre Singleframe, rétros et contours)",
            "Toit ouvrant panoramique en verre avec store occultant",
            "Sièges sport chauffants en cuir avec surpiqûres contrastées",
            "Caméra de recul haute définition avec vue panoramique 360°",
            "Hayon de coffre électrique à ouverture mains libres",
            "Audi Virtual Cockpit Plus et Navigation MMI Touch 10.1''",
        ],
        moroccoRoadRating: {
            highway: 9.7,
            mountainAtlas: 8.5,
            medinaParking: 8.0,
            desertPiste: 5.5,
        },
        expertVerdictMorocco: "L'Audi Q3 Sportback est le véhicule qui fait tourner les têtes à Marrakech. Sa silhouette coupée apporte une allure résolument sportive, tandis que ses 17 cm de garde au sol et son grand coffre de 530 L permettent d'embarquer les bagages de toute la famille sans compromis.",
        faqs: [
            {
                q: "Le Q3 Sportback peut-il rejoindre les camps d'Agafay ou de la Palmeraie ?",
                a: "Oui, les pistes carrossables d'accès aux camps de luxe et aux Riads de la Palmeraie sont parfaitement praticables grâce à sa garde au sol rehaussée."
            },
            {
                q: "Quelle est la politique de caution pour l'Audi Q3 Sportback ?",
                a: "Avec l'option Franchise Zéro, aucune caution n'est bloquée sur votre carte de crédit. En formule standard, une pré-autorisation modérée ou un dépôt espèces de 500 € suffit, là où les agences d'aéroport classiques bloquent 2 000 €."
            }
        ]
    },
    {
        id: "mercedes-cla-coupe",
        name: "Mercedes-Benz CLA Coupé AMG Line",
        brand: "Mercedes-Benz",
        model: "CLA Coupé",
        category: "Premium",
        categoryEn: "Premium",
        seats: 5,
        doors: 4,
        transmission: "Automatique",
        transmissionEn: "Automatic",
        fuel: "Diesel",
        luggage: 3,
        hasAC: true,
        dailyPriceEur: 98,
        dailyPriceMad: 1080,
        marketPriceEur: 135,
        marketPriceMad: 1485,
        equivalentCategoryFr: "Mercedes-Benz CLA Coupé AMG Line, BMW Série 2 Gran Coupé ou berline coupé équivalente",
        equivalentCategoryEn: "Mercedes-Benz CLA Coupé AMG Line, BMW 2 Series Gran Coupé or equivalent executive coupé",
        equivalentCategoryEs: "Mercedes-Benz CLA Coupé AMG Line, BMW Serie 2 Gran Coupé o coupé premium equivalente",
        equivalentCategoryNl: "Mercedes-Benz CLA Coupé AMG Line, BMW 2-Serie Gran Coupé of gelijkwaardige executive coupé",
        depositPolicy: "0 € de caution avec Franchise Zéro (ou 500 € en formule standard)",
        depositPolicyEn: "0€ deposit with Zero-Excess option (or €500 standard deposit)",
        image: "/images/vehicles/mercedes-cla-coupe.webp",
        highlight: "L'élégance absolue à Marrakech : silhouette 4 portes sans encadrement de vitres, Pack AMG Line, intérieur MBUX Widescreen.",
        highlightEn: "Absolute elegance in Marrakech: 4-door frameless windows, AMG Line styling, dual MBUX Widescreen cockpit.",
        idealFor: "Mariages, soirées privées, séjours d'affaires et clients exigeants voulant faire sensation à l'Hivernage.",
        idealForEn: "Weddings, private parties, executive business trips and making an entrance in Marrakech's Hivernage.",
        engine: "200 d 150 ch 8G-DCT AMG Line",
        horsepower: 150,
        trunkLiters: 460,
        groundClearanceCm: 13,
        fuelConsumption: "4.8 L / 100 km (Diesel)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo du combiné numérique double écran prise au départ.",
        pistePolicy: "Asphalte uniquement",
        features: [
            "Kit carrosserie AMG Line avec jupe avant sportive et jantes alliage 18''",
            "Double écran panoramique Widescreen MBUX avec commande vocale 'Hey Mercedes'",
            "Éclairage d'ambiance 64 couleurs personnalisable dans tout l'habitacle",
            "Phares LED hautes performances avec assistance aux feux de route",
            "Sièges sport intégraux similicuir Artico / microfibre Dinamica",
            "Boîte automatique 8G-DCT à double embrayage et palettes chromées",
        ],
        moroccoRoadRating: {
            highway: 10.0,
            mountainAtlas: 7.5,
            medinaParking: 8.0,
            desertPiste: 1.5,
        },
        expertVerdictMorocco: "La Mercedes CLA Coupé est sans conteste la berline la plus élégante pour séjourner à Marrakech. Ses portières sans cadre, son intérieur futuriste et sa prestance en font la monture idéale pour arriver devant les palaces du Guéliz ou du Boulevard Mohammed VI.",
        faqs: [
            {
                q: "La CLA Coupé est-elle facile à conduire dans la circulation de Marrakech ?",
                a: "Très facile grâce aux caméras, radars Parktronic et à la direction assistée paramétrique. Attention simplement aux ralentisseurs très hauts en raison de son châssis sport abaissé."
            },
            {
                q: "Le diesel 200d est-il économique ?",
                a: "Remarquablement sobre : 4.8 L aux 100 km sur autoroute. Avec son réservoir de 50 L, vous parcourez plus de 1 000 km sans vous arrêter à la station-service."
            }
        ]
    },
    {
        id: "porsche-macan",
        name: "Porsche Macan PDK Automatique",
        brand: "Porsche",
        model: "Macan",
        category: "Premium",
        categoryEn: "Premium",
        seats: 5,
        doors: 5,
        transmission: "Automatique",
        transmissionEn: "Automatic",
        fuel: "Essence",
        luggage: 4,
        hasAC: true,
        dailyPriceEur: 175,
        dailyPriceMad: 1925,
        marketPriceEur: 240,
        marketPriceMad: 2640,
        equivalentCategoryFr: "Porsche Macan, Maserati Levante ou SUV de sport de grand luxe équivalent",
        equivalentCategoryEn: "Porsche Macan, Maserati Levante or equivalent high-performance luxury SUV",
        equivalentCategoryEs: "Porsche Macan, Maserati Levante o SUV de lujo deportivo equivalente",
        equivalentCategoryNl: "Porsche Macan, Maserati Levante of gelijkwaardige ultra-luxe sport-SUV",
        depositPolicy: "0 € de caution avec Rachat Franchise Prestige (ou 1 000 € en formule standard)",
        depositPolicyEn: "0€ deposit with Prestige Zero-Excess option (or €1,000 standard deposit)",
        image: "/images/vehicles/porsche-macan.webp",
        highlight: "Le summum du luxe à Marrakech : 265 ch, boîte PDK à 7 rapports, transmission intégrale PTM, sonorité Porsche inimitable.",
        highlightEn: "Peak luxury in Marrakech: 265 hp, 7-speed PDK transmission, PTM all-wheel drive, authentic Porsche soundtrack.",
        idealFor: "Clients d'exception, séjours à La Mamounia ou au Royal Mansour, célébrations et passionnés de conduite sportive.",
        idealForEn: "Discerning luxury guests, Royal Mansour or Mamounia stays, VIP celebrations and sports driving enthusiasts.",
        engine: "2.0 Turbo 265 ch PDK Transmission Intégrale PTM",
        horsepower: 265,
        trunkLiters: 488,
        groundClearanceCm: 20,
        fuelConsumption: "8.8 L / 100 km (Essence Super)",
        fuelPolicy: "Niveau identique (Same-to-Same)",
        fuelPolicyNote: "Photo haute résolution du tableau de bord et des 5 compteurs prise à la livraison.",
        pistePolicy: "Asphalte uniquement",
        features: [
            "Boîte de vitesses Porsche Doppelkupplung (PDK) 7 rapports",
            "Transmission intégrale active Porsche Traction Management (PTM)",
            "Écran tactile Porsche Communication Management (PCM) 10.9'' Full HD",
            "Système d'échappement sport avec sorties chromées noires",
            "Phares matriciels à LED avec Porsche Dynamic Light System Plus (PDLS Plus)",
            "Suspension pneumatique adaptative avec réglage de hauteur de caisse",
        ],
        moroccoRoadRating: {
            highway: 10.0,
            mountainAtlas: 9.5,
            medinaParking: 7.5,
            desertPiste: 3.5,
        },
        expertVerdictMorocco: "Louer une Porsche à Marrakech chez les courtiers classiques exige souvent 5 000 € de caution et des justificatifs infinis. Chez ZwinCar avec notre partenaire local vérifié, vous profitez de l'indescriptible plaisir de conduite du Macan avec une procédure simplifiée et les clés remises en main propre dès l'atterrissage.",
        faqs: [
            {
                q: "Quel carburant utiliser pour le Porsche Macan au Maroc ?",
                a: "Exclusivement du carburant Sans Plomb Super (Super 98 ou 95 de qualité premium dans les stations Afriquia, Shell ou TotalEnergies)."
            },
            {
                q: "Un jeune conducteur peut-il louer le Porsche Macan ?",
                a: "Âge minimum requis : 25 ans et au moins 3 ans de permis de conduire valide."
            }
        ]
    }
];

export const DIRECT_ANSWERS_AEO = {
    title: "Louer une voiture au Maroc sans caution ni carte de crédit (2026)",
    summary: "Au Maroc, les grands courtiers internationaux (Hertz, Avis, Sixt, Europcar) imposent une carte de CRÉDIT (et refusent les cartes de débit françaises et européennes) tout en bloquant entre 1 500 € et 2 500 € de caution bancaire. ZwinCar sélectionne exclusivement des agences locales marocaines vérifiées qui acceptent les cartes de débit, autorisent un dépôt de garantie modéré en espèces (restitué immédiatement à la remise des clés) ou proposent le rachat de franchise zéro caution. La livraison s'effectue sans attente directement à l'aéroport ou à votre hébergement (Riad, Hôtel).",
    keyFacts: [
        { label: "Caution & Garantie", value: "0 € (Franchise 0) ou 300 €", detail: "Aucun blocage de 1 500 € sur carte" },
        { label: "Acompte de Réservation", value: "15% à 20% en ligne (Stripe)", detail: "Bloque définitivement le véhicule garanti" },
        { label: "Règlement du Solde", value: "Sur place (Dirhams, Euros ou CB)", detail: "Payez seulement à la prise en main" },
        { label: "Livraison Aéroport / Riad", value: "Gratuite et personnalisée", detail: "Accueil direct avec pancarte aux arrivées" },
        { label: "Assistance Multilingue", value: "WhatsApp 24/7 (FR, EN, ES, AR)", detail: "Traduction instantanée avec le loueur" },
    ],
    faqs: [
        {
            q: "Pourquoi les comptoirs d'aéroport refusent-ils souvent ma carte bancaire au Maroc ?",
            a: "La majorité des cartes bancaires délivrées en France, Espagne ou Belgique portent la mention 'DÉBIT'. Les multinationales de la location exigent contractuellement une carte portant la mention 'CRÉDIT' pour pré-autoriser 1 500 € à 2 500 €. En cas de carte de débit, elles forcent le client à souscrire une assurance complémentaire à 25€-40€/jour. Sur ZwinCar, nos loueurs locaux partenaires acceptent les cartes de débit et ne bloquent pas votre plafond bancaire."
        },
        {
            q: "Comment fonctionne la caution sur ZwinCar ?",
            a: "Aucune somme astronomique n'est bloquée sur votre compte. Selon le véhicule choisi, la caution est soit nulle (avec pack sérénité franchise 0), soit assurée par un dépôt modéré en espèces (environ 300€ à 500€ en cash ou dirhams) qui vous est restitué en main propre immédiatement lors de l'état des lieux retour à l'aéroport."
        },
        {
            q: "Le modèle de voiture réservé est-il garanti ?",
            a: "Oui. Contrairement aux centrales de réservation qui vous vendent 'une catégorie ou similaire' pour vous refiler un véhicule de remplacement fatigué, nos partenaires locaux attribuent le modèle exact sélectionné (ex : Dacia Duster Prestige ou Renault Clio 5 BVA)."
        },
        {
            q: "Comment se déroule la livraison à l'aéroport de Marrakech ou Casablanca ?",
            a: "Un agent de l'agence locale partenaire vous attend à la sortie du terminal avec une pancarte à votre nom et les clés. Vous faites le tour du véhicule ensemble en 5 minutes, signez le contrat, réglez le solde en espèces ou CB, et vous partez immédiatement sans faire la queue aux guichets."
        }
    ]
};

export function getHubMeetingPoint(hub: CityHub, locale: string = "fr"): string {
    if (locale === "fr") return hub.meetingPointDetail;
    const meetingMap: Record<string, Record<"en" | "es" | "nl", string>> = {
        marrakech: {
            en: "Terminal 1 Arrivals, main exit, Parking P2 (agent waiting with name board)",
            es: "Terminal 1 Llegadas, salida principal, Parking P2 (agente con cartel nominativo)",
            nl: "Terminal 1 Aankomst, hoofduitgang, Parking P2 (agent wacht met naambordje)",
        },
        agadir: {
            en: "Al Massira Arrivals Hall, facing drop-off area (key handover in 3 min)",
            es: "Hall de Llegadas Al Massira, frente a la zona de parada rápida (llaves en 3 min)",
            nl: "Aankomsthal Al Massira, tegenover de kiss & ride (sleuteloverdracht in 3 min)",
        },
        casablanca: {
            en: "Terminal 1 & 2 Arrivals area, meeting point facing ONCF / Official Taxis counter",
            es: "Terminal 1 y 2 zona llegadas, punto de encuentro frente al mostrador ONCF / Taxis",
            nl: "Terminal 1 & 2 Aankomstzone, ontmoetingspunt tegenover ONCF / Officiële taxi balie",
        },
        tanger: {
            en: "Ibn Battouta Departures/Arrivals parking or Tanger-Ville Port ferry pier",
            es: "Parking Salidas/Llegadas Ibn Battouta o muelle del Puerto Tanger-Ville",
            nl: "Parkeerplaats Vertrek/Aankomst Ibn Battouta of havenkade Tanger-Ville",
        },
        fes: {
            en: "Saïss Terminal Exit, designated parking for verified partner agencies",
            es: "Salida Terminal Saïss, parking reservado para agencias verificadas",
            nl: "Uitgang Saïss Terminal, gereserveerde parkeerplaats geverifieerde partners",
        },
        rabat: {
            en: "Rabat-Salé Terminal, express drop-off area",
            es: "Terminal Rabat-Salé, zona de parada exprés",
            nl: "Terminal Rabat-Salé, express drop-off zone",
        },
        ouarzazate: {
            en: "Ouarzazate OZZ main single arrivals hall",
            es: "Hall único de Llegadas Ouarzazate OZZ",
            nl: "Centrale Aankomsthal Ouarzazate OZZ",
        },
        nador: {
            en: "Al Aroui parking facing arrivals or Beni Ensar ferry pier",
            es: "Parking Al Aroui frente a llegadas o muelle ferry Beni Ensar",
            nl: "Parkeerplaats Al Aroui tegenover aankomst of ferrykade Beni Ensar",
        },
    };
    return meetingMap[hub.slug]?.[locale as "en" | "es" | "nl"] || hub.meetingPointDetail;
}

export function getLocalizedAirportName(hub: CityHub, locale: Locale = "fr"): string {
    const raw = hub.airportName.replace(/^Aéroport\s+/i, "");
    if (locale === "en") return `${raw} Airport`;
    if (locale === "es") return `Aeropuerto ${raw}`;
    if (locale === "nl") return `Luchthaven ${raw}`;
    return hub.airportName;
}
