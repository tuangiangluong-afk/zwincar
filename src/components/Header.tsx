"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, Globe, Menu, X, ShieldCheck, ChevronDown, ShieldAlert, BookOpen, FileText } from "lucide-react";
import Logo from "@/components/Logo";
import { MOROCCAN_HUBS } from "@/lib/morocco-data";
import { PURCHASE_INTENTS } from "@/lib/intent-data";
import { SosModal } from "@/components/SosModal";
import { BookingLookupModal } from "@/components/BookingLookupModal";
import { Locale, getTranslation } from "@/lib/i18n";
import { trackWhatsAppClick } from "@/lib/gtm";

interface HeaderProps {
    locale?: Locale;
}

export default function Header({ locale: propLocale }: HeaderProps = {}) {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hubsDropdownOpen, setHubsDropdownOpen] = useState(false);
    const [sosModalOpen, setSosModalOpen] = useState(false);
    const [lookupModalOpen, setLookupModalOpen] = useState(false);

    // Lock background scroll when mobile menu or modal is open
    useEffect(() => {
        if (mobileMenuOpen || sosModalOpen || lookupModalOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = originalOverflow;
            };
        }
    }, [mobileMenuOpen, sosModalOpen, lookupModalOpen]);

    // Detect current locale from prop or pathname
    const currentLocale: Locale = propLocale || (pathname?.startsWith("/en")
        ? "en"
        : pathname?.startsWith("/es")
        ? "es"
        : pathname?.startsWith("/nl")
        ? "nl"
        : "fr");

    const t = getTranslation(currentLocale);

    const homeHref = currentLocale === "fr" ? "/" : `/${currentLocale}`;
    const catalogHref = `${homeHref}#vehicle-catalog`;
    const zeroCautionHref = `${homeHref}#zero-caution`;
    const guidesHref = currentLocale === "fr" ? "/guides" : "/en/guides";

    const handleLocaleSwitch = (newLocale: Locale) => {
        if (!pathname) return;

        // Extract hub and subslug if present
        const segments = pathname.split("/").filter(Boolean);
        let hub = "";
        let subslug = "";

        if (segments[0] === "maroc") {
            hub = segments[1] || "";
            subslug = segments[2] || "";
        } else if (["en", "es", "nl"].includes(segments[0])) {
            if (segments[1] === "guides") {
                const guideSlug = segments[2] || "";
                const target = newLocale === "fr" ? (guideSlug ? `/guides/${guideSlug}` : "/guides") : (guideSlug ? `/${newLocale}/guides/${guideSlug}` : `/${newLocale}/guides`);
                router.push(target);
                return;
            }
            hub = segments[1] || "";
            subslug = segments[2] || "";
        } else if (segments[0] === "guides") {
            const guideSlug = segments[1] || "";
            const target = newLocale === "fr" ? (guideSlug ? `/guides/${guideSlug}` : "/guides") : (guideSlug ? `/${newLocale}/guides/${guideSlug}` : `/${newLocale}/guides`);
            router.push(target);
            return;
        }

        if (hub) {
            if (subslug) {
                // Check if subslug is an intent
                const intent = PURCHASE_INTENTS.find(
                    (i) =>
                        i.id === subslug ||
                        i.slugs.fr === subslug ||
                        i.slugs.en === subslug ||
                        i.slugs.es === subslug ||
                        i.slugs.nl === subslug
                );

                if (intent) {
                    const targetIntentSlug = newLocale === "fr" ? intent.slugs.fr : intent.slugs[newLocale];
                    const targetUrl = newLocale === "fr" ? `/maroc/${hub}/${targetIntentSlug}` : `/${newLocale}/${hub}/${targetIntentSlug}`;
                    router.push(targetUrl);
                    return;
                }

                // If subslug is a vehicle (e.g. renault-clio-5-auto)
                const targetUrl = newLocale === "fr" ? `/maroc/${hub}/${subslug}` : `/${newLocale}/${hub}/${subslug}`;
                router.push(targetUrl);
                return;
            }

            // Just hub
            const targetUrl = newLocale === "fr" ? `/maroc/${hub}` : `/${newLocale}/${hub}`;
            router.push(targetUrl);
            return;
        }

        // On home or unknown root page: switch cleanly between /, /en, /es, /nl
        if (newLocale === "fr") {
            router.push("/");
        } else {
            router.push(`/${newLocale}`);
        }
    };

    const waText = encodeURIComponent(
        currentLocale === "en"
            ? "Hello ZwinCar, I would like information about a car rental in Morocco"
            : currentLocale === "es"
            ? "Hola ZwinCar, deseo información sobre un alquiler de coche en Marruecos"
            : currentLocale === "nl"
            ? "Hallo ZwinCar, ik wil graag informatie over autohuur in Marokko"
            : "Bonjour ZwinCar, je souhaite des infos sur une location"
    );

    return (
        <>
            <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EAE3D6] transition-colors">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-20 flex items-center justify-between gap-4">
                    {/* Logo & Desktop Nav */}
                    <div className="flex items-center gap-5 xl:gap-8 min-w-0">
                        <Logo variant="full" theme="dark" size="md" locale={currentLocale} />

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-5 text-xs xl:text-sm font-semibold text-slate-700 whitespace-nowrap">
                            <Link
                                href={catalogHref}
                                className="hover:text-[#C9572C] transition-colors whitespace-nowrap"
                            >
                                {t.nav.vehicles}
                            </Link>

                            {/* Hubs Dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setHubsDropdownOpen(!hubsDropdownOpen)}
                                    className="flex items-center gap-1 hover:text-[#C9572C] transition-colors cursor-pointer whitespace-nowrap"
                                >
                                    <span>{t.nav.airports}</span>
                                    <ChevronDown size={14} className="text-slate-400" />
                                </button>

                                {hubsDropdownOpen && (
                                    <div className="absolute top-10 left-0 w-64 bg-white border border-[#E7DFD5] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                                            {currentLocale === "en"
                                                ? "Airport & Riad delivery"
                                                : currentLocale === "es"
                                                ? "Entrega en aeropuerto y riad"
                                                : currentLocale === "nl"
                                                ? "Luchthaven & riad bezorging"
                                                : "Livraison aéroport & riad"}
                                        </div>
                                        {MOROCCAN_HUBS.map((hub) => (
                                            <Link
                                                key={hub.slug}
                                                href={currentLocale === "fr" ? `/maroc/${hub.slug}` : `/${currentLocale}/${hub.slug}`}
                                                onClick={() => setHubsDropdownOpen(false)}
                                                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-[#FAF7F2] text-slate-800 transition"
                                            >
                                                <span className="font-semibold">{hub.name}</span>
                                                <span className="font-mono text-slate-400">{hub.airportCode}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <Link
                                href={guidesHref}
                                className="hover:text-[#C9572C] transition-colors flex items-center gap-1.5 whitespace-nowrap"
                            >
                                <BookOpen size={14} className="text-[#C9572C]" />
                                <span>{t.nav.guides}</span>
                            </Link>

                            <Link
                                href={zeroCautionHref}
                                className="hover:text-[#C9572C] transition-colors flex items-center gap-1.5 whitespace-nowrap"
                            >
                                <ShieldCheck size={14} className="text-emerald-600" />
                                <span>{t.nav.zeroDeposit}</span>
                            </Link>
                        </nav>
                    </div>

                    {/* Right controls: Language, Mon Bon, SOS & WhatsApp VIP */}
                    <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
                        {/* Retrouver mon bon de réservation */}
                        <button
                            type="button"
                            onClick={() => setLookupModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer whitespace-nowrap active:scale-95"
                            title={t.nav.findBooking}
                        >
                            <FileText size={14} className="text-[#C9572C]" />
                            <span>{t.nav.myVoucher}</span>
                        </button>

                        {/* SOS Urgence Button */}
                        <button
                            type="button"
                            onClick={() => setSosModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 text-xs font-bold transition cursor-pointer whitespace-nowrap"
                        >
                            <ShieldAlert size={14} className="text-red-600" />
                            <span>SOS 24/7</span>
                        </button>

                        {/* Language Switch - Compact, clean, zero overflow */}
                        <div className="inline-flex items-center p-0.5 rounded-full bg-slate-100 border border-slate-200/80 text-slate-700">
                            {(["fr", "en", "es", "nl"] as const).map((l) => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => handleLocaleSwitch(l)}
                                    className={`px-2 py-0.5 rounded-full cursor-pointer transition uppercase text-[10px] font-bold ${
                                        currentLocale === l
                                            ? "bg-[#C9572C] text-white shadow-2xs"
                                            : "hover:text-slate-900 text-slate-500"
                                    }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        {/* WhatsApp Direct Concierge */}
                        <a
                            href={`https://wa.me/212600000000?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackWhatsAppClick("header_desktop")}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-900 hover:bg-[#C9572C] text-white text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap"
                        >
                            <MessageCircle size={15} className="text-emerald-400" />
                            <span>WhatsApp VIP</span>
                        </a>
                    </div>

                    {/* Mobile Controls & Hamburger Button */}
                    <div className="flex lg:hidden items-center gap-2">
                        {/* Quick SOS button for mobile header */}
                        <button
                            type="button"
                            onClick={() => setSosModalOpen(true)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[11px] font-bold"
                        >
                            <ShieldAlert size={13} className="text-red-600" />
                            <span>SOS</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-slate-800 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu (Full Height Dedicated Scrollable Drawer) */}
                {mobileMenuOpen && (
                    <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 z-50 bg-white/98 backdrop-blur-md overflow-y-auto overscroll-contain p-5 pb-20 space-y-4 shadow-2xl animate-in slide-in-from-top-2">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-xs font-bold uppercase text-slate-400">Langue / Language</span>
                            <div className="inline-flex items-center gap-1 text-xs font-semibold p-1 rounded-full bg-slate-100">
                                {([ "fr", "en", "es", "nl" ] as const).map((l) => (
                                    <button
                                        key={l}
                                        type="button"
                                        onClick={() => {
                                            handleLocaleSwitch(l);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`px-2.5 py-1 rounded-full cursor-pointer uppercase text-[11px] font-bold ${
                                            currentLocale === l
                                                ? "bg-[#C9572C] text-white shadow-2xs"
                                                : "text-slate-600 hover:text-slate-900"
                                        }`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <Link
                                href={catalogHref}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-[#FAF7F2] hover:text-[#C9572C] transition"
                            >
                                {t.nav.vehicles}
                            </Link>

                            <Link
                                href={guidesHref}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-[#FAF7F2] hover:text-[#C9572C] transition"
                            >
                                {t.nav.guides}
                            </Link>

                            <Link
                                href={zeroCautionHref}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-[#FAF7F2] hover:text-[#C9572C] transition"
                            >
                                {t.nav.zeroDeposit}
                            </Link>

                            <Link
                                href="/contact"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-[#FAF7F2] hover:text-[#C9572C] transition"
                            >
                                {t.nav.contact || "Support & Contact"}
                            </Link>

                            {/* Hubs airport quick list */}
                            <div className="pt-2 pb-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                                    {t.nav.airports}
                                </span>
                                <div className="grid grid-cols-2 gap-1.5 px-1">
                                    {MOROCCAN_HUBS.map((hub) => (
                                        <Link
                                            key={hub.slug}
                                            href={currentLocale === "fr" ? `/maroc/${hub.slug}` : `/${currentLocale}/${hub.slug}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-[#FAF7F2] hover:text-[#C9572C] flex items-center justify-between"
                                        >
                                            <span>{hub.name}</span>
                                            <span className="font-mono text-[10px] text-slate-400">{hub.airportCode}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setLookupModalOpen(true);
                                }}
                                className="w-full text-left py-2.5 px-3 rounded-xl text-sm font-semibold text-slate-800 hover:bg-[#FAF7F2] hover:text-[#C9572C] transition flex items-center gap-2 cursor-pointer"
                            >
                                <FileText size={16} className="text-[#C9572C]" />
                                <span>{t.nav.findBooking}</span>
                            </button>

                            <Link
                                href="/vendor/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2.5 px-3 rounded-xl text-xs font-bold text-slate-500 uppercase tracking-wider hover:bg-slate-50"
                            >
                                {t.nav.vendorSpace}
                            </Link>
                        </div>

                        <div className="pt-2 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setSosModalOpen(true);
                                }}
                                className="flex-1 py-3 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
                            >
                                <ShieldAlert size={15} />
                                <span>SOS Maroc 24/7</span>
                            </button>

                            <a
                                href={`https://wa.me/212600000000?text=${waText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => {
                                    trackWhatsAppClick("header_mobile");
                                    setMobileMenuOpen(false);
                                }}
                                className="flex-1 py-3 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition"
                            >
                                <MessageCircle size={15} className="text-emerald-400" />
                                <span>WhatsApp VIP</span>
                            </a>
                        </div>
                    </div>
                )}
            </header>

            {/* Assistance Modale */}
            <SosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />

            {/* Retrouver mon bon de réservation */}
            <BookingLookupModal isOpen={lookupModalOpen} onClose={() => setLookupModalOpen(false)} locale={currentLocale} />
        </>
    );
}
