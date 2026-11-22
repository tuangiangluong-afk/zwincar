import Link from "next/link";
import { MapPin } from "lucide-react";
import type { CityHub, VehicleModel } from "@/lib/morocco-data";
import type { Locale } from "@/lib/i18n";
import { cityVehicleFit } from "@/lib/city-vehicle-fit";
import { hubLocalTips } from "@/lib/hub-local-i18n";

const TIP_LABELS: Record<Locale, { parking: string; traps: string; taxi: string }> = {
    fr: { parking: "Stationnement :", traps: "Pièges de la route :", taxi: "Taxi ou location ?" },
    en: { parking: "Parking:", traps: "Road traps:", taxi: "Taxi or rental?" },
    es: { parking: "Aparcamiento:", traps: "Trampas en la carretera:", taxi: "¿Taxi o alquiler?" },
    nl: { parking: "Parkeren:", traps: "Valkuilen onderweg:", taxi: "Taxi of huurauto?" },
};

const ROAD_LABEL: Record<Locale, Record<string, string>> = {
    fr: { highway: "autoroute", mountainAtlas: "routes de montagne", medinaParking: "ville et stationnement en médina", desertPiste: "pistes du Sud" },
    en: { highway: "motorway", mountainAtlas: "mountain roads", medinaParking: "city driving and medina parking", desertPiste: "southern dirt tracks" },
    es: { highway: "autopista", mountainAtlas: "carreteras de montaña", medinaParking: "ciudad y aparcamiento en la medina", desertPiste: "pistas del sur" },
    nl: { highway: "snelweg", mountainAtlas: "bergwegen", medinaParking: "stad en parkeren bij de medina", desertPiste: "onverharde wegen in het zuiden" },
};

/** Bloc propre à chaque couple ville × véhicule : classement terrain, prix vs marché local, conseils locaux. */
export default function CityVehicleFitSection({ vehicle, hub, locale }: { vehicle: VehicleModel; hub: CityHub; locale: Locale }) {
    const f = cityVehicleFit(vehicle, hub);
    const tips = hubLocalTips(hub, locale);
    const road = ROAD_LABEL[locale][f.dominantRoad];
    const delta = Math.abs(f.priceDeltaVsHubEur);
    const cheaper = f.priceDeltaVsHubEur <= 0;
    const bestHref = locale === "fr" ? `/maroc/${hub.slug}/${f.best.id}` : `/${locale}/${hub.slug}/${f.best.id}`;
    const isBest = f.best.id === vehicle.id;
    const n = vehicle.name;
    const c = hub.name;

    const copy = {
        fr: {
            kicker: `${n} à ${c} : le verdict local`,
            rank: `Classement terrain à ${c} : n°${f.rank} sur ${f.total} (${f.score}/10). Depuis ${c}, l'essentiel de vos kilomètres se fait sur ${road}.`,
            price: cheaper ? `${delta} €/jour de moins que le prix moyen local (${hub.avgDailyPriceEur} €/j).` : `${delta} €/jour au-dessus du prix moyen local (${hub.avgDailyPriceEur} €/j), justifié par la catégorie.`,
            best: isBest ? `C'est le véhicule le mieux adapté aux routes de ${c}.` : `Le mieux adapté à ${c} : `,
            pick: `Recommandé pour l'itinéraire « ${hub.recommendedItinerary.title} »`,
        },
        en: {
            kicker: `${n} in ${c}: the local verdict`,
            rank: `Road-fit ranking in ${c}: #${f.rank} of ${f.total} (${f.score}/10). From ${c}, most of your mileage is ${road}.`,
            price: cheaper ? `€${delta}/day below the local average (€${hub.avgDailyPriceEur}/day).` : `€${delta}/day above the local average (€${hub.avgDailyPriceEur}/day), in line with its category.`,
            best: isBest ? `This is the best-suited car for ${c}'s roads.` : `Best suited to ${c}: `,
            pick: `Our pick for the recommended road trip`,
        },
        es: {
            kicker: `${n} en ${c}: el veredicto local`,
            rank: `Ranking de adaptación en ${c}: n.º ${f.rank} de ${f.total} (${f.score}/10). Desde ${c}, la mayoría de sus kilómetros serán ${road}.`,
            price: cheaper ? `${delta} €/día menos que el precio medio local (${hub.avgDailyPriceEur} €/día).` : `${delta} €/día por encima del precio medio local (${hub.avgDailyPriceEur} €/día), acorde a su categoría.`,
            best: isBest ? `Es el coche más adaptado a las carreteras de ${c}.` : `El más adaptado a ${c}: `,
            pick: `Nuestra elección para la ruta recomendada`,
        },
        nl: {
            kicker: `${n} in ${c}: het lokale oordeel`,
            rank: `Wegscore in ${c}: nr. ${f.rank} van ${f.total} (${f.score}/10). Vanuit ${c} rijdt u vooral ${road}.`,
            price: cheaper ? `€${delta}/dag onder de lokale gemiddelde prijs (€${hub.avgDailyPriceEur}/dag).` : `€${delta}/dag boven de lokale gemiddelde prijs (€${hub.avgDailyPriceEur}/dag), passend bij de categorie.`,
            best: isBest ? `Dit is de best passende auto voor de wegen rond ${c}.` : `Best passend bij ${c}: `,
            pick: `Onze keuze voor de aanbevolen route`,
        },
    }[locale];

    return (
        <section className="rounded-3xl bg-white border border-[#E7DFD5] p-6 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C9572C]">
                <MapPin size={15} />
                <span>{copy.kicker}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{copy.rank}</p>
            <p className="text-sm text-slate-700 leading-relaxed">{copy.price}</p>
            <p className="text-sm text-slate-700 leading-relaxed">
                {copy.best}
                {!isBest && <Link href={bestHref} className="font-semibold text-[#C9572C] underline">{f.best.name}</Link>}
            </p>
            {f.isItineraryPick && (
                <p className="text-sm font-semibold text-emerald-700">
                    ✓ {copy.pick} : {hub.recommendedItinerary.stops.join(" → ")}
                </p>
            )}
            {tips && (
                <ul className="text-sm text-slate-600 leading-relaxed space-y-2 list-disc pl-5">
                    <li><strong>{TIP_LABELS[locale].parking} </strong>{tips.parking}</li>
                    <li><strong>{TIP_LABELS[locale].traps} </strong>{tips.traps}</li>
                    <li><strong>{TIP_LABELS[locale].taxi} </strong>{tips.taxi}</li>
                </ul>
            )}
        </section>
    );
}
