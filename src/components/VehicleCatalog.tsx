"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Users,
    Briefcase,
    Fuel,
    Cog,
    ShieldCheck,
    CheckCircle2,
    Calendar,
    MessageCircle,
    ArrowRight,
    X,
    Lock,
    ExternalLink,
    Zap,
} from "lucide-react";
import { VEHICLE_FLEET, VehicleModel, UPSELL_OPTIONS, MOROCCAN_HUBS, CityHub } from "@/lib/morocco-data";
import { DEFAULT_HUB_DISTRIBUTION, DEFAULT_VEHICLE_STOCK, isHubInAffiliateFallback } from "@/lib/affiliate";
import UpsellSelector from "@/components/UpsellSelector";
import { BookingCheckoutModal } from "@/components/BookingCheckoutModal";
import { AffiliateExitDrawer } from "@/components/AffiliateExitDrawer";

import { Locale, getTranslation } from "@/lib/i18n";
import { usePathname } from "next/navigation";

interface VehicleCatalogProps {
    days?: number;
    pickupCity?: string;
    locale?: Locale;
}

export default function VehicleCatalog({
    days = 6,
    pickupCity = "Marrakech",
    locale: propLocale,
}: VehicleCatalogProps) {
    const pathname = usePathname() || "";
    let activeLocale: Locale = propLocale || "fr";
    if (!propLocale) {
        if (pathname.startsWith("/en")) activeLocale = "en";
        else if (pathname.startsWith("/es")) activeLocale = "es";
        else if (pathname.startsWith("/nl")) activeLocale = "nl";
    }

    const t = getTranslation(activeLocale);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [currency, setCurrency] = useState<"EUR" | "MAD" | "GBP" | "USD">("EUR");
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isAffiliateDrawerOpen, setIsAffiliateDrawerOpen] = useState(false);
    const [selectedUpsells, setSelectedUpsells] = useState<string[]>([
        "franchise-zero",
        "conducteur-additionnel",
    ]);

    // Hub resolution & distribution mode
    const currentHub: CityHub = MOROCCAN_HUBS.find((h) =>
        pickupCity.toLowerCase().includes(h.slug) ||
        h.name.toLowerCase().includes(pickupCity.toLowerCase())
    ) || MOROCCAN_HUBS[0];

    const hubMode = DEFAULT_HUB_DISTRIBUTION[currentHub.slug] || "direct";

    // Filter vehicles
    const filteredVehicles = VEHICLE_FLEET.filter((v) => {
        if (selectedCategory === "all") return true;
        if (selectedCategory === "auto") return v.transmission === "Automatique";
        if (selectedCategory === "suv") return v.category === "SUV & 4x4";
        if (selectedCategory === "citadine") return v.category === "Citadine" || v.category === "Compacte";
        if (selectedCategory === "family") return v.category === "Familiale & 7 Places";
        return true;
    });

    // Currency formatting
    const formatPrice = (eur: number, mad: number) => {
        switch (currency) {
            case "MAD":
                return `${mad} DH`;
            case "GBP":
                return `£${Math.round(eur * 0.85)}`;
            case "USD":
                return `$${Math.round(eur * 1.08)}`;
            case "EUR":
            default:
                return `${eur} €`;
        }
    };

    const handleSelectVehicle = (v: VehicleModel) => {
        const isAff = hubMode === "affiliate" || DEFAULT_VEHICLE_STOCK[v.id] === false;
        setSelectedVehicle(v);
        if (isAff) {
            setIsAffiliateDrawerOpen(true);
        } else {
            setIsBookingModalOpen(true);
        }
    };

    const handleToggleUpsell = (id: string) => {
        setSelectedUpsells((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Dates
    const today = new Date();
    const pickupDateObj = new Date(today);
    pickupDateObj.setDate(today.getDate() + 2);
    const returnDateObj = new Date(today);
    returnDateObj.setDate(today.getDate() + 2 + days);

    const pickupDate = pickupDateObj.toISOString().split("T")[0];
    const returnDate = returnDateObj.toISOString().split("T")[0];

    // Split upsell accounting for modal
    let platformUpsellsEur = 0;
    let vendorUpsellsEur = 0;

    selectedUpsells.forEach((upsellId) => {
        const item = UPSELL_OPTIONS.find((u) => u.id === upsellId);
        if (!item) return;
        const costEur = item.type === "per_day" ? item.priceEur * days : item.priceEur;
        if (item.provider === "platform") {
            platformUpsellsEur += costEur;
        } else {
            vendorUpsellsEur += costEur;
        }
    });

    const platformUpsellsMad = platformUpsellsEur * 11;
    const vendorUpsellsMad = vendorUpsellsEur * 11;

    return (
        <section id="vehicle-catalog" className="py-16 bg-[#FAF7F2]">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header & Controls Bar */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E7DFD5]">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9572C] mb-2">
                            <ShieldCheck size={14} />
                            {activeLocale === "en"
                                ? "Real Fleet • Guaranteed Model"
                                : activeLocale === "es"
                                ? "Flota Real • Modelo Garantizado"
                                : activeLocale === "nl"
                                ? "Echte Vloot • Gegarandeerd Model"
                                : "Flotte Réelle • Modèle Garanti"}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                            {activeLocale === "en"
                                ? `Vehicles available in ${pickupCity}`
                                : activeLocale === "es"
                                ? `Vehículos disponibles en ${pickupCity}`
                                : activeLocale === "nl"
                                ? `Beschikbare auto's in ${pickupCity}`
                                : `Véhicules disponibles à ${pickupCity}`}
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">
                            {activeLocale === "en"
                                ? "Guaranteed exact models, climate-serviced and delivered without wait at the airport or your riad."
                                : activeLocale === "es"
                                ? "Modelos garantizados, revisados para el clima local y entregados sin esperas en el aeropuerto o riad."
                                : activeLocale === "nl"
                                ? "Gegarandeerde modellen, gecontroleerd voor lokaal klimaat en zonder wachttijd geleverd op de luchthaven of riad."
                                : "Modèles garantis, révisés pour le climat local et livrés sans attente à l'aéroport ou à votre riad."}
                        </p>
                    </div>

                    {/* Filter Pills & Currency Switch */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
                        {/* Categories Horizontal Scroll on Mobile */}
                        <div className="flex items-center overflow-x-auto no-scrollbar py-1 -mx-4 px-4 sm:mx-0 sm:px-0">
                            <div className="inline-flex items-center gap-1 rounded-full bg-white p-1 border border-[#E7DFD5] shadow-xs text-xs shrink-0">
                                {[
                                    { id: "all", label: t.catalog.all },
                                    { id: "auto", label: t.catalog.automatic },
                                    { id: "suv", label: "SUV & 4x4" },
                                    {
                                        id: "citadine",
                                        label:
                                            activeLocale === "en"
                                                ? "City Cars"
                                                : activeLocale === "es"
                                                ? "Urbanos"
                                                : activeLocale === "nl"
                                                ? "Stadsauto's"
                                                : "Citadines",
                                    },
                                    {
                                        id: "family",
                                        label:
                                            activeLocale === "en"
                                                ? "7-Seaters"
                                                : activeLocale === "es"
                                                ? "7 Plazas"
                                                : activeLocale === "nl"
                                                ? "7 Zitplaatsen"
                                                : "7 Places",
                                    },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setSelectedCategory(tab.id)}
                                        className={`whitespace-nowrap px-3.5 py-1.5 rounded-full font-medium transition cursor-pointer text-xs shrink-0 ${
                                            selectedCategory === tab.id
                                                ? "bg-slate-900 text-white font-semibold shadow-xs"
                                                : "text-slate-600 hover:text-slate-900"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Currency selector - Fully responsive, cleanly padded */}
                        <div className="flex items-center self-start sm:self-auto shrink-0">
                            <div className="inline-flex items-center gap-0.5 rounded-full bg-white p-1 border border-[#E7DFD5] shadow-xs text-xs font-semibold text-slate-700">
                                {([ "EUR", "MAD", "GBP", "USD" ] as const).map((c) => (
                                    <button
                                        key={c}
                                        type="button"
                                        onClick={() => setCurrency(c)}
                                        className={`px-3 py-1 rounded-full cursor-pointer transition text-[11px] font-bold ${
                                            currency === c
                                                ? "bg-[#C9572C] text-white shadow-2xs"
                                                : "text-slate-600 hover:text-slate-900"
                                        }`}
                                    >
                                        {c === "MAD" ? "DH" : c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vehicles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map((vehicle) => {
                        const totalEst = vehicle.dailyPriceEur * days;
                        const isAffiliate = isHubInAffiliateFallback(currentHub.slug) || DEFAULT_VEHICLE_STOCK[vehicle.id] === false;
                        const vehicleLocalUrl = `/${activeLocale === "fr" ? "maroc" : activeLocale}/${currentHub.slug}/${vehicle.id}`;

                        const categoryLabel = vehicle.category;
                        const depositBadge = activeLocale === "en"
                            ? "Deposit €0 or €300"
                            : activeLocale === "es"
                            ? "Fianza 0€ o 300€"
                            : activeLocale === "nl"
                            ? "Borg €0 of €300"
                            : "Caution 0€ ou 300€";

                        const seatsLabel = `${vehicle.seats} ${activeLocale === "en" ? "seats" : activeLocale === "es" ? "pl." : activeLocale === "nl" ? "zitpl." : "pl."}`;
                        const transLabel = vehicle.transmission === "Automatique" ? "Auto." : (activeLocale === "en" ? "Manual" : activeLocale === "es" ? "Man." : activeLocale === "nl" ? "Hand." : "Manu.");
                        const fuelLabel = vehicle.fuel === "Diesel" ? "Diesel" : (activeLocale === "en" ? "Petrol" : activeLocale === "es" ? "Gasolina" : activeLocale === "nl" ? "Benzine" : "Essence");
                        const highlightText = (activeLocale !== "fr" && vehicle.highlightEn) ? vehicle.highlightEn : vehicle.highlight;
                        const equivalentCategoryText = activeLocale === "en"
                            ? vehicle.equivalentCategoryEn
                            : activeLocale === "es"
                            ? vehicle.equivalentCategoryEs
                            : activeLocale === "nl"
                            ? vehicle.equivalentCategoryNl
                            : vehicle.equivalentCategoryFr;
                        const discountPct = Math.round(((vehicle.marketPriceEur - vehicle.dailyPriceEur) / vehicle.marketPriceEur) * 100);

                        return (
                            <div
                                key={vehicle.id}
                                className="group rounded-3xl bg-white border border-[#E7DFD5] hover:border-slate-400 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Top badges */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                                            {categoryLabel}
                                        </span>
                                        {isAffiliate ? (
                                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800">
                                                {t.catalog.verifiedPartner}
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-slate-700">
                                                {depositBadge}
                                            </span>
                                        )}
                                    </div>

                                    {/* Vehicle Image */}
                                    <Link
                                        href={vehicleLocalUrl}
                                        aria-label={`${vehicle.name} - ${currentHub.name}`}
                                        className="block relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-slate-50 mb-4 cursor-pointer"
                                    >
                                        <img
                                            src={vehicle.image}
                                            alt={vehicle.name}
                                            width={800}
                                            height={500}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-2 left-2 bg-[#12161E]/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                            {transLabel}
                                        </div>
                                    </Link>

                                    {/* Title & Category Equivalent Notice */}
                                    <Link href={vehicleLocalUrl} aria-label={`${vehicle.name} - ${currentHub.name}`}>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-[#C9572C] transition-colors flex items-center justify-between">
                                            <span>{vehicle.name}</span>
                                            <ExternalLink size={15} className="text-slate-300 group-hover:text-[#C9572C] transition-colors shrink-0 ml-1" />
                                        </h3>
                                    </Link>
                                    <p className="text-[11px] font-medium text-slate-500 mt-0.5 line-clamp-1">
                                        {equivalentCategoryText}
                                    </p>
                                    <div className="mt-1.5 flex items-center gap-1.5">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                                            <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />
                                            <span>{t.catalog.freeUpgradeGuaranteed}</span>
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                                        {highlightText}
                                    </p>

                                    {/* Specs Pills */}
                                    <div className="grid grid-cols-4 gap-2 my-4 py-3 border-y border-slate-100 text-xs text-slate-600">
                                        <div className="flex flex-col items-center">
                                            <Users size={14} className="text-slate-400 mb-1" />
                                            <span className="font-semibold">{seatsLabel}</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Briefcase size={14} className="text-slate-400 mb-1" />
                                            <span className="font-semibold">{vehicle.luggage} {t.catalog.luggage}</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Cog size={14} className="text-slate-400 mb-1" />
                                            <span className="font-semibold">{transLabel}</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Fuel size={14} className="text-slate-400 mb-1" />
                                            <span className="font-semibold">{fuelLabel}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dual Price Display & Action Buttons */}
                                <div>
                                    {/* High-Impact Deal Header */}
                                    <div className="bg-[#FAF7F2] border border-[#E7DFD5] rounded-2xl p-2.5 mb-3">
                                        <div className="flex items-center justify-between gap-1 mb-1">
                                            <span className="text-[11px] font-semibold text-slate-500">
                                                {t.catalog.airportCounterBenchmark}
                                            </span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-xs font-bold text-slate-400 line-through decoration-[#C9572C] decoration-2 font-mono">
                                                    {formatPrice(vehicle.marketPriceEur, vehicle.marketPriceMad)}
                                                </span>
                                                <span className="bg-[#C9572C] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                                                    -{discountPct}%
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 pt-1 border-t border-[#EAE3D6]">
                                            <span>✓ {t.catalog.savingsTotalTrip.replace("{amount}", formatPrice((vehicle.marketPriceEur - vehicle.dailyPriceEur) * days, (vehicle.marketPriceMad - vehicle.dailyPriceMad) * days))}</span>
                                            <span className="text-[10px] text-slate-500 font-medium">({days} {t.search.daysCount})</span>
                                        </div>
                                    </div>

                                    <div className="flex items-baseline justify-between mb-3.5">
                                        <div>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                                    {formatPrice(vehicle.dailyPriceEur, vehicle.dailyPriceMad)}
                                                </span>
                                                <span className="text-xs text-slate-600 font-medium">/ {t.bookingWidget.perDay}</span>
                                                <span className="text-xs font-mono text-slate-500 font-semibold ml-0.5">
                                                    ({currency === "EUR" ? `${vehicle.dailyPriceMad} MAD` : `${vehicle.dailyPriceEur} €`})
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full inline-block">
                                                {t.catalog.freeDeliveryIncluded}
                                            </div>
                                            <div className="text-[10px] text-slate-500 mt-1 font-mono">
                                                {days}{activeLocale === "en" ? "d" : activeLocale === "es" ? "d" : activeLocale === "nl" ? "d" : "j"} : ~{formatPrice(totalEst, totalEst * 11)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2 Action Buttons: Direct Booking / Affiliate + Full SEO Product Page */}
                                    <div className="grid grid-cols-2 gap-2.5 items-center">
                                        {isAffiliate ? (
                                            <button
                                                type="button"
                                                onClick={() => handleSelectVehicle(vehicle)}
                                                className="h-11 px-3 rounded-2xl bg-slate-900 hover:bg-[#C9572C] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap"
                                            >
                                                <ExternalLink size={14} className="shrink-0" />
                                                <span className="truncate">{activeLocale === "en" ? "Check Stock" : activeLocale === "es" ? "Disponibilidad" : activeLocale === "nl" ? "Beschikbaarheid" : "Dispos Hub"}</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSelectVehicle(vehicle)}
                                                className="h-11 px-3 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98] whitespace-nowrap"
                                            >
                                                <Zap size={14} className="shrink-0" />
                                                <span className="truncate">{t.catalog.bookCar}</span>
                                            </button>
                                        )}

                                        <Link
                                            href={vehicleLocalUrl}
                                            aria-label={`${t.catalog.viewDetails} : ${vehicle.name}`}
                                            className="h-11 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
                                        >
                                            <span className="truncate">{t.catalog.viewDetails}</span>
                                            <ArrowRight size={14} className="shrink-0" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal de Réservation Instantanée avec Checkout Direct */}
            {isBookingModalOpen && selectedVehicle && (
                <BookingCheckoutModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    vehicle={selectedVehicle}
                    pickupHubSlug={currentHub.slug}
                    pickupDate={pickupDate}
                    returnDate={returnDate}
                    days={days}
                    selectedUpsells={selectedUpsells}
                    vendorUpsellsEur={vendorUpsellsEur}
                    vendorUpsellsMad={vendorUpsellsMad}
                    platformUpsellsEur={platformUpsellsEur}
                    platformUpsellsMad={platformUpsellsMad}
                    depositAcompteEur={Math.round((selectedVehicle.dailyPriceEur * days + vendorUpsellsEur) * 0.2) + platformUpsellsEur}
                    depositAcompteMad={(Math.round((selectedVehicle.dailyPriceEur * days + vendorUpsellsEur) * 0.2) + platformUpsellsEur) * 11}
                    balanceOnSiteEur={selectedVehicle.dailyPriceEur * days + vendorUpsellsEur - Math.round((selectedVehicle.dailyPriceEur * days + vendorUpsellsEur) * 0.2)}
                    balanceOnSiteMad={(selectedVehicle.dailyPriceEur * days + vendorUpsellsEur - Math.round((selectedVehicle.dailyPriceEur * days + vendorUpsellsEur) * 0.2)) * 11}
                    currency={currency === "MAD" ? "MAD" : "EUR"}
                    locale={activeLocale}
                />
            )}

            {/* Drawer de redirection Affiliation Partenaire (Fallback Haute Saison / Hors Stock) */}
            {isAffiliateDrawerOpen && selectedVehicle && (
                <AffiliateExitDrawer
                    isOpen={isAffiliateDrawerOpen}
                    onClose={() => setIsAffiliateDrawerOpen(false)}
                    vehicle={selectedVehicle}
                    hub={currentHub}
                    pickupDate={pickupDate}
                    returnDate={returnDate}
                />
            )}
        </section>
    );
}
