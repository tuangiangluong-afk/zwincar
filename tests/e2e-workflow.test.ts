import test from "node:test";
import assert from "node:assert/strict";
import {
    quoteBooking,
    validateCreateBooking,
    buildVoucher,
    type BookingRecord,
} from "../src/lib/booking-engine.ts";
import { getBookingStore, __resetBookingStoreForTests } from "../src/lib/booking-store.ts";
import {
    registerVendorAgency,
    authenticateVendor,
    getVendorFromToken,
    getHubModelAvailability,
    addVendorVehicle,
    setVendorVehicleStatus,
    getVendorFleet,
    getVendorHubBookings,
} from "../src/lib/vendor-store.ts";
import { findHub, findVehicle, toVehicleRate } from "../src/lib/fleet.ts";
import { validateCheckIn, checkoutSettlement } from "../src/lib/booking-engine.ts";

test("E2E complet : Réservation client -> KYC -> Inscription Loueur -> Check-in -> Check-out & Caution", async () => {
    __resetBookingStoreForTests();
    const store = getBookingStore();

    // 1. CLIENT CRÉE SA RÉSERVATION
    const vehicle = findVehicle("dacia-duster-4x4")!;
    const hub = findHub("marrakech")!;

    const createInput = {
        vehicleId: vehicle.id,
        pickupHub: hub.slug,
        returnHub: hub.slug,
        pickupDate: "2026-11-15",
        pickupTime: "11:00",
        returnDate: "2026-11-20",
        returnTime: "11:00",
        upsells: ["franchise-zero", "esim-maroc"],
        currency: "EUR" as const,
        locale: "fr" as const,
        client: {
            fullName: "Mehdi Alami",
            email: "mehdi.alami@test.ma",
            phone: "+212612345678",
            flightNumber: "RAM AT782",
            notes: "Livraison parking P2",
        },
    };

    const validation = validateCreateBooking(createInput);
    assert.equal(validation.ok, true);

    const quote = quoteBooking({
        vehicle: toVehicleRate(vehicle),
        pickupHub: hub.slug,
        pickupDate: createInput.pickupDate,
        pickupTime: createInput.pickupTime,
        returnDate: createInput.returnDate,
        returnTime: createInput.returnTime,
        upsells: createInput.upsells,
    });

    const now = new Date().toISOString();
    const ref = "ZW-E2E101";
    const token = "zwin_tok_test_e2e_super_secure_token_abc123";

    const record: BookingRecord = {
        ref,
        version: 1,
        status: "confirmed", // Simule acompte Stripe validé
        createdAt: now,
        updatedAt: now,
        accessToken: token,
        locale: "fr",
        client: createInput.client,
        rental: {
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            transmission: vehicle.transmission,
            hubName: hub.name,
            pickupHub: hub.slug,
            pickupDate: createInput.pickupDate,
            pickupTime: createInput.pickupTime,
            returnHub: hub.slug,
            returnDate: createInput.returnDate,
            returnTime: createInput.returnTime,
            days: quote.days,
        },
        quote,
        paidEur: quote.acompteEur,
        lifecycleSent: [],
        events: [{ at: now, type: "created", actor: "client" }],
    };

    await store.create(record);

    // Vérifier lecture voucher client
    const clientVoucher = buildVoucher(record);
    assert.equal(clientVoucher.ref, ref);
    assert.equal(clientVoucher.rental.vehicleName, "Dacia Duster Prestige 4x4");
    assert.equal(clientVoucher.financials.cautionEur, 0); // Franchise Zéro

    // 2. LOUEUR S'INSCRIT & AJOUTE SA FLOTTE
    const { agency, token: vendorToken } = await registerVendorAgency({
        agencyName: "Kawkab Cars Marrakech",
        cityHub: "marrakech",
        iceNumber: "001928374000088",
        managerName: "Hassan Kawkabi",
        managerPhone: "+212661998877",
        managerEmail: "contact@kawkabcars.ma",
        password: "SecretPassword123!",
        firstCar: {
            model: "Dacia Duster 4x4",
            plate: "99120-A-26",
            dailyPriceMad: 490,
        },
    });

    assert.equal(agency.cityHub, "marrakech");
    assert.ok(vendorToken.startsWith("zwin_vnd_"));
    assert.equal(getVendorFromToken(vendorToken)?.id, agency.id);
    assert.equal(getVendorFromToken(`${vendorToken}tampered`), null);

    // Loueur se reconnecte
    const auth = await authenticateVendor("contact@kawkabcars.ma", "SecretPassword123!");
    assert.ok(auth);
    assert.equal(auth.agency.agencyName, "Kawkab Cars Marrakech");
    assert.equal(await authenticateVendor("contact@kawkabcars.ma", "Marrakech2026!"), null);

    // Ajout d'une 2e voiture + test Stop-Sell
    const car2 = addVendorVehicle(agency.id, {
        name: "Renault Clio 5 Automatique",
        plate: "55123-B-26",
        dailyPriceMad: 350,
    });
    assert.equal(car2.status, "available");

    const blockedCar = setVendorVehicleStatus(agency.id, car2.id, "blocked");
    assert.equal(blockedCar?.status, "blocked");

    const dusterAvail = getHubModelAvailability("marrakech", "dacia-duster-4x4", "Dacia Duster 4x4", 2);
    assert.equal(dusterAvail.available, true);
    assert.ok(dusterAvail.stockCount >= 2);

    const fleet = getVendorFleet(agency.id);
    assert.equal(fleet.length, 2);

    // 3. LE LOUEUR VOIT LA RÉSERVATION CLIENT DANS SON HUB
    const hubBookings = await getVendorHubBookings(agency.cityHub);
    const foundBooking = hubBookings.find((b) => b.ref === ref);
    assert.ok(foundBooking);
    assert.equal(foundBooking.client.fullName, "Mehdi Alami");

    // 4. CHECK-IN PAR LE LOUEUR
    const checkinValidation = validateCheckIn(
        {
            driverAge: 29,
            licenseIssuedAt: "2018-06-10",
            fuelLevel: "1/4",
            mileageKm: 42000,
            photos: 4,
            contractSigned: true,
            balanceCollected: true,
        },
        foundBooking.quote,
        foundBooking.rental.pickupDate
    );
    assert.equal(checkinValidation.ok, true);

    const checkinNow = new Date().toISOString();
    const checkedInRecord: BookingRecord = {
        ...foundBooking,
        status: "checked_in",
        checkin: {
            at: checkinNow,
            fuelLevel: "1/4",
            mileageKm: 42000,
            photos: 4,
            driverAge: 29,
            licenseIssuedAt: "2018-06-10",
        },
        updatedAt: checkinNow,
        events: [...foundBooking.events, { at: checkinNow, type: "vehicle_checked_in", actor: "vendor" }],
    };
    const savedCheckin = await store.save(checkedInRecord, foundBooking.version);

    // 5. CHECK-OUT LORS DE LA RESTITUTION DU VÉHICULE
    const settlement = checkoutSettlement(
        {
            fuelOnPickup: "1/4",
            fuelOnReturn: "1/4", // Same-to-Same respecté
            mileageOnPickup: 42000,
            mileageOnReturn: 42650, // 650 km parcourus (inclus dans le forfait)
            damageEur: 0,
            cleaningEur: 0,
            lateMinutes: 10, // Dans la tolérance de 59 min
        },
        savedCheckin.quote
    );

    assert.equal(settlement.fuelPenaltyEur, 0);
    assert.equal(settlement.damageEur, 0);
    assert.equal(settlement.depositRefundEur, quote.depositEur); // 100% de la caution restituée
    assert.equal(settlement.amountDueByClientEur, 0);

    const completedNow = new Date().toISOString();
    const completedRecord: BookingRecord = {
        ...savedCheckin,
        status: "completed",
        checkout: {
            at: completedNow,
            result: settlement,
            photos: 4,
        },
        updatedAt: completedNow,
        events: [...savedCheckin.events, { at: completedNow, type: "vehicle_checked_out", actor: "vendor" }],
    };
    await store.save(completedRecord, savedCheckin.version);

    const finalRecord = await store.get(ref);
    assert.equal(finalRecord?.status, "completed");
});
