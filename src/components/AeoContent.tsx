import { CityConfig } from "@/lib/db";
import { getHelpfulContent, getHelpfulList } from "@/lib/content";
import { Lightbulb, CheckCircle2, Newspaper, Scale, Sparkles } from "lucide-react";
import Link from "next/link";

interface AeoContentProps {
    city: CityConfig;
}

/**
 * AEO / GEO content blocks rendered on every city page:
 * - Conseils & astuces pratiques (citation-ready content)
 * - Comparatif Taxi vs Uber vs VTC vs Bus
 * - "Le saviez-vous" local knowledge
 * - Actualités & fraîcheur
 * All content is deterministic per city (seeded), unique and helpful.
 */
export function AeoContent({ city }: AeoContentProps) {
    const conseilsTitle = getHelpfulContent("conseils_title", city, 'HUB');
    const conseilsIntro = getHelpfulContent("conseils_intro", city, 'HUB');
    const conseils = getHelpfulList("conseil", city, 6, 'HUB');

    const comparisonTitle = getHelpfulContent("comparison_title", city, 'HUB');
    const comparisonIntro = getHelpfulContent("comparison_intro", city, 'HUB');
    const comparisonPoints = getHelpfulList("comparison_point", city, 6, 'HUB');
    const taxiVsPoints = getHelpfulList("taxi_vs", city, 5, 'HUB');

    const knowledgeTitle = getHelpfulContent("local_knowledge_title", city, 'HUB');
    const knowledge = getHelpfulList("local_knowledge", city, 4, 'HUB');

    const newsTitle = getHelpfulContent("news_title", city, 'HUB');
    const newsIntro = getHelpfulContent("news_intro", city, 'HUB');
    const news = getHelpfulList("news", city, 4, 'HUB');

    return (
        <>
            {/* ============ CONSEILS & ASTUCES ============ */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 text-sm font-bold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-4">
                            <Lightbulb size={16} />
                            Conseils d&apos;initiés
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight mb-4">
                            {conseilsTitle}
                        </h2>
                        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">{conseilsIntro}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {conseils.map((conseil, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-amber-300 hover:shadow-md transition"
                            >
                                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-black text-sm">
                                    {i + 1}
                                </div>
                                <p className="text-neutral-700 leading-relaxed">{conseil}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <Link
                            href="/guides"
                            className="inline-flex items-center gap-2 text-sm font-bold text-neutral-900 bg-neutral-900 text-white px-6 py-3 rounded-full hover:bg-neutral-800 transition"
                        >
                            <Sparkles size={16} />
                            Tous nos conseils taxi à {city.city}
                        </Link>
                    </div>
                </div>
            </section>

            {/* ============ COMPARATIF ============ */}
            <section className="py-20 bg-neutral-50 border-y border-neutral-200">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 mb-4">
                            <Scale size={16} />
                            Comparatif transparent
                        </div>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight mb-4">
                            {comparisonTitle}
                        </h2>
                        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">{comparisonIntro}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Taxi benefits */}
                        <div className="bg-white p-7 rounded-3xl border-2 border-yellow-400 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                                Recommandé
                            </div>
                            <h3 className="text-xl font-bold text-neutral-900 mb-5">Avec le taxi {city.city}</h3>
                            <ul className="space-y-3">
                                {comparisonPoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-neutral-700">
                                        <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Other options */}
                        <div className="bg-white p-7 rounded-3xl border border-neutral-200 shadow-sm">
                            <h3 className="text-xl font-bold text-neutral-900 mb-5">Les autres options à {city.city}</h3>
                            <ul className="space-y-3">
                                {taxiVsPoints.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-neutral-600 text-sm">
                                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-neutral-400 shrink-0" />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============ LE SAVIEZ-VOUS + ACTUS ============ */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-10">
                        {/* Local knowledge */}
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight mb-6">
                                {knowledgeTitle}
                            </h2>
                            <div className="space-y-4">
                                {knowledge.map((fact, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-100">
                                        <span className="text-2xl">💡</span>
                                        <p className="text-neutral-700">{fact}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* News / freshness */}
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight mb-2">
                                {newsTitle}
                            </h2>
                            <p className="text-neutral-500 mb-6 text-sm">{newsIntro}</p>
                            <div className="space-y-4">
                                {news.map((item, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-neutral-100 hover:border-blue-200 hover:shadow-sm transition">
                                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                            <Newspaper size={16} />
                                        </div>
                                        <p className="text-sm text-neutral-700">{item}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-6 text-xs text-neutral-400">
                                Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} — {city.city}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
