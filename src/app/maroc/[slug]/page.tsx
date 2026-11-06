import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import VehicleCatalog from "@/components/VehicleCatalog";
import LocalAeoSection from "@/components/LocalAeoSection";
import SchemaJSON from "@/components/SchemaJSON";
import { MOROCCAN_HUBS, DIRECT_ANSWERS_AEO } from "@/lib/morocco-data";
import { clampTitle, clampDescription } from "@/lib/seo-meta";
import {
    ShieldCheck,
    MapPin,
    Plane,
    CheckCircle2,
    Clock,
    AlertTriangle,
    Navigation,
    CircleDollarSign,
    Compass,
    Car,
} from "lucide-react";

interface CityPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return MOROCCAN_HUBS.map((hub) => ({
        slug: hub.slug,
    }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
    const { slug } = await params;
    const hub = MOROCCAN_HUBS.find((h) => h.slug === slug);
    if (!hub) return { title: "Ville non trouvée" };

    const title = clampTitle(`Location Voiture ${hub.name} Sans Caution CB • ZwinCar`);
    const description = clampDescription(
        `Louez votre voiture à ${hub.name} (${hub.airportCode}) sans empreinte de carte de crédit. Agences locales vérifiées, livraison aéroport et riad gratuite, modèle garanti.`
    );

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";

    return {
        title,
        description,
        alternates: {
            canonical: `${baseUrl}/maroc/${hub.slug}`,
            languages: {
                "fr-FR": `${baseUrl}/maroc/${hub.slug}`,
                "en-US": `${baseUrl}/en/${hub.slug}`,
                "es-ES": `${baseUrl}/es/${hub.slug}`,
                "nl-NL": `${baseUrl}/nl/${hub.slug}`,
                "x-default": `${baseUrl}/en/${hub.slug}`,
            },
        },
        openGraph: {
            title,
            description,
            url: `${baseUrl}/maroc/${hub.slug}`,
            images: [{ url: hub.heroImage, width: 1200, height: 630 }],
        },
    };
}

export default async function CityHubPage({ params }: CityPageProps) {
    const { slug } = await params;
    const hub = MOROCCAN_HUBS.find((h) => h.slug === slug);

    if (!hub) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#12161E]">
            {/* Schema.org AEO & LocalBusiness */}
            <SchemaJSON
                type="AutoRental"
                hub={hub}
                faqs={DIRECT_ANSWERS_AEO.faqs}
                breadcrumbItems={[
                    { name: "Accueil", item: "https://zwincar.com" },
                    { name: "Maroc", item: "https://zwincar.com/maroc" },
                    { name: hub.name, item: `https://zwincar.com/maroc/${hub.slug}` },
                ]}
            />

            {/* Header */}
            <Header />

            {/* City Hero */}
            <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-white border-b border-[#E7DFD5]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid md:grid-cols-12 gap-8 items-center mb-10">
                        <div className="md:col-span-7">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-bold text-slate-800 mb-4">
                                <Plane size={14} className="text-[#C9572C]" />
                                <span>{hub.airportName} ({hub.airportCode})</span>
                            </div>

                            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                                Location de Voiture à{" "}
                                <span className="text-[#C9572C]">{hub.name}</span>{" "}
                                Sans Caution CB
                            </h1>

                            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6">
                                {hub.description} Profitez de nos agences partenaires certifiées avec remise des clés immédiate à l'arrivée.
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                                <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3 py-1.5 rounded-full border border-[#E7DFD5]">
                                    <ShieldCheck size={15} className="text-[#C9572C]" />
                                    Caution 0 € ou 300 €
                                </span>
                                <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3 py-1.5 rounded-full border border-[#E7DFD5]">
                                    <Clock size={15} className="text-[#C9572C]" />
                                    Zéro attente au guichet
                                </span>
                                <span className="flex items-center gap-1.5 bg-[#FAF7F2] px-3 py-1.5 rounded-full border border-[#E7DFD5]">
                                    <MapPin size={15} className="text-slate-600" />
                                    {hub.localDelivery}
                                </span>
                            </div>
                        </div>

                        {/* City Hero Visual */}
                        <div className="md:col-span-5">
                            <div className="relative h-72 sm:h-80 rounded-3xl overflow-hidden border border-[#E7DFD5] shadow-lg">
                                <img
                                    src={hub.heroImage}
                                    alt={`Location voiture ${hub.name}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-[#E58B24]">
                                        Point de Chute Idéal
                                    </div>
                                    <div className="text-xl font-black">{hub.name} • {hub.nameAr}</div>
                                    <div className="text-xs text-white/80 mt-0.5">
                                        Tarif moyen : dès {hub.avgDailyPriceEur} € / jour • Modèle garanti
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Widget Pre-filtered */}
                    <BookingWidget defaultHubSlug={hub.slug} />
                </div>
            </section>

            {/* Authentic Logistical Knowledge (Anti-Doorway Section) */}
            <section className="py-12 bg-[#FAF7F2] border-b border-[#E7DFD5]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-8">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#C9572C] mb-1">
                            Guide Logistique Local
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Tout ce qu'il faut savoir pour conduire à {hub.name}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 1. Prise en charge & Aéroport */}
                        <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 shadow-xs space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-[#C9572C]/10 text-[#C9572C] flex items-center justify-center font-bold">
                                <Navigation size={20} />
                            </div>
                            <h3 className="text-base font-black text-slate-900">
                                Accès Aéroport & Prise en Charge
                            </h3>
                            <div className="text-xs text-slate-600 space-y-2">
                                <p>
                                    L'aéroport <strong>{hub.airportName} ({hub.airportCode})</strong> est situé à <strong>{hub.airportDistanceKm} km</strong> du centre-ville (environ {hub.airportTransitMinutes} minutes).
                                </p>
                                <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-[11px] text-slate-700">
                                    <strong>Point de rendez-vous :</strong> {hub.meetingPointDetail}
                                </div>
                            </div>
                        </div>

                        {/* 2. Taxi vs Location */}
                        <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 shadow-xs space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                <CircleDollarSign size={20} />
                            </div>
                            <h3 className="text-base font-black text-slate-900">
                                Comparatif Taxi vs Location ZwinCar
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {hub.taxiComparisonText}
                            </p>
                        </div>

                        {/* 3. Stationnement & Médina */}
                        <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 shadow-xs space-y-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                <MapPin size={20} />
                            </div>
                            <h3 className="text-base font-black text-slate-900">
                                Stationnement & Conseils Médina
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {hub.parkingAdvice}
                            </p>
                        </div>

                        {/* 4. Radars & Pièges de la Route */}
                        <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 shadow-xs space-y-3 lg:col-span-1">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                                <AlertTriangle size={20} />
                            </div>
                            <h3 className="text-base font-black text-slate-900">
                                Radars & Points de Vigilance
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {hub.localRoadTraps}
                            </p>
                        </div>

                        {/* 5. Itinéraire Recommandé */}
                        <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 shadow-xs space-y-3 lg:col-span-2">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                                <Compass size={20} />
                            </div>
                            <h3 className="text-base font-black text-slate-900">
                                Roadtrip Recommandé : {hub.recommendedItinerary.title}
                            </h3>
                            <div className="space-y-3 text-xs text-slate-600">
                                <div className="flex flex-wrap items-center gap-2">
                                    {hub.recommendedItinerary.stops.map((stop, i) => (
                                        <span
                                            key={i}
                                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] font-semibold text-slate-800"
                                        >
                                            <span className="w-4 h-4 rounded-full bg-[#C9572C] text-white flex items-center justify-center text-[10px]">
                                                {i + 1}
                                            </span>
                                            <span>{stop}</span>
                                        </span>
                                    ))}
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-1">
                                    <Car size={14} className="text-[#C9572C]" />
                                    <span>
                                        Véhicule recommandé : <strong>{hub.recommendedItinerary.recommendedCar}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vehicle Fleet */}
            <VehicleCatalog days={6} pickupCity={hub.name} />

            {/* AEO Local Section */}
            <LocalAeoSection hubSlug={hub.slug} />

            {/* Footer */}
            <Footer />
        </div>
    );
}
