/**
 * ZwinCar.com — Système de Distribution Hybride & Fallback Affiliation
 * Gère la bascule entre Flotte Directe ZwinCar (Stripe/WhatsApp) et Fallback Affiliation (Travelpayouts: DiscoverCars / Localrent).
 */

export type DistributionMode = "direct" | "hybrid" | "affiliate";

export interface HubDistributionSetting {
    slug: string;
    name: string;
    airportCode: string;
    mode: DistributionMode;
    note: string;
}

export interface AffiliateProvider {
    id: "discovercars" | "localrent" | "economybookings";
    name: string;
    commissionRate: string;
    payoutModel: string;
    description: string;
}

export const AFFILIATE_PROVIDERS: AffiliateProvider[] = [
    {
        id: "discovercars",
        name: "DiscoverCars (Travelpayouts)",
        commissionRate: "57% à 70% de la marge courtier",
        payoutModel: "25 € à 55 € par réservation",
        description: "Leader mondial de la conversion aéroport. Deep-link direct par code IATA avec dates pré-remplies.",
    },
    {
        id: "localrent",
        name: "Localrent",
        commissionRate: "50% à 60% de commission",
        payoutModel: "20 € à 40 € par réservation",
        description: "Agrégateur d'agences locales indépendantes. Faibles cautions et paiement sur place (conforme à l'ADN ZwinCar).",
    },
    {
        id: "economybookings",
        name: "EconomyBookings",
        commissionRate: "60% de commission",
        payoutModel: "18 € à 35 € par réservation",
        description: "Idéal pour couvrir les aéroports secondaires sans agence locale (Oujda, Nador, Dakhla).",
    },
];

// Configuration par défaut de la distribution par ville au Maroc
export const DEFAULT_HUB_DISTRIBUTION: Record<string, DistributionMode> = {
    marrakech: "hybrid", // Fort stock local, mais complet l'été
    agadir: "hybrid", // Très demandé par surfeurs et vacanciers
    casablanca: "hybrid", // Mix business et diaspora
    tanger: "hybrid", // Hub Nord et ferry
    fes: "direct", // Agences locales prioritaires
    rabat: "direct", // Capitale administrative
    ouarzazate: "direct", // Spécialiste 4x4 grand sud
    nador: "affiliate", // Pas encore de loueur signé -> 100% Affiliation
};

// Stock local par modèle (permet de déclarer un modèle en rupture en haute saison)
export const DEFAULT_VEHICLE_STOCK: Record<string, boolean> = {
    "dacia-sandero-stepway": true,
    "renault-clio-5-auto": true,
    "dacia-duster-4x4": true,
    "hyundai-tucson-auto": true,
    "peugeot-208-puretech": true,
    "toyota-prado-tx-7places": true,
};

/**
 * Génère le Deep-Link affilié pré-rempli pour Travelpayouts / DiscoverCars / Localrent
 */
export function buildAffiliateRentalUrl({
    provider = "discovercars",
    hubCode,
    citySlug,
    pickupDate,
    returnDate,
    pickupTime = "11:00",
    returnTime = "11:00",
    marker = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER || "596733",
}: {
    provider?: "discovercars" | "localrent" | "economybookings";
    hubCode: string;
    citySlug: string;
    pickupDate: string;
    returnDate: string;
    pickupTime?: string;
    returnTime?: string;
    marker?: string;
}): string {
    const cleanMarker = marker || "zwincar";

    if (provider === "localrent") {
        // Deep-link Localrent via Travelpayouts ou direct
        const targetUrl = `https://localrent.com/fr/morocco/${citySlug}/?date_from=${pickupDate}&date_to=${returnDate}`;
        // Priorité Travelpayouts si configuré (permet de centraliser les revenus sur un seul compte)
        if (process.env.NEXT_PUBLIC_LOCALRENT_TPX_URL) {
            return process.env.NEXT_PUBLIC_LOCALRENT_TPX_URL;
        }
        // Deep link Travelpayouts avec campagne 87 et marker utilisateur
        const tpxMarker = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER || "801682";
        const tpxTrs = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_TRS || "596733";
        return `https://tp.media/r?campaign_id=87&marker=${tpxMarker}&p=2043&trs=${tpxTrs}&u=${encodeURIComponent(targetUrl)}`;
    }

    if (provider === "economybookings") {
        return `https://www.economybookings.com/fr?pick_up_airport=${hubCode}&pick_up_date=${pickupDate}&drop_off_date=${returnDate}&marker=${cleanMarker}`;
    }

    // Default: DiscoverCars Travelpayouts Deep Link avec IATA et dates
    // Exemple d'URL trackée DiscoverCars:
    return `https://www.discovercars.com/?iata=${hubCode}&pick_date=${pickupDate}&pick_time=${pickupTime}&drop_date=${returnDate}&drop_time=${returnTime}&a_aid=${cleanMarker}&data1=zwincar_fallback`;
}

/**
 * Génère le lien affilié pour l'eSIM Maroc (Airalo via Travelpayouts / MobiMatter)
 */
export function buildAffiliateEsimUrl(partner: "airalo" | "mobimatter" = "airalo"): string {
    if (partner === "mobimatter") {
        const mobiRef = process.env.NEXT_PUBLIC_MOBIMATTER_AFFILIATE_CODE || "ZWINCAR";
        return `https://mobimatter.com/travel-esim/morocco?affiliate=${mobiRef}`;
    }

    // Priorité lien court Travelpayouts Airalo
    if (process.env.NEXT_PUBLIC_AIRALO_TPX_URL) {
        return process.env.NEXT_PUBLIC_AIRALO_TPX_URL;
    }
    // Deep-link Travelpayouts Airalo Maroc (Campagne 541)
    const tpxMarker = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER || "801682";
    const tpxTrs = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_TRS || "596733";
    const airaloMoroccoUrl = "https://www.airalo.com/morocco-esim";
    return `https://tp.media/r?campaign_id=541&marker=${tpxMarker}&p=8310&trs=${tpxTrs}&u=${encodeURIComponent(airaloMoroccoUrl)}`;
}
