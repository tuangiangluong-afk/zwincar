"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";
import { Database } from "@/types/database.types";
import { Trash2, Plus, MapPin, Building, Music } from "lucide-react";

type POI = Database['public']['Tables']['pois']['Row'];

export default function GuidesManager() {
    const searchParams = useSearchParams();
    const tenantId = searchParams.get("tenantId") || "taxiaix";

    const [pois, setPois] = useState<POI[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form
    const [newName, setNewName] = useState("");
    const [newType, setNewType] = useState("hotel");
    const [newParking, setNewParking] = useState("Difficile");
    const [newDesc, setNewDesc] = useState("");

    useEffect(() => {
        fetchPois();
    }, [tenantId]);

    async function fetchPois() {
        setLoading(true);
        const { data } = await supabase
            .from("pois")
            .select("*")
            .eq("tenant_id", tenantId)
            .order("created_at", { ascending: false }); // Latest first

        if (data) setPois(data);
        setLoading(false);
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        const slug = slugify(newName);

        const { error } = await supabase.from("pois").insert({
            tenant_id: tenantId,
            name: newName,
            slug: slug,
            type: newType,
            parking_difficulty: newParking,
            content_intro: newDesc || null
        });

        if (!error) {
            setIsCreating(false);
            fetchPois();
            setNewName("");
        } else {
            alert("Erreur: " + error.message);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Supprimer ce guide ?")) return;
        const { error } = await supabase.from("pois").delete().eq("id", id);
        if (!error) fetchPois();
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Guides Locaux (pSEO)</h1>
                    <p className="text-sm text-neutral-500">Ajoutez un lieu pour générer automatiquement sa page dédiée.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition"
                >
                    <Plus size={18} />
                    Ajouter un lieu
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-neutral-400">Chargement des guides...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Nom</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Slug (URL)</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Difficulté Parking</th>
                                <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pois.map((poi) => (
                                <tr key={poi.id} className="hover:bg-gray-50 transition">
                                    <td className="p-4 font-medium text-neutral-900 flex items-center gap-3">
                                        {poi.type === 'hotel' && <Building size={16} className="text-blue-500" />}
                                        {poi.type === 'nightlife' && <Music size={16} className="text-purple-500" />}
                                        {poi.type === 'monument' && <MapPin size={16} className="text-yellow-500" />}
                                        {poi.name}
                                    </td>
                                    <td className="p-4 text-sm text-gray-500 font-mono">/guides/{poi.slug}</td>
                                    <td className="p-4 text-sm text-gray-500 capitalize">{poi.type}</td>
                                    <td className="p-4 text-sm text-gray-500">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${poi.parking_difficulty?.includes('Difficile') || poi.parking_difficulty?.includes('Impossible')
                                            ? 'bg-red-100 text-red-600'
                                            : 'bg-green-100 text-green-600'
                                            }`}>
                                            {poi.parking_difficulty}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => handleDelete(poi.id)}
                                            className="text-gray-400 hover:text-red-500 transition"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {pois.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            Aucun guide créé pour l'instant.
                        </div>
                    )}
                </div>
            )}

            {/* Create Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-xl font-bold mb-6">Nouveau Guide pSEO</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nom du Lieu</label>
                                <input
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2.5"
                                    placeholder="Ex: Club Le Mistral"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2.5"
                                    value={newType}
                                    onChange={e => setNewType(e.target.value)}
                                >
                                    <option value="hotel">Hôtel</option>
                                    <option value="nightlife">Boîte de nuit / Bar</option>
                                    <option value="monument">Monument / Lieu</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Difficulté Stationnement (Argument de vente)</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2.5"
                                    value={newParking}
                                    onChange={e => setNewParking(e.target.value)}
                                >
                                    <option value="Difficile (Centre-ville)">Difficile (Centre-ville)</option>
                                    <option value="Impossible (Piéton)">Impossible (Zone Piétonne)</option>
                                    <option value="Payant et Cher">Payant et Cher</option>
                                    <option value="Facile">Facile</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description / Intro (Optionnel)</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2.5 h-20"
                                    placeholder="Une petite description du lieu pour l'intro..."
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Description / Intro (Optionnel)</label>
                                <textarea
                                    className="w-full border border-gray-300 rounded-lg p-2.5 h-20"
                                    placeholder="Une petite description du lieu pour l'intro..."
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
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
                                    className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition"
                                >
                                    Générer la Page
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
