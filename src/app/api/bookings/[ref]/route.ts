import { NextResponse } from "next/server";
import { buildVoucher, toPublicBooking } from "@/lib/booking-engine";
import { getBookingStore } from "@/lib/booking-store";
import { authorizeBooking, unauthorized } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ ref: string }> }
) {
    const { ref } = await params;
    const url = new URL(request.url);
    const token = url.searchParams.get("t");
    const email = url.searchParams.get("email");

    const store = getBookingStore();
    const record = await store.get(ref.toUpperCase());

    if (!record) return unauthorized();

    const isAuthorized = authorizeBooking(record, { token, email });

    return NextResponse.json(
        {
            authorized: isAuthorized,
            booking: toPublicBooking(record, { maskPii: !isAuthorized }),
            voucher: buildVoucher(record, { maskPii: !isAuthorized }),
        },
        { headers: { "Cache-Control": "private, no-store" } }
    );
}
