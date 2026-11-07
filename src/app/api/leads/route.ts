import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Silent lead capture — fires on WhatsApp CTA click.
 * Logs vehicle/hub/dates/price so no lead is lost when a desktop user
 * closes the wa.me tab without sending the message.
 *
 * POST /api/leads  { vehicle, hub, pickupDate, returnDate, days, price, currency, upsells, ts }
 */
export async function POST(request: Request) {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`leads:${ip}`, 20, 60_000);
    if (!limit.allowed) return NextResponse.json({ ok: false }, { status: 429 });

    try {
        const body = await request.json();

        // Log to stdout for now — picked up by Vercel Logs / any log drain
        console.log(
            "[lead-capture]",
            JSON.stringify({
                vehicle: body.vehicle,
                hub: body.hub,
                pickupDate: body.pickupDate,
                returnDate: body.returnDate,
                days: body.days,
                price: body.price,
                currency: body.currency,
                upsells: body.upsells,
                ip,
                ts: body.ts || new Date().toISOString(),
            })
        );

        // shortcut: upgrade to Supabase insert when lead volume justifies a table
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ ok: false }, { status: 400 });
    }
}
