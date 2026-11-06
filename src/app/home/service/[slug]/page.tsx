export const revalidate = 86400; // 24h ISR cache
import { SEO_SERVICES } from "@/lib/seo-data";
import { notFound } from "next/navigation";
import { Phone, CheckCircle, ArrowRight, Car, ShieldCheck, Clock, Ambulance } from "lucide-react";
import CallButton from "@/components/CallButton";
import Link from "next/link";
import { getTheme } from "@/lib/theme";
import type { Metadata } from "next";
import { NATIONAL_CONFIG } from "@/config/national";
import { BookingWidget } from "@/components/BookingWidget";
import { Footer } from "@/components/Footer";
import { InternalMesh } from "@/components/InternalMesh";
import { MedicalSteps } from "@/components/MedicalSteps";
import { DistanceCalculator } from "@/components/DistanceCalculator";

// Helper
function getService(slug: string) {
    return SEO_SERVICES.find(s => s.slug === slug);
}

export async function generateStaticParams() {
    return SEO_SERVICES.map(service => ({
        slug: service.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const service = getService(resolvedParams.slug);

    if (!service) return {};

    return {
        title: `${service.title} - Service National | Taxi de France`,
        description: `${service.description}. Service disponible dans toute la France avec notre réseau de chauffeurs partenaires.`,
        alternates: {
            canonical: `https://taxifrance.fr/service/${resolvedParams.slug}`,
        }
    };
}

export default async function NationalServicePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const service = getService(resolvedParams.slug);

    if (!service) return notFound();

    const city = NATIONAL_CONFIG;
    const theme = getTheme("home");
    const classes = theme.classes;

    const isMedical = service.slug === 'conventionne-cpam' || service.slug === 'transport-medical';
    const isLongDistance = service.slug === 'longue-distance';
    const isNight = service.slug === 'nuit';

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

            {/* Header */}
            <header className="bg-neutral-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900"></div>
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                            Service National
                        </span>
                        <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
                            {service.title}
                        </h1>
                        <p className="text-xl text-neutral-300 max-w-lg mb-8">
                            {service.description}. Profitez de l'excellence de notre réseau partout en France.
                        </p>
                        <div className="flex gap-4">
                            <CallButton
                                phoneNumber={city.phoneNumber}
                                cityName={city.name}
                                theme={theme}
                                className={`inline-flex items-center justify-center gap-2 rounded-xl py-3 px-6 font-bold text-white shadow-lg transition-all hover:scale-105 ${classes.bg}`}
                            >
                                <Phone size={20} />
                                Commander
                            </CallButton>
                        </div>
                    </div>

                    {/* Hero Widget Area */}
                    <div className="relative hidden md:block">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/30 rounded-full blur-[80px]"></div>

                        {isLongDistance ? (
                            // CALCULATOR WIDGET FOR LONG DISTANCE
                            <div className="transform scale-90 origin-top-right">
                                <DistanceCalculator city={city} />
                            </div>
                        ) : (
                            // STANDARD BENEFITS CARD
                            <div className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-3xl">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-neutral-300">
                                        <ShieldCheck size={24} className="text-emerald-400" />
                                        <div>
                                            <div className="font-bold text-white">Sécurité Garantie</div>
                                            <div className="text-sm">Chauffeurs vérifiés</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-neutral-300">
                                        <Clock size={24} className="text-yellow-400" />
                                        <div>
                                            <div className="font-bold text-white">Ponctualité</div>
                                            <div className="text-sm">Suivi temps réel</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-neutral-300">
                                        <Car size={24} className="text-blue-400" />
                                        <div>
                                            <div className="font-bold text-white">Confort</div>
                                            <div className="text-sm">Berlines récentes</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-5xl px-4 py-16">

                {/* MEDICAL SPECIFIC SECTION (WINNING ELEMENT) */}
                {isMedical && (
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Tiers-Payant : Comment ne rien payer ?</h2>
                            <p className="text-neutral-500 max-w-2xl mx-auto">Avec une prescription médicale, votre transport peut être pris en charge à 100% par la Sécurité Sociale sans avance de frais.</p>
                        </div>

                        <MedicalSteps cityName="France entière" />

                        {/* Documents Requis Block from City Page */}
                        <div className="mt-12 bg-white rounded-3xl p-8 border border-neutral-200 shadow-xl">
                            <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                                    <ShieldCheck size={22} />
                                </div>
                                Documents à présenter au chauffeur
                            </h3>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="flex flex-col gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                                    <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">1</div>
                                    <div>
                                        <strong className="block text-lg mb-2">Prescription Médicale</strong>
                                        <p className="text-sm text-neutral-500">Bon de transport signé par le médecin, daté d'avant le transport.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                                    <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">2</div>
                                    <div>
                                        <strong className="block text-lg mb-2">Carte Vitale</strong>
                                        <p className="text-sm text-neutral-500">À jour. Elle permet la télétransmission directe à la CPAM.</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                                    <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">3</div>
                                    <div>
                                        <strong className="block text-lg mb-2">Attestation de Droits</strong>
                                        <p className="text-sm text-neutral-500">Uniquement si vos droits ne sont pas lisibles sur la carte (rare).</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* NIGHT SERVICE SPECIFIC SECTION */}
                {isNight && (
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Rentrez en toute sécurité 🌙</h2>
                            <p className="text-neutral-500 max-w-2xl mx-auto">
                                Plus de trains ? Sortie tardive ? Nos chauffeurs de nuit sont disponibles immédiatement pour vous ramener à bon port.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Security Feature */}
                            <div className="bg-neutral-900 text-white p-8 rounded-3xl col-span-1 md:col-span-2 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <ShieldCheck size={120} />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                        <ShieldCheck className="text-emerald-400" />
                                        La Sécurité avant tout
                                    </h3>
                                    <ul className="space-y-4 text-neutral-300">
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="text-emerald-500 shrink-0 mt-1" size={18} />
                                            <span><strong>Chauffeurs Identifiés :</strong> Tous nos chauffeurs sont des professionnels licenciés en préfecture.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="text-emerald-500 shrink-0 mt-1" size={18} />
                                            <span><strong>Géolocalisation :</strong> Votre trajet est suivi en temps réel.</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <CheckCircle className="text-emerald-500 shrink-0 mt-1" size={18} />
                                            <span><strong>Pas de surprise :</strong> Compteur horokilométrique officiel ou forfait aéroport.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Quick Use Cases */}
                            <div className="bg-white border border-neutral-200 p-8 rounded-3xl shadow-lg">
                                <h3 className="font-bold text-lg mb-6">Pourquoi commander ?</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                                            <Car size={20} />
                                        </div>
                                        <div className="text-sm border-b border-neutral-100 pb-2 w-full">
                                            <strong>Sortie de Boîte / Bar</strong>
                                            <div className="text-neutral-500 text-xs">Ne prenez pas le volant.</div>
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <Clock size={20} />
                                        </div>
                                        <div className="text-sm border-b border-neutral-100 pb-2 w-full">
                                            <strong>Urgence Tôt le Matin</strong>
                                            <div className="text-neutral-500 text-xs">Départ gare/avion à 4h00 ?</div>
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                            <Ambulance size={20} />
                                        </div>
                                        <div className="text-sm w-full">
                                            <strong>Urgence Pharmacie</strong>
                                            <div className="text-neutral-500 text-xs">Déplacement santé non-vital.</div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* LONG DISTANCE SPECIFIC SECTION (ESTIMATOR MOBILE FALLBACK) */}
                {isLongDistance && (
                    <div className="md:hidden mb-12">
                        <DistanceCalculator city={city} />
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="md:col-span-2">
                        <div className="prose prose-lg prose-neutral max-w-none text-neutral-600">
                            <h2 className="text-3xl font-bold text-neutral-900 mb-6">Pourquoi choisir Taxi de France pour {service.title.toLowerCase()} ?</h2>
                            <p>
                                Notre service de <strong>{service.title}</strong> est conçu pour répondre aux besoins des particuliers et des professionnels exigeants.
                                Grâce à notre maillage national, nous pouvons vous garantir une prise en charge rapide, où que vous soyez.
                            </p>
                            <p>
                                Que ce soit pour un transfert gare/aéroport, un rendez-vous médical ou un déplacement longue distance, nous sélectionnons le chauffeur le plus adapté à votre demande.
                            </p>

                            <div className="my-8 grid sm:grid-cols-2 gap-4 not-prose">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                                    <h3 className="font-bold text-lg mb-2 text-neutral-900">Réservation Simplifiée</h3>
                                    <p className="text-sm">Un seul numéro pour toutes vos demandes en France.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                                    <h3 className="font-bold text-lg mb-2 text-neutral-900">Suivi Personnalisé</h3>
                                    <p className="text-sm">Nous suivons votre dossier de la réservation à la dépose.</p>
                                </div>
                            </div>

                            <h3 className="font-bold text-neutral-900 mt-8 mb-4">Questions Fréquentes</h3>
                            <div className="space-y-4 not-prose">
                                <details className="group bg-white rounded-xl border border-neutral-200 p-4 [&_summary::-webkit-details-marker]:hidden">
                                    <summary className="flex items-center justify-between cursor-pointer font-medium text-neutral-900">
                                        Comment sont calculés les tarifs ?
                                        <span className="shrink-0 ml-1.5 p-1.5 text-neutral-900 bg-white rounded-full group-open:-rotate-180 transition">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </summary>
                                    <p className="mt-4 leading-relaxed text-neutral-600 text-sm">
                                        Les tarifs respectent la réglementation préfectorale en vigueur (taximètre) ou sont fixés à l'avance sous forme de forfait (notamment pour les VTC et les transferts aéroports).
                                    </p>
                                </details>
                                <details className="group bg-white rounded-xl border border-neutral-200 p-4 [&_summary::-webkit-details-marker]:hidden">
                                    <summary className="flex items-center justify-between cursor-pointer font-medium text-neutral-900">
                                        Acceptez-vous les animaux ?
                                        <span className="shrink-0 ml-1.5 p-1.5 text-neutral-900 bg-white rounded-full group-open:-rotate-180 transition">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                    </summary>
                                    <p className="mt-4 leading-relaxed text-neutral-600 text-sm">
                                        Oui, la plupart de nos chauffeurs acceptent les animaux de compagnie (chiens, chats) en caisse de transport. Merci de le préciser lors de la réservation.
                                    </p>
                                </details>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-1 space-y-8">
                        {/* Booking Widget Wrapper */}
                        <div className="sticky top-24">
                            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
                                <div className="bg-neutral-900 p-4 text-white text-center">
                                    <p className="font-bold">Commander un Taxi</p>
                                </div>
                                <div className="p-4">
                                    <BookingWidget city={city} compact={true} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <InternalMesh city="France" config={isMedical ? NATIONAL_CONFIG : undefined} />
            {/* Override styling for dark theme integration */}
            <div className="bg-neutral-900 border-t border-white/5 [&_footer]:bg-transparent [&_footer]:border-none">
                <Footer config={city} />
            </div>
        </div>
    );
}

