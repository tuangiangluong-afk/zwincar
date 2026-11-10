"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Lock,
    Mail,
    ArrowRight,
    Eye,
    EyeOff,
    Building2,
    ShieldCheck,
    AlertCircle,
    Loader2,
} from "lucide-react";
import Logo from "@/components/Logo";
import { saveVendorProfile, DEFAULT_VENDOR_PROFILE } from "@/lib/vendor-auth";
import { VENDOR_I18N, VendorLocale } from "@/lib/vendor-i18n";

interface VendorLoginPageProps {
    initialLocale?: VendorLocale;
}

export default function VendorLoginPage({ initialLocale = "fr" }: VendorLoginPageProps) {
    const router = useRouter();
    const [locale, setLocale] = useState<VendorLocale>(initialLocale);
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Initialisation synchrone de la langue si stockée localement
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("zwincar_lang") as VendorLocale | null;
            if (saved && (saved === "fr" || saved === "en") && !initialLocale) {
                setLocale(saved);
            }
        }
    }, [initialLocale]);

    const handleSwitchLocale = (nextLocale: VendorLocale) => {
        setLocale(nextLocale);
        if (typeof window !== "undefined") {
            localStorage.setItem("zwincar_lang", nextLocale);
        }
    };

    const t = VENDOR_I18N[locale];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const cleanId = identifier.trim();
        if (!cleanId) {
            setError(t.login.errEmptyId);
            return;
        }

        if (password.length < 8) {
            setError(t.login.errShortPwd);
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/vendor/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: cleanId, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || t.login.errGeneric);
                setLoading(false);
                return;
            }

            if (typeof window !== "undefined") {
                if (data.token) localStorage.setItem("zwincar_vendor_token", data.token);
                if (data.agency) saveVendorProfile(data.agency);
                localStorage.setItem("zwincar_vendor_authenticated", "true");
            }
            router.push("/vendor/dashboard");
        } catch {
            setError(t.login.errNetwork);
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
        setError(null);
        setIdentifier("contact@atlasdrive-marrakech.ma");
        setPassword("Marrakech2026!");
        setLoading(true);

        try {
            const res = await fetch("/api/vendor/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identifier: "contact@atlasdrive-marrakech.ma",
                    password: "Marrakech2026!",
                }),
            });
            const data = await res.json();
            if (data.token && typeof window !== "undefined") {
                localStorage.setItem("zwincar_vendor_token", data.token);
                if (data.agency) saveVendorProfile(data.agency);
                localStorage.setItem("zwincar_vendor_authenticated", "true");
            }
            router.push("/vendor/dashboard");
        } catch {
            saveVendorProfile(DEFAULT_VENDOR_PROFILE);
            router.push("/vendor/dashboard");
        }
    };

    const registerHref = locale === "en" ? "/en/vendor/register" : "/vendor/register";

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col justify-between font-sans selection:bg-[#C9572C]/20 selection:text-[#C9572C]">
            {/* Header épuré & Sélecteur de langue */}
            <header className="px-5 sm:px-8 py-4 flex items-center justify-between border-b border-[#E7DFD5] bg-white/80 backdrop-blur-md">
                <Logo variant="full" theme="dark" size="sm" />

                <div className="flex items-center gap-3">
                    {/* Switcher Bilingue Tactile FR / EN */}
                    <div
                        role="group"
                        aria-label={t.common.language}
                        className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#E7DFD5] text-xs font-bold"
                    >
                        <button
                            type="button"
                            onClick={() => handleSwitchLocale("fr")}
                            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                locale === "fr"
                                    ? "bg-white text-slate-900 shadow-xs"
                                    : "text-slate-400 hover:text-slate-700"
                            }`}
                        >
                            🇫🇷 FR
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSwitchLocale("en")}
                            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                                locale === "en"
                                    ? "bg-white text-slate-900 shadow-xs"
                                    : "text-slate-400 hover:text-slate-700"
                            }`}
                        >
                            🇬🇧 EN
                        </button>
                    </div>

                    <Link
                        href={registerHref}
                        className="text-xs font-bold text-slate-700 hover:text-[#C9572C] transition-colors flex items-center gap-1.5"
                    >
                        <span className="hidden sm:inline">{t.common.becomePartner}</span>
                        <ArrowRight size={14} />
                    </Link>
                </div>
            </header>

            {/* Formulaire centré */}
            <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-[420px] bg-white rounded-3xl border border-[#E7DFD5] shadow-xl p-6 sm:p-8 space-y-6">
                    {/* Titre & Sous-titre */}
                    <div className="text-center space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9572C]/10 text-[#C9572C] text-[11px] font-bold uppercase tracking-wider">
                            <Building2 size={13} />
                            <span>{t.login.badge}</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">
                            {t.login.title}
                        </h1>
                        <p className="text-xs text-slate-500">
                            {t.login.subtitle}
                        </p>
                    </div>

                    {/* Alerte Erreur */}
                    {error && (
                        <div
                            role="alert"
                            className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in"
                        >
                            <AlertCircle size={15} className="shrink-0 text-red-600" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                {t.login.idLabel}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="username"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder={t.login.idPlaceholder}
                                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all"
                                />
                                <Mail size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                    {t.login.pwdLabel}
                                </label>
                                <a
                                    href={`https://wa.me/212720794046?text=${encodeURIComponent(t.login.forgotWaText)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] font-semibold text-[#C9572C] hover:underline"
                                >
                                    {t.login.forgot}
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t.login.pwdPlaceholder}
                                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all"
                                />
                                <Lock size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                    tabIndex={-1}
                                    aria-label={showPassword ? t.login.hidePwd : t.login.showPwd}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-xl bg-[#C9572C] hover:bg-[#B24922] disabled:opacity-70 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#C9572C]/20 active:scale-[0.99] mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>{t.login.loading}</span>
                                </>
                            ) : (
                                <>
                                    <span>{t.login.submit}</span>
                                    <ArrowRight size={15} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Démo rapide en 1 clic */}
                    <div className="pt-2 text-center">
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            disabled={loading}
                            className="text-xs font-semibold text-slate-500 hover:text-[#C9572C] transition-colors inline-flex items-center gap-1.5 cursor-pointer underline-offset-4 hover:underline"
                        >
                            <span>{t.login.demoBtn}</span>
                        </button>
                    </div>

                    {/* Footer inscription */}
                    <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                        <span>{t.login.newAgency} </span>
                        <Link
                            href={registerHref}
                            className="font-bold text-[#C9572C] hover:underline"
                        >
                            {t.login.createAccount}
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer discret */}
            <footer className="py-4 text-center text-xs text-slate-500 border-t border-[#E7DFD5] bg-white/50">
                <div className="flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>{t.common.partnerCert}</span>
                </div>
            </footer>
        </div>
    );
}
