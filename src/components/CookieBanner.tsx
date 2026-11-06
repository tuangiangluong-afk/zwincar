"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cookie } from 'lucide-react';
import { getTheme } from "@/lib/theme"; // Deterministic theme based on slug

interface CookieBannerProps {
    slug: string;
    cityName: string;
}

const CookieBanner = ({ slug, cityName }: CookieBannerProps) => {
    const [showBanner, setShowBanner] = useState(false);

    // Deterministic theme
    const theme = getTheme(slug);
    const classes = theme.classes;

    useEffect(() => {
        // Check if user has already explicitly accepted or rejected
        const consent = localStorage.getItem('cookie-consent');
        if (!consent) {
            // Small delay for animation entrance
            const timer = setTimeout(() => setShowBanner(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptAll = () => {
        localStorage.setItem('cookie-consent', 'accepted');
        setShowBanner(false);
        // Optional: Trigger GTM or extra tracking activation here if we had complex consent mode
    };

    const rejectAll = () => {
        localStorage.setItem('cookie-consent', 'rejected');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-neutral-900/95 backdrop-blur-md border ${classes.border.replace('/30', '/50')} rounded-2xl p-6 shadow-2xl ${classes.shadow} z-50 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
            <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg shrink-0 ${classes.bg} bg-opacity-20`}>
                    <Cookie className={`w-6 h-6 ${theme.text}`} />
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Confidentialité
                    </h3>
                    <p className="text-sm text-neutral-400 mb-4 leading-relaxed">
                        Nous utilisons des cookies pour améliorer votre expérience sur le site de {cityName}. Pas de pistage intrusif, promis.
                        {' '}
                        <Link href="/mentions-legales" className={`underline hover:opacity-80 transition ${theme.text}`}>
                            En savoir plus
                        </Link>
                    </p>

                    <div className="flex flex-col gap-2">
                        <button
                            onClick={acceptAll}
                            className={`w-full py-2 font-bold rounded-lg transition-colors ${classes.bg} ${theme.text} ${classes.bgHover}`}
                        >
                            Tout accepter
                        </button>
                        <button
                            onClick={rejectAll}
                            className="w-full py-2 bg-white/5 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                        >
                            Continuer sans accepter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;
