import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";

    const publicDisallows = [
        "/admin/",
        "/api/",
        "/login",
        "/booking/",
        "/vendor/dashboard",
        "/offline",
        "/home/",
        "/author/",
    ];

    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: publicDisallows,
            },
            {
                userAgent: [
                    "GPTBot",
                    "OAI-SearchBot",
                    "ClaudeBot",
                    "PerplexityBot",
                    "Google-Extended",
                    "Applebot-Extended",
                    "CCBot",
                ],
                allow: "/",
                disallow: ["/admin/", "/api/", "/vendor/", "/offline"],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
        host: baseUrl,
    };
}
