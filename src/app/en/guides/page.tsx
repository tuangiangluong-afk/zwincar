import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MOROCCO_GUIDES_EN } from "@/data/morocco-guides-en";
import { clampTitle, clampDescription } from "@/lib/seo-meta";
import SchemaJSON from "@/components/SchemaJSON";

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
            <Header />

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

                <section className="py-12 sm:py-16">
                    <div className="container mx-auto px-4 max-w-5xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {MOROCCO_GUIDES_EN && MOROCCO_GUIDES_EN.length > 0 ? (
                                MOROCCO_GUIDES_EN.map((guide) => (
                                    <article
                                        key={guide.slug}
                                        className="group rounded-3xl bg-white border border-[#ECE5D9] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                                                <Image
                                                    src={guide.heroImage}
                                                    alt={guide.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold uppercase tracking-wider">
                                                        {guide.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-6 sm:p-7 space-y-3">
                                                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={13} />
                                                        {guide.readTimeMinutes} min read
                                                    </span>
                                                    <span>•</span>
                                                    <span>Updated 2026</span>
                                                </div>

                                                <h2 className="text-xl font-black text-slate-900 group-hover:text-[#C9572C] transition-colors line-clamp-2">
                                                    <Link href={`/en/guides/${guide.slug}`}>{guide.title}</Link>
                                                </h2>

                                                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                                                    {guide.metaDescription}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full overflow-hidden relative">
                                                    <Image
                                                        src={guide.author.avatar}
                                                        alt={guide.author.name}
                                                        fill
                                                        sizes="32px"
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="text-left">
                                                    <div className="text-xs font-bold text-slate-900">
                                                        {guide.author.name}
                                                    </div>
                                                    <div className="text-[10px] text-slate-500">{guide.author.role}</div>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/en/guides/${guide.slug}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9572C] hover:text-[#A8431F] transition-colors"
                                            >
                                                <span>Read Guide</span>
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="col-span-2 text-center py-12 text-slate-500">
                                    Our English guides are being translated. Meanwhile,{" "}
                                    <Link href="/guides" className="font-bold text-[#C9572C] underline">
                                        read the French guides
                                    </Link>
                                    .
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
