"use client";

import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import type { Locale } from "@/lib/i18n";

interface MobileHomeStickyBarProps {
    locale?: Locale;
    minPriceEur?: number;
    isAffiliate?: boolean;
}

export function MobileHomeStickyBar({
    locale = "fr",
    minPriceEur = 26,
    isAffiliate = false,
}: MobileHomeStickyBarProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    setVisible(window.scrollY > 420);
                    ticking = false;
                });
                ticking = true;
            }
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    const subtitle = isAffiliate
        ? locale === "en"
            ? "Verified airport partners"
            : locale === "es"
            ? "Socios verificados aeropuerto"
            : locale === "nl"
            ? "Geverifieerde luchthavenpartners"
            : "Partenaires vérifiés aéroport"
        : locale === "en"
        ? "€0 deposit option • Debit & cash"
        : locale === "es"
        ? "Opción 0 € fianza • Débito y efectivo"
        : locale === "nl"
        ? "€ 0 borg optie • Pin & contant"
        : "Option 0 € caution • Débit & espèces";

    const cta =
        locale === "en"
            ? "See cars"
            : locale === "es"
            ? "Ver coches"
            : locale === "nl"
            ? "Bekijk auto's"
            : "Voir les voitures";

    const priceLabel =
        locale === "en"
            ? `From ${minPriceEur} €/day`
            : locale === "es"
            ? `Desde ${minPriceEur} €/día`
            : locale === "nl"
            ? `Vanaf ${minPriceEur} €/dag`
            : `Dès ${minPriceEur} €/j`;

    return (
        <div className="lg:hidden fixed inset-x-0 bottom-0 z-30 border-t border-[#E7DFD5] bg-white/95 backdrop-blur-md px-4 py-2.5 pb-[max(0.65rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(18,22,30,0.08)] flex items-center justify-between gap-3">
            <div className="min-w-0">
                <div className="text-sm font-black text-slate-900 leading-tight whitespace-nowrap">
                    {priceLabel}
                </div>
                <div className="text-[11px] font-medium text-slate-500 truncate">
                    {subtitle}
                </div>
            </div>
            <button
                type="button"
                onClick={() => {
                    document
                        .getElementById("vehicle-catalog")
                        ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="shrink-0 h-10 px-4 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-xs tracking-wide shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
                <span>{cta}</span>
                <ArrowDown size={14} />
            </button>
        </div>
    );
}
