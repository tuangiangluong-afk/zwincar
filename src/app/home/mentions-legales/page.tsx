export const revalidate = 86400; // 24h ISR cache
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Mentions Légales - Taxi de France",
    description: "Mentions légales, éditeur, hébergement et politique de confidentialité du réseau Taxi de France.",
    alternates: {
        canonical: "https://taxifrance.fr/mentions-legales",
    },
};

export default function MentionsLegales() {
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
                    Mentions Légales
                </h1>

                <div className="prose prose-neutral prose-lg max-w-none">
                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-blue-900">1. Éditeur du Site</h2>
                        <p>
                            Le site <strong>Taxi de France</strong> (taxifrance.fr) est édité par la société <strong>MEDIASHMAN</strong>.
                        </p>
                        <ul className="list-none space-y-2 pl-0">
                            <li><strong>Forme juridique :</strong> Société (SASU/SARL selon Kbis)</li>
                            <li><strong>Siège social :</strong> 91 RUE DU FAUBOURG SAINT-HONORE, 75008 PARIS</li>
                            <li><strong>SIREN :</strong> 509 987 681 R.C.S. PARIS</li>
                            <li><strong>Responsable de publication :</strong> Direction MEDIASHMAN</li>
                            <li><strong>Contact :</strong> <Link href="/contact" className="underline text-blue-600">Formulaire de contact</Link></li>
                        </ul>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-blue-900">2. Service Proposé</h2>
                        <p>
                            Taxi de France est une plateforme nationale regroupant des artisans taxis et des sociétés de transport VTC indépendants. Le site facilite la mise en relation entre les usagers et les professionnels du transport.
                        </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-blue-900">3. Hébergement</h2>
                        <p>
                            Le Site est hébergé par la société <strong>Vercel Inc.</strong>
                        </p>
                        <ul className="list-none space-y-2 pl-0">
                            <li><strong>Adresse :</strong> 340 S Lemon Ave #4133 Walnut, CA 91789, USA</li>
                            <li><strong>Cloud Provider :</strong> Infrastructure AWS / Vercel Edge Network</li>
                        </ul>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-blue-900">4. Propriété Intellectuelle</h2>
                        <p>
                            L&apos;ensemble des contenus (textes, images, base de données, marque &quot;Taxi de France&quot;) est protégé par le droit de la propriété intellectuelle. Toute reproduction non autorisée est interdite.
                        </p>
                    </div>

                    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-blue-900">5. Données Personnelles (RGPD)</h2>
                        <p>
                            Les données collectées (nom, téléphone, trajet) sont utilisées uniquement pour l&apos;exécution de la prestation de transport. Elles sont transmises au chauffeur partenaire sélectionné.
                        </p>
                        <p>
                            Vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données. Pour l&apos;exercer, contactez-nous via la page contact.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
