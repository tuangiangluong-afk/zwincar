import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Clock,
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
    Info,
    HelpCircle,
    ShieldCheck,
    Calendar,
} from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MOROCCO_GUIDES_EN, getGuideEnBySlug } from "@/data/morocco-guides-en";
import { MOROCCAN_HUBS, VEHICLE_FLEET, SOCIAL_SAME_AS } from "@/lib/morocco-data";
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

function formatDateEn(dateStr: string) {
    try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    } catch {
        return dateStr;
    }
}

export async function generateStaticParams() {
    return (MOROCCO_GUIDES_EN || []).map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const guide = getGuideEnBySlug(slug);

    if (!guide) return { title: "Guide Not Found | ZwinCar" };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";
    const frUrl = guide.alternateSlug ? `${baseUrl}/guides/${guide.alternateSlug}` : `${baseUrl}/guides`;

    const fullTitle = `${guide.shortTitle} • Morocco Guide | ZwinCar`;
    const title = clampTitle(fullTitle.length <= 58 ? fullTitle : `${guide.shortTitle} | ZwinCar`, 58);

    return {
        title,
        description: clampDescription(guide.metaDescription),
        alternates: {
            canonical: `${baseUrl}/en/guides/${guide.slug}`,
            languages: {
                "en-US": `${baseUrl}/en/guides/${guide.slug}`,
                "fr-FR": frUrl,
                "x-default": `${baseUrl}/en/guides/${guide.slug}`,
            },
        },
        openGraph: {
            title: guide.title,
            description: clampDescription(guide.metaDescription),
            url: `${baseUrl}/en/guides/${guide.slug}`,
            images: [{ url: guide.heroImage, width: 1200, height: 630 }],
            type: "article",
            publishedTime: guide.publishedAt,
            modifiedTime: guide.updatedAt,
            authors: [guide.author.name],
        },
        twitter: {
            card: "summary_large_image",
            title: guide.title,
            description: clampDescription(guide.metaDescription),
            images: [guide.heroImage],
        },
    };
}

export default async function EnglishGuideDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const guide = getGuideEnBySlug(slug);

    if (!guide) notFound();

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
            <Header locale="en" />

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
                        name: "ZwinCar Morocco",
                        url: "https://zwincar.com",
                        logo: "https://zwincar.com/logo.svg",
                        sameAs: SOCIAL_SAME_AS,
                    },
                    mainEntityOfPage: {
                        "@type": "WebPage",
                        "@id": `https://zwincar.com/en/guides/${guide.slug}`,
                    },
                }}
            />

            <SchemaJSON
                schema={{
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: "Home", item: "https://zwincar.com/en" },
                        { "@type": "ListItem", position: 2, name: "Guides", item: "https://zwincar.com/en/guides" },
                        {
                            "@type": "ListItem",
                            position: 3,
                            name: guide.shortTitle,
                            item: `https://zwincar.com/en/guides/${guide.slug}`,
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
                            acceptedAnswer: { "@type": "Answer", text: faq.answer },
                        })),
                    }}
                />
            )}

            <main className="flex-1 pb-16">
                <header className="relative w-full pt-10 pb-12 sm:pt-14 sm:pb-16 bg-white border-b border-[#ECE5D9]">
                    <div className="container mx-auto px-4 max-w-4xl space-y-4">
                        <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                            <Link
                                href="/en/guides"
                                className="inline-flex items-center gap-1.5 text-slate-500 hover:text-[#C9572C] font-semibold transition"
                            >
                                <ArrowLeft size={14} />
                                <span>Back to All Guides</span>
                            </Link>
                            <span className="px-3 py-1 rounded-full bg-[#C9572C]/10 text-[#C9572C] font-bold uppercase tracking-wider text-[11px]">
                                {guide.category}
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            {h1Title}
                        </h1>
                        {subtitle && (
                            <p className="text-base sm:text-lg text-slate-600 font-medium mt-2 leading-relaxed">
                                {subtitle}
                            </p>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-medium pt-3 border-t border-slate-100">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-slate-200">
                                    <Image
                                        src={guide.author.avatar}
                                        alt={guide.author.name}
                                        width={36}
                                        height={36}
                                        className="w-9 h-9 object-cover"
                                    />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900">
                                        {guide.author.name}
                                    </div>
                                    <span className="text-[11px] text-slate-500">{guide.author.role}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                                <Calendar size={13} className="text-slate-400" />
                                <span>Published {formatDateEn(guide.publishedAt)}</span>
                                <span>•</span>
                                <span className="text-emerald-700 font-semibold">Updated {formatDateEn(guide.updatedAt)}</span>

                                {guide.alternateSlug && (
                                    <>
                                        <span>•</span>
                                        <Link
                                            href={`/guides/${guide.alternateSlug}`}
                                            className="text-[#C9572C] hover:underline font-bold text-xs"
                                        >
                                            🇫🇷 Lire en Français
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="container mx-auto px-4 max-w-4xl -mt-6 sm:-mt-8 mb-10">
                    <div className="relative aspect-[21/9] w-full rounded-3xl overflow-hidden shadow-lg border border-[#ECE5D9] bg-slate-100">
                        <Image
                            src={guide.heroImage}
                            alt={guide.shortTitle || guide.title}
                            width={1200}
                            height={514}
                            priority
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-8 space-y-10">
                        <div className="p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-2">
                            <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wider">
                                <ShieldCheck size={16} className="text-amber-700" />
                                <span>Key Takeaway &amp; Direct Answer</span>
                            </div>
                            <p className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
                                {guide.summaryDirectAnswer}
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white border border-[#ECE5D9] space-y-3">
                            <div className="text-xs font-black uppercase text-slate-400 tracking-wider">
                                Table of Contents
                            </div>
                            <nav className="space-y-1.5 text-xs sm:text-sm">
                                {guide.sections.map((section, idx) => (
                                    <a
                                        key={section.id}
                                        href={`#${section.id}`}
                                        className="flex items-center gap-2 text-slate-700 hover:text-[#C9572C] transition-colors py-1"
                                    >
                                        <span className="w-5 h-5 rounded-full bg-slate-100 text-[10px] font-bold flex items-center justify-center shrink-0">
                                            {idx + 1}
                                        </span>
                                        <span className="font-medium">{section.heading}</span>
                                    </a>
                                ))}
                            </nav>
                        </div>

                        <div className="space-y-12">
                            {guide.sections.map((section, idx) => (
                                <React.Fragment key={section.id}>
                                    <section id={section.id} className="scroll-mt-24 space-y-4">
                                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-3">
                                            <span className="text-[#C9572C]">{idx + 1}.</span>
                                            <span>{section.heading}</span>
                                        </h2>

                                        {section.callout && (
                                            <div
                                                className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border ${
                                                    section.callout.type === "warning"
                                                        ? "bg-rose-50 border-rose-200 text-rose-900 font-medium"
                                                        : section.callout.type === "tip"
                                                          ? "bg-emerald-50 border-emerald-200 text-emerald-900 font-medium"
                                                          : "bg-blue-50 border-blue-200 text-blue-900 font-medium"
                                                }`}
                                            >
                                                <div className="flex items-start gap-2.5">
                                                    {section.callout.type === "warning" ? (
                                                        <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                                                    ) : section.callout.type === "tip" ? (
                                                        <CheckCircle2
                                                            size={18}
                                                            className="text-emerald-600 shrink-0 mt-0.5"
                                                        />
                                                    ) : (
                                                        <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
                                                    )}
                                                    <div>{section.callout.text}</div>
                                                </div>
                                            </div>
                                        )}

                                        <MarkdownContent content={section.content} />
                                    </section>

                                    {/* Visual Infographic after 2nd section */}
                                    {idx === 1 && infographicType && (
                                        <GuideInfographic type={infographicType} locale="en" />
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
                                    Ground-verified audit protocol • Published {formatDateEn(guide.publishedAt)} • Updated November 2026
                                </div>
                            </div>
                        </div>

                        {guide.faqs && guide.faqs.length > 0 && (
                            <section className="pt-8 border-t border-[#ECE5D9] space-y-6">
                                <div className="flex items-center gap-2 text-[#C9572C] font-bold text-xs uppercase tracking-wider">
                                    <HelpCircle size={16} />
                                    <span>Frequently Asked Questions</span>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">
                                    Common Questions About {guide.shortTitle}
                                </h2>
                                <div className="space-y-4">
                                    {guide.faqs.map((faq, i) => (
                                        <div
                                            key={i}
                                            className="p-5 rounded-2xl bg-white border border-[#ECE5D9] space-y-2 shadow-xs"
                                        >
                                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                                                {faq.question}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                                {faq.answer}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="lg:col-span-4 space-y-6">
                        <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-xl sticky top-24">
                            <div className="inline-block px-2.5 py-1 rounded-md bg-[#C9572C] text-white text-[10px] font-bold uppercase tracking-wider">
                                0€ Deposit Option
                            </div>
                            <h3 className="text-lg font-black leading-snug">
                                Rent Directly from Verified Local Agencies in Morocco
                            </h3>
                            <p className="text-xs text-slate-300 leading-relaxed">
                                No credit card block required. Debit cards &amp; cash accepted, free airport &amp; riad
                                delivery with zero hidden fees.
                            </p>
                            <Link
                                href="/en/marrakech/no-deposit"
                                className="block w-full text-center py-3 rounded-xl bg-[#C9572C] hover:bg-[#A8431F] text-white font-bold text-xs transition shadow-md"
                            >
                                Compare Cars &amp; Book (20% Deposit)
                            </Link>

                            {relatedHubsData.length > 0 && (
                                <div className="pt-4 border-t border-slate-800 space-y-2">
                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        Relevant Pickup Hubs:
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {relatedHubsData.map((h) => (
                                            <Link
                                                key={h.slug}
                                                href={`/en/${h.slug}`}
                                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition"
                                            >
                                                {h.name} ({h.airportCode})
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {relatedVehiclesData.length > 0 && (
                                <div className="pt-4 border-t border-slate-800 space-y-2">
                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                        Recommended Vehicles:
                                    </div>
                                    <div className="space-y-2">
                                        {relatedVehiclesData.map((v) => (
                                            <Link
                                                key={v.id}
                                                href={`/en/marrakech/${v.id}`}
                                                className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-xs text-slate-300 transition"
                                            >
                                                <span>{v.name}</span>
                                                <span className="font-bold text-[#E58B24]">{v.dailyPriceEur}€/day</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </main>

            <Footer locale="en" />
        </div>
    );
}
