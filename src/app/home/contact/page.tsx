export const revalidate = 86400; // 24h ISR cache

import ContactForm from "@/components/ContactForm";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { getTheme } from "@/lib/theme";

export default function HubContactPage() {
    return (
        <div className="min-h-screen bg-slate-950 font-sans text-white selection:bg-blue-500 selection:text-white">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/home" className="text-2xl font-black tracking-tighter text-white hover:text-blue-400 transition">
                        TaxiFrance<span className="text-blue-500">.</span>
                    </Link>
                    <Link href="/home" className="text-sm font-bold text-slate-400 hover:text-white transition flex items-center gap-2">
                        <ArrowLeft size={16} /> Retour Accueil
                    </Link>
                </div>
            </nav>

            <section className="pt-32 pb-20 px-6">
                <div className="mx-auto max-w-4xl">
                    <div className="text-center mb-16">
                        <span className="inline-block rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-bold text-blue-400 mb-6 tracking-widest uppercase backdrop-blur-md">
                            Contact & Partenariats
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">
                            Rejoignez le Réseau <span className="text-blue-500">Taxi de France</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Vous êtes chauffeur de taxi indépendant ? Vous souhaitez rejoindre notre réseau national ?
                            Ou vous avez simplement une question ? Écrivez-nous.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 text-center">
                            <div className="mx-auto w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 text-emerald-400">
                                <Phone size={24} />
                            </div>
                            <h3 className="font-bold text-white mb-2">Support Partenaire</h3>
                            <p className="text-slate-400 text-sm">Lundi - Vendredi, 9h-18h</p>
                        </div>
                        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 text-center">
                            <div className="mx-auto w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-4 text-purple-400">
                                <MapPin size={24} />
                            </div>
                            <h3 className="font-bold text-white mb-2">Siège</h3>
                            <p className="text-slate-400 text-sm">Paris, France</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">Envoyer un message</h2>
                        <ContactForm domain="taxifrance.fr" city="Hub National" theme={getTheme('national')} />
                    </div>
                </div>
            </section>
        </div>
    );
}
