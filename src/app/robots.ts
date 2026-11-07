import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/admin/",
                    "/api/",
                    "/login",
                    "/booking/",
                    "/vendor/dashboard",
                    "/offline",
                    "/home/",
                    "/author/",
                ],
            },
            {
                userAgent: [
                    "GPTBot",
                    "ClaudeBot",
                    "PerplexityBot",
                    "CCBot",
                    "Applebot-Extended",
                    "Google-Extended",
                ],
                allow: ["/", "/llms.txt", "/guides/", "/en/guides/", "/maroc/"],
                disallow: ["/admin/", "/api/", "/vendor/", "/offline", "/home/", "/author/"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
