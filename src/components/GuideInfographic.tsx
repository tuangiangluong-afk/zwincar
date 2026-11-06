import React from "react";
import { CheckCircle2, AlertTriangle, ShieldCheck, Gauge, Zap, FileCheck } from "lucide-react";

interface GuideInfographicProps {
    type: "tpe-receipt" | "ground-clearance" | "radar-fines" | "jawaz-toll";
    locale?: "fr" | "en";
}

export default function GuideInfographic({ type, locale = "fr" }: GuideInfographicProps) {
    const isEn = locale === "en";

    if (type === "tpe-receipt") {
        return (
            <div className="my-8 rounded-2xl bg-white border border-[#E7DFD5] p-5 sm:p-7 shadow-xs space-y-5">
                {/* Header */}
                <div className="border-b border-[#ECE5D9] pb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#C9572C]">
                        {isEn ? "Terminal Audit Standard" : "Contrôle du Terminal CMI"}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                        {isEn
                            ? "Deposit Check: Pre-Authorisation Hold vs Direct Debit Sale"
                            : "Contrôle de la Caution : Pré-autorisation vs Vente Débit Direct"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                        {isEn
                            ? "How to distinguish a legal bank guarantee hold from an abusive direct debit in 5 seconds."
                            : "Comment distinguer un blocage temporaire légal d'un prélèvement abusif avant de composer votre code PIN."}
                    </p>
                </div>

                {/* 2 Comparative Columns */}
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Colonne 1: Conforme */}
                    <div className="rounded-xl bg-[#FAF7F2] border border-emerald-200/80 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2 pb-2 border-b border-emerald-100">
                                <span className="text-xs font-bold text-slate-800">
                                    {isEn ? "Compliant Procedure" : "Procédure Conforme (Légale)"}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                                    <CheckCircle2 size={12} className="text-emerald-700 shrink-0" />
                                    <span>{isEn ? "0 € Debited" : "0 € Débité"}</span>
                                </span>
                            </div>

                            <div className="space-y-2 text-xs">
                                <div className="flex items-baseline justify-between gap-2 py-1 border-b border-[#ECE5D9]/60">
                                    <span className="text-slate-500">{isEn ? "Terminal display:" : "Mention sur l'écran :"}</span>
                                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                                        PRE-AUTORISATION
                                    </span>
                                </div>
                                <div className="flex items-baseline justify-between gap-2 py-1 border-b border-[#ECE5D9]/60">
                                    <span className="text-slate-500">{isEn ? "Bank account effect:" : "Impact bancaire :"}</span>
                                    <span className="font-medium text-slate-900 text-right">
                                        {isEn ? "Plafond hold only (0 € taken)" : "Plafond gelé (aucun prélèvement)"}
                                    </span>
                                </div>
                                <div className="flex items-baseline justify-between gap-2 py-1 border-b border-[#ECE5D9]/60">
                                    <span className="text-slate-500">{isEn ? "Conversion / FX fees:" : "Frais de change :"}</span>
                                    <span className="font-medium text-emerald-700">0 €</span>
                                </div>
                                <div className="flex items-baseline justify-between gap-2 py-1">
                                    <span className="text-slate-500">{isEn ? "Release on return:" : "Restitution au retour :"}</span>
                                    <span className="font-medium text-slate-900 text-right">
                                        {isEn ? "Instant void slip handed over" : "Quittance de mainlevée immédiate"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-[11px] text-emerald-800 bg-emerald-50/80 rounded-lg p-2.5 border border-emerald-200/50 flex items-center gap-1.5 font-medium">
                            <CheckCircle2 size={13} className="shrink-0 text-emerald-600" />
                            <span>{isEn ? "Fully compliant with CMI & Visa/Mastercard rules" : "Conforme aux normes CMI et réseaux bancaires"}</span>
                        </div>
                    </div>

                    {/* Colonne 2: Abusif */}
                    <div className="rounded-xl bg-[#FAF7F2] border border-rose-200/80 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2 pb-2 border-b border-rose-100">
                                <span className="text-xs font-bold text-slate-800">
                                    {isEn ? "Abusive Practice (Red Flag)" : "Pratique Déloyale (Piège)"}
                                </span>
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-semibold">
                                    <AlertTriangle size={12} className="text-rose-700 shrink-0" />
                                    <span>{isEn ? "Real Debit" : "Débit Réel"}</span>
                                </span>
                            </div>

                            <div className="space-y-2 text-xs">
                                <div className="flex items-baseline justify-between gap-2 py-1 border-b border-[#ECE5D9]/60">
                                    <span className="text-slate-500">{isEn ? "Terminal display:" : "Mention sur l'écran :"}</span>
                                    <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
                                        VENTE / ACHAT / DEBIT
                                    </span>
                                </div>
                                <div className="flex items-baseline justify-between gap-2 py-1 border-b border-[#ECE5D9]/60">
                                    <span className="text-slate-500">{isEn ? "Bank account effect:" : "Impact bancaire :"}</span>
                                    <span className="font-medium text-rose-700 text-right">
                                        {isEn ? "Money immediately withdrawn" : "Débit réel immédiat du solde"}
                                    </span>
                                </div>
                                <div className="flex items-baseline justify-between gap-2 py-1 border-b border-[#ECE5D9]/60">
                                    <span className="text-slate-500">{isEn ? "Conversion / FX fees:" : "Frais de change :"}</span>
                                    <span className="font-medium text-rose-700 text-right">
                                        {isEn ? "~30 € to 70 € lost permanently" : "~35 € à 70 € perdus d'office"}
                                    </span>
                                </div>
                                <div className="flex items-baseline justify-between gap-2 py-1">
                                    <span className="text-slate-500">{isEn ? "Release on return:" : "Restitution au retour :"}</span>
                                    <span className="font-medium text-slate-900 text-right">
                                        {isEn ? "Random delay (15 to 45 days)" : "Délai aléatoire (15 à 45 jours)"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-[11px] text-rose-800 bg-rose-50/80 rounded-lg p-2.5 border border-rose-200/50 flex items-center gap-1.5 font-medium">
                            <AlertTriangle size={13} className="shrink-0 text-rose-600" />
                            <span>{isEn ? "Refuse and demand immediate transaction void" : "Refusez et exigez une pré-autorisation stricte"}</span>
                        </div>
                    </div>
                </div>

                {/* Advice Footer */}
                <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE5D9] flex items-start gap-3 text-xs text-slate-700">
                    <ShieldCheck size={16} className="text-[#C9572C] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        <strong className="text-slate-900 font-semibold">{isEn ? "Golden rule:" : "Règle d'or :"}</strong>{" "}
                        {isEn
                            ? "Always read the TPE terminal screen before entering your PIN. If the word 'SALE', 'ACHAT' or 'DEBIT' appears instead of 'PRE-AUTHORISATION', demand immediate cancellation before taking the keys."
                            : "Exigez toujours de lire l'écran du boîtier CMI avant de composer votre code PIN. Si le mot « VENTE », « ACHAT » ou « DEBIT » apparaît à la place de « PRE-AUTORISATION », refusez la transaction avant même de prendre les clés."}
                    </p>
                </div>
            </div>
        );
    }

    if (type === "ground-clearance") {
        return (
            <div className="my-8 rounded-2xl bg-white border border-[#E7DFD5] p-5 sm:p-7 shadow-xs space-y-5">
                <div className="border-b border-[#ECE5D9] pb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#C9572C]/10 text-[#C9572C] flex items-center justify-center shrink-0">
                        <Gauge size={18} />
                    </span>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#C9572C]">
                            {isEn ? "Terrain Benchmark" : "Benchmark Terrain Maroc"}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                            {isEn
                                ? "Ground Clearance: City Cars (130mm) vs Crossover (175mm) vs Duster (210mm)"
                                : "Garde au Sol : Citadine 130mm vs Crossover 175mm vs Duster 210mm"}
                        </h3>
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                    {/* 130 mm */}
                    <div className="rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] p-4 text-xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-base text-slate-900">130 mm</span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium text-[10px]">
                                    Citadine
                                </span>
                            </div>
                            <div className="font-semibold text-slate-800">Renault Clio / Hyundai i10</div>
                            <p className="text-slate-600 leading-relaxed text-[11px]">
                                {isEn
                                    ? "Paved roads only. Risk of scratching front bumper lip or oil pan on rural speed bumps."
                                    : "Réservé 100% au goudron. Risque de frottement du carter sur dos-d'âne hauts en zone rurale."}
                            </p>
                        </div>
                        <div className="text-[11px] font-medium text-slate-600 bg-white p-2 rounded-lg border border-[#E7DFD5] text-center">
                            {isEn ? "Cities & Highways Only" : "Villes & autoroutes uniquement"}
                        </div>
                    </div>

                    {/* 175 mm */}
                    <div className="rounded-xl bg-amber-50/40 border border-amber-200 p-4 text-xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-base text-amber-950">175 mm</span>
                                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-medium text-[10px]">
                                    Crossover
                                </span>
                            </div>
                            <div className="font-semibold text-slate-900">Dacia Sandero Stepway</div>
                            <p className="text-slate-600 leading-relaxed text-[11px]">
                                {isEn
                                    ? "The smart choice for 85% of roadtrips. Easily clears tall speed bumps and packed dirt tracks to ecolodges."
                                    : "Le compromis idéal pour 85% des roadtrips. Passe sans frotter sur les ralentisseurs et pistes d'écolodges."}
                            </p>
                        </div>
                        <div className="text-[11px] font-semibold text-amber-900 bg-amber-100/70 p-2 rounded-lg border border-amber-300/60 text-center">
                            {isEn ? "Haut-Atlas & Dirt Tracks OK" : "Haut-Atlas & pistes damées OK"}
                        </div>
                    </div>

                    {/* 210 mm */}
                    <div className="rounded-xl bg-emerald-50/40 border border-emerald-200 p-4 text-xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-bold text-base text-emerald-950">210 mm</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-medium text-[10px]">
                                    SUV / 4WD
                                </span>
                            </div>
                            <div className="font-semibold text-slate-900">Dacia Duster / Toyota Prado</div>
                            <p className="text-slate-600 leading-relaxed text-[11px]">
                                {isEn
                                    ? "30° approach angle. Effortlessly glides over rocky desert plateaus (Agafay hamada) and dry riverbeds."
                                    : "Angle d'attaque de 30°. Passe sur les pierriers d'Agafay (hamada), lits d'oueds et pistes rocailleuses du Sud."}
                            </p>
                        </div>
                        <div className="text-[11px] font-semibold text-emerald-900 bg-emerald-100/70 p-2 rounded-lg border border-emerald-300/60 text-center">
                            {isEn ? "Desert & South Validated" : "Agafay & pistes du Sud validés"}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === "radar-fines") {
        return (
            <div className="my-8 rounded-2xl bg-white border border-[#E7DFD5] p-5 sm:p-7 shadow-xs space-y-5">
                <div className="border-b border-[#ECE5D9] pb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <AlertTriangle size={18} />
                    </span>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                            {isEn ? "Moroccan Traffic Law 116-14" : "Code de la Route Marocain (Loi 116-14)"}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                            {isEn
                                ? "Official Speed Camera Fines: Immediate Settlement Discount (-50%)"
                                : "Barème Légal des Amendes : Règlement Immédiat ATF (-50%)"}
                        </h3>
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="rounded-xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Excès &lt; 20 km/h</div>
                        <div className="text-xl font-bold text-slate-900">150 MAD <span className="text-xs font-normal text-slate-500">(~14 €)</span></div>
                        <p className="text-[11px] text-slate-600">
                            {isEn ? "With immediate payment (base fine: 300 MAD)." : "Paiement immédiat sur quittance (au lieu de 300 MAD)."}
                        </p>
                    </div>

                    <div className="rounded-xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Excès 20 à 30 km/h</div>
                        <div className="text-xl font-bold text-amber-900">300 MAD <span className="text-xs font-normal text-slate-500">(~28 €)</span></div>
                        <p className="text-[11px] text-slate-600">
                            {isEn ? "With immediate payment (base fine: 500 MAD)." : "Paiement immédiat sur quittance (au lieu de 500 MAD)."}
                        </p>
                    </div>

                    <div className="rounded-xl bg-rose-50/40 border border-rose-200 p-4 space-y-1">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Excès 30 à 50 km/h</div>
                        <div className="text-xl font-bold text-rose-900">400 MAD <span className="text-xs font-normal text-slate-500">(~37 €)</span></div>
                        <p className="text-[11px] text-slate-600">
                            {isEn ? "With immediate payment (base fine: 700 MAD)." : "Paiement immédiat sur quittance (au lieu de 700 MAD)."}
                        </p>
                    </div>
                </div>

                <div className="p-3.5 sm:p-4 rounded-xl bg-[#FAF7F2] border border-[#ECE5D9] flex items-start gap-3 text-xs text-slate-700">
                    <FileCheck size={16} className="text-amber-700 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        <strong className="text-slate-900 font-semibold">{isEn ? "Legal requirement:" : "Droit légal :"}</strong>{" "}
                        {isEn
                            ? "Under Moroccan law, the officer must issue an official numbered paper receipt from the government stub book for any cash settlement. A technical tolerance of 7 km/h applies to speed radar measurements."
                            : "Pour tout règlement d'amende transactionnelle et forfaitaire (ATF) en espèces, l'agent verbalisateur a l'obligation légale de vous remettre un feuillet de quittance timbré et numéroté issu du carnet à souche officiel. Une tolérance technique de 7 km/h s'applique aux radars."}
                    </p>
                </div>
            </div>
        );
    }

    if (type === "jawaz-toll") {
        return (
            <div className="my-8 rounded-2xl bg-white border border-[#E7DFD5] p-5 sm:p-7 shadow-xs space-y-5">
                <div className="border-b border-[#ECE5D9] pb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <Zap size={18} />
                    </span>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#C9572C]">
                            {isEn ? "Morocco Highway Tolls (ADM)" : "Autoroutes du Maroc (ADM)"}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                            {isEn
                                ? "Toll Lanes: Orange Jawaz Electronic Pass vs Blue Cash Lanes"
                                : "Voies de Péage : Voie Orange Pass Jawaz vs Voies Bleues Espèces"}
                        </h3>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-xl bg-amber-50/50 border border-amber-200 p-4 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-amber-950">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0"></span>
                            <span>Voie Orange : Télépéage Pass Jawaz (30 km/h)</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                            {isEn
                                ? "Drive through without stopping at 20-30 km/h. Overhead RFID antenna detects the tag on your windshield and raises the barrier instantly. Zero waiting time."
                                : "Passage fluide à 20-30 km/h sans arrêt. L'antenne RFID en hauteur détecte le boîtier fixé au pare-brise et lève la barrière immédiatement. Zéro file d'attente."}
                        </p>
                    </div>

                    <div className="rounded-xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0"></span>
                            <span>Voies Bleues : Paiement Espèces au Guichetier</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                            {isEn
                                ? "Complete stop at the toll booth. Cash payment in Moroccan Dirhams only (no bank cards accepted at ADM toll booths). Expect lines at peak hours."
                                : "Arrêt complet au guichet. Règlement en espèces (Dirhams uniquement, pas de carte bancaire acceptée aux barrières ADM). Attente fréquente aux heures de pointe."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
