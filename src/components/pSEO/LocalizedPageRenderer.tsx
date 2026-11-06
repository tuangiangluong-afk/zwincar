import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SchemaJSON from "@/components/SchemaJSON";
import { MOROCCAN_HUBS, VEHICLE_FLEET, CityHub, VehicleModel } from "@/lib/morocco-data";
import { PURCHASE_INTENTS, PurchaseIntent } from "@/lib/intent-data";
import { Locale, getTranslation } from "@/lib/i18n";
import IntentLandingView from "@/components/pSEO/IntentLandingView";
import VehicleBookingCard from "@/components/VehicleBookingCard";
import PseoGuidesCrossLinks from "@/components/pSEO/PseoGuidesCrossLinks";
import {
    ShieldCheck,
    CheckCircle2,
    Briefcase,
    Fuel,
    Cog,
    Gauge,
    Sparkles,
    ChevronRight,
    Plane,
    ArrowRight,
} from "lucide-react";

interface LocalizedPageRendererProps {
    locale: Locale;
    hubSlug: string;
    subslug: string;
}

export default function LocalizedPageRenderer({
    locale,
    hubSlug,
    subslug,
}: LocalizedPageRendererProps) {
    const hub = MOROCCAN_HUBS.find((h) => h.slug === hubSlug);
    if (!hub) notFound();

    const t = getTranslation(locale);

    // 1. Check if intent
    const intent = PURCHASE_INTENTS.find(
        (i) => i.id === subslug || i.slugs[locale] === subslug || i.slugs.fr === subslug
    );

    if (intent) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] text-[#12161E]">
                <SchemaJSON
                    type="AutoRental"
                    hub={hub}
                    faqs={intent.faqs.map((f) => ({
                        q: f.q[locale].replace(/\{hub\}/g, hub.name),
                        a: f.a[locale].replace(/\{hub\}/g, hub.name),
                    }))}
                    breadcrumbItems={[
                        { name: locale === "fr" ? "Accueil" : "Home", item: "https://zwincar.com" },
                        { name: hub.name, item: `https://zwincar.com/${locale}/${hub.slug}` },
                        { name: intent.badge[locale], item: `https://zwincar.com/${locale}/${hub.slug}/${intent.slugs[locale]}` },
                    ]}
                />
                <Header locale={locale} />
                <main>
                    <IntentLandingView hub={hub} intent={intent} locale={locale} />
                </main>
                <Footer locale={locale} />
            </div>
        );
    }

    // 2. Check if vehicle
    const vehicle = VEHICLE_FLEET.find((v) => v.id === subslug);
    if (vehicle) {
        const vehicleShortName = vehicle.id === "toyota-prado-tx-7places"
            ? (locale === "en" ? "Toyota Prado 7-Seater" : locale === "es" ? "Toyota Prado 7 Plazas" : "Toyota Prado 7 Places")
            : vehicle.name;

        return (
            <div className="min-h-screen bg-[#FAF7F2] text-[#12161E]">
                <SchemaJSON
                    type="Vehicle"
                    hub={hub}
                    vehicle={vehicle}
                    faqs={vehicle.faqs}
                    breadcrumbItems={[
                        { name: locale === "fr" ? "Accueil" : "Home", item: "https://zwincar.com" },
                        { name: hub.name, item: `https://zwincar.com/${locale}/${hub.slug}` },
                        { name: vehicle.name, item: `https://zwincar.com/${locale}/${hub.slug}/${vehicle.id}` },
                    ]}
                />
                <Header locale={locale} />

                {/* Localized Breadcrumb */}
                <div className="border-b border-[#E7DFD5] bg-white">
                    <div className="container mx-auto px-4 max-w-6xl py-3">
                        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
                            <Link href={`/${locale}`} className="hover:text-slate-900 font-medium">
                                {locale === "fr" ? "Accueil" : "Home"}
                            </Link>
                            <ChevronRight size={13} className="text-slate-400" />
                            <Link href={`/${locale}/${hub.slug}`} className="hover:text-slate-900 font-medium">
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
                            {/* Left Column */}
                            <div className="lg:col-span-7 space-y-8">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                        <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">
                                            {vehicle.category}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1">
                                            <ShieldCheck size={14} className="text-emerald-600" />
                                            {t.search.exactModelPill}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-[#FAF7F2] text-slate-700 border border-[#E7DFD5] text-xs font-medium">
                                            {hub.airportName}
                                        </span>
                                    </div>
                                    <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                                        {locale === "en"
                                            ? `${vehicle.name} Rental in ${hub.name} (${hub.airportCode})`
                                            : locale === "es"
                                            ? `Alquiler ${vehicle.name} en ${hub.name} (${hub.airportCode})`
                                            : locale === "nl"
                                            ? `Huur ${vehicle.name} in ${hub.name} (${hub.airportCode})`
                                            : `Location ${vehicle.name} à ${hub.name} (${hub.airportCode})`}
                                    </h1>
                                    <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
                                        {locale !== "fr" && vehicle.highlightEn ? vehicle.highlightEn : vehicle.highlight}
                                    </p>
                                </div>

                                {/* Vehicle Image */}
                                <div className="relative rounded-3xl overflow-hidden bg-white border border-[#E7DFD5] shadow-xs aspect-16/10">
                                    <img
                                        src={vehicle.image}
                                        alt={`${vehicle.name} in ${hub.name}`}
                                        width={600}
                                        height={390}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        {locale === "en" ? vehicle.transmissionEn : locale === "es" ? (vehicle.transmission === "Automatique" ? "Automático" : "Manual") : locale === "nl" ? (vehicle.transmission === "Automatique" ? "Automatisch" : "Handgeschakeld") : vehicle.transmission} • {locale === "en" ? (vehicle.fuel === "Essence" ? "Petrol" : "Diesel") : locale === "es" ? (vehicle.fuel === "Essence" ? "Gasolina" : "Diésel") : locale === "nl" ? (vehicle.fuel === "Essence" ? "Benzine" : "Diesel") : vehicle.fuel}
                                    </div>
                                </div>

                                {/* Technical Specs */}
                                <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 space-y-4 shadow-2xs">
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        {locale === "en" ? "Verified Specifications • Moroccan Setup" : locale === "es" ? "Especificaciones Verificadas • Configuración Marruecos" : locale === "nl" ? "Geverifieerde Specificaties • Marokko Setup" : "Caractéristiques Vérifiées • Configuration Maroc"}
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                        <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9]">
                                            <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1 mb-1">
                                                <Gauge size={13} /> {locale === "en" ? "Engine" : locale === "es" ? "Motor" : locale === "nl" ? "Motor" : "Moteur"}
                                            </div>
                                            <div className="font-bold text-slate-900">{vehicle.engine}</div>
                                            <div className="text-[10px] text-slate-500">{vehicle.horsepower} HP</div>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9]">
                                            <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1 mb-1">
                                                <Briefcase size={13} /> {locale === "en" ? "Trunk" : locale === "es" ? "Maletero" : locale === "nl" ? "Kofferbak" : "Coffre"}
                                            </div>
                                            <div className="font-bold text-slate-900">{vehicle.trunkLiters} L</div>
                                            <div className="text-[10px] text-slate-500">{vehicle.luggage} {t.catalog.luggage}</div>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9]">
                                            <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1 mb-1">
                                                <Fuel size={13} /> {locale === "en" ? "Consumption" : locale === "es" ? "Consumo" : locale === "nl" ? "Verbruik" : "Consommation"}
                                            </div>
                                            <div className="font-bold text-slate-900">{vehicle.fuelConsumption}</div>
                                            <div className="text-[10px] text-slate-500">{locale === "en" ? (vehicle.fuel === "Essence" ? "Petrol" : "Diesel") : locale === "es" ? (vehicle.fuel === "Essence" ? "Gasolina" : "Diésel") : locale === "nl" ? (vehicle.fuel === "Essence" ? "Benzine" : "Diesel") : vehicle.fuel}</div>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9]">
                                            <div className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1 mb-1">
                                                <Gauge size={13} /> {locale === "en" ? "Clearance" : locale === "es" ? "Altura libre" : locale === "nl" ? "Bodemvrijheid" : "Garde au sol"}
                                            </div>
                                            <div className="font-bold text-slate-900">{vehicle.groundClearanceCm} cm</div>
                                            <div className="text-[10px] text-slate-500">{locale === "en" ? "Skid plates" : locale === "es" ? "Cubre cárter" : locale === "nl" ? "Bodembescherming" : "Plaques de protection"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Sticky Booking Widget */}
                            <div className="lg:col-span-5 sticky top-24">
                                <VehicleBookingCard
                                    vehicle={vehicle}
                                    defaultHubSlug={hub.slug}
                                    locale={locale}
                                />
                            </div>
                        </div>

                        {/* Cross-linking to other models in this city */}
                        <div className="mt-16 pt-10 border-t border-[#E7DFD5] space-y-6">
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                {locale === "en" ? `Alternatives to ${vehicleShortName} in ${hub.name}` : locale === "es" ? `Alternativas a ${vehicleShortName} en ${hub.name}` : locale === "nl" ? `Alternatieven voor ${vehicleShortName} in ${hub.name}` : `Alternatives au ${vehicleShortName} à ${hub.name}`}
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                                {VEHICLE_FLEET.filter((v) => v.id !== vehicle.id).map((v) => (
                                    <Link
                                        key={v.id}
                                        href={`/${locale}/${hub.slug}/${v.id}`}
                                        className="group rounded-2xl bg-white border border-[#E7DFD5] hover:border-slate-900 p-3.5 shadow-2xs transition flex flex-col justify-between"
                                    >
                                        <div className="relative h-24 w-full rounded-xl overflow-hidden bg-slate-50 mb-2.5">
                                            <img
                                                src={v.image}
                                                alt={v.name}
                                                width={240}
                                                height={160}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <div className="text-xs font-bold text-slate-900 group-hover:text-[#C9572C] transition-colors truncate">
                                            {v.name}
                                        </div>
                                        <div className="text-xs font-mono font-bold text-[#C9572C] mt-1.5">
                                            {v.dailyPriceEur} € / {locale === "en" ? "day" : locale === "es" ? "día" : locale === "nl" ? "dag" : "jour"}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                {/* Skyscraper Authority Guides Inbound Cross-Links */}
                <PseoGuidesCrossLinks hubSlug={hub.slug} hubName={hub.name} locale={locale} />

                <Footer locale={locale} />
            </div>
        );
    }

    notFound();
}
