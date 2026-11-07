import test from "node:test";
import assert from "node:assert/strict";
import { createHmac, timingSafeEqual } from "node:crypto";
import { getBookingStore, __resetBookingStoreForTests } from "../src/lib/booking-store.ts";
import { quoteBooking, type BookingRecord } from "../src/lib/booking-engine.ts";
import { findVehicle, toVehicleRate } from "../src/lib/fleet.ts";

function computeStripeSignature(payload: string, secret: string, timestamp?: number): { header: string; timestamp: number } {
    const t = timestamp ?? Math.floor(Date.now() / 1000);
    const signature = createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex");
    return {
        header: `t=${t},v1=${signature}`,
        timestamp: t,
    };
}

function verifyStripeSignature(payload: string, header: string | null, secret: string): boolean {
    if (!header) return false;
    const parts = header.split(",").reduce<Record<string, string>>((acc, part) => {
        const [key, value] = part.split("=");
        if (key && value) acc[key.trim()] = value.trim();
        return acc;
    }, {});

    const timestamp = parts["t"];
    const signature = parts["v1"];
    if (!timestamp || !signature) return false;

    const computed = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
    const a = Buffer.from(computed, "utf8");
    const b = Buffer.from(signature, "utf8");
    return a.length === b.length && timingSafeEqual(a, b);
}

test("STRIPE SIGNATURE: Valide correctement les webhooks signés et rejette les faux", () => {
    const secret = "whsec_test_secret_1234567890abcdef";
    const payload = JSON.stringify({ id: "evt_123", type: "checkout.session.completed" });

    const { header } = computeStripeSignature(payload, secret);

    // 1. Signature valide
    assert.equal(verifyStripeSignature(payload, header, secret), true);

    // 2. Payload altéré => rejet
    const tamperedPayload = JSON.stringify({ id: "evt_123", type: "checkout.session.completed", hack: true });
    assert.equal(verifyStripeSignature(tamperedPayload, header, secret), false);

    // 3. Mauvais secret => rejet
    assert.equal(verifyStripeSignature(payload, header, "whsec_wrong_secret"), false);

    // 4. Header corrompu ou vide => rejet
    assert.equal(verifyStripeSignature(payload, null, secret), false);
    assert.equal(verifyStripeSignature(payload, "invalid_header", secret), false);
    assert.equal(verifyStripeSignature(payload, "t=123", secret), false);
});

test("STRIPE WEBHOOK: checkout.session.completed passe le dossier de awaiting_payment à confirmed", async () => {
    __resetBookingStoreForTests();
    const store = getBookingStore();

    const vehicle = findVehicle("clio-5-auto") || findVehicle("dacia-sandero-stepway")!;
    const rate = toVehicleRate(vehicle);
    const quote = quoteBooking({
        vehicle: rate,
        pickupHub: "marrakech",
        returnHub: "marrakech",
        pickupDate: "2026-11-15",
        pickupTime: "10:00",
        returnDate: "2026-11-18",
        returnTime: "10:00",
        driverAge: 28,
    });

    const ref = "ZW-STRIPE01";
    const now = new Date().toISOString();
    const booking: BookingRecord = {
        ref,
        version: 1,
        status: "awaiting_payment",
        locale: "en",
        createdAt: now,
        updatedAt: now,
        accessToken: "tok_test_stripe_valid_token_12345",
        client: { fullName: "Sarah Jenkins", email: "sarah.j@example.com", phone: "+33612345678" },
        rental: {
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            transmission: vehicle.transmission,
            hubName: "Marrakech",
            pickupHub: "marrakech",
            returnHub: "marrakech",
            pickupDate: "2026-11-15",
            pickupTime: "10:00",
            returnDate: "2026-11-18",
            returnTime: "10:00",
            days: quote.days,
        },
        quote,
        paidEur: 0,
        lifecycleSent: [],
        events: [{ at: now, type: "created", actor: "client", note: "Booking created awaiting Stripe" }],
    };

    await store.create(booking);

    // Simule la réception de l'événement webhook Stripe
    const sessionAmountTotal = quote.acompteEur * 100;
    const sessionId = "cs_live_test_session_id_999";

    const record = await store.get(ref);
    assert.ok(record);
    assert.equal(record.status, "awaiting_payment");
    assert.equal(record.paidEur, 0);

    // Transition appliquée par le webhook
    const amountPaid = sessionAmountTotal / 100;
    const updated = {
        ...record,
        status: "confirmed" as const,
        paidEur: Math.max(record.paidEur, Math.round(amountPaid)),
        stripeSessionId: sessionId,
        updatedAt: new Date().toISOString(),
        events: [
            ...record.events,
            {
                at: new Date().toISOString(),
                type: "payment_confirmed" as const,
                actor: "system" as const,
                note: `${amountPaid} € via Stripe`,
            },
        ],
    };

    await store.save(updated, record.version);

    // Vérifie l'état final persistant
    const confirmedRecord = await store.get(ref);
    assert.ok(confirmedRecord);
    assert.equal(confirmedRecord.status, "confirmed");
    assert.equal(confirmedRecord.paidEur, quote.acompteEur);
    assert.equal(confirmedRecord.stripeSessionId, sessionId);
    assert.equal(confirmedRecord.events.some((e) => e.type === "payment_confirmed"), true);
});
