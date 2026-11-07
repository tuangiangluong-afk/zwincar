"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    X,
    Lock,
    ShieldCheck,
    Calendar,
    MapPin,
    Plane,
    User,
    Mail,
    Phone,
    Check,
    CheckCircle2,
    MessageCircle,
    ExternalLink,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import { VehicleModel, CityHub, MOROCCAN_HUBS, getLocalizedAirportName } from "@/lib/morocco-data";
import { Locale, getTranslation } from "@/lib/i18n";
import { trackBeginCheckout } from "@/lib/gtm";
import { buildAffiliateRentalUrl } from "@/lib/affiliate";

interface BookingCheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: VehicleModel;
    pickupHubSlug: string;
    pickupDate: string;
    returnDate: string;
    days: number;
    selectedUpsells: string[];
    vendorUpsellsEur: number;
    vendorUpsellsMad: number;
    platformUpsellsEur: number;
    platformUpsellsMad: number;
    depositAcompteEur: number;
    depositAcompteMad: number;
    balanceOnSiteEur: number;
    balanceOnSiteMad: number;
    currency: "EUR" | "MAD";
    pickupTime?: string;
    returnTime?: string;
    locale?: Locale;
}

export function BookingCheckoutModal({
    isOpen,
    onClose,
    vehicle,
    pickupHubSlug,
    pickupDate,
    returnDate,
    days,
    selectedUpsells,
    vendorUpsellsEur,
    vendorUpsellsMad,
    platformUpsellsEur,
    platformUpsellsMad,
    depositAcompteEur,
    depositAcompteMad,
    balanceOnSiteEur,
    balanceOnSiteMad,
    currency,
    pickupTime = "10:00",
    returnTime = "10:00",
    locale = "fr",
}: BookingCheckoutModalProps) {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [flightNumber, setFlightNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [leadConfirmation, setLeadConfirmation] = useState<{ bookingRef: string; token: string } | null>(null);

    const currentHub =
        MOROCCAN_HUBS.find((h) => h.slug === pickupHubSlug) || MOROCCAN_HUBS[0];
    const hasFranchiseZero = selectedUpsells.includes("franchise-zero");
    const t = getTranslation(locale);

    React.useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        trackBeginCheckout({
            vehicleId: vehicle.id,
            vehicleName: vehicle.name,
            valueEur: (depositAcompteEur || 0) + (balanceOnSiteEur || 0),
            currency,
            days,
            pickupHub: currentHub.slug,
            depositAcompteEur,
            balanceOnSiteEur,
            hasZeroDeposit: hasFranchiseZero,
        });

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose, vehicle, depositAcompteEur, balanceOnSiteEur, currency, days, currentHub.slug, hasFranchiseZero]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setErrorMessage(null);

        try {
            // 1. Le dossier est créé côté serveur : le prix est recalculé par le
            //    moteur de réservation, jamais envoyé par le navigateur.
            const createRes = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vehicleId: vehicle.id,
                    pickupHub: currentHub.slug,
                    returnHub: currentHub.slug,
                    pickupDate,
                    pickupTime,
                    returnDate,
                    returnTime,
                    upsells: selectedUpsells,
                    currency,
                    locale,
                    client: { fullName, email, phone, flightNumber, notes },
                }),
            });

            const created = await createRes.json();
            if (!createRes.ok || !created?.booking) {
                setErrorMessage(
                    created?.error ??
                        (locale === "en" ? "Booking failed. Please check your information and try again."
                        : locale === "es" ? "Reserva imposible. Verifique su información e inténtelo de nuevo."
                        : locale === "nl" ? "Boeking mislukt. Controleer uw gegevens en probeer het opnieuw."
                        : "Réservation impossible. Vérifiez vos informations et réessayez.")
                );
                setIsSubmitting(false);
                return;
            }

            const bookingRef = created.booking.ref as string;
            const voucher = created.voucher;

            try {
                localStorage.setItem(`zwincar_booking_${bookingRef}`, JSON.stringify(voucher));
                localStorage.setItem(`zwincar_booking_token_${bookingRef}`, created.accessToken);
                localStorage.setItem("zwincar_last_booking_ref", bookingRef);
            } catch {
                // quota navigateur
            }

            // 2. Email de confirmation (non bloquant).
            fetch("/api/booking/send-confirmation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingRef,
                    clientEmail: voucher.client.email,
                    clientName: voucher.client.fullName,
                    clientPhone: voucher.client.phone,
                    vehicleName: voucher.rental.vehicleName,
                    hubName: voucher.rental.hubName,
                    airportCode: voucher.rental.airportCode,
                    meetingPointDetail: voucher.rental.meetingPointDetail,
                    pickupDate: voucher.rental.pickupDate,
                    returnDate: voucher.rental.returnDate,
                    days: voucher.rental.days,
                    depositAcompteEur: voucher.financials.depositAcompteEur,
                    balanceOnSiteEur: voucher.financials.balanceOnSiteEur,
                    balanceOnSiteMad: voucher.financials.balanceOnSiteMad,
                    hasFranchiseZero: voucher.financials.cautionEur === 0,
                    locale: locale || "fr",
                }),
            }).catch(() => {});

            // 3. Mode Lead-Gen Affiliation Hybride
            if (process.env.NEXT_PUBLIC_AFFILIATE_MODE === "true") {
                setIsSubmitting(false);
                setLeadConfirmation({ bookingRef, token: created.accessToken });
                return;
            }

            // Tentative Stripe ou bascule immédiate vers la confirmation Lead-Gen
            try {
                const payRes = await fetch("/api/stripe/checkout", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ref: bookingRef, token: created.accessToken }),
                });
                const pay = await payRes.json();

                setIsSubmitting(false);

                if (pay?.url && typeof pay.url === "string" && pay.url.startsWith("http")) {
                    onClose();
                    window.location.href = pay.url;
                } else {
                    setLeadConfirmation({ bookingRef, token: created.accessToken });
                }
            } catch {
                setIsSubmitting(false);
                setLeadConfirmation({ bookingRef, token: created.accessToken });
            }
        } catch {
            setIsSubmitting(false);
            setErrorMessage(t.checkoutModal.connectionError);
        }
    };

    if (leadConfirmation) {
        const waLeadText = encodeURIComponent(
            locale === "en"
                ? `Hello ZwinCar, I just booked the ${vehicle.name} (Ref #${leadConfirmation.bookingRef}) from ${pickupDate} to ${returnDate} in ${currentHub.name}. My name is ${fullName}, phone: ${phone}. Please confirm availability.`
                : `Bonjour ZwinCar, je viens de réserver la ${vehicle.name} (Réf #${leadConfirmation.bookingRef}) du ${pickupDate} au ${returnDate} à ${currentHub.name}. Mon nom : ${fullName}, tél : ${phone}. Merci de confirmer la prise en charge.`
        );

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-xs">
                <div className="w-full max-w-lg max-h-[92dvh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    {/* Header */}
                    <div className="shrink-0 bg-[#12161E] text-white p-4 sm:p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                                <CheckCircle2 size={22} />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                                    {t.checkoutModal.leadTransmitted.replace("{ref}", leadConfirmation.bookingRef)}
                                </div>
                                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                                    {t.checkoutModal.leadTitle}
                                </h3>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
                        {/* Direct Booking Confirmed Card */}
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-2 text-xs text-emerald-950">
                            <div className="font-bold flex items-center gap-1.5 text-emerald-900 text-sm">
                                <Check size={16} className="text-emerald-600 shrink-0" />
                                <span>{t.checkoutModal.leadHeld}</span>
                            </div>
                            <p className="text-[11px] text-emerald-900/90 leading-relaxed">
                                {t.checkoutModal.leadNotice
                                    .replace("{car}", vehicle.name)
                                    .replace("{hub}", currentHub.name)
                                    .replace("{dates}", `${pickupDate} ${locale === "en" ? "to" : locale === "es" ? "al" : locale === "nl" ? "tot" : "au"} ${returnDate}`)}
                            </p>
                            <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between text-[11px]">
                                <span>{t.checkoutModal.leadAcompteLabel} <strong>{currency === "EUR" ? `${depositAcompteEur} €` : `${depositAcompteMad} MAD`}</strong></span>
                                <span>{t.checkoutModal.leadCautionLabel} <strong>{hasFranchiseZero ? t.checkoutModal.cautionZeroValue : t.checkoutModal.cautionStandardValue}</strong></span>
                            </div>
                        </div>

                        {/* WhatsApp Priority Action */}
                        <div className="rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] p-4 space-y-2.5">
                            <div className="text-xs text-slate-700 leading-relaxed font-medium">
                                {t.checkoutModal.leadWaPrompt}
                            </div>
                            <a
                                href={`https://wa.me/212720794046?text=${waLeadText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-black text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                            >
                                <MessageCircle size={18} />
                                <span>{t.checkoutModal.leadWaBtn}</span>
                            </a>
                            <div className="text-center text-[10px] text-slate-400 font-medium">
                                {t.checkoutModal.leadWaGuarantee}
                            </div>
                        </div>

                        {/* Direct Voucher Access */}
                        <div className="pt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    router.push(`/booking/${leadConfirmation.bookingRef}?t=${leadConfirmation.token}&lang=${locale}`);
                                }}
                                className="w-full h-11 rounded-xl bg-slate-900 hover:bg-[#C9572C] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                                <span>{t.checkoutModal.viewVoucherBtn.replace("{ref}", leadConfirmation.bookingRef)}</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs">
            <div className="w-full max-w-xl md:max-w-4xl max-h-[94dvh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header (pinned) */}
                <div className="shrink-0 bg-[#12161E] text-white p-4 sm:p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#C9572C] flex items-center justify-center font-bold text-white shadow-xs">
                            <Lock size={18} />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                {t.checkoutModal.modalTitle}
                            </div>
                            <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                                {vehicle.name} — {currentHub.name} ({days} {t.search.daysCount})
                            </h3>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Caution & Conditions Claires (pinned) */}
                <div className="shrink-0 bg-[#FAF7F2] px-4 sm:px-5 py-2.5 border-b border-[#ECE5D9] flex items-center justify-between text-xs text-slate-700">
                    <span className="font-semibold">
                        {hasFranchiseZero ? t.checkoutModal.depositSummaryZero : t.checkoutModal.depositSummaryStandard}
                    </span>
                    <span className="text-[11px] text-slate-500">{t.checkoutModal.acceptedCardsNotice}</span>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                        {/* Left Column: Recap, Split, Trust & Perks */}
                        <div className="md:col-span-5 space-y-3.5 order-2 md:order-1">
                            {/* Trip Summary Card */}
                            <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-3.5 space-y-2 text-xs">
                                <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
                                    <div>
                                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                                            {t.checkoutModal.pickupLabel}
                                        </span>
                                        <span className="font-bold text-slate-900 text-xs block">
                                            {currentHub.name} ({currentHub.airportCode})
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-slate-400 text-[10px] uppercase font-bold block">
                                            {t.checkoutModal.durationLabel}
                                        </span>
                                        <span className="font-bold text-slate-900 text-xs font-mono">
                                            {days} {t.search.daysCount}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                                    <span>{t.checkoutModal.fromDate} <strong>{pickupDate}</strong></span>
                                    <span>{t.checkoutModal.toDate} <strong>{returnDate}</strong></span>
                                </div>
                            </div>

                            {/* Financial Split Box - Perfectly Aligned Table */}
                            <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 space-y-3 text-xs">
                                {/* Row 1: Acompte */}
                                <div className="flex items-baseline justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="font-bold text-slate-900 text-xs leading-tight">
                                            {t.checkoutModal.depositSplitTitle}
                                        </div>
                                        <div className="text-[10px] text-slate-500 leading-tight">
                                            {t.checkoutModal.depositSplitSubtitle}
                                        </div>
                                    </div>
                                    <div className="text-base sm:text-lg font-black text-[#C9572C] font-mono whitespace-nowrap shrink-0">
                                        {currency === "EUR" ? `${depositAcompteEur} €` : `${depositAcompteMad} MAD`}
                                    </div>
                                </div>

                                {/* Row 2: Solde */}
                                <div className="flex items-baseline justify-between gap-2 pt-2.5 border-t border-slate-200/70 text-[11px]">
                                    <div className="min-w-0">
                                        <div className="font-bold text-slate-800 leading-tight">
                                            {t.checkoutModal.balanceSplitTitle}
                                        </div>
                                        <div className="text-[10px] text-slate-500 leading-tight">
                                            {t.checkoutModal.balanceSplitSubtitle}
                                        </div>
                                    </div>
                                    <div className="font-bold text-slate-900 font-mono whitespace-nowrap shrink-0">
                                        {currency === "EUR" ? `${balanceOnSiteEur} €` : `${balanceOnSiteMad} MAD`}
                                    </div>
                                </div>

                                {/* Row 3: Caution */}
                                <div className="flex items-baseline justify-between gap-2 pt-2.5 border-t border-slate-200/70 text-[11px]">
                                    <div className="text-slate-700 font-medium">
                                        {t.checkoutModal.cautionSplitTitle}
                                    </div>
                                    <div className="font-bold text-slate-900 font-mono whitespace-nowrap shrink-0">
                                        {hasFranchiseZero ? t.checkoutModal.cautionZeroValue : t.checkoutModal.cautionStandardValue}
                                    </div>
                                </div>

                                {/* Guarantees */}
                                <div className="pt-2.5 border-t border-emerald-200/60 flex flex-col gap-1 text-[10px] text-emerald-800 font-semibold">
                                    <div className="flex items-center gap-1.5">
                                        <Check size={12} className="text-emerald-600 shrink-0" />
                                        <span>{t.checkoutModal.depositRefundGuarantee}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Check size={12} className="text-emerald-600 shrink-0" />
                                        <span>{t.checkoutModal.balanceInspectGuarantee}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust badges strip */}
                            <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-500 font-medium px-1">
                                <span>{t.checkoutModal.flightRadarBadge}</span>
                                <span>{t.checkoutModal.fuelBadge}</span>
                            </div>
                        </div>

                        {/* Right Column: Passenger Inputs & Payment Action */}
                        <div className="md:col-span-7 space-y-3.5 order-1 md:order-2">
                            {/* Form Fields */}
                    <div className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    {t.checkoutModal.fullNameLabel}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        placeholder={t.checkoutModal.fullNamePlaceholder}
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                    <User size={15} className="absolute left-3 top-3 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    {t.checkoutModal.phoneLabel}
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        required
                                        placeholder={t.checkoutModal.phonePlaceholder}
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                    <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    {t.checkoutModal.emailLabel}
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        placeholder={t.checkoutModal.emailPlaceholder}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                    <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    {t.checkoutModal.flightNumberLabel}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={t.checkoutModal.flightNumberPlaceholder}
                                        value={flightNumber}
                                        onChange={(e) => setFlightNumber(e.target.value)}
                                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                    <Plane size={15} className="absolute left-3 top-3 text-slate-400" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                {t.checkoutModal.notesLabel}
                            </label>
                            <input
                                type="text"
                                placeholder={t.checkoutModal.notesPlaceholder}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#C9572C]"
                            />
                        </div>
                    </div>
                            {errorMessage && (
                        <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold text-red-700">
                            {errorMessage}
                        </div>
                    )}
                            {/* Submit Button */}
                    <div className="space-y-2.5 pt-1">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-13 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span>{t.checkoutModal.payStripeBtn}...</span>
                            ) : (
                                <>
                                    <ShieldCheck size={16} />
                                    <span>
                                        {t.checkoutModal.payStripeBtn} • {currency === "EUR" ? `${depositAcompteEur} €` : `${depositAcompteMad} MAD`}
                                    </span>
                                </>
                            )}
                        </button>
                        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-semibold text-slate-500">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">🔒 Stripe SSL 256-bit</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Visa / Mastercard</span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">Apple Pay</span>
                            <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {locale === "en"
                                    ? "80% On-Site: Cash EUR/MAD or Debit Card"
                                    : locale === "es"
                                    ? "80% En destino: Efectivo EUR/MAD o Débito"
                                    : locale === "nl"
                                    ? "80% Ter plaatse: Cash EUR/MAD of Pinpas"
                                    : "80% Sur place : Cash EUR/MAD ou CB Débit"}
                            </span>
                        </div>
                        <div className="text-center text-[10px] text-slate-400">
                            {t.checkoutModal.cancelFreeNotice} • {t.checkoutModal.securePaymentNotice}
                        </div>
                    </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
