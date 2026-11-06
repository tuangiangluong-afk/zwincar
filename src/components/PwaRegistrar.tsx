"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "zwincar_pwa_dismissed_at";
const DISMISS_DAYS = 30;

function dismissedRecently(): boolean {
    try {
        const raw = localStorage.getItem(DISMISS_KEY);
        if (!raw) return false;
        const at = Number(raw);
        return Number.isFinite(at) && Date.now() - at < DISMISS_DAYS * 86_400_000;
    } catch {
        return false;
    }
}

/**
 * Enregistre le service worker et propose l'installation PWA **après** la
 * réservation (jamais à l'atterrissage, jamais en pop-up d'entrée).
 */
export default function PwaRegistrar() {
    const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
            navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => undefined);
        }

        const onBeforeInstall = (event: Event) => {
            event.preventDefault();
            setPromptEvent(event as BeforeInstallPromptEvent);
        };
        window.addEventListener("beforeinstallprompt", onBeforeInstall);

        // On n'affiche la proposition que sur le voucher : le client a une raison
        // concrète de garder l'app (billet + point de retrait hors ligne).
        const isVoucher = window.location.pathname.startsWith("/booking/");
        if (isVoucher && !dismissedRecently()) {
            const timer = setTimeout(() => setVisible(true), 2500);
            return () => {
                clearTimeout(timer);
                window.removeEventListener("beforeinstallprompt", onBeforeInstall);
            };
        }

        return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    }, []);

    const install = async () => {
        if (!promptEvent) return;
        await promptEvent.prompt();
        await promptEvent.userChoice;
        setVisible(false);
        setPromptEvent(null);
    };

    const dismiss = () => {
        try {
            localStorage.setItem(DISMISS_KEY, String(Date.now()));
        } catch {
            // ignore
        }
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-40 mx-auto max-w-md rounded-2xl border border-[#E7DFD5] bg-white p-4 shadow-xl">
            <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#12161E] text-white">
                    <span className="text-sm font-black">Z</span>
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900">Gardez votre voucher hors ligne</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Ajoutez ZwinCar à votre écran d&apos;accueil : billet, point de retrait et numéro
                        d&apos;urgence accessibles sans réseau.
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={install}
                            className="rounded-xl bg-[#C9572C] px-3.5 py-2 text-xs font-bold text-white"
                        >
                            Ajouter à l&apos;écran d&apos;accueil
                        </button>
                        <button
                            type="button"
                            onClick={dismiss}
                            className="rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-500"
                        >
                            Plus tard
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
