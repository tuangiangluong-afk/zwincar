import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: [
        "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
        "/sitemap.xml",
        "/robots.txt",
        "/llms.txt",
        "/openapi.json"
    ],
};

export default async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    let hostname = req.headers.get("host") || "zwincar.com";

    const userAgent = req.headers.get("user-agent") || "";
    if (/Bytespider|PetalBot|AhrefsBot|SemrushBot|MJ12bot|DotBot|DataForSeoBot/i.test(userAgent)) {
        return new NextResponse("Blocked", { status: 403 });
    }

    const isLocal = hostname.includes("localhost") || hostname.includes("127.0.0.1");
    const isVercel = hostname.includes("vercel.app");

    if (!isLocal && !isVercel) {
        const proto = req.headers.get("x-forwarded-proto");
        if (proto === "http") {
             const newUrl = new URL(url.pathname + url.search, `https://${hostname}`);
             return NextResponse.redirect(newUrl, 301);
        }
    }

    hostname = hostname.split(":")[0];
    if (hostname.startsWith("www.")) hostname = hostname.slice(4);

    const isMainHub =
        hostname === "zwincar.com" ||
        hostname === "taxifrance.fr" ||
        hostname.includes("vercel.app") ||
        (hostname.includes("localhost") && !hostname.includes(".localhost"));

    const searchParams = req.nextUrl.searchParams.toString();
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ""}`;

    // A. Sitemap Rewrite
    if (path === "/sitemap.xml") {
        return NextResponse.next();
    }

    // A bis. Assets PWA et page hors ligne : ne doivent jamais être réécrits
    // vers /home (sinon 404 sur les icônes et le fallback offline).
    if (
        path.startsWith("/icons/") ||
        path.startsWith("/offline") ||
        path.startsWith("/favicon") ||
        path.startsWith("/apple-touch-icon") ||
        path.startsWith("/manifest") ||
        path === "/sw.js"
    ) {
        return NextResponse.next();
    }

    // B. LLMs.txt Rewrite
    if (path === "/llms.txt") {
        return NextResponse.rewrite(new URL("/llms.txt", req.url));
    }

    // Main Hub Routing
    if (isMainHub) {
        if (
            path.startsWith("/admin") ||
            path.startsWith("/home") ||
            path.startsWith("/login") ||
            path.startsWith("/maroc") ||
            path.startsWith("/vehicules") ||
            path.startsWith("/vendor") ||
            path.startsWith("/booking") ||
            path.startsWith("/guides") ||
            path.startsWith("/en") ||
            path.startsWith("/es") ||
            path.startsWith("/nl")
        ) {
            return NextResponse.next();
        } else {
            return NextResponse.rewrite(new URL(`/home${path === "/" ? "" : path}`, req.url));
        }
    }

    return NextResponse.next();
}
