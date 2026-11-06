import { NextResponse } from "next/server";
import type { BookingRecord } from "./booking-engine";
import { getVendorFromToken } from "./vendor-store";

/** IP cliente fiable derrière un proxy (Vercel/Cloudflare). */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0]!.trim();
    return request.headers.get("x-real-ip") ?? "unknown";
}

export function jsonError(message: string, status = 400, extra?: Record<string, unknown>) {
    return NextResponse.json({ error: message, ...extra }, { status });
}

export function unauthorized() {
    return jsonError("Référence ou email invalide", 404);
}

export function tooManyRequests(retryAfterSeconds: number) {
    return NextResponse.json(
        { error: "Trop de requêtes. Réessayez dans quelques instants." },
        { status: 429, headers: { "Retry-After": String(retryAfterSeconds) } }
    );
}

/**
 * Un dossier est accessible avec son token d'accès (URL du voucher) ou avec
 * l'email exact du client. On renvoie 404 dans tous les autres cas pour ne pas
 * permettre d'énumérer les références existantes.
 */
export function authorizeBooking(
    record: BookingRecord | null,
    credentials: { token?: string | null; email?: string | null; vendorToken?: string | null }
): record is BookingRecord {
    if (!record) return false;

    const token = credentials.token?.trim();
    if (token && token.length >= 20 && token === record.accessToken) return true;

    const email = credentials.email?.trim().toLowerCase();
    if (email && email === record.client.email.toLowerCase()) return true;

    if (credentials.vendorToken) {
        const vendor = getVendorFromToken(credentials.vendorToken);
        if (vendor) {
            const hub = record.rental.pickupHub.toLowerCase();
            const vendorHub = vendor.cityHub.toLowerCase();
            if (hub === vendorHub || hub.includes(vendorHub) || vendorHub.includes(hub)) {
                return true;
            }
        }
    }

    return false;
}

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
    try {
        const body = await request.json();
        return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
    } catch {
        return null;
    }
}

/** Deux écritures simultanées : on rejoue une fois avant d'abandonner. */
export async function withRetry<T>(operation: () => Promise<T>, attempts = 2): Promise<T> {
    let lastError: unknown;
    for (let i = 0; i < attempts; i += 1) {
        try {
            return await operation();
        } catch (error) {
            lastError = error;
        }
    }
    throw lastError;
}
