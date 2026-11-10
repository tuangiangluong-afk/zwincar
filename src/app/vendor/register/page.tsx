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
    AlertCircle,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronUp,
    Loader2,
} from "lucide-react";
import Logo from "@/components/Logo";
import { MOROCCAN_HUBS } from "@/lib/morocco-data";
import { saveVendorProfile } from "@/lib/vendor-auth";

// Modèles populaires au Maroc avec tarifs moyens indicatifs
const POPULAR_FLEET_MODELS = [
    { name: "Dacia Sandero Stepway", defaultPrice: 280, tag: "Le plus loué" },
    { name: "Renault Clio 5 Automatique", defaultPrice: 330, tag: "Automatique" },
    { name: "Dacia Duster 4x4 Prestige", defaultPrice: 390, tag: "SUV Pistes" },
    { name: "Peugeot 208 PureTech", defaultPrice: 270, tag: "Économique" },
    { name: "Hyundai Tucson BVA Luxe", defaultPrice: 590, tag: "SUV Premium" },
    { name: "Autre véhicule", defaultPrice: 300, tag: "" },
];

export default function VendorRegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2>(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Étape 1 : Agence & Accès
    const [agencyName, setAgencyName] = useState("");
    const [cityHub, setCityHub] = useState("marrakech");
    const [iceNumber, setIceNumber] = useState("");
    const [managerName, setManagerName] = useState("");
    const [managerPhone, setManagerPhone] = useState("");
    const [managerEmail, setManagerEmail] = useState("");
    const [password, setPassword] = useState("");

    // Champs fiscaux optionnels (repliés par défaut)
    const [rcNumber, setRcNumber] = useState("");
    const [ifNumber, setIfNumber] = useState("");
    const [ribNumber, setRibNumber] = useState("");

    // Étape 2 : 1er Véhicule
    const [firstCarModel, setFirstCarModel] = useState("Dacia Sandero Stepway");
    const [firstCarPlate, setFirstCarPlate] = useState("");
    const [firstCarPriceMad, setFirstCarPriceMad] = useState("280");
    const [agreedCharter, setAgreedCharter] = useState(true);

    const handleNextStep1 = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!agencyName.trim()) {
            setError("Veuillez renseigner le nom de votre agence.");
            return;
        }

        const cleanIce = iceNumber.trim().replace(/\s/g, "");
        if (cleanIce.length < 8) {
            setError("Numéro ICE invalide (au moins 8 chiffres requis au Maroc).");
            return;
        }

        if (!managerName.trim()) {
            setError("Veuillez renseigner le nom du gérant ou responsable.");
            return;
        }

        const cleanPhone = managerPhone.trim().replace(/[\s.-]/g, "");
        if (cleanPhone.length < 8) {
            setError("Numéro WhatsApp valide requis pour recevoir les alertes de réservation.");
            return;
        }

        if (!managerEmail.trim() || !managerEmail.includes("@")) {
            setError("Veuillez renseigner un email professionnel valide.");
            return;
        }

        if (password.length < 12) {
            setError("Le mot de passe doit comporter au moins 12 caractères.");
            return;
        }

        setStep(2);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!firstCarPlate.trim()) {
            setError("Veuillez renseigner l'immatriculation du premier véhicule.");
            return;
        }

        if (!agreedCharter) {
            setError("Veuillez accepter la charte de transparence ZwinCar.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/vendor/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    agencyName: agencyName.trim(),
                    cityHub,
                    iceNumber: iceNumber.trim(),
                    rcNumber: rcNumber.trim() || undefined,
                    ifNumber: ifNumber.trim() || undefined,
                    ribNumber: ribNumber.trim() || undefined,
                    managerName: managerName.trim(),
                    managerPhone: managerPhone.trim(),
                    dispatchPhone247: managerPhone.trim(),
                    managerEmail: managerEmail.trim().toLowerCase(),
                    password,
                    firstCar: {
                        model: firstCarModel,
                        plate: firstCarPlate.trim(),
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
                localStorage.setItem("zwincar_vendor_authenticated", "true");
            }

            router.push("/vendor/dashboard");
        } catch {
            setError("Connexion au serveur impossible. Vérifiez votre réseau.");
            setLoading(false);
        }
    };

    const handleModelChange = (modelName: string) => {
        setFirstCarModel(modelName);
        const match = POPULAR_FLEET_MODELS.find((m) => m.name === modelName);
        if (match && match.defaultPrice) {
            setFirstCarPriceMad(match.defaultPrice.toString());
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col justify-between font-sans selection:bg-[#C9572C]/20 selection:text-[#C9572C]">
            {/* Header épuré */}
            <header className="px-5 sm:px-8 py-4 flex items-center justify-between border-b border-[#E7DFD5] bg-white/80 backdrop-blur-md">
                <Logo variant="full" theme="dark" size="sm" />
                <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500 hidden sm:inline">Déjà partenaire ?</span>
                    <Link
                        href="/vendor/login"
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#C9572C] text-white font-bold transition shadow-xs"
                    >
                        Connexion
                    </Link>
                </div>
            </header>

            {/* Stepper minimaliste */}
            <div className="max-w-xl mx-auto w-full px-4 pt-6">
                <div className="flex items-center justify-center gap-3">
                    <div className="flex items-center gap-2">
                        <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                step === 1
                                    ? "bg-[#C9572C] text-white shadow-xs"
                                    : "bg-emerald-600 text-white"
                            }`}
                        >
                            {step > 1 ? "✓" : "1"}
                        </div>
                        <span
                            className={`text-xs font-bold uppercase tracking-wider ${
                                step === 1 ? "text-slate-900" : "text-emerald-700"
                            }`}
                        >
                            Agence & Contact
                        </span>
                    </div>

                    <div className="w-12 h-0.5 bg-slate-200">
                        <div
                            className={`h-full bg-[#C9572C] transition-all duration-300 ${
                                step === 2 ? "w-full" : "w-0"
                            }`}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                                step === 2
                                    ? "bg-[#C9572C] text-white shadow-xs"
                                    : "bg-slate-200 text-slate-500"
                            }`}
                        >
                            2
                        </div>
                        <span
                            className={`text-xs font-bold uppercase tracking-wider ${
                                step === 2 ? "text-slate-900" : "text-slate-400"
                            }`}
                        >
                            Premier Véhicule
                        </span>
                    </div>
                </div>
            </div>

            {/* Container principal */}
            <main className="flex-1 flex items-center justify-center px-4 py-6 sm:py-10">
                <div className="w-full max-w-xl bg-white rounded-3xl border border-[#E7DFD5] shadow-xl p-6 sm:p-8 space-y-6">
                    {/* Alerte Erreur */}
                    {error && (
                        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                            <AlertCircle size={15} className="shrink-0 text-red-600" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* ÉTAPE 1 : Agence & Contact Gérant */}
                    {step === 1 && (
                        <form onSubmit={handleNextStep1} className="space-y-5 animate-in fade-in">
                            <div className="space-y-1">
                                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                    Inscrire votre Agence
                                </h1>
                                <p className="text-xs text-slate-500">
                                    Accédez aux clients arrivant aux aéroports marocains sans intermédiaire.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Nom agence & Ville */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Nom de l'agence *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={agencyName}
                                            onChange={(e) => setAgencyName(e.target.value)}
                                            placeholder="Ex: Atlas Drive Cars SARL"
                                            className="w-full h-11 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Aéroport / Hub principal *
                                        </label>
                                        <select
                                            value={cityHub}
                                            onChange={(e) => setCityHub(e.target.value)}
                                            className="w-full h-11 px-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all cursor-pointer"
                                        >
                                            {MOROCCAN_HUBS.map((hub) => (
                                                <option key={hub.slug} value={hub.slug}>
                                                    {hub.name} ({hub.airportCode})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Numéro ICE (15 chiffres) *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={iceNumber}
                                            onChange={(e) => setIceNumber(e.target.value)}
                                            placeholder="002847192000084"
                                            className="w-full h-11 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-mono font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all"
                                        />
                                    </div>
                                </div>

                                {/* Gérant, WhatsApp, Email, MDP */}
                                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Nom & Prénom du Gérant *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={managerName}
                                            onChange={(e) => setManagerName(e.target.value)}
                                            placeholder="Karim Benjelloun"
                                            className="w-full h-11 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Numéro WhatsApp Direct *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="tel"
                                                required
                                                value={managerPhone}
                                                onChange={(e) => setManagerPhone(e.target.value)}
                                                placeholder="+212 6 61 23 45 67"
                                                className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-mono font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all"
                                            />
                                            <Phone size={15} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Email de Connexion *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                required
                                                autoComplete="username"
                                                value={managerEmail}
                                                onChange={(e) => setManagerEmail(e.target.value)}
                                                placeholder="contact@agence.ma"
                                                className="w-full h-11 pl-9 pr-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all"
                                            />
                                            <Mail size={15} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Mot de passe (min 12 car.) *
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                autoComplete="new-password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••••••"
                                                className="w-full h-11 pl-9 pr-9 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all"
                                            />
                                            <Lock size={15} className="absolute left-3 top-3.5 text-slate-400 pointer-events-none" />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Accordéon optionnel pour RC, IF, RIB */}
                                <div className="pt-1">
                                    <button
                                        type="button"
                                        onClick={() => setShowAdvanced(!showAdvanced)}
                                        className="text-[11px] font-bold text-slate-500 hover:text-[#C9572C] transition-colors inline-flex items-center gap-1 cursor-pointer"
                                    >
                                        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        <span>Informations fiscales & bancaires (RC, IF, RIB) • Optionnel</span>
                                    </button>

                                    {showAdvanced && (
                                        <div className="mt-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                    RC & Ville
                                                </label>
                                                <input
                                                    type="text"
                                                    value={rcNumber}
                                                    onChange={(e) => setRcNumber(e.target.value)}
                                                    placeholder="94821 / Marrakech"
                                                    className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#C9572C]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                    Identifiant Fiscal (IF)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={ifNumber}
                                                    onChange={(e) => setIfNumber(e.target.value)}
                                                    placeholder="40182934"
                                                    className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#C9572C]"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                    RIB (24 Chiffres)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={ribNumber}
                                                    onChange={(e) => setRibNumber(e.target.value)}
                                                    placeholder="011 780 0000..."
                                                    className="w-full h-9 px-3 rounded-lg bg-white border border-slate-200 text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:border-[#C9572C]"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full h-11 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#C9572C]/20 active:scale-[0.99] mt-6"
                            >
                                <span>Continuer vers le premier véhicule</span>
                                <ArrowRight size={15} />
                            </button>
                        </form>
                    )}

                    {/* ÉTAPE 2 : Premier Véhicule */}
                    {step === 2 && (
                        <form onSubmit={handleFinalSubmit} className="space-y-5 animate-in fade-in">
                            <div className="space-y-1">
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                                    Votre Premier Véhicule
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Ajoutez une première voiture pour activer instantanément votre tableau de bord.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                        Modèle du véhicule *
                                    </label>
                                    <select
                                        value={firstCarModel}
                                        onChange={(e) => handleModelChange(e.target.value)}
                                        className="w-full h-11 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all cursor-pointer"
                                    >
                                        {POPULAR_FLEET_MODELS.map((car) => (
                                            <option key={car.name} value={car.name}>
                                                {car.name} {car.tag ? `(${car.tag})` : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Plaque d'immatriculation *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={firstCarPlate}
                                            onChange={(e) => setFirstCarPlate(e.target.value)}
                                            placeholder="Ex: 45821-B-26 ou WW..."
                                            className="w-full h-11 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                                            Tarif indicatif journalier (MAD)
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                min="150"
                                                max="3000"
                                                value={firstCarPriceMad}
                                                onChange={(e) => setFirstCarPriceMad(e.target.value)}
                                                className="w-full h-11 pl-3.5 pr-14 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all"
                                            />
                                            <span className="absolute right-3.5 top-3 text-xs font-bold text-slate-400">
                                                DH / jour
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Accord de transparence sobre */}
                                <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2">
                                    <label className="flex items-start gap-2.5 cursor-pointer text-slate-800 text-xs font-medium select-none">
                                        <input
                                            type="checkbox"
                                            checked={agreedCharter}
                                            onChange={(e) => setAgreedCharter(e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300 text-[#C9572C] focus:ring-[#C9572C] mt-0.5 shrink-0"
                                        />
                                        <span className="text-[11px] text-slate-600 leading-relaxed">
                                            Je certifie que mon agence est immatriculée au Maroc et m'engage à honorer les livraisons réservées avec transparence (aucun frais caché au client, véhicule conforme).
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Actions Retour & Validation */}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="h-11 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
                                >
                                    <ArrowLeft size={14} />
                                    <span>Retour</span>
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 h-11 rounded-xl bg-[#C9572C] hover:bg-[#B24922] disabled:opacity-70 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#C9572C]/20 active:scale-[0.99]"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Création du compte...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={15} />
                                            <span>Valider et Accéder à mon Espace</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </main>

            {/* Footer discret */}
            <footer className="py-4 text-center text-xs text-slate-500 border-t border-[#E7DFD5] bg-white/50">
                <div className="flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Agrément Partenaire Loueur ZwinCar Maroc • Vérification sous 24h</span>
                </div>
            </footer>
        </div>
    );
}
