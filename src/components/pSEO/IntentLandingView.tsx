"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    ShieldCheck,
    CheckCircle2,
    MapPin,
    ArrowRight,
    Plane,
    ChevronRight,
    Clock,
    Phone,
    Users,
    Briefcase,
    Cog,
    Fuel,
    Sparkles,
} from "lucide-react";
import { CityHub, VehicleModel, MOROCCAN_HUBS, VEHICLE_FLEET } from "@/lib/morocco-data";
import { PurchaseIntent, PURCHASE_INTENTS } from "@/lib/intent-data";
import { PointOfService, getPosForHub } from "@/lib/pos-data";
import { Locale, getTranslation } from "@/lib/i18n";
import { BookingCheckoutModal } from "@/components/BookingCheckoutModal";

interface IntentLandingViewProps {
    hub: CityHub;
    intent: PurchaseIntent;
    locale: Locale;
}

export default function IntentLandingView({ hub, intent, locale }: IntentLandingViewProps) {
    const t = getTranslation(locale);
    const localPosList = getPosForHub(hub.slug);

    // Selected vehicle modal state
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(null);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [currency, setCurrency] = useState<"EUR" | "MAD">("EUR");
    const [pickupDate, setPickupDate] = useState("2026-11-15");
    const [returnDate, setReturnDate] = useState("2026-11-21");
    const days = 6;

    // Filter vehicles according to intent
    const filteredVehicles = VEHICLE_FLEET.filter((v) => {
        switch (intent.filterType) {
            case "automatic":
                return v.transmission === "Automatique";
            case "suv":
                return v.category === "SUV & 4x4";
            case "7seats":
                return v.seats >= 7;
            default:
                return true;
        }
    });

    const handleOpenCheckout = (vehicle: VehicleModel) => {
        setSelectedVehicle(vehicle);
        setIsCheckoutOpen(true);
    };

    const formatText = (text: string) => {
        return text.replace(/\{hub\}/g, hub.name);
    };

    const getLocalizedHubUrl = (targetHubSlug: string) => {
        if (locale === "fr") return `/maroc/${targetHubSlug}/${intent.slugs.fr}`;
        return `/${locale}/${targetHubSlug}/${intent.slugs[locale]}`;
    };

    const getLocalizedOtherIntentUrl = (otherIntent: PurchaseIntent) => {
        if (locale === "fr") return `/maroc/${hub.slug}/${otherIntent.slugs.fr}`;
        return `/${locale}/${hub.slug}/${otherIntent.slugs[locale]}`;
    };

    const getVehicleUrl = (vehicleId: string) => {
        if (locale === "fr") return `/maroc/${hub.slug}/${vehicleId}`;
        return `/${locale}/${hub.slug}/${vehicleId}`;
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-900">
            {/* Top Breadcrumb */}
            <div className="border-b border-[#E7DFD5] bg-white py-3">
                <div className="container mx-auto px-4 max-w-6xl">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
                        <Link href={locale === "fr" ? "/" : `/${locale}`} className="hover:text-slate-900 font-medium">
                            {locale === "fr" ? "Accueil" : "Home"}
                        </Link>
                        <ChevronRight size={13} className="text-slate-400" />
                        <Link href={locale === "fr" ? `/maroc/${hub.slug}` : `/${locale}/${hub.slug}`} className="hover:text-slate-900 font-medium">
                            {hub.name}
                        </Link>
                        <ChevronRight size={13} className="text-slate-400" />
                        <span className="font-semibold text-slate-900">{intent.badge[locale]}</span>
                    </nav>
                </div>
            </div>

            {/* Hero Header */}
            <section className="py-12 md:py-16 bg-white border-b border-[#E7DFD5]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">
                            <ShieldCheck size={14} className="text-[#C9572C]" />
                            <span>{intent.badge[locale]} • {hub.name} ({hub.airportCode})</span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4">
                            {formatText(intent.headline[locale])}
                        </h1>

                        <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-6">
                            {formatText(intent.intro[locale])}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
                            <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E7DFD5] px-3 py-1.5 rounded-lg">
                                <CheckCircle2 size={15} className="text-emerald-600" />
                                <span>{hub.airportName} ({hub.airportCode})</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E7DFD5] px-3 py-1.5 rounded-lg">
                                <Clock size={15} className="text-emerald-600" />
                                <span>{t.checkoutModal.cancelFreeNotice}</span>
                            </div>
                            <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E7DFD5] px-3 py-1.5 rounded-lg">
                                <Sparkles size={15} className="text-[#C9572C]" />
                                <span>{t.search.exactModelPill}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Curated Vehicles Grid Matching the Intent */}
            <section className="py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-slate-200">
                        <div>
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                                {locale === "fr" ? `Véhicules recommandés à ${hub.name}` : `Recommended Cars in ${hub.name}`}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                {locale === "fr" ? "Disponibilités réelles certifiées auprès des agences partenaires locales." : "Guaranteed fleet availability with verified local partners."}
                            </p>
                        </div>

                        {/* Currency Selector */}
                        <div className="inline-flex rounded-full bg-white px-2 py-1 border border-[#E7DFD5] text-xs font-semibold">
                            {(["EUR", "MAD"] as const).map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setCurrency(c)}
                                    className={`px-2 py-0.5 rounded cursor-pointer transition ${
                                        currency === c
                                            ? "bg-[#C9572C]/15 text-[#C9572C] font-bold"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    {c === "MAD" ? "DH" : c}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredVehicles.map((vehicle) => {
                            const totalEstEur = vehicle.dailyPriceEur * days;
                            const totalEstMad = vehicle.dailyPriceMad * days;

                            return (
                                <div
                                    key={vehicle.id}
                                    className="group rounded-3xl bg-white border border-[#E7DFD5] hover:border-slate-400 p-5 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                                                {vehicle.category}
                                            </span>
                                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-slate-700">
                                                {t.catalog.depositPill}
                                            </span>
                                        </div>

                                        <Link href={getVehicleUrl(vehicle.id)} className="block relative w-full h-44 rounded-2xl overflow-hidden bg-slate-50 mb-4 cursor-pointer">
                                            <img
                                                src={vehicle.image}
                                                alt={vehicle.name}
                                                width={600}
                                                height={390}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute bottom-2 left-2 bg-[#12161E]/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                                {vehicle.transmission}
                                            </div>
                                        </Link>

                                        <Link href={getVehicleUrl(vehicle.id)}>
                                            <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-[#C9572C] transition-colors">
                                                {vehicle.name}
                                            </h3>
                                        </Link>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                            {vehicle.highlight}
                                        </p>

                                        <div className="grid grid-cols-4 gap-2 my-4 py-3 border-y border-slate-100 text-xs text-slate-600">
                                            <div className="flex flex-col items-center">
                                                <Users size={14} className="text-slate-400 mb-1" />
                                                <span className="font-semibold">{vehicle.seats} {t.catalog.seats}</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <Briefcase size={14} className="text-slate-400 mb-1" />
                                                <span className="font-semibold">{vehicle.luggage} {t.catalog.luggage}</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <Cog size={14} className="text-slate-400 mb-1" />
                                                <span className="font-semibold">{vehicle.transmission.slice(0, 4)}.</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <Fuel size={14} className="text-slate-400 mb-1" />
                                                <span className="font-semibold">{vehicle.fuel}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-baseline justify-between pt-2 mb-4">
                                            <div>
                                                <span className="text-2xl font-black text-slate-900">
                                                    {currency === "EUR" ? `${vehicle.dailyPriceEur} €` : `${vehicle.dailyPriceMad} MAD`}
                                                </span>
                                                <span className="text-xs text-slate-400 ml-1">/ {t.catalog.fromPerDay}</span>
                                            </div>
                                            <span className="text-[11px] text-slate-500 font-mono">
                                                {days}j: {currency === "EUR" ? `${totalEstEur} €` : `${totalEstMad} DH`}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <Link
                                                href={getVehicleUrl(vehicle.id)}
                                                className="py-2.5 px-3 rounded-xl border border-slate-300 hover:border-slate-400 text-center text-xs font-bold text-slate-700 transition"
                                            >
                                                {t.catalog.viewDetails}
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => handleOpenCheckout(vehicle)}
                                                className="py-2.5 px-3 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-center text-xs font-bold text-white transition shadow-xs cursor-pointer"
                                            >
                                                {t.catalog.bookCar}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Deep Forensic Analysis & Information Gain (Anti-Doorway) */}
            <section className="py-12 bg-white border-y border-[#E7DFD5]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="max-w-3xl mb-8">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C9572C] block mb-1">
                            {locale === "fr" ? "Expertise Conduite Locale" : "Local Driving Expertise"}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                            {formatText(intent.analysisTitle[locale])}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {intent.analysisPoints.map((point, idx) => (
                            <div key={idx} className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-[#C9572C]/10 text-[#C9572C] flex items-center justify-center font-bold text-xs">
                                        {idx + 1}
                                    </div>
                                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                                        {formatText(point.title[locale])}
                                    </h3>
                                </div>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-9">
                                    {formatText(point.desc[locale])}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
                        <Sparkles size={18} className="text-amber-700 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold block mb-0.5">
                                {locale === "fr" ? "Recommandation Terrain ZwinCar :" : "ZwinCar Local Recommendation:"}
                            </span>
                            <p className="leading-relaxed">
                                {formatText(intent.practicalAdvice[locale])}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Local Physical Points of Service (POS) & Meeting Points */}
            <section className="py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="mb-8">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                            {locale === "fr" ? "Points de Retrait & Restitution" : "Pick-up & Drop-off Points"}
                        </span>
                        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                            {locale === "fr" ? `Où récupérer votre voiture à ${hub.name} ?` : `Where to collect your car in ${hub.name}?`}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {localPosList.map((pos) => (
                            <div key={pos.id} className="p-5 rounded-2xl bg-white border border-[#E7DFD5] space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                                            {pos.type === "airport" ? <Plane size={16} /> : <MapPin size={16} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                                                {pos.name}
                                            </h3>
                                            <span className="text-[10px] text-slate-400 font-mono">{pos.nameAr}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 leading-snug">
                                    {pos.meetingDetail}
                                </p>
                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                                    <span>{pos.address}</span>
                                    <span className="text-emerald-700 font-mono font-bold">24/7</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Local Intent FAQs (with speakable & FAQ schema support) */}
            <section className="py-12 bg-white border-t border-[#E7DFD5]">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            {locale === "fr"
                                ? `Questions Fréquentes : ${intent.badge[locale]} à ${hub.name}`
                                : locale === "es"
                                ? `Preguntas Frecuentes: ${intent.badge[locale]} en ${hub.name}`
                                : locale === "nl"
                                ? `Veelgestelde Vragen: ${intent.badge[locale]} in ${hub.name}`
                                : `Frequently Asked Questions: ${intent.badge[locale]} in ${hub.name}`}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            {locale === "fr" ? "Réponses concrètes et transparentes sur nos conditions à " + hub.name : "Straightforward answers regarding our rental terms in " + hub.name}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {intent.faqs.map((faq, idx) => (
                            <div key={idx} className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2">
                                <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                                    {formatText(faq.q[locale])}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    {formatText(faq.a[locale])}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DAG Internal Linking Mesh */}
            <section className="py-12 bg-[#FAF7F2] border-t border-[#E7DFD5]">
                <div className="container mx-auto px-4 max-w-6xl space-y-8">
                    {/* Horizontal: Same intent in other Moroccan cities */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                            {locale === "fr" ? `Cette formule dans les autres aéroports du Maroc :` : `This option in other Moroccan airports:`}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {MOROCCAN_HUBS.filter((h) => h.slug !== hub.slug).map((h) => (
                                <Link
                                    key={h.slug}
                                    href={getLocalizedHubUrl(h.slug)}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] hover:border-slate-400 text-xs font-medium text-slate-700 transition"
                                >
                                    {intent.badge[locale]} {h.name} ({h.airportCode})
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Vertical: Other purchase intents in the same city */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                            {locale === "fr" ? `Autres besoins de location à ${hub.name} :` : `Other car rental options in ${hub.name}:`}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {PURCHASE_INTENTS.filter((i) => i.id !== intent.id).map((otherIntent) => (
                                <Link
                                    key={otherIntent.id}
                                    href={getLocalizedOtherIntentUrl(otherIntent)}
                                    className="px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] hover:border-slate-400 text-xs font-medium text-slate-700 transition"
                                >
                                    {otherIntent.titles[locale].replace("{hub}", hub.name).replace(" | ZwinCar", "").replace(" • ZwinCar", "")}
                                </Link>
                            ))}
                            <Link
                                href={locale === "fr" ? `/maroc/${hub.slug}` : `/${locale}/${hub.slug}`}
                                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold transition hover:bg-slate-800"
                            >
                                {locale === "fr" ? `Guide Complet ${hub.name} →` : `Full ${hub.name} Guide →`}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Checkout Modal when user clicks "Réserver" */}
            {selectedVehicle && (
                <BookingCheckoutModal
                    isOpen={isCheckoutOpen}
                    onClose={() => setIsCheckoutOpen(false)}
                    vehicle={selectedVehicle}
                    pickupHubSlug={hub.slug}
                    pickupDate={pickupDate}
                    returnDate={returnDate}
                    days={days}
                    selectedUpsells={["conducteur-additionnel"]}
                    vendorUpsellsEur={0}
                    vendorUpsellsMad={0}
                    platformUpsellsEur={0}
                    platformUpsellsMad={0}
                    depositAcompteEur={Math.round(selectedVehicle.dailyPriceEur * days * 0.2)}
                    depositAcompteMad={Math.round(selectedVehicle.dailyPriceMad * days * 0.2)}
                    balanceOnSiteEur={Math.round(selectedVehicle.dailyPriceEur * days * 0.8)}
                    balanceOnSiteMad={Math.round(selectedVehicle.dailyPriceMad * days * 0.8)}
                    currency={currency}
                />
            )}
        </div>
    );
}
