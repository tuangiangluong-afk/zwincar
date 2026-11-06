import { NextResponse } from "next/server";
import { dueLifecycleEmails } from "@/lib/booking-engine";
import { getBookingStore } from "@/lib/booking-store";
import { emailDataFromRecord, renderLifecycleEmail, sendEmail } from "@/lib/lifecycle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Cron du cycle de vie (Vercel Cron : "0 * * * *").
 *
 * Idempotent : chaque email porte une clé `REF:type` ; une fois envoyée, elle
 * est stockée dans le dossier et ne repartira jamais. Un doublon Resend ne peut
 * donc pas arriver même si le cron est relancé plusieurs fois.
 *
 * Protection : header `Authorization: Bearer $CRON_SECRET` (Vercel l'envoie
 * automatiquement quand la variable existe). Sans secret configuré, la route
 * refuse de tourner en production.
 */
export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET;
    if (secret) {
        const auth = request.headers.get("authorization");
        if (auth !== `Bearer ${secret}`) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }
    } else if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "CRON_SECRET non configuré" }, { status: 500 });
    }

    const store = getBookingStore();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";
    const now = new Date();
    const MAX_PER_RUN = 50;

    let sent = 0;
    let failed = 0;
    const details: Array<{ ref: string; type: string; result: string }> = [];

    let records;
    try {
        records = await store.list({ status: ["confirmed", "checked_out", "completed"] });
    } catch (error) {
        console.error("Lifecycle list error:", error);
        return NextResponse.json({ error: "Lecture des dossiers impossible" }, { status: 500 });
    }

    for (const record of records) {
        if (sent >= MAX_PER_RUN) break;

        const due = dueLifecycleEmails(record, now, record.lifecycleSent);
        if (due.length === 0) continue;

        const data = emailDataFromRecord(record, origin);
        let recordChanged = false;
        const updated = { ...record, lifecycleSent: [...record.lifecycleSent] };

        for (const email of due) {
            if (sent >= MAX_PER_RUN) break;

            const content = renderLifecycleEmail(email.type, record.locale, data);
            const result = await sendEmail(record.client.email, content);

            if (result.success) {
                updated.lifecycleSent.push(email.key);
                recordChanged = true;
                sent += 1;
                details.push({ ref: record.ref, type: email.type, result: result.simulated ? "simulated" : "sent" });
            } else {
                failed += 1;
                details.push({ ref: record.ref, type: email.type, result: `error: ${result.error}` });
            }
        }

        if (recordChanged) {
            try {
                await store.save({ ...updated, updatedAt: new Date().toISOString() }, record.version);
            } catch (error) {
                console.error("Lifecycle save error:", record.ref, error);
            }
        }
    }

    return NextResponse.json({ ok: true, sent, failed, details }, { headers: { "Cache-Control": "no-store" } });
}
