"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Search, FileText, Mail, ArrowRight, CheckCircle2, AlertCircle, Clock, Car } from "lucide-react";
import { Locale } from "@/lib/i18n";

interface BookingLookupModalProps {
    isOpen: boolean;
    onClose: () => void;
    locale?: Locale;
}

const LOOKUP_I18N = {
    fr: {
        badge: "Espace Client ZwinCar",
        title: "Retrouver mon Bon de Réservation",
        cachedTitle: "Réservation active sur cet appareil",
        cachedBtn: "Voir mon bon →",
        tabRef: "Par Numéro de Dossier",
        tabEmail: "Par Adresse Email",
        refLabel: "Référence de dossier (ZW-XXXXXX) *",
        refPlaceholder: "Ex: ZW-48210",
        emailLabel: "Email du conducteur principal",
        emailPlaceholder: "nom@exemple.com",
        emailSearchLabel: "Votre adresse email utilisée lors de la réservation *",
        submitBtn: "Accéder à mon bon de réservation",
        searching: "Recherche en cours...",
        bookingsFound: "Réservations trouvées",
        openBtn: "Ouvrir →",
        promptEmail: (masked: string) => `Pour afficher ce bon, veuillez renseigner l'adresse email associée (${masked}).`,
    },
    en: {
        badge: "ZwinCar Customer Portal",
        title: "Find My Booking Voucher",
        cachedTitle: "Active booking on this device",
        cachedBtn: "View my voucher →",
        tabRef: "By Booking Reference",
        tabEmail: "By Email Address",
        refLabel: "Booking reference (ZW-XXXXXX) *",
        refPlaceholder: "e.g. ZW-48210",
        emailLabel: "Main driver's email address",
        emailPlaceholder: "name@example.com",
        emailSearchLabel: "Email address used during booking *",
        submitBtn: "Access my booking voucher",
        searching: "Searching...",
        bookingsFound: "Bookings found",
        openBtn: "View →",
        promptEmail: (masked: string) => `To open this voucher, please enter the associated email address (${masked}).`,
    },
    es: {
        badge: "Portal del Cliente ZwinCar",
        title: "Buscar mi Bono de Reserva",
        cachedTitle: "Reserva activa en este dispositivo",
        cachedBtn: "Ver mi bono →",
        tabRef: "Por Número de Reserva",
        tabEmail: "Por Correo Electrónico",
        refLabel: "Referencia de reserva (ZW-XXXXXX) *",
        refPlaceholder: "Ej: ZW-48210",
        emailLabel: "Email del conductor principal",
        emailPlaceholder: "nombre@ejemplo.com",
        emailSearchLabel: "Correo electrónico usado en la reserva *",
        submitBtn: "Acceder a mi bono de reserva",
        searching: "Buscando...",
        bookingsFound: "Reservas encontradas",
        openBtn: "Abrir →",
        promptEmail: (masked: string) => `Para abrir este bono, introduzca el correo electrónico asociado (${masked}).`,
    },
    nl: {
        badge: "ZwinCar Klantportaal",
        title: "Mijn Boekingsvoucher Opzoeken",
        cachedTitle: "Actieve boeking op dit apparaat",
        cachedBtn: "Bekijk voucher →",
        tabRef: "Op Boekingsnummer",
        tabEmail: "Op E-mailadres",
        refLabel: "Boekingsreferentie (ZW-XXXXXX) *",
        refPlaceholder: "Bijv: ZW-48210",
        emailLabel: "E-mailadres van de hoofdbestuurder",
        emailPlaceholder: "naam@voorbeeld.nl",
        emailSearchLabel: "E-mailadres gebruikt bij uw boeking *",
        submitBtn: "Open mijn boekingsvoucher",
        searching: "Zoeken...",
        bookingsFound: "Gevonden boekingen",
        openBtn: "Openen →",
        promptEmail: (masked: string) => `Vul het bijbehorende e-mailadres in om de voucher te openen (${masked}).`,
    },
};

export function BookingLookupModal({ isOpen, onClose, locale = "fr" }: BookingLookupModalProps) {
    const router = useRouter();
    const t = LOOKUP_I18N[locale] || LOOKUP_I18N.fr;
    const [searchType, setSearchType] = useState<"ref" | "email">("ref");
    const [refInput, setRefInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [cachedRef, setCachedRef] = useState<string | null>(null);
    const [cachedToken, setCachedToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [searchResults, setSearchResults] = useState<any[] | null>(null);

    useEffect(() => {
        if (!isOpen) return;
        try {
            const lastRef = localStorage.getItem("zwincar_last_booking_ref");
            if (lastRef) {
                setCachedRef(lastRef);
                const lastToken = localStorage.getItem(`zwincar_booking_token_${lastRef}`);
                setCachedToken(lastToken);
                setRefInput(lastRef);
            }
        } catch {
            // ignore
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleLookup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);
        setSearchResults(null);

        try {
            const res = await fetch("/api/bookings/lookup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ref: searchType === "ref" ? refInput.trim().toUpperCase() : undefined,
                    email: emailInput.trim().toLowerCase() || undefined,
                }),
            });

            const data = await res.json();
            setIsLoading(false);

            if (!res.ok) {
                setErrorMessage(data?.error || "Dossier introuvable. Vérifiez les informations saisies.");
                return;
            }

            // Cas 1 : Redirection directe si le voucher URL est retourné
            if (data.url) {
                onClose();
                router.push(data.url);
                return;
            }

            // Cas 2 : Demande d'email pour valider la référence (anti-énumération)
            if (data.requiresEmail) {
                setErrorMessage(t.promptEmail(data.maskedEmail));
                return;
            }

            // Cas 3 : Liste de réservations trouvées par email
            if (data.bookings && Array.isArray(data.bookings)) {
                setSearchResults(data.bookings);
            }
        } catch {
            setIsLoading(false);
            setErrorMessage("Erreur de connexion. Veuillez réessayer.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="bg-[#12161E] text-white p-5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#C9572C] flex items-center justify-center text-white">
                            <FileText size={18} />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                {t.badge}
                            </div>
                            <h3 className="font-bold text-base text-white">
                                {t.title}
                            </h3>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Auto-detected booking on this device */}
                    {cachedRef && (
                        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2.5 text-emerald-900">
                                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                                <div>
                                    <span className="font-bold block">{t.cachedTitle}</span>
                                    <span className="text-[11px] text-emerald-700 font-mono">{cachedRef}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    onClose();
                                    router.push(`/booking/${cachedRef}${cachedToken ? `?t=${cachedToken}` : ""}`);
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer shrink-0 active:scale-95"
                            >
                                {t.cachedBtn}
                            </button>
                        </div>
                    )}

                    {/* Search Type Tabs */}
                    <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
                        <button
                            type="button"
                            onClick={() => {
                                setSearchType("ref");
                                setErrorMessage(null);
                                setSearchResults(null);
                            }}
                            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                                searchType === "ref" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
                            }`}
                        >
                            {t.tabRef}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchType("email");
                                setErrorMessage(null);
                                setSearchResults(null);
                            }}
                            className={`flex-1 py-2 rounded-lg transition cursor-pointer ${
                                searchType === "email" ? "bg-white text-slate-900 shadow-xs" : "hover:text-slate-900"
                            }`}
                        >
                            {t.tabEmail}
                        </button>
                    </div>

                    <form onSubmit={handleLookup} className="space-y-3.5">
                        {searchType === "ref" ? (
                            <>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        {t.refLabel}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            required
                                            value={refInput}
                                            onChange={(e) => setRefInput(e.target.value.toUpperCase())}
                                            placeholder={t.refPlaceholder}
                                            className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                        />
                                        <Search size={15} className="absolute left-3 top-3.5 text-slate-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        {t.emailLabel}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={emailInput}
                                            onChange={(e) => setEmailInput(e.target.value)}
                                            placeholder={t.emailPlaceholder}
                                            className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                        />
                                        <Mail size={15} className="absolute left-3 top-3.5 text-slate-400" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    {t.emailSearchLabel}
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        value={emailInput}
                                        onChange={(e) => setEmailInput(e.target.value)}
                                        placeholder={t.emailPlaceholder}
                                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                    <Mail size={15} className="absolute left-3 top-3.5 text-slate-400" />
                                </div>
                            </div>
                        )}

                        {errorMessage && (
                            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
                                <AlertCircle size={15} className="text-amber-600 shrink-0 mt-0.5" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* List of bookings found by email */}
                        {searchResults && searchResults.length > 0 && (
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <span className="text-xs font-bold text-slate-700 block">
                                    {t.bookingsFound} ({searchResults.length}) :
                                </span>
                                {searchResults.map((b) => (
                                    <div
                                        key={b.ref}
                                        className="rounded-2xl border border-slate-200 p-3.5 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                                    >
                                        <div>
                                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                                <Car size={14} className="text-[#C9572C]" />
                                                <span>{b.vehicleName}</span>
                                                <span className="font-mono text-[11px] text-slate-500">({b.ref})</span>
                                            </div>
                                            <div className="text-[11px] text-slate-500 mt-0.5">
                                                {b.hubName} • du {b.pickupDate} au {b.returnDate}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onClose();
                                                router.push(b.url);
                                            }}
                                            className="px-3 py-1.5 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-white text-xs font-bold transition shrink-0 cursor-pointer"
                                        >
                                            {t.openBtn}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 rounded-2xl bg-[#12161E] hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-[0.98] disabled:opacity-50"
                        >
                            {isLoading ? (
                                <span>{t.searching}</span>
                            ) : (
                                <>
                                    <span>{t.submitBtn}</span>
                                    <ArrowRight size={15} />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
