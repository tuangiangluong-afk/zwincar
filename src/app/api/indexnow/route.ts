import { NextResponse } from 'next/server';
import { NATIONAL_TARGETS } from '@/config/national-targets';
import { SEO_GARES } from '@/lib/seo-gares';

export async function GET() {
    const INDEXNOW_KEY = "451408f3764b4c80b96839be70de0056";
    const HOST = "taxifrance.fr";
    const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;

    // Collect all URLs to ping
    const urls = [
        `https://${HOST}/`,
        ...NATIONAL_TARGETS.map(t => `https://${HOST}/ville/${t.slug}`),
        ...SEO_GARES.map(g => `https://${HOST}/gare/${g.slug}`)
    ];

    // Prepare IndexNow payload
    const payload = {
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls
    };

    try {
        // Ping Bing (Shared with Yandex and others)
        const response = await fetch("https://api.indexnow.org/indexnow", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`IndexNow Error: ${response.statusText}`);
        }

        return NextResponse.json({
            success: true,
            provider: "IndexNow",
            count: urls.length,
            message: "Ping sent successfully"
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
