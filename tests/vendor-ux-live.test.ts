import test from "node:test";
import assert from "node:assert/strict";
import {
    quoteBooking,
    type BookingRecord,
} from "../src/lib/booking-engine.ts";
import { findVehicle, toVehicleRate } from "../src/lib/fleet.ts";
import {
    registerVendorAgency,
    authenticateVendor,
    getVendorFromToken,
    getVendorFleet,
    addVendorVehicle,
    setVendorVehicleStatus,
    getVendorHubBookings,
    getVendorPhoneForHub,
} from "../src/lib/vendor-store.ts";
import { getBookingStore, __resetBookingStoreForTests } from "../src/lib/booking-store.ts";
import { formatWhatsAppRecipientPhone, notifyVendorNewBooking } from "../src/lib/whatsapp.ts";

test("Vendor UX 100% Fluide : Inscription -> Auth -> Gestion Flotte -> Réception Résa -> Check-in -> WhatsApp Alert", async () => {
    __resetBookingStoreForTests();
    const store = getBookingStore();

    // 1. Numéro officiel WhatsApp : test du formateur E.164 Meta
    const officialNum = "07 20 79 40 46";
    const formatted = formatWhatsAppRecipientPhone(officialNum);
    assert.equal(formatted, "212720794046");
    assert.equal(formatWhatsAppRecipientPhone("+212 7 20 79 40 46"), "212720794046");

    // 2. Inscription d'un nouveau loueur partenaire à Agadir
    const reg = await registerVendorAgency({
        agencyName: "Souss Auto Agadir SARL",
        cityHub: "agadir",
        iceNumber: "009876543210012",
        managerName: "Youssef Agadiri",
        managerPhone: "+212 7 20 79 40 46",
        managerEmail: "contact@soussauto.ma",
        password: "AgadirSuperSecret2026!",
        firstCar: {
            model: "Dacia Sandero Stepway",
            plate: "12345-A-33",
            dailyPriceMad: 290,
        },
    });

    assert.equal(reg.agency.cityHub, "agadir");
    assert.ok(reg.token.startsWith("zwin_vnd_"));

    // 3. Authentification fluide
    const login = await authenticateVendor("contact@soussauto.ma", "AgadirSuperSecret2026!");
    assert.ok(login);
    assert.equal(login.agency.agencyName, "Souss Auto Agadir SARL");

    // Vérification du numéro de téléphone récupéré pour le hub
    const hubPhone = getVendorPhoneForHub("agadir");
    assert.equal(hubPhone, "+212 7 20 79 40 46");

    // 4. Gestion de flotte & Stop-Sell en 1 clic
    const fleet = getVendorFleet(reg.agency.id);
    assert.equal(fleet.length, 1);
    assert.equal(fleet[0]!.status, "available");

    // Activation Stop-Sell (véhicule loué au comptoir)
    const blocked = setVendorVehicleStatus(reg.agency.id, fleet[0]!.id, "blocked");
    assert.equal(blocked?.status, "blocked");

    // Déblocage Stop-Sell
    const unblocked = setVendorVehicleStatus(reg.agency.id, fleet[0]!.id, "available");
    assert.equal(unblocked?.status, "available");

    // 5. Création d'une réservation client sur le Hub Agadir
    const vehicle = findVehicle("dacia-sandero-stepway")!;
    const quote = quoteBooking({
        vehicle: toVehicleRate(vehicle),
        pickupHub: "agadir",
        pickupDate: "2026-11-20",
        pickupTime: "14:00",
        returnDate: "2026-11-27",
        returnTime: "14:00",
        upsells: ["franchise-zero"],
    });

    const now = new Date().toISOString();
    const ref = "ZW-AGA901";
    const record: BookingRecord = {
        ref,
        version: 1,
        status: "confirmed",
        createdAt: now,
        updatedAt: now,
        accessToken: "zwin_tok_agadir_client_abc999",
        locale: "fr",
        client: {
            fullName: "Sophie Dupont",
            email: "sophie.dupont@test.fr",
            phone: "+33612345678",
            flightNumber: "Transavia TO3040",
            notes: "Livraison parking P2 Agadir",
        },
        rental: {
            vehicleId: "dacia-sandero-stepway",
            vehicleName: "Dacia Sandero Stepway",
            transmission: "Manuelle",
            hubName: "Agadir",
            pickupHub: "agadir",
            pickupDate: "2026-11-20",
            pickupTime: "14:00",
            returnHub: "agadir",
            returnDate: "2026-11-27",
            returnTime: "14:00",
            days: quote.days,
        },
        quote,
        paidEur: quote.acompteEur,
        lifecycleSent: [],
        events: [{ at: now, type: "created", actor: "client" }],
    };

    await store.create(record);

    // 6. Le loueur Agadir voit la réservation dans son dashboard
    const agadirBookings = await getVendorHubBookings("agadir");
    const found = agadirBookings.find((b) => b.ref === ref);
    assert.ok(found);
    assert.equal(found.client.fullName, "Sophie Dupont");
    assert.equal(found.quote.hasZeroDeposit, true);

    // 7. Alerte WhatsApp automatique vers le loueur au 07 20 79 40 46
    const alertResult = await notifyVendorNewBooking({
        ref: record.ref,
        clientName: record.client.fullName,
        clientPhone: record.client.phone,
        vehicleName: record.rental.vehicleName,
        hubName: record.rental.hubName,
        airportCode: "AGA",
        pickupDate: record.rental.pickupDate,
        pickupTime: record.rental.pickupTime,
        returnDate: record.rental.returnDate,
        returnTime: record.rental.returnTime,
        days: record.rental.days,
        balanceOnSiteMad: record.quote.balanceMad,
        balanceOnSiteEur: record.quote.balanceEur,
        hasFranchiseZero: record.quote.hasZeroDeposit,
        flightNumber: record.client.flightNumber,
        vendorPhone: hubPhone!,
    });

    assert.equal(alertResult.success, true);
});
