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
    ArrowRight,
    Sparkles,
} from "lucide-react";
import { VehicleModel, CityHub, MOROCCAN_HUBS } from "@/lib/morocco-data";

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
}: BookingCheckoutModalProps) {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [flightNumber, setFlightNumber] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const currentHub =
        MOROCCAN_HUBS.find((h) => h.slug === pickupHubSlug) || MOROCCAN_HUBS[0];
    const hasFranchiseZero = selectedUpsells.includes("franchise-zero");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Generate high-entropy booking reference
        const bookingRef = `ZW-${Math.floor(10000 + Math.random() * 90000)}`;

        // Save booking data into localStorage for /booking/[ref]
        const bookingPayload = {
            ref: bookingRef,
            createdAt: new Date().toISOString(),
            client: {
                fullName: fullName || "Voyageur ZwinCar",
                phone: phone || "+33 6 00 00 00 00",
                email: email || "contact@voyageur.com",
                flightNumber: flightNumber || "À préciser",
                notes: notes,
            },
            rental: {
                vehicleId: vehicle.id,
                vehicleName: vehicle.name,
                vehicleCategory: vehicle.category,
                vehicleImage: vehicle.image,
                pickupHub: currentHub.slug,
                hubName: currentHub.name,
                airportName: currentHub.airportName,
                airportCode: currentHub.airportCode,
                meetingPointDetail: currentHub.meetingPointDetail,
                pickupDate,
                returnDate,
                days,
                fuelPolicy: vehicle.fuelPolicy,
                depositPolicy: vehicle.depositPolicy,
            },
            financials: {
                currency,
                dailyPriceEur: vehicle.dailyPriceEur,
                dailyPriceMad: vehicle.dailyPriceMad,
                vendorUpsellsEur,
                vendorUpsellsMad,
                platformUpsellsEur,
                platformUpsellsMad,
                depositAcompteEur,
                depositAcompteMad,
                balanceOnSiteEur,
                balanceOnSiteMad,
                selectedUpsells,
            },
            status: "confirmed",
            kycStatus: "pending",
        };

        try {
            if (typeof window !== "undefined") {
                localStorage.setItem(`zwincar_booking_${bookingRef}`, JSON.stringify(bookingPayload));
                localStorage.setItem("zwincar_last_booking_ref", bookingRef);
            }
        } catch {
            // storage quota fallback
        }

        // 1. Send confirmation email asynchronously
        try {
            fetch("/api/booking/send-confirmation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingRef,
                    clientEmail: email || "contact@voyageur.com",
                    clientName: fullName || "Voyageur",
                    clientPhone: phone,
                    vehicleName: vehicle.name,
                    hubName: currentHub.name,
                    airportCode: currentHub.airportCode,
                    meetingPointDetail: currentHub.meetingPointDetail,
                    pickupDate,
                    returnDate,
                    days,
                    depositAcompteEur,
                    balanceOnSiteEur,
                    balanceOnSiteMad,
                    hasFranchiseZero,
                }),
            }).catch(() => {});
        } catch {
            // ignore
        }

        // 2. Call Stripe Checkout API
        try {
            const res = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingRef,
                    amountEur: depositAcompteEur,
                    vehicleName: vehicle.name,
                    hubName: currentHub.name,
                    customerEmail: email,
                    customerName: fullName,
                    days,
                    pickupDate,
                    returnDate,
                }),
            });

            const data = await res.json();
            setIsSubmitting(false);
            onClose();

            if (data?.url) {
                if (data.url.startsWith("http")) {
                    window.location.href = data.url;
                } else {
                    router.push(data.url);
                }
            } else {
                router.push(`/booking/${bookingRef}`);
            }
        } catch {
            setIsSubmitting(false);
            onClose();
            router.push(`/booking/${bookingRef}`);
        }
    };

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
                                Réservation Sécurisée & Modèle Garanti
                            </div>
                            <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                                {vehicle.name} — {currentHub.name} ({days} jours)
                            </h3>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                        aria-label="Fermer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Caution & Conditions Claires */}
                <div className="bg-[#FAF7F2] px-5 py-2.5 border-b border-[#ECE5D9] flex items-center justify-between text-xs text-slate-700">
                    <span className="font-semibold">
                        Caution : <strong className="text-slate-900">{hasFranchiseZero ? "0 € (Franchise Zéro)" : "300 € (ou 0 € avec Franchise Zéro)"}</strong>
                    </span>
                    <span className="text-[11px] text-slate-500">Cartes de débit & espèces acceptées</span>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Recap Row */}
                    <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-3.5 grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">
                                Prise en charge
                            </span>
                            <span className="font-bold text-slate-900 block truncate">
                                {currentHub.airportName} ({currentHub.airportCode})
                            </span>
                            <span className="text-[11px] text-slate-500">{pickupDate}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 text-[10px] uppercase font-bold block">
                                Restitution
                            </span>
                            <span className="font-bold text-slate-900 block truncate">
                                Même aéroport / Riad
                            </span>
                            <span className="text-[11px] text-slate-500">{returnDate} ({days} j)</span>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-3.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    Nom & Prénom *
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        placeholder="ex: Thomas Martin"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                    <User size={15} className="absolute left-3 top-3 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    WhatsApp / Téléphone *
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+33 6 12 34 56 78"
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
                                    Email de confirmation *
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        required
                                        placeholder="thomas@exemple.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full h-11 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                    <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    N° de Vol (Suivi de retard)
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="ex: TO3040 / FR2104"
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
                                Demandes particulières (Optionnel)
                            </label>
                            <input
                                type="text"
                                placeholder="ex: Livraison directe Riad Médina, heure d'atterrissage tardive..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#C9572C]"
                            />
                        </div>
                    </div>

                    {/* Financial Split Box */}
                    <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 space-y-2 text-xs">
                        <div className="flex justify-between items-center text-slate-700">
                            <span>Acompte à régler aujourd'hui (Stripe) :</span>
                            <span className="text-base font-black text-[#C9572C] font-mono">
                                {currency === "EUR" ? `${depositAcompteEur} €` : `${depositAcompteMad} MAD`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500 text-[11px]">
                            <span>Solde à payer à l'agence (remise des clés) :</span>
                            <span className="font-bold text-slate-900 font-mono">
                                {currency === "EUR" ? `${balanceOnSiteEur} €` : `${balanceOnSiteMad} MAD`} (~{balanceOnSiteMad} DH)
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500 text-[11px] pt-1 border-t border-slate-200/80">
                            <span>Caution à la prise en charge :</span>
                            <span className="font-bold text-slate-900 font-mono">
                                {hasFranchiseZero ? "0 € (Franchise Zéro active)" : "300 € (restituée à la remise des clés)"}
                            </span>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="space-y-2.5 pt-1">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-13 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white font-black text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <span>Génération du Voucher...</span>
                            ) : (
                                <>
                                    <Sparkles size={16} />
                                    <span>
                                        Confirmer & Générer mon Voucher • Acompte {currency === "EUR" ? `${depositAcompteEur} €` : `${depositAcompteMad} MAD`}
                                    </span>
                                </>
                            )}
                        </button>
                        <div className="text-center text-[10px] text-slate-400">
                            Annulation gratuite jusqu'à 48h avant l'atterrissage • Données chiffrées SSL 256 bits
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
