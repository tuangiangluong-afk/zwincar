import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SchemaJSON from "@/components/SchemaJSON";
import { VEHICLE_FLEET, MOROCCAN_HUBS, VehicleModel } from "@/lib/morocco-data";
import { clampTitle, clampDescription } from "@/lib/seo-meta";
import VehicleBookingCard from "@/components/VehicleBookingCard";
import {
    ShieldCheck,
    CheckCircle2,
    Users,
    Briefcase,
    Fuel,
    Cog,
    Gauge,
    Layers,
    MapPin,
    ArrowRight,
    Star,
    Sparkles,
    ChevronRight,
    Car,
} from "lucide-react";

interface VehiclePageProps {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    return VEHICLE_FLEET.map((v) => ({
        id: v.id,
    }));
}

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
    const { id } = await params;
    const vehicle = VEHICLE_FLEET.find((v) => v.id === id);
    if (!vehicle) return { title: "Véhicule non trouvé" };

    const title = clampTitle(`Location ${vehicle.name} Maroc • Sans Caution CB | ZwinCar`);
    const description = clampDescription(
        `Louez la ${vehicle.name} (${vehicle.transmission}, ${vehicle.fuel}) au Maroc. ${vehicle.engine}, coffre ${vehicle.trunkLiters}L, 0€ de caution bloquée sur CB. Livraison aéroport et riad offerte.`
    );

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://zwincar.com/vehicules/${vehicle.id}`,
            images: [{ url: vehicle.image, width: 1200, height: 630 }],
        },
    };
}

export default async function VehicleDetailPage({ params }: VehiclePageProps) {
    const { id } = await params;
    const vehicle = VEHICLE_FLEET.find((v) => v.id === id);

    if (!vehicle) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#12161E]">
            {/* Structured Data */}
            <SchemaJSON
                type="Vehicle"
                vehicle={vehicle}
                faqs={vehicle.faqs}
                breadcrumbItems={[
                    { name: "Accueil", item: "https://zwincar.com" },
                    { name: "Flotte Véhicules", item: "https://zwincar.com/#vehicle-catalog" },
                    { name: vehicle.name, item: `https://zwincar.com/vehicules/${vehicle.id}` },
                ]}
            />

            {/* Header */}
            <Header />

            {/* Breadcrumb Bar */}
            <div className="border-b border-[#E7DFD5] bg-white">
                <div className="container mx-auto px-4 max-w-6xl py-3">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
                        <Link href="/" className="hover:text-slate-900 transition font-medium">
                            Accueil
                        </Link>
                        <ChevronRight size={12} className="text-slate-400" />
                        <Link href="/#vehicle-catalog" className="hover:text-slate-900 transition font-medium">
                            Flotte Maroc
                        </Link>
                        <ChevronRight size={12} className="text-slate-400" />
                        <span className="font-semibold text-slate-900 truncate">{vehicle.name}</span>
                    </nav>
                </div>
            </div>

            {/* Main Product Layout (Turo / Airbnb Luxe 2-Column Split) */}
            <main className="py-10 md:py-14">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                        {/* LEFT COLUMN: Media, Specs, Info Gain & Roadtest (7 Cols) */}
                        <div className="lg:col-span-7 space-y-10">
                            {/* Title & Category Header */}
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-2.5 text-xs">
                                    <span className="font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-slate-900 text-white">
                                        {vehicle.category}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-slate-700 font-semibold">
                                        {vehicle.transmission} • {vehicle.fuel}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-slate-700 font-semibold">
                                        Caution : 0 € (Franchise Zéro) ou 300 €
                                    </span>
                                </div>

                                <h1 data-speakable className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                    Location {vehicle.name} au Maroc
                                </h1>
                                <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                                    {vehicle.highlight}
                                </p>
                            </div>

                            {/* Hero Vehicle Photo */}
                            <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border border-[#E7DFD5] shadow-sm bg-white">
                                <img
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                                    <span className="bg-[#12161E]/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-xl">
                                        Transmission {vehicle.transmission}
                                    </span>
                                    <span className="bg-[#C9572C] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs">
                                        Dès {vehicle.dailyPriceEur} € / jour ({vehicle.dailyPriceMad} MAD)
                                    </span>
                                </div>
                            </div>

                            {/* Technical Specs DNA Grid (High Info Gain for SEO) */}
                            <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 shadow-xs">
                                <h2 className="text-base font-bold uppercase tracking-wider text-slate-900 mb-5 flex items-center gap-2">
                                    <Gauge size={16} className="text-[#C9572C]" />
                                    Fiche Technique & Performances Réelles
                                </h2>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                                    <div className="rounded-2xl bg-[#FAF7F2] p-3.5 border border-[#ECE5D9]">
                                        <div className="text-slate-500 text-[11px]">Motorisation</div>
                                        <div className="text-sm font-bold text-slate-900 mt-1">{vehicle.engine}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">{vehicle.horsepower} chevaux réels</div>
                                    </div>

                                    <div className="rounded-2xl bg-[#FAF7F2] p-3.5 border border-[#ECE5D9]">
                                        <div className="text-slate-500 text-[11px]">Volume de Coffre</div>
                                        <div className="text-sm font-bold text-slate-900 mt-1">{vehicle.trunkLiters} Litres</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">{vehicle.luggage} grandes valises</div>
                                    </div>

                                    <div className="rounded-2xl bg-[#FAF7F2] p-3.5 border border-[#ECE5D9]">
                                        <div className="text-slate-500 text-[11px]">Garde au Sol</div>
                                        <div className="text-sm font-bold text-slate-900 mt-1">{vehicle.groundClearanceCm} cm</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">Surélévation trottoirs & pistes</div>
                                    </div>

                                    <div className="rounded-2xl bg-[#FAF7F2] p-3.5 border border-[#ECE5D9]">
                                        <div className="text-slate-500 text-[11px]">Consommation Réelle</div>
                                        <div className="text-sm font-bold text-slate-900 mt-1">{vehicle.fuelConsumption}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">Carburant : {vehicle.fuel}</div>
                                    </div>

                                    <div className="rounded-2xl bg-[#FAF7F2] p-3.5 border border-[#ECE5D9]">
                                        <div className="text-slate-500 text-[11px]">Capacité Habitacle</div>
                                        <div className="text-sm font-bold text-slate-900 mt-1">{vehicle.seats} vraies places</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5">{vehicle.doors} portes</div>
                                    </div>

                                    <div className="rounded-2xl bg-[#FAF7F2] p-3.5 border border-[#ECE5D9]">
                                        <div className="text-slate-500 text-[11px]">Caution & Dépôt</div>
                                        <div className="text-sm font-bold text-slate-900 mt-1">0 € ou 300 €</div>
                                        <div className="text-[10px] text-slate-500 mt-0.5">Espèces ou carte de débit</div>
                                    </div>
                                </div>
                            </div>

                            {/* Moroccan Road-Test Radar (Info Gain Autopsy) */}
                            <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 sm:p-7 shadow-xs">
                                <h3 className="text-base font-bold text-slate-900 mb-2">
                                    Avis Terrain : Comment ce véhicule se comporte sur les routes marocaines ?
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                                    {vehicle.expertVerdictMorocco}
                                </p>

                                {/* Progress Bars */}
                                <div className="space-y-4 text-xs font-semibold">
                                    <div>
                                        <div className="flex justify-between text-slate-700 mb-1">
                                            <span>Autoroutes & Voies Rapides (ex: Marrakech - Casablanca A3)</span>
                                            <span className="font-bold text-slate-900">{vehicle.moroccoRoadRating.highway} / 10</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                            <div
                                                className="h-full bg-slate-900 rounded-full"
                                                style={{ width: `${vehicle.moroccoRoadRating.highway * 10}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-slate-700 mb-1">
                                            <span>Lacets de l'Atlas & Montagne (Col du Tichka, Vallée de l'Ourika)</span>
                                            <span className="font-bold text-slate-900">{vehicle.moroccoRoadRating.mountainAtlas} / 10</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                            <div
                                                className="h-full bg-[#C9572C] rounded-full"
                                                style={{ width: `${vehicle.moroccoRoadRating.mountainAtlas * 10}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-slate-700 mb-1">
                                            <span>Manoeuvres & Stationnement Médina / Centre-Ville</span>
                                            <span className="font-bold text-slate-900">{vehicle.moroccoRoadRating.medinaParking} / 10</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-600 rounded-full"
                                                style={{ width: `${vehicle.moroccoRoadRating.medinaParking * 10}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-slate-700 mb-1">
                                            <span>Pistes d'Agafay, Rocaille & Pistes Sahariennes</span>
                                            <span className="font-bold text-slate-900">{vehicle.moroccoRoadRating.desertPiste} / 10</span>
                                        </div>
                                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                            <div
                                                className="h-full bg-amber-500 rounded-full"
                                                style={{ width: `${vehicle.moroccoRoadRating.desertPiste * 10}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Equipment List */}
                            <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 shadow-xs">
                                <h3 className="text-base font-bold text-slate-900 mb-4">
                                    Équipements inclus & Confort de bord
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
                                    {vehicle.features.map((feat, idx) => (
                                        <div key={idx} className="flex items-center gap-2.5">
                                            <CheckCircle2 size={16} className="text-[#C9572C] shrink-0" />
                                            <span>{feat}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Hubs & Aéroports Maillage SEO */}
                            <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 shadow-xs space-y-4">
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">
                                        Disponibilités de la {vehicle.name} par Aéroport & Ville
                                    </h3>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Réservation directe avec livraison sans attente au parking terminal.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                    {MOROCCAN_HUBS.map((hub) => (
                                        <Link
                                            key={hub.slug}
                                            href={`/maroc/${hub.slug}/${vehicle.id}`}
                                            className="group p-3 rounded-2xl bg-[#FAF7F2] hover:bg-slate-900 border border-[#ECE5D9] hover:border-slate-900 transition flex items-center justify-between text-xs cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <MapPin size={15} className="text-[#C9572C] group-hover:text-white transition-colors shrink-0" />
                                                <div>
                                                    <span className="font-bold text-slate-900 group-hover:text-white transition-colors block">
                                                        {hub.name}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors">
                                                        {hub.airportName} ({hub.airportCode})
                                                    </span>
                                                </div>
                                            </div>
                                            <ArrowRight size={14} className="text-slate-400 group-hover:text-white transition-colors" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Vehicle Model FAQs */}
                            {vehicle.faqs.length > 0 && (
                                <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 shadow-xs space-y-4">
                                    <h3 className="text-base font-bold text-slate-900 mb-3">
                                        Questions Fréquentes sur la {vehicle.name}
                                    </h3>
                                    {vehicle.faqs.map((faq, i) => (
                                        <div key={i} className="rounded-2xl bg-[#FAF7F2] p-4 border border-[#ECE5D9]">
                                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1.5">
                                                {faq.q}
                                            </h4>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                                {faq.a}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Sticky Booking & Upsell Calculator (5 Cols) */}
                        <div className="lg:col-span-5 lg:sticky lg:top-28">
                            <VehicleBookingCard vehicle={vehicle} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
