import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
import VehicleCatalog from "@/components/VehicleCatalog";
import LocalAeoSection from "@/components/LocalAeoSection";
import SchemaJSON from "@/components/SchemaJSON";
import { MobileHomeStickyBar } from "@/components/MobileHomeStickyBar";
import { MOROCCAN_HUBS, DIRECT_ANSWERS_AEO } from "@/lib/morocco-data";
import { Locale } from "@/lib/i18n";
import {
    ShieldCheck,
    CheckCircle2,
    XCircle,
    MapPin,
    ArrowRight,
    CreditCard,
    KeyRound,
} from "lucide-react";

export const revalidate = 604800; // 7 days ISR cache

interface HomePageProps {
    locale?: Locale;
}

export default function HomePage({ locale = "fr" }: HomePageProps = {}) {
    const isEn = locale === "en";
    const isEs = locale === "es";
    const isNl = locale === "nl";

    return (
        <div className="min-h-screen bg-[#FAF7F2] text-[#12161E] selection:bg-[#C9572C] selection:text-white">
            {/* Structured Data AEO & SEO */}
            <SchemaJSON
                type="AutoRental"
                faqs={DIRECT_ANSWERS_AEO.faqs}
                breadcrumbItems={[
                    { name: locale === "fr" ? "Accueil" : "Home", item: "https://zwincar.com" },
                    { name: "Maroc", item: `https://zwincar.com/${locale === "fr" ? "maroc" : locale}` },
                ]}
            />

            {/* Header Navigation */}
            <Header locale={locale} />

            <main id="main-content">
            {/* HERO SECTION */}
            <section className="relative pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden bg-[#181411]">
                {/* Authentic Moroccan Roadtrip Backdrop (Atlas Mountains & Golden Hour) */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-gradient-to-b from-[#181411] via-[#241c18] to-[#12161E]">
                    <picture>
                        <source media="(max-width: 768px)" srcSet="/images/hero-morocco-mobile.webp" />
                        <img
                            src="/images/hero-morocco.webp"
                            width={1440}
                            height={810}
                            fetchPriority="high"
                            loading="eager"
                            decoding="async"
                            alt="Location de voiture au Maroc sans caution ZwinCar"
                            className="w-full h-[640px] md:h-[740px] object-cover object-center opacity-90 filter brightness-[0.85] contrast-105"
                        />
                    </picture>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/45 to-[#FAF7F2]"></div>
                </div>

                <div className="container mx-auto px-4 max-w-6xl relative z-10">
                    {/* Top Pill */}
                    <div className="flex justify-center mb-5 sm:mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] sm:text-xs font-bold text-white tracking-wide shadow-xs">
                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E58B24]"></span>
                            <span className="truncate">
                                {isEn
                                    ? "MOROCCO • DIRECT RESERVATION FROM TOP LOCAL VERIFIED FLEETS"
                                    : isEs
                                    ? "MARRUECOS • RESERVA DIRECTA CON LOS MEJORES OPERADORES LOCALES"
                                    : isNl
                                    ? "MAROKKO • DIRECTE RESERVERING BIJ DE BESTE LOKALE VLOOT"
                                    : "MAROC • RÉSERVATION DIRECTE AUPRÈS DES MEILLEURS LOUEURS LOCAUX"}
                            </span>
                        </div>
                    </div>

                    {/* Headline */}
                    <div className="text-center max-w-4xl mx-auto mb-10 text-white">
                        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.08] mb-6 drop-shadow-sm text-white">
                            {isEn ? (
                                <>
                                    Car Rental Morocco:{" "}
                                    <span className="text-[#E58B24]">No Deposit Hold</span>
                                </>
                            ) : isEs ? (
                                <>
                                    Alquiler Coche Marruecos:{" "}
                                    <span className="text-[#E58B24]">Sin Fianza CB</span>
                                </>
                            ) : isNl ? (
                                <>
                                    Autohuur Marokko:{" "}
                                    <span className="text-[#E58B24]">Zonder Borg</span>
                                </>
                            ) : (
                                <>
                                    Location Voiture Maroc :{" "}
                                    <span className="text-[#E58B24]">Sans Caution CB</span>
                                </>
                            )}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-xs font-medium">
                            {isEn
                                ? "Marrakech, Agadir, Casablanca, Tangier, Fes, Ouarzazate. Recent vehicles, debit cards and cash accepted. Direct key handover at the parking lot with zero counter wait."
                                : isEs
                                ? "Marrakech, Agadir, Casablanca, Tánger, Fez, Ouarzazate. Vehículos recientes, tarjetas de débito y efectivo aceptados. Entrega de llaves directa en parking sin mostrador."
                                : isNl
                                ? "Marrakech, Agadir, Casablanca, Tanger, Fez, Ouarzazate. Recente auto's, pinpas en contant geaccepteerd. Directe sleuteloverdracht op de parkeerplaats zonder wachtrij."
                                : "Marrakech, Agadir, Casablanca, Tanger, Fès, Ouarzazate. Véhicules récents, cartes de débit et espèces acceptées. Remise des clés directe au parking sans guichet."}
                        </p>

                        {/* 3 Clear Guarantees */}
                        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 text-[11px] sm:text-xs font-medium text-white/90 max-w-full px-2">
                            <span className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15 shadow-2xs">
                                <ShieldCheck size={14} className="text-[#E58B24] shrink-0" />
                                <span>
                                    {isEn
                                        ? "€0 deposit (Zero Excess) or €300"
                                        : isEs
                                        ? "0 € fianza (Franquicia Cero) o 300 €"
                                        : isNl
                                        ? "€ 0 borg (Nul Risico) of € 300"
                                        : "Caution 0 € (Franchise Zéro) ou 300 €"}
                                </span>
                            </span>
                            <span className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15 shadow-2xs">
                                <KeyRound size={14} className="text-white/80 shrink-0" />
                                <span>
                                    {isEn
                                        ? "Model or equivalent guaranteed"
                                        : isEs
                                        ? "Modelo o equivalente garantizado"
                                        : isNl
                                        ? "Model of gelijkwaardig gegarandeerd"
                                        : "Modèle ou équivalent garanti"}
                                </span>
                            </span>
                            <span className="flex items-center gap-1.5 bg-black/45 backdrop-blur-md px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-white/15 shadow-2xs">
                                <CreditCard size={14} className="text-white/80 shrink-0" />
                                <span>
                                    {isEn
                                        ? "Debit & Cash accepted"
                                        : isEs
                                        ? "Débito y Efectivo aceptados"
                                        : isNl
                                        ? "Pinpas & Contant geaccepteerd"
                                        : "Débit & Espèces acceptés"}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Interactive Booking Widget */}
                    <BookingWidget locale={locale} />

                    {/* Roadtrip Inspiration Gallery (Photos Hautes Définitions pour Donner Envie) */}
                    <div className="mt-14 pt-8 border-t border-[#E7DFD5]">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C9572C] block">
                                    {isEn ? "Roadtrip Inspiration" : isEs ? "Inspiración Roadtrip" : isNl ? "Roadtrip Inspiratie" : "Inspiration Roadtrip"}
                                </span>
                                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                    {isEn ? "Morocco at your own pace, in total freedom" : isEs ? "Marruecos a su propio ritmo, con total libertad" : isNl ? "Marokko op uw eigen tempo, in alle vrijheid" : "Le Maroc à votre rythme, en toute liberté"}
                                </h2>
                            </div>
                            <span className="text-xs text-slate-500 hidden sm:inline">
                                {isEn ? "Unlimited mileage on all our vehicles" : isEs ? "Kilometraje ilimitado en todos los vehículos" : isNl ? "Onbeperkte kilometers op alle voertuigen" : "Kilométrage illimité sur tous nos véhicules"}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            {/* Photo 1: Col du Tichka & Gorges du Dadès */}
                            <div className="group relative h-48 sm:h-64 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E7DFD5] shadow-xs">
                                <img
                                    src="/images/hero-morocco-mobile.webp"
                                    width={400}
                                    height={260}
                                    loading="lazy"
                                    decoding="async"
                                    alt="Col du Tichka et Gorges du Dadès Haut Atlas Maroc"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <div className="text-[10px] uppercase font-bold text-[#E58B24]">
                                        Haut-Atlas • N9
                                    </div>
                                    <div className="text-xs sm:text-sm font-black leading-tight">
                                        Col du Tichka & Dadès
                                    </div>
                                    <div className="text-[10px] text-white/80 mt-0.5">
                                        {isEn ? "Hairpins & scenic summits" : isEs ? "Curvas y puertos espectaculares" : isNl ? "Haarspeldbochten & bergpassen" : "Lacets & panoramas spectaculaires"}
                                    </div>
                                </div>
                            </div>

                            {/* Photo 2: Taghazout Coast */}
                            <div className="group relative h-48 sm:h-64 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E7DFD5] shadow-xs">
                                <img
                                    src="https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=480&q=70"
                                    width={400}
                                    height={260}
                                    loading="lazy"
                                    decoding="async"
                                    alt="Taghazout et Côte Atlantique"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <div className="text-[10px] uppercase font-bold text-[#E58B24]">
                                        Océan Atlantique • N1
                                    </div>
                                    <div className="text-xs sm:text-sm font-black leading-tight">
                                        Taghazout & Imsouane
                                    </div>
                                    <div className="text-[10px] text-white/80 mt-0.5">
                                        {isEn ? "Surftrips & golden cliffs" : isEs ? "Surftrips y acantilados dorados" : isNl ? "Surftrip & gouden kliffen" : "Surftrip & falaises dorées"}
                                    </div>
                                </div>
                            </div>

                            {/* Photo 3: Agafay Desert */}
                            <div className="group relative h-48 sm:h-64 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E7DFD5] shadow-xs">
                                <img
                                    src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=480&q=70"
                                    width={400}
                                    height={260}
                                    loading="lazy"
                                    decoding="async"
                                    alt="Désert d'Agafay en 4x4"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <div className="text-[10px] uppercase font-bold text-[#E58B24]">
                                        Pistes Carrossables
                                    </div>
                                    <div className="text-xs sm:text-sm font-black leading-tight">
                                        Désert d'Agafay
                                    </div>
                                    <div className="text-[10px] text-white/80 mt-0.5">
                                        {isEn ? "Camps & sunset dunes" : isEs ? "Campamentos y puesta de sol" : isNl ? "Kampen & zonsondergang" : "Bivouacs & coucher de soleil"}
                                    </div>
                                </div>
                            </div>

                            {/* Photo 4: Marrakech Medina */}
                            <div className="group relative h-48 sm:h-64 rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E7DFD5] shadow-xs">
                                <img
                                    src="https://images.unsplash.com/photo-1597212618440-806262de4f6b?auto=format&fit=crop&w=480&q=70"
                                    width={400}
                                    height={260}
                                    loading="lazy"
                                    decoding="async"
                                    alt="Marrakech Médina et Palmeraie"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3 text-white">
                                    <div className="text-[10px] uppercase font-bold text-[#E58B24]">
                                        Marrakech • Menara
                                    </div>
                                    <div className="text-xs sm:text-sm font-black leading-tight">
                                        Palmeraie & Remparts
                                    </div>
                                    <div className="text-[10px] text-white/80 mt-0.5">
                                        {isEn ? "Direct delivery to your Riad" : isEs ? "Entrega directa a su Riad" : isNl ? "Directe bezorging bij uw Riad" : "Livraison directe au Riad"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VEHICLE CATALOG SECTION */}
            <VehicleCatalog locale={locale} />

            {/* HOW IT WORKS — 3 SIMPLE STEPS */}
            <section className="py-16 bg-[#FAF7F2] border-t border-[#E7DFD5]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#C9572C] block mb-2">
                            {isEn ? "3-Step Handover" : isEs ? "Proceso en 3 Pasos" : isNl ? "In 3 Stappen" : "Parcours en 3 Étapes"}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {isEn
                                ? "How ZwinCar works at the airport"
                                : isEs
                                ? "Cómo funciona ZwinCar en el aeropuerto"
                                : isNl
                                ? "Hoe ZwinCar werkt op de luchthaven"
                                : "Comment ça marche dès votre arrivée"}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {[
                            {
                                step: "01",
                                title: isEn
                                    ? "Book in 2 minutes"
                                    : isEs
                                    ? "Reserve en 2 minutos"
                                    : isNl
                                    ? "Boek in 2 minuten"
                                    : "Réservez en 2 minutes",
                                body: isEn
                                    ? "Pick your city, dates and vehicle. Lock your price with a 20% deposit (or compare verified partner rates) and receive your voucher immediately."
                                    : isEs
                                    ? "Elija ciudad, fechas y vehículo. Fije su precio con un 20 % de anticipo (o compare socios verificados) y reciba su bono al instante."
                                    : isNl
                                    ? "Kies stad, data en auto. Zet uw prijs vast met 20% aanbetaling (of vergelijk partnerdeals) en ontvang direct uw voucher."
                                    : "Choisissez votre ville, vos dates et votre modèle. Bloquez votre tarif avec 20 % d'acompte (ou comparez nos partenaires vérifiés) et recevez votre bon.",
                            },
                            {
                                step: "02",
                                title: isEn
                                    ? "5-minute key handover"
                                    : isEs
                                    ? "Entrega de llaves en 5 min"
                                    : isNl
                                    ? "Sleuteloverdracht in 5 min"
                                    : "Remise des clés en 5 min",
                                body: isEn
                                    ? "Your flight is tracked live. Meet your local agent at arrivals, inspect the car together on smartphone and skip the terminal queues."
                                    : isEs
                                    ? "Seguimos su vuelo en directo. Encuentre a su agente a la salida de llegadas, revise el coche en móvil y evite colas en mostrador."
                                    : isNl
                                    ? "Uw vlucht wordt live gevolgd. Ontmoet de lokale agent bij aankomst, doe de snelle inspectie en sla de balierij over."
                                    : "Votre vol est suivi en direct. Retrouvez l'agent à la sortie du terminal, faites le tour du véhicule sur mobile et évitez la queue au guichet.",
                            },
                            {
                                step: "03",
                                title: isEn
                                    ? "Drive free, express return"
                                    : isEs
                                    ? "Conduzca libre, devolución rápida"
                                    : isNl
                                    ? "Rijd vrij, snelle retour"
                                    : "Roulez librement, retour express",
                                body: isEn
                                    ? "Unlimited mileage across Morocco, no €1,500 card hold, 7/7 WhatsApp assistance and fast check-out before your flight."
                                    : isEs
                                    ? "Kilometraje ilimitado por Marruecos, sin bloqueo de 1.500 €, asistencia WhatsApp 7/7 y devolución rápida antes de su vuelo."
                                    : isNl
                                    ? "Onbeperkte kilometers in Marokko, geen € 1.500 blokkade, 7/7 WhatsApp-support en snelle check-out voor uw vlucht."
                                    : "Kilométrage illimité partout au Maroc, zéro blocage de 1 500 €, assistance WhatsApp 7j/7 et restitution rapide avant votre vol.",
                            },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className="rounded-3xl bg-white border border-[#E7DFD5] p-6 shadow-2xs space-y-2.5"
                            >
                                <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#FAF7F2] border border-[#E7DFD5] text-xs font-black font-mono text-[#C9572C]">
                                    {item.step}
                                </span>
                                <h3 className="text-base font-black text-slate-900">
                                    {item.title}
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                    {item.body}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* WHY ZWINCAR / CONTRAST SECTION (ZERO AI SLOP, HIGH TASTE) */}
            <section id="zero-caution" className="py-20 bg-white border-y border-[#E7DFD5]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9572C] mb-2">
                            <ShieldCheck size={14} />
                            {isEn ? "The ZwinCar Advantage" : isEs ? "La Ventaja ZwinCar" : isNl ? "Het ZwinCar Voordeel" : "La Différence ZwinCar"}
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                            {isEn
                                ? "Why travelers skip the airport rental desks"
                                : isEs
                                ? "Por qué evitar los mostradores de alquiler tradicionales"
                                : isNl
                                ? "Waarom reizigers traditionele balies vermijden"
                                : "Pourquoi éviter les guichets d'aéroport"}
                        </h2>
                        <p className="text-sm sm:text-base text-slate-600 mt-3">
                            {isEn
                                ? "Arriving in Marrakech or Casablanca, the classic trap snaps shut: debit cards rejected, 1 hour waiting in line, and €300 in forced insurance. Here is how ZwinCar changes everything."
                                : isEs
                                ? "Al llegar a Marrakech o Casablanca, la trampa clásica se activa: tarjeta de débito rechazada, 1 hora de cola y 300 € de seguro forzado. Así es como ZwinCar cambia las cosas."
                                : isNl
                                ? "Bij aankomst in Marrakech of Casablanca slaat de valstrik dicht: pinpas geweigerd, 1 uur in de rij en € 300 aan opgedrongen verzekeringen. Dit is hoe ZwinCar het anders doet."
                                : "En arrivant à Marrakech ou Casablanca, le piège classique se referme : carte de débit refusée, 1h de file d'attente et 300€ d'assurance forcée. Voici comment ZwinCar change la donne."}
                        </p>
                    </div>

                    {/* Dual Comparison Cards */}
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* The Bad Way (Airport Desks) */}
                        <div className="rounded-3xl bg-slate-50 border border-slate-200 p-8 text-left space-y-5">
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                        {isEn ? "Legacy Broker Model" : isEs ? "Modelo Tradicional" : isNl ? "Traditioneel Model" : "Modèle Classique"}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {isEn ? "Major Chains & Web Brokers" : isEs ? "Grandes Franquicias y Comparadores" : isNl ? "Grote Ketens & Vergelijkers" : "Grands Loueurs & Courtiers Web"}
                                    </h3>
                                </div>
                                <span className="p-2 rounded-full bg-red-100 text-red-600">
                                    <XCircle size={22} />
                                </span>
                            </div>

                            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600">
                                <li className="flex items-start gap-2.5">
                                    <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                    <span>
                                        {isEn ? (
                                            <><strong>€1,500 to €2,500 blocked credit card hold</strong> (eating up your vacation budget limit).</>
                                        ) : isEs ? (
                                            <><strong>1.500 € a 2.500 € de fianza bloqueada</strong> en su tarjeta bancaria.</>
                                        ) : isNl ? (
                                            <><strong>€ 1.500 tot € 2.500 borg geblokkeerd</strong> op uw creditcard.</>
                                        ) : (
                                            <><strong>1 500 € à 2 500 € de caution bloquée</strong> sur votre carte bancaire (détruit le plafond de vos vacances).</>
                                        )}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                    <span>
                                        {isEn ? (
                                            <><strong>Debit cards rejected</strong> to force you to pay €35/day in excess waiver insurance.</>
                                        ) : isEs ? (
                                            <><strong>Rechazo de tarjetas de DÉBITO</strong> para obligarle a contratar seguros costosos.</>
                                        ) : isNl ? (
                                            <><strong>Weigering van PINPASSEN</strong> om dure extra verzekeringen op te dringen.</>
                                        ) : (
                                            <><strong>Refus des cartes de DÉBIT</strong> (90% des cartes françaises) pour vous forcer à payer 35€/jour d'assurance rachat franchise.</>
                                        )}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                    <span>
                                        {isEn ? (
                                            <><strong>Endless queues</strong>: 45 to 60 minutes waiting at the airport desk after your flight.</>
                                        ) : isEs ? (
                                            <><strong>Esperas interminables</strong>: 45 a 60 minutos de cola en el mostrador tras su vuelo.</>
                                        ) : isNl ? (
                                            <><strong>Eindeloze rijen</strong>: 45 tot 60 minuten wachten aan de balie na uw vlucht.</>
                                        ) : (
                                            <><strong>Attente interminable</strong> : 45 à 60 minutes de queue au guichet après 3h de vol.</>
                                        )}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                    <span>
                                        {isEn ? (
                                            <><strong>Random vehicle</strong>: You reserve a Clio, you receive a tired substitute with 160,000 km.</>
                                        ) : isEs ? (
                                            <><strong>Vehículo aleatorio</strong>: Reserva un modelo y recibe un sustituto desgastado.</>
                                        ) : isNl ? (
                                            <><strong>Willekeurige auto</strong>: U reserveert een categorie en krijgt een versleten vervanger.</>
                                        ) : (
                                            <><strong>Véhicule aléatoire</strong> : Vous réservez une Clio, vous repartez avec une citadine fatiguée de 160 000 km.</>
                                        )}
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* The ZwinCar Way */}
                        <div className="rounded-3xl bg-[#FAF7F2] border-2 border-[#C9572C]/40 p-8 text-left space-y-5 relative shadow-sm">
                            <div className="flex items-center justify-between pb-4 border-b border-[#E7DFD5]">
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider text-[#C9572C]">
                                        {isEn ? "The ZwinCar Experience" : isEs ? "La Experiencia ZwinCar" : isNl ? "De ZwinCar Ervaring" : "L'Expérience ZwinCar"}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {isEn ? "Verified Local Fleets & Zero Deposit" : isEs ? "Agencias Locales Verificadas y Cero Fianza" : isNl ? "Geverifieerde Lokale Vloot & Geen Borg" : "Agences Locales Vérifiées & Zéro Caution"}
                                    </h3>
                                </div>
                                <span className="p-2 rounded-full bg-emerald-100 text-emerald-700">
                                    <CheckCircle2 size={22} />
                                </span>
                            </div>

                            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-700">
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                    <span>
                                        {isEn ? (
                                            <><strong>No €1,500 bank hold</strong>: €0 deposit with Zero Excess (or €300 standard). Debit cards & cash fully accepted.</>
                                        ) : isEs ? (
                                            <><strong>Sin bloqueo de 1.500 €</strong>: 0 € fianza con Franquicia Cero (o 300 € estándar). Débito y efectivo aceptados.</>
                                        ) : isNl ? (
                                            <><strong>Geen € 1.500 blokkade</strong>: € 0 borg met Nul Eigen Risico (of € 300 standaard). Pin & contant geaccepteerd.</>
                                        ) : (
                                            <><strong>Aucun blocage de 1 500 €</strong> : 0 € de caution avec Franchise Zéro (ou 300 € standard). Cartes de débit & espèces acceptées.</>
                                        )}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                    <span>
                                        {isEn ? (
                                            <><strong>VIP meet & greet upon arrival</strong>: an agent meets you with a personalized name board at the exit. On your way in 5 minutes.</>
                                        ) : isEs ? (
                                            <><strong>Recepción VIP a la llegada</strong>: un agente le espera con cartel nominativo a la salida. Salida en 5 minutos.</>
                                        ) : isNl ? (
                                            <><strong>VIP ontvangst bij aankomst</strong>: een agent wacht u op met een naambordje bij de uitgang. Vertrek binnen 5 minuten.</>
                                        ) : (
                                            <><strong>Accueil VIP aux arrivées</strong> : un agent vous attend avec une pancarte nominative à la sortie de l'aéroport. Départ en 5 minutes.</>
                                        )}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                    <span>
                                        {isEn ? (
                                            <><strong>Model guaranteed</strong>: you get the car you booked, or a same-category equivalent with the same gearbox, or a free upgrade.</>
                                        ) : isEs ? (
                                            <><strong>Modelo garantizado</strong>: recibe el coche reservado, o un equivalente de la misma categoría y caja de cambios, o una mejora gratis.</>
                                        ) : isNl ? (
                                            <><strong>Gegarandeerd model</strong>: u krijgt de geboekte auto, of een gelijkwaardige uit dezelfde categorie met dezelfde versnellingsbak, of een gratis upgrade.</>
                                        ) : (
                                            <><strong>Modèle garanti</strong> : vous recevez la voiture réservée, ou une équivalente de même catégorie et même boîte, ou un surclassement offert.</>
                                        )}
                                    </span>
                                </li>
                                <li className="flex items-start gap-2.5">
                                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                                    <span>
                                        {isEn ? (
                                            <><strong>Free delivery to your Riad or Hotel</strong>: no need to navigate city traffic to pick up your keys.</>
                                        ) : isEs ? (
                                            <><strong>Entrega gratuita en su Riad u Hotel</strong>: sin desplazamientos para recoger las llaves.</>
                                        ) : isNl ? (
                                            <><strong>Gratis bezorging bij uw Riad of Hotel</strong>: geen gedoe om sleutels op te halen.</>
                                        ) : (
                                            <><strong>Livraison offerte à votre Riad ou Hôtel</strong> : pas besoin de traverser la ville pour récupérer les clés.</>
                                        )}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* POPULAR HUBS SHOWCASE */}
            <section className="py-20 bg-[#FAF7F2]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
                        <div>
                            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9572C] mb-2">
                                <MapPin size={14} />
                                {isEn ? "Moroccan National Network" : isEs ? "Red Nacional de Marruecos" : isNl ? "Nationaal Marokkaans Netwerk" : "Réseau National Marocain"}
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                                {isEn ? "Our Airport & City Pickup Hubs" : isEs ? "Nuestros Aeropuertos y Ciudades de Recogida" : isNl ? "Onze Ophaallocaties & Luchthavens" : "Nos Aéroports & Villes de Prise en Charge"}
                            </h2>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-500 max-w-md">
                            {isEn
                                ? "Direct delivery as you step off the plane, or drop off in another city for your cross-Morocco roadtrips."
                                : isEs
                                ? "Entrega directa al bajar del avión o devolución en otra ciudad para su viaje por carretera."
                                : isNl
                                ? "Directe bezorging zodra u landt, of inleveren in een andere stad voor uw roadtrip door Marokko."
                                : "Livraison directe dès la descente d'avion ou restitution dans une autre ville pour vos roadtrips."}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {MOROCCAN_HUBS.slice(0, 4).map((hub) => (
                            <Link
                                key={hub.slug}
                                href={locale === "fr" ? `/maroc/${hub.slug}` : `/${locale}/${hub.slug}`}
                                className="group rounded-3xl bg-white border border-[#E7DFD5] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                <div className="relative h-44 w-full overflow-hidden">
                                    <img
                                        src={hub.heroImage}
                                        alt={`Location voiture ${hub.name}`}
                                        width={640}
                                        height={426}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3 bg-[#12161E]/80 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-full font-bold">
                                        {hub.airportCode}
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 group-hover:text-[#C9572C] transition-colors">
                                            {hub.name}
                                        </h3>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                            {hub.description}
                                        </p>
                                    </div>
                                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                        <span className="font-semibold text-slate-700">
                                            {isEn ? "From" : isEs ? "Desde" : isNl ? "Vanaf" : "Dès"}{" "}
                                            <strong className="text-slate-900 font-black">{hub.avgDailyPriceEur}€</strong> / {isEn ? "day" : isEs ? "día" : isNl ? "dag" : "jour"}
                                        </span>
                                        <span className="text-[#C9572C] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                            {isEn ? "Explore" : isEs ? "Explorar" : isNl ? "Bekijken" : "Explorer"} <ArrowRight size={13} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* PARTNER ACQUISITION STRIP */}
            <section className="py-10 bg-white border-t border-[#E7DFD5]">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="rounded-3xl bg-[#12161E] text-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-1.5 max-w-2xl">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#E58B24]">
                                {isEn ? "Partner Agencies" : isEs ? "Agencias Asociadas" : isNl ? "Partnerbedrijven" : "Loueurs Partenaires"}
                            </span>
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                                {isEn
                                    ? "Own a local rental fleet in Morocco?"
                                    : isEs
                                    ? "¿Tiene una flota de alquiler en Marruecos?"
                                    : isNl
                                    ? "Heeft u een lokale autoverhuurvloot in Marokko?"
                                    : "Vous gérez une flotte de location au Maroc ?"}
                            </h2>
                            <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                                {isEn
                                    ? "Receive pre-qualified European bookings directly on WhatsApp with 20% guaranteed deposit."
                                    : isEs
                                    ? "Reciba reservas europeas precalificadas directamente por WhatsApp con anticipo garantizado."
                                    : isNl
                                    ? "Ontvang gekwalificeerde Europese boekingen rechtstreeks via WhatsApp met aanbetaling."
                                    : "Recevez des réservations européennes qualifiées directement sur WhatsApp avec acompte de 20 % sécurisé."}
                            </p>
                        </div>
                        <Link
                            href={isEn ? "/en/vendor/register" : "/vendor/register"}
                            className="shrink-0 h-11 px-5 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition"
                        >
                            <span>
                                {isEn ? "Join ZwinCar" : isEs ? "Unirse a ZwinCar" : isNl ? "Word partner" : "Devenir partenaire"}
                            </span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* AEO / GEO ADVANCED DIRECT ANSWER SECTION */}
            <LocalAeoSection hubSlug="marrakech" />
            </main>

            <MobileHomeStickyBar locale={locale} minPriceEur={26} />

            {/* Footer */}
            <Footer locale={locale} />
        </div>
    );
}
