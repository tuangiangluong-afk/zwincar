import Link from "next/link";
import { SEO_SERVICES, SEO_DESTINATIONS } from "@/lib/seo-data";
import { SEO_ROUTES } from "@/lib/seo-routes";
import { NATIONAL_CONFIG } from "@/config/national";
import { slugify } from "@/lib/slugify";
import { CityConfig, CITIES } from "@/lib/db";

interface InternalMeshProps {
    city?: string;
    config?: CityConfig;
}

export function InternalMesh({ city, config }: InternalMeshProps) {
    // 1. Contextual Routes (Geo-filtered)
    const filteredRoutes = city
        ? SEO_ROUTES.filter(r => r.start.includes(city) || r.end.includes(city) || r.slug.includes(slugify(city)))
        : SEO_ROUTES.slice(0, 10);
    const finalRoutes = filteredRoutes; // Explicitly no fallback if no match found for this city

    // 2. Contextual POIs (Local Monuments vs National Fallback)
    const monuments = config?.points_of_interest?.monuments.length
        ? config.points_of_interest.monuments.slice(0, 5) // Show top 5 local monuments
        : NATIONAL_CONFIG.points_of_interest.monuments.slice(0, 5); // Fallback to Paris monuments if no local data

    const secondaryPois = config?.neighborhoods?.length
        ? config.neighborhoods.slice(0, 3)
        : NATIONAL_CONFIG.points_of_interest.nightlife.slice(0, 3);

    // 3. Departmental Mesh
    const deptCities = config?.department
        ? Object.values(CITIES).filter(c => c.department === config.department && c.slug !== config.slug).slice(0, 10)
        : [];


    return (
        <section className="bg-neutral-900 border-t border-white/5 py-16 px-6">
            <div className="mx-auto max-w-7xl">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* 1. Services */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Nos Services</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/conseils" className="text-neutral-400 hover:text-white transition text-sm flex items-center gap-2">
                                    <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                                    Conseils & Astuces Taxi
                                </Link>
                            </li>
                            {SEO_SERVICES.map(s => (
                                <li key={s.slug}>
                                    <Link href={s.href || `/${s.slug}`} className="text-neutral-400 hover:text-white transition text-sm flex items-center gap-2">
                                        <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                                        {s.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 1b. Tarifs & Estimations (Fix Orphaned Pages) */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">Tarifs & Estimations</h4>
                        <ul className="space-y-3">
                            {SEO_DESTINATIONS.map(d => (
                                <li key={d.slug}>
                                    <Link href={`/tarif/${d.slug}`} className="text-neutral-400 hover:text-white transition text-sm flex items-center gap-2">
                                        <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                        Prix Taxi {d.name.split('(')[0].trim()}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 2. Top Liaisons (Trajets) - Only show if relevant */}
                    {finalRoutes.length > 0 && (
                        <div>
                            <h4 className="text-white font-bold mb-6 text-lg">Trajets Fréquents</h4>
                            <ul className="space-y-3">
                                {finalRoutes.map(route => (
                                    <li key={route.slug}>
                                        <Link href={`/trajet/${route.slug}`} className="text-neutral-400 hover:text-white transition text-sm flex items-center gap-2">
                                            <span className="w-1 h-1 bg-emerald-500 rounded-full"></span>
                                            Taxi {route.start} - {route.end}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 3. Guide Local (Smart Context) */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-lg">
                            {config ? `À voir à ${config.city}` : "Destinations Phares"}
                        </h4>
                        <ul className="space-y-3">
                            {monuments.map(m => (
                                <li key={m}>
                                    <Link href={config?.slug.includes('taxi-') ? `/guides/${slugify(m)}` : `/guides/${slugify(m)}`} className="text-neutral-400 hover:text-white transition text-sm flex items-center gap-2">
                                        <span className="w-1 h-1 bg-yellow-500 rounded-full"></span>
                                        Taxi {m}
                                    </Link>
                                </li>
                            ))}
                            {secondaryPois.map(n => (
                                <li key={n}>
                                    <Link href={`/quartier/${slugify(n)}`} className="text-neutral-400 hover:text-white transition text-sm flex items-center gap-2">
                                        <span className="w-1 h-1 bg-purple-500 rounded-full"></span>
                                        Taxi {n}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* 4. Departmental Mesh */}
                    {deptCities.length > 0 && (
                        <div>
                            <h4 className="text-white font-bold mb-6 text-lg">Taxis du {config?.department}</h4>
                            <ul className="space-y-3">
                                {deptCities.map(c => (
                                    <li key={c.slug}>
                                        <a href={`https://${c.domain}`} className="text-neutral-400 hover:text-white transition text-sm flex items-center gap-2">
                                            <span className="w-1 h-1 bg-neutral-600 rounded-full"></span>
                                            Taxi {c.city}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

