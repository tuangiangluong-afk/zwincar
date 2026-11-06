"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { Save, Loader2, LayoutTemplate } from "lucide-react";

type ContentPage = Database['public']['Tables']['content_pages']['Row'];

// Define editable fields for the "Home" page
const HOME_FIELDS = [
    { key: "hero_title", label: "Titre Hero (H1)", type: "text", placeholder: "Réservez votre Taxi à..." },
    { key: "hero_subtitle", label: "Sous-titre Hero", type: "textarea", placeholder: "Service disponible 24/7..." },
    { key: "hero_badge", label: "Badge (Pill)", type: "text", placeholder: "Nouveau : Appli mobile" },
    { key: "cta_button", label: "Texte du Bouton d'appel", type: "text", placeholder: "Commander un Taxi" },
    { key: "hero_image", label: "Image de fond (URL)", type: "text", placeholder: "https://..." },
    { key: "about_title", label: "Titre 'À Propos'", type: "text", placeholder: "Pourquoi nous choisir ?" },
    // Later: Add Image Upload
];

export default function PageBuilder() {
    const searchParams = useSearchParams();
    const tenantId = searchParams.get("tenantId") || "taxiaix";
    const pagePath = "/"; // For now, we focus on Home Page

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [contentMap, setContentMap] = useState<Record<string, string>>({});

    useEffect(() => {
        fetchContent();
    }, [tenantId]);

    async function fetchContent() {
        setLoading(true);
        // Fetch overrides for this page
        const { data } = await supabase
            .from("content_pages")
            .select("*")
            .eq("tenant_id", tenantId)
            .eq("path", pagePath)
            .eq("section", "home_hero"); // We'll group everything under 'home_hero' section for simplicity first

        const map: Record<string, string> = {};
        if (data) {
            data.forEach(item => {
                map[item.key] = item.value || "";
            });
        }
        setContentMap(map);
        setLoading(false);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const updates = HOME_FIELDS.map(field => ({
            tenant_id: tenantId,
            path: pagePath,
            section: "home_hero",
            key: field.key,
            value: contentMap[field.key] || null,
            type: "text"
        }));

        const { error } = await supabase
            .from("content_pages")
            .upsert(updates, { onConflict: 'tenant_id, path, section, key' });

        if (error) {
            alert("Erreur sauvegarde: " + error.message);
        } else {
            // success feedback
        }
        setSaving(false);
    }

    const handleChange = (key: string, val: string) => {
        setContentMap(prev => ({ ...prev, [key]: val }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Éditeur de Pages</h1>
                    <p className="text-sm text-neutral-500">Personnalisez le contenu de la page d'accueil pour {tenantId}</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-neutral-800 transition disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Enregistrer
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                <div className="border-b border-gray-100 p-4 bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <LayoutTemplate size={16} />
                    Page d'Accueil (Hero Section)
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-400">Chargement du contenu...</div>
                ) : (
                    <form onSubmit={handleSave} className="p-8 space-y-6">
                        {HOME_FIELDS.map((field) => (
                            <div key={field.key} className="space-y-2">
                                <label className="block text-sm font-semibold text-neutral-900">
                                    {field.label}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition min-h-[100px]"
                                        placeholder={field.placeholder}
                                        value={contentMap[field.key] || ""}
                                        onChange={e => handleChange(field.key, e.target.value)}
                                    />
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        placeholder={field.placeholder}
                                        value={contentMap[field.key] || ""}
                                        onChange={e => handleChange(field.key, e.target.value)}
                                    />
                                )}
                                <p className="text-xs text-gray-400">
                                    Laissez vide pour utiliser le texte automatique (Spintax).
                                </p>
                            </div>
                        ))}
                    </form>
                )}
            </div>
        </div>
    );
}
