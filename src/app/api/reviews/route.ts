import { NextResponse } from "next/server";
import { REVIEWABLE_STATUSES, summarizeReviews } from "@/lib/booking-engine";
import { getBookingStore } from "@/lib/booking-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    try {
        // shortcut: list() plafonne à 500 dossiers, passer à une agrégation SQL au-delà.
        const records = await getBookingStore().list({ status: REVIEWABLE_STATUSES });
        return NextResponse.json(summarizeReviews(records), {
            headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
        });
    } catch (error) {
        console.error("Reviews summary error:", error);
        return NextResponse.json({ count: 0, average: 0, latest: [] }, { headers: { "Cache-Control": "no-store" } });
    }
}
