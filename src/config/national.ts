import { CityConfig } from "@/lib/db";

export const NATIONAL_CONFIG: CityConfig = {
    slug: "home",
    domain: "taxifrance.fr",
    name: "Taxi de France",
    city: "Paris", // Default center for logic/SEO
    phoneNumber: "09 72 50 12 50",
    email: "contact@taxifrance.fr",
    heroImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2940&auto=format&fit=crop",
    description: "Le 1er réseau de chauffeurs de taxi indépendants et VTC en France. Réservation directe sans commission. Gares, Aéroports et Médical.",
    meta: {
        title: "Taxi de France | Réseau National de Chauffeurs Indépendants",
        description: "Réservez votre taxi partout en France. Chauffeurs locaux, tarifs réglementés et service de qualité. Gare, Aéroport et Transport Médical."
    },
    features: [
        "Réseau National Indépendant",
        "Zéro Commission",
        "Chauffeurs Locaux",
        "Transport Médical Agréé"
    ],
    pricing: {
        base: "Prix Fixe",
        description: "Tarifs réglementés ou forfaits convenus à l'avance"
    },
    hospitals: [], // Not relevant for national hub
    stations: [],
    neighborhoods: [],
    points_of_interest: {
        hotels: ["Hôtel Ritz Paris", "Negresco Nice", "InterContinental Lyon"],
        nightlife: ["Moulin Rouge", "Opéra Garnier", "Disneyland Paris", "Stade de France"],
        monuments: ["Tour Eiffel", "Château de Versailles", "Mont Saint-Michel", "Notre-Dame de la Garde"],
        parking_difficulty: "Variable"
    }
};
