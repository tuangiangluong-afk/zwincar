"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Users,
    Briefcase,
    Fuel,
    Cog,
    ShieldCheck,
    CheckCircle2,
    Calendar,
    MessageCircle,
    ArrowRight,
    X,
    Lock,
    ExternalLink,
    Zap,
} from "lucide-react";
import { VEHICLE_FLEET, VehicleModel, UPSELL_OPTIONS, MOROCCAN_HUBS, CityHub } from "@/lib/morocco-data";
import { DEFAULT_HUB_DISTRIBUTION, DEFAULT_VEHICLE_STOCK } from "@/lib/affiliate";
import UpsellSelector from "@/components/UpsellSelector";
import { BookingCheckoutModal } from "@/components/BookingCheckoutModal";
import { AffiliateExitDrawer } from "@/components/AffiliateExitDrawer";

interface VehicleCatalogProps {
    days?: number;
    pickupCity?: string;
}

export default function VehicleCatalog({ days = 6, pickupCity = "Marrakech" }: VehicleCatalogProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [currency, setCurrency] = useState<"EUR" | "MAD" | "GBP" | "USD">("EUR");
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(null);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isAffiliateDrawerOpen, setIsAffiliateDrawerOpen] = useState(false);
    const [selectedUpsells, setSelectedUpsells] = useState<string[]>([
        "franchise-zero",
        "conducteur-additionnel",
    ]);

    // Hub resolution & distribution mode
    const currentHub: CityHub = MOROCCAN_HUBS.find((h) =>
        pickupCity.toLowerCase().includes(h.slug) ||
        h.name.toLowerCase().includes(pickupCity.toLowerCase())
    ) || MOROCCAN_HUBS[0];

    const hubMode = DEFAULT_HUB_DISTRIBUTION[currentHub.slug] || "direct";

    // Filter vehicles
    const filteredVehicles = VEHICLE_FLEET.filter((v) => {
        if (selectedCategory === "all") return true;
        if (selectedCategory === "auto") return v.transmission === "Automatique";
        if (selectedCategory === "suv") return v.category === "SUV & 4x4";
        if (selectedCategory === "citadine") return v.category === "Citadine" || v.category === "Compacte";
        if (selectedCategory === "family") return v.category === "Familiale & 7 Places";
        return true;
    });

    // Currency formatting
    const formatPrice = (eur: number, mad: number) => {
        switch (currency) {
            case "MAD":
                return `${mad} DH`;
            case "GBP":
                return `£${Math.round(eur * 0.85)}`;
            case "USD":
                return `$${Math.round(eur * 1.08)}`;
            case "EUR":
            default:
                return `${eur} €`;
        }
    };

    const handleSelectVehicle = (v: VehicleModel) => {
        const isAff = hubMode === "affiliate" || DEFAULT_VEHICLE_STOCK[v.id] === false;
        setSelectedVehicle(v);
        if (isAff) {
            setIsAffiliateDrawerOpen(true);
        } else {
            setIsBookingModalOpen(true);
        }
    };

    const handleToggleUpsell = (id: string) => {
        setSelectedUpsells((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    // Dates
    const today = new Date();
    const pickupDateObj = new Date(today);
    pickupDateObj.setDate(today.getDate() + 2);
    const returnDateObj = new Date(today);
    returnDateObj.setDate(today.getDate() + 2 + days);

    const pickupDate = pickupDateObj.toISOString().split("T")[0];
    const returnDate = returnDateObj.toISOString().split("T")[0];

    // Split upsell accounting for modal
    let platformUpsellsEur = 0;
    let vendorUpsellsEur = 0;

    selectedUpsells.forEach((upsellId) => {
        const item = UPSELL_OPTIONS.find((u) => u.id === upsellId);
        if (!item) return;
        const costEur = item.type === "per_day" ? item.priceEur * days : item.priceEur;
        if (item.provider === "platform") {
            platformUpsellsEur += costEur;
        } else {
            vendorUpsellsEur += costEur;
        }
    });

    const platformUpsellsMad = platformUpsellsEur * 11;
    const vendorUpsellsMad = vendorUpsellsEur * 11;

    return (
        <section id="vehicle-catalog" className="py-16 bg-[#FAF7F2]">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header & Controls Bar */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#E7DFD5]">
                    <div>
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9572C] mb-2">
                            <ShieldCheck size={14} />
                            Flotte Réelle • Modèle Garanti
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                            Véhicules disponibles à {pickupCity}
                        </h2>
                        <p className="text-sm text-slate-600 mt-1">
                            Modèles garantis, révisés pour le climat local et livrés sans attente à l'aéroport ou à votre riad.
                        </p>
                    </div>

                    {/* Filter Pills & Currency Switch */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="inline-flex rounded-full bg-white p-1 border border-[#E7DFD5] shadow-xs text-xs">
                            {[
                                { id: "all", label: "Tous" },
                                { id: "auto", label: "Automatique" },
                                { id: "suv", label: "SUV & 4x4" },
                                { id: "citadine", label: "Citadines" },
                                { id: "family", label: "7 Places" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setSelectedCategory(tab.id)}
                                    className={`px-3 py-1.5 rounded-full font-medium transition cursor-pointer ${
                                        selectedCategory === tab.id
                                            ? "bg-slate-900 text-white font-semibold"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Currency selector */}
                        <div className="inline-flex rounded-full bg-white px-2 py-1 border border-[#E7DFD5] shadow-xs text-xs font-semibold text-slate-700">
                            {(["EUR", "MAD", "GBP", "USD"] as const).map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setCurrency(c)}
                                    className={`px-2 py-0.5 rounded cursor-pointer transition ${
                                        currency === c
                                            ? "bg-[#C9572C]/15 text-[#C9572C] font-bold"
                                            : "hover:text-slate-900"
                                    }`}
                                >
                                    {c === "MAD" ? "DH" : c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Vehicles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map((vehicle) => {
                        const totalEst = vehicle.dailyPriceEur * days;
                        const isAffiliate = hubMode === "affiliate" || DEFAULT_VEHICLE_STOCK[vehicle.id] === false;
                        const vehicleLocalUrl = `/maroc/${currentHub.slug}/${vehicle.id}`;

                        return (
                            <div
                                key={vehicle.id}
                                className="group rounded-3xl bg-white border border-[#E7DFD5] hover:border-slate-400 p-5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    {/* Top badges */}
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                                            {vehicle.category}
                                        </span>
                                        {isAffiliate ? (
                                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800">
                                                Partenaire Vérifié
                                            </span>
                                        ) : (
                                            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#E7DFD5] text-slate-700">
                                                Caution 0€ ou 300€
                                            </span>
                                        )}
                                    </div>

                                    {/* Vehicle Image */}
                                    <Link href={vehicleLocalUrl} className="block relative w-full h-44 rounded-2xl overflow-hidden bg-slate-50 mb-4 cursor-pointer">
                                        <img
                                            src={vehicle.image}
                                            alt={vehicle.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute bottom-2 left-2 bg-[#12161E]/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                            {vehicle.transmission}
                                        </div>
                                    </Link>

                                    {/* Title & Highlight */}
                                    <Link href={vehicleLocalUrl}>
                                        <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-[#C9572C] transition-colors flex items-center justify-between">
                                            <span>{vehicle.name}</span>
                                            <ExternalLink size={15} className="text-slate-300 group-hover:text-[#C9572C] transition-colors shrink-0 ml-1" />
                                        </h3>
                                    </Link>
                                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                        {vehicle.highlight}
                                    </p>

                                    {/* Specs Pills */}
                                    <div className="grid grid-cols-4 gap-2 my-4 py-3 border-y border-slate-100 text-xs text-slate-600">
                                        <div className="flex flex-col items-center">
                                            <Users size={14} className="text-slate-400 mb-1" />
                                            <span className="font-semibold">{vehicle.seats} pl.</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Briefcase size={14} className="text-slate-400 mb-1" />
                                            <span className="font-semibold">{vehicle.luggage} bag.</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Cog size={14} className="text-slate-400 mb-1" />
                                            <span className="font-semibold">{vehicle.transmission.slice(0, 4)}.</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <Fuel size={14} className="text-slate-400 mb-1" />
                                            <span className="font-semibold">{vehicle.fuel}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dual Price Display & Action Buttons */}
                                <div>
                                    <div className="flex items-baseline justify-between mb-3.5">
                                        <div>
                                            <div className="text-[11px] text-slate-400">Tarif par jour</div>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-2xl font-black text-slate-900">
                                                    {formatPrice(vehicle.dailyPriceEur, vehicle.dailyPriceMad)}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium">/ j</span>
                                                <span className="text-xs font-mono text-slate-400 font-semibold ml-0.5">
                                                    ({vehicle.dailyPriceMad} MAD)
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[11px] font-medium text-slate-500">
                                                Livraison aéroport incluse
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                                                {days}j : ~{formatPrice(totalEst, totalEst * 11)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* 2 Action Buttons: Direct Booking / Affiliate + Full SEO Product Page */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {isAffiliate ? (
                                            <button
                                                type="button"
                                                onClick={() => handleSelectVehicle(vehicle)}
                                                className="h-11 rounded-2xl bg-slate-900 hover:bg-[#C9572C] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                                            >
                                                <ExternalLink size={14} />
                                                <span>Dispos Aéroport</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => handleSelectVehicle(vehicle)}
                                                className="h-11 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
                                            >
                                                <Zap size={14} />
                                                <span>Réserver</span>
                                            </button>
                                        )}

                                        <Link
                                            href={vehicleLocalUrl}
                                            className="h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                                        >
                                            <span>Fiche & Avis</span>
                                            <ArrowRight size={14} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal de Réservation Instantanée avec Checkout Direct */}
            {isBookingModalOpen && selectedVehicle && (
                <BookingCheckoutModal
                    isOpen={isBookingModalOpen}
                    onClose={() => setIsBookingModalOpen(false)}
                    vehicle={selectedVehicle}
                    pickupHubSlug={currentHub.slug}
                    pickupDate={pickupDate}
                    returnDate={returnDate}
                    days={days}
                    selectedUpsells={selectedUpsells}
                    vendorUpsellsEur={vendorUpsellsEur}
                    vendorUpsellsMad={vendorUpsellsMad}
                    platformUpsellsEur={platformUpsellsEur}
                    platformUpsellsMad={platformUpsellsMad}
                    depositAcompteEur={Math.round((selectedVehicle.dailyPriceEur * days + vendorUpsellsEur) * 0.2) + platformUpsellsEur}
                    depositAcompteMad={(Math.round((selectedVehicle.dailyPriceEur * days + vendorUpsellsEur) * 0.2) + platformUpsellsEur) * 11}
                    balanceOnSiteEur={selectedVehicle.dailyPriceEur * days + vendorUpsellsEur - Math.round((selectedVehicle.dailyPriceEur * days + vendorUpsellsEur) * 0.2)}
                    balanceOnSiteMad={(selectedVehicle.dailyPriceEur * days + vendorUpsellsEur - Math.round((selectedVehicle.dailyPriceEur * days + vendorUpsellsEur) * 0.2)) * 11}
                    currency={currency === "MAD" ? "MAD" : "EUR"}
                />
            )}

            {/* Drawer de redirection Affiliation Partenaire (Fallback Haute Saison / Hors Stock) */}
            {isAffiliateDrawerOpen && selectedVehicle && (
                <AffiliateExitDrawer
                    isOpen={isAffiliateDrawerOpen}
                    onClose={() => setIsAffiliateDrawerOpen(false)}
                    vehicle={selectedVehicle}
                    hub={currentHub}
                    pickupDate={pickupDate}
                    returnDate={returnDate}
                />
            )}
        </section>
    );
}
