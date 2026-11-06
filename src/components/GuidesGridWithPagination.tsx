"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Calendar, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

interface GuideItem {
    slug: string;
    title: string;
    shortTitle: string;
    metaDescription: string;
    heroImage: string;
    publishedAt: string;
    updatedAt: string;
    readTimeMinutes: number;
    author: {
        name: string;
        role: string;
        avatar: string;
        bio?: string;
    };
    category: string;
}

interface GuidesGridWithPaginationProps {
    guides: GuideItem[];
    locale?: "fr" | "en";
    itemsPerPage?: number;
}

export default function GuidesGridWithPagination({
    guides,
    locale = "fr",
    itemsPerPage = 8,
}: GuidesGridWithPaginationProps) {
    const isEn = locale === "en";
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Categories mapping
    const categories = useMemo(() => {
        const unique = Array.from(new Set(guides.map((g) => g.category)));
        return [
            { id: "all", label: isEn ? "All Guides" : "Tous les Guides", count: guides.length },
            ...unique.map((cat) => ({
                id: cat,
                label: cat,
                count: guides.filter((g) => g.category === cat).length,
            })),
        ];
    }, [guides, isEn]);

    // Filtered guides
    const filteredGuides = useMemo(() => {
        if (selectedCategory === "all") return guides;
        return guides.filter((g) => g.category === selectedCategory);
    }, [guides, selectedCategory]);

    // Total pages
    const totalPages = Math.ceil(filteredGuides.length / itemsPerPage);

    // Current slice
    const paginatedGuides = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredGuides.slice(start, start + itemsPerPage);
    }, [filteredGuides, currentPage, itemsPerPage]);

    const handleCategoryChange = (catId: string) => {
        setSelectedCategory(catId);
        setCurrentPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        const el = document.getElementById("guides-results-top");
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    function formatDate(dateStr: string) {
        try {
            const d = new Date(dateStr);
            if (isEn) {
                return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            }
            return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
        } catch {
            return dateStr;
        }
    }

    const basePath = isEn ? "/en/guides" : "/guides";

    return (
        <div id="guides-results-top" className="space-y-8 scroll-mt-8">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pb-2 overflow-x-auto scrollbar-none">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                            selectedCategory === cat.id
                                ? "bg-slate-900 text-white shadow-md scale-102"
                                : "bg-white text-slate-700 border border-[#ECE5D9] hover:border-[#C9572C] hover:text-[#C9572C]"
                        }`}
                    >
                        <span>{cat.label}</span>
                        <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                                selectedCategory === cat.id
                                    ? "bg-white/20 text-white"
                                    : "bg-slate-100 text-slate-600"
                            }`}
                        >
                            {cat.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Pagination Info Counter */}
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
                <span>
                    {isEn
                        ? `Showing ${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                              currentPage * itemsPerPage,
                              filteredGuides.length
                          )} of ${filteredGuides.length} guides`
                        : `Affichage de ${(currentPage - 1) * itemsPerPage + 1} à ${Math.min(
                              currentPage * itemsPerPage,
                              filteredGuides.length
                          )} sur ${filteredGuides.length} guides`}
                </span>
                {totalPages > 1 && (
                    <span className="font-mono">
                        Page {currentPage} / {totalPages}
                    </span>
                )}
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {paginatedGuides.map((guide) => (
                    <article
                        key={guide.slug}
                        className="group rounded-3xl bg-white border border-[#ECE5D9] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                    >
                        <div>
                            {/* Hero Image */}
                            <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                                <Image
                                    src={guide.heroImage}
                                    alt={guide.shortTitle || guide.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    sizes="(max-width: 768px) 100vw, 500px"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                                        {guide.category}
                                    </span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6 sm:p-7 space-y-3">
                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                                    <span className="flex items-center gap-1">
                                        <Clock size={13} />
                                        {guide.readTimeMinutes} {isEn ? "min read" : "min de lecture"}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Calendar size={13} className="text-slate-400" />
                                        {formatDate(guide.publishedAt)}
                                    </span>
                                </div>

                                <h3 className="text-xl font-black text-slate-900 group-hover:text-[#C9572C] transition-colors line-clamp-2 leading-tight">
                                    <Link href={`${basePath}/${guide.slug}`}>
                                        {guide.title}
                                    </Link>
                                </h3>

                                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                    {guide.metaDescription}
                                </p>
                            </div>
                        </div>

                        {/* Author & CTA Footer */}
                        <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full overflow-hidden relative shrink-0 border border-slate-200">
                                    <Image
                                        src={guide.author.avatar}
                                        alt={guide.author.name}
                                        fill
                                        sizes="32px"
                                        className="object-cover"
                                    />
                                </div>
                                <div className="text-left">
                                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                                        {guide.author.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500 line-clamp-1">
                                        {guide.author.role.split("&")[0]}
                                    </div>
                                </div>
                            </div>

                            <Link
                                href={`${basePath}/${guide.slug}`}
                                aria-label={`${isEn ? "Read guide" : "Lire le guide"} : ${guide.shortTitle || guide.title}`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] text-[#C9572C] hover:bg-[#C9572C] hover:text-white transition-all text-xs font-bold shrink-0"
                            >
                                <span>{isEn ? "Read Guide" : "Lire"}</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>
                    </article>
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8 border-t border-[#ECE5D9]">
                    <button
                        type="button"
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold border border-[#ECE5D9] bg-white text-slate-700 hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        <ChevronLeft size={14} />
                        <span>{isEn ? "Previous" : "Précédent"}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                type="button"
                                onClick={() => handlePageChange(page)}
                                className={`w-9 h-9 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
                                    currentPage === page
                                        ? "bg-[#C9572C] text-white shadow-sm"
                                        : "bg-white text-slate-700 border border-[#ECE5D9] hover:bg-[#FAF7F2]"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold border border-[#ECE5D9] bg-white text-slate-700 hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                        <span>{isEn ? "Next" : "Suivant"}</span>
                        <ChevronRight size={14} />
                    </button>
                </div>
            )}
        </div>
    );
}
