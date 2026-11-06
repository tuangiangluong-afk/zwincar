#!/usr/bin/env npx tsx
/**
 * POI Auto-Enrichment Script (v2 — "jamais de fake data")
 *
 * Génère `src/config/enriched-pois.ts` avec de VRAIS noms d'hôtels, monuments
 * et lieux pour TOUTES les villes du réseau (sites IDF + villes partenaires).
 *
 * Architecture robuste :
 *   1. Serper API (Google Places) → données réelles et fraîches
 *   2. Fallback : données curatées (map embarquée + data réelle de db.ts)
 *   3. JAMAIS de noms génériques : les données mock ont été supprimées.
 *
 * Le fichier généré est COMMITTÉ : le site en prod lit le fichier statique,
 * zéro appel API au runtime, contenu déterministe.
 *
 * Usage :
 *   SERPER_API_KEY=xxx npx tsx scripts/auto-enrich-content.ts        # dry-run
 *   SERPER_API_KEY=xxx npx tsx scripts/auto-enrich-content.ts --save # report
 *   SERPER_API_KEY=xxx npx tsx scripts/auto-enrich-content.ts --generate-static
 */

import * as fs from 'fs';
import * as path from 'path';
import { CITIES, CityConfig } from '../src/lib/db';

// ----------------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------------
const SERPER_API_KEY = process.env.SERPER_API_KEY;
const OUTPUT_PATH = path.join(__dirname, '../src/config/enriched-pois.ts');

interface EnrichedPOI {
    hotels: string[];
    nightlife: string[];
    monuments: string[];
    hospitals: string[];
    stations: string[];
}

// Noms génériques / mock à ne JAMAIS produire (provenance de l'ancien mock)
const GENERIC_BLOCKLIST = [
    'hôtel le prestige', 'best western city', 'ibis centre-ville',
    'le bar du coin', 'club electric', 'irish pub o\'connor',
    'église saint-pierre', 'château historique', 'place de la mairie',
    'centre hospitalier principal', 'clinique du parc', 'hôpital andré mignot',
    'gare sncf centrale', 'gare rer a', 'station transilien',
    'polyclinique de levallois', 'hotel terminus',
];

// Données curatées (fallback si Serper indisponible) — hôtels réels
// vérifiés par recherche web (2026). Clés = slugs de villes.
const CURATED_HOTELS: Record<string, string[]> = {
    // --- BIG 5 ---
    'taxi-lyon': ['InterContinental Lyon - Hôtel Dieu', 'Sofitel Lyon Bellecour', 'Boscolo Lyon Hôtel & Spa', 'Hôtel Carlton Lyon', 'Mercure Lyon Centre Beaux Arts', 'Villa Florentine'],
    'taxi-marseille': ['InterContinental Marseille Hôtel Dieu', 'Sofitel Marseille Vieux-Port', 'Radisson Blu Marseille Vieux Port', 'Hôtel Belle-Vue Vieux-Port', 'Grand Hôtel Beauvau (MGallery)', 'New Hôtel Le Quai Vieux Port'],
    'taxi-nice': ['Hôtel Le Negresco', 'Hyatt Regency Nice Palais de la Méditerranée', 'Radisson Blu Nice', 'AC Hôtel Nice by Marriott', 'Le Méridien Nice', 'Hôtel West End'],
    'taxi-bordeaux': ['InterContinental Bordeaux Le Grand Hôtel', 'Hôtel Burdigala', 'Hôtel Majestic', 'Hôtel de Sèze', 'Mondrian Bordeaux Les Carmes', 'Hôtel Indigo Bordeaux'],
    'taxi-toulouse': ['Grand Hôtel de l\'Opéra', 'Hôtel Pullman Toulouse Centre', 'La Cour des Consuls Hôtel & Spa', 'Hôtel Le Grand Balcon', 'Mama Shelter Toulouse', 'Hôtel Albert 1er'],
    // --- GOLDEN ---
    'taxi-cannes': ['Hôtel Martinez', 'Hôtel Barrière Le Majestic', 'Carlton Cannes (Regent)', 'JW Marriott Cannes', 'Hôtel Barrière Le Gray d\'Albion', 'Five Seas Hôtel Cannes'],
    'taxi-aix-en-provence': ['Grand Hôtel Roi René (MGallery)', 'Hôtel des Augustins', 'Hôtel Cézanne', 'Negrecoste Hôtel & Spa', 'Aquabella Hôtel & Spa', 'Renaissance Aix-en-Provence'],
    'taxi-antibes': ['Hôtel du Cap-Eden-Roc', 'Hôtel Royal Antibes', 'Hôtel La Jabotte', 'Le Cap d\'Antibes Beach Hotel', 'Hôtel des Pêcheurs', 'Hôtel La Bastide du Roy'],
    'taxi-biarritz': ['Hôtel du Palais', 'Sofitel Biarritz Miramar', 'Hôtel Plaza Biarritz', 'Hôtel Regina', 'Radisson Blu Biarritz', 'Hôtel Le Café de Paris'],
    'taxi-deauville': ['Hôtel Barrière Le Normandy', 'Hôtel Barrière Le Royal Deauville', 'Hôtel Villa Flaubert', 'La Touques (Best Western)', 'Hôtel Le Marrakech'],
    'taxi-annecy': ['L\'Impérial Palace', 'Rivage Hôtel & Spa Annecy', 'Hôtel Le Pélican', 'Les Trésoms Lake & Spa Resort', 'Allobroges Park Hôtel', 'Hôtel du Château'],
    'taxi-strasbourg': ['Hôtel & Spa Régent Petite France', 'Hôtel Beaucour', 'Hôtel Rohan', 'Le Bouclier d\'Or Hôtel & Spa', 'Hilton Strasbourg', 'Hôtel Léonor'],
    'taxi-lille': ['Grand Hôtel Bellevue', 'Hôtel Carlton Lille', 'L\'Hermitage Gantois', 'Couvent des Minimes', 'Novotel Lille Centre Grand Place', 'OKKO Hôtels Lille'],
    'taxi-vincennes': ['Royal Regency Vincennes', 'Apparthotel Adagio Paris Vincennes'],
    // --- HUBS ---
    'taxi-nantes': ['Radisson Blu Nantes', 'Mercure Nantes Centre Grand Hôtel', 'Hôtel Voltaire Opéra', 'OKKO Hôtels Nantes Centre', 'Sōzō Hôtel', 'Oceania Hôtel de France'],
    'taxi-rennes': ['Balthazar Hôtel & Spa (MGallery)', 'Le Nemours', 'Mama Shelter Rennes', 'Mercure Rennes Centre Parlement', 'Novotel Rennes Centre Gare', 'Hôtel Anne de Bretagne'],
    'taxi-montpellier': ['Pullman Montpellier Centre', 'Hôtel Richer de Belleval', 'Crowne Plaza Montpellier Comédie', 'Best Western Le Guilhem', 'Hôtel du Parc', 'Hôtel des Arceaux'],
    'taxi-grenoble': ['Grand Hôtel Grenoble', 'Novotel Grenoble Centre', 'Hôtel Europe Grenoble', 'Park Hôtel Grenoble (MGallery)', 'Hôtel Terminus Grenoble'],
    'taxi-toulon': ['Grand Hôtel Dauphiné', 'Mercure Toulon Centre', 'OKKO Hôtels Toulon', 'Hôtel Le Cap au Mourillon'],
    'taxi-avignon': ['Hôtel d\'Europe', 'La Mirande', 'Hôtel de l\'Horloge', 'Hôtel Cloître Saint-Louis', 'Novotel Avignon Centre', 'Hôtel Bristol Avignon'],
    'taxi-reims': ['La Caserne Chanzy', 'Grand Hôtel Continental', 'Novotel Reims Centre', 'Hôtel de la Paix Reims', 'Best Western Hôtel de la Paix', 'Hôtel Azur Reims'],
    'taxi-dijon': ['Hôtel Vert', 'Hôtel du Palais', 'Mama Shelter Dijon', 'Hôtel Montchapet', 'Hôtel des Ducs', 'Novotel Dijon Sud'],
    'taxi-rouen': ['Hôtel de Bourgtheroulde', 'Radisson Blu Rouen Centre', 'Mercure Rouen Centre Cathédrale', 'Hôtel Littéraire Gustave Flaubert', 'Novotel Rouen Centre'],
    // --- STRATEGIC (aéroports) ---
    'taxi-roissy-cdg': ['Hilton Paris Charles de Gaulle', 'Novotel Paris CDG', 'Pullman Paris CDG', 'Sheraton Paris CDG', 'Ibis Paris CDG'],
    'taxi-orly': ['Novotel Orly Rungis', 'Ibis Orly Aéroport', 'Hilton Orly', 'Campanile Orly Rungis'],
    'taxi-beauvais': ['Kyriad Beauvais Tillé', 'Hôtel Mercure Beauvais Centre', 'Ibis Beauvais Centre'],
    'taxi-saint-exupery': ['Novotel Lyon Aéroport', 'Marriott Lyon Aéroport', 'Ibis Lyon Aéroport'],
    'taxi-nice-aeroport': ['NH Nice Aéroport', 'Ibis Nice Aéroport', 'Hôtel Royal Antibes'],
    'taxi-geneve': ['Novotel Ferney-Voltaire', 'Hôtel La Réserve Genève', 'Ibis Genève Aéroport'],
    'taxi-bale-mulhouse': ['Hôtel de Bâle', 'Ibis Bâle-Mulhouse Aéroport', 'Novotel Bâle-Mulhouse Aéroport'],
    'taxi-disneyland': ['Disney\'s Hotel New York', 'Disneyland Hôtel', 'Disney\'s Newport Bay Club', 'Disney\'s Sequoia Lodge', 'Hotel l\'Élysée Val d\'Europe'],
};

// ----------------------------------------------------------------------------
// Utilitaires
// ----------------------------------------------------------------------------
function cleanName(raw: string): string {
    return raw
        // Émojis et symboles décoratifs des listings Google
        .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '')
        // Supprime UNIQUEMENT les suffixes de listing ("· 123 avis", "· Hôtels")
        .replace(/\s*·.*$/i, '')
        .replace(/\s*\|.*$/i, '')
        .replace(/\s*\(\d[\d.,\s]*\)$/i, '')
        .replace(/\s*\d+\s*(avis|évaluations|reviews).*$/i, '')
        .replace(/^\d+[.)]\s*/, '')       // "1. Hôtel X" -> "Hôtel X"
        .replace(/\s{2,}/g, ' ')
        .trim();
}

function isGeneric(name: string): boolean {
    const n = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (GENERIC_BLOCKLIST.some(b => n.includes(b))) return true;
    if (n.length < 4) return true;
    // Noms trop vagues type "Hotel", "Restaurant", "Place"
    if (/^(hotel|restaurant|place|bar|club|le bar|la place|centre)$/.test(n)) return true;
    // Junk : spam majuscules (annonces), listes génériques
    if (/[A-Z]{4,}/.test(name) && name === name.toUpperCase()) return true; // "LES SUITES LOVE SPA VUE MER PISCINE"
    if (/\b(monument historique|appart hotel|appart\'hotel|les suites|love spa|vue mer|piscine|location vacances|annonce|site officiel)\b/i.test(n)) return true;
    return false;
}

function dedupe(items: string[]): string[] {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const raw of items) {
        const name = cleanName(raw);
        if (!name || isGeneric(name)) continue;
        const key = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (seen.has(key)) continue;
        seen.add(key);
        out.push(name);
    }
    return out;
}

function merge(...lists: (string[] | undefined)[]): string[] {
    return dedupe(lists.flat().filter(Boolean) as string[]);
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ----------------------------------------------------------------------------
// Serper API (Google Places)
// ----------------------------------------------------------------------------
async function serperPlaces(query: string, retries = 1): Promise<string[]> {
    if (!SERPER_API_KEY) return [];

    // 1. Endpoint /places (Google Places — noms de lieux)
    try {
        const response = await fetch('https://google.serper.dev/places', {
            method: 'POST',
            headers: {
                'X-API-KEY': SERPER_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q: query, gl: 'fr', hl: 'fr', num: 5 }),
        });

        if (response.ok) {
            const data = await response.json();
            const places = data.places || [];
            const names = places.map((p: any) => cleanName(p.title || p.name)).filter(Boolean);
            if (names.length > 0) return names;
        }
    } catch (e) {
        console.warn(`  ⚠️ Serper /places échec pour "${query}": ${(e as Error).message}`);
    }

    // 2. Fallback : /search (titres complets) si /places vide ou en erreur
    try {
        const response = await fetch('https://google.serper.dev/search', {
            method: 'POST',
            headers: {
                'X-API-KEY': SERPER_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ q: query, gl: 'fr', hl: 'fr', num: 6 }),
        });

        if (response.ok) {
            const data = await response.json();
            const titles = (data.organic || []).map((r: any) => cleanName(r.title || '')).filter(Boolean);
            if (titles.length > 0) return titles;
        }
    } catch (e) {
        console.warn(`  ⚠️ Serper /search échec pour "${query}": ${(e as Error).message}`);
    }

    // 3. Un seul retry après une courte pause
    if (retries > 0) {
        await sleep(1500);
        return serperPlaces(query, retries - 1);
    }

    return [];
}

// ----------------------------------------------------------------------------
// Enrichissement d'une ville
// ----------------------------------------------------------------------------
async function enrichCity(city: CityConfig): Promise<EnrichedPOI> {
    const slug = city.slug;
    const poi = city.points_of_interest || { hotels: [], nightlife: [], monuments: [], parking_difficulty: '' };

    // Ordre de priorité : données curatées (pleines, fiables) -> db.ts -> Serper
    // (Serper complète uniquement, pour ne jamais dégrader la qualité).

    // 1. Hôtels
    const serperHotels = await serperPlaces(`meilleurs hôtels ${city.city}`);
    const hotels = merge(CURATED_HOTELS[slug], poi.hotels, serperHotels).slice(0, 6);
    await sleep(350);

    // 2. Monuments / lieux : UNIQUEMENT les données réelles et complètes de
    //    db.ts (top_places des villes partenaires compris). Zéro troncature.
    const monuments = merge(poi.monuments).slice(0, 6);

    // 3. Nightlife : db.ts d'abord, Serper complète
    const serperNightlife = await serperPlaces(`bars et sorties ${city.city}`);
    const nightlife = merge(poi.nightlife, serperNightlife).slice(0, 5);
    await sleep(350);

    // 4. Hôpitaux : db.ts d'abord, Serper remplit pour les villes sans hôpitaux
    const serperHospitals = city.hospitals.length > 0
        ? []
        : (await serperPlaces(`hôpitaux et cliniques ${city.city}`));
    const hospitals = merge(city.hospitals, serperHospitals).slice(0, 4);

    // 5. Gares : données réelles déjà configurées
    const stations = merge(city.stations).slice(0, 5);

    return { hotels, nightlife, monuments, hospitals, stations };
}

// ----------------------------------------------------------------------------
// Génération du fichier statique
// ----------------------------------------------------------------------------
function generateStaticFile(results: Map<string, EnrichedPOI>): void {
    const entries: string[] = [];
    for (const [slug, r] of results) {
        entries.push(`    "${slug}": {
        hotels: ${JSON.stringify(r.hotels)},
        nightlife: ${JSON.stringify(r.nightlife)},
        monuments: ${JSON.stringify(r.monuments)},
        hospitals: ${JSON.stringify(r.hospitals)},
        stations: ${JSON.stringify(r.stations)},
    }`);
    }

    const content = `// Auto-generated by auto-enrich-content.ts (Serper API + données curatées)
// Last updated: ${new Date().toISOString()}
// ⚠️ Ce fichier est généré — ne pas éditer à la main.
// Régénérer : SERPER_API_KEY=xxx npx tsx scripts/auto-enrich-content.ts --generate-static

export interface EnrichedPOI {
    hotels: string[];
    nightlife: string[];
    monuments: string[];
    hospitals: string[];
    stations: string[];
}

export const ENRICHED_POIS: Record<string, EnrichedPOI> = {
${entries.join(',\n')}
};

export function getEnrichedPOIs(slug: string): EnrichedPOI | null {
    return ENRICHED_POIS[slug] || null;
}
`;

    fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');
    console.log(`  ✅ Écrit : ${OUTPUT_PATH} (${results.size} villes)`);
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
async function main() {
    console.log('🚀 POI Auto-Enrichment v2 — données réelles uniquement');
    console.log('━'.repeat(50));
    console.log(`ℹ️  ${Object.keys(CITIES).length} villes dans le réseau`);
    console.log(SERPER_API_KEY ? '✅ Serper API : configurée' : '⚠️  Pas de SERPER_API_KEY — fallback données curatées uniquement');
    console.log('');

    const args = process.argv.slice(2);
    const generateStatic = args.includes('--generate-static');

    const results = new Map<string, EnrichedPOI>();
    let totalHotels = 0, totalMonuments = 0, totalNightlife = 0;

    for (const [slug, city] of Object.entries(CITIES)) {
        console.log(`🔍 ${city.city} (${slug})`);
        const enriched = await enrichCity(city);
        results.set(slug, enriched);
        totalHotels += enriched.hotels.length;
        totalMonuments += enriched.monuments.length;
        totalNightlife += enriched.nightlife.length;
        console.log(`   🏨 ${enriched.hotels.length} hôtels · 🏛️ ${enriched.monuments.length} monuments · 🌙 ${enriched.nightlife.length} sorties`);
        await sleep(300);
    }

    // DÉDUPLICATION INTER-VILLES : un même lieu présent dans plus de 3 villes
    // est un pollueur régional (ex: les hôtels de Saint-Germain renvoyés par
    // Serper pour toutes les villes des Yvelines). On le retire partout pour
    // éviter le contenu dupliqué entre sites.
    const categoryCounts: Record<string, Record<string, number>> = {
        hotels: {}, nightlife: {}, monuments: {}, hospitals: {}, stations: {},
    };
    for (const r of results.values()) {
        for (const cat of Object.keys(categoryCounts) as (keyof EnrichedPOI)[]) {
            for (const name of r[cat]) {
                const key = name.toLowerCase();
                categoryCounts[cat][key] = (categoryCounts[cat][key] || 0) + 1;
            }
        }
    }
    let removed = 0;
    for (const r of results.values()) {
        for (const cat of Object.keys(categoryCounts) as (keyof EnrichedPOI)[]) {
            const before = r[cat].length;
            r[cat] = r[cat].filter((name) => (categoryCounts[cat][name.toLowerCase()] || 0) <= 3);
            removed += before - r[cat].length;
        }
    }
    console.log(`🗑️  Déduplication inter-villes : ${removed} entrées retirées (>3 villes)`);

    console.log('');
    console.log('━'.repeat(50));
    console.log(`📊 Total : ${results.size} villes, ${totalHotels} hôtels, ${totalMonuments} monuments, ${totalNightlife} sorties`);

    if (generateStatic) {
        generateStaticFile(results);
    } else {
        console.log('\n💡 Lance avec --generate-static pour écrire le fichier.');
    }
}

main().catch((e) => {
    console.error('Erreur fatale :', e);
    process.exit(1);
});
