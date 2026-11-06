"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    DollarSign,
    Car,
    Users,
    Building2,
    Calendar,
    Clock,
    Search,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    ExternalLink,
    RefreshCw,
    TrendingUp,
    Check,
    X,
    Filter,
} from "lucide-react";

export default function AdminDashboardPage() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [hubFilter, setHubFilter] = useState<string>("all");
    const [actionMsg, setActionMsg] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/overview");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (e) {
            console.error("Failed to load admin overview:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toggleAgencyStatus = async (agencyId: string, currentStatus: string) => {
        const nextStatus = currentStatus === "active" ? "suspended" : "active";
        try {
            const res = await fetch(`/api/admin/agencies/${agencyId}/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
            });
            if (res.ok) {
                setActionMsg(`Statut agence mis à jour : ${nextStatus}`);
                fetchData();
                setTimeout(() => setActionMsg(null), 3000);
            }
        } catch {
            // ignore
        }
    };

    if (loading && !data) {
        return (
            <div className="flex items-center justify-center min-h-[500px]">
                <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                    <RefreshCw size={18} className="animate-spin text-[#C9572C]" />
                    <span>Chargement de la supervision nationale...</span>
                </div>
            </div>
        );
    }

    const kpis = data?.kpis || {
        gmvEur: 0,
        gmvMad: 0,
        acompteStripeEur: 0,
        soldeTerrainEur: 0,
        totalBookingsCount: 0,
        totalAgenciesCount: 0,
        totalFleetVehicles: 0,
    };

    const bookings = (data?.bookings || []).filter((b: any) => {
        const matchesSearch =
            !searchQuery ||
            b.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.clientEmail.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || b.status === statusFilter;
        const matchesHub = hubFilter === "all" || b.pickupHub === hubFilter;
        return matchesSearch && matchesStatus && matchesHub;
    });

    const agencies = data?.agencies || [];

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Top Bar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <span>Supervision Nationale ZwinCar</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                            Live Maroc
                        </span>
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Vue consolidée des acomptes Stripe, soldes agences, réservations et flotte physique.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={fetchData}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin text-[#C9572C]" : ""} />
                        <span>Actualiser</span>
                    </button>
                    <a
                        href="/vendor/dashboard"
                        target="_blank"
                        className="px-3.5 py-2 rounded-xl bg-[#12161E] hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    >
                        <span>Espace Loueur</span>
                        <ExternalLink size={13} />
                    </a>
                </div>
            </div>

            {actionMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                    {actionMsg}
                </div>
            )}

            {/* Financial & Operational KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* GMV Total */}
                <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                        <span>Volume d'Affaires (GMV)</span>
                        <TrendingUp size={16} className="text-[#C9572C]" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                        {kpis.gmvEur.toLocaleString()} €
                    </div>
                    <div className="text-xs text-slate-400 mt-1 font-mono">
                        ~{kpis.gmvMad.toLocaleString()} MAD
                    </div>
                </div>

                {/* Acomptes Encaissés (Stripe) */}
                <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                        <span>Acomptes Encaissés (20%)</span>
                        <DollarSign size={16} className="text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-emerald-600 font-mono">
                        {kpis.acompteStripeEur.toLocaleString()} €
                    </div>
                    <div className="text-xs text-emerald-700/80 mt-1">
                        Cash sécurisé Stripe • Risque no-show couvert
                    </div>
                </div>

                {/* Soldes Loueurs Terrain (80%) */}
                <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                        <span>Soldes Terrain Agences (80%)</span>
                        <Building2 size={16} className="text-blue-600" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                        {kpis.soldeTerrainEur.toLocaleString()} €
                    </div>
                    <div className="text-xs text-slate-500 mt-1 font-mono">
                        ~{kpis.soldeTerrainMad.toLocaleString()} MAD à encaisser au parking
                    </div>
                </div>

                {/* Flotte & Partenaires */}
                <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs">
                    <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                        <span>Réseau Loueurs & Flotte</span>
                        <Car size={16} className="text-[#E58B24]" />
                    </div>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                        {kpis.totalFleetVehicles} véhicules
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                        {kpis.totalAgenciesCount} agences partenaires actives
                    </div>
                </div>
            </div>

            {/* Radar National des Réservations */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-base font-black text-slate-900 tracking-tight">
                            Radar National des Dossiers ({bookings.length})
                        </h2>
                        <p className="text-xs text-slate-500">
                            Supervision des arrivées aéroports, statuts KYC et règlements.
                        </p>
                    </div>

                    {/* Filters & Search */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Rechercher réf, client, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9 pl-8 pr-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C] w-56"
                            />
                            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#C9572C]"
                        >
                            <option value="all">Tous statuts</option>
                            <option value="confirmed">Confirmés</option>
                            <option value="checked_in">Checked-in (En cours)</option>
                            <option value="completed">Clôturés</option>
                            <option value="cancelled">Annulés</option>
                        </select>

                        <select
                            value={hubFilter}
                            onChange={(e) => setHubFilter(e.target.value)}
                            className="h-9 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#C9572C]"
                        >
                            <option value="all">Tous aéroports</option>
                            <option value="marrakech">Marrakech</option>
                            <option value="casablanca">Casablanca</option>
                            <option value="agadir">Agadir</option>
                            <option value="tanger">Tanger</option>
                            <option value="fes">Fès</option>
                            <option value="rabat">Rabat</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="py-3 px-4">Dossier</th>
                                <th className="py-3 px-4">Client</th>
                                <th className="py-3 px-4">Véhicule & Hub</th>
                                <th className="py-3 px-4">Dates</th>
                                <th className="py-3 px-4">Financier</th>
                                <th className="py-3 px-4">Statut</th>
                                <th className="py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-slate-400 font-semibold">
                                        Aucun dossier trouvé pour ces critères de recherche.
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((b: any) => (
                                    <tr key={b.ref} className="hover:bg-slate-50/80 transition">
                                        <td className="py-3.5 px-4">
                                            <a
                                                href={`/booking/${b.ref}?t=${b.accessToken}`}
                                                target="_blank"
                                                className="font-mono font-bold text-[#C9572C] hover:underline flex items-center gap-1"
                                            >
                                                <span>{b.ref}</span>
                                                <ExternalLink size={11} />
                                            </a>
                                            <span className="text-[10px] text-slate-400 block mt-0.5">
                                                {new Date(b.createdAt).toLocaleDateString("fr-FR")}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="font-bold text-slate-900 block">{b.clientName}</span>
                                            <span className="text-[11px] text-slate-500 block">{b.clientPhone}</span>
                                            {b.flightNumber && (
                                                <span className="text-[10px] text-blue-600 font-mono font-bold">
                                                    Vol : {b.flightNumber}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="font-bold text-slate-800 block">{b.vehicleName}</span>
                                            <span className="text-[11px] text-slate-500 capitalize">{b.pickupHub}</span>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-[11px]">
                                            <div>{b.pickupDate}</div>
                                            <div className="text-slate-400">→ {b.returnDate} ({b.days}j)</div>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono">
                                            <div className="font-bold text-slate-900">{b.totalEur} €</div>
                                            <div className="text-[10px] text-emerald-600">
                                                Payé : {b.acompteEur} € (Solde : {b.balanceEur} €)
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                    b.status === "confirmed"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : b.status === "checked_in"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : b.status === "completed"
                                                        ? "bg-slate-100 text-slate-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <a
                                                href={`/booking/${b.ref}?t=${b.accessToken}`}
                                                target="_blank"
                                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] transition inline-flex items-center gap-1"
                                            >
                                                <span>Voir Bon</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Annuaire des Agences Loueurs */}
            <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-black text-slate-900 tracking-tight">
                            Agences Loueurs Partenaires ({agencies.length})
                        </h2>
                        <p className="text-xs text-slate-500">
                            Réseau de loueurs certifiés avec ICE, flotte déclarée et Stop-Sell live.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="py-3 px-4">Agence</th>
                                <th className="py-3 px-4">Hub Ville</th>
                                <th className="py-3 px-4">Gérant / Contact</th>
                                <th className="py-3 px-4">ICE / RC</th>
                                <th className="py-3 px-4">Flotte</th>
                                <th className="py-3 px-4">Statut</th>
                                <th className="py-3 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            {agencies.map((a: any) => (
                                <tr key={a.id} className="hover:bg-slate-50/80 transition">
                                    <td className="py-3.5 px-4">
                                        <span className="font-bold text-slate-900 block">{a.agencyName}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">{a.id}</span>
                                    </td>
                                    <td className="py-3.5 px-4 capitalize font-semibold text-slate-800">
                                        {a.cityHub}
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span className="font-semibold block">{a.managerName}</span>
                                        <span className="text-[11px] text-slate-500">{a.managerPhone}</span>
                                        <span className="text-[10px] text-slate-400 block">{a.managerEmail}</span>
                                    </td>
                                    <td className="py-3.5 px-4 font-mono text-[11px]">
                                        <div>ICE : {a.iceNumber}</div>
                                        <div className="text-slate-400">{a.rcNumber}</div>
                                    </td>
                                    <td className="py-3.5 px-4 font-bold text-slate-900">
                                        {a.fleetCount} voitures
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                a.status === "active"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {a.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <button
                                            type="button"
                                            onClick={() => toggleAgencyStatus(a.id, a.status)}
                                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-[11px] transition cursor-pointer"
                                        >
                                            {a.status === "active" ? "Suspendre" : "Activer"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
