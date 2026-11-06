'use client';

import { useState, useEffect } from "react";
import { getPatterns, createPattern, deletePattern } from "@/app/actions/seo";
import { Plus, Trash2, HelpCircle } from "lucide-react";

export function AdminSeoPatternsManager({ tenantId }: { tenantId: string }) {
    const [patterns, setPatterns] = useState<any[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug_pattern: "taxi-{{city}}",
        title_template: "Taxi {{city}} - Réservation Immédiate",
        meta_description_template: "Réservez votre taxi à {{city}} avec {{tenant_name}} au {{phone}}.",
        content_structure: JSON.stringify([{ type: "hero", content: "Bienvenue à {{city}}" }])
    });

    const loadPatterns = async () => {
        const data = await getPatterns(tenantId);
        if (data) setPatterns(data);
    };

    useEffect(() => {
        loadPatterns();
    }, [tenantId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createPattern({
                ...formData,
                tenant_id: tenantId,
                content_structure: JSON.parse(formData.content_structure)
            });
            setIsCreating(false);
            loadPatterns();
        } catch (error) {
            alert("Erreur lors de la création du pattern" + error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Supprimer ce pattern ?")) {
            await deletePattern(id);
            loadPatterns();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Modèles (Patterns)</h2>
                <button
                    onClick={() => setIsCreating(!isCreating)}
                    className="flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-lg hover:bg-neutral-800"
                >
                    <Plus size={18} />
                    Nouveau Modèle
                </button>
            </div>

            {isCreating && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nom du modèle (Interne)</label>
                            <input
                                type="text"
                                className="w-full border p-2 rounded"
                                placeholder="Ex: Taxi Gare Standard"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Pattern d'URL</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={formData.slug_pattern}
                                    onChange={e => setFormData({ ...formData, slug_pattern: e.target.value })}
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Variables: {`{{city}}`}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Modèle de Titre H1</label>
                                <input
                                    type="text"
                                    className="w-full border p-2 rounded"
                                    value={formData.title_template}
                                    onChange={e => setFormData({ ...formData, title_template: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Meta Description</label>
                            <textarea
                                className="w-full border p-2 rounded"
                                value={formData.meta_description_template}
                                onChange={e => setFormData({ ...formData, meta_description_template: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Structure JSON (Avancé)</label>
                            <textarea
                                className="w-full border p-2 rounded font-mono text-xs h-32"
                                value={formData.content_structure}
                                onChange={e => setFormData({ ...formData, content_structure: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Créer le modèle
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patterns.map(pattern => (
                    <div key={pattern.id} className="bg-white p-4 rounded-xl border hover:shadow-md transition">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold">{pattern.name}</h3>
                            <button onClick={() => handleDelete(pattern.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                                <Trash2 size={16} />
                            </button>
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                            <p className="font-mono bg-gray-50 p-1 rounded">/{pattern.slug_pattern}</p>
                            <p className="truncate">{pattern.title_template}</p>
                        </div>
                        <div className="mt-4 pt-2 border-t flex items-center justify-between text-xs text-gray-400">
                            <span>{pattern.content_structure?.length || 0} blocs</span>
                            <span>{pattern.tenant_id ? "Local" : "Global"}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
