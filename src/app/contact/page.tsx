"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    MessageCircle,
    Phone,
    Mail,
    MapPin,
    Clock,
    ShieldAlert,
    ShieldCheck,
    CheckCircle2,
    Send,
    Loader2,
    FileText,
    HelpCircle,
} from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SosModal } from "@/components/SosModal";
import { MOROCCAN_HUBS } from "@/lib/morocco-data";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [sosModalOpen, setSosModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "Question réservation",
        bookingRef: "",
        city: "Marrakech",
        message: "",
        confirm_email: "", // Honeypot
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        setErrorMessage("");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: `${formData.subject}${formData.bookingRef ? ` (Dossier #${formData.bookingRef})` : ""}`,
                    city: formData.city,
                    domain: "zwincar.com",
                    confirm_email: formData.confirm_email,
                    message: `Téléphone: ${formData.phone || "Non renseigné"}\nRéférence: ${formData.bookingRef || "Aucune"}\n\n${formData.message}`,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erreur lors de l'envoi du message");
            }

            setStatus("success");
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "Question réservation",
                bookingRef: "",
                city: "Marrakech",
                message: "",
                confirm_email: "",
            });
        } catch (err: any) {
            setStatus("error");
            setErrorMessage(err.message || "Une erreur est survenue.");
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col font-sans">
            <Header />

            <main className="flex-1 pb-20">
                {/* Hero Header */}
                <section className="bg-[#12161E] text-white py-14 border-b border-slate-800">
                    <div className="container mx-auto px-4 max-w-5xl text-center">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <span>Service Client & Assistance Maroc 24/7</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
                            Une question ? Notre équipe vous répond immédiatement.
                        </h1>
                        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Pour une réservation en cours, une modification d'horaire de vol ou une demande de devis sur mesure, contactez nos équipes locales à Marrakech, Casablanca, Agadir, Tanger et Fès.
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 max-w-5xl -mt-6">
                    {/* Quick Channel Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        {/* WhatsApp VIP Card */}
                        <div className="rounded-2xl bg-white border border-[#E7DFD5] p-5 shadow-xs hover:shadow-md transition">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                                <MessageCircle size={22} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">WhatsApp Concierge VIP</h3>
                            <p className="text-xs text-slate-500 mb-3">
                                Réponse en moins de 5 min. Idéal pour suivi de vol et remise des clés.
                            </p>
                            <a
                                href="https://wa.me/212600000000?text=Bonjour%20ZwinCar,%20j'ai%20une%20question%20concernant%20une%20location"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                            >
                                <span>Écrire sur WhatsApp</span>
                                <span>→</span>
                            </a>
                        </div>

                        {/* Telephone & SOS */}
                        <div className="rounded-2xl bg-white border border-[#E7DFD5] p-5 shadow-xs hover:shadow-md transition">
                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                                <Phone size={22} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">SOS & Urgence 24/7</h3>
                            <p className="text-xs text-slate-500 mb-3">
                                Assistance panne, accrochage ou question urgente sur route au Maroc.
                            </p>
                            <button
                                type="button"
                                onClick={() => setSosModalOpen(true)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                            >
                                <span>Numéros d'urgence</span>
                                <span>→</span>
                            </button>
                        </div>

                        {/* Booking Management */}
                        <div className="rounded-2xl bg-white border border-[#E7DFD5] p-5 shadow-xs hover:shadow-md transition">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C9572C] flex items-center justify-center mb-3">
                                <FileText size={22} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">Votre Dossier</h3>
                            <p className="text-xs text-slate-500 mb-3">
                                Retrouvez votre bon de réservation, modifiez vos dates ou téléchargez le voucher.
                            </p>
                            <Link
                                href="/booking/ZW-78421"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9572C] hover:text-[#B24922]"
                            >
                                <span>Accéder à mon voucher</span>
                                <span>→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Main Form & Hubs Info Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Contact Form */}
                        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#ECE5D9] p-6 sm:p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-2">Envoyer un message</h2>
                            <p className="text-xs text-slate-500 mb-6">
                                Remplissez le formulaire ci-dessous. Un conseiller dédié vous répondra par email ou WhatsApp.
                            </p>

                            {status === "success" ? (
                                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <h3 className="text-base font-bold text-emerald-900">Message transmis avec succès !</h3>
                                    <p className="text-xs text-emerald-700 leading-relaxed max-w-sm mx-auto">
                                        Notre équipe vous recontacte dans les plus brefs délais. Si votre demande concerne un vol dans les 2 heures, contactez-nous directement sur WhatsApp.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setStatus("idle")}
                                        className="text-xs font-bold text-emerald-800 underline underline-offset-2 pt-2"
                                    >
                                        Envoyer un autre message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Honeypot anti-spam */}
                                    <input
                                        type="text"
                                        name="confirm_email"
                                        value={formData.confirm_email}
                                        onChange={(e) => setFormData({ ...formData, confirm_email: e.target.value })}
                                        tabIndex={-1}
                                        autoComplete="off"
                                        className="hidden"
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                                Nom complet *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Thomas Martin"
                                                className="w-full h-11 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder="thomas@example.com"
                                                className="w-full h-11 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                                Téléphone / WhatsApp
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder="+33 6 12 34 56 78"
                                                className="w-full h-11 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                                Ville / Aéroport
                                            </label>
                                            <select
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full h-11 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                            >
                                                {MOROCCAN_HUBS.map((hub) => (
                                                    <option key={hub.slug} value={hub.name}>
                                                        {hub.name} ({hub.airportCode})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                                Objet de votre demande
                                            </label>
                                            <select
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full h-11 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                            >
                                                <option value="Question réservation">Question sur une réservation</option>
                                                <option value="Modification vol/dates">Modification de dates ou numéro de vol</option>
                                                <option value="Question caution">Question Franchise Zéro ou caution</option>
                                                <option value="Devis longue durée">Devis sur-mesure / longue durée</option>
                                                <option value="Devenir loueur partenaire">Devenir loueur partenaire ZwinCar</option>
                                                <option value="Autre">Autre question</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                                N° Réservation (optionnel)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.bookingRef}
                                                onChange={(e) => setFormData({ ...formData, bookingRef: e.target.value })}
                                                placeholder="ex : ZW-78421"
                                                className="w-full h-11 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                            Votre message *
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="Précisez votre demande, vos dates souhaitées ou votre question..."
                                            className="w-full p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-medium text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                        />
                                    </div>

                                    {status === "error" && (
                                        <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                                            {errorMessage}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === "loading"}
                                        className="w-full h-12 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-xs tracking-wider uppercase transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                    >
                                        {status === "loading" ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                <span>Envoi en cours...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={15} />
                                                <span>Envoyer le message</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Hubs Info & FAQ sidebar */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="bg-white rounded-3xl border border-[#ECE5D9] p-6 shadow-sm space-y-4">
                                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                                    <MapPin size={16} className="text-[#C9572C]" />
                                    <span>Nos Hubs au Maroc</span>
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Livraison offerte directement au parking aéroport ou à votre riad/hôtel dans les 6 villes principales :
                                </p>
                                <div className="space-y-2">
                                    {MOROCCAN_HUBS.map((hub) => (
                                        <div
                                            key={hub.slug}
                                            className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] flex items-center justify-between text-xs"
                                        >
                                            <div>
                                                <strong className="text-slate-900">{hub.name}</strong>
                                                <span className="text-slate-500 text-[11px] block">{hub.airportName}</span>
                                            </div>
                                            <span className="font-mono font-bold text-[#C9572C] bg-white px-2 py-0.5 rounded border border-[#E7DFD5] text-[11px]">
                                                {hub.airportCode}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-[#ECE5D9] p-6 shadow-sm space-y-3">
                                <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                                    <HelpCircle size={16} className="text-[#C9572C]" />
                                    <span>Questions Fréquentes</span>
                                </h3>
                                <div className="space-y-2.5 text-xs text-slate-600">
                                    <div>
                                        <strong className="text-slate-900 block mb-0.5">Mon vol a du retard, que faire ?</strong>
                                        <p className="text-[11px] text-slate-500">
                                            Rien à faire ! Notre agent suit votre vol en direct sur FlightRadar24 et vous attend au parking quel que soit le retard.
                                        </p>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100">
                                        <strong className="text-slate-900 block mb-0.5">Puis-je payer en espèces ou carte de débit ?</strong>
                                        <p className="text-[11px] text-slate-500">
                                            Oui, nos agences acceptent les cartes de débit (Visa, Mastercard) et les espèces (EUR ou MAD).
                                        </p>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100">
                                        <strong className="text-slate-900 block mb-0.5">Comment fonctionne la Franchise Zéro ?</strong>
                                        <p className="text-[11px] text-slate-500">
                                            Zéro caution bloquée sur votre carte. Restitution en 2 minutes chrono à l'aéroport.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            <SosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
        </div>
    );
}
