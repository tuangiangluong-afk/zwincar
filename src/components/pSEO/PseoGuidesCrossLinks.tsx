import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, ArrowRight, Clock } from "lucide-react";
import { getHubGuidesSummary } from "@/data/morocco-guides-summary";

interface PseoGuidesCrossLinksProps {
    hubSlug: string;
    hubName: string;
    locale?: "fr" | "en" | "es" | "nl";
}

export default function PseoGuidesCrossLinks({
    hubSlug,
    hubName,
    locale = "fr",
}: PseoGuidesCrossLinksProps) {
    const isEn = locale === "en";
    const guides = getHubGuidesSummary(hubSlug, isEn);

    if (!guides || guides.length === 0) return null;

    const basePath = isEn ? "/en/guides" : "/guides";

    return (
        <section className="py-14 sm:py-18 bg-[#FAF7F2] border-t border-[#ECE5D9]">
            <div className="container mx-auto px-4 max-w-6xl space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9572C]/10 text-[#C9572C] text-xs font-bold uppercase tracking-wider">
                            <BookOpen size={14} />
                            <span>{isEn ? "Authoritative Driving Intelligence" : "Guides d'Autorité & Conseils Conduite"}</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {isEn
                                ? `Essential Driving & Car Rental Guides for ${hubName}`
                                : `Guides Essentiels pour Conduire à ${hubName} & au Maroc`}
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {isEn
                                ? `Avoid deposit disputes, airport terminal confusion, and radar fines with our forensic Moroccan road guides.`
                                : `Évitez les pièges de caution bancaire, les files d'attente à l'aéroport et maîtrisez la réglementation routière marocaine.`}
                        </p>
                    </div>

                    <Link
                        href={basePath}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9572C] hover:text-[#A8431F] transition-colors shrink-0"
                    >
                        <span>{isEn ? "Browse all 24 guides" : "Voir tous les 24 guides"}</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>

                {/* Guides Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {guides.map((guide) => (
                        <Link
                            key={guide.slug}
                            href={`${basePath}/${guide.slug}`}
                            className="group rounded-2xl bg-white border border-[#ECE5D9] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#C9572C]/40 transition-all flex flex-col justify-between"
                        >
                            <div>
                                <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                                    <Image
                                        src={guide.heroImage}
                                        alt={guide.shortTitle || guide.title}
                                        width={400}
                                        height={225}
                                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-2.5 left-2.5">
                                        <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold uppercase tracking-wider">
                                            {guide.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                                        <Clock size={11} />
                                        <span>{guide.readTimeMinutes} min</span>
                                    </div>
                                    <h3 className="font-black text-xs sm:text-sm text-slate-900 group-hover:text-[#C9572C] transition-colors line-clamp-2 leading-snug">
                                        {guide.shortTitle || guide.title}
                                    </h3>
                                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                                        {guide.metaDescription}
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 pt-0 text-[11px] font-bold text-[#C9572C] flex items-center gap-1 mt-2">
                                <span>{isEn ? "Read Dossier" : "Lire le dossier"}</span>
                                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
