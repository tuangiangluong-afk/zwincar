"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Loader2, ShieldCheck, ArrowRight, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("locapartoo@gmail.com");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data?.error || "Identifiants invalides.");
                setLoading(false);
                return;
            }

            router.push("/admin");
            router.refresh();
        } catch {
            setError("Erreur de connexion. Veuillez réessayer.");
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#12161E] flex items-center justify-center p-4 font-sans text-slate-100">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-[#E58B24] tracking-wider uppercase mb-3">
                        <ShieldCheck size={14} />
                        <span>Portail Administrateur Sécurisé</span>
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                        ZwinCar<span className="text-[#C9572C]">.</span> Admin OS
                    </h1>
                    <p className="text-slate-400 text-xs mt-1">Supervision nationale des réservations et flotte Maroc</p>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-800 text-slate-900">
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="rounded-2xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-700 flex items-start gap-2">
                                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                Identifiant Administrateur
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C] transition"
                                    placeholder="locapartoo@gmail.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                Mot de Passe Maître
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-12 pl-10 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#C9572C] transition"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 mt-2 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50 shadow-md"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Vérification sécurisée...</span>
                                </>
                            ) : (
                                <>
                                    <span>Accéder au Back-Office</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                        <p className="text-[11px] text-slate-400">
                            Session signée HMAC • Chiffrement scrypt N=16384 • IP tracée
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
