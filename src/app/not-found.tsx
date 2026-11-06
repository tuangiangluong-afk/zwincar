import Link from "next/link";
import Logo from "@/components/Logo";
import { Car, MapPin, Compass, ArrowRight, MessageCircle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#12161E] flex flex-col justify-between selection:bg-[#C9572C] selection:text-white font-sans">
            {/* Top Minimal Nav */}
            <header className="p-6 border-b border-[#E7DFD5] bg-white/80 backdrop-blur-md">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <Logo variant="full" theme="dark" size="md" />
                    <Link
                        href="/"
                        className="text-xs font-bold text-slate-700 hover:text-[#C9572C] transition-colors"
                    >
                        ← Retour à l'accueil
                    </Link>
                </div>
            </header>

            {/* Main 404 Hero */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C9572C]/10 border border-[#C9572C]/20 text-[#C9572C] text-xs font-bold tracking-wider uppercase mb-6">
                    <Compass size={14} />
                    <span>Erreur 404 • Piste Introuvable</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight mb-4">
                    Cette route n'existe pas.
                </h1>

                <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-md mx-auto leading-relaxed">
                    La page que vous recherchez a été déplacée ou n'est plus accessible.
                    Reprenez la route avec nos véhicules garantis sans caution bloquée.
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mb-12">
                    <Link
                        href="/#vehicle-catalog"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-[#C9572C] hover:bg-[#b54a22] text-white font-bold text-sm shadow-md transition-all active:scale-98"
                    >
                        <Car size={16} />
                        Voir les voitures disponibles
                    </Link>
                    <a
                        href="https://wa.me/212600000000?text=Bonjour%20ZwinCar,%20je%20cherche%20une%20information%20sur%20le%20site"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-[#E7DFD5] text-slate-800 font-bold text-sm shadow-xs transition-all"
                    >
                        <MessageCircle size={16} className="text-emerald-500" />
                        Assistance WhatsApp 24/7
                    </a>
                </div>

                {/* Quick Hub Links */}
                <div className="w-full bg-white rounded-3xl border border-[#E7DFD5] p-6 shadow-xs text-left">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                        Aéroports & Villes Populaires au Maroc :
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <Link
                            href="/maroc/marrakech"
                            className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-slate-900 hover:text-white border border-[#E7DFD5] font-semibold text-slate-800 transition flex items-center justify-between"
                        >
                            <span>Marrakech (RAK)</span>
                            <ArrowRight size={12} className="opacity-50" />
                        </Link>
                        <Link
                            href="/maroc/agadir"
                            className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-slate-900 hover:text-white border border-[#E7DFD5] font-semibold text-slate-800 transition flex items-center justify-between"
                        >
                            <span>Agadir (AGA)</span>
                            <ArrowRight size={12} className="opacity-50" />
                        </Link>
                        <Link
                            href="/maroc/casablanca"
                            className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-slate-900 hover:text-white border border-[#E7DFD5] font-semibold text-slate-800 transition flex items-center justify-between"
                        >
                            <span>Casablanca (CMN)</span>
                            <ArrowRight size={12} className="opacity-50" />
                        </Link>
                        <Link
                            href="/guides"
                            className="p-2.5 rounded-xl bg-[#FAF7F2] hover:bg-slate-900 hover:text-white border border-[#E7DFD5] font-semibold text-slate-800 transition flex items-center justify-between"
                        >
                            <span>Guides Maroc</span>
                            <ArrowRight size={12} className="opacity-50" />
                        </Link>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="p-6 border-t border-[#E7DFD5] text-center text-xs text-slate-500">
                © {new Date().getFullYear()} ZwinCar.com • Location de voiture au Maroc auprès des meilleurs loueurs locaux vérifiés.
            </footer>
        </div>
    );
}
