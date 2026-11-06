import { NextResponse } from "next/server";
import { isValidIsoDate, isValidTime, modificationPolicy } from "@/lib/booking-engine";
import { VersionConflictError, getBookingStore } from "@/lib/booking-store";
import { findVehicle, toVehicleRate } from "@/lib/fleet";
import { authorizeBooking, jsonError, readJson, unauthorized } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ ref: string }> }) {
    const { ref } = await params;
    const body = (await readJson(request)) ?? {};

    const store = getBookingStore();
    const record = await store.get(ref.toUpperCase());

    const token = typeof body.token === "string" ? body.token : null;
    const email = typeof body.email === "string" ? body.email : null;
    if (!authorizeBooking(record, { token, email })) return unauthorized();

    const pickupDate = typeof body.pickupDate === "string" ? body.pickupDate : "";
    const pickupTime = typeof body.pickupTime === "string" ? body.pickupTime : "";
    const returnDate = typeof body.returnDate === "string" ? body.returnDate : "";
    const returnTime = typeof body.returnTime === "string" ? body.returnTime : "";

    if (!isValidIsoDate(pickupDate) || !isValidIsoDate(returnDate) || !isValidTime(pickupTime) || !isValidTime(returnTime)) {
        return jsonError("Dates ou heures invalides", 422);
    }

    const vehicle = findVehicle(record.rental.vehicleId);
    if (!vehicle) return jsonError("Véhicule du dossier introuvable", 500);

    const modifiers = Array.isArray(body.upsells)
        ? body.upsells.filter((id): id is string => typeof id === "string")
        : record.quote.upsells;

    const result = modificationPolicy(
        record,
        {
            pickupDate,
            pickupTime,
            returnDate,
            returnTime,
            returnHub: typeof body.returnHub === "string" ? body.returnHub : record.rental.returnHub,
            upsells: modifiers,
            driverAge: typeof body.driverAge === "number" ? body.driverAge : undefined,
        },
        toVehicleRate(vehicle),
        record.rental.pickupHub,
        new Date()
    );

    if (!result.allowed || !result.quote) {
        return jsonError(result.reason ?? "Modification impossible", 409);
    }

    const quote = result.quote;
    const now = new Date().toISOString();

    const updated = {
        ...record,
        updatedAt: now,
        quote,
        rental: {
            ...record.rental,
            pickupDate,
            pickupTime,
            returnDate,
            returnTime,
            days: quote.days,
        },
        pendingPayment:
            result.amountToPayNowEur > 0
                ? { kind: "change" as const, amountEur: result.amountToPayNowEur, createdAt: now }
                : undefined,
        events: [
            ...record.events,
            {
                at: now,
                type: "booking_modified",
                actor: "client" as const,
                note: `${pickupDate} → ${returnDate} · delta ${result.deltaTotalEur} €`,
            },
        ],
    };

    try {
        const saved = await store.save(updated, record.version);
        return NextResponse.json(
            {
                status: saved.status,
                quote,
                amountToPayNowEur: result.amountToPayNowEur,
                refundDueEur: result.refundDueEur,
                adminFeeEur: result.adminFeeEur,
                newBalanceEur: result.newBalanceEur,
                message: result.message,
            },
            { headers: { "Cache-Control": "private, no-store" } }
        );
    } catch (error) {
        if (error instanceof VersionConflictError) {
            return jsonError("Le dossier a changé entre-temps, rechargez la page.", 409);
        }
        console.error("Modify error:", error);
        return jsonError("Modification impossible pour le moment.", 500);
    }
}
