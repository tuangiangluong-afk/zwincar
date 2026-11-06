import type { CityConfig } from "@/lib/db";

// ----------------------------------------------------------------------------
// INFORMATION GAIN — vraies données par ville, calculées depuis les coordonnées
// GPS réelles de chaque ville (db.ts). Chaque chiffre est unique par ville :
// distance, durée et prix estimés vers les grands hubs.
// ----------------------------------------------------------------------------

export interface TravelEstimate {
    destination: string;
    slug: string;
    distanceKm: number;
    durationMin: number;
    priceLow: number;
    priceHigh: number;
    priceDisplay: string;
}

export interface DirectAnswer {
    question: string;
    answer: string;
}

// Destinations majeures (coordonnées réelles)
const HUBS: { slug: string; name: string; lat: number; lng: number; avgSpeedKmh: number }[] = [
    { slug: "aeroport-orly", name: "Aéroport d'Orly (ORY)", lat: 48.7262, lng: 2.3652, avgSpeedKmh: 50 },
    { slug: "aeroport-roissy-cdg", name: "Aéroport Roissy CDG", lat: 49.0097, lng: 2.5479, avgSpeedKmh: 55 },
    { slug: "paris-centre", name: "Paris Centre", lat: 48.8566, lng: 2.3522, avgSpeedKmh: 35 },
    { slug: "la-defense", name: "La Défense", lat: 48.8925, lng: 2.2350, avgSpeedKmh: 40 },
];

// Tarification taxi (formule arrêté préfectoral, idem distance.ts)
const PRICING = {
    BASE_FARE: 4,
    PRICE_PER_KM_DAY: 1.15,
    MARGIN_PERCENT: 0.15,
    MINIMUM_FARE: 7.3,
    // Surtaxe voirie (distance parcourue en ville) et coefficient routier
    ROAD_FACTOR: 1.25, // la distance routière est ~25% supérieure à vol d'oiseau
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function getTravelEstimates(city: CityConfig): TravelEstimate[] {
    if (!city.latitude || !city.longitude) return [];

    return HUBS.map((hub) => {
        const straightKm = haversineKm(city.latitude!, city.longitude!, hub.lat, hub.lng);
        const roadKm = straightKm * PRICING.ROAD_FACTOR;

        // Durée estimée (route + trafic + ville)
        const baseMinutes = (roadKm / hub.avgSpeedKmh) * 60;
        const durationMin = Math.max(12, Math.round(baseMinutes));

        // Prix taxi (formule jour)
        const rawPrice = PRICING.BASE_FARE + roadKm * PRICING.PRICE_PER_KM_DAY;
        const estimatedPrice = Math.max(
            Math.round(rawPrice * (1 + PRICING.MARGIN_PERCENT)),
            PRICING.MINIMUM_FARE
        );
        const priceLow = Math.round(estimatedPrice * 0.9);
        const priceHigh = Math.round(estimatedPrice * 1.2);

        return {
            destination: hub.name,
            slug: hub.slug,
            distanceKm: Math.round(roadKm),
            durationMin,
            priceLow,
            priceHigh,
            priceDisplay: `${priceLow}€ - ${priceHigh}€`,
        };
    });
}

/**
 * Réponses directes (format "réponse directe" AEO) — avec de vrais chiffres
 * calculés par ville. C'est le format que Google affiche en extrait et que
 * les IA citent mot pour mot.
 */
export function getDirectAnswers(city: CityConfig): DirectAnswer[] {
    const estimates = getTravelEstimates(city);
    const orly = estimates.find((e) => e.slug === "aeroport-orly");
    const cdg = estimates.find((e) => e.slug === "aeroport-roissy-cdg");
    const paris = estimates.find((e) => e.slug === "paris-centre");

    const answers: DirectAnswer[] = [];

    if (orly) {
        answers.push({
            question: `Combien coûte un taxi de ${city.city} à Orly ?`,
            answer: `Un taxi de ${city.city} à l'aéroport d'Orly coûte environ ${orly.priceDisplay} pour ${orly.distanceKm} km, soit environ ${orly.durationMin} minutes de trajet. Ce tarif est donné à titre indicatif ; le forfait fixe est confirmé à la réservation.`,
        });
    }
    if (cdg) {
        answers.push({
            question: `Combien coûte un taxi de ${city.city} à Roissy CDG ?`,
            answer: `Un taxi de ${city.city} à l'aéroport Roissy Charles de Gaulle coûte environ ${cdg.priceDisplay} pour ${cdg.distanceKm} km, soit environ ${cdg.durationMin} minutes de trajet selon le trafic.`,
        });
    }
    if (paris) {
        answers.push({
            question: `Quelle distance entre ${city.city} et Paris ?`,
            answer: `La distance routière entre ${city.city} et Paris Centre est d'environ ${paris.distanceKm} km, soit ${paris.durationMin} minutes en taxi selon l'heure de la journée.`,
        });
    }

    answers.push({
        question: `Comment réserver un taxi à ${city.city} ?`,
        answer: `Pour réserver un taxi à ${city.city}, appelez le ${city.phoneNumber} ou utilisez le formulaire en ligne : vous recevez une confirmation et un chauffeur est attribué en quelques minutes, 24h/24 et 7j/7.`,
    });

    answers.push({
        question: `Le taxi est-il moins cher que le bus ou le train à ${city.city} ?`,
        answer: `Pour un trajet depuis ${city.city} vers un aéroport ou une gare, le taxi est plus cher que le transport en commun mais il est direct, porte à porte, disponible à toute heure et permet de transporter bagages et groupes. Pour les trajets avant 7h ou après 23h, le taxi est souvent la seule option fiable.`,
    });

    return answers;
}

/**
 * Résumé exécutif — un paragraphe autonome que les IA peuvent citer tel quel.
 */
export function getExecutiveSummary(city: CityConfig): string {
    const estimates = getTravelEstimates(city);
    const top = estimates[0];
    const cdg = estimates.find((e) => e.slug === "aeroport-roissy-cdg");

    let summary = `${city.name} propose un service de taxi professionnel disponible 24h/24 et 7j/7 à ${city.city}${city.department ? ` (${city.department})` : ""}. Chauffeurs locaux, prix réglementés, paiement CB accepté.`;
    if (top) {
        summary += ` Les trajets vers les principaux hubs partent d'environ ${top.priceLow}€ (${top.distanceKm} km).`;
    }
    if (cdg) {
        summary += ` Vers Roissy CDG, comptez environ ${cdg.durationMin} minutes de route.`;
    }
    return summary;
}
