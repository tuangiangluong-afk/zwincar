import { NextResponse } from 'next/server';
import { MOROCCAN_HUBS, VEHICLE_FLEET } from '@/lib/morocco-data';

export async function GET() {
    const INDEXNOW_KEY = "451408f3764b4c80b96839be70de0056";
    const HOST = "zwincar.com";
    const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

    const locales = ["", "en", "es", "nl"];

    const urls = [
        `https://${HOST}/`,
        ...locales.filter(Boolean).map(l => `https://${HOST}/${l}`),
        // Hub pages in all locales
        ...MOROCCAN_HUBS.flatMap(hub =>
            locales.map(l => l ? `https://${HOST}/${l}/${hub.slug}` : `https://${HOST}/maroc/${hub.slug}`)
        ),
        // Vehicle pages per hub (FR only for brevity — sitemap covers all)
        ...MOROCCAN_HUBS.flatMap(hub =>
            VEHICLE_FLEET.map(v => `https://${HOST}/maroc/${hub.slug}/${v.id}`)
        ),
        // Competitor comparisons in all 4 locales
        ...["discovercars", "bsp-auto", "rentalcars"].flatMap(slug => [
            `https://${HOST}/vs/${slug}`,
            `https://${HOST}/en/vs/${slug}`,
            `https://${HOST}/es/vs/${slug}`,
            `https://${HOST}/nl/vs/${slug}`,
        ]),
    ];

    const payload = {
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls.slice(0, 10000), // IndexNow limit
    };

    try {
        const response = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`IndexNow Error: ${response.statusText}`);
        }

        return NextResponse.json({ success: true, count: urls.length, message: "Ping sent" });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return NextResponse.json({ success: false, error: message }, { status: 500 });
    }
}
