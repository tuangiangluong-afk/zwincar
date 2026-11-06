"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, CheckCircle2, Globe } from "lucide-react";

type CGVLocale = "fr" | "en" | "es" | "nl";

export function CGVClientView() {
    const [locale, setLocale] = useState<CGVLocale>("fr");

    return (
        <div className="min-h-screen bg-[#FAF7F2] font-sans text-slate-900 selection:bg-[#C9572C] selection:text-white">
            {/* Header */}
            <nav className="sticky top-0 z-50 w-full border-b border-[#E7DFD5] bg-white/90 px-4 py-3 backdrop-blur-md">
                <div className="container mx-auto max-w-4xl flex items-center justify-between">
                    <Link
                        href={locale === "fr" ? "/" : `/${locale}`}
                        className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#C9572C] transition"
                    >
                        <ArrowLeft size={16} />
                        <span>{locale === "en" ? "Back to Home" : locale === "es" ? "Volver al Inicio" : locale === "nl" ? "Terug naar Home" : "Retour Accueil"}</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        {/* Language Switcher */}
                        <div className="inline-flex items-center p-0.5 rounded-full bg-slate-100 border border-[#E7DFD5] text-xs font-bold">
                            {(["fr", "en", "es", "nl"] as const).map((l) => (
                                <button
                                    key={l}
                                    type="button"
                                    onClick={() => setLocale(l)}
                                    className={`px-2 py-0.5 rounded-full cursor-pointer transition uppercase text-[11px] font-bold ${
                                        locale === l
                                            ? "bg-[#C9572C] text-white shadow-2xs"
                                            : "hover:text-slate-900 text-slate-500"
                                    }`}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>

                        <span className="text-sm font-black tracking-tight text-slate-900 hidden sm:inline">
                            Zwin<span className="text-[#C9572C]">Car</span>.com
                        </span>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto max-w-3xl px-4 py-10 lg:py-14">
                {/* Header Title */}
                <div className="mb-8">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9572C]/10 text-[#C9572C] text-xs font-bold uppercase tracking-wider mb-3">
                        <ShieldCheck size={14} />
                        <span>
                            {locale === "en"
                                ? "Legal Terms & Guarantee"
                                : locale === "es"
                                ? "Términos Legales y Garantía"
                                : locale === "nl"
                                ? "Algemene Voorwaarden & Garantie"
                                : "Cadre Légal & Engagements"}
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
                        {locale === "en"
                            ? "Terms & Conditions of Service"
                            : locale === "es"
                            ? "Condiciones Generales de Venta y Uso"
                            : locale === "nl"
                            ? "Algemene Verkoop- en Gebruiksvoorwaarden"
                            : "Conditions Générales de Vente & d'Utilisation"}
                    </h1>
                    <p className="text-xs text-slate-500 mt-2 font-mono">
                        {locale === "en"
                            ? "Last updated: November 2026 • Valid across all Moroccan hubs"
                            : locale === "es"
                            ? "Última actualización: Noviembre 2026 • Válido en todos los aeropuertos de Marruecos"
                            : locale === "nl"
                            ? "Laatste update: November 2026 • Geldig op alle Marokkaanse luchthavens"
                            : "Dernière mise à jour : Novembre 2026 • Applicable sur tous les aéroports du Maroc"}
                    </p>
                </div>

                {/* French Content */}
                {locale === "fr" && (
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">1. Préambule et Champ d&apos;Application</h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Les présentes Conditions Générales de Vente régissent les relations contractuelles entre la société <strong>WELINK TECH</strong>, sise au 6 RUE DES BATELIERS, 92110 CLICHY (SIREN 984 800 136), ci-après &quot;L&apos;Éditeur&quot;, exploitant la plateforme <strong>ZwinCar.com</strong>, et toute personne effectuant une réservation de véhicule sur la plateforme, ci-après &quot;Le Client&quot;.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">2. Rôle de la Plateforme & Modèle Opérationnel</h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                                ZwinCar opère en qualité de plateforme technologique et d&apos;intermédiaire de mise en relation certifié. ZwinCar sélectionne, audite et référence des agences locales indépendantes de location de voitures au Maroc, régulièrement constituées et agréées par le Ministère du Transport, pour fournir une flotte récente et conforme aux normes de sécurité routière.
                            </p>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Le contrat de location automobile final et le procès-verbal contradictoire d&apos;état des lieux sont conclus directement entre le Client et l&apos;agence partenaire locale lors de la remise des clés au parking de l&apos;aéroport ou à l&apos;hébergement convenu.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">3. Politique de Caution & Transparence Tarifaire</h2>
                            <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5">
                                <li><strong>Formule Franchise Zéro (Pack Sérénité) :</strong> Caution de 0 € bloquée sur carte bancaire. Aucune empreinte de 1 500 € exigée à l&apos;arrivée. Rachat total de franchise en cas d&apos;accrochage ou dommages carrosserie.</li>
                                <li><strong>Formule Standard :</strong> Caution réduite plafonnée à 300 € (ou équivalent en dirhams 3 000 MAD), payable par carte de débit ou en espèces directement à l&apos;agence locale, intégralement restituée lors du check-out conforme du véhicule.</li>
                                <li><strong>Règlement du Solde Restant :</strong> L&apos;acompte réglé en ligne via Stripe bloque la réservation. Le solde restant dû (80% du tarif loueur) s&apos;effectue directement auprès de l&apos;agent local lors de la prise en charge (espèces ou carte bancaire acceptées sans frais cachés).</li>
                            </ul>
                        </div>

                        {/* ARTICLE 3.BIS : RÉSISTANCE ET BLINDAGE JURIDIQUE SUR LES CATÉGORIES */}
                        <div className="rounded-3xl border-2 border-[#C9572C]/40 bg-white p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#C9572C] text-white text-[11px] font-bold uppercase tracking-wider">
                                    Article 3.bis
                                </span>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Réservation par Catégorie, Modèle de Référence et Surclassement Gratuit
                                </h2>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                                <p>
                                    Conformément aux usages standard de l&apos;industrie automobile internationale et pour pallier l&apos;absence de synchronisation télématique en temps réel avec les flottes des agences locales partenaires au Maroc, <strong>toute réservation effectuée sur ZwinCar.com porte obligatoirement sur une catégorie de véhicule et non sur un modèle exclusif ou un numéro de châssis unique</strong>.
                                </p>
                                <p>
                                    Le véhicule désigné lors de la réservation (ex. <em>Renault Clio 5 Automatique</em>, <em>Dacia Sandero Stepway</em>, <em>Dacia Duster 4x4</em>, <em>Peugeot 208</em>, <em>Hyundai Tucson BVA</em>) constitue le <strong>modèle de référence représentatif de sa catégorie</strong> en termes de gabarit, de motorisation, de type de transmission (boîte manuelle ou automatique) et de nombre de places assises.
                                </p>
                                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2">
                                    <div className="font-bold text-slate-900">
                                        Engagements de Garantie ZwinCar en cas d&apos;indisponibilité du modèle exact :
                                    </div>
                                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                                        <li><strong>Fourniture d&apos;un véhicule équivalent :</strong> Si le modèle de référence exact est retenu en entretien ou immobilisé par un retard du précédent locataire, l&apos;agence locale partenaire fournit un véhicule de catégorie strictement équivalente (mêmes équipements, même gabarit, climatisation et même type de boîte de vitesses).</li>
                                        <li><strong>Surclassement gratuit garanti :</strong> À défaut de véhicule disponible dans la même catégorie, un véhicule de catégorie supérieure (ex. SUV au lieu d&apos;une compacte, berline au lieu d&apos;une citadine) est automatiquement et obligatoirement attribué au Client <strong>sans aucun surcoût ni supplément tarifaire</strong>.</li>
                                        <li><strong>Garantie absolue de la boîte automatique :</strong> Toute réservation portant sur une boîte automatique fait l&apos;objet d&apos;un véhicule obligatoirement automatique (aucun déclassement en boîte manuelle n&apos;est autorisé).</li>
                                        <li><strong>Maintien des conditions de caution :</strong> Tout surclassement préserve intégralement les modalités de caution convenues (0 € en formule Franchise Zéro ou 300 € en standard).</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">4. Conditions d&apos;Annulation & Modification</h2>
                            <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
                                <li><strong>Annulation jusqu&apos;à 48h avant l&apos;arrivée :</strong> Remboursement intégral sans frais de l&apos;acompte de réservation payé en ligne.</li>
                                <li><strong>Annulation entre 48h et 24h :</strong> Remboursement à hauteur de 50 % de l&apos;acompte.</li>
                                <li><strong>Annulation à moins de 24h ou non-présentation :</strong> L&apos;acompte reste acquis pour couvrir les frais de mise à disposition et d&apos;immobilisation du véhicule au terminal.</li>
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">5. Droit Applicable & Litiges</h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Les présentes conditions sont régies par le droit applicable. En cas de différend relatif à une réservation ou à l&apos;exécution d&apos;un contrat de location, les parties s&apos;engagent à rechercher une solution amiable préalable via l&apos;astreinte conciergerie ZwinCar à hello@zwincar.com ou par assistance WhatsApp 24/7.
                            </p>
                        </div>
                    </div>
                )}

                {/* English Content */}
                {locale === "en" && (
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">1. Preamble & Scope</h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                These Terms and Conditions govern the contractual relationship between <strong>WELINK TECH</strong> (SIREN 984 800 136), operating the <strong>ZwinCar.com</strong> platform, and any person making a car rental reservation, hereinafter &quot;The Customer&quot;.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">2. Platform Role & Operational Model</h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                                ZwinCar operates as a technology platform and certified booking intermediary. ZwinCar audits and partners with registered, licensed independent local car rental companies across Morocco (Ministry of Transport compliant) to provide recent, well-maintained vehicles.
                            </p>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                The final rental agreement and hand-over checklist are signed directly between the Customer and the local operating partner upon vehicle handover at the airport parking or riad.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">3. Deposit Policy & Price Transparency</h2>
                            <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5">
                                <li><strong>Zero-Excess Option (Serenity Pack):</strong> Strictly €0 deposit held on credit card. No €1,500 bank freeze required upon arrival. Complete damage & scratch waiver.</li>
                                <li><strong>Standard Option:</strong> Low deposit capped at €300 (or 3,000 MAD), payable by debit card or cash, fully returned at checkout upon return of vehicle.</li>
                                <li><strong>Remaining Balance:</strong> The online deposit via Stripe secures the booking. The remaining 80% balance is paid directly to the local agent upon vehicle collection (cash or card accepted).</li>
                            </ul>
                        </div>

                        {/* ARTICLE 3.BIS : ENGLISH */}
                        <div className="rounded-3xl border-2 border-[#C9572C]/40 bg-white p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#C9572C] text-white text-[11px] font-bold uppercase tracking-wider">
                                    Clause 3.bis
                                </span>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Category-Based Booking, Reference Model & Guaranteed Free Upgrade
                                </h2>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                                <p>
                                    In accordance with standard global car rental practices and the absence of direct real-time telematics syncing with independent local fleet software in Morocco, <strong>all reservations made on ZwinCar.com apply to a vehicle category rather than a specific registration number or unique chassis</strong>.
                                </p>
                                <p>
                                    The vehicle named during booking (e.g. <em>Renault Clio 5 Automatic</em>, <em>Dacia Sandero Stepway</em>, <em>Dacia Duster 4WD</em>) represents the <strong>reference model for its category</strong> in terms of size, seating capacity, luggage volume, and transmission type (manual or automatic).
                                </p>
                                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2">
                                    <div className="font-bold text-slate-900">
                                        ZwinCar Quality Guarantees in case of exact model unavailability:
                                    </div>
                                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                                        <li><strong>Equivalent Category Supply:</strong> If the exact model is undergoing maintenance or delayed by a previous flight return, the local partner provides a strictly equivalent model (same category, size, AC, and transmission type).</li>
                                        <li><strong>Mandatory Free Upgrade:</strong> If no vehicle in the booked category is available, a vehicle from a superior category (e.g. SUV instead of compact) is automatically provided at <strong>zero extra charge</strong>.</li>
                                        <li><strong>Strict Automatic Transmission Guarantee:</strong> Any automatic booking is strictly fulfilled with an automatic vehicle (no manual downgrade permitted).</li>
                                        <li><strong>Protected Financial Terms:</strong> Any upgrade retains the original deposit terms (€0 under Zero-Excess or €300 standard).</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">4. Cancellation & Modifications</h2>
                            <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
                                <li><strong>Cancellation up to 48 hours prior:</strong> 100% full refund of the reservation deposit with zero fee.</li>
                                <li><strong>Between 48 and 24 hours prior:</strong> 50% refund of deposit.</li>
                                <li><strong>Under 24 hours or no-show:</strong> Deposit is retained to cover vehicle mobilization costs.</li>
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">5. Applicable Law & Support</h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                These terms are governed by applicable law. For any booking dispute, the parties agree to seek amicable resolution via ZwinCar 24/7 concierge support at hello@zwincar.com or via WhatsApp assistance.
                            </p>
                        </div>
                    </div>
                )}

                {/* Spanish Content */}
                {locale === "es" && (
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">1. Preámbulo y Ámbito de Aplicación</h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Las presentes Condiciones Generales regulan la relación entre <strong>WELINK TECH</strong>, titular de la plataforma <strong>ZwinCar.com</strong>, y cualquier usuario que realice una reserva, en adelante &quot;El Cliente&quot;.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">2. Modelo Operativo y Red Local</h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                                ZwinCar actúa como plataforma tecnológica e intermediario de reservas auditado. ZwinCar selecciona empresas locales independientes autorizadas por el Ministerio de Transporte de Marruecos para suministrar vehículos recientes.
                            </p>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                El contrato de alquiler final se firma directamente con la agencia local asociada durante la entrega del vehículo en el aeropuerto o riad.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">3. Política de Fianza y Transparencia</h2>
                            <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5">
                                <li><strong>Opción Cero Fianza:</strong> Fianza de 0 € en tarjeta. Sin retención bancaria de 1.500 € a la llegada. Cobertura total de daños.</li>
                                <li><strong>Opción Estándar:</strong> Fianza reducida de 300 € (o 3.000 MAD), en tarjeta de débito o efectivo, reembolsada íntegramente a la devolución.</li>
                                <li><strong>Saldo restante:</strong> El anticipo abonado online asegura la reserva; el saldo restante (80%) se abona directamente al socio local en la entrega.</li>
                            </ul>
                        </div>

                        {/* ARTICLE 3.BIS : SPANISH */}
                        <div className="rounded-3xl border-2 border-[#C9572C]/40 bg-white p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#C9572C] text-white text-[11px] font-bold uppercase tracking-wider">
                                    Artículo 3.bis
                                </span>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Reserva por Categoría, Modelo de Referencia y Mejora Gratuita (Upgrade)
                                </h2>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                                <p>
                                    Conforme a las prácticas habituales del sector de alquiler de coches, <strong>toda reserva efectuada en ZwinCar.com corresponde a una categoría de vehículo y no a una matrícula o modelo exclusivo</strong>.
                                </p>
                                <p>
                                    El vehículo mostrado (ej. <em>Renault Clio 5 Automático</em>, <em>Dacia Sandero Stepway</em>, <em>Dacia Duster 4x4</em>) constituye el <strong>modelo de referencia representativo de su categoría</strong> (tamaño, tipo de cambio y número de plazas).
                                </p>
                                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2">
                                    <div className="font-bold text-slate-900">
                                        Garantías ZwinCar en caso de indisponibilidad del modelo exacto:
                                    </div>
                                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                                        <li><strong>Vehículo de categoría equivalente:</strong> Se entregará un modelo de categoría idéntica con el mismo tipo de cambio (automático o manual).</li>
                                        <li><strong>Mejora de categoría gratuita (Upgrade):</strong> Si no hay disponibilidad en la categoría reservada, se entregará un vehículo de categoría superior <strong>sin ningún suplemento económico</strong>.</li>
                                        <li><strong>Condiciones de fianza inalteradas:</strong> La mejora mantiene íntegramente la fianza de 0 € o 300 € acordada.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">4. Cancelaciones</h2>
                            <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
                                <li><strong>Hasta 48h antes de la llegada:</strong> Reembolso del 100% del anticipo sin gastos.</li>
                                <li><strong>Entre 48h y 24h:</strong> Reembolso del 50%.</li>
                                <li><strong>Menos de 24h:</strong> Anticipo no reembolsable.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Dutch Content */}
                {locale === "nl" && (
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">1. Preambule & Toepassing</h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Deze voorwaarden regelen de relatie tussen <strong>WELINK TECH</strong>, exploitant van <strong>ZwinCar.com</strong>, en de huurder, hierna &quot;De Klant&quot;.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">2. Platform Rol & Lokaal Model</h2>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                                ZwinCar treedt op als gecertificeerd bemiddelingsplatform. Wij selecteren erkende lokale autoverhuurders in Marokko (met vergunning van het Ministerie van Transport) met recente wagens.
                            </p>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                Het definitieve huurcontract wordt ter plaatse gesloten bij sleuteloverdracht op de luchthaven of riad.
                            </p>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">3. Borg & Prijstransparantie</h2>
                            <ul className="text-xs sm:text-sm text-slate-600 space-y-2.5">
                                <li><strong>Geen Eigen Risico Optie:</strong> Strikte borg van € 0 op creditcard. Geen blokkade van € 1.500 bij aankomst.</li>
                                <li><strong>Standaard Optie:</strong> Verlaagde borg van € 300 (of 3.000 MAD), betaalbaar per betaalpas of contant, volledig geretourneerd bij inlevering.</li>
                                <li><strong>Restbetaling:</strong> De online aanbetaling blokkeert de boeking; het resterende saldo (80%) wordt direct voldaan aan de lokale partner bij overdracht.</li>
                            </ul>
                        </div>

                        {/* ARTICLE 3.BIS : DUTCH */}
                        <div className="rounded-3xl border-2 border-[#C9572C]/40 bg-white p-6 sm:p-8 shadow-sm">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="px-2.5 py-0.5 rounded-full bg-[#C9572C] text-white text-[11px] font-bold uppercase tracking-wider">
                                    Artikel 3.bis
                                </span>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Reservering per Categorie, Referentiemodel & Gratis Upgrade
                                </h2>
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-3">
                                <p>
                                    Conform de internationale standaarden in de autoverhuursector heeft <strong>elke boeking op ZwinCar.com betrekking op een voertuigcategorie en niet op een exclusief kenteken of chassisnummer</strong>.
                                </p>
                                <p>
                                    Het getoonde model (bijv. <em>Renault Clio 5 Automaat</em>, <em>Dacia Sandero Stepway</em>, <em>Dacia Duster 4x4</em>) geldt als <strong>referentiemodel voor zijn categorie</strong> (formaat, transmissie en aantal zitplaatsen).
                                </p>
                                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E7DFD5] space-y-2">
                                    <div className="font-bold text-slate-900">
                                        ZwinCar Garanties bij onbeschikbaarheid van het exacte model:
                                    </div>
                                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700">
                                        <li><strong>Gelijkwaardig model:</strong> Levering van een voertuig van exact dezelfde categorie en hetzelfde type transmissie.</li>
                                        <li><strong>Gegarandeerde gratis upgrade:</strong> Indien geen wagen in de geboekte categorie beschikbaar is, ontvangt de klant automatisch een hogere categorie <strong>zonder enige meerprijs</strong>.</li>
                                        <li><strong>Borgvoorwaarden onveranderd:</strong> De overeengekomen borg (€ 0 of € 300) blijft ongewijzigd gelden.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-[#E7DFD5] bg-white p-6 sm:p-8 shadow-xs">
                            <h2 className="mb-3 text-lg font-bold text-slate-900">4. Annuleringen</h2>
                            <ul className="text-xs sm:text-sm text-slate-600 space-y-2">
                                <li><strong>Tot 48 uur voor aankomst:</strong> 100% terugbetaling van de aanbetaling.</li>
                                <li><strong>Tussen 48 en 24 uur:</strong> 50% terugbetaling.</li>
                                <li><strong>Minder dan 24 uur:</strong> Aanbetaling blijft behouden voor reserveringskosten.</li>
                            </ul>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
