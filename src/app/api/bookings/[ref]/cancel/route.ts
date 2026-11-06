import { NextResponse } from "next/server";
import { cancellationPolicy, isCancellable } from "@/lib/booking-engine";
import { VersionConflictError, getBookingStore } from "@/lib/booking-store";
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

    if (!isCancellable(record.status)) {
        return jsonError("Ce dossier ne peut plus être annulé en ligne.", 409, { status: record.status });
    }

    const policy = cancellationPolicy(record, new Date());
    if (!policy.allowed) return jsonError(policy.message, 409);

    const now = new Date().toISOString();
    const updated = {
        ...record,
        status: "cancelled" as const,
        updatedAt: now,
        events: [
            ...record.events,
            {
                at: now,
                type: "booking_cancelled",
                actor: "client" as const,
                note: `${policy.tier} · remboursement ${policy.refundEur} €`,
            },
        ],
    };

    try {
        const saved = await store.save(updated, record.version);
        return NextResponse.json(
            { status: saved.status, policy, refundEur: policy.refundEur, creditNoteEur: policy.creditNoteEur },
            { headers: { "Cache-Control": "private, no-store" } }
        );
    } catch (error) {
        if (error instanceof VersionConflictError) {
            return jsonError("Le dossier a changé entre-temps, rechargez la page.", 409);
        }
        console.error("Cancel error:", error);
        return jsonError("Annulation impossible pour le moment.", 500);
    }
}
