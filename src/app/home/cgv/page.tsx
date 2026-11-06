export const revalidate = 86400; // 24h ISR cache
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conditions Générales de Vente • ZwinCar.com",
    description: "Conditions Générales de Vente et d'Utilisation de la plateforme de réservation automobile ZwinCar.",
    alternates: {
        canonical: "https://zwincar.com/cgv",
    },
};

export default function CGV() {
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
                    Conditions Générales de Vente & d&apos;Utilisation
                </h1>
                <p className="text-xs text-slate-500 mb-8 font-mono">Dernière mise à jour : 06/11/2026</p>

                <div className="space-y-6">
                    <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                        <h2 className="mb-3 text-lg font-bold text-slate-900">1. Préambule et Champ d&apos;Application</h2>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Les présentes Conditions Générales de Vente régissent les relations contractuelles entre la société <strong>WELINK TECH</strong>, sise au 6 RUE DES BATELIERS, 92110 CLICHY (SIREN 984 800 136), ci-après &quot;L&apos;Éditeur&quot;, et toute personne effectuant une réservation de véhicule sur la plateforme <strong>ZwinCar.com</strong>, ci-après &quot;Le Client&quot;.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                        <h2 className="mb-3 text-lg font-bold text-slate-900">2. Rôle de la Plateforme & Modèle Opérationnel</h2>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                            ZwinCar opère en qualité de plateforme technologique et d&apos;intermédiaire de réservation certifié. ZwinCar sélectionne, audite et contractualise avec des agences locales indépendantes au Maroc, agréées par le Ministère du Transport, pour fournir une flotte récente et conforme.
                        </p>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Le contrat de location final est conclu directement entre le Client et l&apos;agence locale partenaire lors de la remise des clés et de l&apos;état des lieux au parking de l&apos;aéroport ou du riad.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                        <h2 className="mb-3 text-lg font-bold text-slate-900">3. Politique de Caution & Transparence</h2>
                        <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
                            <li><strong>Formule Franchise Zéro :</strong> Caution de 0 € bloquée sur carte bancaire. Aucune empreinte de 1 500 € exigée à l&apos;arrivée.</li>
                            <li><strong>Formule Standard :</strong> Caution réduite plafonnée à 300 € (ou équivalent en dirhams 3 000 MAD), payable par carte de débit ou en espèces, intégralement restituée lors de la restitution conforme du véhicule.</li>
                            <li><strong>Paiement du solde :</strong> Le solde restant dû s&apos;effectue directement auprès de l&apos;agent local à la remise des clés (espèces ou carte bancaire acceptées).</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                        <h2 className="mb-3 text-lg font-bold text-slate-900">4. Conditions d&apos;Annulation & Modification</h2>
                        <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
                            <li><strong>Annulation jusqu&apos;à 48h avant l&apos;arrivée :</strong> Remboursement intégral sans frais de l&apos;acompte de réservation.</li>
                            <li><strong>Annulation entre 48h et 24h :</strong> Remboursement à hauteur de 50 % de l&apos;acompte.</li>
                            <li><strong>Annulation à moins de 24h ou non-présentation :</strong> L&apos;acompte reste acquis pour couvrir les frais d&apos;immobilisation du véhicule.</li>
                        </ul>
                    </div>

                    <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                        <h2 className="mb-3 text-lg font-bold text-slate-900">5. Droit Applicable & Litiges</h2>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Les présentes conditions sont régies par le droit applicable. En cas de différend relatif à une réservation, les parties s&apos;engagent à rechercher une solution amiable préalable via l&apos;assistance conciergerie ZwinCar à hello@zwincar.com.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
