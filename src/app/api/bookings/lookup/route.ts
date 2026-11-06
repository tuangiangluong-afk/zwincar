import { NextResponse } from "next/server";
import { getBookingStore } from "@/lib/booking-store";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp, jsonError, readJson, tooManyRequests } from "@/lib/api-helpers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function maskEmail(email: string): string {
    const parts = email.split("@");
    if (parts.length !== 2) return "***@***.***";
    const [user, domain] = parts;
    const maskedUser = user.length <= 2 ? `${user[0]}*` : `${user[0]}***${user[user.length - 1]}`;
    return `${maskedUser}@${domain}`;
}

export async function POST(request: Request) {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`bookings:lookup:${ip}`, 12, 10 * 60 * 1000);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSeconds);

    const body = await readJson(request);
    if (!body) return jsonError("Corps de requête invalide", 400);

    const rawRef = typeof body.ref === "string" ? body.ref.trim().toUpperCase() : "";
    const rawEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!rawRef && !rawEmail) {
        return jsonError("Veuillez renseigner votre référence de réservation (ZW-...) ou votre adresse email.", 422);
    }

    const store = getBookingStore();
    const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";

    // 1. Recherche avec référence exacte
    if (rawRef) {
        const record = await store.get(rawRef);
        if (!record) {
            return jsonError("Aucun dossier trouvé pour cette référence.", 404);
        }

        // Si l'email est également fourni, on vérifie la correspondance
        if (rawEmail) {
            if (record.client.email.toLowerCase() !== rawEmail) {
                return jsonError("L'adresse email ne correspond pas à cette référence de dossier.", 403);
            }
            return NextResponse.json({
                found: true,
                ref: record.ref,
                status: record.status,
                vehicleName: record.rental.vehicleName,
                hubName: record.rental.hubName,
                dates: `${record.rental.pickupDate} → ${record.rental.returnDate}`,
                url: `${origin}/booking/${record.ref}?t=${record.accessToken}`,
            });
        }

        // Si seulement la référence est fournie, on masque l'email pour protéger la vie privée
        return NextResponse.json({
            found: true,
            requiresEmail: true,
            ref: record.ref,
            vehicleName: record.rental.vehicleName,
            maskedEmail: maskEmail(record.client.email),
        });
    }

    // 2. Recherche par email seul
    if (rawEmail) {
        const bookings = await store.list({ email: rawEmail });
        if (bookings.length === 0) {
            return jsonError("Aucune réservation trouvée pour cette adresse email.", 404);
        }

        // Trier par date la plus récente
        bookings.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

        return NextResponse.json({
            found: true,
            count: bookings.length,
            bookings: bookings.map((b) => ({
                ref: b.ref,
                status: b.status,
                vehicleName: b.rental.vehicleName,
                hubName: b.rental.hubName,
                pickupDate: b.rental.pickupDate,
                returnDate: b.rental.returnDate,
                // Security: email-only lookup returns URL without accessToken.
                // Client uses email auth on the voucher page instead.
                url: `${origin}/booking/${b.ref}?email=${encodeURIComponent(rawEmail)}`,
            })),
        });
    }

    return jsonError("Requête invalide", 400);
}
