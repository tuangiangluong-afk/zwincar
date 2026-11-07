"use client";

import React, { useState } from "react";
import { Phone, ShieldAlert, X, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

interface SosModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SosModal({ isOpen, onClose }: SosModalProps) {
    const [activeTab, setActiveTab] = useState<"numbers" | "accident" | "control">("numbers");

    React.useEffect(() => {
        if (!isOpen) return;
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = originalOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/65 backdrop-blur-xs">
            <div className="w-full max-w-lg max-h-[90dvh] sm:max-h-[85dvh] flex flex-col bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in duration-150">
                {/* Deep Architectural Header */}
                <div className="shrink-0 bg-[#12161E] p-4 sm:p-5 text-white flex items-center justify-between border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold">
                            <ShieldAlert size={20} className="text-[#C9572C]" />
                        </div>
                        <div>
                            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                                Assistance Voyageur Maroc 24/7
                            </div>
                            <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                                Numéros d'Urgence & Sécurité
                            </h3>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
                        aria-label="Fermer"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation Tabs */}
                <div className="shrink-0 flex border-b border-slate-200 bg-[#FAF7F2] text-xs font-bold text-slate-600">
                    <button
                        type="button"
                        onClick={() => setActiveTab("numbers")}
                        className={`flex-1 py-3 text-center border-b-2 cursor-pointer transition ${
                            activeTab === "numbers"
                                ? "border-[#C9572C] text-[#C9572C] bg-white font-extrabold"
                                : "border-transparent hover:text-slate-900"
                        }`}
                    >
                        Numéros Utiles
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("accident")}
                        className={`flex-1 py-3 text-center border-b-2 cursor-pointer transition ${
                            activeTab === "accident"
                                ? "border-[#C9572C] text-[#C9572C] bg-white font-extrabold"
                                : "border-transparent hover:text-slate-900"
                        }`}
                    >
                        En cas d'Accident
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("control")}
                        className={`flex-1 py-3 text-center border-b-2 cursor-pointer transition ${
                            activeTab === "control"
                                ? "border-[#C9572C] text-[#C9572C] bg-white font-extrabold"
                                : "border-transparent hover:text-slate-900"
                        }`}
                    >
                        Contrôles Routiers
                    </button>
                </div>

                {/* Body Content */}
                <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-y-auto overscroll-contain space-y-4">
                    {activeTab === "numbers" && (
                        <div className="space-y-4">
                            <div className="text-xs text-slate-500 font-medium">
                                Numéros gratuits officiels accessibles depuis n'importe quel mobile au Maroc :
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                <a
                                    href="tel:177"
                                    className="p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E7DFD5] hover:border-slate-300 flex items-center justify-between transition group"
                                >
                                    <div>
                                        <div className="text-[11px] text-slate-500 font-medium">Routes & Hors Agglomération</div>
                                        <div className="text-xs sm:text-sm font-bold text-slate-900">Gendarmerie Royale</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-black text-sm group-hover:bg-[#C9572C] transition">
                                        177
                                    </div>
                                </a>

                                <a
                                    href="tel:19"
                                    className="p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E7DFD5] hover:border-slate-300 flex items-center justify-between transition group"
                                >
                                    <div>
                                        <div className="text-[11px] text-slate-500 font-medium">En Ville (Médina, Guéliz, Centre)</div>
                                        <div className="text-xs sm:text-sm font-bold text-slate-900">Police / Sûreté Nationale</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-black text-sm group-hover:bg-[#C9572C] transition">
                                        19
                                    </div>
                                </a>

                                <a
                                    href="tel:5050"
                                    className="p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E7DFD5] hover:border-slate-300 flex items-center justify-between transition group"
                                >
                                    <div>
                                        <div className="text-[11px] text-slate-500 font-medium">Autoroutes ADM (A1, A3, A7)</div>
                                        <div className="text-xs sm:text-sm font-bold text-slate-900">Assistance Autoroute</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-black text-sm group-hover:bg-[#C9572C] transition">
                                        5050
                                    </div>
                                </a>

                                <a
                                    href="tel:15"
                                    className="p-3.5 rounded-2xl bg-[#FAF7F2] hover:bg-white border border-[#E7DFD5] hover:border-slate-300 flex items-center justify-between transition group"
                                >
                                    <div>
                                        <div className="text-[11px] text-slate-500 font-medium">Secours Médical / Pompiers</div>
                                        <div className="text-xs sm:text-sm font-bold text-slate-900">Protection Civile / SAMU</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-black text-sm group-hover:bg-[#C9572C] transition">
                                        15
                                    </div>
                                </a>
                            </div>

                            {/* Astreinte Conciergerie ZwinCar */}
                            <div className="rounded-2xl bg-[#12161E] text-white p-4.5 space-y-3 border border-slate-800">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-bold text-white flex items-center gap-2">
                                        <Phone size={14} className="text-[#C9572C]" />
                                        <span>Astreinte Conciergerie ZwinCar 24/7</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono">MAROC</span>
                                </div>
                                <p className="text-xs text-slate-300 leading-relaxed">
                                    Un voyant moteur, une clé égarée, un pneu crevé ou une question sur votre contrat ? Notre équipe locale intervient immédiatement.
                                </p>
                                <a
                                    href="https://wa.me/212720794046?text=URGENCE%20ASSISTANCE%20ZWINCAR"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center w-full py-2.5 px-3 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-xs tracking-wide transition cursor-pointer text-center"
                                >
                                    Contacter l'astreinte WhatsApp 24/7 (Réponse immédiate)
                                </a>
                            </div>
                        </div>
                    )}

                    {activeTab === "accident" && (
                        <div className="space-y-3.5 text-xs text-slate-600">
                            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-slate-800 font-medium">
                                En cas d'accrochage ou d'incident, respectez ces 4 étapes simples :
                            </div>

                            <ol className="space-y-3 list-decimal pl-4">
                                <li>
                                    <strong>Sécurisez la zone :</strong> Enfilez le gilet fluorescent (dans la boîte à gants) et posez le triangle de signalisation à 30 mètres.
                                </li>
                                <li>
                                    <strong>Photographiez avant tout mouvement :</strong> Prenez 4 clichés nets montrant les deux véhicules, les plaques d'immatriculation et les points de contact.
                                </li>
                                <li>
                                    <strong>Remplissez le Constat Amiable :</strong> Le formulaire officiel se trouve dans la pochette ZwinCar avec la carte grise.
                                </li>
                                <li>
                                    <strong>Alertez notre assistance WhatsApp :</strong> Envoyez les photos du constat pour ouverture immédiate du dossier d'assurance.
                                </li>
                            </ol>
                        </div>
                    )}

                    {activeTab === "control" && (
                        <div className="space-y-3.5 text-xs text-slate-600">
                            <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-slate-800 font-medium">
                                Les contrôles de gendarmerie et police sont fréquents et courtois au Maroc.
                            </div>

                            <div className="space-y-2">
                                <div className="font-bold text-slate-900 text-xs">Papiers du véhicule vérifiés (pochette ZwinCar) :</div>
                                <div className="grid grid-cols-2 gap-2 text-[11px]">
                                    <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5]">
                                        Permis de conduire conducteur
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5]">
                                        Contrat de location ZwinCar
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5]">
                                        Carte Grise du véhicule
                                    </div>
                                    <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5]">
                                        Attestation d'Assurance
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-200">
                                <strong>Règle d'usage de nuit :</strong> Allumez le plafonnier intérieur dès que vous ralentissez à proximité du barrage pour faciliter le contrôle visuel.
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="shrink-0 p-3 sm:p-4 bg-[#FAF7F2] border-t border-slate-200 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}
