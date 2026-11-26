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
    for (const h of ["nador", "essaouira", "tetouan", "oujda", "dakhla"]) assert.equal(isCityVehicleIndexable(h), false, h);
    assert.equal(isCityVehicleIndexable("marrakech"), true);
});

test("conseils locaux traduits pour chaque hub et chaque langue", async () => {
    const { hubLocalTips } = await import("../src/lib/hub-local-i18n.ts");
    for (const h of MOROCCAN_HUBS) {
        for (const l of ["fr", "en", "es", "nl"] as const) {
            const t = hubLocalTips(h, l);
            assert.ok(t && t.parking && t.traps && t.taxi, `${h.slug}/${l} manquant`);
        }
    }
});

test("métadonnées et promesses d'accueil étanches entre direct et affiliation", async () => {
    const { getLocalizedMetadata } = await import("../src/lib/localized-page-helper.ts");
    const duster = car("dacia-duster-4x4");
    for (const h of ["nador", "essaouira", "tetouan", "oujda", "dakhla"]) {
        for (const l of ["en", "es", "nl"] as const) {
            const meta = await getLocalizedMetadata(l, h, duster.id);
            assert.ok(!meta.description?.toLowerCase().includes("riad"), `${h}/${l} promet encore le riad en affiliation`);
            assert.ok(!meta.description?.includes("Zero credit card hold"), `${h}/${l} promet encore le 0 caution en affiliation`);
        }
    }
});

test("buildAffiliateRentalUrl respecte la locale sans forcer /fr/ pour EN/ES/NL", async () => {
    const { buildAffiliateRentalUrl } = await import("../src/lib/affiliate.ts");
    const base = { hubCode: "VIL", citySlug: "dakhla", pickupDate: "2026-12-01", returnDate: "2026-12-05" };

    for (const locale of ["en", "es", "nl"] as const) {
        const dc = buildAffiliateRentalUrl({ ...base, provider: "discovercars", locale });
        const eb = buildAffiliateRentalUrl({ ...base, provider: "economybookings", locale });
        const lr = buildAffiliateRentalUrl({ ...base, provider: "localrent", locale });
        assert.ok(!dc.includes("discovercars.com/fr"), `discovercars force /fr pour ${locale}: ${dc}`);
        assert.ok(!eb.includes("economybookings.com/fr"), `economybookings force /fr pour ${locale}: ${eb}`);
        assert.ok(!decodeURIComponent(lr).includes("localrent.com/fr/"), `localrent force /fr/ pour ${locale}: ${lr}`);
    }

    assert.ok(buildAffiliateRentalUrl({ ...base, provider: "discovercars", locale: "fr" }).includes("discovercars.com/fr?"));
    assert.ok(buildAffiliateRentalUrl({ ...base, provider: "economybookings", locale: "fr" }).includes("economybookings.com/fr?"));
    assert.ok(decodeURIComponent(buildAffiliateRentalUrl({ ...base, provider: "localrent", locale: "fr" })).includes("localrent.com/fr/"));
});

test("Schema.org Product inclut validFrom, shippingDetails, hasMerchantReturnPolicy et n'invente pas d'avis", async () => {
    const { buildVehicleProductSchema } = await import("../src/lib/seo-meta.ts");
    const duster = car("dacia-duster-4x4");
    const rak = hub("marrakech");

    const withoutReviews = buildVehicleProductSchema(duster, rak, { count: 0, average: 0, latest: [] }) as any;
    assert.ok(withoutReviews.offers.validFrom, "validFrom manquant");
    assert.equal(withoutReviews.offers.shippingDetails["@type"], "OfferShippingDetails");
    assert.equal(withoutReviews.offers.hasMerchantReturnPolicy["@type"], "MerchantReturnPolicy");
    assert.equal(withoutReviews.aggregateRating, undefined, "aucun avis factice ne doit être émis à count=0");
    assert.equal(withoutReviews.review, undefined);

    const withRealReviews = buildVehicleProductSchema(duster, rak, {
        count: 1,
        average: 5,
        latest: [{ firstName: "Yassine", hubName: "Marrakech", vehicleName: duster.name, rating: 5, comment: "Top", at: "2026-11-20T10:00:00Z" }],
    }) as any;
    assert.equal(withRealReviews.aggregateRating.ratingValue, 5);
    assert.equal(withRealReviews.aggregateRating.reviewCount, 1);
    assert.equal(withRealReviews.review[0].author.name, "Yassine");
});
