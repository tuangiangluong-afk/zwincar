"use client";

import { Suspense, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

const COPY = {
    fr: { title: "Comment s'est passée votre location ?", comment: "Votre avis (facultatif)", send: "Publier mon avis", thanks: "Merci ! Votre avis vérifié est publié.", stars: "étoiles" },
    en: { title: "How was your rental?", comment: "Your review (optional)", send: "Publish my review", thanks: "Thank you! Your verified review is live.", stars: "stars" },
    es: { title: "¿Qué tal su alquiler?", comment: "Su opinión (opcional)", send: "Publicar mi opinión", thanks: "¡Gracias! Su opinión verificada está publicada.", stars: "estrellas" },
    nl: { title: "Hoe was uw huur?", comment: "Uw review (optioneel)", send: "Review plaatsen", thanks: "Bedankt! Uw geverifieerde review staat online.", stars: "sterren" },
};
type Lang = keyof typeof COPY;

function ReviewForm() {
    const { ref } = useParams<{ ref: string }>();
    const searchParams = useSearchParams();
    const token = searchParams.get("t") ?? "";
    const lang = ((searchParams.get("lang") ?? (typeof navigator !== "undefined" ? navigator.language : "fr")).slice(0, 2) as Lang);
    const t = COPY[lang] ?? COPY.fr;

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [state, setState] = useState<"idle" | "sending" | "done">("idle");
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setState("sending");
        setError(null);
        try {
            const res = await fetch(`/api/bookings/${encodeURIComponent(ref)}/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, rating, comment }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data?.error ?? "Erreur");
            setState("done");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erreur");
            setState("idle");
        }
    };

    if (state === "done") {
        return <p className="text-lg font-bold text-emerald-700">{t.thanks}</p>;
    }

    return (
        <form onSubmit={submit} className="space-y-5">
            <h1 className="text-2xl font-black text-slate-900">{t.title}</h1>
            <fieldset className="flex gap-2" aria-label={t.stars}>
                {[1, 2, 3, 4, 5].map((n) => (
                    <button
                        key={n}
                        type="button"
                        aria-label={`${n} ${t.stars}`}
                        aria-pressed={rating === n}
                        onClick={() => setRating(n)}
                        className={`text-4xl leading-none ${n <= rating ? "text-amber-500" : "text-slate-300"}`}
                    >
                        ★
                    </button>
                ))}
            </fieldset>
            <label className="block text-sm font-semibold text-slate-700">
                {t.comment}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    maxLength={1000}
                    rows={4}
                    className="mt-1 w-full rounded-2xl border border-[#E7DFD5] p-3 text-sm"
                />
            </label>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
            <button
                type="submit"
                disabled={rating === 0 || state === "sending"}
                className="w-full h-12 rounded-2xl bg-[#C9572C] text-white font-black disabled:opacity-50"
            >
                {t.send}
            </button>
        </form>
    );
}

export default function ReviewPage() {
    return (
        <main className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-3xl bg-white border border-[#E7DFD5] p-6 shadow-xl">
                <Suspense>
                    <ReviewForm />
                </Suspense>
            </div>
        </main>
    );
}
