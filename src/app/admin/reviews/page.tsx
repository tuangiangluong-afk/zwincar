"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Star, Plus, Trash2, Edit2, Save, X, CheckCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Review {
    id: string;
    tenant_id: string;
    author_name: string;
    rating: number;
    content: string;
    source: string;
    is_active: boolean;
    created_at: string;
}

export default function AdminReviewsPage() {
    const searchParams = useSearchParams();
    const currentTenantId = searchParams.get("tenantId");

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        tenant_id: "",
        author_name: "",
        rating: 5,
        content: "",
        source: "Google",
    });

    const fetchReviews = useCallback(async () => {
        setLoading(true);

        let query = (supabase as any)
            .from("reviews")
            .select("*")
            .order("created_at", { ascending: false });

        if (currentTenantId && currentTenantId !== 'all') {
            query = query.eq("tenant_id", currentTenantId);
        }

        const { data } = await query;
        setReviews(data || []);
        setLoading(false);
    }, [currentTenantId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (editingId) {
            // Update
            await (supabase as any)
                .from("reviews")
                .update({
                    tenant_id: formData.tenant_id,
                    author_name: formData.author_name,
                    rating: formData.rating,
                    content: formData.content,
                    source: formData.source,
                })
                .eq("id", editingId);
        } else {
            // Insert
            await (supabase as any)
                .from("reviews")
                .insert({
                    tenant_id: formData.tenant_id,
                    author_name: formData.author_name,
                    rating: formData.rating,
                    content: formData.content,
                    source: formData.source,
                    is_active: true,
                });
        }

        resetForm();
        fetchReviews();
    };

    const handleEdit = (review: Review) => {
        setFormData({
            tenant_id: review.tenant_id,
            author_name: review.author_name,
            rating: review.rating,
            content: review.content,
            source: review.source,
        });
        setEditingId(review.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Supprimer cet avis ?")) {
            await (supabase as any).from("reviews").delete().eq("id", id);
            fetchReviews();
        }
    };

    const handleToggleActive = async (id: string, currentState: boolean) => {
        await (supabase as any)
            .from("reviews")
            .update({ is_active: !currentState })
            .eq("id", id);
        fetchReviews();
    };

    const resetForm = () => {
        setFormData({
            tenant_id: currentTenantId || "",
            author_name: "",
            rating: 5,
            content: "",
            source: "Google",
        });
        setEditingId(null);
        setShowForm(false);
    };

    // Update form tenant when switching workspace
    useEffect(() => {
        if (currentTenantId && currentTenantId !== 'all') {
            setFormData(prev => ({ ...prev, tenant_id: currentTenantId }));
        }
    }, [currentTenantId]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des Avis</h1>
                        <p className="text-gray-500">Gérez les avis clients affichés sur chaque site</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus size={20} />
                        Ajouter un avis
                    </button>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold">
                                    {editingId ? "Modifier l'avis" : "Nouvel avis"}
                                </h2>
                                <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tenant ID (slug du site)
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="ex: taxineuilly, _default..."
                                        value={formData.tenant_id}
                                        onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Utilisez &quot;_default&quot; pour les avis affichés sur tous les sites sans avis spécifiques.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Nom de l&apos;auteur
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="ex: Sophie M."
                                        value={formData.author_name}
                                        onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Note (1-5)
                                    </label>
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((n) => (
                                            <button
                                                key={n}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rating: n })}
                                                className={`p-2 rounded-lg transition ${formData.rating >= n
                                                    ? "bg-yellow-400 text-white"
                                                    : "bg-gray-100 text-gray-400"
                                                    }`}
                                            >
                                                <Star size={20} fill="currentColor" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Contenu de l&apos;avis
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        placeholder="Le texte de l'avis..."
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">
                                        Utilisez {"{city}"} pour insérer le nom de la ville dynamiquement.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Source
                                    </label>
                                    <select
                                        value={formData.source}
                                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2"
                                    >
                                        <option value="Google">Google</option>
                                        <option value="TripAdvisor">TripAdvisor</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="Réseau">Réseau</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        <Save size={18} />
                                        {editingId ? "Mettre à jour" : "Créer"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Reviews Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Chargement...</div>
                    ) : reviews.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p>Aucun avis. Lancez le script SQL puis ajoutez des avis.</p>
                        </div>
                    ) : (
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Tenant</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Auteur</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Note</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Contenu</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actif</th>
                                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {reviews.map((review) => (
                                    <tr key={review.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                                                {review.tenant_id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {review.author_name}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex text-yellow-400">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} size={14} fill="currentColor" />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                            {review.content}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleActive(review.id, review.is_active)}
                                                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${review.is_active
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-500"
                                                    }`}
                                            >
                                                {review.is_active ? (
                                                    <>
                                                        <CheckCircle size={12} /> Actif
                                                    </>
                                                ) : (
                                                    "Inactif"
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(review)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
