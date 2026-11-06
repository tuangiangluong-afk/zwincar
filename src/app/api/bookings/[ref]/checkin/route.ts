import { NextResponse } from "next/server";
import { validateCheckIn, type FuelLevel } from "@/lib/booking-engine";
import { VersionConflictError, getBookingStore } from "@/lib/booking-store";
import { authorizeBooking, jsonError, readJson, unauthorized } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FUEL_LEVELS: FuelLevel[] = ["0", "1/4", "1/2", "3/4", "1"];

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

    if (record.status !== "confirmed") {
        return jsonError("Le check-in n'est possible que sur un dossier confirmé.", 409, { status: record.status });
    }

    const fuelLevel = body.fuelLevel as FuelLevel;
    if (!FUEL_LEVELS.includes(fuelLevel)) return jsonError("Niveau de carburant invalide", 422);

    const result = validateCheckIn(
        {
            driverAge: Number(body.driverAge),
            licenseIssuedAt: typeof body.licenseIssuedAt === "string" ? body.licenseIssuedAt : "",
            fuelLevel,
            mileageKm: Number(body.mileageKm),
            photos: Number(body.photos),
            contractSigned: body.contractSigned === true,
            balanceCollected: body.balanceCollected === true,
        },
        record.quote,
        record.rental.pickupDate
    );

    if (!result.ok) {
        return jsonError("Check-in incomplet", 422, { issues: result.issues });
    }

    const now = new Date().toISOString();
    const updated = {
        ...record,
        status: "checked_in" as const,
        updatedAt: now,
        kyc: record.kyc ? { ...record.kyc, verified: true } : undefined,
        checkin: {
            at: now,
            fuelLevel,
            mileageKm: Number(body.mileageKm),
            photos: Number(body.photos),
            driverAge: Number(body.driverAge),
            licenseIssuedAt: String(body.licenseIssuedAt),
        },
        events: [...record.events, { at: now, type: "vehicle_checked_in", actor: "vendor" as const }],
    };

    try {
        await store.save(updated, record.version);
        return NextResponse.json(
            { status: "checked_in", depositRequiredEur: result.depositRequiredEur, zeroDeposit: result.zeroDeposit },
            { headers: { "Cache-Control": "private, no-store" } }
        );
    } catch (error) {
        if (error instanceof VersionConflictError) return jsonError("Dossier déjà modifié ailleurs.", 409);
        console.error("Check-in error:", error);
        return jsonError("Check-in impossible", 500);
    }
}
