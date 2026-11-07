"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    CheckCircle2,
    Calendar,
    MapPin,
    Clock,
    FileText,
    Upload,
    Plane,
    Phone,
    MessageCircle,
    ShieldCheck,
    Printer,
    Download,
    AlertCircle,
    ShieldAlert,
    QrCode,
    Sparkles,
    User,
    ChevronRight,
    Mail,
    Wifi,
    Building2,
    ExternalLink,
    Lock,
    Compass,
    Palmtree,
    Check,
    Camera,
    Edit3,
} from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SosModal } from "@/components/SosModal";
import BookingManager from "@/components/BookingManager";
import { MOROCCAN_HUBS, VEHICLE_FLEET } from "@/lib/morocco-data";
import { trackPurchase } from "@/lib/gtm";
import { buildAffiliateRentalUrl, buildAffiliateEsimUrl } from "@/lib/affiliate";
import { Locale, getTranslation, SUPPORTED_LOCALES, LOCALE_LABELS } from "@/lib/i18n";
import { localizeVehicleName, localizeMeetingPointText } from "@/lib/booking-engine";

const HUB_EXCURSIONS: Record<string, { title: string; duration: string; tag: string; viatorQuery: string }[]> = {
    marrakech: [
        { title: "Coucher de soleil & Dîner féerique dans le Désert d'Agafay", duration: "5 heures", tag: "Incontournable", viatorQuery: "agafay desert dinner sunset" },
        { title: "Excursion Vallée de l'Ourika & Cascades de Setti Fatma (Haut-Atlas)", duration: "1 journée", tag: "Nature & Atlas", viatorQuery: "ourika valley atlas day trip" },
        { title: "Aventure Safari Quad & Balade Dromadaire dans la Palmeraie", duration: "3 heures", tag: "Sensations", viatorQuery: "palmeraie quad camel ride" },
    ],
    agadir: [
        { title: "Piscines naturelles & Randonnée Vallée du Paradis", duration: "Demi-journée", tag: "Nature", viatorQuery: "paradise valley agadir" },
        { title: "Session Surf & Sunset aux Falaises de Taghazout Bay", duration: "4 heures", tag: "Océan", viatorQuery: "taghazout surf day trip" },
        { title: "Safari 4x4 Dunes Sahariennes & Parc National Souss-Massa", duration: "1 journée", tag: "Désert", viatorQuery: "massa desert 4x4 safari" },
    ],
    fes: [
        { title: "Excursion Chefchaouen la Perle Bleue du Rif", duration: "1 journée", tag: "Top Vente", viatorQuery: "chefchaouen day trip fes" },
        { title: "Ruines Romaines de Volubilis & Cité Impériale de Meknès", duration: "1 journée", tag: "Histoire", viatorQuery: "volubilis meknes day trip" },
        { title: "Visite VIP Médina Historique de Fès & Tanneries Chouara", duration: "4 heures", tag: "Culture", viatorQuery: "fes medina guided walking tour" },
    ],
    tanger: [
        { title: "Cap Spartel & Grottes mythiques d'Hercule", duration: "Demi-journée", tag: "Panoramique", viatorQuery: "cap spartel hercules caves" },
        { title: "Excursion Chefchaouen & Montagnes du Rif au départ de Tanger", duration: "1 journée", tag: "Incontournable", viatorQuery: "chefchaouen day trip tangier" },
    ],
    casablanca: [
        { title: "Visite guidée intérieure Mosquée Hassan II & Corniche Aïn Diab", duration: "3 heures", tag: "Chef-d'œuvre", viatorQuery: "hassan ii mosque guided tour" },
        { title: "Excursion d'une journée à Rabat (Tour Hassan & Kasbah des Oudayas)", duration: "1 journée", tag: "Capitale", viatorQuery: "rabat day trip from casablanca" },
    ],
    ouarzazate: [
        { title: "Ksar Aït Benhaddou (Patrimoine UNESCO) & Studios Cinéma Atlas", duration: "Demi-journée", tag: "Cinéma", viatorQuery: "ait benhaddou ouarzazate" },
        { title: "Expédition Gorges du Dadès & Vallée des Roses en 4x4", duration: "1 journée", tag: "Canyon", viatorQuery: "dades gorge todra day trip" },
    ],
};

export default function BookingVoucherPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const ref = (params?.ref as string) || "ZW-78421";

    const [bookingData, setBookingData] = useState<any>(null);
    const [notFound, setNotFound] = useState(false);
    const [liveStatus, setLiveStatus] = useState<string>("confirmed");
    const [kycUploaded, setKycUploaded] = useState(false);
    const [kycUploading, setKycUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [sosModalOpen, setSosModalOpen] = useState(false);
    const [emailResent, setEmailResent] = useState(false);

    // Internationalization state
    const urlLang = searchParams.get("lang") || searchParams.get("locale");
    const [locale, setLocale] = useState<Locale>(
        SUPPORTED_LOCALES.includes(urlLang as Locale) ? (urlLang as Locale) : "fr"
    );
    const t = getTranslation(locale);

    // Flight number edit state
    const [flightNumberInput, setFlightNumberInput] = useState("");
    const [isEditingFlight, setIsEditingFlight] = useState(false);
    const [flightSaved, setFlightSaved] = useState(false);

    const handleResendEmail = async () => {
        if (!bookingData) return;
        try {
            await fetch("/api/booking/send-confirmation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingRef: ref,
                    clientEmail: bookingData.client.email,
                    clientName: bookingData.client.fullName,
                    clientPhone: bookingData.client.phone,
                    vehicleName: bookingData.rental.vehicleName,
                    hubName: bookingData.rental.hubName,
                    airportCode: bookingData.rental.airportCode,
                    meetingPointDetail: bookingData.rental.meetingPointDetail,
                    pickupDate: bookingData.rental.pickupDate,
                    returnDate: bookingData.rental.returnDate,
                    days: bookingData.rental.days,
                    depositAcompteEur: bookingData.financials.depositAcompteEur,
                    balanceOnSiteEur: bookingData.financials.balanceOnSiteEur,
                    balanceOnSiteMad: bookingData.financials.balanceOnSiteMad,
                    hasFranchiseZero: bookingData.financials.selectedUpsells?.some((u: string) =>
                        u.toLowerCase().includes("franchise")
                    ),
                    locale: locale || "fr",
                }),
            });
            setEmailResent(true);
            setTimeout(() => setEmailResent(false), 3000);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        async function fetchRealBooking() {
            const token =
                searchParams.get("t") ||
                (typeof window !== "undefined"
                    ? localStorage.getItem(`zwincar_booking_token_${ref}`)
                    : null);
            const emailParam = searchParams.get("email");

            try {
                const query = token
                    ? `t=${encodeURIComponent(token)}`
                    : emailParam
                    ? `email=${encodeURIComponent(emailParam)}`
                    : "";
                const res = await fetch(`/api/bookings/${ref}${query ? `?${query}` : ""}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data?.voucher) {
                        setBookingData(data.voucher);
                        const effectiveLocale = (data.voucher.locale || data.booking?.locale) as Locale | undefined;
                        if (effectiveLocale && SUPPORTED_LOCALES.includes(effectiveLocale) && !urlLang) {
                            setLocale(effectiveLocale);
                        }
                        if (data.voucher.client?.flightNumber) {
                            setFlightNumberInput(data.voucher.client.flightNumber);
                        }
                        if (data.booking?.status) {
                            setLiveStatus(data.booking.status);
                        }
                        if (data.booking?.kyc?.verified || data.booking?.kyc?.uploadedAt) {
                            setKycUploaded(true);
                        }

                        // Tracking e-commerce GA4 / GTM
                        if (data.booking?.status === "confirmed" || data.booking?.status === "checked_in" || data.booking?.status === "completed") {
                            trackPurchase({
                                transactionId: data.voucher.ref,
                                valueEur: data.voucher.financials?.totalEur || 0,
                                currency: "EUR",
                                vehicleId: data.voucher.rental?.vehicleId || "vehicle",
                                vehicleName: data.voucher.rental?.vehicleName || "Véhicule",
                                acompteEur: data.voucher.financials?.depositAcompteEur || 0,
                                balanceEur: data.voucher.financials?.balanceOnSiteEur || 0,
                                days: data.voucher.rental?.days || 1,
                                pickupHub: data.voucher.rental?.pickupHub || "maroc",
                                hasZeroDeposit: data.voucher.financials?.cautionEur === 0,
                            });
                        }
                        return;
                    }
                }
            } catch {
                // fallback
            }

            // Try reading from localStorage
            try {
                if (typeof window !== "undefined") {
                    const stored = localStorage.getItem(`zwincar_booking_${ref}`);
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        setBookingData(parsed);
                        if (parsed.locale && SUPPORTED_LOCALES.includes(parsed.locale as Locale) && !urlLang) {
                            setLocale(parsed.locale as Locale);
                        }
                        if (parsed.client?.flightNumber) {
                            setFlightNumberInput(parsed.client.flightNumber);
                        }
                        return;
                    }
                }
            } catch {
                // fallback
            }

            setNotFound(true);
        }

        fetchRealBooking();
    }, [ref, searchParams, urlLang]);

    const handleKycUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            // Immediate client-side thumbnail preview
            try {
                const reader = new FileReader();
                reader.onload = () => {
                    setPreviewUrl(reader.result as string);
                };
                reader.readAsDataURL(file);
            } catch {
                // ignore
            }

            setKycUploading(true);
            const token =
                searchParams.get("t") ||
                (typeof window !== "undefined"
                    ? localStorage.getItem(`zwincar_booking_token_${ref}`)
                    : "");

            try {
                await fetch(`/api/bookings/${ref}/kyc`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token: token || undefined,
                        email: bookingData?.client?.email,
                        licenseNumber: "Permis Conforme (Vérification Digitale)",
                        driverAge: 28,
                        licenseFile: file.name,
                    }),
                });
                setKycUploaded(true);
            } catch {
                setKycUploaded(true);
            } finally {
                setKycUploading(false);
            }
        }
    };

    const handleSaveFlightNumber = () => {
        if (!bookingData) return;
        const updated = {
            ...bookingData,
            client: {
                ...bookingData.client,
                flightNumber: flightNumberInput,
            },
        };
        setBookingData(updated);
        try {
            if (typeof window !== "undefined") {
                localStorage.setItem(`zwincar_booking_${ref}`, JSON.stringify(updated));
            }
        } catch {
            // ignore
        }
        setIsEditingFlight(false);
        setFlightSaved(true);
        setTimeout(() => setFlightSaved(false), 2500);
    };

    if (notFound) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between">
                <Header />
                <div className="container mx-auto px-4 max-w-md py-16 text-center">
                    <div className="bg-white rounded-3xl border border-[#ECE5D9] p-8 shadow-sm space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto font-black text-xl">
                            !
                        </div>
                        <h2 className="text-lg font-black text-slate-900">
                            {locale === "en" ? "Booking Reference Not Found" : locale === "es" ? "Reserva no encontrada" : locale === "nl" ? "Boeking niet gevonden" : "Dossier introuvable"}
                        </h2>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            {locale === "en"
                                ? `No booking was found matching reference #${ref}. Please check your confirmation email or enter your booking reference again.`
                                : locale === "es"
                                ? `No se encontró ninguna reserva para la referencia #${ref}. Verifique el código en su correo de confirmación.`
                                : locale === "nl"
                                ? `Geen boeking gevonden voor referentie #${ref}. Controleer uw referentie in uw bevestigingsmail.`
                                : `Aucun dossier trouvé pour la référence #${ref}. Veuillez vérifier la référence reçue dans votre email de confirmation.`}
                        </p>
                        <a
                            href="/"
                            className="inline-block px-5 py-2.5 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-white text-xs font-bold transition shadow-xs"
                        >
                            {locale === "en" ? "Return to homepage" : locale === "es" ? "Volver al inicio" : locale === "nl" ? "Terug naar startpagina" : "Retour à l'accueil"}
                        </a>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!bookingData) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
                <div className="text-slate-500 font-bold text-xs uppercase tracking-wider animate-pulse">
                    {locale === "en"
                        ? "Loading booking voucher..."
                        : locale === "es"
                        ? "Cargando bono de reserva..."
                        : locale === "nl"
                        ? "Boekingsvoucher laden..."
                        : "Chargement du bon de réservation..."}
                </div>
            </div>
        );
    }

    const { client, rental, financials } = bookingData;
    const hasFranchiseZero = financials?.selectedUpsells?.some(
        (u: string) => u.toLowerCase().includes("franchise") || u.toLowerCase().includes("sérénité") || u === "franchise-zero"
    );

    // Pre-filled WhatsApp KYC message localized
    const kycWhatsappMessage =
        locale === "en"
            ? `Hello, here is my driver's license photo for ZwinCar express pick-up booking #${ref} (${rental.vehicleName}) - ${client.fullName}`
            : locale === "es"
            ? `Hola, adjunto la foto de mi permiso de conducir para la entrega exprés de la reserva ZwinCar #${ref} (${rental.vehicleName}) - ${client.fullName}`
            : locale === "nl"
            ? `Hallo, hier is een foto van mijn rijbewijs voor de express afhaling van ZwinCar boeking #${ref} (${rental.vehicleName}) - ${client.fullName}`
            : `Salam, voici la photo de mon permis de conduire pour la remise express réservation ZwinCar #${ref} (${rental.vehicleName}) - ${client.fullName}`;

    // Pre-filled WhatsApp customs message localized
    const customsWhatsappMessage =
        locale === "en"
            ? `Hello Youssef, I am ${client.fullName} (ZwinCar booking #${ref}). I just passed customs at ${rental.hubName} airport. Heading towards the meeting point.`
            : locale === "es"
            ? `Hola Youssef, soy ${client.fullName} (reserva ZwinCar #${ref}). Acabo de cruzar la aduana en el aeropuerto de ${rental.hubName}. Me dirijo al punto de encuentro.`
            : locale === "nl"
            ? `Hallo Youssef, ik ben ${client.fullName} (ZwinCar boeking #${ref}). Ik ben zojuist door de douane gekomen op de luchthaven van ${rental.hubName}. Ik loop nu naar het ontmoetingspunt.`
            : `Salam Youssef, je suis ${client.fullName} (réservation ZwinCar #${ref}). Je viens de franchir la douane à l'aéroport de ${rental.hubName}. Je me dirige vers le point de rencontre.`;

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col font-sans">
            <div className="print:hidden">
                <Header />
            </div>

            <main className="flex-1 pb-20 print:p-0 print:pb-0">
                {/* Top Success Banner with Language Selector */}
                <div className="bg-[#12161E] text-white py-8 border-b border-slate-800 print:hidden">
                    <div className="container mx-auto px-4 max-w-4xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg">
                                <CheckCircle2 size={26} strokeWidth={2.5} />
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-emerald-400">
                                    <span>{t.voucher.confirmedBadge}</span>
                                </div>
                                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                                    {t.voucher.voucherTitle} #{ref}
                                </h1>
                            </div>
                        </div>

                        {/* Language Selector + Download PDF, Print & SOS buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Multilingual Switcher Pill */}
                            <div className="inline-flex items-center bg-white/10 rounded-xl p-0.5 border border-white/10">
                                {SUPPORTED_LOCALES.map((l) => (
                                    <button
                                        key={l}
                                        type="button"
                                        onClick={() => setLocale(l)}
                                        className={`px-2 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                                            locale === l ? "bg-[#C9572C] text-white shadow-xs" : "text-slate-300 hover:text-white"
                                        }`}
                                        title={LOCALE_LABELS[l].name}
                                    >
                                        <span>{LOCALE_LABELS[l].flag}</span>
                                        <span className="uppercase text-[10px]">{l}</span>
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    if (typeof window !== "undefined") window.print();
                                }}
                                className="px-3.5 py-2 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                                title="Download PDF"
                            >
                                <Download size={14} />
                                <span className="hidden sm:inline">{t.voucher.downloadPdf}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (typeof window !== "undefined") window.print();
                                }}
                                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <Printer size={14} />
                                <span className="hidden sm:inline">{t.voucher.print}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSosModalOpen(true)}
                                className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                                <ShieldAlert size={14} />
                                <span>{t.voucher.sosButton}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-4xl mt-8 space-y-6 print:m-0 print:p-0 print:max-w-none">
                    {/* Confirmation Email Notice Banner */}
                    <div className="rounded-2xl bg-white border border-[#E7DFD5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs print:hidden">
                        <div className="flex items-center gap-2.5 text-slate-700">
                            <Mail size={16} className="text-[#C9572C] shrink-0" />
                            <span>
                                {t.voucher.emailSentTo} <strong>{client.email}</strong>
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={handleResendEmail}
                            className="text-[#C9572C] hover:text-[#B24922] font-bold text-xs underline cursor-pointer self-start sm:self-auto"
                        >
                            {emailResent ? t.voucher.resendSuccess : t.voucher.resendEmail}
                        </button>
                    </div>

                    {/* Booking Manager: status, cancel, modify dates */}
                    <div className="print:hidden">
                        <BookingManager refId={ref} locale={locale} />
                    </div>

                    {/* GAMIFIED PROGRESS BAR & FRICTIONLESS KYC ONBOARDING */}
                    <div className="rounded-3xl bg-linear-to-r from-slate-900 to-[#1b2230] text-white p-6 sm:p-7 shadow-xl border border-slate-800 print:hidden relative overflow-hidden">
                        {/* Background subtle ambient effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9572C]/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 space-y-5">
                            {/* Header Row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                <div className="space-y-1">
                                    <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                                        <Sparkles size={14} />
                                        <span>{kycUploaded ? "100% Complété • Clés Prêtes" : t.voucher.progressTitle}</span>
                                    </div>
                                    <h2 className="text-base sm:text-lg font-black text-white">
                                        {kycUploaded
                                            ? t.voucher.kycUploadedSuccess
                                            : t.voucher.progressSubtitle}
                                    </h2>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide ${
                                        kycUploaded
                                            ? "bg-emerald-500 text-white shadow-lg"
                                            : "bg-[#C9572C] text-white animate-pulse"
                                    }`}>
                                        {kycUploaded ? "✓ 100%" : "80%"}
                                    </span>
                                </div>
                            </div>

                            {/* Animated Visual Progress Bar */}
                            <div className="w-full bg-slate-800 rounded-full h-3.5 p-0.5 overflow-hidden border border-slate-700/80">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        kycUploaded
                                            ? "w-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                            : "w-4/5 bg-gradient-to-r from-amber-500 via-[#C9572C] to-emerald-400"
                                    }`}
                                />
                            </div>

                            {/* KYC Content / Dual Frictionless Action */}
                            {!kycUploaded ? (
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                                    <div className="space-y-1">
                                        <div className="text-xs font-bold text-slate-200">
                                            {t.voucher.kycTitle}
                                        </div>
                                        <p className="text-[11px] text-slate-300 leading-relaxed">
                                            {t.voucher.kycDesc}
                                        </p>
                                    </div>

                                    {/* 2 Frictionless Choices: Camera / Upload OR WhatsApp */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                        {/* Option A: 1-Click Camera / Photo Upload */}
                                        <label className="h-12 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 text-center">
                                            <Camera size={16} className="text-[#C9572C] shrink-0" />
                                            <span>{kycUploading ? t.voucher.kycUploading : t.voucher.kycUploadBtn}</span>
                                            <input
                                                type="file"
                                                accept="image/*,application/pdf"
                                                capture="environment"
                                                onChange={handleKycUpload}
                                                className="hidden"
                                                disabled={kycUploading}
                                            />
                                        </label>

                                        {/* Option B: Direct WhatsApp Send */}
                                        <a
                                            href={`https://wa.me/212720794046?text=${encodeURIComponent(kycWhatsappMessage)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setKycUploaded(true)}
                                            className="h-12 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-black transition flex items-center justify-center gap-2 shadow-md active:scale-95 text-center"
                                        >
                                            <MessageCircle size={16} className="shrink-0" />
                                            <span>{t.voucher.kycWhatsappBtn}</span>
                                        </a>
                                    </div>

                                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1">
                                        <Lock size={11} className="shrink-0 text-slate-500" />
                                        <span>{t.voucher.kycPrivacyNote}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-3">
                                        {previewUrl ? (
                                            <div className="w-14 h-14 rounded-xl overflow-hidden border border-emerald-400 shrink-0 relative bg-slate-800">
                                                <img
                                                    src={previewUrl}
                                                    alt="Permis de conduire"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                                                <CheckCircle2 size={20} />
                                            </div>
                                        )}
                                        <div>
                                            <div className="font-bold text-emerald-300 text-xs">
                                                {t.voucher.kycUploadedSuccess}
                                            </div>
                                            <div className="text-[11px] text-slate-300 mt-0.5">
                                                {locale === "en"
                                                    ? "Present your original card for 10 seconds at the parking lot to collect your keys."
                                                    : locale === "es"
                                                    ? "Presente su original durante 10 segundos en el parking para recoger sus llaves."
                                                    : locale === "nl"
                                                    ? "Toon uw origineel gedurende 10 seconden op de parking om uw sleutels te ontvangen."
                                                    : "Présentez simplement votre original 10 secondes au parking pour prendre la route."}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold shrink-0">
                                        ✓ Fast-Track 60s
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Voucher Card */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-6">
                        {/* Status & Barcode Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                    {t.voucher.statusTitle}
                                </span>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mt-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>
                                        {liveStatus === "checked_in"
                                            ? t.voucher.statusCheckedIn
                                            : liveStatus === "completed"
                                            ? t.voucher.statusCompleted
                                            : liveStatus === "cancelled"
                                            ? t.voucher.statusCancelled
                                            : t.voucher.statusGuaranteed}
                                    </span>
                                </div>
                            </div>

                            <div className="text-left sm:text-right">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                    {t.voucher.folderRef}
                                </span>
                                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-wider">
                                    {ref}
                                </span>
                            </div>
                        </div>

                        {/* Vehicle & Hub Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                                <Image
                                    src={rental.vehicleImage}
                                    alt={rental.vehicleName}
                                    width={400}
                                    height={240}
                                    className="w-full h-44 object-cover"
                                />
                                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-wider">
                                    {rental.vehicleCategory}
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                                    {localizeVehicleName(rental.vehicleName, locale)}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                                        <div className="text-[10px] font-bold uppercase text-slate-400">
                                            {t.voucher.pickup}
                                        </div>
                                        <div className="font-bold text-slate-900">
                                            {rental.hubName} — {rental.airportCode}
                                        </div>
                                        <div className="text-slate-500">{rental.pickupDate}</div>
                                    </div>

                                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                                        <div className="text-[10px] font-bold uppercase text-slate-400">
                                            {t.voucher.returnDropoff} ({rental.days} {t.search.daysCount})
                                        </div>
                                        <div className="font-bold text-slate-900">
                                            {rental.hubName} — {rental.airportCode}
                                        </div>
                                        <div className="text-slate-500">{rental.returnDate}</div>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-2.5">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={16} className="text-[#C9572C] shrink-0 mt-0.5" />
                                        <div>
                                            <strong>{t.voucher.meetingPointTitle} </strong>
                                            <span>{localizeMeetingPointText(rental.meetingPointDetail, rental.pickupHub, locale)}</span>
                                        </div>
                                    </div>

                                    {/* 1-Tap Arrival Notification */}
                                    <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            {t.voucher.customsAlertPrompt}
                                        </span>
                                        <a
                                            href={`https://wa.me/212720794046?text=${encodeURIComponent(customsWhatsappMessage)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition cursor-pointer active:scale-95"
                                        >
                                            <MessageCircle size={13} />
                                            <span>{t.voucher.customsAlertBtn}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Split Financial Accounting Breakdown */}
                        <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-5 space-y-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {t.voucher.accountingTitle}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-white border border-[#E7DFD5]">
                                    <div className="text-[10px] font-bold uppercase text-slate-400">
                                        {t.voucher.depositPaidOnline}
                                    </div>
                                    <div className="text-lg font-black text-[#C9572C] font-mono mt-0.5">
                                        {financials.depositAcompteEur} € ({financials.depositAcompteMad} MAD)
                                    </div>
                                    <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                                        {t.voucher.collectedByStripe}
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-white border border-[#E7DFD5]">
                                    <div className="text-[10px] font-bold uppercase text-slate-400">
                                        {t.voucher.balanceDueOnSite}
                                    </div>
                                    <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                                        {financials.balanceOnSiteEur} € (~{financials.balanceOnSiteMad} MAD)
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-1">
                                        {t.voucher.balancePaymentMethods}
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-white border border-[#E7DFD5]">
                                    <div className="text-[10px] font-bold uppercase text-slate-400">
                                        {t.voucher.depositAtDelivery}
                                    </div>
                                    <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                                        {hasFranchiseZero ? "0 €" : "300 €"}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-1">
                                        {hasFranchiseZero
                                            ? t.voucher.depositZeroActive
                                            : t.voucher.depositReturnedAtCheckout}
                                    </div>
                                </div>
                            </div>

                            {financials.selectedUpsells && financials.selectedUpsells.length > 0 && (
                                <div className="pt-2 text-xs text-slate-600 flex items-center gap-2 flex-wrap">
                                    <span className="font-bold text-slate-700">{t.voucher.optionsIncluded}</span>
                                    <span>{financials.selectedUpsells.join(" • ")}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* LIVE FLIGHT TRACKER & RADAR GUARANTEE */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                    <Plane size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                                        {t.voucher.flightTitle}
                                    </h3>
                                    <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                        <span>{t.voucher.flightSubtitle}</span>
                                        <strong>{client.flightNumber || (locale === "en" ? "To be specified" : "À préciser")}</strong>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingFlight(!isEditingFlight)}
                                            className="text-[#C9572C] hover:underline text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                                        >
                                            <Edit3 size={11} />
                                            <span>
                                                {isEditingFlight
                                                    ? (locale === "en" ? "Cancel" : locale === "es" ? "Cancelar" : locale === "nl" ? "Annuleren" : "Annuler")
                                                    : (locale === "en" ? "Edit" : locale === "es" ? "Modificar" : locale === "nl" ? "Wijzigen" : "Modifier")}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {flightSaved && (
                                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in">
                                    {locale === "en" ? "✓ Flight number saved" : locale === "es" ? "✓ Nº de vuelo guardado" : locale === "nl" ? "✓ Vluchtnummer opgeslagen" : "✓ N° de vol enregistré"}
                                </span>
                            )}
                        </div>

                        {isEditingFlight && (
                            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-3">
                                <label className="block text-xs font-bold text-slate-700">
                                    {locale === "en" ? "Enter your flight number (e.g. AF1234, TO4560, FR789):" : locale === "es" ? "Indique su número de vuelo:" : locale === "nl" ? "Vul uw vluchtnummer in:" : "Indiquez votre numéro de vol (ex: AF1234, TO4560, FR789) :"}
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={flightNumberInput}
                                        onChange={(e) => setFlightNumberInput(e.target.value.toUpperCase())}
                                        placeholder="ex: AF1234, TO4560"
                                        className="h-10 px-3.5 rounded-xl bg-white border border-[#E7DFD5] text-xs font-bold text-slate-900 focus:outline-none focus:border-[#C9572C] flex-1 max-w-xs font-mono"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSaveFlightNumber}
                                        className="px-4 py-2 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                                    >
                                        {locale === "en" ? "Save Flight" : locale === "es" ? "Guardar Vuelo" : locale === "nl" ? "Vlucht Opslaan" : "Enregistrer"}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="rounded-2xl bg-blue-50/60 border border-blue-200/80 p-4 space-y-2 text-xs text-blue-950">
                            <div className="flex items-center justify-between font-bold">
                                <span>{t.voucher.flightRadarStatus}</span>
                                <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                                    {t.voucher.flightRadarOnTime}
                                </span>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-[11px]">
                                {t.voucher.flightGuaranteeDesc}
                            </p>
                        </div>
                    </div>

                    {/* CAUTION PROTOCOL CARD (Enveloppe Scellée vs Franchise Zéro) */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900">
                                    {t.voucher.cautionProtocolTitle}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {hasFranchiseZero
                                        ? t.pricingTiers.serenityDesc
                                        : t.pricingTiers.standardDesc}
                                </p>
                            </div>
                        </div>

                        {hasFranchiseZero ? (
                            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-950 font-medium space-y-1">
                                <div className="font-bold flex items-center gap-2 text-emerald-900">
                                    <CheckCircle2 size={16} className="text-emerald-600" />
                                    <span>{t.voucher.cautionZeroDesc}</span>
                                </div>
                                <p className="text-emerald-800 text-[11px] leading-relaxed">
                                    {locale === "en"
                                        ? "Zero credit card block. Key return in under 2 minutes: your local agent inspects the vehicle and you're good to go."
                                        : locale === "es"
                                        ? "Sin retención bancaria. Devolución de llaves en 2 minutos: su agente revisa el coche y listo."
                                        : locale === "nl"
                                        ? "Geen enkele creditcardblokkade. Sleutels inleveren binnen 2 minuten: uw verhuurder controleert de wagen en u kunt direct vertrekken."
                                        : "Aucun dépôt de garantie ne vous sera demandé sur le parking. Restitution en 2 minutes chrono : l'agent reprend simplement les clés."}
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 text-xs text-amber-950 space-y-3">
                                <div className="font-bold text-amber-900">
                                    {t.voucher.cautionStandardDesc}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                                    <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/60">
                                        <p className="text-slate-800 leading-snug">{t.voucher.sealedEnvelope1}</p>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/60">
                                        <p className="text-slate-800 leading-snug">{t.voucher.sealedEnvelope2}</p>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/60">
                                        <p className="text-slate-800 leading-snug">{t.voucher.sealedEnvelope3}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Upsell eSIM Maroc 20 Go 5G */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#C9572C]/10 text-[#C9572C] flex items-center justify-center font-bold">
                                    <Wifi size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                                        {t.voucher.esimTitle}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {t.voucher.esimSubtitle}
                                    </p>
                                </div>
                            </div>

                            {financials.selectedUpsells?.some((u: string) => u.toLowerCase().includes("esim")) ? (
                                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                    {t.voucher.esimActive}
                                </span>
                            ) : null}
                        </div>

                        {financials.selectedUpsells?.some((u: string) => u.toLowerCase().includes("esim")) ? (
                            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3 text-xs">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-28 h-28 bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center shrink-0 shadow-xs">
                                        <QrCode size={92} className="text-slate-900" />
                                    </div>
                                    <div className="space-y-1.5 text-[11px] text-slate-600">
                                        <div className="font-bold text-slate-900 text-xs">
                                            {t.voucher.esimQrTitle}
                                        </div>
                                        <p>
                                            {t.voucher.esimQrDesc}
                                        </p>
                                        <div className="font-mono text-[10px] bg-white px-2 py-1 rounded border border-slate-200 inline-block text-slate-800">
                                            LPA:1$smdp.maroctelecom.ma$ZW-{ref}-ESIM20
                                        </div>
                                        <div className="text-emerald-700 font-semibold">
                                            {locale === "en"
                                                ? "✓ Valid 30 days • Hotspot tethering supported"
                                                : locale === "es"
                                                ? "✓ Válido 30 días • Zona Wi-Fi (Hotspot) permitida"
                                                : locale === "nl"
                                                ? "✓ 30 dagen geldig • Hotspot tethering toegestaan"
                                                : "✓ Valable 30 jours • Partage de connexion (Hotspot) autorisé"}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                                <div>
                                    <div className="font-bold text-slate-900">
                                        {locale === "en" ? "Need mobile data for GPS & WhatsApp in Morocco?" : locale === "es" ? "¿Necesita datos móviles para GPS y WhatsApp?" : locale === "nl" ? "Mobiele data nodig voor GPS & WhatsApp in Marokko?" : "Pas encore de data pour le GPS et WhatsApp au Maroc ?"}
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        {locale === "en" ? "Skip 45-min airport queues. Get your 20 GB 5G eSIM QR code instantly." : locale === "es" ? "Evite 45 min de cola en el aeropuerto. Reciba su QR eSIM 20 GB 5G al instante." : locale === "nl" ? "Vermijd 45 min wachten op de luchthaven. Ontvang direct uw 20 GB 5G eSIM QR-code." : "Évitez les 45 min de queue aux guichets de l'aéroport. Recevez votre QR code eSIM 20 Go 5G instantanément."}
                                    </p>
                                </div>
                                <a
                                    href={`https://wa.me/212720794046?text=${encodeURIComponent(
                                        locale === "en"
                                            ? `Hello, I would like to add the Morocco 20 GB eSIM (€19) to my booking #${ref}`
                                            : locale === "es"
                                            ? `Hola, deseo añadir la eSIM Marruecos 20 GB (19 €) a mi reserva #${ref}`
                                            : locale === "nl"
                                            ? `Hallo, ik wil graag de Marokko 20 GB eSIM (€ 19) toevoegen aan mijn boeking #${ref}`
                                            : `Salam, je souhaite ajouter l'eSIM Maroc 20 Go (19 €) à ma réservation ${ref}`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#C9572C] text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                                >
                                    {locale === "en" ? "Add eSIM (+€19)" : locale === "es" ? "Añadir eSIM (+19 €)" : locale === "nl" ? "eSIM Toevoegen (+€ 19)" : "Ajouter l'eSIM (+19 €)"}
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Booking.com Accommodation Affiliation Card */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900">
                                    {locale === "en"
                                        ? `Recommended Riads & Hotels in ${rental.hubName}`
                                        : locale === "es"
                                        ? `Riads y Hoteles Recomendados en ${rental.hubName}`
                                        : locale === "nl"
                                        ? `Aanbevolen Riads & Hotels in ${rental.hubName}`
                                        : `Riads & Hôtels Recommandés à ${rental.hubName}`}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {locale === "en"
                                        ? `Accommodations with easy car access and 24/7 secured parking for your dates (${rental.pickupDate} to ${rental.returnDate})`
                                        : locale === "es"
                                        ? `Alojamientos con fácil acceso en coche y parking vigilado 24/7 (${rental.pickupDate} al ${rental.returnDate})`
                                        : locale === "nl"
                                        ? `Accommodaties met gemakkelijke toegang en 24/7 beveiligde parkeergelegenheid (${rental.pickupDate} tot ${rental.returnDate})`
                                        : `Établissements avec accès voiture facile et parking gardé 24/7 pour vos dates (${rental.pickupDate} au ${rental.returnDate})`}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                            <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold text-[#C9572C] tracking-wider">
                                    {locale === "en" ? "ZwinCar Accommodation Partner" : locale === "es" ? "Socio de Alojamiento ZwinCar" : locale === "nl" ? "ZwinCar Verblijfspartner" : "Partenaire Hébergement ZwinCar"}
                                </span>
                                <div className="font-black text-slate-900 text-sm">
                                    {locale === "en" ? `Find your ideal stay in ${rental.hubName}` : locale === "es" ? `Encuentre su estancia ideal en ${rental.hubName}` : locale === "nl" ? `Vind uw ideale verblijf in ${rental.hubName}` : `Trouvez votre hébergement idéal à ${rental.hubName}`}
                                </div>
                                <p className="text-[11px] text-slate-600 max-w-lg leading-relaxed">
                                    {locale === "en"
                                        ? "Keep your rental car safe. Discover our curated selection of partner Riads and hotels featuring verified secured parking."
                                        : locale === "es"
                                        ? "Mantenga su coche seguro. Descubra nuestra selección de Riads y hoteles asociados con aparcamiento vigilado."
                                        : locale === "nl"
                                        ? "Laat uw huurauto veilig achter. Bekijk onze selectie partner-riads en hotels met beveiligde parkeergelegenheid."
                                        : "Ne laissez pas votre voiture sans surveillance dans les ruelles étroites. Découvrez notre sélection de Riads et Hôtels partenaires équipés d'un stationnement sécurisé vérifié."}
                                </p>
                            </div>

                            <a
                                href={`https://www.booking.com/searchresults.${locale === "en" ? "en-gb" : locale === "es" ? "es" : locale === "nl" ? "nl" : "fr"}.html?ss=${encodeURIComponent(
                                    rental.hubName + ", Maroc"
                                )}&checkin=${rental.pickupDate}&checkout=${rental.returnDate}&aid=zwincar`}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
                            >
                                <span>{locale === "en" ? "View Riads with Parking" : locale === "es" ? "Ver Riads con Parking" : locale === "nl" ? "Bekijk Riads met Parking" : "Voir les Riads avec Parking"}</span>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Excursions & Activities Hub (Viator Affiliation) */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                                <Compass size={20} />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900">
                                    {locale === "en"
                                        ? `Must-Do Excursions & Activities in ${rental.hubName}`
                                        : locale === "es"
                                        ? `Excursiones y Actividades Imprescindibles en ${rental.hubName}`
                                        : locale === "nl"
                                        ? `Top Excursies & Activiteiten in ${rental.hubName}`
                                        : `Excursions & Activités Incontournables à ${rental.hubName}`}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {locale === "en"
                                        ? `Handpicked certified experiences departing from ${rental.hubName} with free cancellation`
                                        : locale === "es"
                                        ? `Selección de actividades verificadas desde ${rental.hubName} con cancelación gratuita`
                                        : locale === "nl"
                                        ? `Geverifieerde activiteiten met vertrek vanuit ${rental.hubName} met gratis annuleren`
                                        : `Sélection d'activités vérifiées au départ de ${rental.hubName} avec guides certifiés et annulation gratuite`}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            {(HUB_EXCURSIONS[rental.pickupHub] || HUB_EXCURSIONS.marrakech).map((item, idx) => (
                                <a
                                    key={idx}
                                    href={`https://www.viator.com/search/${encodeURIComponent(item.viatorQuery)}?pid=zwincar&mcid=42383`}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] hover:border-[#C9572C] transition-all flex flex-col justify-between group cursor-pointer"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9572C] bg-[#C9572C]/10 px-2 py-0.5 rounded-full">
                                                {item.tag}
                                            </span>
                                            <span className="text-[11px] text-slate-400 font-mono">
                                                {item.duration}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#C9572C] transition-colors leading-snug">
                                            {item.title}
                                        </h4>
                                    </div>
                                    <div className="pt-3 mt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-bold text-slate-700 group-hover:text-[#C9572C]">
                                        <span>
                                            {locale === "en" ? "Book on Viator" : locale === "es" ? "Reservar en Viator" : locale === "nl" ? "Boeken op Viator" : "Réserver sur Viator"}
                                        </span>
                                        <ExternalLink size={12} />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Dedicated Local Coordinator Card */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-sm shadow-md">
                                    YB
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">
                                        {locale === "en" ? "Your Dedicated Local Coordinator" : locale === "es" ? "Su Coordinador Local Dedicado" : locale === "nl" ? "Uw Lokale Contactpersoon" : "Votre Contact Dédié sur Place"}
                                    </div>
                                    <h4 className="text-base font-black text-slate-900">
                                        Youssef — {locale === "en" ? `Fleet Manager ${rental.hubName}` : locale === "es" ? `Responsable de Flota ${rental.hubName}` : locale === "nl" ? `Vlootbeheerder ${rental.hubName}` : `Responsable Flotte ${rental.hubName}`}
                                    </h4>
                                    <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span>{locale === "en" ? "Waiting at Parking P2" : locale === "es" ? "Esperando en Parking P2" : locale === "nl" ? "Wachtend op Parking P2" : "En attente au Parking P2"}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <a
                                    href={`https://wa.me/212720794046?text=${encodeURIComponent(
                                        locale === "en"
                                            ? `Hello Youssef, I am the customer for booking #${ref} (${rental.vehicleName}). Confirming arrival on flight ${client.flightNumber}.`
                                            : locale === "es"
                                            ? `Hola Youssef, soy el cliente de la reserva #${ref} (${rental.vehicleName}). Confirmo mi llegada en el vuelo ${client.flightNumber}.`
                                            : locale === "nl"
                                            ? `Hallo Youssef, ik ben de klant van boeking #${ref} (${rental.vehicleName}). Ik bevestig mijn aankomst met vlucht ${client.flightNumber}.`
                                            : `Bonjour Youssef, je suis le client du dossier ${ref} (${rental.vehicleName}). Je confirme mon arrivée sur le vol ${client.flightNumber}.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
                                >
                                    <MessageCircle size={15} />
                                    <span>WhatsApp Direct</span>
                                </a>

                                <a
                                    href="tel:+212720794046"
                                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition flex items-center gap-2"
                                >
                                    <Phone size={15} />
                                    <span>{locale === "en" ? "Call" : locale === "es" ? "Llamar" : locale === "nl" ? "Bellen" : "Appeler"}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <SosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
        </div>
    );
}
