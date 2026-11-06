"use client";

import { Car, Users, Gauge, Wifi, ShieldCheck, BatteryCharging, Briefcase } from "lucide-react";
import { getHelpfulContent } from "@/lib/content";
import { Database } from "@/types/database.types";
import { getTheme } from "@/lib/theme";
import Image from "next/image";
import { useState } from "react";
import CallModal from "./CallModal";

type Vehicle = Database['public']['Tables']['vehicles']['Row'];

interface VehiclesProps {
    city: string;
    slug: string;
    vehicles?: Vehicle[] | null;
    phoneNumber: string;
}

export function Vehicles({ city, slug, vehicles, phoneNumber }: VehiclesProps) {
    const theme = getTheme(slug);
    const classes = theme.classes;
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Legacy Spintax Fallback
    const sedanTitle = getHelpfulContent("vehicle_sedan_title", city, 'HUB');
    const sedanDesc = getHelpfulContent("vehicle_sedan_desc", city, 'HUB');
    const vanTitle = getHelpfulContent("vehicle_van_title", city, 'HUB');
    const vanDesc = getHelpfulContent("vehicle_van_desc", city, 'HUB');

    // FORCE STATIC DISPLAY FOR NEW DESIGN (Ignore DB for now)
    const hasDynamicVehicles = false; // vehicles && vehicles.length > 0;

    const handleBook = () => setIsModalOpen(true);

    return (
        <section className="py-20 bg-slate-50">
            <CallModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                phoneNumber={phoneNumber}
                cityName={city}
                theme={theme}
            />

            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 mb-4">
                        <Car className="w-3 h-3 mr-1" />
                        Flotte Premium
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                        Nos Véhicules à <span className="text-blue-600">{city}</span>
                    </h2>
                    <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">
                        Une gamme de véhicules récents, entretenus quotidiennement et adaptés à tous vos besoins de transport.
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {hasDynamicVehicles ? (
                        vehicles!.map((car) => (
                            <VehicleCard key={car.id} car={car} theme={theme} onBook={handleBook} />
                        ))
                    ) : (
                        <>
                            {/* 1. Eco / Abordable */}
                            <div className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 flex flex-col">
                                <div className="h-48 overflow-hidden relative shrink-0">
                                    <Image
                                        src="/vehicle-eco.png"
                                        alt="Taxi Eco Abordable - Toyota Prius"
                                        width={400}
                                        height={300}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">
                                        1-4 Passagers
                                    </div>
                                    <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Éco
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Gamme Éco</h3>
                                    <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                                        La solution idéale pour vos trajets quotidiens au meilleur tarif. Confort et sobriété énergétique.
                                    </p>
                                    <ul className="grid grid-cols-2 gap-3 mb-8">
                                        <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <Gauge size={16} className="text-green-500" /> Tarif Abordable
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <BatteryCharging size={16} className="text-green-500" /> Hybride / Élec
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <ShieldCheck size={16} className="text-green-500" /> Sécurité
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <Wifi size={16} className="text-green-500" /> Climatisé
                                        </li>
                                    </ul>
                                    <button onClick={handleBook} className={`block w-full py-4 rounded-xl font-bold text-center transition border shadow-lg hover:brightness-110 active:scale-95 text-white ${classes.bg} ${classes.border}`}>
                                        Réserver un véhicule Éco
                                    </button>
                                </div>
                            </div>

                            {/* 2. Berline Affaires */}
                            <div className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 flex flex-col">
                                <div className="h-48 overflow-hidden relative shrink-0">
                                    <Image
                                        src="/vehicle-business.png"
                                        alt="Taxi Berline Affaires - Mercedes Classe E"
                                        width={400}
                                        height={300}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">
                                        1-4 Passagers
                                    </div>
                                    <div className="absolute top-4 left-4 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Affaires
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Berline Affaires</h3>
                                    <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                                        Voyagez en première classe. Véhicules de standing (Mercedes Classe E) pour vos rendez-vous pros ou transferts.
                                    </p>
                                    <ul className="grid grid-cols-2 gap-3 mb-8">
                                        <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <Briefcase size={16} className="text-slate-900" /> Standing Pro
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <Wifi size={16} className="text-slate-900" /> Wi-Fi & Chargeur
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <ShieldCheck size={16} className="text-slate-900" /> Chauffeur Veston
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <Gauge size={16} className="text-slate-900" /> Conduite Souple
                                        </li>
                                    </ul>
                                    <button onClick={handleBook} className={`block w-full py-4 rounded-xl font-bold text-center transition border shadow-lg hover:brightness-110 active:scale-95 text-white ${classes.bg} ${classes.border}`}>
                                        Réserver une Berline
                                    </button>
                                </div>
                            </div>

                            {/* 3. Grand Confort / Van */}
                            <div className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 flex flex-col">
                                <div className="h-48 overflow-hidden relative shrink-0">
                                    <Image
                                        src="/vehicle-van.png"
                                        alt="Taxi Van Grand Confort - Mercedes Classe V"
                                        width={400}
                                        height={300}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">
                                        1-7 Passagers
                                    </div>
                                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                        Van VIP
                                    </div>
                                </div>
                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Van Grand Confort</h3>
                                    <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                                        L'espace absolu pour les groupes ou familles. Mercedes Classe V. Idéal navettes aéroports avec bagages.
                                    </p>
                                    <ul className="grid grid-cols-2 gap-3 mb-8">
                                        <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <Users size={16} className="text-blue-600" /> 7 Sièges Cuir
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <Briefcase size={16} className="text-blue-600" /> Coffre XXL
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <Wifi size={16} className="text-blue-600" /> Salon Mobile
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                                            <ShieldCheck size={16} className="text-blue-600" /> Sièges Bébé
                                        </li>
                                    </ul>
                                    <button onClick={handleBook} className={`block w-full py-4 rounded-xl font-bold text-center transition border shadow-lg hover:brightness-110 active:scale-95 text-white ${classes.bg} ${classes.border}`}>
                                        Réserver un Van
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}

// Helper component for dynamic vehicle rendering (reused from above)
function VehicleCard({ car, theme, onBook }: { car: Vehicle; theme: any, onBook: () => void }) {
    const classes = theme.classes;
    // Determine image source: DB url or fallback based on name/slug detection if we were fully dynamic
    // For now we use the hardcoded paths for the new static design, this component is kept for structure.

    // Hack for the hardcoded static values to map to the new images if we were looping
    let imgSrc = car.image_url || "/placeholder-car.jpg";
    if (car.name.includes("Eco")) imgSrc = "/vehicle-eco.png";
    if (car.name.includes("Affaires")) imgSrc = "/vehicle-business.png";
    if (car.name.includes("Van")) imgSrc = "/vehicle-van.png";

    return (
        <div className="group bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 flex flex-col">
            <div className="h-48 overflow-hidden relative shrink-0">
                <Image
                    src={imgSrc}
                    alt={car.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded-full">
                    1-{car.capacity_passengers} Passagers
                </div>
                {car.price_class === 'premium' && (
                    <div className="absolute top-4 left-4 bg-yellow-400 text-neutral-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        Premium
                    </div>
                )}
            </div>
            <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{car.name}</h3>
                <p className="text-slate-600 mb-6 leading-relaxed flex-1">
                    {car.description}
                </p>
                <ul className="grid grid-cols-2 gap-3 mb-8">
                    <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <Users size={16} className="text-blue-500" /> {car.capacity_passengers} pers.
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <Briefcase size={16} className="text-blue-500" /> {car.capacity_luggage} valises
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <Wifi size={16} className="text-blue-500" /> Wi-Fi inclus
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                        <ShieldCheck size={16} className="text-blue-500" /> Sécurité
                    </li>
                </ul>
                <button onClick={onBook} className={`block w-full py-4 rounded-xl font-bold text-center transition border shadow-lg hover:brightness-110 active:scale-95 text-white ${classes.bg} ${classes.border} mt-auto`}>
                    Réserver ce véhicule
                </button>
            </div>
        </div>
    );
}
