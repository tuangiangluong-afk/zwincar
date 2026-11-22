import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SchemaJSON from "@/components/SchemaJSON";
import { ACOMPTE_RATE, DEFAULT_STANDARD_DEPOSIT_EUR } from "@/lib/booking-engine";
import { pricesByCategory, seasonalFrom, weekExample, hubPrices } from "@/lib/price-index";

type L = "fr" | "en";
const MONTHS: Record<L, string[]> = {
    fr: ["", "janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    en: ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};

/** Page de données citable : tous les chiffres sortent du catalogue et du moteur de prix réel. */
export default function PriceIndexPage({ locale }: { locale: L }) {
    const fr = locale === "fr";
    const cats = pricesByCategory();
    const seasons = seasonalFrom();
    const week = weekExample();
    const hubs = hubPrices();
    const cheapest = seasons[0];
    const priciest = seasons[seasons.length - 1];
    const acompte = Math.round(ACOMPTE_RATE * 100);
    const monthList = (m: number[]) => (m.length ? m.map((n) => MONTHS[locale][n]).join(", ") : fr ? "autres mois" : "other months");
    const hubHref = (slug: string) => (fr ? `/maroc/${slug}` : `/en/${slug}`);

    const faqs = fr
        ? [
              { q: "Combien coûte une location de voiture au Maroc ?", a: `Chez ZwinCar, à partir de ${cats[0].fromEur} € par jour pour une citadine (${cats[0].cheapest}) en saison standard. Une semaine coûte ${week.totalEur} € avec la remise de 10 % dès 7 jours.` },
              { q: "Quand louer une voiture au Maroc au meilleur prix ?", a: `En ${monthList(cheapest.months)} : les prix sont ${Math.round((1 - cheapest.multiplier) * 100)} % sous la saison standard. Les plus chers sont ${monthList(priciest.months)} (+${Math.round((priciest.multiplier - 1) * 100)} %).` },
              { q: "Faut-il payer une caution ?", a: `0 € avec l'option Franchise Zéro (8 €/jour), sinon ${DEFAULT_STANDARD_DEPOSIT_EUR} € en espèces ou carte de débit, rendus au retour. On paie ${acompte} % en ligne et le reste à la remise des clés.` },
          ]
        : [
              { q: "How much does it cost to rent a car in Morocco?", a: `With ZwinCar, from €${cats[0].fromEur} per day for a city car (${cats[0].cheapest}) in standard season. A week costs €${week.totalEur} with the 10% discount from 7 days.` },
              { q: "When is car rental cheapest in Morocco?", a: `In ${monthList(cheapest.months)}: prices are ${Math.round((1 - cheapest.multiplier) * 100)}% below standard season. The most expensive months are ${monthList(priciest.months)} (+${Math.round((priciest.multiplier - 1) * 100)}%).` },
              { q: "Do I have to pay a deposit?", a: `€0 with the Zero-Excess option (€8/day), otherwise €${DEFAULT_STANDARD_DEPOSIT_EUR} in cash or by debit card, returned at drop-off. You pay ${acompte}% online and the rest when you collect the keys.` },
          ];

    const th = "text-left font-semibold text-slate-700 px-3 py-2 border-b border-[#E7DFD5]";
    const td = "px-3 py-2 border-b border-[#F0EAE1]";
    const tdPrice = `${td} font-mono font-bold whitespace-nowrap`;

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#12161E]">
            <SchemaJSON
                type="FAQPage"
                faqs={faqs}
                breadcrumbItems={[
                    { name: fr ? "Accueil" : "Home", item: fr ? "https://zwincar.com" : "https://zwincar.com/en" },
                    { name: fr ? "Prix location voiture Maroc" : "Car rental prices Morocco", item: fr ? "https://zwincar.com/prix-location-voiture-maroc" : "https://zwincar.com/en/car-rental-prices-morocco" },
                ]}
            />
            <Header locale={locale} />
            <main className="container mx-auto px-4 max-w-4xl py-10 space-y-10">
                <header className="space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                        {fr ? "Prix d'une location de voiture au Maroc en 2026" : "Car rental prices in Morocco (2026)"}
                    </h1>
                    {/* Réponse directe en tête : c'est ce paragraphe que les moteurs extraient. */}
                    <p className="text-base text-slate-700 leading-relaxed">{faqs[0].a} {faqs[1].a}</p>
                    <p className="text-xs text-slate-500">
                        {fr
                            ? "Tarifs ZwinCar calculés avec le même moteur que nos devis en ligne. Mis à jour à chaque changement de tarif."
                            : "ZwinCar rates computed with the same engine as our online quotes. Updated whenever rates change."}
                    </p>
                </header>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold">{fr ? "Prix par catégorie de voiture (par jour)" : "Price by car category (per day)"}</h2>
                    <div className="overflow-x-auto rounded-2xl bg-white border border-[#E7DFD5]">
                        <table className="w-full text-sm">
                            <thead><tr><th className={th}>{fr ? "Catégorie" : "Category"}</th><th className={th}>{fr ? "Dès" : "From"}</th><th className={th}>{fr ? "Modèle le moins cher" : "Cheapest model"}</th></tr></thead>
                            <tbody>
                                {cats.map((c) => (
                                    <tr key={c.category}><td className={td}>{fr ? c.category : c.categoryEn}</td><td className={tdPrice}>{c.fromEur} €</td><td className={td}>{c.cheapest}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold">{fr ? "Prix selon la saison" : "Price by season"}</h2>
                    <div className="overflow-x-auto rounded-2xl bg-white border border-[#E7DFD5]">
                        <table className="w-full text-sm">
                            <thead><tr><th className={th}>{fr ? "Mois de prise en charge" : "Pick-up month"}</th><th className={th}>{fr ? "Variation" : "Change"}</th><th className={th}>{fr ? "Citadine dès" : "City car from"}</th></tr></thead>
                            <tbody>
                                {seasons.map((s) => (
                                    <tr key={s.multiplier}>
                                        <td className={td}>{monthList(s.months)}</td>
                                        <td className={td}>{s.multiplier === 1 ? "—" : `${s.multiplier > 1 ? "+" : ""}${Math.round((s.multiplier - 1) * 100)} %`}</td>
                                        <td className={tdPrice}>{s.fromEur} €</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold">{fr ? "Prix moyen par ville" : "Average price by city"}</h2>
                    <div className="overflow-x-auto rounded-2xl bg-white border border-[#E7DFD5]">
                        <table className="w-full text-sm">
                            <thead><tr><th className={th}>{fr ? "Ville (aéroport)" : "City (airport)"}</th><th className={th}>{fr ? "Prix moyen / jour" : "Average / day"}</th></tr></thead>
                            <tbody>
                                {hubs.map((h) => (
                                    <tr key={h.slug}>
                                        <td className={td}><Link href={hubHref(h.slug)} className="text-[#C9572C] font-semibold underline">{h.name} ({h.airportCode})</Link></td>
                                        <td className={tdPrice}>{h.avgDailyEur} €</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="space-y-3">
                    <h2 className="text-xl font-bold">{fr ? "Exemple : une semaine de location" : "Example: a one-week rental"}</h2>
                    <p className="text-sm text-slate-700 leading-relaxed">
                        {fr
                            ? `${week.vehicle}, ${week.days} jours en saison standard : ${week.totalEur} € au total (${week.dailyEur} €/jour après la remise de 10 %). Acompte en ligne : ${Math.round(week.totalEur * ACOMPTE_RATE)} €, le reste à la remise des clés.`
                            : `${week.vehicle}, ${week.days} days in standard season: €${week.totalEur} in total (€${week.dailyEur}/day after the 10% discount). Online deposit: €${Math.round(week.totalEur * ACOMPTE_RATE)}, the rest at key handover.`}
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-bold">{fr ? "Questions fréquentes" : "FAQ"}</h2>
                    {faqs.map((f) => (
                        <div key={f.q} className="rounded-2xl bg-white border border-[#E7DFD5] p-4">
                            <h3 className="font-bold">{f.q}</h3>
                            <p className="text-sm text-slate-700 mt-1 leading-relaxed">{f.a}</p>
                        </div>
                    ))}
                </section>
            </main>
            <Footer locale={locale} />
        </div>
    );
}
