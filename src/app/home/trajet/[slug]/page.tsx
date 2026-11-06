export const revalidate = 86400; // 24h ISR cache
import { SEO_ROUTES, RouteConfig } from "@/lib/seo-routes";
import { notFound } from "next/navigation";
import { Phone, MapPin, ArrowRight, Car, Euro, Clock, ShieldCheck, Flag } from "lucide-react";
import CallButton from "@/components/CallButton";
import Link from "next/link";
import { getTheme } from "@/lib/theme";
import { calculateDistance } from "@/lib/distance";
import type { Metadata } from "next";
import { NATIONAL_CONFIG } from "@/config/national";
import { BookingWidget } from "@/components/BookingWidget";
import { Footer } from "@/components/Footer";
import { InternalMesh } from "@/components/InternalMesh";

// Helper
function getRoute(slug: string) {
    return SEO_ROUTES.find(r => r.slug === slug);
}

// SSG Params
export async function generateStaticParams() {
    return SEO_ROUTES.map(route => ({
        slug: route.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const route = getRoute(resolvedParams.slug);

    if (!route) return {};

    return {
        title: `Taxi ${route.start} ${route.end} - Prix & Réservation | Taxi de France`,
        description: `Réservez votre taxi de ${route.start} à ${route.end}. Estimation tarifaire immédiate, chauffeur privé longue distance et confort premium. Devis gratuit.`,
        alternates: {
            canonical: `https://taxifrance.fr/trajet/${resolvedParams.slug}`,
        }
    };
}

export default async function TrajetPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const route = getRoute(resolvedParams.slug);

    if (!route) return notFound();

    const city = NATIONAL_CONFIG;
    const theme = getTheme("home");
    const classes = theme.classes;

    // Real Distance Calculation
    let priceRange = "Sur devis";
    let timeEst = "Variable";
    let distanceText = "";
    let distanceValue = 0; // meters

    const distanceResult = await calculateDistance(route.startAddress, route.endAddress);
    if (distanceResult) {
        priceRange = distanceResult.priceRange;
        timeEst = distanceResult.duration;
        distanceText = distanceResult.distance;
        distanceValue = distanceResult.distanceMeters;
    }

    // Determine type of trip for marketing text
    const isVeryLongDistance = distanceValue > 200000; // > 200km

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

            <main className="container mx-auto max-w-6xl px-4 py-12">
                <div className="mb-8 flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                    <Link href="/home" className="hover:text-neutral-900 transition">Accueil</Link>
                    <span>/</span>
                    <span className="text-neutral-900">Trajets</span>
                    <span>/</span>
                    <span className={`${classes.text}`}>Taxi {route.start} - {route.end}</span>
                </div>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Left Column: Content (8 cols) */}
                    <div className="lg:col-span-8">
                        {/* Header */}
                        <div className="mb-10">
                            <span className="inline-block py-1 px-3 rounded-full bg-blue-100/50 border border-blue-200 text-blue-600 text-xs font-bold uppercase tracking-widest mb-4">
                                Liaison Longue Distance
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900 mb-6 leading-tight">
                                Taxi <span className={`${classes.text}`}>{route.start}</span> <br />
                                vers <span className={`${classes.text}`}>{route.end}</span>
                            </h1>
                            <p className="text-xl text-neutral-600 leading-relaxed max-w-2xl">
                                {route.description} Profitez du confort d'une berline privative pour votre trajet porte-à-porte, sans correspondance ni stress.
                            </p>
                        </div>

                        {/* Route Stats Card */}
                        <div className="rounded-3xl bg-neutral-900 text-white p-8 shadow-2xl relative overflow-hidden mb-12">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                                {/* Visual Route */}
                                <div className="flex items-center gap-4 flex-1 w-full bg-white/5 p-4 rounded-2xl border border-white/10">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <div className="w-0.5 h-12 bg-white/20"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="flex-1 space-y-6">
                                        <div>
                                            <p className="text-xs text-neutral-400 uppercase tracking-widest">Départ</p>
                                            <p className="font-bold text-lg">{route.start}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-neutral-400 uppercase tracking-widest">Arrivée</p>
                                            <p className="font-bold text-lg">{route.end}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-6 w-full md:w-auto">
                                    <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                                        <Clock className="mx-auto mb-2 text-yellow-400" size={24} />
                                        <div className="text-2xl font-bold">{timeEst}</div>
                                        <div className="text-xs text-neutral-400 uppercase">Durée</div>
                                    </div>
                                    <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
                                        <Euro className="mx-auto mb-2 text-green-400" size={24} />
                                        <div className="text-2xl font-bold">{priceRange}</div>
                                        <div className="text-xs text-neutral-400 uppercase">Estimé</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/10 text-center md:text-left text-sm text-neutral-400 flex flex-col md:flex-row justify-between items-center gap-4">
                                <span>Distancé calculée : {distanceText}</span>
                                <CallButton
                                    phoneNumber={city.phoneNumber}
                                    cityName={city.name}
                                    theme={theme}
                                    className={`inline-flex items-center gap-2 bg-white text-neutral-900 px-6 py-2 rounded-full font-bold hover:bg-neutral-200 transition`}
                                >
                                    <Phone size={16} />
                                    Réserver par téléphone
                                </CallButton>
                            </div>
                        </div>

                        {/* Editorial SEO Content */}
                        <div className="prose prose-lg prose-neutral max-w-none text-neutral-600">

                            {/* COMPARATEUR : LE COUP DE GRÂCE AU TRAIN */}
                            <section className="py-8">
                                <h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir le Taxi sur ce trajet ?</h2>

                                <div className="grid md:grid-cols-2 gap-8 mb-16">
                                    {/* Colonne Train */}
                                    <div className="bg-white p-6 rounded-3xl border border-neutral-200 opacity-70 grayscale hover:grayscale-0 transition duration-500">
                                        <div className="flex items-center gap-3 mb-6 text-neutral-500">
                                            {/* Fallback Icon for Train since lucide-react Train might be missing or we use Car as proxy if needed, but assuming Train exists in lucide-react which it does */}
                                            <div className="p-3 bg-neutral-100 rounded-xl"><Car size={24} /></div>
                                            <h3 className="text-xl font-bold">Train / Avion</h3>
                                        </div>
                                        <ul className="space-y-4">
                                            <li className="flex items-start gap-3 text-red-600 font-medium">
                                                <span className="shrink-0 mt-1">❌</span>
                                                <span>Départ à heure fixe (Risque de rater)</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-red-600 font-medium">
                                                <span className="shrink-0 mt-1">❌</span>
                                                <span>Gare à Gare (Pas de porte-à-porte)</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-red-600 font-medium">
                                                <span className="shrink-0 mt-1">❌</span>
                                                <span>Bagages limités & Difficiles à porter</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-red-600 font-medium">
                                                <span className="shrink-0 mt-1">❌</span>
                                                <span>Grèves & Retards fréquents</span>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Colonne Taxi */}
                                    <div className="bg-white p-6 rounded-3xl border-2 border-blue-600 shadow-2xl relative overflow-hidden transform md:scale-105 z-10">
                                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">RECOMMANDÉ</div>
                                        <div className="flex items-center gap-3 mb-6 text-blue-900">
                                            <div className="p-3 bg-blue-100 rounded-xl"><MapPin size={24} className="text-blue-600" /></div>
                                            <h3 className="text-xl font-bold">Taxi Privé</h3>
                                        </div>
                                        <ul className="space-y-4">
                                            <li className="flex items-start gap-3 text-neutral-800 font-bold">
                                                <ShieldCheck size={20} className="text-green-500 shrink-0 mt-1" />
                                                <span>Départ quand VOUS voulez</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-neutral-800 font-bold">
                                                <ShieldCheck size={20} className="text-green-500 shrink-0 mt-1" />
                                                <span>Porte-à-Porte (Domicile - Hôtel)</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-neutral-800 font-bold">
                                                <ShieldCheck size={20} className="text-green-500 shrink-0 mt-1" />
                                                <span>Voyagez à 4 (Même prix)</span>
                                            </li>
                                            <li className="flex items-start gap-3 text-neutral-800 font-bold">
                                                <ShieldCheck size={20} className="text-green-500 shrink-0 mt-1" />
                                                <span>Wifi & Confort Berline</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                {/* CTA FINAL & Value Prop */}
                                <div className="bg-blue-50 border border-blue-100 p-8 rounded-2xl text-center mb-8">
                                    <p className="text-blue-900 text-lg">
                                        💡 <strong>Le saviez-vous ?</strong> Si vous voyagez à 3 ou 4 personnes, le Taxi est souvent
                                        <span className="underline decoration-blue-500 underline-offset-2 ml-1 font-bold">moins cher que le TGV</span>.
                                    </p>
                                    <p className="text-sm text-blue-700 mt-2">
                                        Exemple : 4 billets TGV peuvent coûter 400€+. Notre berline est à prix fixe (ex: ~{priceRange} pour tout le véhicule).
                                    </p>
                                </div>

                                <div className="text-center">
                                    <CallButton
                                        phoneNumber={city.phoneNumber}
                                        cityName={city.name}
                                        theme={theme}
                                        className={`inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/30`}
                                    >
                                        <Phone size={20} />
                                        Réserver ce trajet au {city.phoneNumber}
                                    </CallButton>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Right Column: Sticky Widget (4 cols) */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
                                <div className="bg-neutral-900 p-4 text-white text-center">
                                    <p className="font-bold">Réserver ce trajet</p>
                                    <p className="text-xs opacity-70">Confirmation immédiate</p>
                                </div>
                                <div className="p-4">
                                    <BookingWidget city={city} compact={true} />
                                </div>
                            </div>

                            {/* Upsell */}
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white text-center shadow-lg">
                                <Flag size={32} className="mx-auto mb-4 text-white/50" />
                                <h3 className="font-bold text-lg mb-2">Besoin d'un Van ?</h3>
                                <p className="text-sm text-blue-100 mb-4">Jusqu'à 7 passagers pour ce trajet. Idéal pour les groupes et séminaires.</p>
                                <a href="/van-minibus" className="inline-block bg-white/20 backdrop-blur border border-white/30 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-white/30 transition">
                                    Demander un Van
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Internal Linking - Other Routes - REPLACED BY MESH */}
            </main>
            <InternalMesh />
            {/* Override styling for dark theme integration */}
            <div className="bg-neutral-900 border-t border-white/5 [&_footer]:bg-transparent [&_footer]:border-none">
                <Footer config={city} />
            </div>
        </div>
    );
}
