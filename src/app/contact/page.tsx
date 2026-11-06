"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { Locale } from "@/lib/i18n";

const CONTACT_I18N: Record<
    Locale,
    {
        badge: string;
        title: string;
        subtitle: string;
        whatsappTitle: string;
        whatsappDesc: string;
        whatsappCta: string;
        sosTitle: string;
        sosDesc: string;
        sosCta: string;
        dossierTitle: string;
        dossierDesc: string;
        dossierCta: string;
        formTitle: string;
        formSubtitle: string;
        nameLabel: string;
        emailLabel: string;
        phoneLabel: string;
        hubLabel: string;
        subjectLabel: string;
        bookingRefLabel: string;
        messageLabel: string;
        sendBtn: string;
        sendingBtn: string;
        successTitle: string;
        successDesc: string;
        anotherBtn: string;
        hubsTitle: string;
        hubsDesc: string;
        faqTitle: string;
        subjects: { value: string; label: string }[];
        faqs: { q: string; a: string }[];
    }
> = {
    fr: {
        badge: "Service Client & Assistance Maroc 24/7",
        title: "Une question ? Notre équipe vous répond immédiatement.",
        subtitle: "Pour une réservation en cours, une modification d'horaire de vol ou une demande de devis sur mesure, contactez nos équipes locales à Marrakech, Casablanca, Agadir, Tanger et Fès.",
        whatsappTitle: "WhatsApp Concierge VIP",
        whatsappDesc: "Réponse en moins de 5 min. Idéal pour suivi de vol et remise des clés.",
        whatsappCta: "Écrire sur WhatsApp",
        sosTitle: "SOS & Urgence 24/7",
        sosDesc: "Assistance panne, accrochage ou question urgente sur route au Maroc.",
        sosCta: "Numéros d'urgence",
        dossierTitle: "Votre Dossier",
        dossierDesc: "Retrouvez votre bon de réservation, modifiez vos dates ou téléchargez le voucher.",
        dossierCta: "Accéder à mon voucher",
        formTitle: "Envoyer un message",
        formSubtitle: "Remplissez le formulaire ci-dessous. Un conseiller dédié vous répondra par email ou WhatsApp sous 2h.",
        nameLabel: "Nom complet *",
        emailLabel: "Email *",
        phoneLabel: "Téléphone / WhatsApp",
        hubLabel: "Ville / Aéroport",
        subjectLabel: "Objet de votre demande",
        bookingRefLabel: "N° Réservation (optionnel)",
        messageLabel: "Votre message *",
        sendBtn: "Envoyer le message",
        sendingBtn: "Envoi en cours...",
        successTitle: "Message transmis avec succès !",
        successDesc: "Notre équipe vous recontacte dans les plus brefs délais. Si votre demande concerne un vol dans les 2 heures, contactez-nous directement sur WhatsApp.",
        anotherBtn: "Envoyer un autre message",
        hubsTitle: "Nos Hubs au Maroc",
        hubsDesc: "Livraison offerte directement au parking aéroport ou à votre riad/hôtel dans les 6 villes principales :",
        faqTitle: "Questions Fréquentes",
        subjects: [
            { value: "Question réservation", label: "Question sur une réservation" },
            { value: "Modification vol/dates", label: "Modification de dates ou numéro de vol" },
            { value: "Question caution", label: "Question Franchise Zéro ou caution" },
            { value: "Devis longue durée", label: "Devis sur-mesure / longue durée" },
            { value: "Devenir loueur partenaire", label: "Devenir loueur partenaire ZwinCar" },
            { value: "Autre", label: "Autre question" },
        ],
        faqs: [
            {
                q: "Mon vol a du retard, que faire ?",
                a: "Rien à faire ! Notre agent suit votre vol en direct sur FlightRadar24 et vous attend au parking quel que soit le retard sans frais additionnel.",
            },
            {
                q: "Puis-je payer en espèces ou carte de débit ?",
                a: "Oui, nos agences acceptent les cartes de débit (Visa, Mastercard) et les espèces (EUR ou MAD). Pas besoin de carte de crédit.",
            },
            {
                q: "Comment fonctionne la Franchise Zéro ?",
                a: "Zéro caution bloquée sur votre carte. Restitution en 2 minutes chrono sur le parking de l'aéroport.",
            },
        ],
    },
    en: {
        badge: "24/7 Morocco Customer Care & Roadside Assist",
        title: "Have a question? Our team replies right away.",
        subtitle: "For an ongoing booking, flight schedule update, or tailored quote, reach out to our local airport teams in Marrakech, Casablanca, Agadir, Tangier, and Fez.",
        whatsappTitle: "WhatsApp Concierge VIP",
        whatsappDesc: "Reply in under 5 min. Ideal for real-time flight tracking & parking handoff.",
        whatsappCta: "Chat on WhatsApp",
        sosTitle: "SOS Emergency 24/7",
        sosDesc: "Breakdown support, accident report, or roadside assistance anywhere in Morocco.",
        sosCta: "Emergency numbers",
        dossierTitle: "Your Booking",
        dossierDesc: "Retrieve your voucher, update travel dates, or download receipt.",
        dossierCta: "Access my voucher",
        formTitle: "Send us a message",
        formSubtitle: "Fill in the form below. A dedicated agent will reply via email or WhatsApp within 2 hours.",
        nameLabel: "Full Name *",
        emailLabel: "Email Address *",
        phoneLabel: "Phone / WhatsApp",
        hubLabel: "City / Airport Hub",
        subjectLabel: "Subject",
        bookingRefLabel: "Booking Ref (optional)",
        messageLabel: "Your Message *",
        sendBtn: "Send Message",
        sendingBtn: "Sending...",
        successTitle: "Message successfully sent!",
        successDesc: "Our team will get back to you shortly. If your flight lands within the next 2 hours, message our VIP WhatsApp directly.",
        anotherBtn: "Send another message",
        hubsTitle: "Our Moroccan Hubs",
        hubsDesc: "Free delivery directly at airport parking or your riad/hotel across 6 key destinations:",
        faqTitle: "Frequently Asked Questions",
        subjects: [
            { value: "Question réservation", label: "Booking inquiry" },
            { value: "Modification vol/dates", label: "Flight delay or date reschedule" },
            { value: "Question caution", label: "Zero Excess / Deposit policy inquiry" },
            { value: "Devis longue durée", label: "Long-term / bespoke rental quote" },
            { value: "Devenir loueur partenaire", label: "Become a verified fleet partner" },
            { value: "Autre", label: "Other question" },
        ],
        faqs: [
            {
                q: "My flight is delayed, what should I do?",
                a: "Nothing! Our team tracks your flight in real time on FlightRadar24. Your car will be waiting for you regardless of delay, at no extra charge.",
            },
            {
                q: "Can I pay with debit card or cash?",
                a: "Yes! All verified partners accept standard debit cards (Visa/Mastercard) and cash (EUR or MAD). No physical credit card required.",
            },
            {
                q: "How does Zero Excess work?",
                a: "No deposit hold on your credit card. Return takes only 2 minutes at the airport parking.",
            },
        ],
    },
    es: {
        badge: "Atención al Cliente y Asistencia Marruecos 24/7",
        title: "¿Alguna duda? Nuestro equipo le responde de inmediato.",
        subtitle: "Para una reserva activa, cambio de vuelo o presupuesto a medida, contacte con nuestros equipos locales en Marrakech, Casablanca, Agadir, Tánger y Fez.",
        whatsappTitle: "WhatsApp Concierge VIP",
        whatsappDesc: "Respuesta en menos de 5 min. Ideal para seguimiento de vuelo y entrega de llaves.",
        whatsappCta: "Escribir por WhatsApp",
        sosTitle: "SOS y Emergencias 24/7",
        sosDesc: "Asistencia en carretera, avería o consulta urgente en cualquier punto de Marruecos.",
        sosCta: "Números de emergencia",
        dossierTitle: "Su Reserva",
        dossierDesc: "Consulte su bono de alquiler, modifique sus fechas o descargue el justificante.",
        dossierCta: "Ver mi bono",
        formTitle: "Enviar un mensaje",
        formSubtitle: "Complete el formulario. Un agente dedicado le responderá por email o WhatsApp en menos de 2h.",
        nameLabel: "Nombre completo *",
        emailLabel: "Correo electrónico *",
        phoneLabel: "Teléfono / WhatsApp",
        hubLabel: "Ciudad / Aeropuerto",
        subjectLabel: "Asunto",
        bookingRefLabel: "Nº Reserva (opcional)",
        messageLabel: "Su mensaje *",
        sendBtn: "Enviar mensaje",
        sendingBtn: "Enviando...",
        successTitle: "¡Mensaje enviado con éxito!",
        successDesc: "Nos pondremos en contacto muy pronto. Si su vuelo aterriza en menos de 2 horas, escríbanos directamente por WhatsApp.",
        anotherBtn: "Enviar otro mensaje",
        hubsTitle: "Nuestros Hubs en Marruecos",
        hubsDesc: "Entrega gratuita en el aparcamiento del aeropuerto o en su riad/hotel en las 6 ciudades principales:",
        faqTitle: "Preguntas Frecuentes",
        subjects: [
            { value: "Question réservation", label: "Consulta sobre una reserva" },
            { value: "Modification vol/dates", label: "Modificación de fechas o vuelo" },
            { value: "Question caution", label: "Consulta sobre Franquicia Cero y fianza" },
            { value: "Devis longue durée", label: "Presupuesto de larga estancia" },
            { value: "Devenir loueur partenaire", label: "Hacerse proveedor local asociado" },
            { value: "Autre", label: "Otra consulta" },
        ],
        faqs: [
            {
                q: "¿Mi vuelo se retrasa, qué debo hacer?",
                a: "¡Nada! Nuestro equipo monitoriza su vuelo en directo en FlightRadar24. Le esperaremos sin coste adicional.",
            },
            {
                q: "¿Puedo pagar con tarjeta de débito o efectivo?",
                a: "Sí, aceptamos tarjetas de débito (Visa/Mastercard) y efectivo en euros o dirhams. Sin exigencia de tarjeta de crédito.",
            },
            {
                q: "¿Cómo funciona la Franquicia Cero?",
                a: "Cero retención en su tarjeta. Devolución en 2 minutos en el aparcamiento del aeropuerto.",
            },
        ],
    },
    nl: {
        badge: "24/7 Marokko Klantenservice & Pechhulp",
        title: "Een vraag? Ons team antwoordt direct.",
        subtitle: "Voor een lopende boeking, vluchtwijziging of offerte op maat, neem contact op met onze lokale teams in Marrakech, Casablanca, Agadir, Tanger en Fez.",
        whatsappTitle: "WhatsApp Conciërge VIP",
        whatsappDesc: "Reactie binnen 5 min. Ideaal voor realtime vluchtmonitoring & sleuteloverdracht.",
        whatsappCta: "Chat op WhatsApp",
        sosTitle: "SOS Nooddienst 24/7",
        sosDesc: "Pechhulp, schadeafhandeling of dringende assistentie onderweg in Marokko.",
        sosCta: "Noodnummers",
        dossierTitle: "Uw Reservering",
        dossierDesc: "Bekijk uw voucher, wijzig reisdata of download de bevestiging.",
        dossierCta: "Bekijk mijn voucher",
        formTitle: "Stuur een bericht",
        formSubtitle: "Vul het formulier in. Een medewerker reageert binnen 2 uur per e-mail of WhatsApp.",
        nameLabel: "Volledige naam *",
        emailLabel: "E-mailadres *",
        phoneLabel: "Telefoon / WhatsApp",
        hubLabel: "Stad / Luchthaven",
        subjectLabel: "Onderwerp",
        bookingRefLabel: "Reserveringsnr. (optioneel)",
        messageLabel: "Uw bericht *",
        sendBtn: "Bericht versturen",
        sendingBtn: "Verzenden...",
        successTitle: "Bericht succesvol verzonden!",
        successDesc: "Ons team neemt spoedig contact op. Landt uw vlucht binnen 2 uur? Bericht ons direct via WhatsApp.",
        anotherBtn: "Nog een bericht sturen",
        hubsTitle: "Onze Hubs in Marokko",
        hubsDesc: "Gratis bezorging op de luchthavenparking of bij uw riad/hotel in de 6 belangrijkste steden:",
        faqTitle: "Veelgestelde Vragen",
        subjects: [
            { value: "Question réservation", label: "Vraag over een reservering" },
            { value: "Modification vol/dates", label: "Vlucht- of datumwijziging" },
            { value: "Question caution", label: "Vraag over Zonder Borg / franchise" },
            { value: "Devis longue durée", label: "Offerte lange termijn" },
            { value: "Devenir loueur partenaire", label: "Verhuurpartner worden" },
            { value: "Autre", label: "Overige vraag" },
        ],
        faqs: [
            {
                q: "Mijn vlucht heeft vertraging, wat moet ik doen?",
                a: "Niets! Ons team volgt uw vlucht live via FlightRadar24 en wacht op u zonder extra kosten.",
            },
            {
                q: "Kan ik betalen met debetkaart of contant?",
                a: "Ja, onze partners accepteren debetkaarten (Visa/Mastercard) en contant geld (EUR of MAD). Geen creditcard vereist.",
            },
            {
                q: "Hoe werkt de Zonder Borg optie?",
                a: "Geen borg geblokkeerd op uw kaart. Inleveren duurt slechts 2 minuten op de luchthavenparking.",
            },
        ],
    },
};

export default function ContactPage({ locale: propLocale }: { locale?: Locale } = {}) {
    const pathname = usePathname() || "";
    let activeLocale: Locale = propLocale || "fr";
    if (!propLocale) {
        if (pathname.startsWith("/en")) activeLocale = "en";
        else if (pathname.startsWith("/es")) activeLocale = "es";
        else if (pathname.startsWith("/nl")) activeLocale = "nl";
    }

    const t = CONTACT_I18N[activeLocale] || CONTACT_I18N.fr;

    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [sosModalOpen, setSosModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: t.subjects[0].value,
        bookingRef: "",
        city: "Marrakech",
        message: "",
        confirm_email: "",
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
                    subject: `${formData.subject}${formData.bookingRef ? ` (Ref #${formData.bookingRef})` : ""}`,
                    city: formData.city,
                    domain: "zwincar.com",
                    confirm_email: formData.confirm_email,
                    message: `Langue: ${activeLocale.toUpperCase()}\nTéléphone: ${formData.phone || "Non renseigné"}\nRéférence: ${formData.bookingRef || "Aucune"}\n\n${formData.message}`,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Erreur d'envoi");
            }

            setStatus("success");
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: t.subjects[0].value,
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

    const waText = encodeURIComponent(
        activeLocale === "en"
            ? "Hello ZwinCar, I need assistance with a car rental in Morocco"
            : activeLocale === "es"
            ? "Hola ZwinCar, necesito asistencia con un alquiler en Marruecos"
            : activeLocale === "nl"
            ? "Hallo ZwinCar, ik heb hulp nodig met autohuur in Marokko"
            : "Bonjour ZwinCar, je souhaite une assistance pour ma location"
    );

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col font-sans">
            <Header locale={activeLocale} />

            <main className="flex-1 pb-20">
                {/* Hero Header */}
                <section className="bg-[#12161E] text-white py-14 border-b border-slate-800">
                    <div className="container mx-auto px-4 max-w-5xl text-center">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4 border border-white/15">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <span>{t.badge}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 text-white">
                            {t.title}
                        </h1>
                        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            {t.subtitle}
                        </p>
                    </div>
                </section>

                <div className="container mx-auto px-4 max-w-5xl -mt-6">
                    <h2 className="sr-only">Canaux d&apos;assistance et réservation</h2>
                    {/* Quick Channel Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                        {/* WhatsApp VIP Card */}
                        <div className="rounded-2xl bg-white border border-[#E7DFD5] p-5 shadow-xs hover:shadow-md transition">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                                <MessageCircle size={22} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">{t.whatsappTitle}</h3>
                            <p className="text-xs text-slate-500 mb-3">{t.whatsappDesc}</p>
                            <a
                                href={`https://wa.me/212600000000?text=${waText}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                            >
                                <span>{t.whatsappCta}</span>
                                <span>→</span>
                            </a>
                        </div>

                        {/* Telephone & SOS */}
                        <div className="rounded-2xl bg-white border border-[#E7DFD5] p-5 shadow-xs hover:shadow-md transition">
                            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3">
                                <Phone size={22} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">{t.sosTitle}</h3>
                            <p className="text-xs text-slate-500 mb-3">{t.sosDesc}</p>
                            <button
                                type="button"
                                onClick={() => setSosModalOpen(true)}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer"
                            >
                                <span>{t.sosCta}</span>
                                <span>→</span>
                            </button>
                        </div>

                        {/* Booking Management */}
                        <div className="rounded-2xl bg-white border border-[#E7DFD5] p-5 shadow-xs hover:shadow-md transition">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C9572C] flex items-center justify-center mb-3">
                                <FileText size={22} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">{t.dossierTitle}</h3>
                            <p className="text-xs text-slate-500 mb-3">{t.dossierDesc}</p>
                            <Link
                                href="/booking/zw-78421"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9572C] hover:text-[#B24922]"
                            >
                                <span>{t.dossierCta}</span>
                                <span>→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Main Form & Hubs Info Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Contact Form */}
                        <div className="lg:col-span-7 bg-white rounded-3xl border border-[#ECE5D9] p-6 sm:p-8 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-2">{t.formTitle}</h2>
                            <p className="text-xs text-slate-500 mb-6">{t.formSubtitle}</p>

                            {status === "success" ? (
                                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 text-center space-y-3">
                                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <h3 className="text-base font-bold text-emerald-900">{t.successTitle}</h3>
                                    <p className="text-xs text-emerald-700 leading-relaxed max-w-sm mx-auto">
                                        {t.successDesc}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setStatus("idle")}
                                        className="text-xs font-bold text-emerald-800 underline underline-offset-2 pt-2"
                                    >
                                        {t.anotherBtn}
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
                                                {t.nameLabel}
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
                                                {t.emailLabel}
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
                                                {t.phoneLabel}
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
                                                {t.hubLabel}
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
                                                {t.subjectLabel}
                                            </label>
                                            <select
                                                value={formData.subject}
                                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                className="w-full h-11 px-3.5 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#C9572C]"
                                            >
                                                {t.subjects.map((s) => (
                                                    <option key={s.value} value={s.value}>
                                                        {s.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                                                {t.bookingRefLabel}
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
                                            {t.messageLabel}
                                        </label>
                                        <textarea
                                            required
                                            rows={4}
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder="..."
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
                                                <span>{t.sendingBtn}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={15} />
                                                <span>{t.sendBtn}</span>
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
                                    <span>{t.hubsTitle}</span>
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    {t.hubsDesc}
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
                                    <span>{t.faqTitle}</span>
                                </h3>
                                <div className="space-y-2.5 text-xs text-slate-600">
                                    {t.faqs.map((f, i) => (
                                        <div key={i} className={i > 0 ? "pt-2 border-t border-slate-100" : ""}>
                                            <strong className="text-slate-900 block mb-0.5">{f.q}</strong>
                                            <p className="text-[11px] text-slate-500">{f.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer locale={activeLocale} />

            <SosModal isOpen={sosModalOpen} onClose={() => setSosModalOpen(false)} />
        </div>
    );
}
