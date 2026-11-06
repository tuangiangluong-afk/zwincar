import Link from 'next/link';
import { Phone, Home, MapPin, ArrowRight } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex flex-col items-center justify-center px-4 text-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-2xl mx-auto">
                {/* 404 Number */}
                <div className="mb-8">
                    <span className="text-[150px] sm:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 leading-none select-none">
                        404
                    </span>
                </div>

                {/* Message */}
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                    Cette page n'existe plus
                </h1>
                <p className="text-neutral-400 text-lg mb-8 max-w-md mx-auto">
                    La page que vous recherchez a été déplacée ou supprimée.
                    Pas de panique, votre taxi vous attend !
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-neutral-900 font-bold text-lg shadow-lg shadow-yellow-500/25 hover:-translate-y-1 hover:shadow-xl hover:shadow-yellow-500/30 transition-all"
                    >
                        <Home size={20} />
                        Retour à l'accueil
                    </Link>
                    <a
                        href="tel:0184607878"
                        className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all"
                    >
                        <Phone size={20} />
                        Appeler un taxi
                    </a>
                </div>

                {/* Quick Links */}
                <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6">
                    <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                        Accès rapides
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Link
                            href="/gare-aeroport"
                            className="flex items-center gap-2 text-neutral-300 hover:text-yellow-400 transition group"
                        >
                            <MapPin size={16} className="text-yellow-500" />
                            <span>Gare & Aéroport</span>
                            <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                        <Link
                            href="/transport-medical"
                            className="flex items-center gap-2 text-neutral-300 hover:text-yellow-400 transition group"
                        >
                            <MapPin size={16} className="text-teal-500" />
                            <span>Transport Médical</span>
                            <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                        <Link
                            href="/longue-distance"
                            className="flex items-center gap-2 text-neutral-300 hover:text-yellow-400 transition group"
                        >
                            <MapPin size={16} className="text-purple-500" />
                            <span>Longue Distance</span>
                            <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                        </Link>
                    </div>
                </div>

                {/* Branding */}
                <p className="text-neutral-500 text-sm mt-8">
                    © {new Date().getFullYear()} Taxi de France — Réseau National
                </p>
            </div>
        </div>
    );
}
