import test from "node:test";
import assert from "node:assert/strict";

import { VEHICLE_FLEET } from "../src/lib/morocco-data.ts";
import { SEASONS } from "../src/lib/booking-engine.ts";
import { pricesByCategory, seasonalFrom, weekExample } from "../src/lib/price-index.ts";

test("index des prix : cohérent avec le catalogue et le moteur", () => {
    const cats = pricesByCategory();
    const min = Math.min(...VEHICLE_FLEET.map((v) => v.dailyPriceEur));
    assert.equal(cats[0].fromEur, min);
    assert.equal(cats.reduce((n, c) => n + c.models, 0), VEHICLE_FLEET.length);

    const seasons = seasonalFrom();
    assert.equal(seasons.length, SEASONS.length + 1);
    assert.ok(seasons.some((s) => s.multiplier === 1 && s.fromEur === min));
    assert.ok(seasons.every((s, i) => i === 0 || s.fromEur >= seasons[i - 1].fromEur));

    const w = weekExample();
    assert.equal(w.totalEur, w.dailyEur * 7);
    assert.equal(w.dailyEur, Math.round(min * 0.9));
});
