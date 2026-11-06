export const revalidate = 86400; // 24h ISR cache
import { notFound } from "next/navigation";
import { Phone, MapPin, ArrowRight, Car, Building2, CheckCircle, Home } from "lucide-react";
import CallButton from "@/components/CallButton";
import Link from "next/link";
import { getTheme } from "@/lib/theme";
import type { Metadata } from "next";
import { NATIONAL_CONFIG } from "@/config/national";
import { BookingWidget } from "@/components/BookingWidget";
import { Footer } from "@/components/Footer";
import { InternalMesh } from "@/components/InternalMesh";
import { slugify } from "@/lib/slugify";
import { NATIONAL_TARGETS } from "@/config/national-targets"; // Source of Truth
import { getTargetAsCityConfig } from "@/config/national-targets";

// Helper to find Neighborhood across all Partner Cities
function getNeighborhood(slug: string) {
    // 1. Search in National Config Fallbacks
    const nationalNightlife = NATIONAL_CONFIG.points_of_interest.nightlife;
    let match = nationalNightlife.find(p => slugify(p) === slug);
    if (match) return { name: match, city: "Paris (ou National)" };

    // 2. Search in Partner Cities (Targets)
    for (const target of NATIONAL_TARGETS) {
        const config = getTargetAsCityConfig(target.slug);
        if (config && config.neighborhoods) {
            match = config.neighborhoods.find(n => slugify(n) === slug);
            if (match) return { name: match, city: target.name, citySlug: target.slug, config: config };
        }
    }

    return undefined;
}

export async function generateStaticParams() {
    // Collect all neighborhoods from all targets
    const allNeighborhoods = [];

    // National fallback
    allNeighborhoods.push(...NATIONAL_CONFIG.points_of_interest.nightlife);

    // Partners
    for (const target of NATIONAL_TARGETS) {
        const config = getTargetAsCityConfig(target.slug);
        if (config && config.neighborhoods) {
            allNeighborhoods.push(...config.neighborhoods);
        }
    }

    return allNeighborhoods.map(n => ({
        slug: slugify(n),
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const quartier = getNeighborhood(resolvedParams.slug);

    if (!quartier) return {};

    return {
        title: `Taxi ${quartier.name} - ${quartier.city} | Réservation Immédiate`,
        description: `Commandez votre taxi pour ${quartier.name} à ${quartier.city}. Chauffeur local, arrivée rapide, prix fixe. Service disponible 24h/24.`,
        alternates: {
            canonical: `https://taxifrance.fr/quartier/${resolvedParams.slug}`,
        }
    };
}

export default async function QuartierPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const quartier = getNeighborhood(resolvedParams.slug);

    if (!quartier) return notFound();

    const cityConfig = quartier.config || NATIONAL_CONFIG;
    const theme = getTheme("home");
    const classes = theme.classes;

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
            {/* Nav */}
            <nav className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/80 px-4 py-3 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between">
                    <Link
                        href="/home"
                        className={`flex items-center gap-2 text-xl font-black tracking-tighter text-neutral-900 hover:text-blue-600 transition`}
                    >
                        Taxi de France<span className="text-blue-600">.</span>
                    </Link>
                    <CallButton
                        phoneNumber={cityConfig.phoneNumber}
                        cityName={cityConfig.name}
                        theme={theme}
                        className={`rounded-full ${classes.bg} px-4 py-2 text-sm font-bold text-white shadow-lg transition hover:brightness-110 active:scale-95`}
                    >
                        <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>Appeler</span>
                        </div>
                    </CallButton>
                </div>
            </nav>

            {/* Header */}
            <header className="bg-neutral-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900"></div>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-bold uppercase tracking-widest mb-6">
                        Quartier & Zone Locale
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black mb-6">
                        Taxi <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">{quartier.name}</span>
                    </h1>
                    <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                        Service de transport prioritaire secteur {quartier.name} à {quartier.city}.
                        <br />Votre chauffeur arrive en moins de 10 minutes.
                    </p>
                </div>
            </header>

            <main className="container mx-auto max-w-5xl px-4 -mt-20 relative z-20">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-neutral-100">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                <Home className="text-blue-600" />
                                Se déplacer à {quartier.name}
                            </h2>
                            <div className="prose prose-neutral max-w-none text-neutral-600">
                                <p>
                                    Vous habitez ou visitez le quartier <strong>{quartier.name}</strong> ?
                                    Taxi de France met à votre disposition une flotte de chauffeurs dédiés à cette zone pour réduire les temps d'attente.
                                </p>
                                <p>
                                    Que ce soit pour un départ immédiat vers la gare, l'aéroport ou une consultation médicale, nous connaissons les moindres recoins de {quartier.name} pour éviter les bouchons.
                                </p>
                                <h3 className="font-bold text-neutral-900 mt-6 mb-3">Service de proximité</h3>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Disponibilité max dans le secteur</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Connaissance parfaite des raccourcis</li>
                                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Approche gratuite si réservation</li>
                                </ul>
                            </div>
                        </div>

                        {/* Local Reviews Mockup */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-neutral-100">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold">Avis clients {quartier.name}</h3>
                                <div className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Vérifié</div>
                            </div>
                            <p className="text-neutral-600 italic">"Très pratique d'avoir un taxi qui connait vraiment le quartier {quartier.name}. Pas besoin d'expliquer le chemin." - <span className="not-italic font-bold text-neutral-900">Thomas P.</span></p>
                        </div>
                    </div>

                    {/* Sidebar / Widget */}
                    <div className="md:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
                                <div className="bg-emerald-600 p-4 text-white text-center">
                                    <p className="font-bold">Commander Zone {quartier.name}</p>
                                </div>
                                <div className="p-4">
                                    <BookingWidget city={cityConfig} compact={true} />
                                </div>
                            </div>

                            <div className="bg-neutral-900 rounded-3xl p-6 text-white text-center">
                                <Phone size={32} className="mx-auto mb-4 text-emerald-400" />
                                <h3 className="font-bold text-lg mb-2">Standard Local</h3>
                                <p className="text-sm text-neutral-400 mb-4">Ligne directe pour {quartier.city}</p>
                                <CallButton
                                    phoneNumber={cityConfig.phoneNumber}
                                    cityName={cityConfig.name}
                                    theme={theme}
                                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-emerald-500 transition shadow-lg w-full"
                                >
                                    <Phone size={18} />
                                    {cityConfig.phoneNumber}
                                </CallButton>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <InternalMesh city={quartier.citySlug || NATIONAL_CONFIG.city} config={cityConfig} />
            {/* Override styling for dark theme integration */}
            <div className="bg-neutral-900 border-t border-white/5 [&_footer]:bg-transparent [&_footer]:border-none">
                <Footer config={cityConfig} />
            </div>
        </div>
    );
}
