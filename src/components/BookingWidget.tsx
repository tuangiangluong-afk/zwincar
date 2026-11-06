"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
    MapPin,
    Calendar,
    Search,
    ShieldCheck,
    Check,
    ChevronDown,
    Car,
} from "lucide-react";
import { MOROCCAN_HUBS } from "@/lib/morocco-data";
import { Locale, getTranslation } from "@/lib/i18n";

interface BookingWidgetProps {
    onSearch?: (searchState: SearchState) => void;
    compact?: boolean;
    city?: any;
    defaultHubSlug?: string;
    locale?: Locale;
}

export interface SearchState {
    pickupHub: string;
    returnHub: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    transmission: "all" | "automatic" | "manual";
    sameReturnLocation: boolean;
    noDepositOnly: boolean;
}

export function BookingWidget({
    onSearch,
    compact = false,
    defaultHubSlug = "marrakech",
    locale: propLocale,
}: BookingWidgetProps) {
    const pathname = usePathname() || "";
    let activeLocale: Locale = propLocale || "fr";
    if (!propLocale) {
        if (pathname.startsWith("/en")) activeLocale = "en";
        else if (pathname.startsWith("/es")) activeLocale = "es";
        else if (pathname.startsWith("/nl")) activeLocale = "nl";
    }

    const t = getTranslation(activeLocale);

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 2);
    const returnDay = new Date(today);
    returnDay.setDate(today.getDate() + 7);

    const formatDateInput = (d: Date) => d.toISOString().split("T")[0];

    const [state, setState] = useState<SearchState>({
        pickupHub: defaultHubSlug,
        returnHub: defaultHubSlug,
        pickupDate: formatDateInput(tomorrow),
        pickupTime: "11:00",
        returnDate: formatDateInput(returnDay),
        returnTime: "11:00",
        transmission: "all",
        sameReturnLocation: true,
        noDepositOnly: true,
    });

    const [showHubDropdown, setShowHubDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const currentHub = MOROCCAN_HUBS.find((h) => h.slug === state.pickupHub) || MOROCCAN_HUBS[0];

    const handleSearch = () => {
        setIsSearching(true);
        if (onSearch) {
            onSearch(state);
        }
        setTimeout(() => {
            setIsSearching(false);
            if (typeof window !== "undefined" && state.pickupHub !== defaultHubSlug) {
                const prefix = activeLocale === "fr" ? "/maroc" : `/${activeLocale}`;
                window.location.href = `${prefix}/${state.pickupHub}#vehicle-catalog`;
                return;
            }
            const catalog = document.getElementById("vehicle-catalog");
            if (catalog) {
                catalog.scrollIntoView({ behavior: "smooth" });
            }
        }, 300);
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Widget Container */}
            <div className="rounded-3xl bg-white border border-[#E7DFD5] p-5 sm:p-7 md:p-8 shadow-[0_20px_50px_rgba(18,22,30,0.06)] relative z-20">
                {/* Top Quick Filters & Guarantee Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-slate-100 text-xs">
                    {/* Toggle same return */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() =>
                                setState((prev) => ({
                                    ...prev,
                                    sameReturnLocation: !prev.sameReturnLocation,
                                }))
                            }
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition cursor-pointer ${
                                state.sameReturnLocation
                                    ? "bg-slate-900 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            <Check size={13} className={state.sameReturnLocation ? "opacity-100" : "opacity-0"} />
                            {t.search.sameReturn}
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                setState((prev) => ({
                                    ...prev,
                                    transmission:
                                        prev.transmission === "automatic" ? "all" : "automatic",
                                }))
                            }
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition cursor-pointer ${
                                state.transmission === "automatic"
                                    ? "bg-[#C9572C] text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            <Car size={13} />
                            {t.search.autoOnly}
                        </button>
                    </div>

                    {/* Zero caution badge indicator */}
                    <div className="flex items-center gap-1.5 text-slate-700 bg-[#FAF7F2] border border-[#E7DFD5] px-3 py-1.5 rounded-full font-semibold">
                        <ShieldCheck size={14} className="text-[#C9572C]" />
                        <span>{t.search.noDepositHoldNotice}</span>
                    </div>
                </div>

                {/* Main Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                    {/* Pickup Location */}
                    <div
                        className={`${
                            state.sameReturnLocation ? "md:col-span-5" : "md:col-span-3"
                        } relative`}
                    >
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            {t.search.pickupLocation}
                        </label>
                        <div
                            onClick={() => setShowHubDropdown(!showHubDropdown)}
                            className="flex items-center justify-between w-full h-[54px] px-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] hover:border-slate-400 transition cursor-pointer"
                        >
                            <div className="flex items-center gap-2.5 truncate">
                                <MapPin size={18} className="text-[#C9572C] shrink-0" />
                                <div className="truncate text-left">
                                    <div className="text-sm font-bold text-slate-900 truncate">
                                        {currentHub.name} ({currentHub.airportCode})
                                    </div>
                                    <div className="text-[11px] text-slate-500 truncate">
                                        {currentHub.airportName}
                                    </div>
                                </div>
                            </div>
                            <ChevronDown size={16} className="text-slate-400 shrink-0 ml-1" />
                        </div>

                        {/* Dropdown Hubs */}
                        {showHubDropdown && (
                            <div className="absolute top-[80px] left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 max-h-72 overflow-y-auto">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1.5">
                                    {t.search.pickupPlaceholder}
                                </div>
                                {MOROCCAN_HUBS.map((hub) => (
                                    <button
                                        key={hub.slug}
                                        type="button"
                                        onClick={() => {
                                            setState((prev) => ({
                                                ...prev,
                                                pickupHub: hub.slug,
                                                returnHub: prev.sameReturnLocation ? hub.slug : prev.returnHub,
                                            }));
                                            setShowHubDropdown(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-sm transition ${
                                            state.pickupHub === hub.slug
                                                ? "bg-[#C9572C]/10 text-[#C9572C] font-bold"
                                                : "hover:bg-slate-50 text-slate-800"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{hub.name}</span>
                                            <span className="text-xs text-slate-400">
                                                ({hub.airportCode})
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-500 font-mono">
                                            {hub.avgDailyPriceEur}€ / {t.bookingWidget.perDay}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Different Return Location (If toggled) */}
                    {!state.sameReturnLocation && (
                        <div className="md:col-span-3">
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                {t.search.dropoffLocation}
                            </label>
                            <select
                                value={state.returnHub}
                                onChange={(e) =>
                                    setState((prev) => ({ ...prev, returnHub: e.target.value }))
                                }
                                className="w-full h-[54px] px-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                            >
                                {MOROCCAN_HUBS.map((hub) => (
                                    <option key={hub.slug} value={hub.slug}>
                                        {hub.name} ({hub.airportCode})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Departure Date & Time */}
                    <div
                        className={
                            state.sameReturnLocation ? "md:col-span-3" : "md:col-span-3"
                        }
                    >
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            {t.search.pickupDate}
                        </label>
                        <div className="flex items-center h-[54px] rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] px-2.5 sm:px-3 gap-1.5 sm:gap-2">
                            <Calendar size={15} className="text-[#C9572C] shrink-0" />
                            <input
                                type="date"
                                value={state.pickupDate}
                                min={formatDateInput(today)}
                                onChange={(e) =>
                                    setState((prev) => ({ ...prev, pickupDate: e.target.value }))
                                }
                                className="w-full min-w-0 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:p-0"
                            />
                            <input
                                type="time"
                                value={state.pickupTime}
                                onChange={(e) =>
                                    setState((prev) => ({ ...prev, pickupTime: e.target.value }))
                                }
                                className="w-[58px] sm:w-[64px] shrink-0 bg-transparent text-xs font-mono font-medium text-slate-700 focus:outline-none border-l border-slate-200/90 pl-1.5 text-center"
                            />
                        </div>
                    </div>

                    {/* Return Date & Time */}
                    <div
                        className={
                            state.sameReturnLocation ? "md:col-span-4" : "md:col-span-3"
                        }
                    >
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                            {t.search.returnDate}
                        </label>
                        <div className="flex items-center h-[54px] rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] px-2.5 sm:px-3 gap-1.5 sm:gap-2">
                            <Calendar size={15} className="text-[#C9572C] shrink-0" />
                            <input
                                type="date"
                                value={state.returnDate}
                                min={state.pickupDate}
                                onChange={(e) =>
                                    setState((prev) => ({ ...prev, returnDate: e.target.value }))
                                }
                                className="w-full min-w-0 bg-transparent text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 [&::-webkit-calendar-picker-indicator]:p-0"
                            />
                            <input
                                type="time"
                                value={state.returnTime}
                                onChange={(e) =>
                                    setState((prev) => ({ ...prev, returnTime: e.target.value }))
                                }
                                className="w-[58px] sm:w-[64px] shrink-0 bg-transparent text-xs font-mono font-medium text-slate-700 focus:outline-none border-l border-slate-200/90 pl-1.5 text-center"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Action Row */}
                <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 shrink-0">
                            <Check size={14} className="text-[#C9572C]" />
                            {t.search.exactModelPill}
                        </span>
                        <span className="flex items-center gap-1 shrink-0">
                            <Check size={14} className="text-[#C9572C]" />
                            {t.search.freeCancellationPill}
                        </span>
                        <span className="flex items-center gap-1 shrink-0 hidden sm:flex">
                            <Check size={14} className="text-[#C9572C]" />
                            {t.search.airportDeliveryPill}
                        </span>
                    </div>

                    <button
                        type="button"
                        onClick={handleSearch}
                        className="w-full sm:w-auto h-[52px] px-8 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] whitespace-nowrap shrink-0"
                    >
                        <Search size={16} />
                        <span>{isSearching ? t.search.searchingBtn : t.search.ctaButton}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookingWidget;
