import { NextResponse } from "next/server";
import { getVendorFromToken, getVendorHubBookings } from "@/lib/vendor-store";
import { jsonError } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function extractToken(request: Request): string | null {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.substring(7).trim();
    }
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/zwincar_vendor_token=([^;]+)/);
    return match ? match[1].trim() : null;
}

export async function GET(request: Request) {
    const token = extractToken(request);
    if (!token) return jsonError("Non authentifié", 401);

    const agency = getVendorFromToken(token);
    if (!agency) return jsonError("Session loueur invalide", 401);

    const bookings = await getVendorHubBookings(agency.cityHub);

    // Format for vendor operational dashboard
    const formatted = bookings.map((b) => ({
        ref: b.ref,
        status: b.status,
        accessToken: b.accessToken,
        client: {
            fullName: b.client.fullName,
            phone: b.client.phone,
            email: b.client.email,
            flightNumber: b.client.flightNumber || "Non spécifié",
        },
        rental: {
            vehicleId: b.rental.vehicleId,
            vehicleName: b.rental.vehicleName,
            pickupHub: b.rental.pickupHub,
            pickupDate: b.rental.pickupDate,
            pickupTime: b.rental.pickupTime,
            returnDate: b.rental.returnDate,
            returnTime: b.rental.returnTime,
            days: b.rental.days,
        },
        financials: {
            totalEur: b.quote.totalEur,
            totalMad: b.quote.totalMad,
            acompteEur: b.quote.acompteEur,
            balanceOnSiteEur: b.quote.balanceEur,
            balanceOnSiteMad: b.quote.balanceMad,
            depositEur: b.quote.depositEur,
            hasZeroDeposit: b.quote.hasZeroDeposit,
        },
        checkin: b.checkin || null,
        checkout: b.checkout || null,
        createdAt: b.createdAt,
    }));

    return NextResponse.json({ bookings: formatted, agencyHub: agency.cityHub });
}
