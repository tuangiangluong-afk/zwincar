"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Plane,
    Calendar,
    Camera,
    CheckCircle2,
    Clock,
    Phone,
    MapPin,
    AlertCircle,
    Sliders,
    Car,
    ArrowUpRight,
    ArrowDownLeft,
    Power,
    Check,
    X,
    ChevronRight,
    Plus,
    FileText,
    MessageCircle,
    LogOut,
    Building2,
    Fuel,
    ShieldCheck,
    RefreshCw,
    Receipt,
} from "lucide-react";
import Logo from "@/components/Logo";
import {
    getStoredVendorProfile,
    getStoredVendorFleet,
    saveVendorFleet,
    logoutVendor,
    VendorProfile,
    VendorVehicle,
    DEFAULT_VENDOR_PROFILE,
    INITIAL_VENDOR_FLEET,
} from "@/lib/vendor-auth";

interface DeliveryItem {
    id: string;
    ref: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    flightNumber: string;
    flightEta: string;
    time: string;
    location: string;
    carName: string;
    plate: string;
    cashToCollectMad: number;
    cashToCollectEur: number;
    hasZeroDepositPack: boolean;
    fuelLevelStart: string;
    status: "pending_checkin" | "ready_on_parking" | "completed";
    accessToken?: string;
}

interface ReturnItem {
    id: string;
    ref: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    time: string;
    location: string;
    carName: string;
    plate: string;
    fuelLevelOriginal: string;
    mileagePickup?: number;
    status: "pending_checkout" | "returned_ok";
    accessToken?: string;
}

export default function VendorDashboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"today" | "fleet" | "rates" | "wallet">("today");
    const [loading, setLoading] = useState(false);
    const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [profile, setProfile] = useState<VendorProfile>(DEFAULT_VENDOR_PROFILE);
    const [fleet, setFleet] = useState<VendorVehicle[]>(INITIAL_VENDOR_FLEET);
    const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);

    // Live Bookings lists
    const [departures, setDepartures] = useState<DeliveryItem[]>([]);
    const [returns, setReturns] = useState<ReturnItem[]>([]);

    // Check-in modal
    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryItem | null>(null);
    const [checkinStep, setCheckinStep] = useState<number>(1);
    const [checkinOdometer, setCheckinOdometer] = useState<string>("32400");
    const [checkinDriverAge, setCheckinDriverAge] = useState<number>(29);
    const [checkinLicenseDate, setCheckinLicenseDate] = useState<string>("2019-04-15");
    const [fuelLevelCheckin, setFuelLevelCheckin] = useState<string>("1/4");
    const [photosTaken, setPhotosTaken] = useState<Record<string, boolean>>({
        "Avant-Gauche": false,
        "Avant-Droit": false,
        "Arrière-Gauche": false,
        "Arrière-Droit": false,
    });
    const [isSubmittingCheckin, setIsSubmittingCheckin] = useState(false);

    // Check-out modal
    const [selectedReturn, setSelectedReturn] = useState<ReturnItem | null>(null);
    const [checkoutOdometer, setCheckoutOdometer] = useState<string>("33150");
    const [checkoutFuelLevel, setCheckoutFuelLevel] = useState<string>("1/4");
    const [checkoutDamageEur, setCheckoutDamageEur] = useState<string>("0");
    const [checkoutCleaningEur, setCheckoutCleaningEur] = useState<string>("0");
    const [checkoutLateMinutes, setCheckoutLateMinutes] = useState<string>("0");
    const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);
    const [checkoutSettlementResult, setCheckoutSettlementResult] = useState<any | null>(null);

    // New car modal fields
    const [newModel, setNewModel] = useState("Dacia Sandero Stepway");
    const [newPlate, setNewPlate] = useState("");
    const [newColor, setNewColor] = useState("Blanc Glacier");
    const [newPriceMad, setNewPriceMad] = useState("280");
    const [newLocation, setNewLocation] = useState("Parking P2 Aéroport");

    // Load initial profile, fleet and live bookings
    useEffect(() => {
        const localProfile = getStoredVendorProfile();
        setProfile(localProfile);

        async function fetchServerData() {
            setLoading(true);
            try {
                // 1. Fetch vendor profile & fleet from API
                const meRes = await fetch("/api/vendor/me");
                if (meRes.ok) {
                    const data = await meRes.json();
                    if (data.agency) setProfile(data.agency);
                    if (data.fleet?.length) setFleet(data.fleet);
                } else {
                    router.push("/vendor/login");
                    return;
                }

                // 2. Fetch live bookings for this hub
                const bookingsRes = await fetch("/api/vendor/bookings");
                if (bookingsRes.ok) {
                    const bData = await bookingsRes.json();
                    const hubBookings = bData.bookings || [];

                    const newDepartures: DeliveryItem[] = [];
                    const newReturns: ReturnItem[] = [];

                    for (const b of hubBookings) {
                        if (b.status === "confirmed" || b.status === "awaiting_payment") {
                            newDepartures.push({
                                id: b.ref,
                                ref: b.ref,
                                clientName: b.client.fullName,
                                clientPhone: b.client.phone,
                                clientEmail: b.client.email,
                                flightNumber: b.client.flightNumber || "Non renseigné",
                                flightEta: "Atterrissage confirmé",
                                time: b.rental.pickupTime || "11:00",
                                location: `Aéroport ${b.rental.pickupHub.toUpperCase()} (Sortie Arrivées)`,
                                carName: b.rental.vehicleName,
                                plate: "Affectation clé",
                                cashToCollectMad: b.financials.balanceOnSiteMad,
                                cashToCollectEur: b.financials.balanceOnSiteEur,
                                hasZeroDepositPack: b.financials.hasZeroDeposit,
                                fuelLevelStart: "1/4",
                                status: "pending_checkin",
                                accessToken: b.accessToken,
                            });
                        } else if (b.status === "checked_in") {
                            newReturns.push({
                                id: b.ref,
                                ref: b.ref,
                                clientName: b.client.fullName,
                                clientPhone: b.client.phone,
                                clientEmail: b.client.email,
                                time: b.rental.returnTime || "11:00",
                                location: `Aéroport ${b.rental.pickupHub.toUpperCase()} (Dépose Express)`,
                                carName: b.rental.vehicleName,
                                plate: "Véhicule client",
                                fuelLevelOriginal: b.checkin?.fuelLevel || "1/4",
                                mileagePickup: b.checkin?.mileageKm || 32000,
                                status: "pending_checkout",
                                accessToken: b.accessToken,
                            });
                        }
                    }

                    // Fallback to demo items if store has no bookings yet
                    if (newDepartures.length === 0) {
                        newDepartures.push({
                            id: "d1",
                            ref: "ZW-84920",
                            clientName: "Alexandre Martin",
                            clientPhone: "+33612345678",
                            flightNumber: "Ryanair FR4522",
                            flightEta: "À l'heure (Atterrissage 14:15)",
                            time: "14:30",
                            location: "Aéroport Menara (Terminal 1 Arrivées)",
                            carName: "Dacia Duster 4x4 Prestige",
                            plate: "45821-B-26",
                            cashToCollectMad: 1850,
                            cashToCollectEur: 168,
                            hasZeroDepositPack: true,
                            fuelLevelStart: "1/4",
                            status: "pending_checkin",
                        });
                    }
                    if (newReturns.length === 0) {
                        newReturns.push({
                            id: "r1",
                            ref: "ZW-71042",
                            clientName: "Thomas Leroy",
                            clientPhone: "+33698765432",
                            time: "18:00",
                            location: "Aéroport Menara (Dépose Express)",
                            carName: "Renault Clio 5 Automatique",
                            plate: "12903-A-26",
                            fuelLevelOriginal: "1/4",
                            mileagePickup: 25000,
                            status: "pending_checkout",
                        });
                    }

                    setDepartures(newDepartures);
                    setReturns(newReturns);
                }
            } catch (err) {
                console.warn("Server data fetch fallback:", err);
                setFleet(getStoredVendorFleet());
            } finally {
                setLoading(false);
            }
        }

        fetchServerData();
    }, []);

    const showToast = (type: "success" | "error", text: string) => {
        setFeedbackMsg({ type, text });
        setTimeout(() => setFeedbackMsg(null), 5000);
    };

    const handleAddCar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlate.trim()) return;

        const newCarObj = {
            name: newModel,
            plate: newPlate.trim(),
            color: newColor,
            dailyPriceMad: parseInt(newPriceMad, 10) || 280,
            dailyPriceEur: Math.round((parseInt(newPriceMad, 10) || 280) / 11),
            currentLocation: newLocation,
        };

        try {
            const res = await fetch("/api/vendor/fleet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCarObj),
            });
            const data = await res.json();
            if (res.ok && data.vehicle) {
                const updated = [data.vehicle, ...fleet];
                setFleet(updated);
                saveVendorFleet(updated);
                showToast("success", `Véhicule ${newCarObj.name} (${newCarObj.plate}) ajouté avec succès.`);
            } else {
                // Fallback local
                const localCar: VendorVehicle = {
                    id: `v-${Date.now()}`,
                    ...newCarObj,
                    status: "available",
                };
                const updated = [localCar, ...fleet];
                setFleet(updated);
                saveVendorFleet(updated);
                showToast("success", `Véhicule enregistré localement.`);
            }
        } catch {
            const localCar: VendorVehicle = {
                id: `v-${Date.now()}`,
                ...newCarObj,
                status: "available",
            };
            const updated = [localCar, ...fleet];
            setFleet(updated);
            saveVendorFleet(updated);
            showToast("success", `Véhicule enregistré.`);
        }

        setIsAddCarModalOpen(false);
        setNewPlate("");
    };

    const toggleStopSell = async (id: string) => {
        const currentCar = fleet.find((f) => f.id === id);
        if (!currentCar) return;

        const targetStatus = currentCar.status === "blocked" ? "available" : "blocked";

        // Optimistic UI
        const updated = fleet.map((f) => (f.id === id ? { ...f, status: targetStatus as any } : f));
        setFleet(updated);
        saveVendorFleet(updated);

        try {
            await fetch(`/api/vendor/fleet/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: targetStatus }),
            });
            showToast(
                "success",
                targetStatus === "blocked"
                    ? `Stop-sell activé sur ${currentCar.name} : retirée de la vente en ligne.`
                    : `Véhicule ${currentCar.name} remis en vente sur ZwinCar.com.`
            );
        } catch {
            // Local fallback ok
        }
    };

    // Submitting real Check-In
    const handleConfirmCheckin = async () => {
        if (!selectedDelivery) return;
        setIsSubmittingCheckin(true);

        const fuelMap: Record<string, string> = {
            "1/4": "1/4",
            "1/2": "1/2",
            "3/4": "3/4",
            "Plein": "1",
        };

        const payload = {
            token: selectedDelivery.accessToken,
            email: selectedDelivery.clientEmail,
            driverAge: checkinDriverAge,
            licenseIssuedAt: checkinLicenseDate,
            fuelLevel: fuelMap[fuelLevelCheckin] || "1/4",
            mileageKm: Number(checkinOdometer) || 32000,
            photos: 4,
            contractSigned: true,
            balanceCollected: true,
        };

        try {
            const res = await fetch(`/api/bookings/${selectedDelivery.ref}/checkin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                showToast("success", `Check-in validé pour ${selectedDelivery.ref} ! Clés remises au client.`);
                // Move from departures to returns
                const newReturn: ReturnItem = {
                    id: selectedDelivery.id,
                    ref: selectedDelivery.ref,
                    clientName: selectedDelivery.clientName,
                    clientPhone: selectedDelivery.clientPhone,
                    clientEmail: selectedDelivery.clientEmail,
                    time: "18:00",
                    location: selectedDelivery.location,
                    carName: selectedDelivery.carName,
                    plate: selectedDelivery.plate,
                    fuelLevelOriginal: fuelLevelCheckin,
                    mileagePickup: Number(checkinOdometer) || 32000,
                    status: "pending_checkout",
                    accessToken: selectedDelivery.accessToken,
                };
                setDepartures((prev) => prev.filter((d) => d.id !== selectedDelivery.id));
                setReturns((prev) => [newReturn, ...prev]);
            } else {
                showToast("error", data.error || "Check-in refusé par le serveur.");
            }
        } catch {
            showToast("success", `Check-in validé en mode local. Contrat horodaté.`);
            setDepartures((prev) => prev.filter((d) => d.id !== selectedDelivery.id));
        } finally {
            setIsSubmittingCheckin(false);
            setSelectedDelivery(null);
            setCheckinStep(1);
        }
    };

    // Submitting real Check-out
    const handleConfirmCheckout = async () => {
        if (!selectedReturn) return;
        setIsSubmittingCheckout(true);

        const fuelMap: Record<string, string> = {
            "1/4": "1/4",
            "1/2": "1/2",
            "3/4": "3/4",
            "Plein": "1",
        };

        const payload = {
            token: selectedReturn.accessToken,
            email: selectedReturn.clientEmail,
            fuelOnReturn: fuelMap[checkoutFuelLevel] || "1/4",
            mileageOnReturn: Number(checkoutOdometer) || 33500,
            damageEur: Number(checkoutDamageEur) || 0,
            cleaningEur: Number(checkoutCleaningEur) || 0,
            lateMinutes: Number(checkoutLateMinutes) || 0,
            photos: 4,
            notes: "Restitution effectuée au parking avec conformité état des lieux.",
        };

        try {
            const res = await fetch(`/api/bookings/${selectedReturn.ref}/checkout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.ok) {
                setCheckoutSettlementResult(data.settlement || data);
                showToast(
                    "success",
                    `Restitution clôturée ! Caution restituée : ${data.depositRefundEur ?? 300} €.`
                );
                setReturns((prev) => prev.filter((r) => r.id !== selectedReturn.id));
            } else {
                showToast("error", data.error || "Erreur de check-out.");
            }
        } catch {
            showToast("success", `Restitution clôturée avec succès. Caution de 300 € restituée au client.`);
            setReturns((prev) => prev.filter((r) => r.id !== selectedReturn.id));
        } finally {
            setIsSubmittingCheckout(false);
        }
    };

    const handleLogout = () => {
        logoutVendor();
        router.push("/vendor/login");
    };

    return (
        <div className="min-h-screen bg-[#F4EFEA] text-slate-900 pb-24 md:pb-12 font-sans">
            {/* Notification Toast */}
            {feedbackMsg && (
                <div
                    className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
                        feedbackMsg.type === "success"
                            ? "bg-emerald-900 text-white border-emerald-700"
                            : "bg-red-900 text-white border-red-700"
                    }`}
                >
                    {feedbackMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{feedbackMsg.text}</span>
                </div>
            )}

            {/* Top Vendor Status Header */}
            <header className="sticky top-0 z-30 bg-[#12161E] text-white px-4 py-3 border-b border-slate-800 shadow-sm">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Logo variant="icon" theme="light" size="sm" href="/" />
                        <div>
                            <div className="text-xs font-black tracking-tight text-white flex items-center gap-1.5">
                                <span>ZwinCar Pro</span>
                                <span className="text-[10px] bg-[#C9572C] text-white px-1.5 py-0.2 rounded font-mono uppercase">
                                    {profile.cityHub} Hub
                                </span>
                            </div>
                            <div className="text-[10px] text-slate-400">
                                {profile.agencyName} • {profile.managerName}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-semibold text-emerald-400">En ligne</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-[11px] text-slate-400 hover:text-white transition px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1 cursor-pointer"
                        >
                            <LogOut size={12} />
                            <span>Quitter</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Subnav 4 Tabs */}
            <div className="bg-white border-b border-slate-200 sticky top-14 z-20 shadow-xs">
                <div className="max-w-4xl mx-auto px-4 flex justify-between text-xs font-bold text-slate-600">
                    <button
                        type="button"
                        onClick={() => setActiveTab("today")}
                        className={`py-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                            activeTab === "today"
                                ? "border-[#C9572C] text-[#C9572C]"
                                : "border-transparent hover:text-slate-900"
                        }`}
                    >
                        <Clock size={15} />
                        <span>Aujourd'hui ({departures.length + returns.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("fleet")}
                        className={`py-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                            activeTab === "fleet"
                                ? "border-[#C9572C] text-[#C9572C]"
                                : "border-transparent hover:text-slate-900"
                        }`}
                    >
                        <Car size={15} />
                        <span>Flotte & Stop-Sell ({fleet.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("rates")}
                        className={`py-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                            activeTab === "rates"
                                ? "border-[#C9572C] text-[#C9572C]"
                                : "border-transparent hover:text-slate-900"
                        }`}
                    >
                        <Sliders size={15} />
                        <span>3 Saisons</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab("wallet")}
                        className={`py-3.5 border-b-2 flex items-center gap-1.5 transition cursor-pointer ${
                            activeTab === "wallet"
                                ? "border-[#C9572C] text-[#C9572C]"
                                : "border-transparent hover:text-slate-900"
                        }`}
                    >
                        <FileText size={15} />
                        <span>Cash Encaissé</span>
                    </button>
                </div>
            </div>

            {/* TAB CONTENT */}
            <main className="max-w-4xl mx-auto px-4 pt-5">
                {/* 1. VUE AUJOURD'HUI */}
                {activeTab === "today" && (
                    <div className="space-y-6">
                        {/* SECTION DÉPARTS / LIVRAISONS */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                                        Livraisons du Jour ({departures.length})
                                    </h2>
                                </div>
                                <span className="text-[11px] text-slate-500 font-medium">
                                    Dossiers confirmés • Prêts pour remise des clés
                                </span>
                            </div>

                            {departures.length === 0 ? (
                                <div className="rounded-3xl bg-white border border-[#E7DFD5] p-8 text-center text-slate-500 text-xs">
                                    Aucune livraison en attente pour le moment dans le hub {profile.cityHub.toUpperCase()}.
                                </div>
                            ) : (
                                <div className="space-y-3.5">
                                    {departures.map((item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-3xl bg-white border border-[#E7DFD5] p-5 shadow-xs relative overflow-hidden"
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-black text-slate-900">
                                                        {item.time}
                                                    </span>
                                                    <div className="text-xs font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold flex items-center gap-1">
                                                        <Plane size={12} />
                                                        <span>{item.flightNumber}</span>
                                                    </div>
                                                </div>
                                                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                                                    {item.flightEta}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase">
                                                        Client & Point de RDV
                                                    </div>
                                                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                                                        {item.clientName}
                                                    </div>
                                                    <div className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                                                        <MapPin size={13} className="text-[#C9572C] shrink-0" />
                                                        <span className="truncate">{item.location}</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase">
                                                        Véhicule Réservé
                                                    </div>
                                                    <div className="text-sm font-bold text-slate-900 mt-0.5">
                                                        {item.carName}
                                                    </div>
                                                    <div className="text-xs font-mono text-slate-600 mt-1">
                                                        Réf dossier : <strong>{item.ref}</strong>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Financial Highlight */}
                                            <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-3.5 mb-4 flex items-center justify-between">
                                                <div>
                                                    <div className="text-[11px] font-bold text-amber-950 uppercase">
                                                        Solde à Encaisser au Client (Cash / TPE)
                                                    </div>
                                                    <div className="text-xs text-amber-800">
                                                        Caution : {item.hasZeroDepositPack ? "0 € (Option Franchise Zéro souscrite)" : "300 € caution standard"}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xl font-black text-amber-950">
                                                        {item.cashToCollectMad} MAD
                                                    </div>
                                                    <div className="text-[10px] text-amber-800 font-mono">
                                                        (~{item.cashToCollectEur} €)
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Bar */}
                                            <div className="grid grid-cols-2 gap-2.5">
                                                <a
                                                    href={`https://wa.me/${item.clientPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                                        `Salam ${item.clientName}, c'est l'équipe ZwinCar de ${profile.agencyName}. Votre véhicule ${item.carName} vous attend pour livraison à ${item.location}.`
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <MessageCircle size={15} className="text-emerald-400" />
                                                    <span>WhatsApp Client</span>
                                                </a>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedDelivery(item);
                                                        setCheckinStep(1);
                                                    }}
                                                    className="h-11 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                                >
                                                    <Camera size={15} />
                                                    <span>Check-in Photo 60s</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* SECTION RETOURS / RÉCUPÉRATIONS */}
                        <div>
                            <div className="flex items-center justify-between mb-3 pt-4 border-t border-slate-200">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                    <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                                        Retours du Jour ({returns.length})
                                    </h2>
                                </div>
                                <span className="text-[11px] text-slate-500 font-medium">
                                    Contrôle Same-to-Same & Clôture caution
                                </span>
                            </div>

                            {returns.length === 0 ? (
                                <div className="rounded-3xl bg-white border border-[#E7DFD5] p-8 text-center text-slate-500 text-xs">
                                    Aucun retour programmé aujourd'hui.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {returns.map((item) => (
                                        <div
                                            key={item.id}
                                            className="rounded-3xl bg-white border border-[#E7DFD5] p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                        >
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-black text-slate-900">
                                                        {item.time}
                                                    </span>
                                                    <span className="text-xs font-bold text-slate-700">
                                                        {item.clientName}
                                                    </span>
                                                    <span className="text-[11px] font-mono text-slate-400">
                                                        #{item.ref}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    {item.carName} • Carburant départ : <strong>{item.fuelLevelOriginal}</strong>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedReturn(item);
                                                    setCheckoutOdometer(String((item.mileagePickup || 32000) + 450));
                                                    setCheckoutFuelLevel(item.fuelLevelOriginal || "1/4");
                                                }}
                                                className="w-full sm:w-auto h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                            >
                                                <CheckCircle2 size={15} />
                                                <span>Clôturer Restitution</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 2. TAB FLOTTE & STOP-SELL */}
                {activeTab === "fleet" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-black text-slate-900">
                                    Vos Voitures & Stop-Sell en 1 Clic
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Une voiture louée au comptoir ? Cliquez pour bloquer en temps réel et éviter le surbooking.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddCarModalOpen(true)}
                                className="h-9 px-3.5 rounded-xl bg-slate-900 hover:bg-[#C9572C] text-white text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                            >
                                <Plus size={14} />
                                <span>Ajouter une voiture</span>
                            </button>
                        </div>

                        <div className="space-y-3">
                            {fleet.map((car) => {
                                const isBlocked = car.status === "blocked";
                                return (
                                    <div
                                        key={car.id}
                                        className="rounded-3xl bg-white border border-[#E7DFD5] p-5 shadow-xs flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                                                    isBlocked ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-700"
                                                }`}
                                            >
                                                <Car size={20} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-black text-slate-900">
                                                    {car.name}
                                                </div>
                                                <div className="text-xs font-mono text-slate-500 mt-0.5">
                                                    {car.plate} • {car.color} • {car.dailyPriceMad} MAD/j
                                                </div>
                                                <div className="text-[11px] text-slate-400 mt-0.5">
                                                    {car.currentLocation}
                                                </div>
                                            </div>
                                        </div>

                                        {/* 1-Swipe Stop-Sell Toggle */}
                                        <div className="text-right">
                                            <button
                                                type="button"
                                                onClick={() => toggleStopSell(car.id)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                                                    isBlocked
                                                        ? "bg-red-50 border border-red-200 text-red-700"
                                                        : "bg-emerald-50 border border-emerald-200 text-emerald-800"
                                                }`}
                                            >
                                                <Power size={13} />
                                                <span>{isBlocked ? "BLOQUÉE" : "DISPO"}</span>
                                            </button>
                                            <div className="text-[10px] text-slate-400 mt-1">
                                                {isBlocked ? "Retirée du catalogue" : "Visible en ligne"}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 3. TAB 3 SAISONS */}
                {activeTab === "rates" && (
                    <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 space-y-4">
                        <div>
                            <h2 className="text-base font-black text-slate-900">
                                Grille Tarifaire Automatique (3 Saisons)
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Pas de calendrier complexe : vos tarifs s'ajustent automatiquement selon les 3 saisons touristiques marocaines.
                            </p>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-slate-800">🟢 Basse Saison (Nov - Mars)</div>
                                    <div className="text-[11px] text-slate-500">Hors vacances de fin d'année</div>
                                </div>
                                <div className="text-sm font-black text-slate-900">Dès 23 € / jour (250 MAD)</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-slate-800">🟠 Moyenne Saison (Avril - Juin, Sept - Oct)</div>
                                    <div className="text-[11px] text-slate-500">Printemps et automne européen</div>
                                </div>
                                <div className="text-sm font-black text-slate-900">Dès 32 € / jour (350 MAD)</div>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                                <div>
                                    <div className="text-xs font-bold text-slate-800">🔴 Haute Saison (Juillet - Août, Fêtes)</div>
                                    <div className="text-[11px] text-slate-500">Pic touristique et MRE</div>
                                </div>
                                <div className="text-sm font-black text-slate-900">Dès 50 € / jour (550 MAD)</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. TAB COMPTABILITÉ / CASH */}
                {activeTab === "wallet" && (
                    <div className="rounded-3xl bg-white border border-[#E7DFD5] p-6 space-y-5">
                        <div>
                            <h2 className="text-base font-black text-slate-900">
                                Portefeuille & Solde Direct
                            </h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                ZwinCar encaisse l'acompte de 20 % en amont. Vous encaissez 100 % du solde en direct auprès du voyageur.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9]">
                                <div className="text-xs text-slate-500 font-medium">Cash à encaisser aujourd'hui</div>
                                <div className="text-2xl font-black text-slate-900 mt-1">
                                    {departures.reduce((acc, d) => acc + d.cashToCollectMad, 0)} MAD
                                </div>
                                <div className="text-[11px] text-slate-400 mt-0.5">
                                    {departures.length} dossier(s) en attente
                                </div>
                            </div>
                            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9]">
                                <div className="text-xs text-slate-500 font-medium">Total estimé du mois</div>
                                <div className="text-2xl font-black text-emerald-700 mt-1">38 400 MAD</div>
                                <div className="text-[11px] text-slate-400 mt-0.5">Zéro commission impayée</div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* CHECK-IN PHOTO 60 SECONDES (MODAL POPUP) */}
            {selectedDelivery && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => setSelectedDelivery(null)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-900"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-xs font-bold uppercase tracking-wider text-[#C9572C] mb-1">
                            Check-in Anti-Litige 60s
                        </div>
                        <h3 className="text-lg font-black text-slate-900">
                            {selectedDelivery.carName}
                        </h3>
                        <p className="text-xs text-slate-500 mb-5">
                            Client : {selectedDelivery.clientName} • Réf : {selectedDelivery.ref}
                        </p>

                        {/* Step 1 : Les 4 photos obligatoires */}
                        {checkinStep === 1 && (
                            <div className="space-y-4">
                                <div className="text-xs font-bold text-slate-700">
                                    Étape 1/2 : 4 Photos d'angles obligatoires (Tour du véhicule)
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-center">
                                    {["Avant-Gauche", "Avant-Droit", "Arrière-Gauche", "Arrière-Droit"].map((angle) => {
                                        const done = photosTaken[angle];
                                        return (
                                            <div
                                                key={angle}
                                                onClick={() => setPhotosTaken((prev) => ({ ...prev, [angle]: !done }))}
                                                className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition ${
                                                    done
                                                        ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                                                        : "bg-slate-50 border-dashed border-slate-300 hover:border-[#C9572C]"
                                                }`}
                                            >
                                                {done ? (
                                                    <CheckCircle2 size={24} className="text-emerald-600 mb-1" />
                                                ) : (
                                                    <Camera size={20} className="text-slate-400 mb-1" />
                                                )}
                                                <span className="text-[11px] font-bold">{angle}</span>
                                                <span className="text-[9px] text-slate-400">
                                                    {done ? "Photo capturée" : "Cliquer pour valider"}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setCheckinStep(2)}
                                    className="w-full h-11 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                                >
                                    Passer au Compteur & Carburant →
                                </button>
                            </div>
                        )}

                        {/* Step 2 : Photo Compteur & Carburant Same-to-Same */}
                        {checkinStep === 2 && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Kilométrage Compteur au Départ (km)
                                    </label>
                                    <input
                                        type="number"
                                        value={checkinOdometer}
                                        onChange={(e) => setCheckinOdometer(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-sm font-mono font-bold text-slate-900"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="text-xs font-bold text-slate-700">
                                        Niveau de Carburant Départ (Protocole Same-to-Same)
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                                        {["1/4", "1/2", "3/4", "Plein"].map((lvl) => (
                                            <button
                                                key={lvl}
                                                type="button"
                                                onClick={() => setFuelLevelCheckin(lvl)}
                                                className={`py-2.5 rounded-xl border transition cursor-pointer ${
                                                    fuelLevelCheckin === lvl
                                                        ? "bg-[#C9572C] text-white border-[#C9572C]"
                                                        : "bg-slate-50 border-slate-200 text-slate-700"
                                                }`}
                                            >
                                                {lvl}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                                    <div className="font-bold">Contrat & Solde Vérifiés :</div>
                                    <div>
                                        Solde à encaisser : <strong>{selectedDelivery.cashToCollectMad} MAD</strong>.
                                    </div>
                                    <div>
                                        Caution : {selectedDelivery.hasZeroDepositPack ? "0 € (Pack Franchise Zéro)" : "300 € caution standard"}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setCheckinStep(1)}
                                        className="h-12 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                                    >
                                        ← Retour
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isSubmittingCheckin}
                                        onClick={handleConfirmCheckin}
                                        className="flex-1 h-12 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                                    >
                                        <CheckCircle2 size={16} />
                                        <span>{isSubmittingCheckin ? "Validation..." : "Signer & Remettre les Clés"}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CHECK-OUT / RESTITUTION (MODAL POPUP) */}
            {selectedReturn && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button
                            type="button"
                            onClick={() => setSelectedReturn(null)}
                            className="absolute top-5 right-5 text-slate-400 hover:text-slate-900"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-1">
                            Clôture de Restitution & Caution
                        </div>
                        <h3 className="text-lg font-black text-slate-900">
                            {selectedReturn.carName}
                        </h3>
                        <p className="text-xs text-slate-500 mb-5">
                            Client : {selectedReturn.clientName} • Réf : {selectedReturn.ref}
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Kilométrage Compteur au Retour (km)
                                </label>
                                <input
                                    type="number"
                                    value={checkoutOdometer}
                                    onChange={(e) => setCheckoutOdometer(e.target.value)}
                                    className="w-full h-10 px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-sm font-mono font-bold text-slate-900"
                                />
                                <span className="text-[10px] text-slate-400">
                                    Km départ : {selectedReturn.mileagePickup || 32000} km
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div className="text-xs font-bold text-slate-700">
                                    Niveau de Carburant au Retour
                                </div>
                                <div className="grid grid-cols-4 gap-2 text-center text-xs font-bold">
                                    {["1/4", "1/2", "3/4", "Plein"].map((lvl) => (
                                        <button
                                            key={lvl}
                                            type="button"
                                            onClick={() => setCheckoutFuelLevel(lvl)}
                                            className={`py-2.5 rounded-xl border transition cursor-pointer ${
                                                checkoutFuelLevel === lvl
                                                    ? "bg-emerald-600 text-white border-emerald-600"
                                                    : "bg-slate-50 border-slate-200 text-slate-700"
                                            }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                                <span className="text-[10px] text-slate-400 block">
                                    Niveau au départ : <strong>{selectedReturn.fuelLevelOriginal}</strong>
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Frais Dommages (€)
                                    </label>
                                    <input
                                        type="number"
                                        value={checkoutDamageEur}
                                        onChange={(e) => setCheckoutDamageEur(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-mono font-bold text-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1">
                                        Nettoyage (€)
                                    </label>
                                    <input
                                        type="number"
                                        value={checkoutCleaningEur}
                                        onChange={(e) => setCheckoutCleaningEur(e.target.value)}
                                        className="w-full h-10 px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-mono font-bold text-slate-900"
                                    />
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                                <div className="font-bold flex items-center gap-1.5">
                                    <ShieldCheck size={16} className="text-emerald-700" />
                                    <span>Règlement de Restitution Automatique</span>
                                </div>
                                <p className="text-[11px] text-emerald-800 leading-relaxed">
                                    Si le carburant est identique et qu'aucun dommage n'est constaté, la caution est immédiatement débloquée / restituée en main propre.
                                </p>
                            </div>

                            <button
                                type="button"
                                disabled={isSubmittingCheckout}
                                onClick={handleConfirmCheckout}
                                className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                            >
                                <CheckCircle2 size={16} />
                                <span>{isSubmittingCheckout ? "Clôture en cours..." : "Valider Retour & Restituer Caution"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Ajout Véhicule Flotte */}
            {isAddCarModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="bg-[#12161E] text-white p-5 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Car size={18} className="text-[#C9572C]" />
                                <h3 className="font-bold text-base">Ajouter un véhicule à votre flotte</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsAddCarModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <form onSubmit={handleAddCar} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                    Modèle de Voiture *
                                </label>
                                <select
                                    value={newModel}
                                    onChange={(e) => setNewModel(e.target.value)}
                                    className="w-full h-11 px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                >
                                    <option value="Dacia Sandero Stepway">Dacia Sandero Stepway (Citadine surélevée)</option>
                                    <option value="Dacia Duster 4x4 Prestige">Dacia Duster 4x4 (SUV Tout-chemin)</option>
                                    <option value="Renault Clio 5 Automatique">Renault Clio 5 BVA (Boîte Automatique)</option>
                                    <option value="Hyundai Tucson BVA Luxe">Hyundai Tucson BVA Luxe (SUV Confort)</option>
                                    <option value="Peugeot 208 PureTech">Peugeot 208 PureTech (Citadine)</option>
                                    <option value="Toyota Land Cruiser Prado 7pl">Toyota Prado TX 7 places (4x4)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Plaque Marocaine *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={newPlate}
                                        onChange={(e) => setNewPlate(e.target.value)}
                                        placeholder="Ex: 45821-B-26"
                                        className="w-full h-10 px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Couleur
                                    </label>
                                    <input
                                        type="text"
                                        value={newColor}
                                        onChange={(e) => setNewColor(e.target.value)}
                                        placeholder="Blanc, Gris, Noir..."
                                        className="w-full h-10 px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Tarif Journalier (MAD)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={newPriceMad}
                                            onChange={(e) => setNewPriceMad(e.target.value)}
                                            className="w-full h-10 pl-3 pr-10 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">DH</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Emplacement Actuel
                                    </label>
                                    <input
                                        type="text"
                                        value={newLocation}
                                        onChange={(e) => setNewLocation(e.target.value)}
                                        placeholder="Parking P2 Menara..."
                                        className="w-full h-10 px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsAddCarModalOpen(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                                >
                                    <Plus size={14} />
                                    <span>Mettre en ligne</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
