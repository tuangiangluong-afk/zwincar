import test from "node:test";
import assert from "node:assert/strict";
import {
    quoteBooking,
    rentalDays,
    cancellationPolicy,
    modificationPolicy,
    checkoutSettlement,
    type BookingRecord,
} from "../src/lib/booking-engine.ts";
import { getBookingStore, __resetBookingStoreForTests, VersionConflictError } from "../src/lib/booking-store.ts";
import {
    getVendorHubBookings,
} from "../src/lib/vendor-store.ts";
import { checkRateLimit, resetRateLimits } from "../src/lib/rate-limit.ts";
import { findVehicle, toVehicleRate } from "../src/lib/fleet.ts";

function createMockBooking(ref: string, pickupHub: string, returnHub: string, pickupDate: string, returnDate: string): BookingRecord {
    const duster = findVehicle("dacia-duster-4x4")!;
    const rate = toVehicleRate(duster);
    const quote = quoteBooking({
        vehicle: rate,
        pickupHub,
        returnHub,
        pickupDate,
        pickupTime: "10:00",
        returnDate,
        returnTime: "10:00",
        driverAge: 30,
    });

    const now = new Date().toISOString();
    return {
        ref,
        version: 1,
        status: "confirmed",
        locale: "fr",
        createdAt: now,
        updatedAt: now,
        accessToken: `tok_test_${ref.toLowerCase()}_abcdef0123456789`,
        client: { fullName: `Client ${ref}`, email: `${ref.toLowerCase()}@test.ma`, phone: "+212600000000" },
        rental: {
            vehicleId: duster.id,
            vehicleName: duster.name,
            transmission: duster.transmission,
            hubName: pickupHub,
            pickupHub,
            returnHub,
            pickupDate,
            pickupTime: "10:00",
            returnDate,
            returnTime: "10:00",
            days: quote.days,
        },
        quote,
        paidEur: quote.acompteEur,
        events: [],
        lifecycleSent: [],
    };
}

test("CLIENT ENGINE: Durées extrêmes et calculs de jours", () => {
    // Exactement 24h = 1 jour
    assert.equal(rentalDays("2026-05-01", "10:00", "2026-05-02", "10:00"), 1);
    // 24h + 1 minute = 2 jours (toute tranche commencée est due)
    assert.equal(rentalDays("2026-05-01", "10:00", "2026-05-02", "10:01"), 2);
    // Location longue durée 30 jours
    assert.equal(rentalDays("2026-05-01", "10:00", "2026-05-31", "10:00"), 30);
    // Passage d'année (31 déc au 2 jan)
    assert.equal(rentalDays("2026-12-31", "18:00", "2027-01-02", "18:00"), 2);
});

test("CLIENT ENGINE: Cross-hub fee et jeune conducteur", () => {
    const duster = findVehicle("dacia-duster-4x4")!;
    const rate = toVehicleRate(duster);

    // Même hub (Marrakech -> Marrakech), conducteur 30 ans
    const q1 = quoteBooking({
        vehicle: rate,
        pickupHub: "marrakech",
        returnHub: "marrakech",
        pickupDate: "2026-06-01",
        pickupTime: "10:00",
        returnDate: "2026-06-04",
        returnTime: "10:00",
        driverAge: 30,
    });
    const feeYoung1 = q1.lines.find((l) => l.label.toLowerCase().includes("jeune conducteur"));
    const feeCross1 = q1.lines.find((l) => l.label.toLowerCase().includes("restitution"));
    assert.equal(feeYoung1, undefined);
    assert.equal(feeCross1, undefined);

    // Cross-hub (Marrakech -> Casablanca), conducteur 22 ans (<25 ans)
    const q2 = quoteBooking({
        vehicle: rate,
        pickupHub: "marrakech",
        returnHub: "casablanca",
        pickupDate: "2026-06-01",
        pickupTime: "10:00",
        returnDate: "2026-06-04",
        returnTime: "10:00",
        driverAge: 22,
    });
    const feeYoung2 = q2.lines.find((l) => l.label.toLowerCase().includes("jeune conducteur"));
    const feeCross2 = q2.lines.find((l) => l.label.toLowerCase().includes("restitution"));
    assert.ok(feeYoung2);
    assert.equal(feeYoung2.amountEur, 8 * 3); // 8 €/jour * 3 jours = 24 €
    assert.ok(feeCross2);
    assert.equal(feeCross2.amountEur, 25); // Forfait 25 € restitution autre ville
});

test("CLIENT ENGINE: Annulation aux frontières temporelles", () => {
    const baseRecord = createMockBooking("ZW-CANCEL1", "marrakech", "marrakech", "2026-06-10", "2026-06-15");

    // 1. Annulation à 50h avant (gratuit, 100% remboursé)
    const p1 = cancellationPolicy(baseRecord, new Date("2026-06-08T08:00:00Z"));
    assert.equal(p1.tier, "free");
    assert.equal(p1.refundEur, baseRecord.quote.acompteEur);

    // 2. Annulation à 36h avant (palier 24h-48h: 50% remboursé)
    const p2 = cancellationPolicy(baseRecord, new Date("2026-06-08T22:00:00Z"));
    assert.equal(p2.tier, "partial");
    assert.equal(p2.refundEur, Math.round(baseRecord.quote.acompteEur * 0.5));
    assert.equal(p2.retainedEur, baseRecord.quote.acompteEur - p2.refundEur);

    // 3. Annulation à 12h avant (< 24h: pas de remboursement)
    const p3 = cancellationPolicy(baseRecord, new Date("2026-06-09T22:00:00Z"));
    assert.equal(p3.tier, "late");
    assert.equal(p3.refundEur, 0);

    // 4. Annulation après l'heure de départ (no_show : l'acompte est conservé à 100%)
    const p4 = cancellationPolicy(baseRecord, new Date("2026-06-10T14:00:00Z"));
    assert.equal(p4.tier, "no_show");
    assert.equal(p4.refundEur, 0);
    assert.equal(p4.retainedEur, baseRecord.quote.acompteEur);
});

test("CLIENT ENGINE: Modifications de dates et frais de dernière minute", () => {
    const clio = findVehicle("renault-clio-5-auto")!;
    const rate = toVehicleRate(clio);
    const record = createMockBooking("ZW-MODIF1", "marrakech", "marrakech", "2026-07-10", "2026-07-13");

    // Modification 15 jours avant : aucun frais de dossier
    const resFar = modificationPolicy(
        record,
        {
            pickupDate: "2026-07-10",
            pickupTime: "10:00",
            returnDate: "2026-07-15", // Prolongation de 2 jours (5 jours au total)
            returnTime: "10:00",
            upsells: [],
        },
        rate,
        "marrakech",
        new Date("2026-06-25T10:00:00Z")
    );
    assert.equal(resFar.allowed, true);
    assert.equal(resFar.adminFeeEur, 0);
    assert.ok(resFar.amountToPayNowEur > 0);

    // Modification < 48h avant le départ : frais de dossier de 25 € appliqués
    const resLate = modificationPolicy(
        record,
        {
            pickupDate: "2026-07-11",
            pickupTime: "10:00",
            returnDate: "2026-07-14",
            returnTime: "10:00",
            upsells: [],
        },
        rate,
        "marrakech",
        new Date("2026-07-09T08:00:00Z") // 26h avant le départ
    );
    assert.equal(resLate.allowed, true);
    assert.equal(resLate.adminFeeEur, 25);
    assert.equal(resLate.amountToPayNowEur, 25);
});

test("STORE CONCURRENCY: Détection stricte des collisions de version (Optimistic Lock)", async () => {
    __resetBookingStoreForTests();
    const store = getBookingStore();

    const record = createMockBooking("ZW-LOCK1", "marrakech", "marrakech", "2026-08-01", "2026-08-05");
    await store.create(record);

    // 1ère mise à jour réussie (version 1 -> 2)
    const update1 = { ...record, paidEur: 50 };
    const saved1 = await store.save(update1, 1);
    assert.equal(saved1.version, 2);

    // 2ème mise à jour concurrente avec l'ancienne version 1 : DOIT ÉCHOUER
    await assert.rejects(
        async () => {
            await store.save({ ...record, paidEur: 60 }, 1);
        },
        (err: unknown) => err instanceof VersionConflictError
    );
});

test("RATE LIMITER: Protection IP anti-spam", () => {
    resetRateLimits();
    const ip = "192.168.1.100";

    // Limite de 3 requêtes en 10 secondes
    const r1 = checkRateLimit(`test:${ip}`, 3, 10_000);
    assert.equal(r1.allowed, true);
    assert.equal(r1.remaining, 2);

    const r2 = checkRateLimit(`test:${ip}`, 3, 10_000);
    assert.equal(r2.allowed, true);
    assert.equal(r2.remaining, 1);

    const r3 = checkRateLimit(`test:${ip}`, 3, 10_000);
    assert.equal(r3.allowed, true);
    assert.equal(r3.remaining, 0);

    // 4ème requête : BLOQUÉE 429
    const r4 = checkRateLimit(`test:${ip}`, 3, 10_000);
    assert.equal(r4.allowed, false);
    assert.ok(r4.retryAfterSeconds > 0);
});

test("VENDOR ISOLATION: Les agences ne voient que les réservations de leur propre hub", async () => {
    __resetBookingStoreForTests();
    const store = getBookingStore();

    const b1 = createMockBooking("ZW-MRK01", "marrakech", "marrakech", "2026-09-01", "2026-09-05");
    const b2 = createMockBooking("ZW-TNG01", "tanger", "tanger", "2026-09-01", "2026-09-05");

    await store.create(b1);
    await store.create(b2);

    // Une agence basée à Marrakech ne doit voir QUE b1
    const mrkBookings = await getVendorHubBookings("marrakech");
    assert.equal(mrkBookings.length, 1);
    assert.equal(mrkBookings[0].ref, "ZW-MRK01");

    // Une agence basée à Tanger ne doit voir QUE b2
    const tngBookings = await getVendorHubBookings("tanger");
    assert.equal(tngBookings.length, 1);
    assert.equal(tngBookings[0].ref, "ZW-TNG01");
});

test("CHECK-OUT SETTLEMENT: Litiges carburant, retard et restitution de caution", () => {
    const dummyRecord = createMockBooking("ZW-SETTLE1", "marrakech", "marrakech", "2026-09-01", "2026-09-04");

    // Cas 1 : Retour parfait (même carburant, aucun retard, aucun dégât)
    const perfectReturn = checkoutSettlement(
        {
            fuelOnPickup: "1/2",
            fuelOnReturn: "1/2",
            mileageOnPickup: 10000,
            mileageOnReturn: 10400, // 400 km sur 3 jours (forfait 750 km inclus)
            damageEur: 0,
            lateMinutes: 30, // dans la tolérance des 59 min
        },
        dummyRecord.quote
    );
    assert.equal(perfectReturn.depositRefundEur, dummyRecord.quote.depositEur);
    assert.equal(perfectReturn.totalChargesEur, 0);
    assert.equal(perfectReturn.amountDueByClientEur, 0);

    // Cas 2 : Restitution avec réservoir à 1/4 au lieu de 1/2 (-1/4 = pénalité 15 €)
    const missingFuel = checkoutSettlement(
        {
            fuelOnPickup: "1/2",
            fuelOnReturn: "1/4",
            mileageOnPickup: 10000,
            mileageOnReturn: 10400,
            damageEur: 0,
            lateMinutes: 0,
        },
        dummyRecord.quote
    );
    assert.equal(missingFuel.fuelPenaltyEur, 15);
    assert.equal(missingFuel.depositRefundEur, dummyRecord.quote.depositEur - 15);

    // Cas 3 : Dégâts supérieurs à la caution (dégât 450 € sur caution 300 €)
    const heavyDamage = checkoutSettlement(
        {
            fuelOnPickup: "1/2",
            fuelOnReturn: "1/2",
            mileageOnPickup: 10000,
            mileageOnReturn: 10400,
            damageEur: 450,
            lateMinutes: 0,
        },
        dummyRecord.quote
    );
    assert.equal(heavyDamage.depositRefundEur, 0);
    assert.equal(heavyDamage.amountDueByClientEur, 150);
});

test("BOOKING LOOKUP: Retrouver un dossier par email ou par référence", async () => {
    __resetBookingStoreForTests();
    const store = getBookingStore();

    const b1 = createMockBooking("ZW-FIND01", "marrakech", "marrakech", "2026-10-01", "2026-10-05");
    await store.create(b1);

    // 1. Recherche par référence exacte
    const foundByRef = await store.get("ZW-FIND01");
    assert.ok(foundByRef);
    assert.equal(foundByRef.client.email, "zw-find01@test.ma");

    // 2. Recherche par email
    const foundByEmail = await store.list({ email: "zw-find01@test.ma" });
    assert.equal(foundByEmail.length, 1);
    assert.equal(foundByEmail[0].ref, "ZW-FIND01");

    // 3. Email inconnu -> liste vide
    const notFound = await store.list({ email: "inconnu@test.ma" });
    assert.equal(notFound.length, 0);
});

test("ADMIN & VENDOR SECURITY: Comptes officiels locapartoo & scrypt auth", async () => {
    // 1. Authentification Admin locapartoo@gmail.com
    const { authenticateAdmin, getAdminFromToken } = await import("../src/lib/admin-auth.ts");
    const badAdmin = await authenticateAdmin("locapartoo@gmail.com", "WrongPassword123!");
    assert.equal(badAdmin, null);

    const goodAdmin = await authenticateAdmin("locapartoo@gmail.com", "ZwinAdmin2026!");
    assert.ok(goodAdmin);
    assert.equal(goodAdmin.admin.email, "locapartoo@gmail.com");
    assert.ok(goodAdmin.token.startsWith("zwin_adm_"));
    assert.equal(getAdminFromToken(goodAdmin.token)?.email, "locapartoo@gmail.com");

    // 2. Authentification Loueur test locapartoo+loueur@gmail.com
    const { authenticateVendor } = await import("../src/lib/vendor-store.ts");
    const badVendor = await authenticateVendor("locapartoo+loueur@gmail.com", "WrongPass!");
    assert.equal(badVendor, null);

    const goodVendor = await authenticateVendor("locapartoo+loueur@gmail.com", "Locapartoo2026!");
    assert.ok(goodVendor);
    assert.equal(goodVendor.agency.managerEmail, "locapartoo+loueur@gmail.com");
    assert.equal(goodVendor.agency.cityHub, "marrakech");
});
