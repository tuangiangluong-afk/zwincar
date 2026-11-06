/**
 * ZwinCar.com — Points de Présence Physiques Locaux (POS & Meeting Points)
 * Utilisé pour enrichir les signaux locaux SEO/GEO (Schema.org AutoRental, Google Maps & LLMs)
 */

export interface PointOfService {
    id: string;
    hubSlug: string;
    type: "airport" | "train_station" | "city_center" | "medina_gate" | "port";
    name: string;
    nameAr: string;
    address: string;
    city: string;
    postalCode: string;
    lat: number;
    lng: number;
    phone: string;
    openingHours: string; // Ex: "Mo-Su 00:00-24:00"
    meetingDetail: string;
    googleMapsSearchQuery: string;
}

export const LOCAL_POS_DIRECTORY: PointOfService[] = [
    // MARRAKECH
    {
        id: "rak-airport-p2",
        hubSlug: "marrakech",
        type: "airport",
        name: "Comptoir Accueil ZwinCar — Aéroport Marrakech-Ménara (RAK)",
        nameAr: "مطار مراكش المنارة - موقف P2",
        address: "Aéroport Marrakech Menara, Parking P2 (Face Café Paul)",
        city: "Marrakech",
        postalCode: "40000",
        lat: 31.6069,
        lng: -8.0363,
        phone: "+212 5 24 00 00 00",
        openingHours: "Mo-Su 00:00-24:00",
        meetingDetail: "Hall Arrivées Terminal 1 & 2. Agent d'accueil avec pancarte nominative ZwinCar devant le Café Paul, puis remise des clés sur le Parking P2.",
        googleMapsSearchQuery: "Aeroport Marrakech Menara RAK",
    },
    {
        id: "rak-gare-oncf",
        hubSlug: "marrakech",
        type: "train_station",
        name: "Point Relais ZwinCar — Gare Marrakech ONCF",
        nameAr: "محطة قطار مراكش جيليز",
        address: "Avenue Hassan II, Guéliz",
        city: "Marrakech",
        postalCode: "40000",
        lat: 31.6305,
        lng: -8.0177,
        phone: "+212 5 24 00 00 00",
        openingHours: "Mo-Su 07:00-23:00",
        meetingDetail: "Parvis principal de la gare ONCF, devant le café Starbucks.",
        googleMapsSearchQuery: "Gare de Marrakech Avenue Hassan II",
    },
    {
        id: "rak-bab-doukkala",
        hubSlug: "marrakech",
        type: "medina_gate",
        name: "Point Livraison Riad — Porte Bab Doukkala",
        nameAr: "باب دكالة مراكش",
        address: "Place Bab Doukkala, Entrée Médina Ouest",
        city: "Marrakech",
        postalCode: "40000",
        lat: 31.6343,
        lng: -7.9996,
        phone: "+212 6 00 00 00 00",
        openingHours: "Mo-Su 08:00-22:00",
        meetingDetail: "Devant le parking gardé de Bab Doukkala pour livraison et remise des clés de votre Riad.",
        googleMapsSearchQuery: "Bab Doukkala Marrakech",
    },

    // CASABLANCA
    {
        id: "cmn-airport-t2",
        hubSlug: "casablanca",
        type: "airport",
        name: "Comptoir Accueil ZwinCar — Aéroport Casablanca Mohammed V (CMN)",
        nameAr: "مطار محمد الخامس الدولي الدار البيضاء",
        address: "Aéroport Mohammed V, Terminal 2 Arrivées Internationales",
        city: "Casablanca / Nouaceur",
        postalCode: "20000",
        lat: 33.3675,
        lng: -7.5899,
        phone: "+212 5 22 00 00 00",
        openingHours: "Mo-Su 00:00-24:00",
        meetingDetail: "Sortie du Terminal 2, accueil personnalisé avec pancarte après le passage en douane.",
        googleMapsSearchQuery: "Aeroport Mohammed V Casablanca",
    },
    {
        id: "cmn-casa-voyageurs",
        hubSlug: "casablanca",
        type: "train_station",
        name: "Point Relais ZwinCar — Gare Casa-Voyageurs (TGV Al Boraq)",
        nameAr: "محطة الدار البيضاء المسافرين",
        address: "Boulevard Bahmad, Belvédère",
        city: "Casablanca",
        postalCode: "20300",
        lat: 33.5892,
        lng: -7.5906,
        phone: "+212 5 22 00 00 00",
        openingHours: "Mo-Su 06:00-23:00",
        meetingDetail: "Hall principal de la gare TGV Al Boraq, parvis extérieur.",
        googleMapsSearchQuery: "Gare Casa Voyageurs Casablanca",
    },

    // AGADIR
    {
        id: "aga-airport-p1",
        hubSlug: "agadir",
        type: "airport",
        name: "Comptoir Accueil ZwinCar — Aéroport Agadir Al Massira (AGA)",
        nameAr: "مطار أكادير المسيرة",
        address: "Aéroport Al Massira, Parking Principal P1",
        city: "Agadir / Temsia",
        postalCode: "80000",
        lat: 30.325,
        lng: -9.4131,
        phone: "+212 5 28 00 00 00",
        openingHours: "Mo-Su 00:00-24:00",
        meetingDetail: "Hall Arrivées, agent ZwinCar avec pancarte à la sortie des bagages.",
        googleMapsSearchQuery: "Aeroport Agadir Al Massira",
    },
    {
        id: "aga-marina",
        hubSlug: "agadir",
        type: "city_center",
        name: "Point Relais ZwinCar — Marina d'Agadir & Hôtels",
        nameAr: "مارينا أكادير",
        address: "Boulevard 20 Août, Marina d'Agadir",
        city: "Agadir",
        postalCode: "80000",
        lat: 30.4278,
        lng: -9.6105,
        phone: "+212 6 00 00 00 00",
        openingHours: "Mo-Su 08:00-21:00",
        meetingDetail: "Livraison directe à votre hôtel ou devant l'entrée de la Marina.",
        googleMapsSearchQuery: "Marina d'Agadir",
    },

    // TANGER
    {
        id: "tng-airport",
        hubSlug: "tanger",
        type: "airport",
        name: "Comptoir Accueil ZwinCar — Aéroport Tanger Ibn Battouta (TNG)",
        nameAr: "مطار طنجة ابن بطوطة",
        address: "Aéroport Ibn Battouta, Hall Public Arrivées",
        city: "Tanger",
        postalCode: "90000",
        lat: 35.7269,
        lng: -5.9169,
        phone: "+212 5 39 00 00 00",
        openingHours: "Mo-Su 00:00-24:00",
        meetingDetail: "Sortie immédiate des vols, prise en main en 5 minutes sur le parking.",
        googleMapsSearchQuery: "Aeroport Tanger Ibn Battouta",
    },
    {
        id: "tng-gare-tgv",
        hubSlug: "tanger",
        type: "train_station",
        name: "Point Relais ZwinCar — Gare Tanger Ville TGV",
        nameAr: "محطة قطار طنجة المدينة",
        address: "Place de la Gare, Tanger Ville",
        city: "Tanger",
        postalCode: "90000",
        lat: 35.7725,
        lng: -5.7925,
        phone: "+212 5 39 00 00 00",
        openingHours: "Mo-Su 07:00-23:00",
        meetingDetail: "Face à la station TGV Al Boraq, parvis maritime.",
        googleMapsSearchQuery: "Gare Tanger Ville TGV",
    },
    {
        id: "tng-port-med",
        hubSlug: "tanger",
        type: "port",
        name: "Point Relais ZwinCar — Port Tanger Med (Ferry)",
        nameAr: "ميناء طنجة المتوسط",
        address: "Zone Portuaire Passagers, Tanger Med",
        city: "Ksar El Majaz / Tanger Med",
        postalCode: "94000",
        lat: 35.8894,
        lng: -5.5033,
        phone: "+212 6 00 00 00 00",
        openingHours: "Mo-Su 00:00-24:00",
        meetingDetail: "Gare Maritime Passagers, accueil à la descente du ferry d'Algésiras.",
        googleMapsSearchQuery: "Tanger Med Port Passagers",
    },

    // FÈS
    {
        id: "fez-airport",
        hubSlug: "fes",
        type: "airport",
        name: "Comptoir Accueil ZwinCar — Aéroport Fès-Saïss (FEZ)",
        nameAr: "مطار فاس سايس",
        address: "Aéroport Fès Saïss, Terminal Arrivées",
        city: "Fès",
        postalCode: "30000",
        lat: 33.9272,
        lng: -4.978,
        phone: "+212 5 35 00 00 00",
        openingHours: "Mo-Su 00:00-24:00",
        meetingDetail: "Hall des arrivées, agent ZwinCar avec pancarte.",
        googleMapsSearchQuery: "Aeroport Fes Saiss",
    },

    // RABAT
    {
        id: "rba-airport",
        hubSlug: "rabat",
        type: "airport",
        name: "Comptoir Accueil ZwinCar — Aéroport Rabat-Salé (RBA)",
        nameAr: "مطار الرباط سلا الدولي",
        address: "Aéroport Rabat Salé, Hall Arrivées",
        city: "Rabat / Salé",
        postalCode: "10000",
        lat: 34.0514,
        lng: -6.7514,
        phone: "+212 5 37 00 00 00",
        openingHours: "Mo-Su 00:00-24:00",
        meetingDetail: "Sortie immédiate des vols, livraison clés en main sur le parking.",
        googleMapsSearchQuery: "Aeroport Rabat Sale RBA",
    },

    // OUARZAZATE
    {
        id: "ozz-airport",
        hubSlug: "ouarzazate",
        type: "airport",
        name: "Comptoir Accueil ZwinCar — Aéroport Ouarzazate (OZZ)",
        nameAr: "مطار ورزازات الدولي",
        address: "Aéroport Ouarzazate, Boulevard Mohammed V",
        city: "Ouarzazate",
        postalCode: "45000",
        lat: 30.9392,
        lng: -6.9094,
        phone: "+212 5 24 00 00 00",
        openingHours: "Mo-Su 07:00-22:00",
        meetingDetail: "Remise des 4x4 et SUV sur le parking de l'aéroport ou devant la Kasbah de Taourirt.",
        googleMapsSearchQuery: "Aeroport Ouarzazate OZZ",
    },

    // ESSAOUIRA
    {
        id: "esu-airport",
        hubSlug: "essaouira",
        type: "airport",
        name: "Comptoir Accueil ZwinCar — Aéroport Essaouira Mogador (ESU)",
        nameAr: "مطار الصويرة موكادور",
        address: "Aéroport Essaouira Mogador, R214",
        city: "Essaouira",
        postalCode: "44000",
        lat: 31.3975,
        lng: -9.6817,
        phone: "+212 5 24 00 00 00",
        openingHours: "Mo-Su 08:00-22:00",
        meetingDetail: "Accueil à la sortie du terminal ou livraison à Bab Marrakech devant la médina.",
        googleMapsSearchQuery: "Aeroport Essaouira Mogador ESU",
    },
];

export function getPosForHub(hubSlug: string): PointOfService[] {
    return LOCAL_POS_DIRECTORY.filter((pos) => pos.hubSlug === hubSlug);
}

/**
 * Optionnel : Enrichissement dynamique via Serper API (si configurée dans .env.local)
 * Permet de récupérer les avis Google Maps récents d'un POS sans fuite de clé
 */
export async function fetchSerperPlaceDetails(query: string) {
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) return null;

    try {
        const res = await fetch("https://google.serper.dev/places", {
            method: "POST",
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ q: `${query} Morocco`, gl: "ma", hl: "fr" }),
            next: { revalidate: 86400 }, // Cache 24h
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data?.places?.[0] || null;
    } catch {
        return null;
    }
}
