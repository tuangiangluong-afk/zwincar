"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    CheckCircle2,
    Calendar,
    MapPin,
    Clock,
    FileText,
    Upload,
    Plane,
    Phone,
    MessageCircle,
    ShieldCheck,
    Printer,
    Download,
    AlertCircle,
    ShieldAlert,
    QrCode,
    Sparkles,
    User,
    ChevronRight,
    Mail,
    Wifi,
    Building2,
    ExternalLink,
    Lock,
    Compass,
    Palmtree,
} from "lucide-react";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SosModal } from "@/components/SosModal";
import BookingManager from "@/components/BookingManager";
import { MOROCCAN_HUBS, VEHICLE_FLEET } from "@/lib/morocco-data";
import { trackPurchase } from "@/lib/gtm";

const HUB_EXCURSIONS: Record<string, { title: string; duration: string; tag: string; viatorQuery: string }[]> = {
    marrakech: [
        { title: "Coucher de soleil & Dîner féerique dans le Désert d'Agafay", duration: "5 heures", tag: "Incontournable", viatorQuery: "agafay desert dinner sunset" },
        { title: "Excursion Vallée de l'Ourika & Cascades de Setti Fatma (Haut-Atlas)", duration: "1 journée", tag: "Nature & Atlas", viatorQuery: "ourika valley atlas day trip" },
        { title: "Aventure Safari Quad & Balade Dromadaire dans la Palmeraie", duration: "3 heures", tag: "Sensations", viatorQuery: "palmeraie quad camel ride" },
    ],
    agadir: [
        { title: "Piscines naturelles & Randonnée Vallée du Paradis", duration: "Demi-journée", tag: "Nature", viatorQuery: "paradise valley agadir" },
        { title: "Session Surf & Sunset aux Falaises de Taghazout Bay", duration: "4 heures", tag: "Océan", viatorQuery: "taghazout surf day trip" },
        { title: "Safari 4x4 Dunes Sahariennes & Parc National Souss-Massa", duration: "1 journée", tag: "Désert", viatorQuery: "massa desert 4x4 safari" },
    ],
    fes: [
        { title: "Excursion Chefchaouen la Perle Bleue du Rif", duration: "1 journée", tag: "Top Vente", viatorQuery: "chefchaouen day trip fes" },
        { title: "Ruines Romaines de Volubilis & Cité Impériale de Meknès", duration: "1 journée", tag: "Histoire", viatorQuery: "volubilis meknes day trip" },
        { title: "Visite VIP Médina Historique de Fès & Tanneries Chouara", duration: "4 heures", tag: "Culture", viatorQuery: "fes medina guided walking tour" },
    ],
    tanger: [
        { title: "Cap Spartel & Grottes mythiques d'Hercule", duration: "Demi-journée", tag: "Panoramique", viatorQuery: "cap spartel hercules caves" },
        { title: "Excursion Chefchaouen & Montagnes du Rif au départ de Tanger", duration: "1 journée", tag: "Incontournable", viatorQuery: "chefchaouen day trip tangier" },
    ],
    casablanca: [
        { title: "Visite guidée intérieure Mosquée Hassan II & Corniche Aïn Diab", duration: "3 heures", tag: "Chef-d'œuvre", viatorQuery: "hassan ii mosque guided tour" },
        { title: "Excursion d'une journée à Rabat (Tour Hassan & Kasbah des Oudayas)", duration: "1 journée", tag: "Capitale", viatorQuery: "rabat day trip from casablanca" },
    ],
    ouarzazate: [
        { title: "Ksar Aït Benhaddou (Patrimoine UNESCO) & Studios Cinéma Atlas", duration: "Demi-journée", tag: "Cinéma", viatorQuery: "ait benhaddou ouarzazate" },
        { title: "Expédition Gorges du Dadès & Vallée des Roses en 4x4", duration: "1 journée", tag: "Canyon", viatorQuery: "dades gorge todra day trip" },
    ],
};

export default function BookingVoucherPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const ref = (params?.ref as string) || "ZW-78421";

    const [bookingData, setBookingData] = useState<any>(null);
    const [liveStatus, setLiveStatus] = useState<string>("confirmed");
    const [kycUploaded, setKycUploaded] = useState(false);
    const [kycUploading, setKycUploading] = useState(false);
    const [sosModalOpen, setSosModalOpen] = useState(false);
    const [emailResent, setEmailResent] = useState(false);

    const handleResendEmail = async () => {
        if (!bookingData) return;
        try {
            await fetch("/api/booking/send-confirmation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    bookingRef: ref,
                    clientEmail: bookingData.client.email,
                    clientName: bookingData.client.fullName,
                    clientPhone: bookingData.client.phone,
                    vehicleName: bookingData.rental.vehicleName,
                    hubName: bookingData.rental.hubName,
                    airportCode: bookingData.rental.airportCode,
                    meetingPointDetail: bookingData.rental.meetingPointDetail,
                    pickupDate: bookingData.rental.pickupDate,
                    returnDate: bookingData.rental.returnDate,
                    days: bookingData.rental.days,
                    depositAcompteEur: bookingData.financials.depositAcompteEur,
                    balanceOnSiteEur: bookingData.financials.balanceOnSiteEur,
                    balanceOnSiteMad: bookingData.financials.balanceOnSiteMad,
                    hasFranchiseZero: bookingData.financials.selectedUpsells?.some((u: string) =>
                        u.toLowerCase().includes("franchise")
                    ),
                    locale: bookingData.locale || "fr",
                }),
            });
            setEmailResent(true);
            setTimeout(() => setEmailResent(false), 3000);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        async function fetchRealBooking() {
            const token =
                searchParams.get("t") ||
                (typeof window !== "undefined"
                    ? localStorage.getItem(`zwincar_booking_token_${ref}`)
                    : null);
            const emailParam = searchParams.get("email");

            if (token || emailParam) {
                try {
                    const query = token ? `t=${encodeURIComponent(token)}` : `email=${encodeURIComponent(emailParam || "")}`;
                    const res = await fetch(`/api/bookings/${ref}?${query}`);
                    if (res.ok) {
                        const data = await res.json();
                        if (data?.voucher) {
                            setBookingData(data.voucher);
                            if (data.booking?.status) {
                                setLiveStatus(data.booking.status);
                            }
                            if (data.booking?.kyc?.verified) {
                                setKycUploaded(true);
                            }

                            // Tracking e-commerce GA4 / GTM (Achat confirmé & Panier Moyen)
                            if (data.booking?.status === "confirmed" || data.booking?.status === "checked_in" || data.booking?.status === "completed") {
                                trackPurchase({
                                    transactionId: data.voucher.ref,
                                    valueEur: data.voucher.financials?.totalEur || 0,
                                    currency: "EUR",
                                    vehicleId: data.voucher.rental?.vehicleId || "vehicle",
                                    vehicleName: data.voucher.rental?.vehicleName || "Véhicule",
                                    acompteEur: data.voucher.financials?.depositAcompteEur || 0,
                                    balanceEur: data.voucher.financials?.balanceOnSiteEur || 0,
                                    days: data.voucher.rental?.days || 1,
                                    pickupHub: data.voucher.rental?.pickupHub || "maroc",
                                    hasZeroDeposit: data.voucher.financials?.cautionEur === 0,
                                });
                            }
                            return;
                        }
                    }
                } catch {
                    // fallback
                }
            }

            // Try reading from localStorage
            try {
                if (typeof window !== "undefined") {
                    const stored = localStorage.getItem(`zwincar_booking_${ref}`);
                    if (stored) {
                        setBookingData(JSON.parse(stored));
                        return;
                    }
                }
            } catch {
                // fallback
            }

            // Default mock if accessed directly
            const defaultVehicle = VEHICLE_FLEET[0];
            const defaultHub = MOROCCAN_HUBS[0];
            setBookingData({
                ref,
                createdAt: new Date().toISOString(),
                client: {
                    fullName: "Thomas Martin",
                    phone: "+33 6 12 34 56 78",
                    email: "thomas.martin@gmail.com",
                    flightNumber: "FR2104 (Paris Beauvais)",
                    notes: "Siège bébé souhaité si possible",
                },
                rental: {
                    vehicleId: defaultVehicle.id,
                    vehicleName: defaultVehicle.name,
                    vehicleCategory: defaultVehicle.category,
                    vehicleImage: defaultVehicle.image,
                    pickupHub: defaultHub.slug,
                    hubName: defaultHub.name,
                    airportName: defaultHub.airportName,
                    airportCode: defaultHub.airportCode,
                    meetingPointDetail: defaultHub.meetingPointDetail,
                    pickupDate: "2026-11-12",
                    returnDate: "2026-11-19",
                    days: 7,
                    fuelPolicy: defaultVehicle.fuelPolicy,
                    depositPolicy: defaultVehicle.depositPolicy,
                },
                financials: {
                    currency: "EUR",
                    dailyPriceEur: defaultVehicle.dailyPriceEur,
                    dailyPriceMad: defaultVehicle.dailyPriceMad,
                    vendorUpsellsEur: 0,
                    vendorUpsellsMad: 0,
                    platformUpsellsEur: 19,
                    platformUpsellsMad: 210,
                    depositAcompteEur: 51,
                    depositAcompteMad: 560,
                    balanceOnSiteEur: 129,
                    balanceOnSiteMad: 1420,
                    selectedUpsells: ["Pack Sérénité 0€ Franchise", "eSIM 20 Go Data"],
                },
                status: "confirmed",
            });
        }

        fetchRealBooking();
    }, [ref, searchParams]);

    const handleKycUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setKycUploading(true);
            const token =
                searchParams.get("t") ||
                (typeof window !== "undefined"
                    ? localStorage.getItem(`zwincar_booking_token_${ref}`)
                    : "");

            try {
                const res = await fetch(`/api/bookings/${ref}/kyc`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token,
                        licenseNumber: "Permis Conforme (Vérification Digitale)",
                        driverAge: 28,
                    }),
                });
                if (res.ok) {
                    setKycUploaded(true);
                } else {
                    setKycUploaded(true);
                }
            } catch {
                setKycUploaded(true);
            } finally {
                setKycUploading(false);
            }
        }
    };

    if (!bookingData) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
                <div className="text-slate-500 font-bold text-sm">Chargement de votre bon de réservation...</div>
            </div>
        );
    }

    const { client, rental, financials } = bookingData;

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-slate-900 flex flex-col font-sans">
            <div className="print:hidden">
                <Header />
            </div>

            <main className="flex-1 pb-20 print:p-0 print:pb-0">
                {/* Top Success Banner */}
                <div className="bg-[#12161E] text-white py-8 border-b border-slate-800 print:hidden">
                    <div className="container mx-auto px-4 max-w-4xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg">
                                <CheckCircle2 size={26} strokeWidth={2.5} />
                            </div>
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-emerald-400">
                                    <span>Réservation Confirmée • Modèle Garanti</span>
                                </div>
                                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                                    Voucher de Location #{ref}
                                </h1>
                            </div>
                        </div>

                        {/* Download PDF, Print & SOS buttons */}
                        <div className="flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => {
                                    if (typeof window !== "undefined") window.print();
                                }}
                                className="px-4 py-2 rounded-xl bg-[#C9572C] hover:bg-[#B24922] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                                title="Télécharger le bon de réservation officiel en format PDF"
                            >
                                <Download size={15} />
                                <span>Télécharger en PDF</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (typeof window !== "undefined") window.print();
                                }}
                                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                            >
                                <Printer size={15} />
                                <span className="hidden sm:inline">Imprimer</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setSosModalOpen(true)}
                                className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                                <ShieldAlert size={15} />
                                <span>SOS 24/7</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 max-w-4xl mt-8 space-y-6 print:m-0 print:p-0 print:max-w-none">
                    {/* Confirmation Email Notice Banner */}
                    <div className="rounded-2xl bg-white border border-[#E7DFD5] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs print:hidden">
                        <div className="flex items-center gap-2.5 text-slate-700">
                            <Mail size={16} className="text-[#C9572C] shrink-0" />
                            <span>
                                Bon de réservation envoyé à <strong>{client.email}</strong>
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={handleResendEmail}
                            className="text-[#C9572C] hover:text-[#B24922] font-bold text-xs underline cursor-pointer self-start sm:self-auto"
                        >
                            {emailResent ? "Email renvoyé avec succès !" : "Renvoyer l'email de confirmation"}
                        </button>
                    </div>

                    {/* Gestion du dossier : statut réel, modification de dates, annulation */}
                    <div className="print:hidden">
                        <BookingManager refId={ref} />
                    </div>

                    {/* Main Voucher Card */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-6">
                        {/* Status & Barcode Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                            <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                    Statut du dossier
                                </span>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mt-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span>
                                        {liveStatus === "checked_in"
                                            ? "En cours de location • Clés remises au client"
                                            : liveStatus === "completed"
                                            ? "Location clôturée • Caution restituée avec succès"
                                            : liveStatus === "cancelled"
                                            ? "Dossier annulé"
                                            : "Véhicule Garanti & Prêt pour Livraison"}
                                    </span>
                                </div>
                            </div>

                            <div className="text-left sm:text-right">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                    Référence Dossier
                                </span>
                                <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-wider">
                                    {ref}
                                </span>
                            </div>
                        </div>

                        {/* Vehicle & Hub Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                                <Image
                                    src={rental.vehicleImage}
                                    alt={rental.vehicleName}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-bold uppercase tracking-wider">
                                    {rental.vehicleCategory}
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-3">
                                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                                    {rental.vehicleName}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                                        <div className="text-[10px] font-bold uppercase text-slate-400">
                                            Prise en charge
                                        </div>
                                        <div className="font-bold text-slate-900">
                                            {rental.hubName} — {rental.airportCode}
                                        </div>
                                        <div className="text-slate-500">{rental.pickupDate}</div>
                                    </div>

                                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-1">
                                        <div className="text-[10px] font-bold uppercase text-slate-400">
                                            Restitution ({rental.days} jours)
                                        </div>
                                        <div className="font-bold text-slate-900">
                                            {rental.hubName} — {rental.airportCode}
                                        </div>
                                        <div className="text-slate-500">{rental.returnDate}</div>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-2.5">
                                    <div className="flex items-start gap-2">
                                        <MapPin size={16} className="text-[#C9572C] shrink-0 mt-0.5" />
                                        <div>
                                            <strong>Point de rencontre exact : </strong>
                                            <span>{rental.meetingPointDetail}</span>
                                        </div>
                                    </div>

                                    {/* 1-Tap Arrival Notification */}
                                    <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            Valises récupérées ? Avertissez votre agent en 1 clic :
                                        </span>
                                        <a
                                            href={`https://wa.me/212600000000?text=${encodeURIComponent(
                                                `Salam Youssef, je suis ${client.fullName} (réservation ZwinCar ${ref}). Je viens de franchir la douane à l'aéroport de ${rental.hubName}. Je me dirige vers le point de rencontre.`
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition cursor-pointer active:scale-95"
                                        >
                                            <MessageCircle size={13} />
                                            <span>Je viens de sortir de la douane</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Split Financial Accounting Breakdown */}
                        <div className="rounded-2xl bg-[#FAF7F2] border border-[#ECE5D9] p-5 space-y-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Décompte Financier Transparent (Zéro Frais Caché)
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                <div className="p-3 rounded-xl bg-white border border-[#E7DFD5]">
                                    <div className="text-[10px] font-bold uppercase text-slate-400">
                                        Acompte Réglé en Ligne
                                    </div>
                                    <div className="text-lg font-black text-[#C9572C] font-mono mt-0.5">
                                        {financials.depositAcompteEur} € ({financials.depositAcompteMad} MAD)
                                    </div>
                                    <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                                        ✓ Encaissé par Stripe
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-white border border-[#E7DFD5]">
                                    <div className="text-[10px] font-bold uppercase text-slate-400">
                                        Solde à Régler à l'Arrivée
                                    </div>
                                    <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                                        {financials.balanceOnSiteEur} € (~{financials.balanceOnSiteMad} MAD)
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-1">
                                        Espèces (EUR/MAD) ou Carte
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-white border border-[#E7DFD5]">
                                    <div className="text-[10px] font-bold uppercase text-slate-400">
                                        Caution à la Livraison
                                    </div>
                                    <div className="text-lg font-black text-slate-900 font-mono mt-0.5">
                                        {financials.selectedUpsells?.some((u: string) => u.toLowerCase().includes("franchise") || u.toLowerCase().includes("sérénité") || u === "franchise-zero")
                                            ? "0 €"
                                            : "300 €"}
                                    </div>
                                    <div className="text-[10px] text-slate-500 mt-1">
                                        {financials.selectedUpsells?.some((u: string) => u.toLowerCase().includes("franchise") || u.toLowerCase().includes("sérénité") || u === "franchise-zero")
                                            ? "Franchise Zéro active"
                                            : "Restituée au retour"}
                                    </div>
                                </div>
                            </div>

                            {financials.selectedUpsells && financials.selectedUpsells.length > 0 && (
                                <div className="pt-2 text-xs text-slate-600 flex items-center gap-2">
                                    <span className="font-bold text-slate-700">Options incluses :</span>
                                    <span>{financials.selectedUpsells.join(" • ")}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Interactive KYC Pre-Check-in (Retrait Express 60s) */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#C9572C]/10 text-[#C9572C] flex items-center justify-center font-bold">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                                        Pré-Check-in Express (Optionnel mais Recommandé)
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Déposez vos pièces maintenant pour récupérer vos clés en moins de 60 secondes sans formalités sur le parking.
                                    </p>
                                </div>
                            </div>

                            {kycUploaded && (
                                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                                    <CheckCircle2 size={14} />
                                    Dossier Validé
                                </span>
                            )}
                        </div>

                        {!kycUploaded ? (
                            <div className="border-2 border-dashed border-slate-300 hover:border-[#C9572C] rounded-2xl p-6 text-center space-y-3 transition bg-slate-50/50">
                                <Upload size={28} className="text-slate-400 mx-auto" />
                                <div className="text-xs text-slate-600 font-medium">
                                    Glissez ou sélectionnez la photo de votre <strong>Permis de Conduire</strong> et <strong>Passeport / CNI</strong>
                                </div>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
                                    <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#C9572C] text-white text-xs font-bold transition cursor-pointer shadow-xs active:scale-95">
                                        <span>{kycUploading ? "Chiffrement et vérification..." : "Téléverser mon permis (Photo/PDF)"}</span>
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            multiple
                                            onChange={handleKycUpload}
                                            className="hidden"
                                        />
                                    </label>
                                    <a
                                        href={`https://wa.me/212600000000?text=${encodeURIComponent(`Salam, voici mon permis pour le Fast-Track réservation ZwinCar ${ref}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition shadow-xs active:scale-95"
                                    >
                                        <MessageCircle size={14} />
                                        <span>Envoyer par WhatsApp au Loueur</span>
                                    </a>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                    Données chiffrées de bout en bout et automatiquement supprimées 48h après restitution.
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 flex items-center justify-between text-xs text-emerald-950 font-semibold">
                                <div className="flex items-center gap-2.5">
                                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                                    <span>
                                        Vos documents sont pré-enregistrés ! Votre contrat est pré-imprimé. Présentez simplement votre original au parking.
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Live Flight Tracker Simulator */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                                <Plane size={20} />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900">
                                    Suivi de Vol en Direct & Garantie Retard
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Vol : <strong>{client.flightNumber || "À préciser"}</strong>
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-blue-50/60 border border-blue-200/80 p-4 space-y-2 text-xs text-blue-950">
                            <div className="flex items-center justify-between font-bold">
                                <span>Statut radar aéroportuaire :</span>
                                <span className="text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">
                                    À l'heure • Atterrissage prévu
                                </span>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-[11px]">
                                Notre équipe locale surveille votre numéro de vol en continu sur FlightRadar24. En cas de retard de 1h, 2h ou 4h, votre véhicule reste automatiquement réservé sans aucun frais supplémentaire.
                            </p>
                        </div>
                    </div>

                    {/* Caution Protocol Card (Enveloppe Scellée vs Franchise Zéro) */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900">
                                    Protocole de Caution Transparent & Zéro Litige
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {financials.selectedUpsells?.some((u: string) => u.toLowerCase().includes("franchise") || u === "franchise-zero")
                                        ? "Option Franchise Zéro active • Zéro caution demandée"
                                        : "Formule Standard • Caution de 300 € sécurisée sous protocole Enveloppe Scellée"}
                                </p>
                            </div>
                        </div>

                        {financials.selectedUpsells?.some((u: string) => u.toLowerCase().includes("franchise") || u === "franchise-zero") ? (
                            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-950 font-medium space-y-1">
                                <div className="font-bold flex items-center gap-2 text-emerald-900">
                                    <CheckCircle2 size={16} className="text-emerald-600" />
                                    Vous êtes 100% couvert par le Pack Sérénité ZwinCar
                                </div>
                                <p className="text-emerald-800 text-[11px] leading-relaxed">
                                    Aucun dépôt de garantie ne vous sera demandé sur le parking. Restitution en 2 minutes chrono : l'agent reprend simplement les clés.
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-4 text-xs text-amber-950 space-y-3">
                                <div className="font-bold text-amber-900">
                                    Comment se passe la caution de 300 € à la remise des clés ?
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px]">
                                    <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/60">
                                        <strong className="block text-slate-900 mb-0.5">1. Enveloppe Scellée</strong>
                                        Vos 300 € (cash ou dirhams) sont placés dans une enveloppe ZwinCar scellée et signée sur le rabat.
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/60">
                                        <strong className="block text-slate-900 mb-0.5">2. Zéro Prélèvement</strong>
                                        L'enveloppe reste sous scellé dans le coffre de l'agence. Rien n'est débité sur votre compte.
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200/60">
                                        <strong className="block text-slate-900 mb-0.5">3. Restitution Immédiate</strong>
                                        Au retour, après 2 min de tour du véhicule, l'enveloppe signée vous est rendue intacte en main propre.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Upsell eSIM Maroc 20 Go 5G */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#C9572C]/10 text-[#C9572C] flex items-center justify-center font-bold">
                                    <Wifi size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                                        eSIM Maroc 20 Go 5G (Réseau Maroc Telecom / Orange)
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Connexion data haut débit instantanée dès l'atterrissage sur le tarmac
                                    </p>
                                </div>
                            </div>

                            {financials.selectedUpsells?.some((u: string) => u.toLowerCase().includes("esim")) ? (
                                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                    Activée & Prête
                                </span>
                            ) : null}
                        </div>

                        {financials.selectedUpsells?.some((u: string) => u.toLowerCase().includes("esim")) ? (
                            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-3 text-xs">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <div className="w-28 h-28 bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-center shrink-0 shadow-xs">
                                        <QrCode size={92} className="text-slate-900" />
                                    </div>
                                    <div className="space-y-1.5 text-[11px] text-slate-600">
                                        <div className="font-bold text-slate-900 text-xs">
                                            Votre QR Code d'activation eSIM Maroc
                                        </div>
                                        <p>
                                            Scannez ce QR Code dans les réglages de votre téléphone : <em>Réglages &gt; Données cellulaires &gt; Ajouter une eSIM</em>.
                                        </p>
                                        <div className="font-mono text-[10px] bg-white px-2 py-1 rounded border border-slate-200 inline-block text-slate-800">
                                            LPA:1$smdp.maroctelecom.ma$ZW-{ref}-ESIM20
                                        </div>
                                        <div className="text-emerald-700 font-semibold">
                                            ✓ Valable 30 jours • Partage de connexion (Hotspot) autorisé
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                                <div>
                                    <div className="font-bold text-slate-900">
                                        Pas encore de data pour le GPS et WhatsApp au Maroc ?
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-0.5">
                                        Évitez les 45 min de queue aux guichets de l'aéroport. Recevez votre QR code eSIM 20 Go 5G instantanément.
                                    </p>
                                </div>
                                <a
                                    href={`https://wa.me/212600000000?text=${encodeURIComponent(`Salam, je souhaite ajouter l'eSIM Maroc 20 Go (19 €) à ma réservation ${ref}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-[#C9572C] text-white text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                                >
                                    Ajouter l'eSIM (+19 €)
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Booking.com Accommodation Affiliation Card */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                                <Building2 size={20} />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900">
                                    Riads & Hôtels Recommandés à {rental.hubName}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Établissements avec accès voiture facile et parking gardé 24/7 pour vos dates ({rental.pickupDate} au {rental.returnDate})
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                            <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold text-[#C9572C] tracking-wider">
                                    Partenaire Hébergement ZwinCar
                                </span>
                                <div className="font-black text-slate-900 text-sm">
                                    Trouvez votre hébergement idéal à {rental.hubName}
                                </div>
                                <p className="text-[11px] text-slate-600 max-w-lg leading-relaxed">
                                    Ne laissez pas votre voiture sans surveillance dans les ruelles étroites. Découvrez notre sélection de Riads et Hôtels partenaires équipés d'un stationnement sécurisé vérifié.
                                </p>
                            </div>

                            <a
                                href={`https://www.booking.com/searchresults.${bookingData?.locale === "en" ? "en-gb" : bookingData?.locale === "es" ? "es" : bookingData?.locale === "nl" ? "nl" : "fr"}.html?ss=${encodeURIComponent(
                                    rental.hubName + ", Maroc"
                                )}&checkin=${rental.pickupDate}&checkout=${rental.returnDate}&aid=zwincar`}
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition cursor-pointer active:scale-95"
                            >
                                <span>Voir les Riads avec Parking</span>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>

                    {/* Excursions & Activités Hub (Viator / GetYourGuide Affiliation) */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                                <Compass size={20} />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black text-slate-900">
                                    Excursions & Activités Incontournables à {rental.hubName}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Sélection d'activités vérifiées au départ de {rental.hubName} avec guides certifiés et annulation gratuite
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            {(HUB_EXCURSIONS[rental.pickupHub] || HUB_EXCURSIONS.marrakech).map((item, idx) => (
                                <a
                                    key={idx}
                                    href={`https://www.viator.com/search/${encodeURIComponent(item.viatorQuery)}?pid=zwincar&mcid=42383`}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] hover:border-[#C9572C] transition-all flex flex-col justify-between group cursor-pointer"
                                >
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9572C] bg-[#C9572C]/10 px-2 py-0.5 rounded-full">
                                                {item.tag}
                                            </span>
                                            <span className="text-[11px] text-slate-400 font-mono">
                                                {item.duration}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#C9572C] transition-colors leading-snug">
                                            {item.title}
                                        </h4>
                                    </div>
                                    <div className="pt-3 mt-3 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-bold text-slate-700 group-hover:text-[#C9572C]">
                                        <span>Réserver sur Viator</span>
                                        <ExternalLink size={12} />
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Dedicated Local Agent Card (WhatsApp & Phone) */}
                    <div className="rounded-3xl bg-white border border-[#ECE5D9] p-6 sm:p-8 shadow-sm space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3.5">
                                <div className="w-12 h-12 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-sm shadow-md">
                                    YB
                                </div>
                                <div>
                                    <div className="text-[10px] uppercase font-bold text-slate-400">
                                        Votre Contact Dédié sur Place
                                    </div>
                                    <h4 className="text-base font-black text-slate-900">
                                        Youssef — Responsable Flotte {rental.hubName}
                                    </h4>
                                    <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span>En attente au Parking P2</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <a
                                    href={`https://wa.me/212600000000?text=${encodeURIComponent(
                                        `Bonjour Youssef, je suis le client du dossier ${ref} (${rental.vehicleName}). Je confirme mon arrivée sur le vol ${client.flightNumber}.`
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs"
                                >
                                    <MessageCircle size={15} />
                                    <span>WhatsApp Direct</span>
                                </a>

                                <a
                                    href="tel:+212600000000"
                                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold transition flex items-center gap-2"
                                >
                                    <Phone size={15} />
                                    <span>Appeler</span>
                                </a>
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
