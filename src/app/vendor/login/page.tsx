"use client";

import { useState } from "react";
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

export default function VendorLoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!identifier.trim()) {
            setError("Veuillez renseigner votre email ou numéro WhatsApp.");
            return;
        }

        if (password.length < 8) {
            setError("Le mot de passe doit comporter au moins 8 caractères.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("/api/vendor/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error || "Identifiants incorrects ou agence introuvable.");
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
            setError("Impossible de contacter le serveur. Vérifiez votre connexion.");
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

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col justify-between font-sans selection:bg-[#C9572C]/20 selection:text-[#C9572C]">
            {/* Header épuré */}
            <header className="px-5 sm:px-8 py-4 flex items-center justify-between border-b border-[#E7DFD5] bg-white/80 backdrop-blur-md">
                <Logo variant="full" theme="dark" size="sm" />
                <Link
                    href="/vendor/register"
                    className="text-xs font-bold text-slate-700 hover:text-[#C9572C] transition-colors flex items-center gap-1.5"
                >
                    <span>Devenir partenaire</span>
                    <ArrowRight size={14} />
                </Link>
            </header>

            {/* Formulaire centré */}
            <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
                <div className="w-full max-w-[420px] bg-white rounded-3xl border border-[#E7DFD5] shadow-xl p-6 sm:p-8 space-y-6">
                    {/* Titre & Sous-titre */}
                    <div className="text-center space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9572C]/10 text-[#C9572C] text-[11px] font-bold uppercase tracking-wider">
                            <Building2 size={13} />
                            <span>Espace Pro Loueurs</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">
                            Connexion Agence
                        </h1>
                        <p className="text-xs text-slate-500">
                            Gérez vos livraisons aéroport et votre flotte en temps réel.
                        </p>
                    </div>

                    {/* Alerte Erreur */}
                    {error && (
                        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                            <AlertCircle size={15} className="shrink-0 text-red-600" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Formulaire */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                Email ou Numéro WhatsApp
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    autoComplete="username"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="contact@agence.ma ou +212 6..."
                                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all"
                                />
                                <Mail size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600">
                                    Mot de passe
                                </label>
                                <a
                                    href="https://wa.me/212720794046?text=Bonjour%20ZwinCar,%20j%27ai%20oubli%C3%A9%20mon%20mot%20de%20passe%20agence"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] font-semibold text-[#C9572C] hover:underline"
                                >
                                    Oublié ?
                                </a>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#C9572C] focus:bg-white focus:ring-2 focus:ring-[#C9572C]/10 transition-all"
                                />
                                <Lock size={16} className="absolute left-3.5 top-3 text-slate-400 pointer-events-none" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
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
                                    <span>Connexion en cours...</span>
                                </>
                            ) : (
                                <>
                                    <span>Se connecter</span>
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
                            <span>Tester avec le compte démo Atlas Drive (1 clic)</span>
                        </button>
                    </div>

                    {/* Footer inscription */}
                    <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                        <span>Nouvelle agence ? </span>
                        <Link
                            href="/vendor/register"
                            className="font-bold text-[#C9572C] hover:underline"
                        >
                            Créer mon compte agence
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer discret */}
            <footer className="py-4 text-center text-xs text-slate-500 border-t border-[#E7DFD5] bg-white/50">
                <div className="flex items-center justify-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Plateforme certifiée ZwinCar Pro • Réservé aux loueurs agréés au Maroc</span>
                </div>
            </footer>
        </div>
    );
}
