"use client";

import React from "react";
import Link from "next/link";
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    ArrowRight,
    HelpCircle,
    Car,
    Lock,
    MessageCircle,
    Calendar,
    ChevronDown,
} from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import SchemaJSON from "@/components/SchemaJSON";
import { VsComparison, VS_COMPETITORS } from "@/lib/vs-data";
import { Locale, getTranslation } from "@/lib/i18n";
import { MOROCCAN_HUBS } from "@/lib/morocco-data";

interface VsComparisonViewProps {
    comparison: VsComparison;
    locale: Locale;
}

export default function VsComparisonView({ comparison, locale }: VsComparisonViewProps) {
    const t = getTranslation(locale);
    const [openFaq, setOpenFaq] = React.useState<number | null>(0);

    const toggleFaq = (index: number) => {
        setOpenFaq((prev) => (prev === index ? null : index));
    };

    const breadcrumbs = [
        {
            label: locale === "en" ? "Home" : locale === "es" ? "Inicio" : locale === "nl" ? "Home" : "Accueil",
            href: locale === "fr" ? "/" : `/${locale}`,
        },
        {
            label: locale === "en" ? "Comparisons" : locale === "es" ? "Comparativas" : locale === "nl" ? "Vergelijkingen" : "Comparatifs",
            href: "#comparisons",
        },
        {
            label: `ZwinCar vs ${comparison.competitorName}`,
            href: "#",
        },
    ];

    const ctaBookText = locale === "en"
        ? "Book a Vehicle with €0 Deposit"
        : locale === "es"
        ? "Reservar Vehículo con 0 € de Fianza"
        : locale === "nl"
        ? "Huur een Auto met €0 Borg"
        : "Réserver un Véhicule sans Caution Bloquée";

    const ctaHubTitle = locale === "en"
        ? "Popular Airport Pickup Hubs in Morocco"
        : locale === "es"
        ? "Principales Aeropuertos de Entrega en Marruecos"
        : locale === "nl"
        ? "Populaire Luchthavenlocaties in Marokko"
        : "Aéroports de Prise en Charge au Maroc";

    const schemaFaqs = comparison.faqs.map((f) => ({
        q: f.q[locale],
        a: f.a[locale],
    }));

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#12161E]">
            <Header locale={locale} />
            <SchemaJSON faqs={schemaFaqs} />

            <main className="pb-16 sm:pb-24">
                {/* 1. Breadcrumbs */}
                <div className="max-w-5xl mx-auto px-4 pt-6 pb-2">
                    <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
                        {breadcrumbs.map((b, i) => (
                            <React.Fragment key={b.label}>
                                {i > 0 && <span className="text-slate-300">/</span>}
                                {b.href !== "#" ? (
                                    <Link href={b.href} className="hover:text-slate-900 transition">
                                        {b.label}
                                    </Link>
                                ) : (
                                    <span className="font-bold text-slate-800">{b.label}</span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                </div>

                {/* 2. Hero Section */}
                <section className="max-w-5xl mx-auto px-4 pt-4 sm:pt-8 pb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-4 shadow-xs">
                        <ShieldCheck size={14} className="text-emerald-600 shrink-0" />
                        <span>{comparison.verdictBadge[locale]}</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
                        {comparison.heroH1[locale]}
                    </h1>

                    <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed mb-8">
                        {comparison.heroSubtitle[locale]}
                    </p>

                    {/* Key Takeaway Callout */}
                    <div className="rounded-3xl bg-white border border-[#E7DFD5] p-5 sm:p-7 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#C9572C] via-emerald-500 to-[#12161E]" />
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#C9572C] mb-2 flex items-center gap-1.5">
                            <AlertTriangle size={14} />
                            <span>{locale === "en" ? "Summary Verdict" : locale === "es" ? "Resumen Ejecutivo" : locale === "nl" ? "Kernconclusie" : "Synthèse Verdict"}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                            {comparison.keyTakeaway[locale]}
                        </p>
                    </div>
                </section>

                {/* 3. Comparison Table */}
                <section className="max-w-5xl mx-auto px-4 mb-14">
                    <div className="rounded-3xl bg-white border border-[#E7DFD5] shadow-xl overflow-hidden">
                        {/* Table Header */}
                        <div className="bg-[#12161E] text-white p-4 sm:p-6 grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-12 sm:col-span-4 font-bold text-xs sm:text-sm uppercase tracking-wider text-slate-400">
                                {comparison.tableHeaders.criteria[locale]}
                            </div>
                            <div className="col-span-6 sm:col-span-4 font-bold text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-slate-500 shrink-0" />
                                <span className="truncate">{comparison.tableHeaders.competitor[locale]}</span>
                            </div>
                            <div className="col-span-6 sm:col-span-4 font-black text-xs sm:text-sm text-emerald-400 flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                <span className="truncate">{comparison.tableHeaders.zwincar[locale]}</span>
                            </div>
                        </div>

                        {/* Table Rows */}
                        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                            {comparison.comparisonRows.map((row, idx) => (
                                <div
                                    key={idx}
                                    className={`p-4 sm:p-5 grid grid-cols-12 gap-3 items-start transition-colors ${
                                        idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                                    }`}
                                >
                                    <div className="col-span-12 sm:col-span-4 font-bold text-slate-900 leading-snug">
                                        {row.label[locale]}
                                    </div>
                                    <div className="col-span-12 sm:col-span-4 text-slate-600 flex items-start gap-2 pt-1 sm:pt-0">
                                        {row.competitorStatus === "bad"
                                            ? <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                            : <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />}
                                        <span className="leading-relaxed">{row.competitorValue[locale]}</span>
                                    </div>
                                    <div className="col-span-12 sm:col-span-4 text-slate-900 font-semibold flex items-start gap-2 pt-1 sm:pt-0">
                                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                        <span className="leading-relaxed text-emerald-950">{row.zwincarValue[locale]}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Forensic Deep Dive Section */}
                <section className="max-w-4xl mx-auto px-4 mb-16">
                    <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 sm:p-9 shadow-md space-y-4">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9572C]">
                            <Car size={15} />
                            <span>{locale === "en" ? "Analysis" : locale === "es" ? "Investigación" : locale === "nl" ? "Onderzoek" : "Enquête Terrain"}</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                            {comparison.forensicSection.title[locale]}
                        </h2>
                        <div className="space-y-3.5 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal pt-2">
                            {comparison.forensicSection.paragraphs[locale].map((p, i) => (
                                <p key={i}>{p}</p>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. FAQs Accordion */}
                <section className="max-w-4xl mx-auto px-4 mb-16">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C9572C] mb-1">
                            <HelpCircle size={14} />
                            <span>FAQ</span>
                        </div>
                        <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {locale === "en"
                                ? "Frequently Asked Questions"
                                : locale === "es"
                                ? "Preguntas Frecuentes"
                                : locale === "nl"
                                ? "Veelgestelde Vragen"
                                : "Questions Fréquentes"}
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {comparison.faqs.map((faq, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div
                                    key={idx}
                                    className="rounded-2xl bg-white border border-[#E7DFD5] shadow-xs overflow-hidden transition-all"
                                >
                                    <button
                                        type="button"
                                        onClick={() => toggleFaq(idx)}
                                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-slate-900 cursor-pointer hover:text-[#C9572C] transition-colors"
                                    >
                                        <span>{faq.q[locale]}</span>
                                        <ChevronDown
                                            size={16}
                                            className={`shrink-0 transform transition-transform ${
                                                isOpen ? "rotate-180 text-[#C9572C]" : "text-slate-400"
                                            }`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed animate-in fade-in duration-150 border-t border-slate-100 mt-1">
                                            <p className="pt-3">{faq.a[locale]}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 5b. Cross-links to other comparisons */}
                {VS_COMPETITORS.filter((c) => c.slug !== comparison.slug).length > 0 && (
                    <section id="comparisons" className="max-w-4xl mx-auto px-4 mb-16">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 text-center sm:text-left">
                            {locale === "en" ? "Other Comparisons" : locale === "es" ? "Otras Comparativas" : locale === "nl" ? "Andere Vergelijkingen" : "Autres Comparatifs"}
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                            {VS_COMPETITORS.filter((c) => c.slug !== comparison.slug).map((c) => (
                                <Link
                                    key={c.slug}
                                    href={locale === "fr" ? `/vs/${c.slug}` : `/${locale}/vs/${c.slug}`}
                                    className="flex-1 min-w-[200px] max-w-sm rounded-2xl bg-white border border-[#E7DFD5] hover:border-[#C9572C] p-4 shadow-xs transition group"
                                >
                                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#C9572C] transition mb-1">
                                        ZwinCar vs {c.competitorName}
                                    </div>
                                    <div className="text-[11px] text-slate-500 leading-snug">
                                        {c.competitorType[locale]}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* 6. Direct Booking Action CTA */}
                <section className="max-w-5xl mx-auto px-4">
                    <div className="rounded-3xl bg-[#12161E] text-white p-7 sm:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="space-y-3 text-center md:text-left">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-bold uppercase tracking-wider">
                                <Lock size={13} />
                                <span>{locale === "en" ? "Guaranteed Zero Excess" : locale === "es" ? "Sin Bloqueo en Tarjeta" : locale === "nl" ? "Gegarandeerd Zonder Borg" : "Zéro Caution Bloquée"}</span>
                            </div>
                            <h3 className="text-xl sm:text-3xl font-black tracking-tight text-white">
                                {locale === "en"
                                    ? "Travel Morocco with Total Peace of Mind"
                                    : locale === "es"
                                    ? "Viaje por Marruecos con Total Tranquilidad"
                                    : locale === "nl"
                                    ? "Reis Zorgeloos door Marokko"
                                    : "Prenez la Route en Toute Sérénité"}
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
                                {locale === "en"
                                    ? "Debit cards & cash accepted, free airport & Riad delivery, and 24/7 WhatsApp concierge assistance."
                                    : locale === "es"
                                    ? "Tarjetas de débito y efectivo aceptados, entrega gratuita en aeropuerto y Riad, y soporte WhatsApp 24/7."
                                    : locale === "nl"
                                    ? "Pinpas en contant geaccepteerd, gratis levering op luchthaven en Riad, en 24/7 WhatsApp-hulp."
                                    : "Cartes de débit et espèces acceptés, livraison gratuite à l'aéroport ou au Riad, et conciergerie WhatsApp 24/7."}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                            <Link
                                href={locale === "fr" ? "/#vehicle-catalog" : `/${locale}#vehicle-catalog`}
                                className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
                            >
                                <span>{ctaBookText}</span>
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Hub Navigation */}
                    <div className="mt-8 pt-6 border-t border-[#E7DFD5]">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 text-center sm:text-left">
                            {ctaHubTitle}
                        </div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            {MOROCCAN_HUBS.map((hub) => (
                                <Link
                                    key={hub.slug}
                                    href={locale === "fr" ? `/maroc/${hub.slug}` : `/${locale}/${hub.slug}`}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] hover:border-[#C9572C] text-xs font-semibold text-slate-700 transition shadow-2xs"
                                >
                                    {hub.name} ({hub.airportCode})
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer locale={locale} />
        </div>
    );
}
