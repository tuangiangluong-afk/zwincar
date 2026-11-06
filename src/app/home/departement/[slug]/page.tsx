
import { CITIES } from "@/lib/db";
import Link from "next/link";
import { Phone, ArrowUpRight, MapPin, ShieldCheck, Star } from "lucide-react";
import { DepartmentMap } from "@/components/DepartmentMap";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DEPARTMENTS } from "@/config/departments";

// ISR: Cache page for 1 hour
export const revalidate = 3600;

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const dept = DEPARTMENTS[resolvedParams.slug];
    if (!dept) return { title: "Département introuvable" };

    return {
        title: `Taxi ${dept.name} (${dept.code}) | Réseau Taxi de France`,
        description: `Trouvez un taxi officiel dans le ${dept.code}. Réseau de chauffeurs indépendants à ${dept.name}. Réservation directe sans commission.`,
    };
}

export default async function DepartmentPage({ params }: Props) {
    const resolvedParams = await params;
    const dept = DEPARTMENTS[resolvedParams.slug];

    if (!dept) return notFound();

    // FILTRE INTELLIGENT : On récupère toutes les villes qui match le code postal dans le nom (ex: "Taxi Plaisir 78")
    const citiesInDept = Object.values(CITIES).filter(city =>
        city.name.includes(` ${dept.code}`)
    );

    // structured data for breadcrumbs
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": "https://taxifrance.fr/home"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Île-de-France",
                "item": "https://taxifrance.fr/home/reserver-taxi-ile-de-france"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": dept.name,
                "item": `https://taxifrance.fr/home/departement/${dept.slug}`
            }
        ]
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-neutral-900">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Navbar simple pour le Hub */}
            <nav className="border-b border-white/10 bg-neutral-900 px-6 py-4 sticky top-0 z-50 shadow-md backdrop-blur-md bg-neutral-900/90 text-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <Link href="/home" className="text-2xl font-bold tracking-tighter">
                        Taxi de France<span className="text-blue-500">.</span>
                    </Link>
                    <Link href="/home/reserver-taxi-ile-de-france" className="text-sm font-medium text-neutral-400 hover:text-white transition">
                        ← Changer de zone
                    </Link>
                </div>
            </nav>

            <main>
                {/* Header SEO Power - Modern & Dark */}
                <section className={`relative overflow-hidden bg-gradient-to-br ${dept.heroColor} py-24 px-6 text-white`}>
                    {/* Abstract Background Pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>

                    <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center relative z-10">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 text-xs font-bold text-white mb-8 tracking-wider uppercase">
                                <MapPin size={12} className="mr-2" />
                                Département {dept.code}
                            </span>
                            <h1 className="text-5xl font-black tracking-tight sm:text-7xl mb-6 shadow-black drop-shadow-lg">
                                Taxis <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">{dept.name}</span>
                            </h1>
                            <p className="text-xl text-neutral-300 mb-10 leading-relaxed max-w-xl">
                                {dept.description}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-lg text-sm font-medium text-neutral-200">
                                    <ShieldCheck size={16} className="text-emerald-400" />
                                    Chauffeurs Vérifiés
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-lg text-sm font-medium text-neutral-200">
                                    <Star size={16} className="text-yellow-400" />
                                    Top Notation
                                </div>
                            </div>
                        </div>

                        {/* Map Component - Premium integration */}
                        <div className="relative">
                            <div className="absolute -inset-2 bg-gradient-to-b from-blue-500 to-purple-600 rounded-3xl opacity-30 blur-2xl"></div>
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-white/20 h-[350px] lg:h-[450px]">
                                <DepartmentMap center={dept.center} zoom={11} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* THE MONEY GRID (Liens sortants vers tes domaines) */}
                <section className="py-24 px-6 bg-slate-50">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-16 text-center">
                            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">
                                Villes du réseau {dept.name}
                            </h2>
                            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                                Sélectionnez votre ville de départ pour accéder directement au chauffeur local.
                                <span className="font-semibold text-slate-800"> Réservation en direct, 0% commission.</span>
                            </p>
                        </div>

                        {citiesInDept.length > 0 ? (
                            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                                {citiesInDept.map((city) => (
                                    <Link
                                        key={city.slug}
                                        href={`https://${city.domain}`} // HTTPS IMPERATIF
                                        target="_blank" // Ouvre dans un nouvel onglet (garde le hub ouvert)
                                        rel="dofollow" // EXPLICITE : On transfère le jus SEO
                                        className="group relative flex flex-col overflow-hidden rounded-3xl bg-white shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 border border-slate-100"
                                    >
                                        {/* Header Image (Semantic & SEO) */}
                                        <div className="relative h-40 overflow-hidden">
                                            <img
                                                src={
                                                    city.heroImage && !city.heroImage.startsWith("/")
                                                        ? city.heroImage
                                                        : "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2940&auto=format&fit=crop"
                                                }
                                                alt={`Taxi ${city.city} (${dept.code}) - Réservation VTC & Taxi`}
                                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 filter brightness-[0.6]"
                                                loading="lazy"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className={`absolute inset-0 bg-gradient-to-t ${dept.heroColor} opacity-60 mix-blend-multiply`} />

                                            {/* City Badge */}
                                            <div className="absolute bottom-4 left-6 z-10 w-full pr-12">
                                                <h3 className="text-2xl font-black text-white tracking-tight drop-shadow-lg leading-none">
                                                    {city.city}
                                                </h3>
                                            </div>
                                            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-white border border-white/20 uppercase tracking-widest z-10">
                                                Taxi Officiel
                                            </div>
                                        </div>

                                        <div className="p-8 flex flex-col flex-1 bg-white">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    <MapPin size={12} />
                                                    {dept.code} — {city.name}
                                                </div>
                                                <div className="bg-slate-50 p-2 rounded-full text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                                                    <ArrowUpRight size={18} />
                                                </div>
                                            </div>

                                            <p className="text-slate-600 text-sm leading-relaxed mb-8 flex-1 line-clamp-2">
                                                {city.description}
                                            </p>

                                            <div className="mt-auto">
                                                <div className="w-full flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-4 text-sm font-bold text-white transition-all duration-300 group-hover:bg-blue-600 shadow-xl shadow-slate-900/10 group-hover:shadow-blue-600/30">
                                                    <Phone size={18} />
                                                    Commander un Taxi
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="p-16 text-center bg-white rounded-3xl border border-dashed border-slate-300 max-w-2xl mx-auto">
                                <div className="mb-4 inline-flex p-4 bg-slate-100 rounded-full text-slate-400">
                                    <MapPin size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Zone en cours de déploiement</h3>
                                <p className="text-slate-500 mb-8">Aucun taxi partenaire référencé sur cette zone pour le moment.</p>
                                <a href="mailto:contact@taxifrance.fr" className="inline-flex items-center font-bold text-blue-600 hover:text-blue-800 transition">
                                    Devenir le premier partenaire sur le {dept.code} <ArrowUpRight size={16} className="ml-1" />
                                </a>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
