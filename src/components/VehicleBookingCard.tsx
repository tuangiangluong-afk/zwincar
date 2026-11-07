"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { VehicleModel, MOROCCAN_HUBS, UPSELL_OPTIONS, getHubMeetingPoint, getLocalizedAirportName } from "@/lib/morocco-data";
import { DEFAULT_HUB_DISTRIBUTION, DEFAULT_VEHICLE_STOCK, isHubInAffiliateFallback } from "@/lib/affiliate";
import { Locale, getTranslation } from "@/lib/i18n";
import { seasonFor, longStayDiscount, getSeasonLabel } from "@/lib/booking-engine";
import UpsellSelector from "@/components/UpsellSelector";
import { BookingCheckoutModal } from "@/components/BookingCheckoutModal";
import { AffiliateExitDrawer } from "@/components/AffiliateExitDrawer";
import {
    ShieldCheck,
    Calendar,
    MapPin,
    Lock,
    MessageCircle,
    Check,
    ChevronDown,
    Zap,
    Fuel,
    Compass,
    Info,
    ExternalLink,
    Sparkles,
} from "lucide-react";

interface VehicleBookingCardProps {
    vehicle: VehicleModel;
    defaultHubSlug?: string;
    locale?: Locale;
}

export default function VehicleBookingCard({
    vehicle,
    defaultHubSlug = "marrakech",
    locale: propLocale,
}: VehicleBookingCardProps) {
    const pathname = usePathname() || "";
    let activeLocale: Locale = propLocale || "fr";
    if (!propLocale) {
        if (pathname.startsWith("/en")) activeLocale = "en";
        else if (pathname.startsWith("/es")) activeLocale = "es";
        else if (pathname.startsWith("/nl")) activeLocale = "nl";
    }

    const t = getTranslation(activeLocale);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 2);
    const returnDay = new Date(today);
    returnDay.setDate(today.getDate() + 5);

    const formatDateInput = (d: Date) => d.toISOString().split("T")[0];

    const [pickupHub, setPickupHub] = useState(defaultHubSlug);
    const [pickupDate, setPickupDate] = useState(formatDateInput(tomorrow));
    const [returnDate, setReturnDate] = useState(formatDateInput(returnDay));

    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const p = params.get("pickupDate");
            const r = params.get("returnDate");
            if (p) setPickupDate(p);
            if (r) setReturnDate(r);
        }
    }, []);
    const [selectedUpsells, setSelectedUpsells] = useState<string[]>([
        "franchise-zero",
        "conducteur-additionnel",
    ]);
    const [currency, setCurrency] = useState<"EUR" | "MAD">("EUR");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isAffiliateDrawerOpen, setIsAffiliateDrawerOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    // Calculate duration in days
    const d1 = new Date(pickupDate);
    const d2 = new Date(returnDate);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Dynamic Seasonality & Duration Discount Logic
    const season = seasonFor(pickupDate);
    const durationDiscount = longStayDiscount(days);

    // Daily price adjusted by season and duration discount
    const effectiveDailyPriceEur = Math.round(vehicle.dailyPriceEur * season.multiplier * (1 - durationDiscount));
    const effectiveDailyPriceMad = Math.round(vehicle.dailyPriceMad * season.multiplier * (1 - durationDiscount));

    const baseRentalEur = effectiveDailyPriceEur * days;
    const baseRentalMad = effectiveDailyPriceMad * days;

    const baseWithoutDiscountEur = Math.round(vehicle.dailyPriceEur * season.multiplier) * days;
    const baseWithoutDiscountMad = Math.round(vehicle.dailyPriceMad * season.multiplier) * days;
    const durationSavingsEur = baseWithoutDiscountEur - baseRentalEur;
    const durationSavingsMad = baseWithoutDiscountMad - baseRentalMad;

    const totalSavingsVsAirportEur = (vehicle.marketPriceEur * days) - baseRentalEur;
    const totalSavingsVsAirportMad = (vehicle.marketPriceMad * days) - baseRentalMad;
    const discountPct = Math.round(((vehicle.marketPriceEur - effectiveDailyPriceEur) / vehicle.marketPriceEur) * 100);

    let platformUpsellsEur = 0;
    let platformUpsellsMad = 0;
    let vendorUpsellsEur = 0;
    let vendorUpsellsMad = 0;

    selectedUpsells.forEach((upsellId) => {
        const item = UPSELL_OPTIONS.find((u) => u.id === upsellId);
        if (!item) return;

        const costEur = item.type === "per_day" ? item.priceEur * days : item.priceEur;
        const costMad = item.type === "per_day" ? item.priceMad * days : item.priceMad;

        if (item.provider === "platform") {
            platformUpsellsEur += costEur;
            platformUpsellsMad += costMad;
        } else {
            vendorUpsellsEur += costEur;
            vendorUpsellsMad += costMad;
        }
    });

    // Commission 20% on (Car + Vendor Upsells) + 100% of Platform Upsells (eSIM, Pack Sérénité)
    const depositAcompteEur =
        Math.round((baseRentalEur + vendorUpsellsEur) * 0.2) + platformUpsellsEur;
    const depositAcompteMad =
        Math.round((baseRentalMad + vendorUpsellsMad) * 0.2) + platformUpsellsMad;

    // Remaining Balance paid on site directly to the local agency (80% of Car + Vendor Upsells)
    const balanceOnSiteEur =
        baseRentalEur + vendorUpsellsEur - Math.round((baseRentalEur + vendorUpsellsEur) * 0.2);
    const balanceOnSiteMad =
        baseRentalMad + vendorUpsellsMad - Math.round((baseRentalMad + vendorUpsellsMad) * 0.2);

    const grandTotalEur = baseRentalEur + vendorUpsellsEur + platformUpsellsEur;
    const grandTotalMad = baseRentalMad + vendorUpsellsMad + platformUpsellsMad;

    const handleToggleUpsell = (id: string) => {
        setSelectedUpsells((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const currentHub = MOROCCAN_HUBS.find((h) => h.slug === pickupHub) || MOROCCAN_HUBS[0];
    const hasFranchiseZero = selectedUpsells.includes("franchise-zero");
    const isAffiliate = isHubInAffiliateFallback(pickupHub) || (DEFAULT_VEHICLE_STOCK[vehicle.id] === false);

    
    const nonFranchiseUpsells = selectedUpsells.filter((id) => id !== "franchise-zero");
    const nonFranchiseUpsellsTotalEur = UPSELL_OPTIONS
        .filter((u) => nonFranchiseUpsells.includes(u.id))
        .reduce((acc, u) => acc + (u.type === "per_day" ? u.priceEur * days : u.priceEur), 0);
    const nonFranchiseUpsellsTotalMad = UPSELL_OPTIONS
        .filter((u) => nonFranchiseUpsells.includes(u.id))
        .reduce((acc, u) => acc + (u.type === "per_day" ? u.priceMad * days : u.priceMad), 0);
    const franchiseZeroPriceEur = days * 8;
    const franchiseZeroPriceMad = days * 90;

return (
        <div className="rounded-3xl bg-white border border-[#E7DFD5] p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-5">
            {/* 1. Header: Social Proof & Clean Pricing */}
            <div className="pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                        <ShieldCheck size={13} className="text-[#C9572C] shrink-0" />
                        <span className="truncate">{t.bookingWidget.verifiedReviews}</span>
                    </div>

                    {/* Currency switch */}
                    <div className="inline-flex rounded-full bg-[#FAF7F2] p-0.5 border border-[#E7DFD5] text-[11px] font-bold shrink-0">
                        <button
                            type="button"
                            onClick={() => setCurrency("EUR")}
                            className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                                currency === "EUR" ? "bg-slate-900 text-white" : "text-slate-600"
                            }`}
                        >
                            EUR (€)
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrency("MAD")}
                            className={`px-2 py-0.5 rounded-full transition cursor-pointer ${
                                currency === "MAD" ? "bg-[#C9572C] text-white" : "text-slate-600"
                            }`}
                        >
                            MAD (DH)
                        </button>
                    </div>
                </div>

                <div className="flex items-baseline justify-between">
                    <div>
                        <div className="flex flex-wrap items-baseline gap-2">
                            <span className="text-3xl font-black text-slate-900 tracking-tight whitespace-nowrap">
                                {currency === "EUR" ? `${effectiveDailyPriceEur} €` : `${effectiveDailyPriceMad} MAD`}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">/ {t.bookingWidget.perDay}</span>
                            {discountPct > 0 && (
                                <div className="inline-flex items-center gap-1.5 ml-1">
                                    <span className="text-sm font-bold text-red-400 line-through decoration-red-500 decoration-2 font-mono whitespace-nowrap">
                                        {currency === "EUR" ? `${vehicle.marketPriceEur} €` : `${vehicle.marketPriceMad} MAD`}
                                    </span>
                                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-black uppercase tracking-wider whitespace-nowrap shadow-xs">
                                        -{discountPct}%
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium mt-1 flex flex-wrap items-center gap-1.5">
                            <span>{days}{activeLocale === "en" ? "d" : "j"} : ~{currency === "EUR" ? `${baseRentalEur} €` : `${baseRentalMad} MAD`}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-emerald-700 font-semibold">{t.catalog.freeDeliveryIncluded}</span>
                            {totalSavingsVsAirportEur > 0 && (
                                <>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-[#C9572C] font-bold">
                                        {activeLocale === "en"
                                            ? `Save ~€${totalSavingsVsAirportEur} vs airport counters`
                                            : activeLocale === "es"
                                            ? `Ahorro ~${totalSavingsVsAirportEur} € frente al mostrador`
                                            : activeLocale === "nl"
                                            ? `Bespaar ~€${totalSavingsVsAirportEur} t.o.v. balie`
                                            : `Économie ~${totalSavingsVsAirportEur} € vs guichet`}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Hub & Dates Selector (Mobile Optimized 2-column) */}
            <div className="space-y-2.5">
                <div>
                    <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        {t.bookingWidget.pickupLocationLabel}
                    </label>
                    <div className="relative">
                        <select
                            value={pickupHub}
                            onChange={(e) => setPickupHub(e.target.value)}
                            className="w-full h-11 pl-9 pr-8 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C] appearance-none"
                        >
                            {MOROCCAN_HUBS.map((hub) => (
                                <option key={hub.slug} value={hub.slug}>
                                    {hub.name} — {getLocalizedAirportName(hub, activeLocale)} ({hub.airportCode})
                                </option>
                            ))}
                        </select>
                        <MapPin size={15} className="absolute left-3 top-3 text-[#C9572C] pointer-events-none" />
                        <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-0.5">
                        <span className="flex items-center gap-1 truncate pr-2">
                            <Check size={11} className="text-emerald-600 shrink-0" />
                            <span className="truncate">{getHubMeetingPoint(currentHub, activeLocale)}</span>
                        </span>
                        <a
                            href={`/${activeLocale === "fr" ? "maroc" : activeLocale}/${currentHub.slug}/${vehicle.id}`}
                            className="font-bold text-[#C9572C] hover:underline shrink-0"
                        >
                            {t.bookingWidget.hubSheetLink.replace("{hub}", currentHub.name)}
                        </a>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            {t.bookingWidget.pickupDateLabel}
                        </label>
                        <input
                            type="date"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            className="w-full h-10 px-2.5 sm:px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            {t.bookingWidget.returnDateLabel} ({days} {t.search.daysCount})
                        </label>
                        <input
                            type="date"
                            value={returnDate}
                            min={pickupDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="w-full h-10 px-2.5 sm:px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Compact Trust & Perks Card */}
            <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-3 text-xs space-y-2">
                <div className="grid grid-cols-2 gap-1.5 text-[11px] font-medium text-slate-700">
                    <div className="flex items-center gap-1.5 text-emerald-800 truncate">
                        <Check size={12} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{t.pricingTiers.perkDelivery}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 truncate">
                        <Check size={12} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{t.pricingTiers.perkMileage}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 truncate">
                        <Check size={12} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{t.pricingTiers.perkModel}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-800 truncate">
                        <Check size={12} className="text-emerald-600 shrink-0" />
                        <span className="truncate">{t.pricingTiers.perkSupport}</span>
                    </div>
                </div>
                <div className="pt-2 border-t border-[#EAE3D6] flex flex-wrap items-center justify-between text-[10px] text-slate-600 gap-1 font-medium">
                    <span>{t.bookingWidget.fuelPolicyCompact}</span>
                    <span>{t.bookingWidget.pistePolicyCompact}</span>
                </div>
            </div>

            {/* 4. Protection & Deposit Formule Toggle */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <span>{t.bookingWidget.protectionTitle}</span>
                    <span className="text-emerald-700 font-semibold normal-case">{t.bookingWidget.debitAccepted}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {/* Tier 1: Standard */}
                    <button
                        type="button"
                        onClick={() => {
                            if (hasFranchiseZero) {
                                setSelectedUpsells((prev) => prev.filter((id) => id !== "franchise-zero"));
                            }
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer relative ${
                            !hasFranchiseZero
                                ? "bg-white border-slate-900 ring-2 ring-slate-900/10 shadow-xs"
                                : "bg-[#FAF7F2] border-slate-200 hover:border-slate-300 opacity-80"
                        }`}
                    >
                        <div className="font-bold text-xs text-slate-900 flex items-center justify-between">
                            <span>{t.bookingWidget.standardLabel}</span>
                            {!hasFranchiseZero && <span className="w-2 h-2 rounded-full bg-slate-900"></span>}
                        </div>
                        <div className="text-[11px] font-black text-slate-800 font-mono mt-0.5">
                            {t.bookingWidget.standardDeposit}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                            {t.bookingWidget.standardDepositNote}
                        </div>
                    </button>

                    {/* Tier 2: Pack Sérénité Franchise Zéro */}
                    <button
                        type="button"
                        onClick={() => {
                            if (!hasFranchiseZero) {
                                setSelectedUpsells((prev) => [...prev, "franchise-zero"]);
                            }
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer relative ${
                            hasFranchiseZero
                                ? "bg-amber-50/60 border-[#C9572C] ring-2 ring-[#C9572C]/20 shadow-xs"
                                : "bg-[#FAF7F2] border-slate-200 hover:border-slate-300 opacity-80"
                        }`}
                    >
                        <div className="font-bold text-xs text-[#C9572C] flex items-center justify-between">
                            <span>{t.bookingWidget.serenityLabel}</span>
                            {hasFranchiseZero && <span className="w-2 h-2 rounded-full bg-[#C9572C]"></span>}
                        </div>
                        <div className="text-[11px] font-black text-[#C9572C] font-mono mt-0.5">
                            {t.bookingWidget.serenityDeposit}
                        </div>
                        <div className="text-[10px] text-slate-600 mt-0.5 leading-tight font-medium">
                            +{currency === "EUR" ? "8 €" : "90 MAD"}/j • {t.bookingWidget.serenityZeroBlock}
                        </div>
                    </button>
                </div>
            </div>

            {/* 5. Travel Options Accordion (Collapsible 1-click) */}
            <div className="space-y-2">
                <button
                    type="button"
                    onClick={() => setIsOptionsOpen((v) => !v)}
                    className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-700 hover:border-[#C9572C]/40 transition cursor-pointer"
                >
                    <span className="flex items-center gap-1.5 truncate pr-2">
                        <Sparkles size={13} className="text-[#C9572C] shrink-0" />
                        <span className="truncate">{t.bookingWidget.optionsTitle}</span>
                        {nonFranchiseUpsells.length > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-[#C9572C] text-white text-[10px] font-bold shrink-0">
                                {nonFranchiseUpsells.length}
                            </span>
                        )}
                    </span>
                    <ChevronDown size={14} className={`transform transition-transform shrink-0 ${isOptionsOpen ? "rotate-180" : ""}`} />
                </button>

                {isOptionsOpen && (
                    <div className="pt-1 animate-in fade-in duration-150">
                        <UpsellSelector
                            days={days}
                            selectedUpsells={selectedUpsells}
                            onToggle={handleToggleUpsell}
                            currency={currency}
                            locale={activeLocale}
                            hideFranchiseZero={true}
                        />
                    </div>
                )}
            </div>

            {/* 6. Clarified Financial Split (No More Mystery +24€) */}
            <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-3.5 space-y-2 text-xs">
                <div className="flex items-baseline justify-between gap-3 text-slate-600">
                    <span className="min-w-0 pr-1">{vehicle.name} ({days} {t.search.daysCount})</span>
                    <span className="font-semibold text-slate-900 font-mono whitespace-nowrap shrink-0">
                        {currency === "EUR" ? `${baseRentalEur} €` : `${baseRentalMad} MAD`}
                    </span>
                </div>

                {/* Explicit Franchise Zéro Line */}
                {hasFranchiseZero && (
                    <div className="flex items-baseline justify-between gap-3 text-slate-700 font-medium">
                        <span className="min-w-0 pr-1">{t.bookingWidget.serenityLabel} ({t.bookingWidget.serenityDeposit} • 8 €/j)</span>
                        <span className="font-semibold text-[#C9572C] font-mono whitespace-nowrap shrink-0">
                            +{currency === "EUR" ? `${franchiseZeroPriceEur} €` : `${franchiseZeroPriceMad} MAD`}
                        </span>
                    </div>
                )}

                {/* Non-Franchise Extra Upsells */}
                {nonFranchiseUpsells.length > 0 && (
                    <div className="flex items-baseline justify-between gap-3 text-slate-600">
                        <span className="min-w-0 pr-1">{t.bookingWidget.optionsExtra} ({nonFranchiseUpsells.length})</span>
                        <span className="font-semibold text-slate-900 font-mono whitespace-nowrap shrink-0">
                            +{currency === "EUR" ? `${nonFranchiseUpsellsTotalEur} €` : `${nonFranchiseUpsellsTotalMad} MAD`}
                        </span>
                    </div>
                )}

                <div className="flex items-baseline justify-between gap-3 text-slate-600 pt-1 border-t border-slate-200/60">
                    <span className="min-w-0 pr-1">{t.bookingWidget.depositAtCounter}</span>
                    <span className="font-bold text-slate-900 font-mono whitespace-nowrap shrink-0">
                        {hasFranchiseZero ? t.bookingWidget.zeroDepositActive : "300 €"}
                    </span>
                </div>

                {/* 20% Deposit Today */}
                <div className="pt-2 border-t border-slate-200/80 flex items-baseline justify-between gap-3">
                    <div className="min-w-0 pr-1">
                        <div className="font-black text-slate-900 text-sm">
                            {t.bookingWidget.payTodayStripe}
                        </div>
                        <div className="text-[10px] text-slate-400">
                            {t.bookingWidget.payTodayNote}
                        </div>
                    </div>
                    <div className="text-lg sm:text-xl font-black text-[#C9572C] font-mono whitespace-nowrap shrink-0">
                        {currency === "EUR" ? `${depositAcompteEur} €` : `${depositAcompteMad} MAD`}
                    </div>
                </div>

                <div className="flex items-baseline justify-between gap-3 text-slate-500 text-[11px]">
                    <span className="min-w-0 pr-1">{t.bookingWidget.balanceOnSite}</span>
                    <span className="font-bold text-slate-800 font-mono whitespace-nowrap shrink-0">
                        {currency === "EUR" ? `${balanceOnSiteEur} €` : `${balanceOnSiteMad} MAD`} (~{balanceOnSiteMad} DH)
                    </span>
                </div>

                <div className="pt-1.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-1 text-[10px] text-emerald-800 font-semibold">
                    <span>✓ {t.bookingWidget.refund48h}</span>
                    <span>✓ {t.bookingWidget.inspection80}</span>
                </div>
            </div>

            {/* 7. Action Buttons */}
            <div className="space-y-2">
                {isAffiliate ? (
                    <button
                        type="button"
                        onClick={() => setIsAffiliateDrawerOpen(true)}
                        className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-[#C9572C] text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                        <ExternalLink size={16} />
                        <span>{t.bookingWidget.partnerCheckStockBtn}</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => setShowSuccessModal(true)}
                        className="w-full h-12 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                        <Lock size={15} />
                        <span>{t.bookingWidget.lockVehicleBtn.replace("{amount}", currency === "EUR" ? `${depositAcompteEur} €` : `${depositAcompteMad} MAD`)}</span>
                    </button>
                )}

                <a
                    onClick={() => { try { fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ vehicle: vehicle.id, hub: pickupHub, pickupDate, returnDate, days, price: currency === "EUR" ? grandTotalEur : grandTotalMad, currency, upsells: selectedUpsells, ts: new Date().toISOString() }) }).catch(() => {}) } catch {} }}
                    href={`https://wa.me/212720794046?text=${encodeURIComponent(
                        activeLocale === "en"
                            ? `Hello ZwinCar, I would like to book the ${vehicle.name} from ${pickupDate} to ${returnDate} in ${currentHub.name} with options: ${selectedUpsells.join(", ")}.`
                            : `Bonjour ZwinCar, je souhaite bloquer la ${vehicle.name} du ${pickupDate} au ${returnDate} à ${currentHub.name} avec options : ${selectedUpsells.join(", ")}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 rounded-2xl bg-[#FAF7F2] hover:bg-slate-100 border border-[#E7DFD5] text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
                >
                    <MessageCircle size={15} className="text-emerald-600" />
                    <span>{t.bookingWidget.whatsappAvailabilityBtn}</span>
                </a>

                <div className="text-center text-[10px] text-slate-400 font-medium">
                    ⚡ {t.bookingWidget.whatsappSpeed}
                </div>

                {!isAffiliate && (
                    <button
                        type="button"
                        onClick={() => setIsAffiliateDrawerOpen(true)}
                        className="w-full py-1 text-[11px] font-semibold text-slate-400 hover:text-[#C9572C] transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                        <span>
                            {t.bookingWidget.brokerComparisonTitle} ({currentHub.airportCode})
                        </span>
                        <ExternalLink size={11} className="shrink-0" />
                    </button>
                )}
            </div>

            {/* Modals */}
            <BookingCheckoutModal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                vehicle={vehicle}
                pickupHubSlug={pickupHub}
                pickupDate={pickupDate}
                returnDate={returnDate}
                days={days}
                selectedUpsells={selectedUpsells}
                vendorUpsellsEur={vendorUpsellsEur}
                vendorUpsellsMad={vendorUpsellsMad}
                platformUpsellsEur={platformUpsellsEur}
                platformUpsellsMad={platformUpsellsMad}
                depositAcompteEur={depositAcompteEur}
                depositAcompteMad={depositAcompteMad}
                balanceOnSiteEur={balanceOnSiteEur}
                balanceOnSiteMad={balanceOnSiteMad}
                currency={currency}
                locale={activeLocale}
            />

            {isAffiliateDrawerOpen && (
                <AffiliateExitDrawer
                    isOpen={isAffiliateDrawerOpen}
                    onClose={() => setIsAffiliateDrawerOpen(false)}
                    vehicle={vehicle}
                    hub={currentHub}
                    pickupDate={pickupDate}
                    returnDate={returnDate}
                    locale={activeLocale}
                />
            )}
        </div>
    );
}
