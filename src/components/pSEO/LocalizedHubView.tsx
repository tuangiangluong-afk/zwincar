import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SchemaJSON from "@/components/SchemaJSON";
import BookingWidget from "@/components/BookingWidget";
import VehicleCatalog from "@/components/VehicleCatalog";
import PseoGuidesCrossLinks from "@/components/pSEO/PseoGuidesCrossLinks";
import { CityHub, MOROCCAN_HUBS } from "@/lib/morocco-data";
import { PURCHASE_INTENTS } from "@/lib/intent-data";
import { PointOfService, getPosForHub } from "@/lib/pos-data";
import { Locale, getTranslation } from "@/lib/i18n";
import {
    ShieldCheck,
    MapPin,
    Plane,
    CheckCircle2,
    Clock,
    Sparkles,
    ChevronRight,
    ArrowRight,
} from "lucide-react";

interface LocalizedHubViewProps {
    hub: CityHub;
    locale: Locale;
}

export default function LocalizedHubView({ hub, locale }: LocalizedHubViewProps) {
    const t = getTranslation(locale);
    const localPosList = getPosForHub(hub.slug);

    const getIntentUrl = (intentId: string) => {
        const intent = PURCHASE_INTENTS.find((i) => i.id === intentId);
        if (!intent) return `/${locale}/${hub.slug}`;
        if (locale === "fr") return `/maroc/${hub.slug}/${intent.slugs.fr}`;
        return `/${locale}/${hub.slug}/${intent.slugs[locale]}`;
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#12161E]">
            <SchemaJSON
                type="AutoRental"
                hub={hub}
                breadcrumbItems={[
                    { name: locale === "fr" ? "Accueil" : "Home", item: "https://zwincar.com" },
                    { name: hub.name, item: `https://zwincar.com/${locale}/${hub.slug}` },
                ]}
            />

            <Header locale={locale} />

            {/* Breadcrumb */}
            <div className="border-b border-[#E7DFD5] bg-white py-3">
                <div className="container mx-auto px-4 max-w-6xl">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
                        <Link href={locale === "fr" ? "/" : `/${locale}`} className="hover:text-slate-900 font-medium">
                            {locale === "fr" ? "Accueil" : "Home"}
                        </Link>
                        <ChevronRight size={13} className="text-slate-400" />
                        <span className="font-semibold text-slate-900">{hub.name} ({hub.airportCode})</span>
                    </nav>
                </div>
            </div>

            {/* Hero Hub Header */}
            <section className="relative py-12 md:py-16 bg-white border-b border-[#E7DFD5]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-7 space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-800">
                                <ShieldCheck size={14} className="text-[#C9572C]" />
                                <span>{hub.airportName} ({hub.airportCode}) • ZwinCar</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                                {locale === "en"
                                    ? `Car Rental in ${hub.name} with Zero Credit Card Deposit`
                                    : locale === "es"
                                    ? `Alquiler de Coches en ${hub.name} Sin Fianza en Tarjeta`
                                    : `Autoverhuur in ${hub.name} Zonder Creditcard Borg`}
                            </h1>

                            <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
                                {locale === "en"
                                    ? `Rent directly from verified local agencies in ${hub.name}. Fast terminal meet & greet, debit cards & cash fully accepted, guaranteed models.`
                                    : locale === "es"
                                    ? `Alquile directamente de agencias locales verificadas en ${hub.name}. Entrega en terminal o riad, tarjetas de débito y efectivo aceptados.`
                                    : `Huur rechtstreeks bij geverifieerde lokale partners in ${hub.name}. Snelle terminalontmoeting, pin & contant geaccepteerd.`}
                            </p>

                            {/* Intent Quick Links (pSEO Bridge) */}
                            <div className="pt-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                                    {locale === "en" ? "Popular Categories & Intents:" : "Categorías Populares:"}
                                </span>
                                <div className="flex flex-wrap gap-2">
                                    {PURCHASE_INTENTS.map((intent) => (
                                        <Link
                                            key={intent.id}
                                            href={getIntentUrl(intent.id)}
                                            className="px-3 py-1.5 rounded-xl bg-[#FAF7F2] hover:bg-slate-900 hover:text-white border border-[#E7DFD5] text-xs font-semibold text-slate-800 transition"
                                        >
                                            {intent.badge[locale]}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* City Hero Visual */}
                        <div className="lg:col-span-5">
                            <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden border border-[#E7DFD5] shadow-lg">
                                <img
                                    src={hub.heroImage}
                                    alt={`Location voiture ${hub.name}`}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <div className="text-xs font-semibold uppercase tracking-wider text-[#E58B24]">
                                        {locale === "en" ? "Ideal Hub" : locale === "es" ? "Punto Ideal" : "Ideale Uitvalsbasis"}
                                    </div>
                                    <div className="text-xl font-black">{hub.name} • {hub.nameAr}</div>
                                    <div className="text-xs text-white/80 mt-0.5">
                                        {locale === "en" ? `From €${hub.avgDailyPriceEur} / day • Guaranteed model` : locale === "es" ? `Desde ${hub.avgDailyPriceEur} € / día • Modelo garantizado` : `Vanaf €${hub.avgDailyPriceEur} / dag • Gegarandeerd model`}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Widget Pre-filtered Full Width */}
                    <div className="pt-6">
                        <BookingWidget defaultHubSlug={hub.slug} locale={locale} />
                    </div>
                </div>
            </section>

            {/* Catalog Section */}
            <main className="py-12">
                <VehicleCatalog pickupCity={hub.name} locale={locale} />
            </main>

            {/* Local Physical Points of Service (POS) */}
            <section className="py-12 bg-white border-t border-[#E7DFD5]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-8">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C9572C] block mb-1">
                            {locale === "en" ? "Local Presence & Collection Hubs" : locale === "es" ? "Puntos de Recogida Locales" : "Lokale Ophaallocaties"}
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            {locale === "en" ? `Pick-up Locations in ${hub.name}` : locale === "es" ? `Puntos de Entrega en ${hub.name}` : `Ophaallocaties in ${hub.name}`}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {localPosList.map((pos) => {
                            let meetingDetailText = pos.meetingDetail;
                            if (locale !== "fr") {
                                if (pos.type === "airport") {
                                    meetingDetailText = locale === "en"
                                        ? "Terminal 1 & 2 Arrivals Hall. Meet & Greet agent with personalized ZwinCar name board in front of Café Paul, key handover at Parking P2."
                                        : locale === "es"
                                        ? "Hall de Llegadas Terminal 1 y 2. Agente con cartel nominativo ZwinCar frente al Café Paul, entrega de llaves en Parking P2."
                                        : "Aankomsthal Terminal 1 & 2. Agent met gepersonaliseerd ZwinCar naambordje voor Café Paul, sleuteloverdracht op Parking P2.";
                                } else if (pos.type === "train_station") {
                                    meetingDetailText = locale === "en"
                                        ? "Main ONCF train station forecourt, directly in front of Starbucks coffee."
                                        : locale === "es"
                                        ? "Explanada principal de la estación ONCF, frente a la cafetería Starbucks."
                                        : "Voorplein van het centrale ONCF-station, recht voor het Starbucks café.";
                                } else if (pos.type === "medina_gate") {
                                    meetingDetailText = locale === "en"
                                        ? "Guarded parking outside the Medina Gate for convenient handover and direct luggage assistance to your Riad."
                                        : locale === "es"
                                        ? "Aparcamiento vigilado frente a la Puerta de la Medina para entrega cómoda y asistencia con equipaje a su Riad."
                                        : "Bewaakte parkeerplaats voor de Medinapoort voor gemakkelijke overdracht en bagagehulp naar uw Riad.";
                                }
                            }

                            return (
                                <div key={pos.id} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700">
                                            {pos.type === "airport" ? <Plane size={16} /> : <MapPin size={16} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                                                {pos.name}
                                            </h4>
                                            <span className="text-[10px] text-slate-400 font-mono">{pos.nameAr}</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 leading-snug">
                                        {meetingDetailText}
                                    </p>
                                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                                        <span>{pos.address}</span>
                                        <span className="text-emerald-700 font-mono font-bold">24/7</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Skyscraper Authority Guides Inbound Cross-Links */}
            <PseoGuidesCrossLinks hubSlug={hub.slug} hubName={hub.name} locale={locale} />

            <Footer locale={locale} />
        </div>
    );
}
