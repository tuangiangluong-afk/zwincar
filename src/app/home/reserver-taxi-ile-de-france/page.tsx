export const revalidate = 86400; // 24h ISR cache

import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Zap } from "lucide-react";
import { DEPARTMENTS } from "@/config/departments";

export default function RegionPage() {
    const departments = Object.values(DEPARTMENTS);

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-white">
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link href="/home" className="text-2xl font-black tracking-tighter text-white hover:text-blue-400 transition">
                        Taxi de France<span className="text-blue-500">.</span>
                    </Link>
                    <Link href="/home" className="text-sm font-bold text-slate-400 hover:text-white transition flex items-center gap-2">
                        <ArrowLeft size={16} /> Retour Accueil
                    </Link>
                </div>
            </nav>

            <section className="relative pt-40 pb-24 px-6">
                {/* Background Glow */}
                <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="mx-auto max-w-7xl relative z-10">
                    <div className="text-center mb-24">
                        <span className="inline-block rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-bold text-blue-400 mb-6 tracking-widest uppercase backdrop-blur-md">
                            Région Île-de-France
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
                            Choisissez votre <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                Secteur de Prise en Charge
                            </span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Nous avons organisé notre flotte par département pour vous garantir une réactivité maximale.
                            Sélectionnez votre zone de départ.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {departments.map((dept, index) => (
                            <Link
                                key={dept.code}
                                href={`/home/departement/${dept.slug}`}
                                className="group relative flex flex-col h-[500px] rounded-[2rem] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-blue-900/20"
                            >
                                {/* Card Background Image (Semantic & SEO) */}
                                <img
                                    src={dept.image}
                                    alt={`Taxi ${dept.name} - Chauffeurs VTC et Taxis dans le ${dept.code}`}
                                    width={400}
                                    height={500}
                                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[0.5] group-hover:brightness-[0.6]"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-t ${dept.heroColor} opacity-50 mix-blend-multiply`} />

                                {/* Content */}
                                <div className="relative z-10 p-8 flex flex-col h-full">
                                    <div className="flex justify-between items-start">
                                        <div className="text-6xl font-black text-white/10 group-hover:text-white/20 transition-colors duration-500">
                                            {dept.code}
                                        </div>
                                        <div className="p-3 rounded-full bg-white/5 border border-white/10 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                                            <ArrowRight size={24} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <h3 className="text-3xl font-black text-white mb-4 leading-tight group-hover:translate-x-2 transition-transform duration-300">
                                            {dept.name}
                                        </h3>
                                        <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-6 group-hover:text-white transition-colors">
                                            {dept.description}
                                        </p>
                                        <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-widest group-hover:text-white transition-colors">
                                            <Zap size={14} className="fill-current" />
                                            Disponibilité Immédiate
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
