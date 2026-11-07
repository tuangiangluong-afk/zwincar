import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Connexion Hors Ligne • ZwinCar Maroc",
    description: "Guide d'assistance hors ligne ZwinCar Maroc : accès aux vouchers, numéros d'urgence et consignes de remise des clés aux aéroports marocains.",
    robots: { index: false, follow: true },
};

export default function OfflinePage() {
    return (
        <main className="flex min-h-[75vh] flex-col items-center justify-center gap-6 px-4 py-16 text-center max-w-2xl mx-auto">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#12161E] text-xl font-black text-white shadow-md">
                Z
            </div>
            
            <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Vous êtes actuellement hors ligne
                </h1>
                <p className="text-sm text-slate-600 leading-relaxed max-w-lg mx-auto">
                    Votre connexion Internet est interrompue. Si vous avez déjà ouvert votre bon de réservation ZwinCar dans ce navigateur, il reste consultable dans le cache local de votre appareil.
                </p>
            </div>

            {/* Offline Airport & Emergency Assistance Box */}
            <div className="w-full text-left bg-white border border-[#E7DFD5] rounded-3xl p-6 shadow-xs space-y-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-center sm:text-left">
                    Consignes d&apos;arrivée à l&apos;aéroport sans connexion Internet
                </h2>
                
                <ul className="text-xs text-slate-600 space-y-2.5 list-disc pl-5">
                    <li>
                        <strong>Wi-Fi Gratuit des Terminaux ONDA :</strong> Tous les aéroports internationaux marocains (Marrakech-Ménara RAK, Casablanca Mohammed V CMN, Agadir Al Massira AGA, Tanger Ibn Battouta TNG et Fès Saïss FEZ) offrent un accès Wi-Fi gratuit sans mot de passe dans le hall des arrivées.
                    </li>
                    <li>
                        <strong>Point de Rendez-vous Loueur :</strong> Votre agent partenaire local vous attend directement après la sortie des douanes avec une pancarte à votre nom. Le contrat physique papier et l&apos;état des lieux contradictoire sont établis directement au véhicule.
                    </li>
                    <li>
                        <strong>Achat de Carte SIM et Retrait Dirhams :</strong> Des kiosques d&apos;opérateurs marocains (Maroc Telecom, Inwi, Orange) ainsi que des distributeurs automatiques (GAB) sont situés dans le hall des arrivées immédiatement après la récupération des bagages pour activer votre connexion Internet 4G en 3 minutes.
                    </li>
                    <li>
                        <strong>Navigation GPS Hors Ligne :</strong> Si vous n&apos;avez pas de forfait data international, pensez à utiliser Google Maps en téléchargeant la zone Maroc en mode hors-ligne, ou installez l&apos;application gratuite Maps.me ou Organic Maps avec la carte du Maroc déjà enregistrée.
                    </li>
                    <li>
                        <strong>Vol Retardé ou Arrivée Décalée :</strong> Grâce au numéro de vol renseigné dans votre réservation, votre agent local suit l&apos;atterrissage réel de votre avion sur FlightRadar24 et maintient votre véhicule sans surcoût même en cas de retard de plusieurs heures.
                    </li>
                    <li>
                        <strong>Numéros d&apos;Urgence Maroc (Appels GSM gratuits sans data) :</strong>
                        <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px] text-slate-800">
                            <span className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5]">Gendarmerie Royale : <strong>177</strong></span>
                            <span className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5]">Police en ville : <strong>19</strong></span>
                            <span className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5]">Assistance Autoroutes ADM : <strong>5050</strong></span>
                            <span className="p-2 rounded-lg bg-[#FAF7F2] border border-[#E7DFD5]">Protection Civile (SAMU) : <strong>15</strong></span>
                        </div>
                    </li>
                </ul>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                    href="/"
                    className="rounded-xl bg-[#C9572C] hover:bg-[#B24922] px-5 py-2.5 text-sm font-bold text-white transition active:scale-95"
                >
                    Réessayer la connexion
                </Link>
                <a
                    href="https://wa.me/212600000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-[#E7DFD5] bg-white hover:bg-slate-50 px-5 py-2.5 text-sm font-bold text-slate-800 transition active:scale-95"
                >
                    Assistance WhatsApp 24/7
                </a>
            </div>
        </main>
    );
}
