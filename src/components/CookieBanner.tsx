"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie, ShieldCheck } from "lucide-react";

interface CookieI18n {
    title: string;
    text: string;
    accept: string;
    reject: string;
    learnMore: string;
    policyUrl: string;
}

const COOKIE_TRANSLATIONS: Record<string, CookieI18n> = {
    fr: {
        title: "Respect de votre vie privée",
        text: "ZwinCar utilise des cookies techniques essentiels pour sécuriser votre réservation et analyser anonymement la navigation. Zéro revente de données ni pistage intrusif.",
        accept: "Tout accepter",
        reject: "Continuer sans accepter",
        learnMore: "En savoir plus",
        policyUrl: "/cgv",
    },
    en: {
        title: "Privacy & Cookie Preferences",
        text: "ZwinCar uses essential cookies to secure your car rental booking and measure anonymous traffic. No intrusive tracking or data reselling.",
        accept: "Accept all",
        reject: "Decline non-essential",
        learnMore: "Learn more",
        policyUrl: "/en/guides",
    },
    es: {
        title: "Privacidad y Cookies",
        text: "ZwinCar utiliza cookies esenciales para proteger su reserva de alquiler y analizar el tráfico de forma anónima. Sin rastreo publicitario intrusivo.",
        accept: "Aceptar todo",
        reject: "Rechazar no esenciales",
        learnMore: "Más información",
        policyUrl: "/es",
    },
    nl: {
        title: "Privacy & Cookies",
        text: "ZwinCar gebruikt essentiële cookies om uw autoverhuur te beveiligen en anonieme analyses uit te voeren. Geen opdringerige advertenties.",
        accept: "Alles accepteren",
        reject: "Weigeren",
        learnMore: "Meer informatie",
        policyUrl: "/nl",
    },
};

export default function CookieBanner() {
    const [mounted, setMounted] = useState(false);
    const [showBanner, setShowBanner] = useState(false);
    const pathname = usePathname() || "";

    // Détection de la langue depuis l'URL
    let lang = "fr";
    if (pathname.startsWith("/en")) lang = "en";
    else if (pathname.startsWith("/es")) lang = "es";
    else if (pathname.startsWith("/nl")) lang = "nl";

    const t = COOKIE_TRANSLATIONS[lang] || COOKIE_TRANSLATIONS.fr;

    useEffect(() => {
        setMounted(true);
        try {
            const consent = localStorage.getItem("zwincar-cookie-consent");
            if (!consent) {
                const timer = setTimeout(() => setShowBanner(true), 1200);
                return () => clearTimeout(timer);
            }
        } catch {
            // Environnement sans localStorage (ex: SSR / iframe restreint)
        }
    }, []);

    const handleAccept = () => {
        try {
            localStorage.setItem("zwincar-cookie-consent", "accepted");
        } catch {}
        setShowBanner(false);
    };

    const handleReject = () => {
        try {
            localStorage.setItem("zwincar-cookie-consent", "rejected");
        } catch {}
        setShowBanner(false);
    };

    if (!mounted || !showBanner) return null;

    return (
        <aside
            aria-label={t.title}
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md bg-white/95 backdrop-blur-md border border-[#E7DFD5] rounded-2xl p-5 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-4 duration-500 text-[#12161E]"
        >
            <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-[#C9572C]/10 text-[#C9572C] shrink-0 mt-0.5">
                    <Cookie className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                        <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                            {t.title}
                        </h3>
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                        {t.text}{" "}
                        <Link
                            href={t.policyUrl}
                            className="text-[#C9572C] font-semibold underline underline-offset-2 hover:text-[#B34922] transition-colors"
                        >
                            {t.learnMore}
                        </Link>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <button
                            type="button"
                            onClick={handleAccept}
                            className="w-full sm:flex-1 py-2 px-3.5 bg-[#C9572C] hover:bg-[#B34922] text-white font-bold rounded-xl text-xs transition-all shadow-xs active:scale-[0.98]"
                        >
                            {t.accept}
                        </button>
                        <button
                            type="button"
                            onClick={handleReject}
                            className="w-full sm:w-auto py-2 px-3.5 bg-[#FAF7F2] hover:bg-[#EAE4DC] text-slate-700 font-semibold rounded-xl text-xs transition-colors border border-[#E7DFD5]"
                        >
                            {t.reject}
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}
