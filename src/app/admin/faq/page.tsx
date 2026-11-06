"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { Trash2, Plus, Edit2, ChevronDown, ChevronUp } from "lucide-react";

type FAQ = Database['public']['Tables']['faqs']['Row'];

export default function FAQManager() {
    const searchParams = useSearchParams();
    const tenantId = searchParams.get("tenantId") || "taxiaix";

    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    // Form
    const [newQuestion, setNewQuestion] = useState("");
    const [newAnswer, setNewAnswer] = useState("");
    const [newCategory, setNewCategory] = useState("general");

    useEffect(() => {
        fetchFaqs();
    }, [tenantId]);

    async function fetchFaqs() {
        setLoading(true);
        const { data } = await supabase
            .from("faqs")
            .select("*")
            .eq("tenant_id", tenantId)
            .order("display_order", { ascending: true });

        if (data) setFaqs(data);
        setLoading(false);
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();

        const { error } = await supabase.from("faqs").insert({
            tenant_id: tenantId,
            question: newQuestion,
            answer: newAnswer,
            category: newCategory,
            display_order: faqs.length // Append at end
        });

        if (!error) {
            setIsCreating(false);
            fetchFaqs();
            setNewQuestion("");
            setNewAnswer("");
        } else {
            alert("Erreur: " + error.message);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("Supprimer cette FAQ ?")) return;
        const { error } = await supabase.from("faqs").delete().eq("id", id);
        if (!error) fetchFaqs();
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Gestion des FAQ</h1>
                    <p className="text-sm text-neutral-500">Questions fréquentes affichées sur la page d'accueil.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-500 transition"
                >
                    <Plus size={18} />
                    Ajouter une FAQ
                </button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-neutral-400">Chargement des FAQ...</div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden divide-y divide-gray-100">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="p-6 hover:bg-gray-50 transition">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-neutral-900 mb-2">{faq.question}</h3>
                                    <p className="text-sm text-neutral-600 line-clamp-2">{faq.answer}</p>
                                    <span className="inline-block mt-3 text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded">
                                        {faq.category}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(faq.id)}
                                    className="text-gray-400 hover:text-red-500 transition shrink-0"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {faqs.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            Aucune FAQ créée pour l'instant.
                        </div>
                    )}
                </div>
            )}

            {/* Create Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl">
                        <h2 className="text-xl font-bold mb-6">Nouvelle FAQ</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Question</label>
                                <input
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2.5"
                                    placeholder="Ex: Comment réserver un taxi ?"
                                    value={newQuestion}
                                    onChange={e => setNewQuestion(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Réponse</label>
                                <textarea
                                    required
                                    className="w-full border border-gray-300 rounded-lg p-2.5 h-32"
                                    placeholder="Expliquez clairement la réponse..."
                                    value={newAnswer}
                                    onChange={e => setNewAnswer(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Catégorie</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2.5"
                                    value={newCategory}
                                    onChange={e => setNewCategory(e.target.value)}
                                >
                                    <option value="general">Général</option>
                                    <option value="booking">Réservation</option>
                                    <option value="payment">Paiement</option>
                                    <option value="service">Services</option>
                                </select>
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
                                    Créer la FAQ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
