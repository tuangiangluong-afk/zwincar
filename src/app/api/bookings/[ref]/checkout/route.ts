import { NextResponse } from "next/server";
import { checkoutSettlement, type FuelLevel } from "@/lib/booking-engine";
import { VersionConflictError, getBookingStore } from "@/lib/booking-store";
import { authorizeBooking, jsonError, readJson, unauthorized } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FUEL_LEVELS: FuelLevel[] = ["0", "1/4", "1/2", "3/4", "1"];

function num(value: unknown, fallback = 0): number {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? n : fallback;
}

export async function POST(request: Request, { params }: { params: Promise<{ ref: string }> }) {
    const { ref } = await params;
    const body = (await readJson(request)) ?? {};

    const store = getBookingStore();
    const record = await store.get(ref.toUpperCase());

    const token = typeof body.token === "string" ? body.token : null;
    const email = typeof body.email === "string" ? body.email : null;
    const cookieHeader = request.headers.get("cookie") || "";
    const cookieMatch = cookieHeader.match(/zwincar_vendor_token=([^;]+)/);
    const vendorToken = request.headers.get("x-vendor-token") || (cookieMatch ? cookieMatch[1].trim() : null);
    if (!authorizeBooking(record, { token, email, vendorToken })) return unauthorized();

    if (record.status !== "checked_in") {
        return jsonError("Le check-out exige un check-in préalable.", 409, { status: record.status });
    }
    if (!record.checkin) {
        return jsonError("Données de check-in manquantes : impossible de clôturer.", 409);
    }

    const fuelOnReturn = body.fuelOnReturn as FuelLevel;
    if (!FUEL_LEVELS.includes(fuelOnReturn)) return jsonError("Niveau de carburant de retour invalide", 422);

    const mileageOnReturn = num(body.mileageOnReturn, NaN);
    if (!Number.isFinite(mileageOnReturn) || mileageOnReturn < record.checkin.mileageKm) {
        return jsonError("Kilométrage de retour incohérent avec le check-in", 422);
    }

    const result = checkoutSettlement(
        {
            fuelOnPickup: record.checkin.fuelLevel,
            fuelOnReturn,
            mileageOnPickup: record.checkin.mileageKm,
            mileageOnReturn,
            damageEur: num(body.damageEur),
            lateMinutes: num(body.lateMinutes),
            cleaningEur: num(body.cleaningEur),
            tollsEur: num(body.tollsEur),
            finesEur: num(body.finesEur),
        },
        record.quote
    );

    const now = new Date().toISOString();
    const updated = {
        ...record,
        status: "completed" as const,
        updatedAt: now,
        checkout: {
            at: now,
            result,
            photos: num(body.photos),
            notes: typeof body.notes === "string" ? body.notes.slice(0, 500) : undefined,
        },
        events: [
            ...record.events,
            {
                at: now,
                type: "vehicle_checked_out",
                actor: "vendor" as const,
                note: `franchise ${result.totalChargesEur} € · caution rendue ${result.depositRefundEur} €`,
            },
        ],
    };

    try {
        await store.save(updated, record.version);
        return NextResponse.json(
            {
                status: "completed",
                settlement: result,
                // La caution n'est jamais "gardée" silencieusement : le détail est renvoyé.
                depositRefundEur: result.depositRefundEur,
                amountDueByClientEur: result.amountDueByClientEur,
            },
            { headers: { "Cache-Control": "private, no-store" } }
        );
    } catch (error) {
        if (error instanceof VersionConflictError) return jsonError("Dossier déjà clôturé ailleurs.", 409);
        console.error("Check-out error:", error);
        return jsonError("Check-out impossible", 500);
    }
}
