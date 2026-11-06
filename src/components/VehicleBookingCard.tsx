"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { VehicleModel, MOROCCAN_HUBS, UPSELL_OPTIONS, getHubMeetingPoint, getLocalizedAirportName } from "@/lib/morocco-data";
import { DEFAULT_HUB_DISTRIBUTION, DEFAULT_VEHICLE_STOCK } from "@/lib/affiliate";
import { Locale, getTranslation } from "@/lib/i18n";
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
    returnDay.setDate(today.getDate() + 8);

    const formatDateInput = (d: Date) => d.toISOString().split("T")[0];

    const [pickupHub, setPickupHub] = useState(defaultHubSlug);
    const [pickupDate, setPickupDate] = useState(formatDateInput(tomorrow));
    const [returnDate, setReturnDate] = useState(formatDateInput(returnDay));
    const [selectedUpsells, setSelectedUpsells] = useState<string[]>([
        "franchise-zero",
        "conducteur-additionnel",
    ]);
    const [currency, setCurrency] = useState<"EUR" | "MAD">("EUR");
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isAffiliateDrawerOpen, setIsAffiliateDrawerOpen] = useState(false);

    // Calculate duration in days
    const d1 = new Date(pickupDate);
    const d2 = new Date(returnDate);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Split Accounting Logic: Platform (100% Stripe) vs Vendor (20% com / 80% solde sur place)
    const baseRentalEur = vehicle.dailyPriceEur * days;
    const baseRentalMad = vehicle.dailyPriceMad * days;

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
    const isAffiliate = (DEFAULT_HUB_DISTRIBUTION[pickupHub] === "affiliate") || (DEFAULT_VEHICLE_STOCK[vehicle.id] === false);

    return (
        <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 shadow-xl space-y-6">
            {/* Caution & Paiement Clairs / Fallback Partenaire */}
            {isAffiliate ? (
                <div className="rounded-2xl bg-blue-50/70 border border-blue-200 p-3.5 flex items-start gap-3 text-xs text-blue-950">
                    <ShieldCheck size={18} className="text-blue-600 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold block">
                            Réseau Partenaire Aéroport ({currentHub.airportCode})
                        </span>
                        <p className="text-[11px] text-blue-700 mt-0.5">
                            Flotte directe locale réservée pour cette période. Disponibilités garanties via nos partenaires vérifiés à l'aéroport.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl bg-white border border-[#E7DFD5] p-3.5 flex items-start gap-3 text-xs text-slate-800">
                    <ShieldCheck size={18} className="text-[#C9572C] shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold text-slate-900 block">
                            {hasFranchiseZero ? t.bookingWidget.depositNoticeZero : t.bookingWidget.depositNoticeStandard}
                        </span>
                    </div>
                </div>
            )}

            {/* Top Pricing Header (Dual Currency) */}
            <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
                <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {t.bookingWidget.partnerRate}
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-3xl font-black text-slate-900">
                            {currency === "EUR" ? `${vehicle.dailyPriceEur} €` : `${vehicle.dailyPriceMad} MAD`}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">/ {t.bookingWidget.perDay}</span>
                        <span className="text-xs font-mono text-slate-400 ml-1">
                            ({currency === "EUR" ? `${vehicle.dailyPriceMad} MAD` : `${vehicle.dailyPriceEur} €`})
                        </span>
                    </div>
                </div>

                {/* Currency switch */}
                <div className="inline-flex rounded-full bg-[#FAF7F2] p-1 border border-[#E7DFD5] text-xs font-bold">
                    <button
                        type="button"
                        onClick={() => setCurrency("EUR")}
                        className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                            currency === "EUR" ? "bg-slate-900 text-white" : "text-slate-600"
                        }`}
                    >
                        EUR (€)
                    </button>
                    <button
                        type="button"
                        onClick={() => setCurrency("MAD")}
                        className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                            currency === "MAD" ? "bg-[#C9572C] text-white" : "text-slate-600"
                        }`}
                    >
                        MAD (DH)
                    </button>
                </div>
            </div>

            {/* Quick Location & Dates Selector */}
            <div className="space-y-3">
                <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                        {t.bookingWidget.pickupLocationLabel}
                    </label>
                    <div className="relative">
                        <select
                            value={pickupHub}
                            onChange={(e) => setPickupHub(e.target.value)}
                            className="w-full h-11 pl-9 pr-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C] appearance-none"
                        >
                            {MOROCCAN_HUBS.map((hub) => (
                                <option key={hub.slug} value={hub.slug}>
                                    {hub.name} — {getLocalizedAirportName(hub, activeLocale)} ({hub.airportCode})
                                </option>
                            ))}
                        </select>
                        <MapPin size={16} className="absolute left-3 top-3 text-[#C9572C] pointer-events-none" />
                        <ChevronDown size={14} className="absolute right-3 top-3.5 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1 truncate pr-2">
                            <Check size={12} className="text-emerald-600 shrink-0" />
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

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            {t.bookingWidget.pickupDateLabel}
                        </label>
                        <input
                            type="date"
                            value={pickupDate}
                            onChange={(e) => setPickupDate(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                            {t.bookingWidget.returnDateLabel} ({days} {t.search.daysCount})
                        </label>
                        <input
                            type="date"
                            value={returnDate}
                            min={pickupDate}
                            onChange={(e) => setReturnDate(e.target.value)}
                            className="w-full h-10 px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Subtilités Terrain Maroc (Carburant & Pistes) */}
            <div className="rounded-2xl bg-amber-50/60 border border-amber-200/70 p-3.5 space-y-2 text-xs">
                <div className="flex items-start gap-2">
                    <Fuel size={15} className="text-amber-700 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold text-amber-950">{t.bookingWidget.fuelPolicy}</span>
                        <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                            {t.bookingWidget.fuelPolicyDesc}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-amber-200/50">
                    <Compass size={15} className="text-amber-700 shrink-0 mt-0.5" />
                    <div>
                        <span className="font-bold text-amber-950">{t.bookingWidget.pistePolicy}</span>
                        <p className="text-[11px] text-amber-800 leading-snug mt-0.5">
                            {t.bookingWidget.pistePolicyDesc}
                        </p>
                    </div>
                </div>
            </div>

            {/* Upsell Options Selector */}
            <div className="pt-2 border-t border-slate-100">
                <UpsellSelector
                    days={days}
                    selectedUpsells={selectedUpsells}
                    onToggle={handleToggleUpsell}
                    currency={currency}
                    locale={activeLocale}
                />
            </div>

            {/* Split Financial Breakdown (Transparency & Max Cash Flow) */}
            <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                    <span>{vehicle.name} ({days} {t.search.daysCount} x {currency === "EUR" ? `${vehicle.dailyPriceEur} €` : `${vehicle.dailyPriceMad} MAD`})</span>
                    <span className="font-semibold text-slate-900 font-mono">
                        {currency === "EUR" ? `${baseRentalEur} €` : `${baseRentalMad} MAD`}
                    </span>
                </div>

                {(vendorUpsellsEur > 0 || platformUpsellsEur > 0) && (
                    <div className="flex justify-between text-slate-600">
                        <span>{t.bookingWidget.selectedOptions}</span>
                        <span className="font-semibold text-[#C9572C] font-mono">
                            {currency === "EUR"
                                ? `+${vendorUpsellsEur + platformUpsellsEur} €`
                                : `+${vendorUpsellsMad + platformUpsellsMad} MAD`}
                        </span>
                    </div>
                )}

                <div className="flex justify-between text-slate-600">
                    <span>{t.bookingWidget.depositAtCounter}</span>
                    <span className="font-bold text-slate-900 font-mono">
                        {hasFranchiseZero ? t.bookingWidget.zeroDepositActive : "300 €"}
                    </span>
                </div>

                {/* The Split Deposit Line (100% Platform + 20% Base) */}
                <div className="pt-3 border-t border-slate-200/80 flex items-baseline justify-between">
                    <div>
                        <div className="font-black text-slate-900 text-sm">
                            {t.bookingWidget.payTodayStripe}
                        </div>
                        <div className="text-[10px] text-slate-400">
                            {t.bookingWidget.payTodayNote}
                        </div>
                    </div>
                    <div className="text-xl font-black text-[#C9572C]">
                        {currency === "EUR" ? `${depositAcompteEur} €` : `${depositAcompteMad} MAD`}
                    </div>
                </div>

                <div className="flex justify-between text-slate-500 pt-1 text-[11px]">
                    <span>{t.bookingWidget.balanceOnSite}</span>
                    <span className="font-bold text-slate-800 font-mono">
                        {currency === "EUR" ? `${balanceOnSiteEur} €` : `${balanceOnSiteMad} MAD`} (~{balanceOnSiteMad} DH)
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                {isAffiliate ? (
                    <button
                        type="button"
                        onClick={() => setIsAffiliateDrawerOpen(true)}
                        className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-[#C9572C] text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                        <ExternalLink size={16} />
                        <span>Voir les disponibilités aéroport (Partenaire)</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={() => setShowSuccessModal(true)}
                        className="w-full h-12 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                    >
                        <Lock size={15} />
                        <span>{t.bookingWidget.lockVehicleBtn.replace("{amount}", currency === "EUR" ? `${depositAcompteEur} €` : `${depositAcompteMad} MAD`)}</span>
                    </button>
                )}

                <a
                    href={`https://wa.me/212600000000?text=${encodeURIComponent(
                        `Bonjour ZwinCar, je souhaite bloquer la ${vehicle.name} du ${pickupDate} au ${returnDate} à ${currentHub.name} avec options : ${selectedUpsells.join(', ')}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                    <MessageCircle size={15} className="text-emerald-600" />
                    <span>{t.bookingWidget.whatsappAvailabilityBtn}</span>
                </a>
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1.5">
                    <Check size={13} className="text-emerald-600 shrink-0" />
                    {t.bookingWidget.freeCancellationNotice}
                </span>
                <span className="flex items-center gap-1.5">
                    <Check size={13} className="text-emerald-600 shrink-0" />
                    {t.bookingWidget.stripeNotice}
                </span>
            </div>

            {/* Différence avec les courtiers à bas coût */}
            <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-3.5 space-y-2 text-[11px] text-slate-700">
                <div className="font-bold text-slate-900 text-xs">
                    {t.bookingWidget.brokerComparisonTitle}
                </div>
                <div className="space-y-1.5 text-slate-600 text-[11px]">
                    <div className="flex items-start gap-1.5">
                        <span className="text-slate-400 font-bold shrink-0">•</span>
                        <span>{t.bookingWidget.brokerComparisonLegacy}</span>
                    </div>
                    <div className="flex items-start gap-1.5 pt-1.5 border-t border-[#E7DFD5]">
                        <span className="text-[#C9572C] font-bold shrink-0">•</span>
                        <span>{t.bookingWidget.brokerComparisonZwincar}</span>
                    </div>
                </div>
            </div>

            {/* Interactive Checkout Drawer / Modal */}
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

            {/* Fallback Affiliation Drawer */}
            {isAffiliateDrawerOpen && (
                <AffiliateExitDrawer
                    isOpen={isAffiliateDrawerOpen}
                    onClose={() => setIsAffiliateDrawerOpen(false)}
                    vehicle={vehicle}
                    hub={currentHub}
                    pickupDate={pickupDate}
                    returnDate={returnDate}
                />
            )}
        </div>
    );
}
