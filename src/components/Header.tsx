"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { MessageCircle, Globe, Menu, X, ShieldCheck, ChevronDown, ShieldAlert, BookOpen } from "lucide-react";
import Logo from "@/components/Logo";
import { MOROCCAN_HUBS } from "@/lib/morocco-data";
import { PURCHASE_INTENTS } from "@/lib/intent-data";
import { SosModal } from "@/components/SosModal";
import { Locale } from "@/lib/i18n";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hubsDropdownOpen, setHubsDropdownOpen] = useState(false);
    const [sosModalOpen, setSosModalOpen] = useState(false);

    // Detect current locale from pathname
    const currentLocale: Locale = pathname?.startsWith("/en")
        ? "en"
        : pathname?.startsWith("/es")
        ? "es"
        : pathname?.startsWith("/nl")
        ? "nl"
        : "fr";

    const handleLocaleSwitch = (newLocale: Locale) => {
        if (!pathname) return;

        // Extract hub and subslug if present
        const segments = pathname.split("/").filter(Boolean);
        // segments might be: ["maroc", "marrakech", "sans-caution"] or ["en", "marrakech", "no-deposit"]
        let hub = "";
        let subslug = "";

        if (segments[0] === "maroc") {
            hub = segments[1] || "";
            subslug = segments[2] || "";
        } else if (["en", "es", "nl"].includes(segments[0])) {
            hub = segments[1] || "";
            subslug = segments[2] || "";
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

                // If subslug is a vehicle (e.g. dacia-duster-4x4)
                const targetUrl = newLocale === "fr" ? `/maroc/${hub}/${subslug}` : `/${newLocale}/${hub}/${subslug}`;
                router.push(targetUrl);
                return;
            }

            // Just hub
            const targetUrl = newLocale === "fr" ? `/maroc/${hub}` : `/${newLocale}/${hub}`;
            router.push(targetUrl);
            return;
        }

        // Default fallback
        if (newLocale === "fr") {
            router.push("/");
        } else {
            router.push(`/${newLocale}/marrakech`);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EAE3D6] transition-colors">
                <div className="container mx-auto px-4 max-w-6xl h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-8">
                        <Logo variant="full" theme="dark" size="md" />

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-700">
                            <Link
                                href="/#vehicle-catalog"
                                className="hover:text-[#C9572C] transition-colors"
                            >
                                Flotte & Tarifs
                            </Link>

                            {/* Hubs Dropdown */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setHubsDropdownOpen(!hubsDropdownOpen)}
                                    className="flex items-center gap-1 hover:text-[#C9572C] transition-colors cursor-pointer"
                                >
                                    <span>Aéroports & Villes</span>
                                    <ChevronDown size={14} className="text-slate-400" />
                                </button>

                                {hubsDropdownOpen && (
                                    <div className="absolute top-10 left-0 w-64 bg-white border border-[#E7DFD5] rounded-2xl shadow-xl p-2 z-50 animate-in fade-in">
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                                            Livraison aéroport & riad
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
                                href="/guides"
                                className="hover:text-[#C9572C] transition-colors flex items-center gap-1.5"
                            >
                                <BookOpen size={15} className="text-[#C9572C]" />
                                <span>Guides Maroc</span>
                            </Link>

                            <Link
                                href="/#zero-caution"
                                className="hover:text-[#C9572C] transition-colors flex items-center gap-1.5"
                            >
                                <ShieldCheck size={15} className="text-emerald-600" />
                                <span>Zéro Caution CB</span>
                            </Link>

                            <Link
                                href="/vendor/login"
                                className="hover:text-slate-900 text-slate-500 transition-colors text-xs font-bold uppercase tracking-wider"
                            >
                                Espace Loueur
                            </Link>
                        </nav>
                    </div>

                    {/* Right controls: Language, SOS & WhatsApp VIP */}
                    <div className="hidden sm:flex items-center gap-3">
                        {/* SOS Urgence Button */}
                        <button
                            type="button"
                            onClick={() => setSosModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-50 hover:bg-red-100 text-red-700 border border-red-200/80 text-xs font-bold transition cursor-pointer"
                        >
                            <ShieldAlert size={14} className="text-red-600" />
                            <span>SOS 24/7</span>
                        </button>

                        {/* Language Switch */}
                        <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-white border border-[#E7DFD5] text-slate-700 shadow-2xs">
                            <Globe size={13} className="text-slate-400 ml-1" />
                            {(["fr", "en", "es", "nl"] as const).map((l) => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => handleLocaleSwitch(l)}
                                    className={`px-1.5 py-0.5 rounded cursor-pointer transition uppercase text-[11px] font-bold ${
                                        currentLocale === l
                                            ? "bg-[#C9572C]/15 text-[#C9572C]"
                                            : "hover:text-slate-900 text-slate-500"
                                    }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        {/* WhatsApp Direct Concierge */}
                        <a
                            href="https://wa.me/212600000000?text=Bonjour%20ZwinCar,%20je%20souhaite%20des%20infos%20sur%20une%20location"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-900 hover:bg-[#C9572C] text-white text-xs font-bold tracking-wide transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                            <MessageCircle size={15} className="text-emerald-400" />
                            <span>WhatsApp VIP</span>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-slate-800 p-2 rounded-xl hover:bg-slate-100 cursor-pointer"
                        aria-label="Menu"
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-b border-[#E7DFD5] p-4 space-y-4 animate-in slide-in-from-top-2">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-xs font-bold uppercase text-slate-400">Langue / Language</span>
                            <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-slate-100">
                                {(["fr", "en", "es", "nl"] as const).map((l) => (
                                    <button
                                        key={l}
                                        type="button"
                                        onClick={() => {
                                            handleLocaleSwitch(l);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`px-2 py-0.5 rounded cursor-pointer uppercase text-xs font-bold ${
                                            currentLocale === l
                                                ? "bg-[#C9572C] text-white"
                                                : "text-slate-600"
                                        }`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Link
                                href="/#vehicle-catalog"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#C9572C]"
                            >
                                Flotte & Modèles Disponibles
                            </Link>

                            <Link
                                href="/guides"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#C9572C]"
                            >
                                Guides & Conseils Conduite Maroc
                            </Link>

                            <Link
                                href="/#zero-caution"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2 text-sm font-semibold text-slate-800 hover:text-[#C9572C]"
                            >
                                Garantie Zéro Caution CB
                            </Link>

                            <Link
                                href="/vendor/login"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block py-2 text-sm font-bold text-slate-500 uppercase tracking-wider"
                            >
                                Espace Loueur Partenaire
                            </Link>
                        </div>

                        <div className="pt-2 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    setSosModalOpen(true);
                                }}
                                className="flex-1 py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center justify-center gap-1"
                            >
                                <ShieldAlert size={15} />
                                <span>SOS Maroc 24/7</span>
                            </button>

                            <a
                                href="https://wa.me/212600000000?text=Bonjour%20ZwinCar,%20je%20souhaite%20des%20infos%20sur%20une%20location"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-1.5"
                            >
                                <MessageCircle size={15} className="text-emerald-400" />
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                )}
            </header>

            {/* Assistance Modale */}
            <SosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
        </>
    );
}
