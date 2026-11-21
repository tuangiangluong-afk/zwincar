import test from "node:test";
import assert from "node:assert/strict";

import { MOROCCAN_HUBS, VEHICLE_FLEET } from "../src/lib/morocco-data.ts";
import { cityVehicleFit, isCityVehicleIndexable } from "../src/lib/city-vehicle-fit.ts";

const hub = (slug: string) => MOROCCAN_HUBS.find((h) => h.slug === slug)!;
const car = (id: string) => VEHICLE_FLEET.find((v) => v.id === id)!;

test("le classement terrain change selon la ville", () => {
    const duster = car("dacia-duster-4x4");
    const ranks = MOROCCAN_HUBS.map((h) => cityVehicleFit(duster, h).rank);
    assert.ok(new Set(ranks).size > 1, "même rang partout = bloc pas différenciant");
    assert.ok(cityVehicleFit(duster, hub("ouarzazate")).rank <= cityVehicleFit(duster, hub("casablanca")).rank);
});

test("rang cohérent et meilleur véhicule classé premier", () => {
    for (const h of MOROCCAN_HUBS) {
        const f = cityVehicleFit(VEHICLE_FLEET[0], h);
        assert.ok(f.rank >= 1 && f.rank <= f.total);
        assert.equal(cityVehicleFit(f.best, h).rank, 1);
    }
});

test("itinéraire recommandé détecté malgré un nom de modèle différent", () => {
    assert.equal(cityVehicleFit(car("dacia-duster-4x4"), hub("ouarzazate")).isItineraryPick, true);
    assert.equal(cityVehicleFit(car("toyota-prado-tx-7places"), hub("ouarzazate")).isItineraryPick, true);
    assert.equal(cityVehicleFit(car("fiat-500-cabriolet"), hub("ouarzazate")).isItineraryPick, false);
});

test("hub 100 % affiliation non indexé", () => {
    assert.equal(isCityVehicleIndexable("nador"), false);
    assert.equal(isCityVehicleIndexable("marrakech"), true);
});
