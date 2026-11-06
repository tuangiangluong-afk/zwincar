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

    if (!isOpen) return null;

    const currentHub =
        MOROCCAN_HUBS.find((h) => h.slug === pickupHubSlug) || MOROCCAN_HUBS[0];
    const hasFranchiseZero = selectedUpsells.includes("franchise-zero");
    const t = getTranslation(locale);

    React.useEffect(() => {
        if (!isOpen) return;

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
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose, vehicle, depositAcompteEur, balanceOnSiteEur, currency, days, currentHub.slug, hasFranchiseZero]);

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
                        "Réservation impossible. Vérifiez vos informations et réessayez."
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
            setErrorMessage("Connexion interrompue. Réessayez dans un instant.");
        }
    };

    if (leadConfirmation) {
        const localrentUrl = buildAffiliateRentalUrl({
            provider: "localrent",
            hubCode: currentHub.airportCode,
            citySlug: currentHub.slug,
            pickupDate,
            returnDate,
        });

        const discoverCarsUrl = buildAffiliateRentalUrl({
            provider: "discovercars",
            hubCode: currentHub.airportCode,
            citySlug: currentHub.slug,
            pickupDate,
            returnDate,
        });

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
                <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
                    <div className="bg-[#12161E] text-white p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                                    Demande #{leadConfirmation.bookingRef} Transmise
                                </div>
                                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                                    Vérification WhatsApp en cours
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

                    <div className="p-6 space-y-5">
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 space-y-1.5 text-xs text-emerald-950">
                            <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                                <MessageCircle size={15} />
                                <span>Alerte envoyée aux agents {currentHub.name}</span>
                            </div>
                            <p className="text-[11px] text-emerald-900/80 leading-relaxed">
                                Notre équipe locale vérifie la disponibilité sans caution de votre <strong>{vehicle.name}</strong> à {currentHub.name} ({pickupDate} au {returnDate}) et vous contacte sur WhatsApp au <strong>{phone}</strong> d&apos;ici 15 minutes.
                            </p>
                        </div>

                        {/* Partner Instant Bridge */}
                        <div className="rounded-2xl bg-linear-to-b from-[#FAF7F2] to-amber-500/10 border-2 border-amber-500/30 p-4 space-y-3">
                            <div>
                                <div className="text-[10px] font-bold uppercase text-amber-800 tracking-wider">
                                    ⚡ Besoin d&apos;un véhicule garanti immédiatement ?
                                </div>
                                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                                    En attendant notre confirmation WhatsApp, sécurisez instantanément une voiture disponible au Terminal {currentHub.airportCode} via nos partenaires officiels certifiés :
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                                <a
                                    href={localrentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-11 px-3 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                                >
                                    <span className="truncate">Localrent (Faible Caution)</span>
                                    <ExternalLink size={13} className="shrink-0" />
                                </a>
                                <a
                                    href={discoverCarsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-11 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                                >
                                    <span className="truncate">DiscoverCars (Terminal)</span>
                                    <ExternalLink size={13} className="shrink-0" />
                                </a>
                            </div>
                        </div>

                        {/* Direct Voucher Access */}
                        <div className="pt-1">
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    router.push(`/booking/${leadConfirmation.bookingRef}?t=${leadConfirmation.token}`);
                                }}
                                className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <span>Consulter mon bon de réservation #{leadConfirmation.bookingRef}</span>
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
            <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="bg-[#12161E] text-white p-5 flex items-center justify-between">
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

                {/* Caution & Conditions Claires */}
                <div className="bg-[#FAF7F2] px-5 py-2.5 border-b border-[#ECE5D9] flex items-center justify-between text-xs text-slate-700">
                    <span className="font-semibold">
                        {hasFranchiseZero ? t.checkoutModal.depositSummaryZero : t.checkoutModal.depositSummaryStandard}
                    </span>
                    <span className="text-[11px] text-slate-500">{t.checkoutModal.acceptedCardsNotice}</span>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Recap Row */}
                    <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-3.5 grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">
                                {t.checkoutModal.pickupLabel}
                            </span>
                            <span className="font-bold text-slate-900 block truncate">
                                {getLocalizedAirportName(currentHub, locale)} ({currentHub.airportCode})
                            </span>
                            <span className="text-[11px] text-slate-500">{pickupDate}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">
                                {t.checkoutModal.returnLabel}
                            </span>
                            <span className="font-bold text-slate-900 block truncate">
                                {currentHub.name}
                            </span>
                            <span className="text-[11px] text-slate-500">{returnDate} ({days} {t.search.daysCount})</span>
                        </div>
                    </div>

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

                    {/* Financial Split Box */}
                    <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-700">
                            <span>{t.bookingWidget.payTodayStripe} :</span>
                            <span className="text-base font-black text-[#C9572C] font-mono">
                                {currency === "EUR" ? `${depositAcompteEur} €` : `${depositAcompteMad} MAD`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500 text-[11px]">
                            <span>{t.bookingWidget.balanceOnSite}</span>
                            <span className="font-bold text-slate-900 font-mono">
                                {currency === "EUR" ? `${balanceOnSiteEur} €` : `${balanceOnSiteMad} MAD`} (~{balanceOnSiteMad} DH)
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500 text-[11px] pt-1 border-t border-slate-200/80">
                            <span>{t.bookingWidget.depositAtCounter} :</span>
                            <span className="font-bold text-slate-900 font-mono">
                                {hasFranchiseZero ? t.bookingWidget.zeroDepositActive : "300 €"}
                            </span>
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
                                    <Sparkles size={16} />
                                    <span>
                                        {t.checkoutModal.payStripeBtn} • {currency === "EUR" ? `${depositAcompteEur} €` : `${depositAcompteMad} MAD`}
                                    </span>
                                </>
                            )}
                        </button>
                        <div className="text-center text-[10px] text-slate-400">
                            {t.checkoutModal.cancelFreeNotice} • {t.checkoutModal.securePaymentNotice}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
