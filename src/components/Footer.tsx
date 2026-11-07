"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";
import { MOROCCAN_HUBS, VEHICLE_FLEET } from "@/lib/morocco-data";
import { ShieldCheck, MessageCircle } from "lucide-react";
import { Locale } from "@/lib/i18n";

interface FooterProps {
    config?: any;
    locale?: Locale;
}

export default function Footer({ config, locale: propLocale }: FooterProps = {}) {
    const pathname = usePathname() || "";
    let activeLocale: Locale = propLocale || "fr";
    if (!propLocale) {
        if (pathname.startsWith("/en")) activeLocale = "en";
        else if (pathname.startsWith("/es")) activeLocale = "es";
        else if (pathname.startsWith("/nl")) activeLocale = "nl";
    }

    const t = {
        fr: {
            bannerBadge: "Le Standard ZwinCar",
            bannerTitle: "La sérénité totale pour votre roadtrip au Maroc",
            bannerDesc: "Aucun blocage de carte bancaire, clés remises en main propre dès l'atterrissage et assistance locale francophone 24h/24.",
            contactBtn: "Contacter notre équipe locale",
            brandDesc: "Plateforme de réservation de voitures au Maroc auprès d'agences locales indépendantes vérifiées. Zéro caution bloquée sur carte de crédit.",
            airportsTitle: "Aéroports & Villes",
            vehiclesTitle: "Véhicules Recommandés",
            transparencyTitle: "Transparence & Guides",
            guidesLink: "Guides & Conseils Routiers",
            zeroCautionLink: "Garantie 0€ Caution CB",
            vendorSpace: "Espace Loueur Partenaire",
            vendorJoin: "Rejoindre le Réseau ZwinCar",
            terms: "Conditions Générales",
            copyright: `© ${new Date().getFullYear()} ZwinCar.com • Tous droits réservés.`,
            stripeSecure: "Paiement sécurisé par Stripe",
            whatsappSupport: "Assistance WhatsApp 24/7",
        },
        en: {
            bannerBadge: "The ZwinCar Standard",
            bannerTitle: "Complete peace of mind for your Morocco roadtrip",
            bannerDesc: "No credit card hold, hand-to-hand key handover upon landing, and 24/7 dedicated multilingual local support.",
            contactBtn: "Contact our local team",
            brandDesc: "Car rental platform in Morocco connecting you directly with verified independent local fleets. Zero credit card deposit hold.",
            airportsTitle: "Airports & Cities",
            vehiclesTitle: "Recommended Fleet",
            transparencyTitle: "Transparency & Guides",
            guidesLink: "Morocco Driving Guides & Tips",
            zeroCautionLink: "Zero Credit Card Hold Guarantee",
            vendorSpace: "Partner Fleet Portal",
            vendorJoin: "Join the ZwinCar Network",
            terms: "Terms & Conditions",
            copyright: `© ${new Date().getFullYear()} ZwinCar.com • All rights reserved.`,
            stripeSecure: "Secure payment powered by Stripe",
            whatsappSupport: "24/7 WhatsApp VIP Support",
        },
        es: {
            bannerBadge: "El Estándar ZwinCar",
            bannerTitle: "Total tranquilidad para su roadtrip en Marruecos",
            bannerDesc: "Sin bloqueo en tarjeta bancaria, entrega de llaves en mano al aterrizar y asistencia local 24h/24.",
            contactBtn: "Contactar con nuestro equipo local",
            brandDesc: "Plataforma de reserva de vehículos en Marruecos con agencias locales independientes verificadas. Cero fianza bloqueada en tarjeta de crédito.",
            airportsTitle: "Aeropuertos y Ciudades",
            vehiclesTitle: "Vehículos Recomendados",
            transparencyTitle: "Transparencia y Guías",
            guidesLink: "Guías y Consejos de Conducción",
            zeroCautionLink: "Garantía Cero Fianza en Tarjeta",
            vendorSpace: "Portal de Socios Locales",
            vendorJoin: "Unirse a la Red ZwinCar",
            terms: "Términos y Condiciones",
            copyright: `© ${new Date().getFullYear()} ZwinCar.com • Todos los derechos reservados.`,
            stripeSecure: "Pago seguro con Stripe",
            whatsappSupport: "Asistencia WhatsApp 24/7",
        },
        nl: {
            bannerBadge: "De ZwinCar Standaard",
            bannerTitle: "Totale gemoedsrust voor uw roadtrip in Marokko",
            bannerDesc: "Geen blokkade op uw creditcard, persoonlijke sleuteloverdracht bij landing en 24/7 lokale ondersteuning.",
            contactBtn: "Neem contact op met ons lokale team",
            brandDesc: "Autoverhuurplatform in Marokko dat u rechtstreeks verbindt met geverifieerde lokale verhuurders. Geen borg geblokkeerd op creditcard.",
            airportsTitle: "Luchthavens & Steden",
            vehiclesTitle: "Aanbevolen Voertuigen",
            transparencyTitle: "Transparantie & Gidsen",
            guidesLink: "Reisgidsen & Verkeersadvies",
            zeroCautionLink: "Garantie Geen Creditcard Borg",
            vendorSpace: "Partner Verhuurportaal",
            vendorJoin: "Word Partner van ZwinCar",
            terms: "Algemene Voorwaarden",
            copyright: `© ${new Date().getFullYear()} ZwinCar.com • Alle rechten voorbehouden.`,
            stripeSecure: "Veilig betalen via Stripe",
            whatsappSupport: "24/7 WhatsApp Klantenservice",
        },
    }[activeLocale];

    const waText = encodeURIComponent(
        activeLocale === "en"
            ? "Hello ZwinCar, I need assistance with a car rental"
            : activeLocale === "es"
            ? "Hola ZwinCar, necesito asistencia con un alquiler"
            : activeLocale === "nl"
            ? "Hallo ZwinCar, ik heb hulp nodig met autohuur"
            : "Bonjour ZwinCar, je souhaite une assistance"
    );

    return (
        <footer className="bg-[#12161E] text-slate-300 pt-16 pb-12 border-t border-slate-800">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Top Value Banner */}
                <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E58B24]">
                            <ShieldCheck size={14} />
                            {t.bannerBadge}
                        </div>
                        <p className="text-lg md:text-xl font-bold text-white tracking-tight">
                            {t.bannerTitle}
                        </p>
                        <p className="text-xs text-slate-400 max-w-xl">
                            {t.bannerDesc}
                        </p>
                    </div>

                    <a
                        href={`https://wa.me/212600000000?text=${waText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white text-xs font-bold tracking-wide transition-all shrink-0 flex items-center gap-2"
                    >
                        <MessageCircle size={15} />
                        <span>{t.contactBtn}</span>
                    </a>
                </div>

                {/* 4 Column Nav Mesh */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-xs">
                    {/* Col 1: Brand & Promise */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <Logo variant="full" theme="light" size="sm" locale={activeLocale} />
                        <p className="text-slate-400 text-xs leading-relaxed">
                            {t.brandDesc}
                        </p>
                        <div className="text-[11px] text-slate-500 font-mono">
                            Marrakech • Casablanca • Agadir • Tanger • Fès
                        </div>
                    </div>

                    {/* Col 2: Hubs & Aéroports */}
                    <div>
                        <h5 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
                            {t.airportsTitle}
                        </h5>
                        <ul className="space-y-2 text-slate-400">
                            {MOROCCAN_HUBS.map((hub) => (
                                <li key={hub.slug}>
                                    <Link
                                        href={activeLocale === "fr" ? `/maroc/${hub.slug}` : `/${activeLocale}/${hub.slug}`}
                                        className="hover:text-white transition flex items-center justify-between"
                                    >
                                        <span>{hub.name}</span>
                                        <span className="font-mono text-[10px] text-slate-500">
                                            {hub.airportCode}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Modèles Phares */}
                    <div>
                        <h5 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
                            {t.vehiclesTitle}
                        </h5>
                        <ul className="space-y-2 text-slate-400">
                            {VEHICLE_FLEET.slice(0, 5).map((v) => (
                                <li key={v.id}>
                                    <Link
                                        href={activeLocale === "fr" ? `/maroc/marrakech/${v.id}` : `/${activeLocale}/marrakech/${v.id}`}
                                        className="hover:text-white transition flex items-center justify-between"
                                    >
                                        <span className="truncate pr-1">{v.name}</span>
                                        <span className="font-mono text-[10px] text-[#E58B24]">
                                            {v.dailyPriceEur}€/j
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4: Transparence & IA */}
                    <div>
                        <h5 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
                            {t.transparencyTitle}
                        </h5>
                        <ul className="space-y-2 text-slate-400">
                            <li>
                                <Link
                                    href={activeLocale === "fr" ? "/guides" : "/en/guides"}
                                    className="hover:text-white transition flex items-center gap-1.5"
                                >
                                    <span>{t.guidesLink}</span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C9572C]/20 text-[#C9572C] font-mono">2026</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/llms.txt" className="hover:text-white transition flex items-center gap-1.5">
                                    <span>Documentation IA (llms.txt)</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={activeLocale === "fr" ? "/#zero-caution" : `/${activeLocale}#zero-caution`}
                                    className="hover:text-white transition"
                                >
                                    {t.zeroCautionLink}
                                </Link>
                            </li>
                            <li>
                                <Link href="/vendor/login" rel="nofollow" className="hover:text-white transition font-medium text-slate-300">
                                    {t.vendorSpace}
                                </Link>
                            </li>
                            <li>
                                <Link href="/vendor/register" rel="nofollow" className="hover:text-white transition text-[#E58B24]">
                                    {t.vendorJoin}
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition">
                                    Support & Contact 24/7
                                </Link>
                            </li>
                            <li>
                                <Link href="/cgv" className="hover:text-white transition">
                                    {t.terms}
                                </Link>
                            </li>
                            <li>
                                <Link href="/mentions-legales" className="hover:text-white transition">
                                    {activeLocale === "en" ? "Legal Notice" : activeLocale === "es" ? "Aviso Legal" : activeLocale === "nl" ? "Juridische Informatie" : "Mentions Légales"}
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-center sm:text-left">
                        <span>{t.copyright}</span>
                        <span className="hidden sm:inline text-slate-700">•</span>
                        <span>
                            Créé par{" "}
                            <a
                                href="https://www.propulselab.fr/"
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                className="text-slate-400 hover:text-white underline underline-offset-2 transition"
                            >
                                Propulse
                            </a>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span>{t.stripeSecure}</span>
                        <span>•</span>
                        <span>{t.whatsappSupport}</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
export { Footer };
