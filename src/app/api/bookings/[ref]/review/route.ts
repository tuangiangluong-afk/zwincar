import { NextResponse } from "next/server";
import { REVIEWABLE_STATUSES, parseReview } from "@/lib/booking-engine";
import { VersionConflictError, getBookingStore } from "@/lib/booking-store";
import { authorizeBooking, jsonError, readJson, unauthorized } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ ref: string }> }) {
    const { ref } = await params;
    const body = (await readJson(request)) ?? {};

    const store = getBookingStore();
    const record = await store.get(ref.toUpperCase());

    // Token du voucher uniquement : l'email seul ne suffit pas pour publier un avis.
    const token = typeof body.token === "string" ? body.token : null;
    if (!authorizeBooking(record, { token })) return unauthorized();

    if (!REVIEWABLE_STATUSES.includes(record.status)) {
        return jsonError("L'avis s'ouvre après la restitution du véhicule.", 409);
    }
    if (record.review) return jsonError("Un avis a déjà été laissé pour ce dossier.", 409);

    const review = parseReview(body);
    if (typeof review === "string") return jsonError(review, 400);

    const now = new Date().toISOString();
    try {
        await store.save(
            {
                ...record,
                review: { at: now, ...review },
                updatedAt: now,
                events: [...record.events, { at: now, type: "review_submitted", actor: "client" as const, note: `${review.rating}/5` }],
            },
            record.version
        );
    } catch (error) {
        if (error instanceof VersionConflictError) return jsonError("Dossier modifié entre-temps, réessayez.", 409);
        console.error("Review save error:", ref, error);
        return jsonError("Enregistrement impossible.", 500);
    }

    return NextResponse.json({ ok: true, rating: review.rating }, { headers: { "Cache-Control": "private, no-store" } });
}
