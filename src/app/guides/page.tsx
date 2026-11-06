import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, ArrowRight, ShieldCheck, MapPin, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MOROCCO_GUIDES } from "@/data/morocco-guides";
import { clampTitle, clampDescription } from "@/lib/seo-meta";
import SchemaJSON from "@/components/SchemaJSON";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: clampTitle("Guides Conduite & Conseils Location de Voiture au Maroc | ZwinCar"),
    description: clampDescription(
        "Tous les conseils d'experts pour conduire au Maroc en 2026 : radars, ronds-points, pièges de caution CB, col du Tichka et roadtrips atlantiques sans stress."
    ),
    alternates: {
        canonical: "https://zwincar.com/guides",
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
                    </div>
                </section>

                {/* Guides Grid */}
                <section className="py-12 sm:py-16">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {MOROCCO_GUIDES.map((guide) => (
                                <article
                                    key={guide.slug}
                                    className="group rounded-3xl bg-white border border-[#ECE5D9] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Image */}
                                        <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                                            <Image
                                                src={guide.heroImage}
                                                alt={guide.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider">
                                                    {guide.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="p-6 sm:p-7 space-y-3">
                                            <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={13} />
                                                    {guide.readTimeMinutes} min de lecture
                                                </span>
                                                <span>•</span>
                                                <span>Mis à jour en 2026</span>
                                            </div>

                                            <h2 className="text-xl font-black text-slate-900 group-hover:text-[#C9572C] transition-colors line-clamp-2">
                                                <Link href={`/guides/${guide.slug}`}>
                                                    {guide.title}
                                                </Link>
                                            </h2>

                                            <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                                {guide.metaDescription}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Author & CTA */}
                                    <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full overflow-hidden relative">
                                                <Image
                                                    src={guide.author.avatar}
                                                    alt={guide.author.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="text-left">
                                                <div className="text-xs font-bold text-slate-900">
                                                    {guide.author.name}
                                                </div>
                                                <div className="text-[10px] text-slate-500">
                                                    ZwinCar Maroc
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/guides/${guide.slug}`}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9572C] group-hover:translate-x-1 transition-transform"
                                        >
                                            <span>Lire le guide</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
