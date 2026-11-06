/**
 * Test end-to-end du parcours de location contre un serveur réel.
 * Usage : E2E_BASE=http://127.0.0.1:3100 node scripts/e2e-booking.mjs
 */
const BASE = process.env.E2E_BASE || "http://127.0.0.1:3100";

let passed = 0;
const failures = [];

function check(condition, label, detail) {
    if (condition) {
        passed += 1;
        console.log(`  ok   ${label}`);
    } else {
        failures.push(label);
        console.log(`  FAIL ${label}${detail ? ` — ${JSON.stringify(detail)}` : ""}`);
    }
}

async function api(path, options = {}) {
    const response = await fetch(`${BASE}${path}`, {
        ...options,
        headers: { "Content-Type": "application/json", ...(options.headers ?? {}) },
    });
    const text = await response.text();
    let body = null;
    try {
        body = JSON.parse(text);
    } catch {
        body = text;
    }
    return { status: response.status, body, headers: response.headers };
}

const basePayload = {
    vehicleId: "dacia-sandero-stepway",
    pickupHub: "marrakech",
    returnHub: "marrakech",
    pickupDate: "2026-12-10",
    pickupTime: "10:00",
    returnDate: "2026-12-17",
    returnTime: "10:00",
    upsells: ["franchise-zero", "esim-maroc"],
    currency: "EUR",
    locale: "fr",
    client: {
        fullName: "Thomas Martin",
        email: "thomas.martin@example.com",
        phone: "+33 6 12 34 56 78",
        flightNumber: "FR2104",
        notes: "Livraison Terminal 1",
    },
};

console.log(`\n=== ZwinCar E2E — ${BASE} ===\n`);

// 1. Création
console.log("1. Création du dossier");
const created = await api("/api/bookings", { method: "POST", body: JSON.stringify(basePayload) });
check(created.status === 201, "POST /api/bookings → 201", created.body);
const ref = created.body?.booking?.ref;
const token = created.body?.accessToken;
check(/^ZW-\d{5}[0-9A-Z]$/.test(ref ?? ""), "référence au bon format", ref);
check(typeof token === "string" && token.length === 48, "token d'accès 48 caractères", token?.length);
check(created.body?.booking?.quote?.totalEur > 0, "prix calculé côté serveur", created.body?.booking?.quote?.totalEur);

const quote = created.body.booking.quote;
check(quote.seasonMultiplier === 1.25, "haute saison décembre appliquée", quote.seasonMultiplier);
check(quote.discountRate === 0.1, "remise 7 jours appliquée", quote.discountRate);
check(quote.depositEur === 0, "Franchise Zéro → caution 0 €", quote.depositEur);
check(quote.acompteEur + quote.balanceEur === quote.totalEur, "acompte + solde = total", quote);

// 2. Lecture protégée
console.log("\n2. Lecture du dossier");
const noAuth = await api(`/api/bookings/${ref}`);
check(noAuth.status === 404, "sans token → 404 (anti-énumération)", noAuth.status);

const wrongToken = await api(`/api/bookings/${ref}?t=${"f".repeat(48)}`);
check(wrongToken.status === 404, "mauvais token → 404", wrongToken.status);

const authorized = await api(`/api/bookings/${ref}?t=${token}`);
check(authorized.status === 200, "avec token → 200", authorized.status);
check(authorized.body?.booking?.status === "awaiting_payment", "statut initial awaiting_payment", authorized.body?.booking?.status);
check(!JSON.stringify(authorized.body).includes(token), "le token n'est pas renvoyé");

// 3. Paiement : montant serveur imposé
console.log("\n3. Sécurité du paiement");
const forged = await api("/api/stripe/checkout", {
    method: "POST",
    body: JSON.stringify({ ref, token, amountEur: 1 }),
});
check(forged.status === 200 && forged.body?.amountEur === quote.acompteEur,
    "montant client ignoré, acompte serveur utilisé",
    { status: forged.status, amountEur: forged.body?.amountEur });

const unknownRef = await api("/api/stripe/checkout", {
    method: "POST",
    body: JSON.stringify({ ref: "ZW-00000X", amountEur: 1 }),
});
check(unknownRef.status === 404, "référence inconnue → 404", unknownRef.status);

// 4. Modification de dates
console.log("\n4. Modification des dates");
const modify = await api(`/api/bookings/${ref}/modify`, {
    method: "POST",
    body: JSON.stringify({
        token,
        pickupDate: "2026-12-08",
        pickupTime: "10:00",
        returnDate: "2026-12-11",
        returnTime: "10:00",
    }),
});
check(modify.status === 200, "modification acceptée", modify.body);
check(modify.body?.quote?.days === 3, "3 jours après modification", modify.body?.quote?.days);
check(modify.body?.newBalanceEur >= 0, "nouveau solde cohérent", modify.body?.newBalanceEur);

const badDates = await api(`/api/bookings/${ref}/modify`, {
    method: "POST",
    body: JSON.stringify({ token, pickupDate: "2020-01-01", pickupTime: "10:00", returnDate: "2020-01-02", returnTime: "10:00" }),
});
check(badDates.status === 409, "dates passées refusées", badDates.status);

// 5. Check-out impossible avant check-in
console.log("\n5. Garde-fous de la machine à états");
const earlyCheckout = await api(`/api/bookings/${ref}/checkout`, {
    method: "POST",
    body: JSON.stringify({ token, fuelOnReturn: "1/2", mileageOnReturn: 46000 }),
});
check(earlyCheckout.status === 409, "check-out sans check-in → 409", earlyCheckout.status);

// 6. Annulation
console.log("\n6. Annulation");
const cancel = await api(`/api/bookings/${ref}/cancel`, {
    method: "POST",
    body: JSON.stringify({ token }),
});
check(cancel.status === 200, "annulation acceptée", cancel.body);
const afterCancel = await api(`/api/bookings/${ref}?t=${token}`);
check(afterCancel.body?.booking?.status === "cancelled", "statut passé à cancelled", afterCancel.body?.booking?.status);

const cancelTwice = await api(`/api/bookings/${ref}/cancel`, {
    method: "POST",
    body: JSON.stringify({ token }),
});
check(cancelTwice.status === 409, "double annulation refusée", cancelTwice.status);

// 7. Parcours remise / restitution
console.log("\n7. Check-in puis check-out");
const second = await api("/api/bookings", { method: "POST", body: JSON.stringify(basePayload) });
const ref2 = second.body?.booking?.ref;
const token2 = second.body?.accessToken;
check(second.status === 201, "second dossier créé", second.status);

const secondPayment = await api("/api/stripe/checkout", {
    method: "POST",
    body: JSON.stringify({ ref: ref2, token: token2 }),
});
check(secondPayment.status === 200, "paiement simulé accepté (opt-in démo)", secondPayment.body);
check(secondPayment.body?.isMock === true, "mode démo signalé explicitement", secondPayment.body?.isMock);
check(secondPayment.body?.amountEur === second.body?.booking?.quote?.acompteEur, "montant = acompte du dossier", {
    server: secondPayment.body?.amountEur,
    quote: second.body?.booking?.quote?.acompteEur,
});

const badCheckin = await api(`/api/bookings/${ref2}/checkin`, {
    method: "POST",
    body: JSON.stringify({
        token: token2,
        driverAge: 19,
        licenseIssuedAt: "2025-06-01",
        fuelLevel: "1/2",
        mileageKm: 45000,
        photos: 2,
        contractSigned: false,
        balanceCollected: false,
    }),
});
check(badCheckin.status === 422, "check-in incomplet refusé", badCheckin.status);
check((badCheckin.body?.issues ?? []).length >= 4, "toutes les anomalies listées", badCheckin.body?.issues?.length);

const checkin = await api(`/api/bookings/${ref2}/checkin`, {
    method: "POST",
    body: JSON.stringify({
        token: token2,
        driverAge: 34,
        licenseIssuedAt: "2015-06-01",
        fuelLevel: "1/2",
        mileageKm: 45000,
        photos: 6,
        contractSigned: true,
        balanceCollected: true,
    }),
});
check(checkin.status === 200, "check-in valide → 200", checkin.body);
check(checkin.body?.depositRequiredEur === 0, "aucune caution (Franchise Zéro)", checkin.body?.depositRequiredEur);

const checkout = await api(`/api/bookings/${ref2}/checkout`, {
    method: "POST",
    body: JSON.stringify({
        token: token2,
        fuelOnReturn: "1/4",
        mileageOnReturn: 47500,
        damageEur: 0,
        lateMinutes: 0,
        photos: 6,
    }),
});
check(checkout.status === 200, "check-out → 200", checkout.body);
check(checkout.body?.settlement?.extraKm === 750, "750 km au-delà du forfait", checkout.body?.settlement?.extraKm);
check(checkout.body?.settlement?.includedKm === 1750, "forfait 250 km/j × 7 jours", checkout.body?.settlement?.includedKm);
check(checkout.body?.settlement?.fuelPenaltyEur === 15, "pénalité carburant 15 €", checkout.body?.settlement?.fuelPenaltyEur);
check(checkout.body?.status === "completed", "dossier terminé", checkout.body?.status);

const finalState = await api(`/api/bookings/${ref2}?t=${token2}`);
check(finalState.body?.booking?.status === "completed", "statut final completed", finalState.body?.booking?.status);

// 8. Validation des entrées
console.log("\n8. Validation");
const invalid = await api("/api/bookings", {
    method: "POST",
    body: JSON.stringify({ ...basePayload, client: { ...basePayload.client, email: "pas-un-email" } }),
});
check(invalid.status === 422, "email invalide → 422", invalid.status);

const badOption = await api("/api/bookings", {
    method: "POST",
    body: JSON.stringify({ ...basePayload, upsells: ["vol-gratuit"] }),
});
check(badOption.status === 422, "option inconnue → 422", badOption.status);

// 9. PWA
console.log("\n9. PWA & assets");
const manifest = await fetch(`${BASE}/manifest.webmanifest`);
const manifestBody = await manifest.json().catch(() => ({}));
check(manifest.status === 200, "manifest servi", manifest.status);
check(manifestBody?.name?.includes("ZwinCar"), "nom du manifest", manifestBody?.name);
check((manifestBody?.icons ?? []).length >= 3, "icônes déclarées", manifestBody?.icons?.length);

const sw = await fetch(`${BASE}/sw.js`);
check(sw.status === 200, "service worker servi", sw.status);
check((sw.headers.get("cache-control") ?? "").includes("no-cache"), "sw.js non mis en cache", sw.headers.get("cache-control"));
check((sw.headers.get("service-worker-allowed") ?? "") === "/", "scope service worker", sw.headers.get("service-worker-allowed"));

for (const asset of ["/icons/icon-192.png", "/icons/icon-512.png", "/icons/maskable-512.png", "/icons/apple-touch-icon.png"]) {
    const response = await fetch(`${BASE}${asset}`);
    check(response.status === 200 && (response.headers.get("content-type") ?? "").includes("image/png"), `${asset} → 200 image/png`);
}

const offline = await fetch(`${BASE}/offline`);
check(offline.status === 200, "page /offline disponible", offline.status);

// 10. Limitation de débit
console.log("\n10. Limitation de débit");
let sawRateLimit = false;
for (let i = 0; i < 12; i += 1) {
    const response = await api("/api/bookings", {
        method: "POST",
        body: JSON.stringify({ ...basePayload, client: { ...basePayload.client, email: `burst${i}@example.com` } }),
    });
    if (response.status === 429) {
        sawRateLimit = true;
        break;
    }
}
check(sawRateLimit, "spam de création bloqué (429)");

console.log(`\n=== Résultat : ${passed} vérifications OK, ${failures.length} échec(s) ===`);
if (failures.length > 0) {
    console.log("Échecs :", failures);
    process.exit(1);
}
