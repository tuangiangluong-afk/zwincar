"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Lock, Mail, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        console.log("Attempting login for:", email);

        const { data, error } = await supabaseBrowser.auth.signInWithPassword({
            email,
            password,
        });

        console.log("Login result:", { data, error });

        if (error) {
            console.error("Login error:", error);
            setError(error.message);
            setLoading(false);
        } else {
            console.log("Login success, redirecting...");
            router.push("/admin");
            router.refresh();
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Taxi<span className="text-yellow-400">CMS</span>
                    </h1>
                    <p className="text-neutral-400">Connectez-vous pour accéder à l'administration</p>
                </div>

                <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 shadow-2xl space-y-6">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Adresse Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition text-black"
                                placeholder="admin@votresite.fr"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-2">
                            Mot de passe
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition text-black"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Connexion...
                            </>
                        ) : (
                            "Se connecter"
                        )}
                    </button>
                </form>

                <p className="text-center text-neutral-500 text-sm mt-6">
                    Contactez l'administrateur si vous avez oublié vos identifiants.
                </p>
            </div>
        </div>
    );
}
