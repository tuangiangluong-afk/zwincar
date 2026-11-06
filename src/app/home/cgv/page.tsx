export const revalidate = 86400; // 24h ISR cache
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conditions Générales de Vente - Taxi de France",
    description: "Consultez les CGV du réseau Taxi de France : réservation de taxis et VTC, tarifs réglementés, annulations et responsabilités.",
    alternates: {
        canonical: "https://taxifrance.fr/cgv",
    },
};

export default function CGV() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-neutral-900">
            {/* Header */}
            <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-900/90 px-4 py-3 backdrop-blur-md text-white">
                <div className="container mx-auto flex items-center justify-between">
                    <Link
                        href="/home"
                        className="flex items-center gap-2 text-sm font-bold hover:text-blue-400 transition"
                    >
                        <ArrowLeft size={16} />
                        Retour Accueil
                    </Link>
                    <span className="text-sm font-bold">
                        Taxi de France<span className="text-blue-500">.</span>
                    </span>
                </div>
            </nav>

            <main className="container mx-auto max-w-3xl px-4 py-12 lg:py-20">
                <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
                    Conditions Générales de Vente (CGV)
                </h1>

                <div className="prose prose-neutral prose-lg max-w-none">
                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <p className="text-sm text-neutral-500">Dernière mise à jour : 25/01/2026</p>
                        <p>
                            Les présentes Conditions Générales de Vente régissent les relations contractuelles entre la société <strong>MEDIASHMAN</strong>, sise au 91 RUE DU FAUBOURG SAINT-HONORE, 75008 PARIS (SIREN 509 987 681), ci-après &quot;L&apos;Éditeur&quot;, et toute personne utilisant le site <strong>Taxi de France</strong> pour la mise en relation avec le réseau national de chauffeurs.
                        </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-blue-900">1. Objet et Acceptation</h2>
                        <p>
                            Le service proposé est la mise en relation avec des chauffeurs de taxi et VTC professionnels exerçant sur l&apos;ensemble du territoire national. L&apos;utilisation du service implique l&apos;acceptation sans réserve des présentes CGV.
                        </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-blue-900">2. Réservations et Tarifs</h2>
                        <ul className="list-disc pl-5 space-y-2">
                            <li><strong>Réservation Immédiate :</strong> Sous réserve de disponibilité des chauffeurs partenaires dans votre secteur.</li>
                            <li><strong>Réservation à l&apos;avance :</strong> Recommandée 24h à l&apos;avance pour les trajets gares et aéroports.</li>
                            <li><strong>Tarification :</strong> Le prix final est déterminé par le compteur horokilométrique (Taxi) ou le forfait convenu (VTC/Approche), conformément à la réglementation. L&apos;estimation donnée par le site est indicative.</li>
                        </ul>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-blue-900">3. Annulation et Responsabilité</h2>
                        <p>
                            Toute annulation doit être notifiée dès que possible. En cas de &quot;No Show&quot; (client absent), le chauffeur est en droit de réclamer une indemnité correspondant à l&apos;approche effectuée.
                        </p>
                        <p className="mt-4">
                            MEDIASHMAN agit en qualité d&apos;intermédiaire technologique. La responsabilité du transport incombe exclusivement au chauffeur exécutant la course, qui doit être assuré et en règle.
                        </p>
                    </div>

                    {/* BROKER PROTECTION - Critical Legal Shield */}
                    <div className="mb-8 rounded-2xl border-2 border-red-200 bg-red-50 p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-red-900">4. Nature du Service - Mise en Relation</h2>
                        <p className="font-semibold text-red-800">
                            Taxi France est une <strong>plateforme de mise en relation technique</strong> entre les utilisateurs et des chauffeurs professionnels indépendants.
                        </p>
                        <p className="mt-4 text-red-700">
                            <strong>Taxi France n&apos;est pas transporteur.</strong> Les prestations de transport sont effectuées par des chauffeurs indépendants ou des sociétés tierces, dûment autorisés et assurés.
                        </p>
                        <p className="mt-4 text-red-700">
                            En conséquence, <strong>Taxi France décline toute responsabilité</strong> en cas de litige lié à l&apos;exécution de la course, incluant mais non limité à : retards, accidents, perte ou détérioration de bagages, comportement du chauffeur, ou tout dommage survenu pendant le transport.
                        </p>
                        <p className="mt-4 text-sm text-red-600">
                            L&apos;utilisateur reconnaît que sa relation contractuelle pour le transport est établie directement avec le chauffeur ou la société de transport exécutant la course.
                        </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-blue-900">5. Loi Applicable</h2>
                        <p>
                            Les présentes CGV sont soumises au droit français. Tout litige relève des tribunaux compétents de Paris.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
