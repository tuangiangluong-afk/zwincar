export const revalidate = 86400; // 24h ISR cache
import { SEO_DESTINATIONS, SEO_SERVICES } from "@/lib/seo-data";
import { getHelpfulContent } from "@/lib/content";
import { notFound } from "next/navigation";
import { Phone, Clock, ArrowRight, Car, Euro, CheckCircle } from "lucide-react";
import CallButton from "@/components/CallButton";
import Link from "next/link";
import { getTheme } from "@/lib/theme";
import { calculateDistance, getDestinationAddress } from "@/lib/distance";
import type { Metadata } from "next";
import { NATIONAL_CONFIG } from "@/config/national";

// Helper to find Destination
function getDestination(slug: string) {
    return SEO_DESTINATIONS.find(d => d.slug === slug);
}

// Generate Static Params for SSG/ISR
// For Home, we only generate for SEO destinations (no tenant multiplication)
export async function generateStaticParams() {
    return SEO_DESTINATIONS.map(dest => ({
        slug: dest.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const dest = getDestination(resolvedParams.slug);

    if (!dest) return {};

    const title = `Prix Taxi France - ${dest.name} | Estimation Tarifaire`;
    const description = `Quel est le prix d'un taxi pour aller à ${dest.name} ? Estimation du tarif jour/nuit et réservation immédiate partout en France.`;

    return {
        title: title,
        description: description,
        alternates: {
            canonical: `https://taxifrance.fr/tarif/${resolvedParams.slug}`,
        }
    };
}

export default async function NationalTarifPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const dest = getDestination(resolvedParams.slug);

    if (!dest) return notFound();

    const city = NATIONAL_CONFIG; // Use National Config
    const theme = getTheme("home");
    const classes = theme.classes;

    // Spintax Content (using "Paris" as context for spintax to have meaningful sentences)
    const intro = getHelpfulContent("airport_intro", "Paris", 'HUB'); // Default context
    const ctaText = "Commander maintenant";

    // Real Distance Calculation using Google Distance Matrix API
    // Defaulting to Paris Center for National Hub estimation
    let priceRange = "Sur devis";
    let timeEst = "Variable";
    let distanceText = "";

    const destAddress = getDestinationAddress(dest.slug);
    if (destAddress) {
        // Calculate from Paris center as a reference for national page
        const distanceResult = await calculateDistance("Paris, France", destAddress);
        if (distanceResult) {
            priceRange = distanceResult.priceRange;
            timeEst = distanceResult.duration;
            distanceText = distanceResult.distance;
        }
    }

    // Fallback logic
    if (priceRange === "Sur devis") {
        if (dest.type === 'airport') {
            priceRange = "55€ - 85€";
            timeEst = "Environ 1h";
        } else {
            priceRange = "Sur Devis";
            timeEst = "Variable";
        }
    }

    return (
        <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
            {/* Nav */}
            <nav className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/80 px-4 py-3 backdrop-blur-md">
                <div className="container mx-auto flex items-center justify-between">
                    <Link
                        href="/home"
                        className={`flex items-center gap-2 text-sm font-bold text-neutral-600 hover:text-neutral-900 transition`}
                    >
                        <Car size={16} />
                        Taxi de France
                    </Link>
                    <CallButton
                        phoneNumber={city.phoneNumber}
                        cityName={city.name}
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

            <main className="container mx-auto max-w-4xl px-4 py-12">
                <div className="mb-8 flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                    <Link href="/home" className="hover:text-neutral-900 transition">Accueil</Link>
                    <span>/</span>
                    <span className="text-neutral-900">Tarifs</span>
                    <span>/</span>
                    <span className={`${classes.text}`}>{dest.name}</span>
                </div>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Left: Content */}
                    <div>
                        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
                            Taxi vers <span className={`${classes.text}`}>{dest.name}</span>
                        </h1>
                        <p className="mb-8 text-lg text-neutral-600 leading-relaxed">
                            Besoin d'un taxi pour aller à <strong>{dest.name}</strong> ?
                            Profitez de notre réseau national de chauffeurs pour un trajet confortable et sécurisé.
                            Nous desservons toutes les gares et aéroports de France.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-3">
                                <CheckCircle className={`mt-1 shrink-0 ${classes.text}`} size={20} />
                                <div>
                                    <h3 className="font-bold text-neutral-900">Tarifs Réglementés</h3>
                                    <p className="text-sm text-neutral-600">Pas de majoration abusive. Compteur taxi ou forfait VTC.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CheckCircle className={`mt-1 shrink-0 ${classes.text}`} size={20} />
                                <div>
                                    <h3 className="font-bold text-neutral-900">Disponibilité Totale</h3>
                                    <p className="text-sm text-neutral-600">Réservez jour et nuit, même pour les trajets longue distance.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <CallButton
                                phoneNumber={city.phoneNumber}
                                cityName={city.name}
                                theme={theme}
                                className={`flex items-center justify-center gap-2 rounded-xl py-4 px-8 text-lg font-bold text-white shadow-xl transition-all hover:scale-105 hover:brightness-110 active:scale-95 ${classes.bg}`}
                            >
                                <Phone size={20} />
                                {ctaText}
                            </CallButton>
                            <Link
                                href="/home#book"
                                className="flex items-center justify-center gap-2 rounded-xl bg-white border border-neutral-200 py-4 px-8 text-lg font-bold text-neutral-900 shadow-sm transition-all hover:bg-neutral-50 active:scale-95"
                            >
                                Réserver en ligne
                            </Link>
                        </div>
                    </div>

                    {/* Right: Simulation Card */}
                    <div className="relative">
                        <div className="sticky top-24 rounded-3xl bg-neutral-900 p-1 shadow-2xl ring-1 ring-white/10">
                            <div className="rounded-[20px] bg-neutral-800 p-8 text-white h-full relative overflow-hidden">
                                <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full ${classes.bg} opacity-20 blur-3xl`}></div>

                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                                    <Euro className="text-yellow-400" />
                                    Estimation (depuis Paris)
                                </h2>

                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="w-3 h-3 rounded-full bg-white"></div>
                                            <div className="w-0.5 h-12 bg-white/20"></div>
                                            <div className={`w-3 h-3 rounded-full ${classes.bg}`}></div>
                                        </div>
                                        <div className="flex-1 space-y-8 py-2">
                                            <div>
                                                <p className="text-xs text-neutral-400 uppercase tracking-widest">Départ</p>
                                                <p className="font-bold text-lg">Paris (Centre)</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-neutral-400 uppercase tracking-widest">Arrivée</p>
                                                <p className="font-bold text-lg">{dest.name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="h-px w-full bg-white/10 my-6"></div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                                            <p className="text-xs text-neutral-400 mb-1">Durée Estimée</p>
                                            <div className="flex items-center gap-2 font-mono text-xl font-bold text-yellow-400">
                                                <Clock size={16} />
                                                {timeEst}
                                            </div>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                                            <p className="text-xs text-neutral-400 mb-1">Prix Estimé</p>
                                            <div className="flex items-center gap-2 font-mono text-xl font-bold text-green-400">
                                                <Euro size={16} />
                                                {priceRange}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-200 mt-4 leading-relaxed">
                                        Tarif indicatif au départ de Paris. Pour un départ depuis une autre ville, contactez notre central.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEO Navigation */}
                <div className="mt-20 border-t border-neutral-200 pt-12">
                    <h3 className="text-xl font-bold text-neutral-900 mb-6">Voir aussi nos autres services</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {SEO_SERVICES.map((service) => (
                            <Link
                                key={service.slug}
                                href={`/${service.slug}`}
                                className="group block p-4 rounded-xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition"
                            >
                                <h4 className={`font-bold ${classes.text} group-hover:opacity-80 transition flex items-center gap-2`}>
                                    <ArrowRight size={16} />
                                    {service.title}
                                </h4>
                                <p className="text-sm text-neutral-500 mt-1">{service.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
