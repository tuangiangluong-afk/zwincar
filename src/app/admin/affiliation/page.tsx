"use client";

import React, { useState } from "react";
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
} from "lucide-react";
import { MOROCCAN_HUBS, VEHICLE_FLEET } from "@/lib/morocco-data";
import {
    DEFAULT_HUB_DISTRIBUTION,
    DEFAULT_VEHICLE_STOCK,
    DistributionMode,
    AFFILIATE_PROVIDERS,
    buildAffiliateRentalUrl,
} from "@/lib/affiliate";

export default function AdminAffiliationPage() {
    const [hubDistribution, setHubDistribution] = useState<Record<string, DistributionMode>>(
        DEFAULT_HUB_DISTRIBUTION
    );
    const [vehicleStock, setVehicleStock] = useState<Record<string, boolean>>(
        DEFAULT_VEHICLE_STOCK
    );
    const [selectedProvider, setSelectedProvider] = useState<"discovercars" | "localrent" | "economybookings">("discovercars");
    const [markerId, setMarkerId] = useState("zwincar");
    const [savedNotification, setSavedNotification] = useState(false);

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

    const handleSave = () => {
        setSavedNotification(true);
        setTimeout(() => setSavedNotification(false), 2500);
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
                        Basculez chaque aéroport en Direct, Hybride ou 100% Affiliation pour ne perdre aucune réservation en haute saison.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleSave}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#C9572C] text-white text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
                >
                    <Save size={15} />
                    <span>{savedNotification ? "Modifications Enregistrées !" : "Sauvegarder les Paramètres"}</span>
                </button>
            </div>

            {/* Notification alert */}
            {savedNotification && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-semibold text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span>Configuration de distribution mise à jour avec succès sur l'ensemble du réseau ZwinCar.</span>
                </div>
            )}

            {/* 3 Situations Explanation Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                        <span>Mode 1 : Direct Local (100%)</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                        Vos agences partenaires locales encaissent le client. Marge max ZwinCar (acompte 20% + options 100% Stripe). Idéal en basse/moyenne saison.
                    </p>
                </div>

                <div className="p-4.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                        <span>Mode 2 : Hybride Intelligent</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                        Flotte ZwinCar en priorité. Si le stock est épuisé sur un modèle ou des dates saturées, bascule automatique sur DiscoverCars avec deep-link tracké.
                    </p>
                </div>

                <div className="p-4.5 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        <span>Mode 3 : 100% Affiliation</span>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-[11px]">
                        Pour les aéroports sans agence signée (ex: Nador, Oujda) ou saturation estivale complète. Zéro logistique, 30 € à 55 € de com' par résa.
                    </p>
                </div>
            </div>

            {/* Hub Distribution Management Grid */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-black text-slate-900">
                            Distribution par Aéroport & Ville
                        </h2>
                        <p className="text-xs text-slate-500">
                            Configurez le comportement de chaque hub en un clic.
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
                            placeholder="ex: zwincar ou 612480"
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
