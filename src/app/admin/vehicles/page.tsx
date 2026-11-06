"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { Trash2, Plus, Car, Users, Briefcase } from "lucide-react";

type Vehicle = Database['public']['Tables']['vehicles']['Row'];

export default function VehiclesManager() {
    const searchParams = useSearchParams();
    const tenantId = searchParams.get("tenantId") || "taxiaix"; // Fallback to avoid empty state dev

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form State
    const [newName, setNewName] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [newPass, setNewPass] = useState(4);
    const [newLuggage, setNewLuggage] = useState(2);
    const [newImage, setNewImage] = useState("https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80");

    useEffect(() => {
        fetchVehicles();
    }, [tenantId]);

    async function fetchVehicles() {
        setLoading(true);
        const { data } = await supabase
            .from("vehicles")
            .select("*")
            .eq("tenant_id", tenantId)
            .order("display_order", { ascending: true });

        if (data) setVehicles(data);
        setLoading(false);
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        const { error } = await supabase.from("vehicles").insert({
            tenant_id: tenantId,
            name: newName,
            description: newDesc,
            capacity_passengers: newPass,
            capacity_luggage: newLuggage,
            image_url: newImage,
            price_class: 'premium',
            display_order: vehicles.length + 1
        });

        if (!error) {
            setIsCreating(false);
            fetchVehicles(); // Refresh
            // Reset form
            setNewName("");
            setNewDesc("");
        } else {
            alert("Erreur lors de la création: " + error.message);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Supprimer ce véhicule ?")) return;
        const { error } = await supabase.from("vehicles").delete().eq("id", id);
        if (!error) fetchVehicles();
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Gestion de la Flotte</h1>
                    <p className="text-sm text-neutral-500">Gérez les véhicules affichés pour {tenantId}</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-neutral-800 transition"
                >
                    <Plus size={18} />
                    Ajouter un véhicule
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-neutral-400">Chargement de la flotte...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* List Existing Vehicles */}
                    {vehicles.map((car) => (
                        <div key={car.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden group">
                            <div className="h-48 overflow-hidden relative">
                                <img
                                    src={car.image_url || "/placeholder-car.jpg"}
                                    alt={car.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                <button
                                    onClick={() => handleDelete(car.id)}
                                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg hover:bg-red-600"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-neutral-900">{car.name}</h3>
                                    <span className="px-2 py-1 bg-gray-100 text-xs font-bold rounded uppercase text-gray-500">{car.price_class || 'Standard'}</span>
                                </div>
                                <p className="text-sm text-neutral-500 mb-6 line-clamp-2">{car.description || "Aucune description"}</p>

                                <div className="flex items-center gap-6 text-sm text-neutral-600 font-medium border-t border-gray-100 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-blue-500" />
                                        {car.capacity_passengers} Passagers
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={16} className="text-blue-500" />
                                        {car.capacity_luggage} Bagages
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Empty State */}
                    {vehicles.length === 0 && !isCreating && (
                        <div className="col-span-2 text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <Car size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">Aucun véhicule configuré pour ce domaine.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Create Modal (Simple Inline Overlay for speed) */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl relative">
                        <h2 className="text-xl font-bold mb-6">Nouveau Véhicule</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nom du modèle</label>
                                <input
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2.5"
                                    placeholder="Ex: Mercedes Classe E"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description (pSEO/Spintax supporté)</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2.5 h-24"
                                    placeholder="Description courte..."
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Passagers</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg p-2.5"
                                        value={newPass}
                                        onChange={e => setNewPass(Number(e.target.value))}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Bagages</label>
                                    <input
                                        type="number"
                                        className="w-full border border-gray-300 rounded-lg p-2.5"
                                        value={newLuggage}
                                        onChange={e => setNewLuggage(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Image URL</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm font-mono"
                                    value={newImage}
                                    onChange={e => setNewImage(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="flex-1 py-3 text-gray-900 font-bold hover:bg-gray-100 rounded-xl transition"
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition"
                                >
                                    Créer le véhicule
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
