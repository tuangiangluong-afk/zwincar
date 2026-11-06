import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Clock,
    User,
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
    Info,
    ChevronRight,
    HelpCircle,
    Car,
    MapPin,
    ShieldCheck,
    Share2,
    Calendar,
} from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MOROCCO_GUIDES, getGuideBySlug } from "@/data/morocco-guides";
import { MOROCCAN_HUBS, VEHICLE_FLEET } from "@/lib/morocco-data";
import { clampTitle, clampDescription } from "@/lib/seo-meta";
import SchemaJSON from "@/components/SchemaJSON";
import GuideInfographic from "@/components/GuideInfographic";
import MarkdownContent from "@/components/MarkdownContent";

export const revalidate = 3600;

function getInfographicType(slug: string): "tpe-receipt" | "ground-clearance" | "radar-fines" | "jawaz-toll" | null {
    if (slug.includes("caution") || slug.includes("arnaque") || slug.includes("paiement-cash") || slug.includes("franchise-zero") || slug.includes("credit-card") || slug.includes("scams") || slug.includes("deposit")) {
        return "tpe-receipt";
    }
    if (slug.includes("4x4") || slug.includes("duster") || slug.includes("tichka") || slug.includes("dades")) {
        return "ground-clearance";
    }
    if (slug.includes("radar") || slug.includes("conduire") || slug.includes("barrage") || slug.includes("speed-camera") || slug.includes("checkpoint") || slug.includes("rules")) {
        return "radar-fines";
    }
    if (slug.includes("peage") || slug.includes("jawaz") || slug.includes("autoroute") || slug.includes("toll")) {
        return "jawaz-toll";
    }
    return null;
}

function formatDateFr(dateStr: string) {
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    } catch {
        return dateStr;
    }
}

export async function generateStaticParams() {
    return MOROCCO_GUIDES.map((guide) => ({
        slug: guide.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const guide = getGuideBySlug(slug);

    if (!guide) {
        return { title: "Guide Introuvable | ZwinCar" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";
    const enUrl = guide.alternateSlug ? `${baseUrl}/en/guides/${guide.alternateSlug}` : `${baseUrl}/en/guides`;

    const fullTitle = `${guide.shortTitle} • Guide Maroc | ZwinCar`;
    const title = clampTitle(fullTitle.length <= 58 ? fullTitle : `${guide.shortTitle} | ZwinCar`, 58);

    return {
        title,
        description: clampDescription(guide.metaDescription),
        alternates: {
            canonical: `${baseUrl}/guides/${guide.slug}`,
            languages: {
                "fr-FR": `${baseUrl}/guides/${guide.slug}`,
                "en-US": enUrl,
                "x-default": enUrl,
            },
        },
        openGraph: {
            title: guide.title,
            description: clampDescription(guide.metaDescription),
            url: `https://zwincar.com/guides/${guide.slug}`,
            images: [{ url: guide.heroImage, width: 1200, height: 630 }],
            type: "article",
            publishedTime: guide.publishedAt,
            modifiedTime: guide.updatedAt,
            authors: [guide.author.name],
        },
    };
}

export default async function GuideDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const guide = getGuideBySlug(slug);

    if (!guide) {
        notFound();
    }

    const relatedHubsData = MOROCCAN_HUBS.filter((h) => guide.relatedHubs.includes(h.slug));
    const relatedVehiclesData = VEHICLE_FLEET.filter((v) => guide.relatedVehicles.includes(v.id));
    const infographicType = getInfographicType(guide.slug);

    const titleMatch = guide.title.match(/^(.+?)(?:\s*[:?]\s+)(.+)$/);
    let h1Title = titleMatch ? (guide.title.includes("?") && !titleMatch[1].endsWith("?") ? `${titleMatch[1]} ?` : titleMatch[1]) : guide.title;
    if (h1Title.length > 65 && guide.shortTitle) {
        h1Title = guide.shortTitle;
    }
    const subtitle = titleMatch ? titleMatch[2] : null;

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col font-sans">
            <Header />

            {/* Structured Data: Article & BreadcrumbList & FAQPage */}
            <SchemaJSON
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Article",
                    headline: guide.title,
                    description: guide.metaDescription,
                    image: guide.heroImage,
                    datePublished: guide.publishedAt,
                    dateModified: guide.updatedAt,
                    author: {
                        "@type": "Person",
                        name: guide.author.name,
                        jobTitle: guide.author.role,
                        description: guide.author.bio,
                        image: guide.author.avatar,
                    },
                    publisher: {
                        "@type": "Organization",
                        name: "ZwinCar Maroc",
                        url: "https://zwincar.com",
                    },
                    mainEntityOfPage: {
                        "@type": "WebPage",
                        "@id": `https://zwincar.com/guides/${guide.slug}`,
                    },
                }}
            />

            <SchemaJSON
                schema={{
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        {
                            "@type": "ListItem",
                            position: 1,
                            name: "Accueil",
                            item: "https://zwincar.com",
                        },
                        {
                            "@type": "ListItem",
                            position: 2,
                            name: "Guides Maroc",
                            item: "https://zwincar.com/guides",
                        },
                        {
                            "@type": "ListItem",
                            position: 3,
                            name: guide.shortTitle,
                            item: `https://zwincar.com/guides/${guide.slug}`,
                        },
                    ],
                }}
            />

            {guide.faqs && guide.faqs.length > 0 && (
                <SchemaJSON
                    schema={{
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        mainEntity: guide.faqs.map((faq) => ({
                            "@type": "Question",
                            name: faq.question,
                            acceptedAnswer: {
                                "@type": "Answer",
                                text: faq.answer,
                            },
                        })),
                    }}
                />
            )}

            <main className="flex-1 pb-16">
                {/* Hero / Header */}
                <article className="container mx-auto px-4 max-w-4xl pt-8 sm:pt-12">
                    {/* Breadcrumbs Navigation & Language Switcher */}
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                            <Link href="/" className="hover:text-slate-900">
                                Accueil
                            </Link>
                            <ChevronRight size={12} />
                            <Link href="/guides" className="hover:text-slate-900">
                                Guides
                            </Link>
                            <ChevronRight size={12} />
                            <span className="text-[#C9572C] truncate max-w-[200px] sm:max-w-xs">{guide.shortTitle}</span>
                        </nav>

                        {guide.alternateSlug && (
                            <Link
                                href={`/en/guides/${guide.alternateSlug}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs"
                                title="Read this guide in English"
                            >
                                <span className="text-sm">🇬🇧</span>
                                <span>Read in English</span>
                            </Link>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                            <span>{guide.category}</span>
                            <span>•</span>
                            <span className="font-normal">{guide.readTimeMinutes} min</span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            {h1Title}
                        </h1>
                        {subtitle && (
                            <p className="text-base sm:text-lg text-slate-600 font-medium mt-2 leading-relaxed">
                                {subtitle}
                            </p>
                        )}

                        {/* Author line & Dates */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 pb-6 border-b border-slate-200">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                                    <Image
                                        src={guide.author.avatar}
                                        alt={guide.author.name}
                                        width={44}
                                        height={44}
                                        className="w-11 h-11 object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-900">
                                        {guide.author.name}
                                    </div>
                                    <div className="text-[11px] text-slate-500">
                                        {guide.author.role}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                                <Calendar size={13} className="text-slate-400" />
                                <span>Publié le {formatDateFr(guide.publishedAt)}</span>
                                <span>•</span>
                                <span className="text-emerald-700 font-semibold">Mis à jour le {formatDateFr(guide.updatedAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="relative h-64 sm:h-96 rounded-3xl overflow-hidden my-8 shadow-md border border-slate-200">
                        <Image
                            src={guide.heroImage}
                            alt={guide.shortTitle || guide.title}
                            width={1200}
                            height={630}
                            priority
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Direct Answer Summary Box (AEO & LLM Snapshot) */}
                    <div className="rounded-3xl bg-white border-2 border-[#C9572C]/30 p-6 sm:p-7 shadow-sm my-8 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C9572C]">
                            <CheckCircle2 size={18} />
                            <span>L'Essentiel en 30 Secondes</span>
                        </div>
                        <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
                            {guide.summaryDirectAnswer}
                        </p>
                    </div>

                    {/* Table of Contents */}
                    <div className="rounded-2xl bg-[#F0EBE1] p-5 my-8 space-y-2.5">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Sommaire du Guide
                        </div>
                        <ul className="space-y-1.5 text-xs font-semibold text-slate-800">
                            {guide.sections.map((section, idx) => (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        className="hover:text-[#C9572C] transition-colors flex items-center gap-2"
                                    >
                                        <span className="text-slate-400 font-mono">{idx + 1}.</span>
                                        <span>{section.heading.replace(/^\d+\.\s*/, "")}</span>
                                    </a>
                                </li>
                            ))}
                            {guide.faqs && guide.faqs.length > 0 && (
                                <li>
                                    <a
                                        href="#faq-guide"
                                        className="hover:text-[#C9572C] transition-colors flex items-center gap-2"
                                    >
                                        <span className="text-slate-400 font-mono">FAQ</span>
                                        <span>Questions fréquentes</span>
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-10 text-slate-800 leading-relaxed text-sm sm:text-base">
                        {guide.sections.map((sec, idx) => (
                            <React.Fragment key={sec.id}>
                                <section id={sec.id} className="space-y-4 pt-4">
                                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                        {sec.heading}
                                    </h2>
                                    
                                    <MarkdownContent content={sec.content} />

                                    {sec.callout && (
                                        <div
                                            className={`rounded-2xl p-4.5 border flex items-start gap-3 my-4 text-xs sm:text-sm font-medium ${
                                                sec.callout.type === "warning"
                                                    ? "bg-amber-50 border-amber-200 text-amber-900"
                                                    : sec.callout.type === "tip"
                                                    ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                                                    : "bg-blue-50 border-blue-200 text-blue-900"
                                            }`}
                                        >
                                            {sec.callout.type === "warning" && (
                                                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                            )}
                                            {sec.callout.type === "tip" && (
                                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                                            )}
                                            {sec.callout.type === "info" && (
                                                <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                                            )}
                                            <div>{sec.callout.text}</div>
                                        </div>
                                    )}
                                </section>

                                {/* Technical Visual Infographic after 2nd section */}
                                {idx === 1 && infographicType && (
                                    <GuideInfographic type={infographicType} locale="fr" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* EEAT Author Verification Box */}
                    <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 sm:p-7 my-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-xs">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-[#FAF7F2] shadow-sm">
                            <Image src={guide.author.avatar} alt={guide.author.name} width={80} height={80} className="w-16 h-16 sm:w-20 sm:h-20 object-cover" />
                        </div>
                        <div className="space-y-2 text-center sm:text-left flex-1">
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span className="font-black text-slate-900 text-base">{guide.author.name}</span>
                            </div>
                            <p className="text-xs font-bold text-[#C9572C]">{guide.author.role}</p>
                            {guide.author.bio && (
                                <p className="text-xs text-slate-600 leading-relaxed">{guide.author.bio}</p>
                            )}
                            <div className="pt-1 text-[11px] text-slate-400 font-mono">
                                Dossier soumis au protocole de vérification terrain ZwinCar Maroc • Révisé en novembre 2026
                            </div>
                        </div>
                    </div>

                    {/* FAQs */}
                    {guide.faqs && guide.faqs.length > 0 && (
                        <section id="faq-guide" className="pt-12 mt-12 border-t border-slate-200 space-y-6">
                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9572C]">
                                <HelpCircle size={18} />
                                <span>Foire Aux Questions</span>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                                Questions Fréquentes sur le Sujet
                            </h3>

                            <div className="space-y-4">
                                {guide.faqs.map((faq, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-2xl bg-white border border-[#ECE5D9] p-5 shadow-2xs space-y-2"
                                    >
                                        <div className="text-sm sm:text-base font-bold text-slate-900">
                                            {faq.question}
                                        </div>
                                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Related Hubs & Vehicles Section (SEO Cross-Linking) */}
                    <div className="pt-12 mt-12 border-t border-slate-200 space-y-8">
                        {relatedHubsData.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                                    <MapPin size={14} className="text-[#C9572C]" />
                                    <span>Villes & Aéroports Recommandés</span>
                                </h4>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {relatedHubsData.map((hub) => (
                                        <Link
                                            key={hub.slug}
                                            href={`/maroc/${hub.slug}`}
                                            className="p-3.5 rounded-2xl bg-white border border-[#E7DFD5] hover:border-[#C9572C] transition-all flex flex-col justify-between"
                                        >
                                            <div className="font-bold text-xs sm:text-sm text-slate-900">
                                                {hub.name} ({hub.airportCode})
                                            </div>
                                            <div className="text-[11px] text-slate-500 mt-1">
                                                Dès {hub.avgDailyPriceEur} €/j • 0€ Caution
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {relatedVehiclesData.length > 0 && (
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                                    <Car size={14} className="text-emerald-600" />
                                    <span>Véhicules Adaptés pour ce Trajet</span>
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {relatedVehiclesData.map((veh) => (
                                        <Link
                                            key={veh.id}
                                            href={`/maroc/marrakech/${veh.id}`}
                                            className="p-4 rounded-2xl bg-white border border-[#E7DFD5] hover:border-emerald-500 transition-all flex items-center gap-4 group"
                                        >
                                            <div className="w-20 h-14 shrink-0 overflow-hidden rounded-xl bg-slate-50">
                                                <Image
                                                    src={veh.image}
                                                    alt={veh.name}
                                                    width={80}
                                                    height={56}
                                                    className="w-20 h-14 object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-xs sm:text-sm font-bold text-slate-900">
                                                    {veh.name}
                                                </div>
                                                <div className="text-[11px] text-emerald-700 font-semibold">
                                                    {veh.dailyPriceEur} €/j • {veh.depositPolicy}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
