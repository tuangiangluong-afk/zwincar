import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SchemaJSON from "@/components/SchemaJSON";
import { VEHICLE_FLEET, MOROCCAN_HUBS, VehicleModel, CityHub } from "@/lib/morocco-data";
import { PURCHASE_INTENTS, getPurchaseIntent } from "@/lib/intent-data";
import { clampTitle, clampDescription } from "@/lib/seo-meta";
import VehicleBookingCard from "@/components/VehicleBookingCard";
import IntentLandingView from "@/components/pSEO/IntentLandingView";
import PseoGuidesCrossLinks from "@/components/pSEO/PseoGuidesCrossLinks";
import {
    ShieldCheck,
    CheckCircle2,
    Users,
    Briefcase,
    Fuel,
    Cog,
    Gauge,
    MapPin,
    ArrowRight,
    Plane,
    Sparkles,
    ChevronRight,
    Clock,
} from "lucide-react";

interface CityVehiclePageProps {
    params: Promise<{ slug: string; vehicleId: string }>;
}

export async function generateStaticParams() {
    const paramsList: { slug: string; vehicleId: string }[] = [];

    MOROCCAN_HUBS.forEach((hub) => {
        // 1. Vehicle Pages (48)
        VEHICLE_FLEET.forEach((vehicle) => {
            paramsList.push({
                slug: hub.slug,
                vehicleId: vehicle.id,
            });
        });

        // 2. Intent Pages (40)
        PURCHASE_INTENTS.forEach((intent) => {
            paramsList.push({
                slug: hub.slug,
                vehicleId: intent.slugs.fr,
            });
        });
    });

    return paramsList;
}

export async function generateMetadata({ params }: CityVehiclePageProps): Promise<Metadata> {
    const { slug, vehicleId } = await params;
    const hub = MOROCCAN_HUBS.find((h) => h.slug === slug);
    if (!hub) return { title: "Page non trouvée" };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";

    // 1. Check if it's an Intent
    const intent = getPurchaseIntent(vehicleId);
    if (intent) {
        const title = clampTitle(intent.titles.fr.replace(/\{hub\}/g, hub.name));
        const description = clampDescription(intent.metaDescriptions.fr.replace(/\{hub\}/g, hub.name));

        return {
            title,
            description,
            alternates: {
                canonical: `${baseUrl}/maroc/${hub.slug}/${intent.slugs.fr}`,
                languages: {
                    "fr-FR": `${baseUrl}/maroc/${hub.slug}/${intent.slugs.fr}`,
                    "en-US": `${baseUrl}/en/${hub.slug}/${intent.slugs.en}`,
                    "es-ES": `${baseUrl}/es/${hub.slug}/${intent.slugs.es}`,
                    "nl-NL": `${baseUrl}/nl/${hub.slug}/${intent.slugs.nl}`,
                    "x-default": `${baseUrl}/en/${hub.slug}/${intent.slugs.en}`,
                },
            },
            openGraph: {
                title,
                description,
                url: `${baseUrl}/maroc/${hub.slug}/${intent.slugs.fr}`,
                images: [{ url: hub.heroImage, width: 1200, height: 630 }],
            },
        };
    }

    // 2. Check if it's a Vehicle
    const vehicle = VEHICLE_FLEET.find((v) => v.id === vehicleId);
    if (vehicle) {
        const vehicleTitleName = vehicle.id === "toyota-prado-tx-7places" ? "Toyota Prado 7 Places" : vehicle.name;
        const title = clampTitle(`Location ${vehicleTitleName} ${hub.name} (${hub.airportCode}) | ZwinCar`, 58);
        const description = clampDescription(
            `Louez la ${vehicle.name} à ${hub.name} (${hub.airportName}). 0€ de caution avec Franchise Zéro, modèle exact garanti, livraison aéroport et riad gratuite. Dès ${vehicle.dailyPriceEur} €/j.`
        );

        return {
            title,
            description,
            alternates: {
                canonical: `${baseUrl}/maroc/${hub.slug}/${vehicle.id}`,
                languages: {
                    "fr-FR": `${baseUrl}/maroc/${hub.slug}/${vehicle.id}`,
                    "en-US": `${baseUrl}/en/${hub.slug}/${vehicle.id}`,
                    "es-ES": `${baseUrl}/es/${hub.slug}/${vehicle.id}`,
                    "nl-NL": `${baseUrl}/nl/${hub.slug}/${vehicle.id}`,
                    "x-default": `${baseUrl}/en/${hub.slug}/${vehicle.id}`,
                },
            },
            openGraph: {
                title,
                description,
                url: `${baseUrl}/maroc/${hub.slug}/${vehicle.id}`,
                images: [{ url: vehicle.image, width: 1200, height: 630 }],
            },
        };
    }

    return { title: "Page non trouvée" };
}

export default async function CityVehicleDetailPage({ params }: CityVehiclePageProps) {
    const { slug, vehicleId } = await params;
    const hub = MOROCCAN_HUBS.find((h) => h.slug === slug);
    if (!hub) notFound();

    // Check if it's a Purchase Intent landing page
    const intent = getPurchaseIntent(vehicleId);
    if (intent) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] text-[#12161E]">
                <SchemaJSON
                    type="AutoRental"
                    hub={hub}
                    faqs={intent.faqs.map((f) => ({
                        q: f.q.fr.replace(/\{hub\}/g, hub.name),
                        a: f.a.fr.replace(/\{hub\}/g, hub.name),
                    }))}
                    breadcrumbItems={[
                        { name: "Accueil", item: "https://zwincar.com" },
                        { name: hub.name, item: `https://zwincar.com/maroc/${hub.slug}` },
                        { name: intent.badge.fr, item: `https://zwincar.com/maroc/${hub.slug}/${intent.slugs.fr}` },
                    ]}
                />
                <Header />
                <main>
                    <IntentLandingView hub={hub} intent={intent} locale="fr" />
                </main>
                <Footer />
            </div>
        );
    }

    // Otherwise, check if it's a Vehicle Model detail page
    const vehicle = VEHICLE_FLEET.find((v) => v.id === vehicleId);
    if (!vehicle) notFound();

    const vehicleShortName = vehicle.id === "toyota-prado-tx-7places" ? "Toyota Prado 7 Places" : vehicle.name;

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#12161E]">
            {/* Structured Data AutoRental & Vehicle */}
            <SchemaJSON
                type="Vehicle"
                hub={hub}
                vehicle={vehicle}
                faqs={vehicle.faqs}
                breadcrumbItems={[
                    { name: "Accueil", item: "https://zwincar.com" },
                    { name: hub.name, item: `https://zwincar.com/maroc/${hub.slug}` },
                    { name: vehicle.name, item: `https://zwincar.com/maroc/${hub.slug}/${vehicle.id}` },
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
                        <ChevronRight size={13} className="text-slate-400" />
                        <Link href={`/maroc/${hub.slug}`} className="hover:text-slate-900 transition font-medium">
                            {hub.name} ({hub.airportCode})
                        </Link>
                        <ChevronRight size={13} className="text-slate-400" />
                        <span className="font-semibold text-slate-900">{vehicle.name}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <main className="py-8 md:py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Column: Vehicle Deep Forensic Technical Analysis */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Badges & Title */}
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                                        {vehicle.category}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                                        <ShieldCheck size={14} className="text-emerald-600" />
                                        Catégorie Garantie (Surclassement Offert)
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-[#FAF7F2] text-slate-700 border border-[#E7DFD5] text-xs font-medium">
                                        {hub.airportName}
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                    Location {vehicle.name} à {hub.name} ({hub.airportCode})
                                </h1>
                                <div className="mt-2 text-xs font-semibold text-slate-600 bg-slate-100/90 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5">
                                    <span>{vehicle.equivalentCategoryFr}</span>
                                </div>
                                <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                                    {vehicle.highlight} Livrée sans attente dès votre sortie de l'avion ou directement à votre Riad à {hub.name}.
                                </p>
                            </div>

                            {/* Main Vehicle Image */}
                            <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E7DFD5] shadow-sm aspect-16/10">
                                <img
                                    src={vehicle.image}
                                    alt={`Location ${vehicle.name} à ${hub.name}`}
                                    width={600}
                                    height={390}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-semibold">
                                    {vehicle.transmission} • {vehicle.fuel}
                                </div>
                            </div>

                            {/* Technical Specs Bento Grid (High Info Gain) */}
                            <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 space-y-4 shadow-2xs">
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Fiche Technique Vérifiée • Spécifications Maroc
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                    <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9]">
                                        <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1 mb-1">
                                            <Gauge size={13} /> Motorisation
                                        </div>
                                        <div className="font-bold text-slate-900">{vehicle.engine}</div>
                                        <div className="text-[10px] text-slate-500">{vehicle.horsepower} ch réels</div>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9]">
                                        <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1 mb-1">
                                            <Briefcase size={13} /> Coffre Réel
                                        </div>
                                        <div className="font-bold text-slate-900">{vehicle.trunkLiters} Litres</div>
                                        <div className="text-[10px] text-slate-500">{vehicle.luggage} grandes valises</div>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9]">
                                        <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1 mb-1">
                                            <Fuel size={13} /> Consommation
                                        </div>
                                        <div className="font-bold text-slate-900">{vehicle.fuelConsumption}</div>
                                        <div className="text-[10px] text-slate-500">{vehicle.fuel} économe</div>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9]">
                                        <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1 mb-1">
                                            <Gauge size={13} /> Garde au sol
                                        </div>
                                        <div className="font-bold text-slate-900">{vehicle.groundClearanceCm} cm</div>
                                        <div className="text-[10px] text-slate-500">Protection sous-moteur</div>
                                    </div>
                                </div>

                                {/* Moroccan Terrain Suitability Scores */}
                                <div className="pt-3 border-t border-[#ECE5D9] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                    <div>
                                        <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                                            <span>Autoroute</span>
                                            <span className="font-mono font-bold text-[#C9572C]">{vehicle.moroccoRoadRating.highway}/10</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full bg-[#C9572C] rounded-full" style={{ width: `${vehicle.moroccoRoadRating.highway * 10}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                                            <span>Haut-Atlas</span>
                                            <span className="font-mono font-bold text-[#C9572C]">{vehicle.moroccoRoadRating.mountainAtlas}/10</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full bg-[#C9572C] rounded-full" style={{ width: `${vehicle.moroccoRoadRating.mountainAtlas * 10}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                                            <span>Parking Médina</span>
                                            <span className="font-mono font-bold text-emerald-600">{vehicle.moroccoRoadRating.medinaParking}/10</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${vehicle.moroccoRoadRating.medinaParking * 10}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-[11px] font-semibold text-slate-700 mb-1">
                                            <span>Pistes Carrossables</span>
                                            <span className="font-mono font-bold text-amber-600">{vehicle.moroccoRoadRating.desertPiste}/10</span>
                                        </div>
                                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${vehicle.moroccoRoadRating.desertPiste * 10}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Conditions de Prise en Charge à l'Aéroport */}
                            <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 space-y-4 shadow-2xs">
                                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9572C]">
                                    <Plane size={15} />
                                    <span>Procédure de Réception à {hub.name} ({hub.airportCode})</span>
                                </div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Remise des clés du {vehicleShortName} à {hub.name}
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    <strong>Point de rendez-vous : </strong>{hub.meetingPointDetail}. Un agent de notre agence partenaire locale vous attend avec une pancarte nominative à votre nom. Le tour du véhicule prend 5 minutes, vous signez le contrat sur smartphone et partez directement sans passer par un guichet.
                                </p>
                            </div>

                            {/* Verdict Terrain & FAQ du modèle */}
                            {vehicle.faqs && vehicle.faqs.length > 0 && (
                                <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 space-y-4 shadow-2xs">
                                    <h2 className="text-base font-bold text-slate-900">
                                        Questions fréquentes • {vehicleShortName} à {hub.name}
                                    </h2>
                                    <div className="space-y-3">
                                        {vehicle.faqs.map((f, idx) => (
                                            <div key={idx} className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9]">
                                                <div className="text-xs font-bold text-slate-900">{f.q}</div>
                                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{f.a}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Sticky Booking Widget Card */}
                        <div className="lg:col-span-5 sticky top-24">
                            <VehicleBookingCard
                                vehicle={vehicle}
                                defaultHubSlug={hub.slug}
                            />
                        </div>
                    </div>

                    {/* Maillage 1: Autres véhicules disponibles à cet aéroport */}
                    <div className="mt-16 pt-10 border-t border-[#E7DFD5] space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-[#C9572C]">
                                    Flotte Locale {hub.name}
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                                    Alternatives au {vehicleShortName} à {hub.name}
                                </h2>
                            </div>
                            <Link
                                href={`/maroc/${hub.slug}`}
                                className="text-xs font-bold text-[#C9572C] hover:underline flex items-center gap-1"
                            >
                                <span>Voir tous les modèles à {hub.name}</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                            {VEHICLE_FLEET.filter((v) => v.id !== vehicle.id).map((v) => (
                                <Link
                                    key={v.id}
                                    href={`/maroc/${hub.slug}/${v.id}`}
                                    className="group rounded-2xl bg-white border border-[#E7DFD5] hover:border-slate-900 p-3.5 shadow-2xs transition flex flex-col justify-between cursor-pointer"
                                >
                                    <div className="relative h-24 w-full rounded-xl overflow-hidden bg-slate-50 mb-2.5">
                                        <img
                                            src={v.image}
                                            alt={`Location ${v.name} à ${hub.name}`}
                                            width={240}
                                            height={160}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase">
                                            {v.category}
                                        </div>
                                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#C9572C] transition-colors truncate mt-0.5">
                                            {v.name}
                                        </div>
                                        <div className="text-xs font-mono font-bold text-[#C9572C] mt-1.5">
                                            {v.dailyPriceEur} € <span className="text-[10px] font-normal text-slate-400 font-sans">/j</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Maillage 2: Ce même véhicule dans les autres villes */}
                    <div className="mt-12 pt-8 border-t border-[#E7DFD5] space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-[#C9572C]">
                                    Réseau National Aéroports
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                                    {vehicleShortName} dans les autres villes du Maroc
                                </h2>
                            </div>
                            <Link
                                href="/#vehicle-catalog"
                                className="text-xs font-bold text-slate-700 hover:text-slate-900 underline flex items-center gap-1"
                            >
                                <span>Voir tout le catalogue flotte Maroc</span>
                                <ArrowRight size={13} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                            {MOROCCAN_HUBS.filter((h) => h.slug !== hub.slug).map((h) => (
                                <Link
                                    key={h.slug}
                                    href={`/maroc/${h.slug}/${vehicle.id}`}
                                    className="group p-3 rounded-xl bg-white border border-[#E7DFD5] hover:border-[#C9572C] transition text-center cursor-pointer shadow-2xs"
                                >
                                    <div className="text-xs font-bold text-slate-900 group-hover:text-[#C9572C] transition-colors">
                                        {h.name}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                                        {h.airportCode}
                                    </div>
                                    <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                                        Option 0€ Caution
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Skyscraper Authority Guides Inbound Cross-Links */}
            <PseoGuidesCrossLinks hubSlug={hub.slug} hubName={hub.name} locale="fr" />

            {/* Footer */}
            <Footer />
        </div>
    );
}
