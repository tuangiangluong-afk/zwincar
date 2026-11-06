import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, ArrowRight, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MOROCCO_GUIDES } from "@/data/morocco-guides";
import { clampTitle, clampDescription } from "@/lib/seo-meta";
import SchemaJSON from "@/components/SchemaJSON";
import GuidesGridWithPagination from "@/components/GuidesGridWithPagination";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: clampTitle("Guides Conduite • Conseils Location Maroc | ZwinCar"),
    description: clampDescription(
        "Tous les conseils d'experts pour conduire au Maroc en 2026 : radars, ronds-points, pièges de caution CB, col du Tichka et roadtrips atlantiques sans stress."
    ),
    alternates: {
        canonical: "https://zwincar.com/guides",
        languages: {
            "fr-FR": "https://zwincar.com/guides",
            "en-US": "https://zwincar.com/en/guides",
            "x-default": "https://zwincar.com/en/guides",
        },
    },
};

export default function GuidesPage() {
    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col font-sans">
            <Header />

            {/* Breadcrumb Schema */}
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
                    ],
                }}
            />

            <main className="flex-1">
                {/* Hero Header */}
                <section className="py-14 sm:py-20 border-b border-[#ECE5D9] bg-gradient-to-b from-[#FAF7F2] to-white">
                    <div className="container mx-auto px-4 max-w-5xl text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9572C]/10 border border-[#C9572C]/20 text-[#C9572C] text-xs font-bold tracking-wide uppercase">
                            <Sparkles size={14} />
                            <span>Expertise Terrain & Sécurité Routière</span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Guides de Conduite & Conseils <br className="hidden sm:inline" />
                            <span className="text-[#C9572C]">Location de Voiture au Maroc</span>
                        </h1>
                        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Évitez les pièges de caution à l'aéroport, comprenez les priorités aux carrefours giratoires et préparez vos roadtrips dans l'Atlas en toute sérénité.
                        </p>
                        <div className="pt-2">
                            <Link
                                href="/en/guides"
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:border-emerald-300 transition-colors shadow-2xs"
                            >
                                <span className="text-base">🇬🇧</span>
                                <span>Looking for English driving guides? Read all 24 guides in English</span>
                                <ArrowRight size={12} />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Guides Grid with Category Filters & Pagination */}
                <section className="py-12 sm:py-16">
                    <h2 className="sr-only">Tous nos dossiers et guides routiers</h2>
                    <div className="container mx-auto px-4 max-w-5xl">
                        <GuidesGridWithPagination guides={MOROCCO_GUIDES} locale="fr" itemsPerPage={8} />
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
