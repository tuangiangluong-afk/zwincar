import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import {
    buildVoucher,
    generateBookingRef,
    isValidBookingRef,
    quoteBooking,
    toPublicBooking,
    validateCreateBooking,
    type BookingRecord,
} from "@/lib/booking-engine";
import { getBookingStore } from "@/lib/booking-store";
import { findHub, findVehicle, toVehicleRate } from "@/lib/fleet";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp, jsonError, readJson, tooManyRequests } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`bookings:create:${ip}`, 8, 10 * 60 * 1000);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

    const body = await readJson(request);
    if (!body) return jsonError("Corps de requête JSON invalide", 400);

    const validation = validateCreateBooking(body);
    if (!validation.ok) {
        return jsonError("Réservation invalide", 422, { details: validation.errors });
    }

    const input = validation.value;
    const vehicle = findVehicle(input.vehicleId);
    if (!vehicle) return jsonError("Véhicule inconnu", 404);

    const hub = findHub(input.pickupHub);
    if (!hub) return jsonError("Agence de départ inconnue", 404);

    const returnHub = input.returnHub ? findHub(input.returnHub) : hub;
    if (!returnHub) return jsonError("Agence de restitution inconnue", 404);

    // Le client n'envoie JAMAIS de prix : tout est recalculé ici à partir du catalogue.
    let quote;
    try {
        quote = quoteBooking({
            vehicle: toVehicleRate(vehicle),
            pickupDate: input.pickupDate,
            pickupTime: input.pickupTime,
            returnDate: input.returnDate,
            returnTime: input.returnTime,
            pickupHub: hub.slug,
            returnHub: returnHub.slug,
            upsells: input.upsells,
            driverAge: input.driverAge,
            currency: input.currency,
        });
    } catch (error) {
        return jsonError(error instanceof Error ? error.message : "Devis impossible", 422);
    }

    const store = getBookingStore();
    let ref = generateBookingRef();
    for (let attempt = 0; attempt < 5; attempt += 1) {
        const existing = await store.get(ref);
        if (!existing) break;
        ref = generateBookingRef();
    }
    if (!isValidBookingRef(ref)) return jsonError("Référence de dossier invalide", 500);

    const now = new Date().toISOString();
    const record: BookingRecord = {
        ref,
        version: 1,
        status: "awaiting_payment",
        locale: input.locale,
        createdAt: now,
        updatedAt: now,
        accessToken: randomBytes(24).toString("hex"),
        client: input.client,
        rental: {
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            vehicleCategory: vehicle.category,
            vehicleImage: vehicle.image,
            transmission: vehicle.transmission,
            pickupHub: hub.slug,
            hubName: hub.name,
            returnHub: returnHub.slug,
            airportCode: hub.airportCode,
            meetingPointDetail: hub.meetingPointDetail,
            pickupDate: input.pickupDate,
            pickupTime: input.pickupTime,
            returnDate: input.returnDate,
            returnTime: input.returnTime,
            days: quote.days,
        },
        quote,
        paidEur: 0,
        events: [{ at: now, type: "booking_created", actor: "client" }],
        lifecycleSent: [],
    };

    try {
        await store.create(record);
    } catch (error) {
        console.error("Booking create error:", error);
        return jsonError("Impossible d'enregistrer la réservation", 500);
    }

    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";

    return NextResponse.json(
        {
            booking: toPublicBooking(record),
            voucher: buildVoucher(record),
            accessToken: record.accessToken,
            voucherUrl: `${origin}/booking/${record.ref}?t=${record.accessToken}`,
            payment: { amountEur: quote.acompteEur, amountMad: quote.acompteMad, currency: "EUR" },
        },
        { status: 201 }
    );
}
