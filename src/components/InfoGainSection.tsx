import { CityConfig } from "@/lib/db";
import { getTravelEstimates, getDirectAnswers, getExecutiveSummary } from "@/lib/info-gain";
import { Route, Timer, Euro, Quote } from "lucide-react";

interface InfoGainSectionProps {
    city: CityConfig;
}

/**
 * INFORMATION GAIN — la section "chiffres réels par ville" :
 * - Tableau des distances / durées / prix vers les hubs (calculé sur les
 *   coordonnées GPS réelles de la ville).
 * - Réponses directes au format AEO (citées par Google et les IA).
 * - Résumé exécutif autonome.
 */
export function InfoGainSection({ city }: InfoGainSectionProps) {
    const estimates = getTravelEstimates(city);
    const answers = getDirectAnswers(city);
    const summary = getExecutiveSummary(city);

    if (estimates.length === 0) return null;

    return (
        <section className="py-20 bg-white border-t border-neutral-100">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Executive summary — bloc citable */}
                <div className="mb-12 p-6 md:p-8 rounded-3xl bg-neutral-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
                    <div className="flex items-start gap-4 relative z-10">
                        <Quote size={24} className="text-blue-400 shrink-0 mt-1" />
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                                En bref — {city.city}
                            </p>
                            <p className="text-neutral-200 leading-relaxed">{summary}</p>
                        </div>
                    </div>
                </div>

                {/* Tableau des trajets réels */}
                <div className="mb-14">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
                            <Route size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight">
                                Distances & Tarifs depuis {city.city}
                            </h2>
                            <p className="text-sm text-neutral-500 mt-1">
                                Estimations calculées sur la distance réelle entre {city.city} et chaque destination.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-neutral-200 shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                                    <th className="px-5 py-4 font-bold">Destination</th>
                                    <th className="px-5 py-4 font-bold"><span className="inline-flex items-center gap-1"><Route size={14} /> Distance</span></th>
                                    <th className="px-5 py-4 font-bold"><span className="inline-flex items-center gap-1"><Timer size={14} /> Durée est.</span></th>
                                    <th className="px-5 py-4 font-bold"><span className="inline-flex items-center gap-1"><Euro size={14} /> Prix taxi est.</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {estimates.map((e) => (
                                    <tr key={e.slug} className="border-b border-neutral-100 last:border-0 hover:bg-amber-50/40 transition">
                                        <td className="px-5 py-4 font-semibold text-neutral-900">{e.destination}</td>
                                        <td className="px-5 py-4 text-neutral-600">{e.distanceKm} km</td>
                                        <td className="px-5 py-4 text-neutral-600">≈ {e.durationMin} min</td>
                                        <td className="px-5 py-4">
                                            <span className="inline-block px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold">
                                                {e.priceDisplay}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="mt-3 text-xs text-neutral-400">
                        Tarifs indicatifs jour (prise en charge + tarif kilométrique + marge trafic). Les forfaits gares/aéroports sont fixes et confirmés à la réservation.
                    </p>
                </div>

                {/* Réponses directes (AEO) */}
                <div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-neutral-900 tracking-tight mb-8">
                        Réponses directes sur le taxi à {city.city}
                    </h2>
                    <div className="space-y-4">
                        {answers.map((a, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 hover:border-blue-200 transition">
                                <h3 className="font-bold text-neutral-900 mb-2 flex items-center gap-2">
                                    <span className="text-blue-600">Q.</span> {a.question}
                                </h3>
                                <p className="text-neutral-600 leading-relaxed text-sm md:text-base">
                                    {a.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
