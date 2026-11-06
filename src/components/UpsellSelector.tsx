"use client";

import React from "react";
import { Check, ShieldCheck, Wifi, Baby, Users, Clock, Tag } from "lucide-react";
import { UPSELL_OPTIONS } from "@/lib/morocco-data";
import { Locale, getTranslation } from "@/lib/i18n";

interface UpsellSelectorProps {
    days?: number;
    selectedUpsells: string[];
    onToggle: (id: string) => void;
    currency?: "EUR" | "MAD";
    locale?: Locale;
}

export default function UpsellSelector({
    days = 6,
    selectedUpsells,
    onToggle,
    currency = "EUR",
    locale = "fr",
}: UpsellSelectorProps) {
    const t = getTranslation(locale);

    const labels = {
        included: { fr: "Inclus", en: "Included", es: "Incluido", nl: "Inbegrepen" }[locale] || "Inclus",
        perDay: { fr: "/j", en: "/day", es: "/día", nl: "/dag" }[locale] || "/j",
        stay: { fr: "séjour", en: "stay", es: "estancia", nl: "verblijf" }[locale] || "séjour",
    };

    const getIcon = (id: string, isSelected: boolean) => {
        const iconClass = isSelected ? "text-[#C9572C]" : "text-slate-600";
        switch (id) {
            case "franchise-zero":
                return <ShieldCheck size={18} className={iconClass} />;
            case "esim-maroc":
                return <Wifi size={18} className={iconClass} />;
            case "siege-bebe":
                return <Baby size={18} className={iconClass} />;
            case "conducteur-additionnel":
                return <Users size={18} className={iconClass} />;
            case "restitution-flexible":
                return <Clock size={18} className={iconClass} />;
            default:
                return <Tag size={18} className={iconClass} />;
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {t.bookingWidget.optionsTitle}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                        {t.bookingWidget.optionsSubtitle}
                    </p>
                </div>
            </div>

            <div className="space-y-2">
                {UPSELL_OPTIONS.map((upsell) => {
                    const isSelected = selectedUpsells.includes(upsell.id);
                    const totalCostEur =
                        upsell.type === "per_day" ? upsell.priceEur * days : upsell.priceEur;
                    const totalCostMad =
                        upsell.type === "per_day" ? upsell.priceMad * days : upsell.priceMad;

                    const title = (locale !== "fr" && upsell.nameEn) ? upsell.nameEn : upsell.name;
                    const subtitle = (locale !== "fr" && upsell.taglineEn) ? upsell.taglineEn : upsell.tagline;

                    return (
                        <div
                            key={upsell.id}
                            onClick={() => onToggle(upsell.id)}
                            className={`p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 text-left ${
                                isSelected
                                    ? "bg-[#FAF7F2] border-[#C9572C] shadow-xs ring-1 ring-[#C9572C]/20"
                                    : "bg-white border-slate-200/80 hover:border-slate-300"
                            }`}
                        >
                            <div className="flex items-center gap-3 min-w-0">
                                <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                        isSelected ? "bg-[#C9572C]/10" : "bg-slate-100"
                                    }`}
                                >
                                    {getIcon(upsell.id, isSelected)}
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                                        {title}
                                    </div>
                                    <p className="text-[11px] text-slate-500 truncate">
                                        {subtitle}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right shrink-0 flex items-center gap-3">
                                <div>
                                    {upsell.priceEur === 0 ? (
                                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                            {labels.included}
                                        </span>
                                    ) : (
                                        <div className="text-right">
                                            <div className="text-xs sm:text-sm font-black text-slate-900">
                                                {currency === "EUR" ? `+${totalCostEur} €` : `+${totalCostMad} DH`}
                                            </div>
                                            <div className="text-[10px] text-slate-400">
                                                {upsell.type === "per_day"
                                                    ? currency === "EUR"
                                                        ? `${upsell.priceEur} €${labels.perDay}`
                                                        : `${upsell.priceMad} DH${labels.perDay}`
                                                    : labels.stay}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                        isSelected
                                            ? "bg-[#C9572C] border-[#C9572C] text-white"
                                            : "border-slate-300 bg-white"
                                    }`}
                                >
                                    {isSelected && <Check size={12} strokeWidth={3} />}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
