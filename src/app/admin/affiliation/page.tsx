"use client";

import React, { useState, useEffect } from "react";
import {
    Share2,
    ToggleLeft,
    ToggleRight,
    Plane,
    Car,
    ShieldCheck,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    Save,
    Sparkles,
    Settings,
    HelpCircle,
    Zap,
    Flame,
} from "lucide-react";
import { MOROCCAN_HUBS, VEHICLE_FLEET } from "@/lib/morocco-data";
import {
    DEFAULT_HUB_DISTRIBUTION,
    DEFAULT_VEHICLE_STOCK,
    DistributionMode,
    GlobalDistributionMode,
    AFFILIATE_PROVIDERS,
    buildAffiliateRentalUrl,
    getGlobalDistributionMode,
    setGlobalDistributionMode,
    isPopTabOnSearchEnabled,
    setPopTabOnSearchEnabled,
} from "@/lib/affiliate";

export default function AdminAffiliationPage() {
    const [globalMode, setGlobalMode] = useState<GlobalDistributionMode>("affiliate");
    const [popTabOnSearch, setPopTabOnSearch] = useState<boolean>(true);
    const [hubDistribution, setHubDistribution] = useState<Record<string, DistributionMode>>(
        DEFAULT_HUB_DISTRIBUTION
    );
    const [vehicleStock, setVehicleStock] = useState<Record<string, boolean>>(
        DEFAULT_VEHICLE_STOCK
    );
    const [selectedProvider, setSelectedProvider] = useState<"discovercars" | "localrent" | "economybookings">("discovercars");
    const [markerId, setMarkerId] = useState("596733");
    const [savedNotification, setSavedNotification] = useState<string | null>(null);

    // Initial load from storage / API
    useEffect(() => {
        setGlobalMode(getGlobalDistributionMode());
        setPopTabOnSearch(isPopTabOnSearchEnabled());

        fetch("/api/admin/distribution")
            .then((res) => res.json())
            .then((data) => {
                if (data.globalMode) setGlobalMode(data.globalMode);
                if (typeof data.popTabOnSearch === "boolean") setPopTabOnSearch(data.popTabOnSearch);
            })
            .catch(() => {});
    }, []);

    const handleGlobalModeSwitch = async (mode: GlobalDistributionMode) => {
        setGlobalMode(mode);
        setGlobalDistributionMode(mode);
        try {
            await fetch("/api/admin/distribution", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ globalMode: mode, popTabOnSearch }),
            });
            showNotification(`Mode global basculé sur : ${mode === "affiliate" ? "100% Affiliation" : mode === "hybrid" ? "Hybride Intelligent" : "100% Flotte Directe"}`);
        } catch {
            showNotification("Mode appliqué localement.");
        }
    };

    const handlePopTabToggle = async () => {
        const next = !popTabOnSearch;
        setPopTabOnSearch(next);
        setPopTabOnSearchEnabled(next);
        try {
            await fetch("/api/admin/distribution", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ globalMode, popTabOnSearch: next }),
            });
            showNotification(`Pop-Tab au clic recherche : ${next ? "ACTIVÉ (Option 2)" : "DÉSACTIVÉ"}`);
        } catch {
            showNotification("Option Pop-Tab mise à jour localement.");
        }
    };

    const handleHubModeChange = (slug: string, mode: DistributionMode) => {
        setHubDistribution((prev) => ({
            ...prev,
            [slug]: mode,
        }));
    };

    const handleVehicleStockToggle = (id: string) => {
        setVehicleStock((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const showNotification = (msg: string) => {
        setSavedNotification(msg);
        setTimeout(() => setSavedNotification(null), 3000);
    };

    const handleSaveAll = async () => {
        setGlobalDistributionMode(globalMode);
        setPopTabOnSearchEnabled(popTabOnSearch);
        try {
            await fetch("/api/admin/distribution", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ globalMode, popTabOnSearch, hubDistribution, vehicleStock }),
            });
            showNotification("Tous les paramètres ont été enregistrés et sont actifs sur le site.");
        } catch {
            showNotification("Paramètres sauvegardés localement.");
        }
    };

    // Live generated test URL
    const previewUrl = buildAffiliateRentalUrl({
        provider: selectedProvider,
        hubCode: "RAK",
        citySlug: "marrakech",
        pickupDate: "2026-07-15",
        returnDate: "2026-07-22",
        marker: markerId,
    });

    return (
        <div className="space-y-8 max-w-6xl">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9572C]">
                        <Share2 size={16} />
                        <span>Moteur de Monétisation Hybride & Fallback</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                        Distribution Directe & Affiliation Travelpayouts
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                        Basculez l'ensemble du site en 1 clic entre le mode 100% Affiliation et la Flotte Directe.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleSaveAll}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#C9572C] text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
                >
                    <Save size={15} />
                    <span>Sauvegarder les Paramètres</span>
                </button>
            </div>

            {/* Notification alert */}
            {savedNotification && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-semibold text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <span>{savedNotification}</span>
                </div>
            )}

            {/* MASTER GLOBAL TOGGLE: 3 CARDS */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Interrupteur Maître — Mode de Monétisation Global
                    </span>
                    <span className="text-[11px] font-bold text-[#C9572C]">
                        Prend effet instantanément sans redémarrage
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Mode 1: 100% Affiliation (RECOMMENDED BEFORE PARTNERS) */}
                    <div
                        onClick={() => handleGlobalModeSwitch("affiliate")}
                        className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative ${
                            globalMode === "affiliate"
                                ? "bg-amber-50/50 border-amber-500 shadow-md ring-2 ring-amber-500/20"
                                : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-amber-500 text-white">
                                <Zap size={13} />
                                100% Affiliation
                            </span>
                            {globalMode === "affiliate" && (
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                                    ACTIF
                                </span>
                            )}
                        </div>
                        <h3 className="font-black text-slate-900 text-base mb-1">
                            Mode Zéro Gestion Locale
                        </h3>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            <strong>Idéal dès maintenant :</strong> Toutes les demandes de réservation et boutons du catalogue ouvrent directement DiscoverCars ou Localrent avec vos liens Travelpayouts trackés. 25 € à 55 € de commission par réservation.
                        </p>
                    </div>

                    {/* Mode 2: Hybride Intelligent */}
                    <div
                        onClick={() => handleGlobalModeSwitch("hybrid")}
                        className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative ${
                            globalMode === "hybrid"
                                ? "bg-blue-50/50 border-blue-500 shadow-md ring-2 ring-blue-500/20"
                                : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-600 text-white">
                                <Sparkles size={13} />
                                Hybride Intelligent
                            </span>
                            {globalMode === "hybrid" && (
                                <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                                    ACTIF
                                </span>
                            )}
                        </div>
                        <h3 className="font-black text-slate-900 text-base mb-1">
                            Bascule Dynamique
                        </h3>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            Flotte ZwinCar en priorité si vous avez un loueur partenaire sur la ville. Si le modèle est en rupture ou le hub non couvert, bascule automatique sur DiscoverCars/Localrent.
                        </p>
                    </div>

                    {/* Mode 3: 100% Flotte Directe */}
                    <div
                        onClick={() => handleGlobalModeSwitch("direct")}
                        className={`p-5 rounded-3xl border-2 transition-all cursor-pointer relative ${
                            globalMode === "direct"
                                ? "bg-emerald-50/50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20"
                                : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-600 text-white">
                                <ShieldCheck size={13} />
                                Flotte Directe (100%)
                            </span>
                            {globalMode === "direct" && (
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                                    ACTIF
                                </span>
                            )}
                        </div>
                        <h3 className="font-black text-slate-900 text-base mb-1">
                            Encaissement 100% ZwinCar
                        </h3>
                        <p className="text-slate-600 text-xs leading-relaxed">
                            Réservations directes avec paiement de l'acompte sur votre Stripe ZwinCar + suivi WhatsApp VIP avec vos chauffeurs/agences locales sous contrat.
                        </p>
                    </div>
                </div>
            </div>

            {/* OPTION 2: POP-TAB AU CLIC RECHERCHE */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
                            Option 2 • Technique Kayak / Skyscanner
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                            Pop-Tab en arrière-plan au clic « Trouver mon véhicule »
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                        Dès qu'un visiteur valide sa recherche de dates dans le moteur principal, ZwinCar scrolle vers les offres du site <strong>ET ouvre en même temps DiscoverCars dans un 2ème onglet</strong> avec les dates et l'aéroport pré-remplis. Le cookie d'affiliation Travelpayouts (30 jours) est posé d'office.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handlePopTabToggle}
                    className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition cursor-pointer shrink-0 ${
                        popTabOnSearch
                            ? "bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                    }`}
                >
                    {popTabOnSearch ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                    <span>{popTabOnSearch ? "Pop-Tab ACTIVÉ" : "Pop-Tab DÉSACTIVÉ"}</span>
                </button>
            </div>

            {/* Hub Distribution Management Grid */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-black text-slate-900">
                            Distribution par Aéroport & Ville (Mode Hybride Uniquement)
                        </h2>
                        <p className="text-xs text-slate-500">
                            Actif quand le Master Switch est sur « Hybride Intelligent ».
                        </p>
                    </div>
                </div>

                <div className="divide-y divide-slate-100">
                    {MOROCCAN_HUBS.map((hub) => {
                        const currentMode = hubDistribution[hub.slug] || "hybrid";

                        return (
                            <div
                                key={hub.slug}
                                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                                        {hub.airportCode}
                                    </div>
                                    <div>
                                        <div className="font-bold text-xs sm:text-sm text-slate-900">
                                            {hub.name} — {hub.airportName}
                                        </div>
                                        <div className="text-[11px] text-slate-400">
                                            Tarif moyen : {hub.avgDailyPriceEur} €/j • {hub.slug}
                                        </div>
                                    </div>
                                </div>

                                {/* 3-Way Mode Switch */}
                                <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold self-start sm:self-auto">
                                    <button
                                        type="button"
                                        onClick={() => handleHubModeChange(hub.slug, "direct")}
                                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                                            currentMode === "direct"
                                                ? "bg-emerald-600 text-white shadow-xs font-bold"
                                                : "text-slate-600 hover:text-slate-900"
                                        }`}
                                    >
                                        Direct (100%)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleHubModeChange(hub.slug, "hybrid")}
                                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                                            currentMode === "hybrid"
                                                ? "bg-slate-900 text-white shadow-xs font-bold"
                                                : "text-slate-600 hover:text-slate-900"
                                        }`}
                                    >
                                        Hybride Auto
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleHubModeChange(hub.slug, "affiliate")}
                                        className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                                            currentMode === "affiliate"
                                                ? "bg-amber-600 text-white shadow-xs font-bold"
                                                : "text-slate-600 hover:text-slate-900"
                                        }`}
                                    >
                                        Affiliation (100%)
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Vehicle Stock Toggle (Haute Saison / Rupture) */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
                <div>
                    <h2 className="text-base font-black text-slate-900">
                        Stock Flotte Directe par Véhicule
                    </h2>
                    <p className="text-xs text-slate-500">
                        Si une catégorie est saturée chez vos loueurs locaux, basculez-la en rupture pour déclencher le fallback partenaire.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {VEHICLE_FLEET.map((vehicle) => {
                        const inStock = vehicleStock[vehicle.id] ?? true;

                        return (
                            <div
                                key={vehicle.id}
                                className={`p-4 rounded-2xl border transition-all ${
                                    inStock
                                        ? "bg-white border-slate-200"
                                        : "bg-slate-50/80 border-amber-200"
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                        {vehicle.category}
                                    </span>
                                    <span
                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            inStock
                                                ? "bg-emerald-50 text-emerald-800"
                                                : "bg-amber-100 text-amber-900"
                                        }`}
                                    >
                                        {inStock ? "En Stock Local" : "Rupture (Affi)"}
                                    </span>
                                </div>

                                <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                                    {vehicle.name}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5">
                                    {vehicle.dailyPriceEur} €/j • {vehicle.transmission}
                                </div>

                                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-600 font-medium">
                                        Flotte ZwinCar dispo :
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleVehicleStockToggle(vehicle.id)}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                                            inStock
                                                ? "bg-slate-900 text-white"
                                                : "bg-amber-500 text-white"
                                        }`}
                                    >
                                        {inStock ? "Disponible" : "Complet"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Travelpayouts Tracking Parameters & Deep-Link Tester */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
                <div>
                    <h2 className="text-base font-black text-slate-900">
                        Paramètres Travelpayouts & Partenaire d'Affiliation
                    </h2>
                    <p className="text-xs text-slate-500">
                        Votre identifiant d'affilié injecté dans les URLs pour percevoir les commissions automatiquement.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                            Partenaire par défaut
                        </label>
                        <select
                            value={selectedProvider}
                            onChange={(e) => setSelectedProvider(e.target.value as any)}
                            className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                        >
                            {AFFILIATE_PROVIDERS.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} — {p.commissionRate}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                            Travelpayouts Marker ID
                        </label>
                        <input
                            type="text"
                            value={markerId}
                            onChange={(e) => setMarkerId(e.target.value)}
                            placeholder="ex: 596733"
                            className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 font-mono focus:outline-none focus:border-[#C9572C]"
                        />
                    </div>
                </div>

                {/* Deep-Link Live Preview Box */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2 text-xs">
                    <div className="font-bold text-slate-700 flex items-center justify-between">
                        <span>Aperçu en direct du Deep-Link généré pour Marrakech (15 au 22 Juillet 2026) :</span>
                        <a
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#C9572C] hover:underline flex items-center gap-1 font-semibold"
                        >
                            <span>Tester le lien</span>
                            <ExternalLink size={12} />
                        </a>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 font-mono text-[11px] text-slate-600 break-all select-all">
                        {previewUrl}
                    </div>
                </div>
            </div>
        </div>
    );
}
