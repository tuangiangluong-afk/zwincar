import test from "node:test";
import assert from "node:assert/strict";

import {
    assertTransition,
    buildVoucher,
    canTransition,
    cancellationPolicy,
    checkoutSettlement,
    dueLifecycleEmails,
    generateBookingRef,
    isValidBookingRef,
    longStayDiscount,
    modificationPolicy,
    planLifecycleEmails,
    quoteBooking,
    rentalDays,
    seasonFor,
    toPublicBooking,
    validateCheckIn,
    validateCreateBooking,
    type BookingRecord,
    type CheckInInput,
    type VehicleRate,
} from "../src/lib/booking-engine.ts";

const vehicle: VehicleRate = {
    id: "dacia-sandero-stepway",
    name: "Dacia Sandero Stepway",
    dailyPriceEur: 30,
    dailyPriceMad: 330,
    transmission: "Manuelle",
    seats: 5,
};

function quote(overrides: Partial<Parameters<typeof quoteBooking>[0]> = {}) {
    return quoteBooking({
        vehicle,
        pickupDate: "2026-03-10",
        pickupTime: "10:00",
        returnDate: "2026-03-13",
        returnTime: "10:00",
        pickupHub: "marrakech",
        returnHub: "marrakech",
        upsells: [],
        ...overrides,
    });
}

function makeRecord(overrides: Partial<BookingRecord> = {}): BookingRecord {
    const q = quote();
    return {
        ref: "ZW-12345A",
        version: 1,
        status: "confirmed",
        locale: "fr",
        createdAt: "2026-03-01T10:00:00.000Z",
        updatedAt: "2026-03-01T10:00:00.000Z",
        accessToken: "a".repeat(48),
        client: { fullName: "Thomas Martin", email: "thomas@example.com", phone: "+33612345678" },
        rental: {
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            transmission: "Manuelle",
            pickupHub: "marrakech",
            hubName: "Marrakech",
            returnHub: "marrakech",
            airportCode: "RAK",
            meetingPointDetail: "Parking P2",
            pickupDate: "2026-03-10",
            pickupTime: "10:00",
            returnDate: "2026-03-13",
            returnTime: "10:00",
            days: 3,
        },
        quote: q,
        paidEur: q.acompteEur,
        events: [],
        lifecycleSent: [],
        ...overrides,
    };
}

test("rentalDays facture toute tranche de 24h commencée", () => {
    assert.equal(rentalDays("2026-03-10", "10:00", "2026-03-10", "13:00"), 1);
    assert.equal(rentalDays("2026-03-10", "10:00", "2026-03-11", "10:00"), 1);
    assert.equal(rentalDays("2026-03-10", "10:00", "2026-03-11", "11:00"), 2);
    assert.equal(rentalDays("2026-03-10", "10:00", "2026-03-17", "10:00"), 7);
    assert.throws(() => rentalDays("2026-03-10", "10:00", "2026-03-10", "09:00"));
});

test("les saisons et remises longue durée sont celles annoncées", () => {
    assert.equal(seasonFor("2026-07-15").multiplier, 1.35);
    assert.equal(seasonFor("2026-02-02").multiplier, 0.9);
    assert.equal(seasonFor("2026-03-05").multiplier, 1);
    assert.equal(longStayDiscount(6), 0);
    assert.equal(longStayDiscount(7), 0.1);
    assert.equal(longStayDiscount(14), 0.15);
    assert.equal(longStayDiscount(21), 0.2);
    assert.equal(longStayDiscount(28), 0.25);
});

test("devis de base : 3 jours, acompte 20 %, caution 300 €", () => {
    const q = quote();
    assert.equal(q.days, 3);
    assert.equal(q.baseEur, 90);
    assert.equal(q.totalEur, 90);
    assert.equal(q.acompteEur, 18);
    assert.equal(q.balanceEur, 72);
    assert.equal(q.depositEur, 300);
    assert.equal(q.depositMad, 3300);
    assert.equal(q.hasZeroDeposit, false);
});

test("Franchise Zéro : caution à 0 € et option facturée par jour", () => {
    const q = quote({ upsells: ["franchise-zero"] });
    assert.equal(q.extrasEur, 24);
    assert.equal(q.totalEur, 114);
    assert.equal(q.depositEur, 0);
    assert.equal(q.acompteEur, 23);
    assert.equal(q.balanceEur, 91);
});

test("remise longue durée cumulée avec la saison", () => {
    const q = quote({ returnDate: "2026-03-17" });
    assert.equal(q.days, 7);
    assert.equal(q.baseEur, 210);
    assert.equal(q.discountRate, 0.1);
    assert.equal(q.totalEur, 189);

    const july = quote({ pickupDate: "2026-07-06", returnDate: "2026-07-13" });
    assert.equal(july.seasonMultiplier, 1.35);
    assert.equal(july.baseEur, 210);
    assert.equal(july.totalEur, 256); // 210 + 74 - 28
});

test("frais jeune conducteur et retour dans une autre ville", () => {
    const q = quote({
        returnDate: "2026-03-12",
        driverAge: 22,
        returnHub: "agadir",
    });
    assert.equal(q.days, 2);
    assert.equal(q.baseEur, 60);
    assert.equal(q.extrasEur, 41); // 25 € cross-hub + 16 € jeune conducteur
    assert.equal(q.totalEur, 101);
    assert.equal(q.youngDriver, true);
    assert.equal(q.crossHub, true);
});

test("la somme des lignes du devis égale toujours le total affiché", () => {
    const q = quote({
        pickupDate: "2026-07-20",
        returnDate: "2026-08-05",
        upsells: ["franchise-zero", "esim-maroc", "siege-bebe"],
        driverAge: 23,
        returnHub: "casablanca",
    });
    const sumEur = q.lines.reduce((sum, line) => sum + line.amountEur, 0);
    const sumMad = q.lines.reduce((sum, line) => sum + line.amountMad, 0);
    assert.equal(sumEur, q.totalEur);
    assert.equal(sumMad, q.totalMad);
});

test("annulation : 100 % à 48h+, 50 % à 24h+, 0 % en dessous", () => {
    const booking = makeRecord({ paidEur: 18 });

    const free = cancellationPolicy(booking, new Date("2026-03-07T10:00:00Z"));
    assert.equal(free.tier, "free");
    assert.equal(free.refundEur, 18);

    const partial = cancellationPolicy(booking, new Date("2026-03-09T04:00:00Z"));
    assert.equal(partial.tier, "partial");
    assert.equal(partial.refundEur, 9);

    const late = cancellationPolicy(booking, new Date("2026-03-09T23:00:00Z"));
    assert.equal(late.tier, "late");
    assert.equal(late.refundEur, 0);
    assert.equal(late.creditNoteEur, 18);

    const noShow = cancellationPolicy(booking, new Date("2026-03-10T12:00:00Z"));
    assert.equal(noShow.tier, "no_show");
    assert.equal(noShow.refundEur, 0);

    const afterPickup = cancellationPolicy(
        { ...booking, status: "checked_in" },
        new Date("2026-03-09T10:00:00Z")
    );
    assert.equal(afterPickup.allowed, false);
});

test("modification de dates : complément d'acompte et frais sous 48h", () => {
    const booking = makeRecord({ paidEur: 18 });

    const early = modificationPolicy(
        booking,
        { pickupDate: "2026-03-20", pickupTime: "10:00", returnDate: "2026-03-25", returnTime: "10:00" },
        vehicle,
        "marrakech",
        new Date("2026-03-01T10:00:00Z")
    );
    assert.equal(early.allowed, true);
    assert.equal(early.adminFeeEur, 0);
    assert.equal(early.quote!.totalEur, 150);
    assert.equal(early.amountToPayNowEur, 12); // acompte 30 - 18 déjà payés
    assert.equal(early.newBalanceEur, 120);

    const late = modificationPolicy(
        booking,
        { pickupDate: "2026-03-20", pickupTime: "10:00", returnDate: "2026-03-25", returnTime: "10:00" },
        vehicle,
        "marrakech",
        new Date("2026-03-09T10:00:00Z")
    );
    assert.equal(late.adminFeeEur, 25);
    assert.equal(late.amountToPayNowEur, 37);

    const afterKeys = modificationPolicy(
        { ...booking, status: "checked_in" },
        { pickupDate: "2026-03-20", pickupTime: "10:00", returnDate: "2026-03-22", returnTime: "10:00" },
        vehicle,
        "marrakech",
        new Date("2026-03-09T10:00:00Z")
    );
    assert.equal(afterKeys.allowed, false);
});

test("machine à états : pas de check-out sans check-in", () => {
    assert.equal(canTransition("confirmed", "checked_in"), true);
    assert.equal(canTransition("confirmed", "checked_out"), false);
    assert.equal(canTransition("checked_in", "completed"), true);
    assert.equal(canTransition("completed", "confirmed"), false);
    assert.throws(() => assertTransition("confirmed", "checked_out"));
});

test("check-in : âge, permis, photos et contrat sont bloquants", () => {
    const valid: CheckInInput = {
        driverAge: 34,
        licenseIssuedAt: "2015-06-01",
        fuelLevel: "1/2",
        mileageKm: 45000,
        photos: 6,
        contractSigned: true,
        balanceCollected: true,
    };

    const ok = validateCheckIn(valid, quote(), "2026-03-10");
    assert.equal(ok.ok, true);
    assert.equal(ok.issues.length, 0);
    assert.equal(ok.depositRequiredEur, 300);

    const underage = validateCheckIn({ ...valid, driverAge: 19 }, quote(), "2026-03-10");
    assert.equal(underage.ok, false);
    assert.ok(underage.issues.some((issue) => issue.code === "driver_age"));

    const youngLicense = validateCheckIn({ ...valid, licenseIssuedAt: "2025-06-01" }, quote(), "2026-03-10");
    assert.ok(youngLicense.issues.some((issue) => issue.code === "license_seniority"));

    const noPhotos = validateCheckIn({ ...valid, photos: 3 }, quote(), "2026-03-10");
    assert.ok(noPhotos.issues.some((issue) => issue.code === "photos"));

    const noContract = validateCheckIn({ ...valid, contractSigned: false }, quote(), "2026-03-10");
    assert.ok(noContract.issues.some((issue) => issue.code === "contract"));
});

test("check-out : carburant, km, retard et caution restituée", () => {
    const q = quote();
    const result = checkoutSettlement(
        {
            fuelOnPickup: "1/2",
            fuelOnReturn: "1/4",
            mileageOnPickup: 45000,
            mileageOnReturn: 45900,
            damageEur: 100,
            lateMinutes: 90,
        },
        q
    );

    assert.equal(result.fuelPenaltyEur, 15); // 1/4 de 60 €
    assert.equal(result.includedKm, 750);
    assert.equal(result.extraKm, 150);
    assert.equal(result.extraKmPenaltyEur, 37.5);
    assert.equal(result.latePenaltyEur, 30); // 1 jour de retard
    assert.equal(result.totalChargesEur, 183);
    assert.equal(result.depositRefundEur, 117);
    assert.equal(result.amountDueByClientEur, 0);
});

test("check-out : dommages supérieurs à la caution => reste à charge client", () => {
    const q = quote();
    const result = checkoutSettlement(
        {
            fuelOnPickup: "1",
            fuelOnReturn: "1",
            mileageOnPickup: 0,
            mileageOnReturn: 500,
            damageEur: 400,
        },
        q
    );
    assert.equal(result.totalChargesEur, 400);
    assert.equal(result.depositRefundEur, 0);
    assert.equal(result.amountDueByClientEur, 100);
});

test("cycle de vie : J-7 / J-1 / J0 / J+1 / J+30, une seule fois", () => {
    const fixture = makeRecord();
    const plan = planLifecycleEmails({ ...fixture.rental, ref: fixture.ref });
    assert.equal(plan.length, 5);
    assert.equal(plan[0].sendAt, "2026-03-03T09:00:00.000Z");
    assert.equal(plan[2].sendAt, "2026-03-10T08:00:00.000Z");
    assert.equal(plan[3].sendAt, "2026-03-14T11:00:00.000Z");
    assert.equal(plan[4].sendAt, "2026-04-12T10:00:00.000Z");

    const booking = makeRecord();
    assert.equal(dueLifecycleEmails(booking, new Date("2026-03-02T10:00:00Z")).length, 0);

    const due = dueLifecycleEmails(booking, new Date("2026-03-03T10:00:00Z"));
    assert.deepEqual(due.map((email) => email.type), ["j7_prepare"]);

    const alreadySent = dueLifecycleEmails(booking, new Date("2026-03-03T10:00:00Z"), ["ZW-12345A:j7_prepare"]);
    assert.equal(alreadySent.length, 0);

    const reviewPending = dueLifecycleEmails(
        { ...booking, status: "completed" },
        new Date("2026-03-15T12:00:00Z")
    );
    assert.deepEqual(reviewPending.map((email) => email.type), ["j1_review"]);
});

test("validation API : email, téléphone, dates et options inconnues", () => {
    const payload = {
        vehicleId: vehicle.id,
        pickupHub: "marrakech",
        pickupDate: "2026-03-10",
        pickupTime: "10:00",
        returnDate: "2026-03-13",
        returnTime: "10:00",
        upsells: ["franchise-zero"],
        currency: "EUR",
        locale: "fr",
        client: { fullName: "Thomas Martin", email: "thomas@example.com", phone: "+33 6 12 34 56 78" },
    };

    const ok = validateCreateBooking(payload);
    assert.equal(ok.ok, true);

    const badEmail = validateCreateBooking({ ...payload, client: { ...payload.client, email: "nope" } });
    assert.equal(badEmail.ok, false);

    const badPhone = validateCreateBooking({ ...payload, client: { ...payload.client, phone: "abc" } });
    assert.equal(badPhone.ok, false);

    const badOption = validateCreateBooking({ ...payload, upsells: ["vol-gratuit"] });
    assert.equal(badOption.ok, false);

    const inverted = validateCreateBooking({ ...payload, returnDate: "2026-03-01" });
    assert.equal(inverted.ok, false);
});

test("référence de dossier : clé de contrôle anti-énumération", () => {
    const ref = generateBookingRef(() => 0.5);
    assert.equal(ref, "ZW-55000" + ref.slice(-1));
    assert.equal(isValidBookingRef(ref), true);
    assert.equal(isValidBookingRef(ref.slice(0, -1) + (ref.endsWith("0") ? "1" : "0")), false);
    assert.equal(isValidBookingRef("ZW-1234"), false);
    assert.equal(isValidBookingRef("PIRATE"), false);
});

test("aucune fuite du token d'accès dans les projections publiques", () => {
    const record = makeRecord();
    const publicBooking = JSON.stringify(toPublicBooking(record));
    const voucher = JSON.stringify(buildVoucher(record));
    assert.equal(publicBooking.includes(record.accessToken), false);
    assert.equal(voucher.includes(record.accessToken), false);
    assert.equal(publicBooking.includes("events"), false);
});

test("buildVoucher propage fidèlement la locale et applique le masquage PII quand demandé", () => {
    const record = makeRecord({ locale: "en" });
    const fullVoucher = buildVoucher(record);
    assert.equal(fullVoucher.locale, "en");
    assert.equal(fullVoucher.rental.fuelPolicy, "Same-to-Same fuel level");
    assert.equal(fullVoucher.client.fullName, "Thomas Martin");
    assert.equal(fullVoucher.client.email, "thomas@example.com");

    const maskedVoucher = buildVoucher(record, { maskPii: true });
    assert.equal(maskedVoucher.locale, "en");
    assert.equal(maskedVoucher.client.fullName.includes("Thomas"), false);
    assert.equal(maskedVoucher.client.email.includes("thomas@"), false);
    assert.equal(maskedVoucher.client.phone.includes("0612345678"), false);
    assert.equal(maskedVoucher.rental.vehicleName, record.rental.vehicleName);
    assert.equal(maskedVoucher.financials.depositAcompteEur, record.quote.acompteEur);
});
