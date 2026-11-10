import test from "node:test";
import assert from "node:assert/strict";
import { VENDOR_I18N } from "../src/lib/vendor-i18n.ts";
import type { VendorLocale } from "../src/lib/vendor-i18n.ts";
import {
    registerVendorAgency,
    authenticateVendor,
    getVendorFromToken,
    getVendorFleet,
} from "../src/lib/vendor-store.ts";

test("VENDOR BILINGUAL: Dictionnaires FR et EN complets et synchronisés", () => {
    const locales: VendorLocale[] = ["fr", "en"];

    for (const loc of locales) {
        const dict = VENDOR_I18N[loc];
        assert.ok(dict, `Dictionnaire ${loc} présent`);

        // Meta
        assert.ok(dict.meta.loginTitle, `meta.loginTitle (${loc})`);
        assert.ok(dict.meta.registerTitle, `meta.registerTitle (${loc})`);

        // Common
        assert.ok(dict.common.partnerCert, `common.partnerCert (${loc})`);
        assert.ok(dict.common.login, `common.login (${loc})`);
        assert.ok(dict.common.becomePartner, `common.becomePartner (${loc})`);

        // Login
        assert.ok(dict.login.title, `login.title (${loc})`);
        assert.ok(dict.login.idLabel, `login.idLabel (${loc})`);
        assert.ok(dict.login.pwdLabel, `login.pwdLabel (${loc})`);
        assert.ok(dict.login.submit, `login.submit (${loc})`);
        assert.ok(dict.login.demoBtn, `login.demoBtn (${loc})`);
        assert.ok(dict.login.errEmptyId, `login.errEmptyId (${loc})`);
        assert.ok(dict.login.errShortPwd, `login.errShortPwd (${loc})`);

        // Register
        assert.ok(dict.register.step1Title, `register.step1Title (${loc})`);
        assert.ok(dict.register.step2Title, `register.step2Title (${loc})`);
        assert.ok(dict.register.agencyNameLabel, `register.agencyNameLabel (${loc})`);
        assert.ok(dict.register.charterText, `register.charterText (${loc})`);
        assert.ok(dict.register.btnNext, `register.btnNext (${loc})`);
        assert.ok(dict.register.btnSubmit, `register.btnSubmit (${loc})`);

        // Popular models
        assert.ok(dict.register.popularModels.length >= 5, `Modèles populaires (${loc})`);
        for (const m of dict.register.popularModels) {
            assert.ok(m.name, `Nom de modèle (${loc})`);
            assert.ok(m.defaultPrice > 0, `Prix indicatif (${loc})`);
        }

        // Errors
        assert.ok(dict.register.errors.agencyName, `register.errors.agencyName (${loc})`);
        assert.ok(dict.register.errors.ice, `register.errors.ice (${loc})`);
        assert.ok(dict.register.errors.password, `register.errors.password (${loc})`);
        assert.ok(dict.register.errors.charter, `register.errors.charter (${loc})`);
    }
});

test("VENDOR BILINGUAL: Inscription et connexion complètes depuis un flux anglophone", async () => {
    const enEmail = `international-agency-${Date.now()}@atlas-rental.com`;
    const enPhone = `+212699${Math.floor(100000 + Math.random() * 900000)}`;

    const registered = await registerVendorAgency({
        agencyName: "Atlas International Fleet SARL",
        cityHub: "agadir",
        iceNumber: "003928174000088",
        managerName: "David Sterling",
        managerPhone: enPhone,
        managerEmail: enEmail,
        password: "RobustVendorPassword2026!",
        firstCar: {
            model: "Dacia Duster 4x4 Prestige",
            plate: "98124-B-28",
            dailyPriceMad: 420,
        },
    });

    assert.ok(registered.agency.id, "ID agence généré pour partenaire anglophone");
    assert.equal(registered.agency.cityHub, "agadir");
    assert.equal(registered.agency.managerName, "David Sterling");

    // Vérification de flotte
    const fleet = getVendorFleet(registered.agency.id);
    assert.equal(fleet.length, 1);
    assert.equal(fleet[0]?.name, "Dacia Duster 4x4 Prestige");
    assert.equal(fleet[0]?.dailyPriceMad, 420);

    // Vérification de token
    const tokenAgency = getVendorFromToken(registered.token);
    assert.ok(tokenAgency, "Session valide pour compte anglophone");
    assert.equal(tokenAgency?.id, registered.agency.id);

    // Login via Email
    const loginRes = await authenticateVendor(enEmail, "RobustVendorPassword2026!");
    assert.ok(loginRes, "Connexion réussie");
    assert.equal(loginRes?.agency.id, registered.agency.id);
});
