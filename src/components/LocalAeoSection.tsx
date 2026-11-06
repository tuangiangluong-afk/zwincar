import { ShieldCheck, CheckCircle2, AlertTriangle, Clock, MapPin, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DIRECT_ANSWERS_AEO, MOROCCAN_HUBS } from "@/lib/morocco-data";

interface LocalAeoSectionProps {
    hubSlug?: string;
}

export default function LocalAeoSection({ hubSlug }: LocalAeoSectionProps) {
    const hub = MOROCCAN_HUBS.find((h) => h.slug === hubSlug) || MOROCCAN_HUBS[0];

    const comparisonRows = [
        {
            feature: "Empreinte CB / Caution",
            zwincar: "0 € avec Franchise Zéro (ou caution standard 300 € en espèces/débit)",
            competitors: "1 500 € à 2 500 € bloqués (carte de crédit obligatoire)",
            isPositive: true,
        },
        {
            feature: "Attente à l'Aéroport",
            zwincar: "0 min (agent avec pancarte aux arrivées + clés en main)",
            competitors: "30 à 60 min de queue aux guichets franchisés",
            isPositive: true,
        },
        {
            feature: "Modèle de Voiture",
            zwincar: "Catégorie garantie ou surclassement offert (Sandero, Clio 5, Duster 4x4)",
            competitors: "« Ou similaire » (souvent sous-classé ou fatigué)",
            isPositive: true,
        },
        {
            feature: "Livraison au Riad / Hôtel",
            zwincar: "Incluse ou à la demande directement à votre hébergement",
            competitors: "Impossible ou facturée 35 € à 50 € de supplément",
            isPositive: true,
        },
        {
            feature: "Assistance & Communication",
            zwincar: "WhatsApp direct 24/7 en FR, EN, ES et Darija",
            competitors: "Plateforme téléphonique automatisée délocalisée",
            isPositive: true,
        },
    ];

    return (
        <section className="py-16 bg-[#FAF7F2] border-t border-[#EAE3D6]">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Fil d'Ariane Visuel */}
                <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs md:text-sm text-slate-500">
                    <Link href="/" className="hover:text-slate-900 transition flex items-center gap-1 font-medium">
                        Accueil
                    </Link>
                    <ChevronRight size={13} className="text-slate-400" />
                    <span className="text-slate-400">Maroc</span>
                    <ChevronRight size={13} className="text-slate-400" />
                    <span className="font-semibold text-slate-900">{hub.name} ({hub.airportCode})</span>
                </nav>

                {/* Bloc AEO Direct Answer */}
                <div className="rounded-3xl border border-[#E7DFD5] bg-white p-7 md:p-10 shadow-sm mb-12">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-800">
                            <ShieldCheck size={14} className="text-[#C9572C]" />
                            Guide Pratique & Réglementation
                        </span>
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <Clock size={13} /> Mis à jour quotidiennement • Données vérifiées
                        </span>
                    </div>

                    <h2 data-speakable className="text-xl md:text-2xl font-black text-slate-900 mb-4 tracking-tight">
                        {hubSlug && hub ? `Louer une voiture sans caution ni carte bancaire à ${hub.name} (2026)` : DIRECT_ANSWERS_AEO.title}
                    </h2>

                    <p data-speakable className="text-base md:text-lg text-slate-700 leading-relaxed mb-8">
                        {DIRECT_ANSWERS_AEO.summary}
                    </p>

                    {/* Key Facts Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
                        {DIRECT_ANSWERS_AEO.keyFacts.map((fact, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 text-left transition hover:border-[#C9572C]/40"
                            >
                                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    {fact.label}
                                </div>
                                <div className="text-sm md:text-base font-bold text-slate-900 mt-1">
                                    {fact.value}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1">
                                    {fact.detail}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tableau Comparatif ZwinCar vs Multinationales */}
                    <div className="mt-10 pt-8 border-t border-slate-100">
                        <div className="mb-5 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                                Comparatif d'Arbitrage : ZwinCar vs Grands Loueurs Aéroport
                            </h3>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#C9572C]/10 text-[#C9572C]">
                                Transparence 100%
                            </span>
                        </div>

                        <div className="overflow-x-auto rounded-3xl border-2 border-[#E7DFD5] shadow-xs bg-white">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-[#E7DFD5]">
                                        <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/90 w-1/3">
                                            Critère de Réservation
                                        </th>
                                        <th className="py-4 px-5 text-xs font-black uppercase tracking-wider text-[#C9572C] bg-[#C9572C]/10 border-x-2 border-[#C9572C]/30 w-1/3">
                                            <div className="inline-flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-[#C9572C]"></span>
                                                <span>ZwinCar (Agences Vérifiées)</span>
                                            </div>
                                        </th>
                                        <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 w-1/3">
                                            Grands Courtiers & Franchises
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {comparisonRows.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50/40 transition">
                                            <td className="py-4 px-5 font-bold text-slate-900 bg-slate-50/30">
                                                {row.feature}
                                            </td>
                                            <td className="py-4 px-5 bg-[#C9572C]/5 border-x-2 border-[#C9572C]/20 font-bold text-slate-900">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                                                    <span>{row.zwincar}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-5 text-slate-500">
                                                <div className="flex items-center gap-2">
                                                    <AlertTriangle size={15} className="text-amber-500 shrink-0" />
                                                    <span>{row.competitors}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* FAQ Dépliée AEO pour Indexation Naturelle */}
                <div className="rounded-3xl border border-[#E7DFD5] bg-white p-7 md:p-10 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <ShieldCheck size={20} className="text-[#C9572C]" />
                        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                            Questions Fréquentes — Tout Comprendre en 2 Minutes
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {DIRECT_ANSWERS_AEO.faqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="rounded-2xl bg-[#FAF7F2] p-5 border border-[#ECE5D9]"
                            >
                                <h4 className="text-sm font-bold text-slate-900 mb-2">
                                    {faq.q}
                                </h4>
                                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                                    {faq.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
