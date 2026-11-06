'use client';

import { MapPin, Hotel, Landmark, Stethoscope, Train, PartyPopper } from "lucide-react";
import { EnrichedPOI, getEnrichedPOIs } from "@/config/enriched-pois";
import { slugify } from "@/lib/slugify";

interface POISectionProps {
    citySlug: string;
    cityName: string;
    domain: string;
}

export function POISection({ citySlug, cityName, domain }: POISectionProps) {
    const pois = getEnrichedPOIs(citySlug);

    if (!pois) return null;

    const categories = [
        { key: 'hotels', label: 'Hôtels', icon: Hotel, items: pois.hotels, color: 'text-blue-500', bg: 'bg-blue-50' },
        { key: 'monuments', label: 'À Visiter', icon: Landmark, items: pois.monuments, color: 'text-amber-500', bg: 'bg-amber-50' },
        { key: 'nightlife', label: 'Sorties', icon: PartyPopper, items: pois.nightlife, color: 'text-purple-500', bg: 'bg-purple-50' },
        { key: 'hospitals', label: 'Santé', icon: Stethoscope, items: pois.hospitals, color: 'text-red-500', bg: 'bg-red-50', link: '/transport-medical' },
        { key: 'stations', label: 'Gares', icon: Train, items: pois.stations, color: 'text-green-500', bg: 'bg-green-50', link: '/gare-aeroport' },
    ];

    const nonEmptyCategories = categories.filter(c => c.items && c.items.length > 0);

    if (nonEmptyCategories.length === 0) return null;

    return (
        <section className="py-16 bg-neutral-50">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-neutral-900 mb-3">
                        Destinations à {cityName} <span className="text-yellow-500">.</span>
                    </h2>
                    <p className="text-neutral-600 max-w-2xl mx-auto">
                        Nos taxis desservent tous les points d'intérêt de {cityName}. Réservez votre course en quelques clics.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {nonEmptyCategories.map(cat => (
                        <div key={cat.key} className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100 hover:shadow-lg hover:border-neutral-200 transition-all">
                            <div className={`inline-flex items-center justify-center w-10 h-10 ${cat.bg} rounded-xl mb-4`}>
                                <cat.icon className={`w-5 h-5 ${cat.color}`} />
                            </div>
                            <h3 className="font-bold text-neutral-900 mb-3">{cat.label}</h3>
                            <ul className="space-y-2">
                                {cat.items.slice(0, 3).map((item, i) => {
                                    const slug = slugify(item);
                                    const href = cat.link
                                        ? `https://${domain}${cat.link}`
                                        : `https://${domain}/guides/${slug}`;
                                    return (
                                        <li key={i}>
                                            <a
                                                href={href}
                                                className="text-sm text-neutral-600 hover:text-neutral-900 transition flex items-start gap-2"
                                            >
                                                <MapPin className="w-3 h-3 mt-1 text-neutral-400 flex-shrink-0" />
                                                <span className="line-clamp-1">{item}</span>
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
