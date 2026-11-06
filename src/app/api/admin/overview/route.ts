import { NextResponse } from "next/server";
import { getAdminFromToken } from "@/lib/admin-auth";
import { getBookingStore } from "@/lib/booking-store";
import { listAllVendorAgencies } from "@/lib/vendor-store";
import { jsonError } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function extractAdminToken(request: Request): string | null {
    const authHeader = request.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.substring(7).trim();
    }
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/zwincar_admin_token=([^;]+)/);
    return match ? match[1].trim() : null;
}

export async function GET(request: Request) {
    const token = extractAdminToken(request);
    if (!token) return jsonError("Authentification requise", 401);

    const admin = getAdminFromToken(token);
    if (!admin) return jsonError("Session administrateur invalide ou expirée", 401);

    const store = getBookingStore();
    const allBookings = await store.list();
    const agencies = listAllVendorAgencies();

    // Calculs financiers consolidés
    let gmvEur = 0;
    let gmvMad = 0;
    let acompteStripeEur = 0;
    let soldeTerrainEur = 0;
    let soldeTerrainMad = 0;
    let cautionsTotalEur = 0;

    const statusCounts: Record<string, number> = {
        awaiting_payment: 0,
        confirmed: 0,
        checked_in: 0,
        completed: 0,
        cancelled: 0,
    };

    const hubCounts: Record<string, number> = {};

    for (const b of allBookings) {
        gmvEur += b.quote.totalEur;
        gmvMad += b.quote.totalMad;
        acompteStripeEur += b.paidEur || b.quote.acompteEur;
        soldeTerrainEur += b.quote.balanceEur;
        soldeTerrainMad += b.quote.balanceMad;
        cautionsTotalEur += b.quote.depositEur;

        statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
        const hub = b.rental.pickupHub;
        hubCounts[hub] = (hubCounts[hub] || 0) + 1;
    }

    // Format bookings list for table view (triées par date décroissante)
    const formattedBookings = allBookings
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map((b) => ({
            ref: b.ref,
            status: b.status,
            clientName: b.client.fullName,
            clientPhone: b.client.phone,
            clientEmail: b.client.email,
            flightNumber: b.client.flightNumber || null,
            vehicleName: b.rental.vehicleName,
            pickupHub: b.rental.pickupHub,
            returnHub: b.rental.returnHub,
            pickupDate: b.rental.pickupDate,
            returnDate: b.rental.returnDate,
            days: b.rental.days,
            totalEur: b.quote.totalEur,
            totalMad: b.quote.totalMad,
            acompteEur: b.paidEur || b.quote.acompteEur,
            balanceEur: b.quote.balanceEur,
            balanceMad: b.quote.balanceMad,
            depositEur: b.quote.depositEur,
            hasZeroDeposit: b.quote.hasZeroDeposit,
            kycVerified: b.kyc?.verified ?? false,
            createdAt: b.createdAt,
            accessToken: b.accessToken,
        }));

    return NextResponse.json({
        admin: { email: admin.email, name: admin.name, role: admin.role },
        kpis: {
            totalBookingsCount: allBookings.length,
            gmvEur,
            gmvMad,
            acompteStripeEur,
            soldeTerrainEur,
            soldeTerrainMad,
            cautionsTotalEur,
            totalAgenciesCount: agencies.length,
            totalFleetVehicles: agencies.reduce((acc, a) => acc + a.fleetCount, 0),
        },
        statusCounts,
        hubCounts,
        bookings: formattedBookings,
        agencies,
    });
}
