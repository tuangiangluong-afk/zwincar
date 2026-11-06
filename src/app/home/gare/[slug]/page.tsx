export const revalidate = 86400; // 24h ISR cache
import { getGareAsCityConfig } from "@/lib/seo-gares";
import { SEO_GARES } from "@/lib/seo-gares";
import { notFound } from "next/navigation";
import { Phone, MapPin, CheckCircle, Train, Plane, Stethoscope, Clock, Star, ShieldCheck } from "lucide-react";
import CallButton from "@/components/CallButton";
import Link from "next/link";
import Image from "next/image";
import { getTheme } from "@/lib/theme";
import type { Metadata } from "next";
import { BookingWidget } from "@/components/BookingWidget";
import { InternalMesh } from "@/components/InternalMesh";
import { Footer } from "@/components/Footer";
import { Reviews } from "@/components/Reviews";
import { FAQ } from "@/components/FAQ";
import { StructuredData } from "@/components/StructuredData";
import { slugify } from "@/lib/slugify";
import { HeroCarousel } from "@/components/HeroCarousel";

// Dynamically generate for ALL Gares
export async function generateStaticParams() {
    return SEO_GARES.map(gare => ({ slug: gare.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const city = getGareAsCityConfig(resolvedParams.slug);

    if (!city) return {};

    return {
        title: city.meta.title,
        description: city.meta.description,
        alternates: {
            canonical: `https://taxifrance.fr/gare/${resolvedParams.slug}`,
        },
        openGraph: {
            title: city.meta.title,
            description: city.meta.description,
            url: `https://taxifrance.fr/gare/${resolvedParams.slug}`,
            type: "website",
            images: [city.heroImage],
        }
    };
}

export default async function StationPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    // Utilise l'adaptateur GARE
    const city = getGareAsCityConfig(resolvedParams.slug);

    if (!city) return notFound();

    const theme = getTheme("home"); // Using national theme
    const classes = theme.classes;

    return (
        <div className="min-h-screen bg-white font-sans text-neutral-900">
            {/* Schema.org Structured Data for SEO */}
            <StructuredData city={city} />

            {/* Nav */}
            <nav className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur-lg shadow-sm">
                <div className="container mx-auto flex items-center justify-between">
                    <Link href="/home" className="flex items-center gap-2 text-xl font-black tracking-tighter text-neutral-900 hover:text-blue-600 transition">
                        Taxi de France<span className="text-blue-600">.</span>
                    </Link>
                    <CallButton
                        phoneNumber={city.phoneNumber}
                        cityName={city.city}
                        theme={theme}
                        className={`rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-blue-700 active:scale-95`}
                    >
                        <div className="flex items-center gap-2">
                            <Phone size={16} />
                            <span>{city.phoneNumber}</span>
                        </div>
                    </CallButton>
                </div>
            </nav>

            {/* HERO - PREMIUM DESIGN */}
            <header className="relative bg-neutral-900 text-white overflow-hidden">
                {/* Hero Carousel (Dwell Time Booster) */}
                <HeroCarousel
                    images={[city.heroImage]}
                    alt={`Taxi à ${city.name}`}
                />

                <div className="container mx-auto px-4 pt-24 pb-32 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            {/* Breadcrumb */}
                            <div className="flex items-center gap-2 text-xs text-neutral-400 uppercase tracking-widest mb-6">
                                <Link href="/home" className="hover:text-white transition">Taxi France</Link>
                                <span>/</span>
                                <Link href="/home" className="hover:text-white transition">Gares</Link>
                                <span>/</span>
                                <span className="text-blue-400">{city.name}</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1]">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">{city.name}</span>
                            </h1>
                            <p className="text-xl text-neutral-300 mb-8 max-w-xl leading-relaxed">
                                {city.description}
                            </p>

                            {/* Features Pills */}
                            <div className="flex flex-wrap gap-3 mb-10">
                                {city.features.map((feature, i) => (
                                    <span key={i} className="bg-white/10 backdrop-blur border border-white/20 text-white text-sm font-semibold px-4 py-2 rounded-full">
                                        {feature}
                                    </span>
                                ))}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <CallButton
                                    phoneNumber={city.phoneNumber}
                                    cityName={city.city}
                                    theme={theme}
                                    className="inline-flex items-center justify-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-600/20"
                                >
                                    <Phone size={22} />
                                    Appeler Chauffeur
                                </CallButton>
                                <a
                                    href="#reserver"
                                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition"
                                >
                                    Réserver en Ligne
                                </a>
                            </div>
                        </div>

                        {/* Hero Stats Card */}
                        <div className="hidden lg:block">
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="bg-white/5 rounded-2xl p-5 text-center">
                                        <Clock size={28} className="mx-auto mb-3 text-yellow-400" />
                                        <div className="text-2xl font-bold">24h/7j</div>
                                        <div className="text-xs text-neutral-400 uppercase tracking-widest">Disponibilité</div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-5 text-center">
                                        <Star size={28} className="mx-auto mb-3 text-yellow-400" />
                                        <div className="text-2xl font-bold">4.9/5</div>
                                        <div className="text-xs text-neutral-400 uppercase tracking-widest">Note Voyageurs</div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-5 text-center">
                                        <ShieldCheck size={28} className="mx-auto mb-3 text-green-400" />
                                        <div className="text-2xl font-bold">Prix Fixe</div>
                                        <div className="text-xs text-neutral-400 uppercase tracking-widest">Forfait Garanti</div>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-5 text-center">
                                        <MapPin size={28} className="mx-auto mb-3 text-blue-400" />
                                        <div className="text-2xl font-bold">{city.pricing.base}</div>
                                        <div className="text-xs text-neutral-400 uppercase tracking-widest">{city.pricing.description}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="relative z-10">
                {/* Booking Widget Section - PULL UP */}
                <div id="reserver" className="container mx-auto px-4 -mt-16">
                    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white text-center">
                            <h2 className="font-bold text-xl">Réserver un Taxi à {city.name}</h2>
                            <p className="text-sm text-blue-100 mt-1">Confirmation immédiate par SMS</p>
                        </div>
                        <div className="p-6">
                            <BookingWidget city={city} />
                        </div>
                    </div>
                </div>

                {/* LOCAL SEO CONTENT - UNIQUE DATA */}
                <section className="container mx-auto px-4 py-20">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                            Votre Taxi à <span className="text-blue-600">{city.name}</span>
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            {/* Gares */}
                            <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100">
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
                                    <Train size={28} className="text-blue-600" />
                                </div>
                                <h3 className="font-bold text-xl mb-4">Gare TGV / Aéroport</h3>
                                <ul className="space-y-3">
                                    {city.stations.map((station, i) => (
                                        <li key={i} className="flex items-center justify-between text-neutral-600 group">
                                            <span className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-500 shrink-0" />
                                                {station}
                                            </span>
                                            <a href="#reserver" className="text-xs text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition">
                                                Réserver →
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Hôpitaux (Adapted to Transfers for Gares) */}
                            <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100">
                                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-6">
                                    <MapPin size={28} className="text-red-600" />
                                </div>
                                <h3 className="font-bold text-xl mb-4">Liaisons Fréquentes</h3>
                                <ul className="space-y-3">
                                    {city.neighborhoods.slice(0, 4).map((hospital, i) => (
                                        <li key={i} className="flex items-center justify-between text-neutral-600 group">
                                            <span className="flex items-center gap-2">
                                                <CheckCircle size={16} className="text-green-500 shrink-0" />
                                                {hospital}
                                            </span>
                                            <a href="#reserver" className="text-xs text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition">
                                                Réserver →
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Quartiers (Adapted to Tips) */}
                            <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100">
                                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
                                    <Clock size={28} className="text-purple-600" />
                                </div>
                                <h3 className="font-bold text-xl mb-4">Infos Pratiques</h3>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-neutral-600">
                                        <CheckCircle size={16} className="text-green-500 shrink-0" />
                                        Point de Rencontre Officiel
                                    </li>
                                    <li className="flex items-center gap-2 text-neutral-600">
                                        <CheckCircle size={16} className="text-green-500 shrink-0" />
                                        Pas de file d'attente
                                    </li>
                                    <li className="flex items-center gap-2 text-neutral-600">
                                        <CheckCircle size={16} className="text-green-500 shrink-0" />
                                        Aide aux bagages incluse
                                    </li>
                                    <li className="flex items-center gap-2 text-neutral-600">
                                        <CheckCircle size={16} className="text-green-500 shrink-0" />
                                        Sièges bébé sur demande
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* POI Links */}
                        <div className="bg-neutral-900 text-white rounded-3xl p-8 md:p-12 mt-12">
                            <h3 className="text-2xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
                                Autres Destinations Populaires
                            </h3>
                            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {city.points_of_interest.monuments.slice(0, 9).map((poi, i) => (
                                    <Link
                                        key={i}
                                        href={`/guides/${slugify(poi)}`}
                                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium hover:bg-white/10 transition flex items-center gap-2"
                                    >
                                        <MapPin size={14} className="text-blue-400" />
                                        Taxi → {poi}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* REVIEWS */}
                <div className="bg-neutral-50 border-y border-neutral-200 py-16">
                    <div className="container mx-auto px-4">
                        <Reviews city={city.city} tenantSlug={city.slug} />
                    </div>
                </div>

                {/* FAQ */}
                <div className="py-16">
                    <FAQ city={city.name} type="general" />
                </div>

                {/* LEGAL DISCLOSURE (Risk Mitigation) */}
                <div className="bg-neutral-100 border-t border-neutral-200 py-6 text-center text-xs text-neutral-500">
                    <div className="container mx-auto px-4">
                        <p>
                            Service opéré par des <strong>chauffeurs partenaires indépendants</strong> sélectionnés par le réseau Taxi de France.
                            La responsabilité du transport incombe au transporteur final. <Link href="/cgv" className="underline hover:text-neutral-900">Consulter les CGV</Link>.
                        </p>
                    </div>
                </div>
            </main>

            {/* Internal Linking Mesh - Contextual */}
            <InternalMesh city={city.city} config={city} />

            {/* Footer */}
            <div className="bg-neutral-900 [&_footer]:bg-transparent [&_footer]:border-none">
                <Footer config={city} />
            </div>
        </div>
    );
}
