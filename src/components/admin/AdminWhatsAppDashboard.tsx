"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    MessageSquare,
    Send,
    Phone,
    User,
    CheckCircle2,
    RefreshCw,
    Search,
    ShieldCheck,
    Clock,
    Sparkles,
    Car,
    Check,
} from "lucide-react";
import type { WhatsAppChatThread } from "@/lib/whatsapp-chat-store";

const QUICK_REPLIES = [
    {
        title: "Dispo & Acompte 20%",
        text: "Bonjour ! Votre véhicule est bien disponible aux dates demandées. Vous pouvez bloquer la réservation avec l'acompte de 20% sur notre site sécurisé, et le solde de 80% se règle sur place à la remise des clés.",
    },
    {
        title: "Point RDV Aéroport",
        text: "Notre agent local vous attendra directement à la sortie du terminal avec une pancarte à votre nom et les clés. Le tour du véhicule prend 5 minutes et le solde est réglé en espèces (EUR/MAD) ou CB.",
    },
    {
        title: "Caution & Carte de Débit",
        text: "Nos loueurs acceptent 100% les cartes de débit européennes. Avec l'option Franchise Zéro, aucune caution n'est bloquée sur votre compte (sinon 300 € en espèces ou CB, restitués au retour).",
    },
    {
        title: "Vol Retardé",
        text: "Pas d'inquiétude pour votre vol : communiquez-nous votre numéro de vol et notre agent surveille l'atterrissage en direct. Votre voiture reste garantie sans aucun frais de retard.",
    },
];

export function AdminWhatsAppDashboard() {
    const [threads, setThreads] = useState<WhatsAppChatThread[]>([]);
    const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [replyText, setReplyText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchThreads = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/whatsapp/inbox");
            if (!res.ok) throw new Error("Erreur chargement");
            const data = await res.json();
            if (data.success && Array.isArray(data.threads)) {
                setThreads(data.threads);
                if (!selectedPhone && data.threads.length > 0) {
                    setSelectedPhone(data.threads[0].id);
                }
            }
        } catch (e) {
            console.error("Fetch threads error:", e);
        } finally {
            setIsLoading(false);
        }
    }, [selectedPhone]);

    useEffect(() => {
        fetchThreads();
        const interval = setInterval(fetchThreads, 6000); // Polling toutes les 6s
        return () => clearInterval(interval);
    }, [fetchThreads]);

    const activeThread = threads.find((t) => t.id === selectedPhone) || threads[0] || null;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [activeThread?.messages]);

    const handleSelectThread = async (phoneId: string) => {
        setSelectedPhone(phoneId);
        try {
            await fetch(`/api/admin/whatsapp/inbox?phone=${phoneId}`);
            // Mise à jour locale pour effacer le badge non lu
            setThreads((prev) =>
                prev.map((t) => (t.id === phoneId ? { ...t, unreadCount: 0 } : t))
            );
        } catch {
            // ignore
        }
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!replyText.trim() || !activeThread || isSending) return;

        const textToSend = replyText.trim();
        setIsSending(true);
        setStatusMessage(null);

        // Optimistic UI update
        const optimisticMsg = {
            id: `opt_${Date.now()}`,
            sender: "admin" as const,
            text: textToSend,
            timestamp: new Date().toISOString(),
            status: "sent" as const,
        };

        setThreads((prev) =>
            prev.map((t) =>
                t.id === activeThread.id
                    ? {
                          ...t,
                          lastMessage: textToSend,
                          lastMessageAt: optimisticMsg.timestamp,
                          messages: [...t.messages, optimisticMsg],
                      }
                    : t
            )
        );
        setReplyText("");

        try {
            const res = await fetch("/api/admin/whatsapp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone: activeThread.id,
                    message: textToSend,
                }),
            });

            const data = await res.json();
            if (data.success) {
                setStatusMessage("Message envoyé via Meta WhatsApp Cloud API ✓");
                setTimeout(() => setStatusMessage(null), 3500);
            } else {
                setStatusMessage(`⚠️ Erreur : ${data.error || "Échec d'envoi"}`);
            }
        } catch {
            setStatusMessage("⚠️ Erreur réseau lors de l'envoi");
        } finally {
            setIsSending(false);
        }
    };

    const filteredThreads = threads.filter((t) => {
        const q = searchQuery.toLowerCase();
        return (
            t.phone.toLowerCase().includes(q) ||
            (t.customerName && t.customerName.toLowerCase().includes(q)) ||
            t.lastMessage.toLowerCase().includes(q)
        );
    });

    const totalUnread = threads.reduce((acc, t) => acc + (t.unreadCount || 0), 0);

    return (
        <div className="flex h-[calc(100vh-3.5rem)] bg-slate-100 font-sans overflow-hidden">
            {/* Colonne de Gauche : Liste des Conversations */}
            <div className="w-80 md:w-96 bg-white border-r border-slate-200 flex flex-col shrink-0">
                {/* Header Inbox */}
                <div className="p-4 border-b border-slate-200 bg-slate-50/70">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow-xs">
                                <MessageSquare size={18} />
                            </div>
                            <div>
                                <h2 className="text-sm font-black text-slate-900 tracking-tight">WhatsApp Studio</h2>
                                <p className="text-[11px] font-semibold text-slate-500 font-mono">+212 7 20 79 40 46</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {totalUnread > 0 && (
                                <span className="bg-[#C9572C] text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                                    {totalUnread} non lu{totalUnread > 1 ? "s" : ""}
                                </span>
                            )}
                            <button
                                onClick={fetchThreads}
                                title="Actualiser"
                                className="h-8 w-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center cursor-pointer transition shadow-2xs"
                            >
                                <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
                            </button>
                        </div>
                    </div>

                    {/* Barre de Recherche */}
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, numéro..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-9 pl-9 pr-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#25D366]"
                        />
                    </div>
                </div>

                {/* Liste des Fils de Discussion */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                    {filteredThreads.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs">
                            Aucune conversation trouvée.
                        </div>
                    ) : (
                        filteredThreads.map((thread) => {
                            const isSelected = activeThread?.id === thread.id;
                            const hasUnread = (thread.unreadCount || 0) > 0;
                            const timeStr = new Date(thread.lastMessageAt).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            return (
                                <button
                                    key={thread.id}
                                    onClick={() => handleSelectThread(thread.id)}
                                    className={`w-full p-3.5 text-left transition flex items-start gap-3 cursor-pointer ${
                                        isSelected
                                            ? "bg-emerald-50/80 border-l-4 border-l-[#25D366]"
                                            : "hover:bg-slate-50 border-l-4 border-l-transparent"
                                    }`}
                                >
                                    <div className="h-10 w-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0 relative shadow-2xs">
                                        {thread.customerName?.charAt(0).toUpperCase() || <User size={16} />}
                                        {hasUnread && (
                                            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-[#25D366] border-2 border-white ring-1 ring-emerald-600" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1 mb-0.5">
                                            <span className="text-xs font-bold text-slate-900 truncate">
                                                {thread.customerName || thread.phone}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono shrink-0">
                                                {timeStr}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 font-mono mb-1 truncate">
                                            {thread.phone}
                                        </p>
                                        <p className={`text-xs truncate ${hasUnread ? "font-bold text-slate-900" : "text-slate-600"}`}>
                                            {thread.lastMessage}
                                        </p>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Colonne de Droite : Fenêtre de Chat Actif */}
            {activeThread ? (
                <div className="flex-1 flex flex-col bg-[#F0F2F5] overflow-hidden">
                    {/* Topbar Chat */}
                    <div className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center font-black text-sm">
                                {activeThread.customerName?.charAt(0).toUpperCase() || <Phone size={18} />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        {activeThread.customerName || "Client ZwinCar"}
                                    </h3>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                                        WhatsApp Officiel
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                                    <span>{activeThread.phone}</span>
                                    <span>•</span>
                                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                        <ShieldCheck size={12} /> Meta Graph v21.0
                                    </span>
                                </div>
                            </div>
                        </div>

                        {statusMessage && (
                            <div className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 animate-in fade-in">
                                {statusMessage}
                            </div>
                        )}
                    </div>

                    {/* Zone de Défilement des Messages */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        <div className="flex justify-center">
                            <span className="px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-[11px] font-medium text-slate-500 shadow-2xs">
                                Conversation sécurisée avec le standard ZwinCar (+212 7 20 79 40 46)
                            </span>
                        </div>

                        {activeThread.messages.map((msg) => {
                            const isMe = msg.sender === "admin";
                            const time = new Date(msg.timestamp).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            });

                            return (
                                <div
                                    key={msg.id}
                                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`max-w-[75%] rounded-2xl p-3.5 shadow-xs relative text-xs leading-relaxed ${
                                            isMe
                                                ? "bg-[#DCF8C6] text-slate-900 rounded-tr-xs"
                                                : "bg-white text-slate-900 rounded-tl-xs border border-slate-200/80"
                                        }`}
                                    >
                                        <div className="font-semibold text-[10px] mb-1 text-slate-500">
                                            {isMe ? "ZwinCar Support" : activeThread.customerName || activeThread.phone}
                                        </div>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                        <div className="flex items-center justify-end gap-1 mt-1.5 text-[9px] text-slate-400 font-mono">
                                            <span>{time}</span>
                                            {isMe && <Check size={11} className="text-emerald-600" />}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Barre de Réponses Rapides */}
                    <div className="px-6 py-2 bg-white border-t border-slate-200 flex items-center gap-2 overflow-x-auto">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                            <Sparkles size={12} className="text-[#C9572C]" /> Réponses Rapides :
                        </span>
                        {QUICK_REPLIES.map((qr, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setReplyText(qr.text)}
                                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium cursor-pointer transition shadow-2xs"
                            >
                                {qr.title}
                            </button>
                        ))}
                    </div>

                    {/* Zone de Saisie et Envoi */}
                    <form
                        onSubmit={handleSendMessage}
                        className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
                    >
                        <input
                            type="text"
                            placeholder="Écrivez votre réponse WhatsApp au client..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            disabled={isSending}
                            className="flex-1 h-12 px-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#25D366] focus:bg-white transition"
                        />
                        <button
                            type="submit"
                            disabled={isSending || !replyText.trim()}
                            className="h-12 px-6 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-md cursor-pointer active:scale-[0.98]"
                        >
                            <Send size={15} />
                            <span>{isSending ? "Envoi..." : "Envoyer"}</span>
                        </button>
                    </form>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-10 text-center text-slate-400">
                    <Car size={48} className="text-slate-300 mb-3" />
                    <p className="text-sm font-semibold">Sélectionnez une conversation WhatsApp pour répondre au client</p>
                </div>
            )}
        </div>
    );
}
