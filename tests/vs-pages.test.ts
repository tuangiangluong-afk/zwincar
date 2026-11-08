import test from "node:test";
import assert from "node:assert/strict";

import { VS_COMPETITORS, getVsComparison, getVsMetadata } from "../src/lib/vs-data.ts";

const LOCALES = ["fr", "en", "es", "nl"] as const;
const EXPECTED_SLUGS = ["discovercars", "bsp-auto", "rentalcars"];

test("VS_COMPETITORS has exactly 3 entries with correct slugs", () => {
    assert.deepStrictEqual(
        VS_COMPETITORS.map((c) => c.slug),
        EXPECTED_SLUGS,
    );
});

test("getVsComparison returns data for valid slugs, undefined for unknown", () => {
    for (const slug of EXPECTED_SLUGS) {
        const c = getVsComparison(slug);
        assert.ok(c, `missing comparison for ${slug}`);
        assert.equal(c.slug, slug);
    }
    assert.equal(getVsComparison("hertz"), undefined);
});

test("every comparison has all 4 locales populated in every text field", () => {
    for (const c of VS_COMPETITORS) {
        for (const locale of LOCALES) {
            assert.ok(c.titles[locale]?.length > 5, `${c.slug} titles.${locale} empty`);
            assert.ok(c.metaDescriptions[locale]?.length > 10, `${c.slug} metaDescriptions.${locale} empty`);
            assert.ok(c.heroH1[locale]?.length > 5, `${c.slug} heroH1.${locale} empty`);
            assert.ok(c.heroSubtitle[locale]?.length > 10, `${c.slug} heroSubtitle.${locale} empty`);
            assert.ok(c.keyTakeaway[locale]?.length > 20, `${c.slug} keyTakeaway.${locale} empty`);
            assert.ok(c.forensicSection.title[locale]?.length > 5, `${c.slug} forensicSection.title.${locale} empty`);
            assert.ok(c.forensicSection.paragraphs[locale]?.length >= 3, `${c.slug} forensicSection.${locale} < 3 paragraphs`);

            for (const row of c.comparisonRows) {
                assert.ok(row.label[locale], `${c.slug} row label.${locale} empty`);
                assert.ok(row.competitorValue[locale], `${c.slug} row competitorValue.${locale} empty`);
                assert.ok(row.zwincarValue[locale], `${c.slug} row zwincarValue.${locale} empty`);
            }

            for (const faq of c.faqs) {
                assert.ok(faq.q[locale], `${c.slug} faq q.${locale} empty`);
                assert.ok(faq.a[locale], `${c.slug} faq a.${locale} empty`);
            }
        }
    }
});

test("getVsMetadata returns correct canonical and hreflang for each locale", () => {
    for (const slug of EXPECTED_SLUGS) {
        for (const locale of LOCALES) {
            const meta = getVsMetadata(slug, locale);
            assert.ok(meta.title && meta.title !== "Not Found", `${slug} ${locale} title is Not Found`);
            const canon = (meta as any).alternates?.canonical;
            if (locale === "fr") assert.ok(canon?.endsWith(`/vs/${slug}`), `${slug} fr canonical wrong: ${canon}`);
            if (locale === "en") assert.ok(canon?.endsWith(`/en/vs/${slug}`), `${slug} en canonical wrong: ${canon}`);
            if (locale === "es") assert.ok(canon?.endsWith(`/es/vs/${slug}`), `${slug} es canonical wrong: ${canon}`);
            if (locale === "nl") assert.ok(canon?.endsWith(`/nl/vs/${slug}`), `${slug} nl canonical wrong: ${canon}`);

            const langs = (meta as any).alternates?.languages;
            assert.ok(langs?.fr, `${slug} ${locale} missing fr hreflang`);
            assert.ok(langs?.en, `${slug} ${locale} missing en hreflang`);
            assert.ok(langs?.es, `${slug} ${locale} missing es hreflang`);
            assert.ok(langs?.nl, `${slug} ${locale} missing nl hreflang`);
            assert.ok(langs?.["x-default"], `${slug} ${locale} missing x-default hreflang`);
        }
    }
});
