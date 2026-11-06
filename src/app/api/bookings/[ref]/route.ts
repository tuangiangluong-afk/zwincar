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

    if (!authorizeBooking(record, { token, email })) return unauthorized();

    return NextResponse.json(
        { booking: toPublicBooking(record), voucher: buildVoucher(record) },
        { headers: { "Cache-Control": "private, no-store" } }
    );
}
