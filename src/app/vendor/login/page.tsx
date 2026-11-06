"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Lock,
    Mail,
    ArrowRight,
    ShieldCheck,
    MessageCircle,
    Car,
    Phone,
    CheckCircle2,
    Eye,
    EyeOff,
    Building2,
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
            setError("Veuillez renseigner votre email professionnel ou numéro WhatsApp.");
            return;
        }

        if (password.length < 6) {
            setError("Le mot de passe doit comporter au moins 6 caractères.");
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
                setError(data.error || "Identifiants invalides.");
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
            setError("Impossible de contacter le serveur d'authentification.");
            setLoading(false);
        }
    };

    const handleDemoLogin = async () => {
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
            }
            router.push("/vendor/dashboard");
        } catch {
            saveVendorProfile(DEFAULT_VENDOR_PROFILE);
            router.push("/vendor/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col justify-between font-sans">
            {/* Top Minimal Nav */}
            <header className="px-6 py-4 flex items-center justify-between border-b border-[#E7DFD5] bg-white/70 backdrop-blur-md">
                <Logo variant="full" theme="dark" size="sm" />
                <div className="flex items-center gap-3 text-xs font-semibold">
                    <span className="text-slate-500 hidden sm:inline">Nouveau loueur ?</span>
                    <Link
                        href="/vendor/register"
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-[#C9572C] text-white transition shadow-xs"
                    >
                        Créer mon compte agence
                    </Link>
                </div>
            </header>

            {/* Login Center Box */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
                <div className="w-full max-w-md bg-white rounded-3xl border border-[#E7DFD5] shadow-xl p-6 sm:p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-1.5">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9572C]/10 text-[#C9572C] text-xs font-bold uppercase tracking-wider">
                            <Car size={14} />
                            <span>Espace Pro • Loueurs Locaux</span>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900">
                            Connexion Agence Partenaire
                        </h1>
                        <h2 className="text-xs text-slate-500 font-normal">
                            Gérez vos remises de clés, cautions et flotte en temps réel.
                        </h2>
                    </div>

                    {/* Quick Demo Pill */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Building2 size={16} className="text-[#C9572C] shrink-0" />
                            <span className="text-[11px] truncate">Compte démo : Atlas Drive Marrakech</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleDemoLogin}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-[#C9572C] text-white font-bold text-[10px] tracking-wide transition cursor-pointer"
                        >
                            Tester en 1 clic
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                Email Professionnel ou Numéro WhatsApp
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    placeholder="contact@agence.ma ou +212600000000"
                                    className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                />
                                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                                    Mot de passe
                                </label>
                                <a
                                    href="https://wa.me/212600000000?text=Bonjour%20ZwinCar,%20j%27ai%20oubli%C3%A9%20mon%20mot%20de%20passe%20agence"
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
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                />
                                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="w-4 h-4 rounded border-slate-300 text-[#C9572C] focus:ring-[#C9572C]"
                                />
                                <span>Rester connecté sur cet appareil</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] disabled:opacity-70 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-[0.99] mt-2"
                        >
                            {loading ? (
                                <span>Connexion en cours...</span>
                            ) : (
                                <>
                                    <span>Accéder à mon Espace Agence</span>
                                    <ArrowRight size={15} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer link to register */}
                    <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                        <span>Vous n'êtes pas encore référencé sur ZwinCar ? </span>
                        <Link
                            href="/vendor/register"
                            className="font-bold text-[#C9572C] hover:underline"
                        >
                            Inscrire mon agence
                        </Link>
                    </div>

                    {/* Partenariat Local & Engagements ZwinCar */}
                    <div className="pt-4 border-t border-slate-100 space-y-3 text-left">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            Engagements Plateforme ZwinCar Pro
                        </div>
                        <ul className="space-y-2 text-xs text-slate-600 leading-snug">
                            <li className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                <span><strong>Zéro abonnement ni frais d'entrée :</strong> Inscription 100% gratuite et sans engagement pour les agences locales indépendantes agréées par le Ministère du Transport au Maroc.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                <span><strong>Acompte en ligne sécurisé :</strong> Chaque demande transmise dispose d'un acompte validé par Stripe. ZwinCar sécurise sa commission à la réservation et ne prélève aucun pourcentage sur le solde agence.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                <span><strong>Paiement du solde 100% direct :</strong> Le client vous règle les 80% du solde directement lors de la remise des clés au parking aéroport ou au riad (en espèces ou carte de débit).</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                                <span className="text-emerald-600 font-bold shrink-0">✓</span>
                                <span><strong>Gestion flexible par WhatsApp :</strong> Vous recevez les fiches missions détaillées (numéro de vol, heure d'arrivée, modèle équivalent) directement sur votre smartphone pour une prise en charge rapide en moins de 3 minutes.</span>
                            </li>
                        </ul>

                        <div className="pt-3 border-t border-slate-100">
                            <h3 className="text-xs font-bold text-slate-800 mb-1">Critères d'audit des agences partenaires ZwinCar :</h3>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Afin de garantir une qualité irréprochable aux voyageurs internationaux, chaque partenaire s'engage à fournir des véhicules récents (moins de 4 ans ou moins de 80 000 km), révisés, équipés de climatisation opérationnelle et d'une roue de secours fonctionnelle. Les remises de clés s'effectuent sans guichet intermédiaire avec état des lieux contradictoire photo sur smartphone.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Bottom Support Info */}
            <footer className="py-4 text-center text-xs text-slate-500 border-t border-[#E7DFD5] bg-white/50">
                <div className="flex items-center justify-center gap-2">
                    <MessageCircle size={14} className="text-emerald-600" />
                    <span>Assistance technique loueurs WhatsApp : </span>
                    <a
                        href="https://wa.me/212600000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-slate-800 hover:underline"
                    >
                        +212 6 00 00 00 00
                    </a>
                </div>
            </footer>
        </div>
    );
}
