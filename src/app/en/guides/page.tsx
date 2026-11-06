import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MOROCCO_GUIDES_EN } from "@/data/morocco-guides-en";
import { clampTitle, clampDescription } from "@/lib/seo-meta";
import SchemaJSON from "@/components/SchemaJSON";
import GuidesGridWithPagination from "@/components/GuidesGridWithPagination";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: clampTitle("Morocco Driving Guides & Car Rental Advice 2026 | ZwinCar"),
    description: clampDescription(
        "Expert roadtrip advice for Morocco: no credit card car rental, police checkpoints, speed cameras, Tizi n'Tichka pass, desert driving & avoiding airport scams."
    ),
    alternates: {
        canonical: "https://zwincar.com/en/guides",
        languages: {
            "en-US": "https://zwincar.com/en/guides",
            "fr-FR": "https://zwincar.com/guides",
            "x-default": "https://zwincar.com/en/guides",
        },
    },
};

export default function EnglishGuidesPage() {
    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col font-sans">
            <Header locale="en" />

            <SchemaJSON
                schema={{
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: "Home", item: "https://zwincar.com/en" },
                        { "@type": "ListItem", position: 2, name: "Morocco Guides", item: "https://zwincar.com/en/guides" },
                    ],
                }}
            />

            <main className="flex-1">
                <section className="py-14 sm:py-20 border-b border-[#ECE5D9] bg-gradient-to-b from-[#FAF7F2] to-white">
                    <div className="container mx-auto px-4 max-w-5xl text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9572C]/10 border border-[#C9572C]/20 text-[#C9572C] text-xs font-bold tracking-wide uppercase">
                            <Sparkles size={14} />
                            <span>Local Expertise &amp; Road Safety</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Morocco Driving Guides &amp; <br className="hidden sm:inline" />
                            <span className="text-[#C9572C]">Car Rental Tips (2026)</span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Bypass airport credit card deposit traps, master priority-to-the-right roundabouts, and
                            navigate Atlas mountain passes with complete peace of mind.
                        </p>
                    </div>
                </section>

                {/* Guides Grid with Category Filters & Pagination */}
                <section className="py-12 sm:py-16">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <GuidesGridWithPagination
                            guides={MOROCCO_GUIDES_EN}
                            locale="en"
                            itemsPerPage={8}
                        />
                    </div>
                </section>
            </main>

            <Footer locale="en" />
        </div>
    );
}
