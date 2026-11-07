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
                    <h2 className="text-slate-400 text-xs mt-1 font-normal">
                        Supervision nationale des réservations et flotte Maroc
                    </h2>
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

                {/* Security Protocol & Fleet Management Charter */}
                <div className="mt-8 bg-slate-900/60 rounded-2xl p-5 border border-slate-800 text-[11px] text-slate-400 space-y-3">
                    <div className="flex items-center gap-2 text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                        <ShieldCheck size={14} className="text-[#E58B24]" />
                        <span>Protocole de Sécurité Opérationnelle & Supervision Flotte</span>
                    </div>
                    <p className="leading-relaxed">
                        Ce portail de supervision centralise l&apos;affectation des véhicules ZwinCar à travers l&apos;ensemble des hubs aéroportuaires et métropolitains du Royaume du Maroc (Marrakech-Ménara, Casablanca Mohammed V, Fès-Saïss, Agadir Al Massira, Tanger Ibn Battouta, Rabat-Salé et Nador Al Aroui). L&apos;accès à cet espace est strictement restreint aux gestionnaires de flotte assermentés, directeurs d&apos;agences locales et administrateurs accrédités.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-[10px]">
                        <div>
                            <span className="font-bold text-slate-300 block mb-0.5">Vérification KYC & Contrats</span>
                            <span className="text-slate-400 leading-normal">
                                Tout bon de réservation fait l&apos;objet d&apos;une double validation documentaire : permis de conduire valide (ancienneté minimale 1 an) et passeport ou pièce d&apos;identité nationale en cours de validité.
                            </span>
                        </div>
                        <div>
                            <span className="font-bold text-slate-300 block mb-0.5">Protection des Données (CNDP)</span>
                            <span className="text-slate-400 leading-normal">
                                Les coordonnées et justificatifs des locataires sont protégés conformément à la loi marocaine n° 09-08 relative à la protection des personnes physiques à l&apos;égard du traitement des données à caractère personnel.
                            </span>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal pt-1">
                        Toute tentative d&apos;intrusion, usurpation d&apos;identifiant ou accès non autorisé fait l&apos;objet d&apos;un journal d&apos;audit cryptographique immuable avec horodatage UTC, adresse IP source et empreinte TLS, transmis automatiquement aux autorités judiciaires compétentes.
                    </p>
                </div>
            </div>
        </div>
    );
}
