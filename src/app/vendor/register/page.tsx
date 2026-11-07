"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Building2,
    Car,
    Phone,
    Mail,
    Lock,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    FileText,
    MapPin,
    AlertCircle,
    Check,
    Plus,
    Compass,
    Fuel,
    Cog,
} from "lucide-react";
import Logo from "@/components/Logo";
import { MOROCCAN_HUBS, VEHICLE_FLEET } from "@/lib/morocco-data";
import {
    saveVendorProfile,
    saveVendorFleet,
    VendorProfile,
    VendorVehicle,
    INITIAL_VENDOR_FLEET,
} from "@/lib/vendor-auth";

export default function VendorRegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Step 1: Agency legal identity
    const [agencyName, setAgencyName] = useState("");
    const [cityHub, setCityHub] = useState("marrakech");
    const [iceNumber, setIceNumber] = useState("");
    const [rcNumber, setRcNumber] = useState("");
    const [ifNumber, setIfNumber] = useState("");
    const [ministryLicenseNumber, setMinistryLicenseNumber] = useState("");
    const [ribNumber, setRibNumber] = useState("");
    const [address, setAddress] = useState("");

    // Step 2: Manager credentials
    const [managerName, setManagerName] = useState("");
    const [managerPhone, setManagerPhone] = useState("+212 ");
    const [dispatchPhone247, setDispatchPhone247] = useState("");
    const [managerEmail, setManagerEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    // Step 3: Fleet & First vehicle
    const [fleetSizeEstimate, setFleetSizeEstimate] = useState("10 à 25 véhicules");
    const [firstCarModel, setFirstCarModel] = useState("Dacia Sandero Stepway");
    const [firstCarPlate, setFirstCarPlate] = useState("");
    const [firstCarYear, setFirstCarYear] = useState("2024");
    const [firstCarColor, setFirstCarColor] = useState("Gris Comète");
    const [firstCarTransmission, setFirstCarTransmission] = useState<"Manuelle" | "Automatique">("Manuelle");
    const [firstCarFuel, setFirstCarFuel] = useState<"Diesel" | "Essence">("Diesel");
    const [firstCarPriceMad, setFirstCarPriceMad] = useState("280");
    const [agreedCharter, setAgreedCharter] = useState(true);

    const handleNextStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!agencyName.trim()) {
            setError("Veuillez renseigner la raison sociale de votre agence.");
            return;
        }

        if (iceNumber.trim().length < 9) {
            setError("Veuillez renseigner un numéro ICE valide (15 chiffres au Maroc).");
            return;
        }

        setStep(2);
    };

    const handleNextStep2 = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!managerName.trim()) {
            setError("Veuillez renseigner le nom du gérant ou responsable d'exploitation.");
            return;
        }

        if (!managerPhone.trim() || managerPhone.length < 9) {
            setError("Le numéro WhatsApp direct est indispensable pour la conciergerie aéroport.");
            return;
        }

        if (password.length < 12) {
            setError("Le mot de passe doit comporter au moins 12 caractères pour la sécurité de votre flotte.");
            return;
        }

        if (password !== passwordConfirm) {
            setError("Les deux mots de passe ne correspondent pas.");
            return;
        }

        setStep(3);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!firstCarPlate.trim()) {
            setError("Veuillez renseigner la plaque d'immatriculation du premier véhicule.");
            return;
        }

        if (!agreedCharter) {
            setError("Vous devez accepter la charte de transparence ZwinCar.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/vendor/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    agencyName,
                    cityHub,
                    iceNumber,
                    rcNumber,
                    ifNumber,
                    ministryLicenseNumber,
                    ribNumber,
                    address,
                    managerName,
                    managerPhone,
                    dispatchPhone247: dispatchPhone247.trim() || managerPhone.trim(),
                    managerEmail,
                    password,
                    fleetSizeEstimate,
                    firstCar: {
                        model: firstCarModel,
                        plate: firstCarPlate,
                        color: firstCarColor,
                        year: parseInt(firstCarYear, 10) || 2024,
                        transmission: firstCarTransmission,
                        fuel: firstCarFuel,
                        dailyPriceMad: parseInt(firstCarPriceMad, 10) || 280,
                    },
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Une erreur est survenue lors de l'inscription.");
                setLoading(false);
                return;
            }

            if (typeof window !== "undefined") {
                if (data.token) {
                    localStorage.setItem("zwincar_vendor_token", data.token);
                }
                if (data.agency) {
                    saveVendorProfile(data.agency);
                }
            }

            router.push("/vendor/dashboard");
        } catch {
            setError("Connexion au serveur impossible. Vérifiez votre réseau.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col justify-between font-sans">
            {/* Top Minimal Nav */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-[#E7DFD5] bg-white/70 backdrop-blur-md">
                <Logo variant="full" theme="dark" size="sm" />
                <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-slate-500 hidden sm:inline">Déjà inscrit ?</span>
                    <Link
                        href="/vendor/login"
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#C9572C] text-white transition shadow-xs"
                    >
                        Se connecter
                    </Link>
                </div>
            </header>

            {/* Stepper Progress Bar */}
            <div className="max-w-2xl mx-auto w-full px-4 pt-6">
                <div className="flex items-center justify-between relative mb-2">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 w-full z-0"></div>
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#C9572C] transition-all duration-300 z-0"
                        style={{ width: step === 1 ? "15%" : step === 2 ? "50%" : "100%" }}
                    ></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                step >= 1 ? "bg-[#C9572C] text-white shadow-sm" : "bg-slate-200 text-slate-600"
                            }`}
                        >
                            {step > 1 ? <Check size={16} /> : "1"}
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                            Agence & ICE
                        </span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                step >= 2 ? "bg-[#C9572C] text-white shadow-sm" : "bg-white border-2 border-slate-200 text-slate-400"
                            }`}
                        >
                            {step > 2 ? <Check size={16} /> : "2"}
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                            Gérant & Accès
                        </span>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                step === 3 ? "bg-[#C9572C] text-white shadow-sm" : "bg-white border-2 border-slate-200 text-slate-400"
                            }`}
                        >
                            3
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wider">
                            Flotte Initiale
                        </span>
                    </div>
                </div>
            </div>

            {/* Main Form Container */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 mb-8">
                <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#E7DFD5] shadow-xl p-6 sm:p-8 space-y-6">
                    {/* Error Banner */}
                    {error && (
                        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                            <AlertCircle size={16} className="shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* STEP 1: Agence & Légalité Maroc */}
                    {step === 1 && (
                        <form onSubmit={handleNextStep1} className="space-y-5 animate-in fade-in">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C9572C]/10 text-[#C9572C] text-[11px] font-bold uppercase tracking-wider mb-1">
                                    <Building2 size={13} />
                                    <span>Étape 1 sur 3</span>
                                </div>
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                    Identité de votre Agence de Location
                                </h1>
                                <h2 className="text-xs text-slate-500 mt-0.5 font-normal">
                                    Loueurs professionnels déclarés et certifiés au Maroc.
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Raison Sociale / Nom Commercial de l'Agence *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={agencyName}
                                        onChange={(e) => setAgencyName(e.target.value)}
                                        placeholder="Ex: Atlas Drive Cars SARL"
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Ville Hub Principale (Aéroport) *
                                    </label>
                                    <select
                                        value={cityHub}
                                        onChange={(e) => setCityHub(e.target.value)}
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    >
                                        {MOROCCAN_HUBS.map((hub) => (
                                            <option key={hub.slug} value={hub.slug}>
                                                {hub.name} — {hub.airportName} ({hub.airportCode})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Numéro ICE (15 Chiffres) *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={iceNumber}
                                        onChange={(e) => setIceNumber(e.target.value)}
                                        placeholder="002847192000084"
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-mono font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                                        Obligatoire au Maroc pour l'agrément légal de transport
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Registre du Commerce (RC) & Ville
                                    </label>
                                    <input
                                        type="text"
                                        value={rcNumber}
                                        onChange={(e) => setRcNumber(e.target.value)}
                                        placeholder="Ex: 84920 / Marrakech"
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        N° Agrément Ministère des Transports
                                    </label>
                                    <input
                                        type="text"
                                        value={ministryLicenseNumber}
                                        onChange={(e) => setMinistryLicenseNumber(e.target.value)}
                                        placeholder="Ex: 24/DRTR/2021 (ou En cours)"
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Identifiant Fiscal (IF) / Patente
                                    </label>
                                    <input
                                        type="text"
                                        value={ifNumber}
                                        onChange={(e) => setIfNumber(e.target.value)}
                                        placeholder="Ex: 40182934"
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Taille Estimée de votre Parc
                                    </label>
                                    <select
                                        value={fleetSizeEstimate}
                                        onChange={(e) => setFleetSizeEstimate(e.target.value)}
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    >
                                        <option value="5 à 15 véhicules">5 à 15 véhicules</option>
                                        <option value="15 à 30 véhicules">15 à 30 véhicules</option>
                                        <option value="30 à 60 véhicules">30 à 60 véhicules</option>
                                        <option value="+ de 60 véhicules">+ de 60 véhicules</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        RIB Bancaire Marocain (24 Chiffres — Pour les Règlements)
                                    </label>
                                    <input
                                        type="text"
                                        value={ribNumber}
                                        onChange={(e) => setRibNumber(e.target.value)}
                                        placeholder="Ex: 011 780 0000 123456789012 34 (Attijariwafa, CIH, BCP...)"
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-mono font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                                        Sert au versement automatique des soldes et suppléments perçus en ligne
                                    </span>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Adresse du Bureau / Garage de Préparation
                                    </label>
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Ex: Avenue Mohammed V, Guéliz, Marrakech"
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full h-12 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md mt-6"
                            >
                                <span>Continuer vers les Accès Gérant</span>
                                <ArrowRight size={15} />
                            </button>
                        </form>
                    )}

                    {/* STEP 2: Gérant & Authentification */}
                    {step === 2 && (
                        <form onSubmit={handleNextStep2} className="space-y-5 animate-in fade-in">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C9572C]/10 text-[#C9572C] text-[11px] font-bold uppercase tracking-wider mb-1">
                                    <Phone size={13} />
                                    <span>Étape 2 sur 3</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                    Contact Gérant & Accès Espace Pro
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Ce numéro WhatsApp recevra instantanément les alertes d'atterrissage et de réservations.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Nom & Prénom du Responsable / Gérant *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={managerName}
                                        onChange={(e) => setManagerName(e.target.value)}
                                        placeholder="Ex: Karim Benjelloun"
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Numéro WhatsApp Direct (Gérant / Responsable) *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={managerPhone}
                                        onChange={(e) => setManagerPhone(e.target.value)}
                                        placeholder="+212 6 61 23 45 67"
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-mono font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                                        Reçoit les alertes WhatsApp instantanées à chaque résa
                                    </span>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Ligne d'Astreinte 24/7 / Agent de Piste Aéroport
                                    </label>
                                    <input
                                        type="tel"
                                        value={dispatchPhone247}
                                        onChange={(e) => setDispatchPhone247(e.target.value)}
                                        placeholder="+212 7 20 79 40 46 (si différent du gérant)"
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-mono font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                                        Agent sur le parking pour les vols de nuit ou retards
                                    </span>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Email Professionnel de Connexion *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={managerEmail}
                                        onChange={(e) => setManagerEmail(e.target.value)}
                                        placeholder="karim@agence-marrakech.ma"
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Créer un Mot de Passe *
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min 12 caractères sécurisés"
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                                        Confirmer le Mot de Passe *
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full h-11 px-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="h-12 px-5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <ArrowLeft size={15} />
                                    <span>Retour</span>
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 h-12 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                                >
                                    <span>Continuer vers l'Ajout de Flotte</span>
                                    <ArrowRight size={15} />
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 3: Flotte & Premier Véhicule */}
                    {step === 3 && (
                        <form onSubmit={handleFinalSubmit} className="space-y-5 animate-in fade-in">
                            <div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C9572C]/10 text-[#C9572C] text-[11px] font-bold uppercase tracking-wider mb-1">
                                    <Car size={13} />
                                    <span>Étape 3 sur 3</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                    Ajoutez votre Premier Véhicule
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Ce véhicule sera immédiatement visible dans votre tableau de bord avec son switch de stop-sell 1-clic.
                                </p>
                            </div>

                            {/* First Car Card Box */}
                            <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Modèle du Véhicule *
                                        </label>
                                        <select
                                            value={firstCarModel}
                                            onChange={(e) => setFirstCarModel(e.target.value)}
                                            className="w-full h-10 px-3 rounded-xl bg-white border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                        >
                                            <option value="Dacia Sandero Stepway">Dacia Sandero Stepway (Citadine surélevée)</option>
                                            <option value="Dacia Duster 4x4 Prestige">Dacia Duster 4x4 (SUV Pistes)</option>
                                            <option value="Renault Clio 5 Automatique">Renault Clio 5 BVA (Confort)</option>
                                            <option value="Hyundai Tucson BVA Luxe">Hyundai Tucson (SUV Premium)</option>
                                            <option value="Peugeot 208 PureTech">Peugeot 208 (Économique)</option>
                                            <option value="Toyota Land Cruiser Prado 7pl">Toyota Prado TX 7 places (4x4)</option>
                                            <option value="Autre Modèle">Autre Modèle Spécifique</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Plaque d'Immatriculation Marocaine *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={firstCarPlate}
                                            onChange={(e) => setFirstCarPlate(e.target.value)}
                                            placeholder="Ex: 45821-B-26 ou WW-12345"
                                            className="w-full h-10 px-3 rounded-xl bg-white border border-[#E7DFD5] text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Couleur de la Carrosserie
                                        </label>
                                        <input
                                            type="text"
                                            value={firstCarColor}
                                            onChange={(e) => setFirstCarColor(e.target.value)}
                                            placeholder="Gris Comète, Blanc Glacier..."
                                            className="w-full h-10 px-3 rounded-xl bg-white border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Année de Mise en Circulation
                                        </label>
                                        <select
                                            value={firstCarYear}
                                            onChange={(e) => setFirstCarYear(e.target.value)}
                                            className="w-full h-10 px-3 rounded-xl bg-white border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                        >
                                            <option value="2026">2026 (Neuf)</option>
                                            <option value="2025">2025</option>
                                            <option value="2024">2024</option>
                                            <option value="2023">2023</option>
                                            <option value="2022">2022</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Boîte de Vitesses
                                        </label>
                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                            <button
                                                type="button"
                                                onClick={() => setFirstCarTransmission("Manuelle")}
                                                className={`h-9 rounded-xl font-bold border transition cursor-pointer ${
                                                    firstCarTransmission === "Manuelle"
                                                        ? "bg-slate-900 text-white border-slate-900"
                                                        : "bg-white text-slate-700 border-slate-200"
                                                }`}
                                            >
                                                Manuelle
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFirstCarTransmission("Automatique")}
                                                className={`h-9 rounded-xl font-bold border transition cursor-pointer ${
                                                    firstCarTransmission === "Automatique"
                                                        ? "bg-slate-900 text-white border-slate-900"
                                                        : "bg-white text-slate-700 border-slate-200"
                                                }`}
                                            >
                                                Automatique
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Tarif Journalier Souhaité (MAD / jour)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={firstCarPriceMad}
                                                onChange={(e) => setFirstCarPriceMad(e.target.value)}
                                                className="w-full h-10 pl-3 pr-12 rounded-xl bg-white border border-[#E7DFD5] text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                            />
                                            <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                                                DH/j
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Charte ZwinCar Reassurance */}
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <ShieldCheck size={16} className="text-[#C9572C]" />
                                    <span>Charte Qualité Loueur Partenaire ZwinCar</span>
                                </div>
                                <ul className="space-y-1.5 text-slate-600 text-[11px]">
                                    <li className="flex items-start gap-1.5">
                                        <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                                        <span><strong>Remise des clés aéroport ponctuelle :</strong> Vous accueillez le client à la sortie du terminal avec pancarte nominative.</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                                        <span><strong>Politique carburant Same-to-Same :</strong> Le véhicule repart avec le même niveau qu'à l'arrivée (zéro arnaque au réservoir vide).</span>
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <Check size={14} className="text-emerald-600 shrink-0 mt-0.5" />
                                        <span><strong>Zéro forcing au comptoir :</strong> Vous respectez les conditions réservées sans obliger le client à racheter des assurances superflues.</span>
                                    </li>
                                </ul>

                                <label className="flex items-start gap-2 pt-2 border-t border-slate-100 cursor-pointer text-slate-800 font-semibold select-none">
                                    <input
                                        type="checkbox"
                                        checked={agreedCharter}
                                        onChange={(e) => setAgreedCharter(e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-300 text-[#C9572C] focus:ring-[#C9572C] mt-0.5"
                                    />
                                    <span className="text-[11px]">
                                        Je certifie que mon agence est immatriculée au Maroc et j'accepte la charte ZwinCar.
                                    </span>
                                </label>
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="h-12 px-5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <ArrowLeft size={15} />
                                    <span>Retour</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 h-12 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] disabled:opacity-70 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                                >
                                    {loading ? (
                                        <span>Création de votre compte et de la flotte...</span>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={16} />
                                            <span>Valider et Accéder à mon Espace Pro</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>

            {/* Bottom Support Info */}
            <footer className="py-4 text-center text-xs text-slate-500 border-t border-[#E7DFD5] bg-white/50">
                <div className="flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Agrément Partenaire Loueur ZwinCar Maroc • ICE vérifié</span>
                </div>
            </footer>
        </div>
    );
}
