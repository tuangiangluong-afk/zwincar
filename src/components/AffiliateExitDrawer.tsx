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
import { VehicleModel, CityHub, getLocalizedAirportName } from "@/lib/morocco-data";
import { buildAffiliateRentalUrl, buildAffiliateEsimUrl } from "@/lib/affiliate";
import { Locale, getTranslation } from "@/lib/i18n";
import { usePathname } from "next/navigation";

interface AffiliateExitDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    vehicle: VehicleModel;
    hub: CityHub;
    pickupDate: string;
    returnDate: string;
    locale?: Locale;
}

export function AffiliateExitDrawer({
    isOpen,
    onClose,
    vehicle,
    hub,
    pickupDate,
    returnDate,
    locale: propLocale,
}: AffiliateExitDrawerProps) {
    const pathname = usePathname() || "";
    let activeLocale: Locale = propLocale || "fr";
    if (!propLocale) {
        if (pathname.startsWith("/en")) activeLocale = "en";
        else if (pathname.startsWith("/es")) activeLocale = "es";
        else if (pathname.startsWith("/nl")) activeLocale = "nl";
    }

    const t = getTranslation(activeLocale);
    const [includeEsim, setIncludeEsim] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    React.useEffect(() => {
        if (!isOpen) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const localrentUrl = buildAffiliateRentalUrl({
        provider: "localrent",
        hubCode: hub.airportCode,
        citySlug: hub.slug,
        pickupDate,
        returnDate,
    });

    const discoverCarsUrl = buildAffiliateRentalUrl({
        provider: "discovercars",
        hubCode: hub.airportCode,
        citySlug: hub.slug,
        pickupDate,
        returnDate,
    });

    const handleProceed = (targetUrl: string) => {
        setIsRedirecting(true);

        if (includeEsim) {
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
                    window.open(buildAffiliateEsimUrl("airalo"), "_blank", "noopener,noreferrer");
                }
            } catch {
                // ignore
            }
        }

        setTimeout(() => {
            window.open(targetUrl, "_blank", "noopener,noreferrer");
            setIsRedirecting(false);
            onClose();
        }, 300);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg max-h-[92dvh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="shrink-0 bg-[#12161E] text-white p-4 sm:p-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                            <Plane size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                {t.affiliateDrawer.inventoryTitle}
                            </div>
                            <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                                {getLocalizedAirportName(hub, activeLocale)} ({hub.airportCode})
                            </h3>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                        aria-label={t.affiliateDrawer.closeAria}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content body */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4">
                    <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4 space-y-1.5 text-xs text-amber-950">
                        <div className="font-bold flex items-center gap-1.5 text-amber-900">
                            <Info size={15} />
                            <span>{t.affiliateDrawer.fleetFullTitle}</span>
                        </div>
                        <p className="text-[11px] text-amber-900/80 leading-relaxed">
                            {t.affiliateDrawer.fleetFullDesc.replace("{code}", hub.airportCode)}
                        </p>
                    </div>

                    {/* Criteria Recap */}
                    <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 grid grid-cols-2 gap-3 text-xs">
                        <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                {t.affiliateDrawer.requestedModel}
                            </span>
                            <span className="font-bold text-slate-900 block truncate">
                                {vehicle.name}
                            </span>
                            <span className="text-[11px] text-slate-500">{vehicle.category}</span>
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400 block">
                                {t.affiliateDrawer.periodLabel} ({pickupDate})
                            </span>
                            <span className="font-bold text-slate-900 block truncate">
                                {t.affiliateDrawer.untilDate.replace("{date}", returnDate)}
                            </span>
                            <span className="text-[11px] text-slate-500">{t.affiliateDrawer.terminalLabel.replace("{code}", hub.airportCode)}</span>
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
                                    {t.affiliateDrawer.esimTitle}
                                </div>
                                <div className="text-[11px] text-slate-500">
                                    {t.affiliateDrawer.esimDesc}
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

                    {/* 2 Dedicated Affiliate CTA Buttons */}
                    <div className="space-y-2.5 pt-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <button
                                type="button"
                                onClick={() => handleProceed(localrentUrl)}
                                disabled={isRedirecting}
                                className="min-h-[52px] py-2 px-3 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white transition-all flex items-center justify-center shadow-md cursor-pointer disabled:opacity-50 active:scale-95 text-center"
                            >
                                <div className="flex flex-col items-center leading-tight">
                                    <div className="flex items-center gap-1 font-black text-xs sm:text-sm">
                                        <span>Localrent</span>
                                        <ExternalLink size={12} className="shrink-0 opacity-80" />
                                    </div>
                                    <span className="text-[10px] font-semibold opacity-90">{t.affiliateDrawer.localrentSub}</span>
                                </div>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleProceed(discoverCarsUrl)}
                                disabled={isRedirecting}
                                className="min-h-[52px] py-2 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center justify-center shadow-md cursor-pointer disabled:opacity-50 active:scale-95 text-center"
                            >
                                <div className="flex flex-col items-center leading-tight">
                                    <div className="flex items-center gap-1 font-black text-xs sm:text-sm">
                                        <span>DiscoverCars</span>
                                        <ExternalLink size={12} className="shrink-0 opacity-80" />
                                    </div>
                                    <span className="text-[10px] font-semibold opacity-90">{t.affiliateDrawer.discoverCarsSub}</span>
                                </div>
                            </button>
                        </div>
                        <div className="text-center text-[10px] text-slate-400">
                            {t.affiliateDrawer.instantConfirmationNote}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
