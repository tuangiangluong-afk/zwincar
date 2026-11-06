"use client";

import { useCallback, useEffect, useState } from "react";
import { Calendar, AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react";

interface BookingManagerProps {
    refId: string;
}

interface ServerBooking {
    status: string;
    rental: {
        pickupDate: string;
        pickupTime: string;
        returnDate: string;
        returnTime: string;
        days: number;
    };
    quote: { totalEur: number; totalMad: number; acompteEur: number; balanceEur: number; depositEur: number };
    paidEur: number;
}

const HALF_HOUR_SLOTS = [
    "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30",
    "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00", "07:30",
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30",
];

const STATUS_LABEL: Record<string, string> = {
    awaiting_payment: "En attente de paiement",
    confirmed: "Confirmée",
    checked_in: "Véhicule remis",
    checked_out: "Restituée",
    completed: "Terminée",
    cancelled: "Annulée",
    no_show: "Non présentée",
    expired: "Expirée",
};

function readToken(refId: string): string | null {
    if (typeof window === "undefined") return null;
    try {
        const fromUrl = new URLSearchParams(window.location.search).get("t");
        if (fromUrl) {
            localStorage.setItem(`zwincar_booking_token_${refId}`, fromUrl);
            return fromUrl;
        }
        return localStorage.getItem(`zwincar_booking_token_${refId}`);
    } catch {
        return null;
    }
}

export default function BookingManager({ refId }: BookingManagerProps) {
    const [token, setToken] = useState<string | null>(null);
    const [booking, setBooking] = useState<ServerBooking | null>(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState<"cancel" | "modify" | null>(null);
    const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
    const [open, setOpen] = useState(false);

    const [pickupDate, setPickupDate] = useState("");
    const [pickupTime, setPickupTime] = useState("10:00");
    const [returnDate, setReturnDate] = useState("");
    const [returnTime, setReturnTime] = useState("10:00");

    const load = useCallback(async () => {
        const currentToken = readToken(refId);
        setToken(currentToken);
        if (!currentToken) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/bookings/${refId}?t=${encodeURIComponent(currentToken)}`, {
                cache: "no-store",
            });
            if (!response.ok) {
                setLoading(false);
                return;
            }
            const data = await response.json();
            setBooking(data.booking);
            setPickupDate(data.booking.rental.pickupDate);
            setPickupTime(data.booking.rental.pickupTime);
            setReturnDate(data.booking.rental.returnDate);
            setReturnTime(data.booking.rental.returnTime);
        } catch {
            // hors ligne : le voucher en cache reste lisible
        } finally {
            setLoading(false);
        }
    }, [refId]);

    useEffect(() => {
        void load();
    }, [load]);

    if (loading) {
        return (
            <div className="rounded-3xl border border-[#ECE5D9] bg-white p-5 text-xs text-slate-500">
                <Loader2 size={14} className="mr-2 inline animate-spin" />
                Vérification du dossier...
            </div>
        );
    }

    if (!token || !booking) return null;

    const canCancel = booking.status === "confirmed" || booking.status === "awaiting_payment";

    const cancel = async () => {
        if (!canCancel) return;
        if (typeof window !== "undefined" && !window.confirm("Confirmer l'annulation de cette réservation ?")) return;

        setBusy("cancel");
        setMessage(null);
        try {
            const response = await fetch(`/api/bookings/${refId}/cancel`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });
            const data = await response.json();
            if (!response.ok) {
                setMessage({ kind: "error", text: data?.error ?? "Annulation impossible." });
            } else {
                setMessage({
                    kind: "ok",
                    text: `Réservation annulée. Remboursement : ${data.refundEur} €${
                        data.creditNoteEur && data.refundEur === 0 ? ` (avoir de ${data.creditNoteEur} €)` : ""
                    }.`,
                });
                await load();
            }
        } catch {
            setMessage({ kind: "error", text: "Connexion interrompue." });
        } finally {
            setBusy(null);
        }
    };

    const modify = async () => {
        setBusy("modify");
        setMessage(null);
        try {
            const response = await fetch(`/api/bookings/${refId}/modify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, pickupDate, pickupTime, returnDate, returnTime }),
            });
            const data = await response.json();
            if (!response.ok) {
                setMessage({ kind: "error", text: data?.error ?? "Modification impossible." });
            } else {
                setMessage({
                    kind: "ok",
                    text: `${data.message} ${
                        data.amountToPayNowEur > 0 ? `Complément à régler : ${data.amountToPayNowEur} €.` : ""
                    } Nouveau solde au comptoir : ${data.newBalanceEur} €.`,
                });
                setOpen(false);
                await load();
            }
        } catch {
            setMessage({ kind: "error", text: "Connexion interrompue." });
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className="rounded-3xl border border-[#ECE5D9] bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Statut du dossier</div>
                    <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-800">
                        {booking.status === "cancelled" ? (
                            <XCircle size={14} className="text-red-500" />
                        ) : (
                            <CheckCircle2 size={14} className="text-emerald-600" />
                        )}
                        {STATUS_LABEL[booking.status] ?? booking.status}
                    </div>
                </div>

                <div className="text-right text-xs text-slate-500">
                    <div>Acompte réglé : <strong className="text-slate-900">{booking.paidEur} €</strong></div>
                    <div>Solde au comptoir : <strong className="text-slate-900">{booking.quote.balanceEur} €</strong></div>
                </div>
            </div>

            {message && (
                <div
                    className={`mt-4 flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold ${
                        message.kind === "ok"
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                            : "border border-red-200 bg-red-50 text-red-700"
                    }`}
                >
                    {message.kind === "ok" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                    <span>{message.text}</span>
                </div>
            )}

            {canCancel && (
                <div className="mt-5 flex flex-wrap gap-2.5">
                    <button
                        type="button"
                        onClick={() => setOpen((value) => !value)}
                        className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-xs font-bold text-white"
                    >
                        <Calendar size={14} />
                        Modifier mes dates
                    </button>
                    <button
                        type="button"
                        onClick={cancel}
                        disabled={busy === "cancel"}
                        className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-700 disabled:opacity-50"
                    >
                        {busy === "cancel" ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
                        Annuler la réservation
                    </button>
                </div>
            )}

            {open && canCancel && (
                <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-[#E7DFD5] bg-[#FAF7F2] p-4 sm:grid-cols-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Nouvelle prise en charge
                        <input
                            type="date"
                            value={pickupDate}
                            onChange={(event) => setPickupDate(event.target.value)}
                            className="mt-1 block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900"
                        />
                    </label>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Heure
                        <select
                            value={pickupTime}
                            onChange={(event) => setPickupTime(event.target.value)}
                            className="mt-1 block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900"
                        >
                            {HALF_HOUR_SLOTS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </label>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Nouvelle restitution
                        <input
                            type="date"
                            value={returnDate}
                            onChange={(event) => setReturnDate(event.target.value)}
                            className="mt-1 block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900"
                        />
                    </label>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        Heure
                        <select
                            value={returnTime}
                            onChange={(event) => setReturnTime(event.target.value)}
                            className="mt-1 block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900"
                        >
                            {HALF_HOUR_SLOTS.map((t) => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </label>
                    <div className="sm:col-span-2 flex items-center justify-between gap-3">
                        <p className="text-[11px] text-slate-500">
                            Gratuit jusqu&apos;à 48h avant le départ, puis 25 € de frais de dossier.
                        </p>
                        <button
                            type="button"
                            onClick={modify}
                            disabled={busy === "modify"}
                            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#C9572C] px-4 text-xs font-bold text-white disabled:opacity-50"
                        >
                            {busy === "modify" && <Loader2 size={14} className="animate-spin" />}
                            Enregistrer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
