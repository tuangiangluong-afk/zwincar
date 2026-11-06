'use client';

import { useState } from "react";
import { AdminSeoPatternsManager } from "./AdminSeoPatternsManager";
import { AdminSeoPagesManager } from "./AdminSeoPagesManager";

export default function AdminSeoWrapper({ tenantId }: { tenantId: string }) {
    const [activeTab, setActiveTab] = useState<'pages' | 'patterns'>('pages');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">SEO Programmatique (pSEO)</h1>
                <p className="text-gray-500">Gérez vos modèles et générez des centaines de pages d'atterrissage.</p>
            </div>

            <div className="border-b">
                <div className="flex gap-6">
                    <button
                        onClick={() => setActiveTab('pages')}
                        className={`pb-3 text-sm font-medium border-b-2 transition ${activeTab === 'pages' ? 'border-yellow-400 text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Générateur de Pages
                    </button>
                    <button
                        onClick={() => setActiveTab('patterns')}
                        className={`pb-3 text-sm font-medium border-b-2 transition ${activeTab === 'patterns' ? 'border-yellow-400 text-black' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Modèles & Patterns
                    </button>
                </div>
            </div>

            {activeTab === 'pages' ? (
                <AdminSeoPagesManager tenantId={tenantId} />
            ) : (
                <AdminSeoPatternsManager tenantId={tenantId} />
            )}
        </div>
    );
}
