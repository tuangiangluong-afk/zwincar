"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Database } from "@/types/database.types";
import { Save, Loader2, Settings, BarChart3 } from "lucide-react";

type Tenant = Database['public']['Tables']['tenants']['Row'];

export default function SettingsPage() {
    const searchParams = useSearchParams();
    const tenantId = searchParams.get("tenantId") || "taxiaix";

    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [primaryColor, setPrimaryColor] = useState("#facc15"); // Yellow default
    const [gtmId, setGtmId] = useState("");
    const [gaId, setGaId] = useState("");

    useEffect(() => {
        fetchTenant();
    }, [tenantId]);

    async function fetchTenant() {
        setLoading(true);
        const { data, error } = await supabase
            .from("tenants")
            .select("*")
            .eq("id", tenantId)
            .maybeSingle();

        if (data) {
            const t = data as any;
            setTenant(data);
            setName(t.name || "");
            setPhone(t.phone_number || "");
            setEmail(t.email || "");
            setPrimaryColor(t.primary_color || "#facc15");
            setGtmId(t.gtm_id || "");
            setGaId(t.ga_id || "");
        }
        setLoading(false);
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        const { error } = await supabase
            .from("tenants")
            .update({
                name,
                phone_number: phone,
                email,
                primary_color: primaryColor,
                gtm_id: gtmId || null,
                ga_id: gaId || null
            })
            .eq("id", tenantId);

        if (error) {
            alert("Erreur: " + error.message);
        }
        setSaving(false);
    }

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-900">Paramètres du Site</h1>
                    <p className="text-sm text-neutral-500">Configuration générale pour {tenantId}</p>
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

            {loading ? (
                <div className="text-center py-12 text-neutral-400">Chargement des paramètres...</div>
            ) : (
                <form onSubmit={handleSave} className="space-y-8">
                    {/* General Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                        <div className="border-b border-gray-100 p-4 bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700">
                            <Settings size={16} />
                            Informations Générales
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Nom du Site</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg p-3"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Téléphone</label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        value={phone}
                                        onChange={e => setPhone(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        className="w-full border border-gray-300 rounded-lg p-3"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Couleur Principale (Accent)</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        className="w-12 h-12 rounded-lg border cursor-pointer"
                                        value={primaryColor}
                                        onChange={e => setPrimaryColor(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="flex-1 border border-gray-300 rounded-lg p-3 font-mono text-sm"
                                        value={primaryColor}
                                        onChange={e => setPrimaryColor(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Analytics */}
                    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
                        <div className="border-b border-gray-100 p-4 bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700">
                            <BarChart3 size={16} />
                            Analytics & Tracking
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Google Analytics ID (G-XXXX)</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg p-3 font-mono"
                                    placeholder="G-XXXXXXXXXX"
                                    value={gaId}
                                    onChange={e => setGaId(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Google Tag Manager ID</label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg p-3 font-mono"
                                    placeholder="GTM-XXXXXXX"
                                    value={gtmId}
                                    onChange={e => setGtmId(e.target.value)}
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Ce code sera injecté dans le {`<head>`} de toutes les pages de ce tenant.
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
}
