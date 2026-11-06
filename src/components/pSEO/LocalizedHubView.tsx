import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SchemaJSON from "@/components/SchemaJSON";
import BookingWidget from "@/components/BookingWidget";
import VehicleCatalog from "@/components/VehicleCatalog";
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

            <Header />

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

                        {/* Booking Widget Column */}
                        <div className="lg:col-span-5">
                            <BookingWidget defaultHubSlug={hub.slug} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Catalog Section */}
            <main className="py-12">
                <VehicleCatalog pickupCity={hub.name} />
            </main>

            {/* Local Physical Points of Service (POS) */}
            <section className="py-12 bg-white border-t border-[#E7DFD5]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-8">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C9572C] block mb-1">
                            {locale === "en" ? "Local Presence & Collection Hubs" : "Puntos de Recogida Locales"}
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            {locale === "en" ? `Pick-up Locations in ${hub.name}` : `Puntos de Entrega en ${hub.name}`}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {localPosList.map((pos) => (
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
                                    {pos.meetingDetail}
                                </p>
                                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                                    <span>{pos.address}</span>
                                    <span className="text-emerald-700 font-mono font-bold">24/7</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
