
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Redirect legacy URLs with *_com patterns to 410 Gone
  // These are broken URLs that were mistakenly indexed by Google
  async redirects() {
    // List of all tenant slugs that may have been incorrectly used as paths
    const legacyTenantSlugs = [
      'taxiaplaisir_com',
      'taxiasnieres_com',
      'taxiboulogne_com',
      'taxichambourcy_com',
      'taxicolombes_com',
      'taxicourbevoie_com',
      'taxifeucherolles_com',
      'taxifourqueux_com',
      'taxiguyancourt_com',
      'taxiissy_com',
      'taxilepecq_com',
      'taxilevallois_com',
      'taxilevesinet_com',
      'taxilouveciennes_com',
      'taximarly_com',
      'taximontreuil_com',
      'taxineuilly_com',
      'taxipoissy_com',
      'taxirueil_com',
      'taxisaintcloud_com',
      'taxisaintcyr_com',
      'taxisaintdenis_com',
      'taxisaintgermain_com',
      'taxisaintnom_com',
      'taxisaintouen_com',
      'taxisaintquentin_com',
      'taxisversailles_com',
      'taxinanterre_fr',
      'taxivincennes_com',
    ];

    // Generate permanent redirects for all legacy patterns
    // These redirect to homepage with 301 - tells Google to stop crawling
    return [
      ...legacyTenantSlugs.flatMap(slug => [
      // Pattern: /:slug/guides/:path*
      {
        source: `/${slug}/guides/:path*`,
        destination: '/',
        permanent: true,
      },
      // Pattern: /:slug/tarif/:path*
      {
        source: `/${slug}/tarif/:path*`,
        destination: '/',
        permanent: true,
      },
      // Pattern: /:slug/:path* (catch-all for any legacy nested paths)
      {
        source: `/${slug}/:path*`,
        destination: '/',
        permanent: true,
      },
    ]),
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.transparenttextures.com',
      }
    ],
  },
  async headers() {
    return [
      {
        source: "/((?!api|admin|login|_next|sw\.js|manifest\.webmanifest).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Le service worker doit toujours être revalidé, sinon les clients
        // restent bloqués sur une ancienne version du cache.
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
        ],
      },
      {
        source: '/icons/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:;"
          }
        ],
      },
    ]
  },
};

export default nextConfig;
