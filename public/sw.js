/*
 * ZwinCar — Service Worker
 *
 * Objectif unique : que le client puisse rouvrir son voucher, son point de
 * retrait et le numéro d'urgence même sans réseau (aéroport, parking, médina).
 *
 * Stratégies :
 *  - navigations : réseau d'abord (contenu frais), cache en secours, puis /offline
 *  - /booking/*  : réseau d'abord, cache si hors ligne (le voucher doit rester lisible)
 *  - assets statiques (_next/static, icons) : cache d'abord
 *  - API : jamais mis en cache (écritures, paiements, annulations)
 */

const VERSION = "zwincar-v1";
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;

const PRECACHE = ["/", "/offline", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(STATIC_CACHE)
            .then((cache) => cache.addAll(PRECACHE))
            .catch(() => undefined)
            .then(() => self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((keys) =>
                Promise.all(keys.filter((key) => !key.startsWith(VERSION)).map((key) => caches.delete(key)))
            )
            .then(() => self.clients.claim())
    );
});

function isCacheableAsset(url) {
    return (
        url.pathname.startsWith("/_next/static/") ||
        url.pathname.startsWith("/icons/") ||
        /\.(?:css|js|woff2?|png|jpg|jpeg|svg|webp|avif)$/.test(url.pathname)
    );
}

self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;
    if (url.pathname.startsWith("/api/")) return;
    if (url.pathname === "/sw.js") return;

    if (isCacheableAsset(url)) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    const copy = response.clone();
                    caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
                    return response;
                });
            })
        );
        return;
    }

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const copy = response.clone();
                    caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
                    return response;
                })
                .catch(() =>
                    caches.match(request).then((cached) => {
                        if (cached) return cached;
                        if (url.pathname.startsWith("/booking/")) {
                            return caches.match("/offline");
                        }
                        return caches.match("/offline");
                    })
                )
        );
    }
});

self.addEventListener("message", (event) => {
    if (event.data === "SKIP_WAITING") self.skipWaiting();
});
