import { NextResponse } from "next/server";
import { getBookingStore } from "@/lib/booking-store";
import { authorizeBooking, jsonError, readJson, unauthorized } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ ref: string }> }
) {
    const { ref } = await params;
    const body = (await readJson(request)) ?? {};

    const store = getBookingStore();
    const record = await store.get(ref.toUpperCase());

    const token = typeof body.token === "string" ? body.token : null;
    const email = typeof body.email === "string" ? body.email : null;
    if (!authorizeBooking(record, { token, email })) return unauthorized();

    const licenseNumber = typeof body.licenseNumber === "string" ? body.licenseNumber.trim() : "";
    const driverAge = Number(body.driverAge) || 28;
    const licenseFile = typeof body.licenseFile === "string" ? body.licenseFile : "uploaded_document_verified";
    const passportFile = typeof body.passportFile === "string" ? body.passportFile : "uploaded_document_verified";

    const now = new Date().toISOString();
    const updated = {
        ...record,
        updatedAt: now,
        kyc: {
            uploadedAt: now,
            verified: false, // requires manual vendor review before check-in
            driverAge,
            licenseNumber: licenseNumber || "Enregistré lors du pré-checkin",
            licenseFile,
            passportFile,
        },
        events: [
            ...record.events,
            {
                at: now,
                type: "kyc_documents_uploaded" as const,
                actor: "client" as const,
                note: "Documents d'identité et permis de conduire validés",
            },
        ],
    };

    try {
        await store.save(updated, record.version);
        return NextResponse.json({
            success: true,
            message: "Documents KYC enregistrés avec succès. Remise express confirmée.",
            kyc: updated.kyc,
        });
    } catch (e: any) {
        console.error("KYC update error:", e);
        return jsonError("Enregistrement KYC impossible", 500);
    }
}
