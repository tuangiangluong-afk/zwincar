export const revalidate = 86400; // 24h ISR cache
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentions Légales • ZwinCar.com",
    description: "Mentions légales, éditeur, hébergement et politique de confidentialité de la plateforme ZwinCar.",
    alternates: {
        canonical: "https://zwincar.com/mentions-legales",
    },
};

export default function MentionsLegales() {
    return (
        <div className="min-h-screen bg-[#FAF7F2] font-sans text-slate-900 selection:bg-[#C9572C] selection:text-white">
            {/* Header */}
            <nav className="sticky top-0 z-50 w-full border-b border-[#E7DFD5] bg-white/90 px-4 py-3 backdrop-blur-md">
                <div className="container mx-auto max-w-4xl flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#C9572C] transition"
                    >
                        <ArrowLeft size={16} />
                        Retour Accueil
                    </Link>
                    <span className="text-sm font-black tracking-tight text-slate-900">
                        Zwin<span className="text-[#C9572C]">Car</span>.com
                    </span>
                </div>
            </nav>

            <main className="container mx-auto max-w-3xl px-4 py-12 lg:py-16">
                <h1 className="mb-8 text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
                    Mentions Légales
                </h1>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                        <h2 className="mb-4 text-xl font-bold text-slate-900">1. Éditeur de la Plateforme</h2>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                            Le site <strong>ZwinCar.com</strong> est édité par la société <strong>WELINK TECH</strong>.
                        </p>
                        <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
                            <li><strong>Société :</strong> WELINK TECH</li>
                            <li><strong>Siège social :</strong> 6 RUE DES BATELIERS, 92110 CLICHY</li>
                            <li><strong>SIREN :</strong> 984 800 136 R.C.S. NANTERRE</li>
                            <li><strong>Responsable de publication :</strong> Direction WELINK TECH</li>
                            <li><strong>Email & Support :</strong> support@zwincar.com</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                        <h2 className="mb-4 text-xl font-bold text-slate-900">2. Nature du Service</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            ZwinCar est une plateforme technologique mettant en relation des voyageurs avec des agences professionnelles indépendantes de location de voitures au Maroc, sélectionnées et auditées pour leur conformité légale, leurs véhicules récents et leur politique sans caution abusive.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                        <h2 className="mb-4 text-xl font-bold text-slate-900">3. Hébergement</h2>
                        <p className="text-sm text-slate-600 leading-relaxed mb-3">
                            Le site est hébergé par <strong>Vercel Inc.</strong>
                        </p>
                        <ul className="text-xs sm:text-sm text-slate-600 space-y-1">
                            <li><strong>Adresse :</strong> 340 S Lemon Ave #4133 Walnut, CA 91789, USA</li>
                            <li><strong>Infrastructure :</strong> Vercel Global Edge Network</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                        <h2 className="mb-4 text-xl font-bold text-slate-900">4. Propriété Intellectuelle</h2>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            L&apos;ensemble des contenus (textes, visuels, moteurs algorithmiques, marques, logos et données structurées) est la propriété exclusive de WELINK TECH ou de tiers partenaires. Toute reproduction totale ou partielle sans accord préalable est strictement prohibée.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                        <h2 className="mb-4 text-xl font-bold text-slate-900">5. Données Personnelles (RGPD & CNDP Maroc)</h2>
                        <p className="text-sm text-slate-600 leading-relaxed mb-3">
                            Les données renseignées lors d&apos;une réservation (nom, coordonnées WhatsApp, email, numéro de vol) sont traitées conformément aux dispositions légales afin de garantir la mise à disposition du véhicule et le suivi en direct des vols à l&apos;arrivée.
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Conformément à la réglementation, vous bénéficiez d&apos;un droit d&apos;accès, de rectification et d&apos;effacement de vos données personnelles sur simple demande à support@zwincar.com.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
