import { VEHICLE_FLEET } from "./morocco-data.ts";
import type { CityHub, VehicleModel } from "./morocco-data.ts";
import { DEFAULT_HUB_DISTRIBUTION } from "./affiliate.ts";

type Road = keyof VehicleModel["moroccoRoadRating"];

// Part de chaque type de route dans un séjour typique depuis ce hub (somme = 1).
const HUB_TERRAIN: Record<string, Record<Road, number>> = {
    marrakech: { highway: 0.2, mountainAtlas: 0.35, medinaParking: 0.35, desertPiste: 0.1 },
    agadir: { highway: 0.4, mountainAtlas: 0.2, medinaParking: 0.2, desertPiste: 0.2 },
    casablanca: { highway: 0.5, mountainAtlas: 0.05, medinaParking: 0.4, desertPiste: 0.05 },
    tanger: { highway: 0.4, mountainAtlas: 0.2, medinaParking: 0.4, desertPiste: 0 },
    fes: { highway: 0.3, mountainAtlas: 0.3, medinaParking: 0.4, desertPiste: 0 },
    rabat: { highway: 0.5, mountainAtlas: 0.05, medinaParking: 0.45, desertPiste: 0 },
    ouarzazate: { highway: 0.2, mountainAtlas: 0.4, medinaParking: 0, desertPiste: 0.4 },
    nador: { highway: 0.5, mountainAtlas: 0.2, medinaParking: 0.3, desertPiste: 0 },
};
const DEFAULT_TERRAIN: Record<Road, number> = { highway: 0.4, mountainAtlas: 0.2, medinaParking: 0.3, desertPiste: 0.1 };

export function terrainFor(hubSlug: string): Record<Road, number> {
    return HUB_TERRAIN[hubSlug] ?? DEFAULT_TERRAIN;
}

/** Note /10 du véhicule pondérée par les routes réellement roulées depuis ce hub. */
export function cityFitScore(vehicle: VehicleModel, hubSlug: string): number {
    const w = terrainFor(hubSlug);
    const r = vehicle.moroccoRoadRating;
    const s = w.highway * r.highway + w.mountainAtlas * r.mountainAtlas + w.medinaParking * r.medinaParking + w.desertPiste * r.desertPiste;
    return Math.round(s * 10) / 10;
}

export interface CityVehicleFit {
    score: number;
    rank: number;
    total: number;
    best: VehicleModel;
    dominantRoad: Road;
    priceDeltaVsHubEur: number;
    isItineraryPick: boolean;
}

export function cityVehicleFit(vehicle: VehicleModel, hub: CityHub, fleet: VehicleModel[] = VEHICLE_FLEET): CityVehicleFit {
    const ranked = [...fleet].sort((a, b) => cityFitScore(b, hub.slug) - cityFitScore(a, hub.slug) || a.dailyPriceEur - b.dailyPriceEur);
    const w = terrainFor(hub.slug);
    const dominantRoad = (Object.keys(w) as Road[]).reduce((a, b) => (w[b] > w[a] ? b : a));
    const pick = hub.recommendedItinerary.recommendedCar.toLowerCase();
    return {
        score: cityFitScore(vehicle, hub.slug),
        rank: ranked.findIndex((v) => v.id === vehicle.id) + 1,
        total: ranked.length,
        best: ranked[0],
        dominantRoad,
        priceDeltaVsHubEur: vehicle.dailyPriceEur - hub.avgDailyPriceEur,
        // "Duster Prestige 4x4" doit matcher "Dacia Duster 4x4" : on cherche un mot significatif du modèle.
        isItineraryPick: vehicle.model.toLowerCase().split(/\s+/).some((tok) => tok.length >= 3 && /[a-z0-9]/.test(tok) && pick.includes(tok) && tok !== "4x4"),
    };
}

/** Hub sans loueur signé (100 % affiliation) : les fiches véhicule y sont des doorways, on ne les indexe pas. */
export function isCityVehicleIndexable(hubSlug: string): boolean {
    return DEFAULT_HUB_DISTRIBUTION[hubSlug] !== "affiliate";
}
