import { MOROCCAN_HUBS, VEHICLE_FLEET } from "./morocco-data.ts";
import type { VehicleModel } from "./morocco-data.ts";
import { SEASONS, longStayDiscount } from "./booking-engine.ts";

/**
 * Index des tarifs ZwinCar calculé depuis les données du catalogue et le moteur de prix :
 * mêmes règles que le devis réel, donc chiffres publiables et citables tels quels.
 */

export interface CategoryPrice {
    category: VehicleModel["category"];
    categoryEn: VehicleModel["categoryEn"];
    fromEur: number;
    cheapest: string;
    models: number;
}

export function pricesByCategory(fleet: VehicleModel[] = VEHICLE_FLEET): CategoryPrice[] {
    const groups = new Map<string, VehicleModel[]>();
    for (const v of fleet) groups.set(v.category, [...(groups.get(v.category) ?? []), v]);
    return [...groups.values()]
        .map((vs) => {
            const cheapest = vs.reduce((a, b) => (b.dailyPriceEur < a.dailyPriceEur ? b : a));
            return { category: cheapest.category, categoryEn: cheapest.categoryEn, fromEur: cheapest.dailyPriceEur, cheapest: cheapest.name, models: vs.length };
        })
        .sort((a, b) => a.fromEur - b.fromEur);
}

/** Prix/jour du véhicule le moins cher selon la saison, arrondi comme le moteur. */
export function seasonalFrom(fleet: VehicleModel[] = VEHICLE_FLEET) {
    const base = Math.min(...fleet.map((v) => v.dailyPriceEur));
    return [{ months: [] as number[], multiplier: 1 }, ...SEASONS]
        .map((s) => ({ months: s.months, multiplier: s.multiplier, fromEur: Math.round(base * s.multiplier) }))
        .sort((a, b) => a.fromEur - b.fromEur);
}

/** Exemple concret : semaine (7 j) en saison standard avec la remise longue durée réelle. */
export function weekExample(fleet: VehicleModel[] = VEHICLE_FLEET) {
    const v = fleet.reduce((a, b) => (b.dailyPriceEur < a.dailyPriceEur ? b : a));
    const days = 7;
    const daily = Math.round(v.dailyPriceEur * (1 - longStayDiscount(days)));
    return { vehicle: v.name, days, dailyEur: daily, totalEur: daily * days };
}

export function hubPrices() {
    return MOROCCAN_HUBS.map((h) => ({ slug: h.slug, name: h.name, airportCode: h.airportCode, avgDailyEur: h.avgDailyPriceEur })).sort(
        (a, b) => a.avgDailyEur - b.avgDailyEur
    );
}
