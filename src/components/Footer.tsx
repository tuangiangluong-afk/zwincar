import Link from "next/link";
import Logo from "@/components/Logo";
import { MOROCCAN_HUBS, VEHICLE_FLEET } from "@/lib/morocco-data";
import { ShieldCheck, MessageCircle, MapPin, Check } from "lucide-react";

interface FooterProps {
    config?: any;
}

export default function Footer({ config }: FooterProps = {}) {
    return (
        <footer className="bg-[#12161E] text-slate-300 pt-16 pb-12 border-t border-slate-800">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Top Value Banner */}
                <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E58B24]">
                            <ShieldCheck size={14} />
                            Le Standard ZwinCar
                        </div>
                        <h4 className="text-lg md:text-xl font-bold text-white tracking-tight">
                            La sérénité totale pour votre roadtrip au Maroc
                        </h4>
                        <p className="text-xs text-slate-400 max-w-xl">
                            Aucun blocage de carte bancaire, clés remises en main propre dès l'atterrissage et assistance locale francophone 24h/24.
                        </p>
                    </div>

                    <a
                        href="https://wa.me/212600000000?text=Bonjour%20ZwinCar,%20je%20souhaite%20une%20assistance"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 rounded-2xl bg-[#C9572C] hover:bg-[#B24922] text-white text-xs font-bold tracking-wide transition-all shrink-0 flex items-center gap-2"
                    >
                        <MessageCircle size={15} />
                        <span>Contacter notre équipe locale</span>
                    </a>
                </div>

                {/* 4 Column Nav Mesh */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 text-xs">
                    {/* Col 1: Brand & Promise */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <Logo variant="full" theme="light" size="sm" />
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Plateforme de réservation de voitures au Maroc auprès d'agences locales indépendantes vérifiées. Zéro caution bloquée sur carte de crédit.
                        </p>
                        <div className="text-[11px] text-slate-500 font-mono">
                            Marrakech • Casablanca • Agadir • Tanger • Fès
                        </div>
                    </div>

                    {/* Col 2: Hubs & Aéroports */}
                    <div>
                        <h5 className="font-bold uppercase tracking-wider text-white text-[11px] mb-3">
                            Aéroports & Villes
                        </h5>
                        <ul className="space-y-2 text-slate-400">
                            {MOROCCAN_HUBS.map((hub) => (
                                <li key={hub.slug}>
                                    <Link
                                        href={`/maroc/${hub.slug}`}
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
                            Véhicules Recommandés
                        </h5>
                        <ul className="space-y-2 text-slate-400">
                            {VEHICLE_FLEET.slice(0, 5).map((v) => (
                                <li key={v.id}>
                                    <Link
                                        href={`/vehicules/${v.id}`}
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
                            Transparence & Guides
                        </h5>
                        <ul className="space-y-2 text-slate-400">
                            <li>
                                <Link href="/guides" className="hover:text-white transition flex items-center gap-1.5">
                                    <span>Guides & Conseils Routiers</span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C9572C]/20 text-[#C9572C] font-mono">2026</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/llms.txt" className="hover:text-white transition flex items-center gap-1.5">
                                    <span>Documentation IA (llms.txt)</span>
                                </Link>
                            </li>
                            <li>
                                <Link href="/#zero-caution" className="hover:text-white transition">
                                    Garantie 0€ Caution CB
                                </Link>
                            </li>
                            <li>
                                <Link href="/vendor/login" className="hover:text-white transition font-medium text-slate-300">
                                    Espace Loueur Partenaire
                                </Link>
                            </li>
                            <li>
                                <Link href="/vendor/register" className="hover:text-white transition text-[#E58B24]">
                                    Rejoindre le Réseau ZwinCar
                                </Link>
                            </li>
                            <li>
                                <Link href="/cgv" className="hover:text-white transition">
                                    Conditions Générales
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
                    <div>
                        © {new Date().getFullYear()} ZwinCar.com • Tous droits réservés.
                    </div>
                    <div className="flex items-center gap-4">
                        <span>Paiement sécurisé par Stripe</span>
                        <span>•</span>
                        <span>Assistance WhatsApp 24/7</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
export { Footer };
