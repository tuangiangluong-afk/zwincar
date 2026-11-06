import type { MetadataRoute } from "next";

/**
 * Manifest PWA — installable sur iOS et Android depuis le navigateur.
 * Pas d'App Store, pas de friction : le client garde son voucher hors ligne.
 */
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "ZwinCar — Location de voiture au Maroc",
        short_name: "ZwinCar",
        description:
            "Location de voiture au Maroc sans caution abusive. Agences locales vérifiées, livraison aéroport et riad, assistance WhatsApp 24/7.",
        start_url: "/?utm_source=pwa",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#FAF7F2",
        theme_color: "#C9572C",
        lang: "fr",
        dir: "ltr",
        categories: ["travel", "shopping"],
        icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        shortcuts: [
            { name: "Voir les véhicules", short_name: "Véhicules", url: "/maroc/marrakech" },
            { name: "Mon voucher", short_name: "Voucher", url: "/booking" },
            { name: "WhatsApp 24/7", short_name: "WhatsApp", url: "https://wa.me/212600000000" },
        ],
    };
}
