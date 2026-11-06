"use client";

import React, { useState } from "react";
import {
    X,
    ExternalLink,
    Plane,
    Wifi,
    Check,
    Calendar,
    MapPin,
    ArrowRight,
    ShieldAlert,
    Info,
} from "lucide-react";
import { VehicleModel, CityHub } from "@/lib/morocco-data";
import { buildAffiliateRentalUrl } from "@/lib/affiliate";

interface AffiliateExitDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: VehicleModel;
    hub: CityHub;
    pickupDate: string;
    returnDate: string;
}

export function AffiliateExitDrawer({
    isOpen,
    onClose,
    vehicle,
    hub,
    pickupDate,
    returnDate,
}: AffiliateExitDrawerProps) {
    const [includeEsim, setIncludeEsim] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    if (!isOpen) return null;

    const affiliateUrl = buildAffiliateRentalUrl({
        provider: "discovercars",
        hubCode: hub.airportCode,
        citySlug: hub.slug,
        pickupDate,
        returnDate,
    });

    const handleProceed = () => {
        setIsRedirecting(true);

        if (includeEsim) {
            // Store eSIM intent in localStorage so user can complete it later or on return
            try {
                if (typeof window !== "undefined") {
                    localStorage.setItem(
                        "zwincar_pending_esim",
                        JSON.stringify({
                            hub: hub.slug,
                            date: new Date().toISOString(),
                            priceEur: 19,
                        })
                    );
                }
            } catch {
                // ignore
            }
        }

        setTimeout(() => {
            window.open(affiliateUrl, "_blank", "noopener,noreferrer");
            setIsRedirecting(false);
            onClose();
        }, 500);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="bg-[#12161E] text-white p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                            <Plane size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                Inventaire Partenaire Aéroport
                            </div>
                            <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                                {hub.airportName} ({hub.airportCode})
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

                {/* Transparency Notice */}
                <div className="p-6 space-y-5">
                    <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 space-y-1.5 text-xs text-amber-950">
                        <div className="font-bold flex items-center gap-1.5 text-amber-900">
                            <Info size={15} />
                            <span>Flotte locale ZwinCar complète sur ces dates</span>
                        </div>
                        <p className="text-[11px] text-amber-900/80 leading-relaxed">
                            Pour vous garantir une solution de mobilité à l'arrivée, nous interrogeons en direct l'inventaire des comptoirs officiels du terminal ({hub.airportCode}) via notre partenaire DiscoverCars.
                        </p>
                    </div>

                    {/* Criteria Recap */}
                    <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                Modèle recherché
                            </span>
                            <span className="font-bold text-slate-900 block truncate">
                                {vehicle.name}
                            </span>
                            <span className="text-[11px] text-slate-500">{vehicle.category}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                Période ({pickupDate})
                            </span>
                            <span className="font-bold text-slate-900 block truncate">
                                Au {returnDate}
                            </span>
                            <span className="text-[11px] text-slate-500">Terminal {hub.airportCode}</span>
                        </div>
                    </div>

                    {/* Pre-Exit Upsell: eSIM Maroc 20 Go 5G */}
                    <div
                        onClick={() => setIncludeEsim(!includeEsim)}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                            includeEsim
                                ? "bg-white border-[#C9572C] ring-1 ring-[#C9572C]/20 shadow-xs"
                                : "bg-white border-slate-200/80 hover:border-slate-300"
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                <Wifi size={18} />
                            </div>
                            <div>
                                <div className="text-xs sm:text-sm font-bold text-slate-900">
                                    eSIM Maroc 20 Go 5G (Optionnel)
                                </div>
                                <div className="text-[11px] text-slate-500">
                                    Data immédiate dès la sortie de l'avion sans faire la queue
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                            <span className="text-xs font-black text-slate-900 font-mono">+19 €</span>
                            <div
                                className={`w-5 h-5 rounded-md border flex items-center justify-center transition ${
                                    includeEsim
                                        ? "bg-[#C9572C] border-[#C9572C] text-white"
                                        : "border-slate-300 bg-white"
                                }`}
                            >
                                {includeEsim && <Check size={12} strokeWidth={3} />}
                            </div>
                        </div>
                    </div>

                    {/* CTA Redirect Button */}
                    <div className="space-y-2 pt-1">
                        <button
                            type="button"
                            onClick={handleProceed}
                            disabled={isRedirecting}
                            className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-[#C9572C] text-white font-bold text-xs sm:text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                        >
                            <span>
                                {isRedirecting
                                    ? "Ouverture des offres aéroport..."
                                    : `Voir les véhicules disponibles à ${hub.name} (${hub.airportCode})`}
                            </span>
                            <ExternalLink size={15} />
                        </button>
                        <div className="text-center text-[10px] text-slate-400">
                            L'inventaire partenaire s'ouvre dans un nouvel onglet sécurisé.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
