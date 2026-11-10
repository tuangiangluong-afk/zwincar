import test from "node:test";
import assert from "node:assert/strict";
import {
    registerVendorAgency,
    authenticateVendor,
    getVendorFromToken,
    getVendorFleet,
} from "../src/lib/vendor-store.ts";

test("VENDOR REGISTRATION: Process épuré avec champs essentiels uniquement", async () => {
    const uniqueEmail = `test-loueur-${Date.now()}@marrakech-drive.ma`;
    const uniquePhone = `+212 6 ${Math.floor(10000000 + Math.random() * 90000000)}`;

    // Inscription ultra-simplifiée (zéro paperasse obligatoire)
    const result = await registerVendorAgency({
        agencyName: "Marrakech Express Cars",
        cityHub: "marrakech",
        iceNumber: "003184920000072",
        managerName: "Hicham El Amrani",
        managerPhone: uniquePhone,
        managerEmail: uniqueEmail,
        password: "SuperSecretPassword2026!",
        firstCar: {
            model: "Renault Clio 5 Automatique",
            plate: "55412-A-26",
            dailyPriceMad: 320,
        },
    });

    assert.ok(result.agency.id, "ID agence généré");
    assert.equal(result.agency.agencyName, "Marrakech Express Cars");
    assert.equal(result.agency.cityHub, "marrakech");
    assert.equal(result.agency.managerName, "Hicham El Amrani");
    assert.equal(result.agency.status, "active");
    assert.ok(result.token.startsWith("zwin_vnd_"), "Token de session généré");

    // Vérification de la flotte auto-créée
    const fleet = getVendorFleet(result.agency.id);
    assert.equal(fleet.length, 1);
    assert.equal(fleet[0]?.name, "Renault Clio 5 Automatique");
    assert.equal(fleet[0]?.plate, "55412-A-26");
    assert.equal(fleet[0]?.dailyPriceMad, 320);
    assert.equal(fleet[0]?.status, "available");

    // Vérification de session via token
    const sessionAgency = getVendorFromToken(result.token);
    assert.ok(sessionAgency, "Session valide trouvée par token");
    assert.equal(sessionAgency?.id, result.agency.id);

    // Authentification via Email
    const loginByEmail = await authenticateVendor(uniqueEmail, "SuperSecretPassword2026!");
    assert.ok(loginByEmail, "Connexion par email réussie");
    assert.equal(loginByEmail?.agency.id, result.agency.id);

    // Authentification via Téléphone WhatsApp
    const loginByPhone = await authenticateVendor(uniquePhone, "SuperSecretPassword2026!");
    assert.ok(loginByPhone, "Connexion par WhatsApp réussie");
    assert.equal(loginByPhone?.agency.id, result.agency.id);

    // Rejet en cas de mauvais mot de passe
    const loginWrongPass = await authenticateVendor(uniqueEmail, "MauvaisMotDePasse!");
    assert.equal(loginWrongPass, null, "Rejet du mauvais mot de passe");

    // Rejet en cas d'identifiant inconnu
    const loginUnknown = await authenticateVendor("inconnu@agence.ma", "SuperSecretPassword2026!");
    assert.equal(loginUnknown, null, "Rejet de l'identifiant inconnu");
});

test("VENDOR REGISTRATION: Sécurité et validations obligatoires", async () => {
    // 1. Rejet si nom d'agence manquant
    await assert.rejects(
        () =>
            registerVendorAgency({
                agencyName: "",
                cityHub: "casablanca",
                iceNumber: "001234567890123",
                managerName: "Rachid",
                managerPhone: "+212600000000",
                managerEmail: "rachid@test.ma",
                password: "PasswordSecurise2026!",
                firstCar: { model: "Dacia Sandero", plate: "11111-A-01" },
            }),
        /nom de l'agence est requis/i
    );

    // 2. Rejet si ICE trop court
    await assert.rejects(
        () =>
            registerVendorAgency({
                agencyName: "Casa Auto",
                cityHub: "casablanca",
                iceNumber: "12345",
                managerName: "Rachid",
                managerPhone: "+212600000000",
                managerEmail: "rachid@test.ma",
                password: "PasswordSecurise2026!",
                firstCar: { model: "Dacia Sandero", plate: "11111-A-01" },
            }),
        /Numéro ICE invalide/i
    );

    // 3. Rejet si mot de passe trop court (< 12 caractères)
    await assert.rejects(
        () =>
            registerVendorAgency({
                agencyName: "Casa Auto",
                cityHub: "casablanca",
                iceNumber: "001234567890123",
                managerName: "Rachid",
                managerPhone: "+212600000000",
                managerEmail: "rachid@test.ma",
                password: "court",
                firstCar: { model: "Dacia Sandero", plate: "11111-A-01" },
            }),
        /Mot de passe trop court/i
    );

    // 4. Rejet si plaque d'immatriculation manquante
    await assert.rejects(
        () =>
            registerVendorAgency({
                agencyName: "Casa Auto",
                cityHub: "casablanca",
                iceNumber: "001234567890123",
                managerName: "Rachid",
                managerPhone: "+212600000000",
                managerEmail: "rachid@test.ma",
                password: "PasswordSecurise2026!",
                firstCar: { model: "Dacia Sandero", plate: "" },
            }),
        /immatriculation/i
    );
});
