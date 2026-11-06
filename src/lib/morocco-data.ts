/**
 * ZwinCar.com — Données Réseau Maroc, Aéroports, Flotte Réelle, Upsells & Split Comptable
 * Conforme aux pratiques locales marocaines (Dirhams, cash, zéro empreinte CB bloquante).
 */

import type { Locale } from "./i18n";

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
        name: "eSIM Maroc 20 Go 5G (Airalo)",
        nameEn: "Morocco 5G eSIM (20 GB Airalo)",
        tagline: "Connexion 5G immédiate dès l'atterrissage à l'aéroport",
        taglineEn: "Instant 5G data connection upon landing at the airport",
        description: "Activation immédiate par QR code sur réseau IAM / Orange. Évite la queue aux stands de l'aéroport.",
        descriptionEn: "Instant QR code activation on IAM / Orange. Skip terminal queues.",
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
        avgDailyPriceEur: 24,
        description: "Livraison directe dès la sortie du terminal Menara ou à la porte de votre Riad. Aucun blocage de carte de crédit.",
        heroImage: "/images/hubs/marrakech.webp",
        lat: 31.6295,
        lng: -7.9811,
        localDelivery: "Gratuite à l'aéroport Menara et aux Riads de la Médina",
        meetingPointDetail: "Terminal 1 Arrivées, sortie principale, Parking P2 (l'agent vous attend avec pancarte nominative)",
        airportDistanceKm: 5,
        airportTransitMinutes: 15,
        taxiComparisonText: "Un taxi aéroport vers Guéliz ou la Médina est négocié entre 100 et 150 MAD le jour (200 MAD de nuit). Avec deux trajets par jour, louer chez ZwinCar dès 240 MAD/j est amorti immédiatement avec la liberté totale de visiter Agafay ou l'Ourika.",
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
        avgDailyPriceEur: 22,
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
        dailyPriceEur: 23,
        dailyPriceMad: 250,
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
        dailyPriceEur: 32,
        dailyPriceMad: 350,
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
        dailyPriceEur: 45,
        dailyPriceMad: 490,
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
        dailyPriceEur: 62,
        dailyPriceMad: 680,
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
        dailyPriceEur: 25,
        dailyPriceMad: 270,
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
        dailyPriceEur: 110,
        dailyPriceMad: 1200,
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
