import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import VehicleCatalog from "@/components/VehicleCatalog";
import LocalAeoSection from "@/components/LocalAeoSection";
import SchemaJSON from "@/components/SchemaJSON";
import { MOROCCAN_HUBS, DIRECT_ANSWERS_AEO } from "@/lib/morocco-data";
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    MapPin,
    ArrowRight,
    Star,
    MessageCircle,
    Plane,
    CreditCard,
    KeyRound,
    Sparkles,
} from "lucide-react";

export const revalidate = 3600;

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#12161E] selection:bg-[#C9572C] selection:text-white">
            {/* Structured Data AEO & SEO */}
            <SchemaJSON
                type="AutoRental"
                faqs={DIRECT_ANSWERS_AEO.faqs}
                breadcrumbItems={[
                    { name: "Accueil", item: "https://zwincar.com" },
                    { name: "Maroc", item: "https://zwincar.com/maroc" },
                ]}
            />

            {/* Header Navigation */}
            <Header />

            {/* HERO SECTION */}
            <section className="relative pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden">
                {/* Subtle warm desert architectural ambience */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-gradient-to-b from-[#E7DFD5]/40 via-[#FAF7F2]/60 to-transparent blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    {/* Top Pill */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E7DFD5] shadow-xs text-xs font-bold text-slate-800">
                            <span className="w-2 h-2 rounded-full bg-[#C9572C]"></span>
                            <span>MAROC • RÉSERVATION DIRECTE AUPRÈS DES MEILLEURS LOUEURS LOCAUX</span>
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="text-center max-w-4xl mx-auto mb-10">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.08] mb-6">
                            Louez votre voiture au Maroc.{" "}
                            <span className="text-[#C9572C]">Sans caution de 1 500 € bloquée.</span>{" "}
                            Sans mauvaise surprise.
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                            Marrakech, Agadir, Casablanca, Tanger, Fès, Ouarzazate. Véhicules récents, cartes de débit et espèces acceptées. Remise des clés directe au parking sans guichet.
                        </p>

                        {/* 3 Clear Guarantees */}
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-8 text-xs sm:text-sm font-semibold text-slate-700">
                            <span className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#E7DFD5]">
                                <ShieldCheck size={16} className="text-[#C9572C]" />
                                0 € de caution avec Franchise Zéro (ou 300 € standard)
                            </span>
                            <span className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#E7DFD5]">
                                <KeyRound size={16} className="text-slate-800" />
                                Modèle exact garanti
                            </span>
                            <span className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#E7DFD5]">
                                <CreditCard size={16} className="text-slate-800" />
                                Débit & Espèces acceptés
                            </span>
                        </div>
                    </div>

                    {/* Interactive Booking Widget */}
                    <BookingWidget />

                    {/* Roadtrip Inspiration Gallery (Photos Hautes Définitions pour Donner Envie) */}
                    <div className="mt-14 pt-8 border-t border-[#E7DFD5]">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9572C] block">
                                    Inspiration Roadtrip
                                </span>
                                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                    Le Maroc à votre rythme, en toute liberté
                                </h3>
                            </div>
                            <span className="text-xs text-slate-500 hidden sm:inline">
                                Kilométrage illimité sur tous nos véhicules
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            {/* Photo 1: Col du Tichka */}
                            <div className="group relative h-48 sm:h-64 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E7DFD5] shadow-xs">
                                <img
                                    src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80"
                                    alt="Col du Tichka Haut Atlas Maroc"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <div className="text-[10px] uppercase font-bold text-[#E58B24]">
                                        Haut-Atlas • N9
                                    </div>
                                    <div className="text-xs sm:text-sm font-black leading-tight">
                                        Col du Tichka (2 260 m)
                                    </div>
                                    <div className="text-[10px] text-white/80 mt-0.5">
                                        Lacets & panoramas spectaculaires
                                    </div>
                                </div>
                            </div>

                            {/* Photo 2: Taghazout Coast */}
                            <div className="group relative h-48 sm:h-64 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E7DFD5] shadow-xs">
                                <img
                                    src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80"
                                    alt="Taghazout et Côte Atlantique"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <div className="text-[10px] uppercase font-bold text-[#E58B24]">
                                        Océan Atlantique • N1
                                    </div>
                                    <div className="text-xs sm:text-sm font-black leading-tight">
                                        Taghazout & Imsouane
                                    </div>
                                    <div className="text-[10px] text-white/80 mt-0.5">
                                        Surftrip & falaises dorées
                                    </div>
                                </div>
                            </div>

                            {/* Photo 3: Agafay Desert */}
                            <div className="group relative h-48 sm:h-64 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E7DFD5] shadow-xs">
                                <img
                                    src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
                                    alt="Désert d'Agafay en 4x4"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <div className="text-[10px] uppercase font-bold text-[#E58B24]">
                                        Pistes Carrossables
                                    </div>
                                    <div className="text-xs sm:text-sm font-black leading-tight">
                                        Désert d'Agafay
                                    </div>
                                    <div className="text-[10px] text-white/80 mt-0.5">
                                        Bivouacs & coucher de soleil
                                    </div>
                                </div>
                            </div>

                            {/* Photo 4: Marrakech Medina */}
                            <div className="group relative h-48 sm:h-64 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E7DFD5] shadow-xs">
                                <img
                                    src="https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=800&q=80"
                                    alt="Marrakech Médina et Palmeraie"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <div className="text-[10px] uppercase font-bold text-[#E58B24]">
                                        Marrakech • Menara
                                    </div>
                                    <div className="text-xs sm:text-sm font-black leading-tight">
                                        Palmeraie & Remparts
                                    </div>
                                    <div className="text-[10px] text-white/80 mt-0.5">
                                        Livraison directe au Riad
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VEHICLE CATALOG SECTION */}
            <VehicleCatalog />

            {/* WHY ZWINCAR / CONTRAST SECTION (ZERO AI SLOP, HIGH TASTE) */}
            <section id="zero-caution" className="py-20 bg-white border-y border-[#E7DFD5]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9572C] mb-2">
                            <ShieldCheck size={14} />
                            La Différence ZwinCar
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            Pourquoi 9 touristes sur 10 détestent louer aux comptoirs d'aéroport
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 mt-3">
                            En arrivant à Marrakech ou Casablanca, le piège classique se referme : carte de débit refusée, 1h de file d'attente et 300€ d'assurance forcée. Voici comment ZwinCar change la donne.
                        </p>
                    </div>

                    {/* Dual Comparison Cards */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* The Bad Way (Airport Desks) */}
                        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 text-left space-y-5">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        Modèle Classique
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        Grands Loueurs & Courtiers Web
                                    </h3>
                                </div>
                                <span className="p-2 rounded-full bg-red-100 text-red-600">
                                    <XCircle size={22} />
                                </span>
                            </div>

                            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600">
                                <li className="flex items-start gap-2.5">
                                    <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                    <span><strong>1 500 € à 2 500 € de caution bloquée</strong> sur votre carte bancaire (détruit le plafond de vos vacances).</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                    <span><strong>Refus des cartes de DÉBIT</strong> (90% des cartes françaises) pour vous forcer à payer 35€/jour d'assurance rachat franchise.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                    <span><strong>Attente interminable</strong> : 45 à 60 minutes de queue au guichet après 3h de vol.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                    <span><strong>Véhicule aléatoire</strong> : Vous réservez une Clio, vous repartez avec une citadine fatiguée de 160 000 km.</span>
                                </li>
                            </ul>
                        </div>

                        {/* The ZwinCar Way */}
                        <div className="rounded-3xl bg-[#FAF7F2] border-2 border-[#C9572C]/40 p-8 text-left space-y-5 relative shadow-sm">
                            <div className="flex items-center justify-between pb-4 border-b border-[#E7DFD5]">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-[#C9572C]">
                                        L'Expérience ZwinCar
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        Agences Locales Vérifiées & Zéro Caution
                                    </h3>
                                </div>
                                <span className="p-2 rounded-full bg-emerald-100 text-emerald-700">
                                    <CheckCircle2 size={22} />
                                </span>
                            </div>

                            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>Aucun blocage de 1 500 €</strong> : 0 € de caution avec Franchise Zéro (ou 300 € standard). Cartes de débit & espèces acceptées.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>Accueil VIP aux arrivées</strong> : un agent vous attend avec une pancarte nominative à la sortie de l'aéroport. Départ en 5 minutes.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>Modèle garanti à 100%</strong> : Dacia Duster 4x4, Clio 5 BVA ou Sandero Stepway. Vous conduisez ce que vous avez choisi.</span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                    <span><strong>Livraison offerte à votre Riad ou Hôtel</strong> : pas besoin de traverser la ville pour récupérer les clés.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* POPULAR HUBS SHOWCASE */}
            <section className="py-20 bg-[#FAF7F2]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9572C] mb-2">
                                <MapPin size={14} />
                                Réseau National Marocain
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                Nos Aéroports & Villes de Prise en Charge
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                            Livraison directe dès la descente d'avion ou restitution dans une autre ville pour vos roadtrips.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {MOROCCAN_HUBS.slice(0, 4).map((hub) => (
                            <Link
                                key={hub.slug}
                                href={`/maroc/${hub.slug}`}
                                className="group rounded-3xl bg-white border border-[#E7DFD5] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                <div className="relative h-44 w-full overflow-hidden">
                                    <img
                                        src={hub.heroImage}
                                        alt={`Location voiture ${hub.name}`}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3 bg-[#12161E]/80 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-full font-bold">
                                        {hub.airportCode}
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 group-hover:text-[#C9572C] transition-colors">
                                            {hub.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                            {hub.description}
                                        </p>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                        <span className="font-semibold text-slate-700">
                                            Dès <strong className="text-slate-900 font-black">{hub.avgDailyPriceEur}€</strong> / jour
                                        </span>
                                        <span className="text-[#C9572C] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            Explorer <ArrowRight size={13} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* AEO / GEO ADVANCED DIRECT ANSWER SECTION */}
            <LocalAeoSection hubSlug="marrakech" />

            {/* Footer */}
            <Footer />
        </div>
    );
}
