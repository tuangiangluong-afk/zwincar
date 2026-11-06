import React from "react";
import {
    CheckCircle2,
    AlertTriangle,
    CreditCard,
    ShieldCheck,
    Gauge,
    Zap,
    FileCheck,
} from "lucide-react";

interface GuideInfographicProps {
    type: "tpe-receipt" | "ground-clearance" | "radar-fines" | "jawaz-toll";
    locale?: "fr" | "en";
}

export default function GuideInfographic({ type, locale = "fr" }: GuideInfographicProps) {
    const isEn = locale === "en";

    if (type === "tpe-receipt") {
        return (
            <div className="my-8 rounded-3xl bg-white border border-[#E7DFD5] p-6 sm:p-8 shadow-xs space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#ECE5D9]">
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#C9572C]">
                            {isEn ? "Terminal Audit Standard" : "Norme de Contrôle TPE CMI"}
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            {isEn
                                ? "Payment Terminal Receipt: Pre-Auth Hold vs Direct Sale"
                                : "Contrôle du Ticket TPE : Pré-autorisation vs Vente Débit Direct"}
                        </h3>
                    </div>
                    <span className="self-start sm:self-auto text-[11px] font-mono font-medium px-2.5 py-1 rounded-full bg-[#FAF7F2] text-slate-600 border border-[#E7DFD5]">
                        Norme ISO 8583
                    </span>
                </div>

                {/* 2 Comparative Columns */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Colonne 1: Conforme */}
                    <div className="rounded-2xl bg-[#FAF7F2] border border-emerald-200 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                                {isEn ? "Compliant Flow" : "Procédure Légale"}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                                <CheckCircle2 size={12} />
                                {isEn ? "Legitimate Hold" : "0 € Débité"}
                            </span>
                        </div>

                        {/* Ticket Paper Simulation */}
                        <div className="rounded-xl bg-white border border-[#ECE5D9] p-4 font-mono text-xs space-y-2 text-slate-700 shadow-2xs">
                            <div className="text-[10px] text-slate-400 border-b border-dashed border-slate-200 pb-2">
                                <div>CENTRE MONETIQUE INTERBANCAIRE</div>
                                <div>AGENCE PARTENAIRE ZWINCAR</div>
                            </div>
                            <div className="flex justify-between font-bold text-emerald-700 pt-1">
                                <span>TYPE TX:</span>
                                <span>PRE-AUTORISATION</span>
                            </div>
                            <div className="flex justify-between text-slate-500 text-[11px]">
                                <span>CODE REF:</span>
                                <span>#884102 • ISO 8583</span>
                            </div>
                            <div className="flex justify-between text-slate-600">
                                <span>MONTANT RETENU:</span>
                                <span>15 000 MAD</span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-900 border-t border-dashed border-slate-200 pt-2">
                                <span>MONTANT DÉBITÉ:</span>
                                <span className="text-emerald-700">0.00 MAD</span>
                            </div>
                        </div>

                        {/* Bullet Points */}
                        <ul className="text-xs space-y-1.5 text-slate-600 pt-1">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>{isEn ? "Plafond gelé temporairement sans prélèvement" : "Caution gelée temporairement sans débit bancaire"}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>{isEn ? "0% exchange or merchant fees incurred" : "0 € de frais bancaires ou commission de change"}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>{isEn ? "Instant release proof ticket at vehicle check-out" : "Quittance de mainlevée remise au retour"}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Colonne 2: Abusif */}
                    <div className="rounded-2xl bg-rose-50/40 border border-rose-200 p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="font-bold text-xs uppercase tracking-wider text-slate-500">
                                {isEn ? "Predatory Practice" : "Pratique Abusive"}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                                <AlertTriangle size={12} />
                                {isEn ? "Direct Debit Trap" : "Débit Réel sur Compte"}
                            </span>
                        </div>

                        {/* Ticket Paper Simulation */}
                        <div className="rounded-xl bg-white border border-rose-200 p-4 font-mono text-xs space-y-2 text-slate-700 shadow-2xs">
                            <div className="text-[10px] text-slate-400 border-b border-dashed border-slate-200 pb-2">
                                <div>CENTRE MONETIQUE INTERBANCAIRE</div>
                                <div>COMPTOIR DESK AIRPORT</div>
                            </div>
                            <div className="flex justify-between font-bold text-rose-700 pt-1">
                                <span>TYPE TX:</span>
                                <span>VENTE / ACHAT</span>
                            </div>
                            <div className="flex justify-between text-slate-500 text-[11px]">
                                <span>CODE REF:</span>
                                <span>01 - SALE DIRECT</span>
                            </div>
                            <div className="flex justify-between font-bold text-slate-900 border-t border-dashed border-slate-200 pt-2">
                                <span>MONTANT DÉBITÉ:</span>
                                <span className="text-rose-700">15 000 MAD (~1 400 €)</span>
                            </div>
                            <div className="flex justify-between text-rose-600 text-[11px]">
                                <span>FRAIS PERDUS:</span>
                                <span>~450 à 600 MAD (3.2%)</span>
                            </div>
                        </div>

                        {/* Bullet Points */}
                        <ul className="text-xs space-y-1.5 text-slate-600 pt-1">
                            <li className="flex items-start gap-2">
                                <span className="text-rose-600 font-bold">✕</span>
                                <span>{isEn ? "Money immediately withdrawn from your bank account" : "L'argent est immédiatement retiré de votre solde bancaire"}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-rose-600 font-bold">✕</span>
                                <span>{isEn ? "Currency conversion fees lost even after refund" : "Frais de change (3%) perdus définitivement, même après re-crédit"}</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-rose-600 font-bold">✕</span>
                                <span>{isEn ? "Refund delays of 15 to 45 business days" : "Délais de remboursement aléatoires (15 à 45 jours)"}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Advice Footer */}
                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] flex items-start gap-3 text-xs text-slate-700">
                    <ShieldCheck size={18} className="text-[#C9572C] shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        <strong>{isEn ? "Forensic verification tip:" : "Conseil d'audit :"}</strong>{" "}
                        {isEn
                            ? "Always read the TPE terminal screen before entering your PIN. If the word 'SALE' appears instead of 'PRE-AUTHORISATION', demand immediate cancellation before taking the keys."
                            : "Exigez toujours de lire l'écran du boîtier CMI avant de composer votre code PIN. Si le mot 'VENTE' apparaît à la place de 'PRE-AUTORISATION', refusez la transaction avant même de prendre les clés."}
                    </p>
                </div>
            </div>
        );
    }

    if (type === "ground-clearance") {
        return (
            <div className="my-8 rounded-3xl bg-white border border-[#E7DFD5] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#ECE5D9]">
                    <span className="w-8 h-8 rounded-xl bg-[#C9572C]/10 text-[#C9572C] flex items-center justify-center">
                        <Gauge size={18} />
                    </span>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#C9572C]">
                            {isEn ? "Suspension & Terrain Benchmark" : "Garde au Sol & Pistes Marocaines"}
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            {isEn
                                ? "Clearance Guide: City Cars (130mm) vs Stepway (175mm) vs Duster (210mm)"
                                : "Comparatif Réel : Citadine 130mm vs Crossover 175mm vs Duster 210mm"}
                        </h3>
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                    {/* 130 mm */}
                    <div className="rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] p-4 text-xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-base font-black text-slate-900">130 mm</span>
                                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">
                                    Citadine
                                </span>
                            </div>
                            <div className="font-bold text-slate-800">Renault Clio / Sandero</div>
                            <p className="text-slate-600 leading-relaxed text-[11px]">
                                {isEn
                                    ? "Asphalt only. Risk of oil pan damage on unpaved roads and tall Moroccan rural speed bumps."
                                    : "Réservé 100% au goudron. Risque d'arrachement de carter d'huile sur pistes et dos-d'âne artisanaux."}
                            </p>
                        </div>
                        <div className="text-[10px] font-bold text-slate-600 bg-white p-2 rounded-xl border border-slate-200 text-center">
                            {isEn ? "Asphalt & Cities Only" : "Axes urbains & autoroutes"}
                        </div>
                    </div>

                    {/* 175 mm */}
                    <div className="rounded-2xl bg-amber-50/50 border border-amber-200 p-4 text-xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-base font-black text-amber-950">175 mm</span>
                                <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px]">
                                    Crossover
                                </span>
                            </div>
                            <div className="font-bold text-slate-800">Dacia Sandero Stepway</div>
                            <p className="text-slate-600 leading-relaxed text-[11px]">
                                {isEn
                                    ? "The smart roadtrip compromise. Clears high speed bumps easily and handles packed dirt roads to ecolodges."
                                    : "Le compromis idéal pour 85% des roadtrips. Absorbe les ralentisseurs hauts et pistes d'écolodges damées."}
                            </p>
                        </div>
                        <div className="text-[10px] font-bold text-amber-900 bg-amber-100/70 p-2 rounded-xl border border-amber-300 text-center">
                            {isEn ? "Packed Dirt Roads OK" : "Pistes damées & Haut-Atlas OK"}
                        </div>
                    </div>

                    {/* 210 mm */}
                    <div className="rounded-2xl bg-emerald-50/50 border border-emerald-300 p-4 text-xs space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="font-mono text-base font-black text-emerald-950">210 mm</span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                                    SUV / 4WD
                                </span>
                            </div>
                            <div className="font-bold text-slate-900">Dacia Duster (2WD/4WD)</div>
                            <p className="text-slate-600 leading-relaxed text-[11px]">
                                {isEn
                                    ? "30° approach angle. Effortlessly glides over stone plateaus (hamada in Agafay) and dry river crossings."
                                    : "Angle d'attaque de 30°. Passe sur les pierriers de l'Agafay (hamada), traversées d'oueds et cols sans encombre."}
                            </p>
                        </div>
                        <div className="text-[10px] font-bold text-emerald-900 bg-emerald-100 p-2 rounded-xl border border-emerald-300 text-center">
                            {isEn ? "Agafay & South Validated" : "Désert d'Agafay & Sud validés"}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === "radar-fines") {
        return (
            <div className="my-8 rounded-3xl bg-white border border-[#E7DFD5] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#ECE5D9]">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                        <AlertTriangle size={18} />
                    </span>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                            {isEn ? "Moroccan Traffic Law 116-14" : "Code de la Route Marocain (Loi 116-14)"}
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            {isEn
                                ? "Speed Camera Penalties: Immediate Settlement (ATF -50% Discount)"
                                : "Barème Légal des Amendes : Règlement Immédiat ATF (-50%)"}
                        </h3>
                    </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Excès &lt; 20 km/h</div>
                        <div className="text-2xl font-black text-slate-900 font-mono">150 MAD <span className="text-xs font-normal text-slate-500">(~14 €)</span></div>
                        <p className="text-[11px] text-slate-600">
                            {isEn ? "With immediate payment. Baseline fine: 300 MAD." : "Paiement immédiat sur quittance (au lieu de 300 MAD)."}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Excès 20 à 30 km/h</div>
                        <div className="text-2xl font-black text-amber-800 font-mono">300 MAD <span className="text-xs font-normal text-slate-500">(~28 €)</span></div>
                        <p className="text-[11px] text-slate-600">
                            {isEn ? "With immediate payment. Baseline fine: 500 MAD." : "Paiement immédiat sur quittance (au lieu de 500 MAD)."}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-rose-50/50 border border-rose-200 p-4 space-y-1.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">Excès 30 à 50 km/h</div>
                        <div className="text-2xl font-black text-rose-800 font-mono">400 MAD <span className="text-xs font-normal text-slate-500">(~37 €)</span></div>
                        <p className="text-[11px] text-slate-600">
                            {isEn ? "With immediate payment. Baseline fine: 700 MAD." : "Paiement immédiat sur quittance (au lieu de 700 MAD)."}
                        </p>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] flex items-start gap-3 text-xs text-slate-700">
                    <FileCheck size={18} className="text-amber-700 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                        <strong>{isEn ? "Legal right:" : "Droit légal :"}</strong>{" "}
                        {isEn
                            ? "Under Moroccan law, you are entitled to receive an official stamped and numbered paper receipt from the officer for any cash settlement. A technical tolerance of 7 km/h applies to laser radar measurements."
                            : "Pour tout règlement d'ATF en espèces, l'agent verbalisateur (Gendarmerie Royale ou DGSN) a l'obligation stricte de vous remettre un feuillet de quittance timbré et numéroté issu du carnet à souche officiel. Une tolérance technique de 7 km/h s'applique aux mesures."}
                    </p>
                </div>
            </div>
        );
    }

    if (type === "jawaz-toll") {
        return (
            <div className="my-8 rounded-3xl bg-white border border-[#E7DFD5] p-6 sm:p-8 shadow-xs space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-[#ECE5D9]">
                    <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                        <Zap size={18} />
                    </span>
                    <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#C9572C]">
                            {isEn ? "Morocco Highway Tolls (ADM)" : "Gares de Péage Autoroutes du Maroc (ADM)"}
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                            {isEn
                                ? "Toll Gate Organisation: Orange Jawaz Pass vs Blue Cash Lanes"
                                : "Organisation des Voies : Voie Orange Pass Jawaz vs Voies Bleues Espèces"}
                        </h3>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-2xl bg-amber-50/60 border border-amber-200 p-4 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-amber-950">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                            <span>Voie Orange : Télépéage Pass Jawaz (30 km/h)</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                            {isEn
                                ? "Drive through without stopping at 20-30 km/h. Overhead RFID sensor debits your balance and opens the gate instantly. Zero waiting time."
                                : "Franchissement sans arrêt à 20-30 km/h. L'antenne RFID en hauteur lit le boîtier fixé au pare-brise et lève la barrière en instantané. Zéro file d'attente."}
                        </p>
                    </div>

                    <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-4 space-y-2">
                        <div className="flex items-center gap-2 font-bold text-slate-800">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                            <span>Voies Bleues : Paiement Espèces au Guichetier</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">
                            {isEn
                                ? "Complete stop at the toll booth. Cash payment in Moroccan Dirhams only (no credit cards accepted at ADM booths). Expect queues on peak hours."
                                : "Arrêt complet au guichet. Paiement en espèces en Dirhams uniquement (pas de carte bancaire acceptée aux barrières ADM). Attente fréquente les dimanches."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
