export interface SeoDestination {
    slug: string;
    name: string;
    type: 'airport' | 'station' | 'place';
    keywords: string[];
}

export interface SeoService {
    slug: string;
    title: string;
    description: string;
    keywords: string[];
    href?: string;
}

export const SEO_DESTINATIONS: SeoDestination[] = [
    { slug: 'aeroport-orly', name: 'Aéroport d\'Orly (ORY)', type: 'airport', keywords: ['Orly', 'Aéroport Sud', 'Aéroport Ouest'] },
    { slug: 'aeroport-roissy-cdg', name: 'Aéroport Roissy CDG', type: 'airport', keywords: ['Roissy', 'Charles de Gaulle', 'CDG'] },
    { slug: 'gare-montparnasse', name: 'Gare Montparnasse', type: 'station', keywords: ['Gare Montparnasse', 'TGV Atlantique'] },
    { slug: 'gare-de-lyon', name: 'Gare de Lyon', type: 'station', keywords: ['Gare de Lyon', 'TGV Sud-Est'] },
    { slug: 'gare-du-nord', name: 'Gare du Nord', type: 'station', keywords: ['Gare du Nord', 'Eurostar'] },
    { slug: 'paris-centre', name: 'Paris Centre', type: 'place', keywords: ['Paris', 'Capitale'] },
    { slug: 'la-defense', name: 'La Défense', type: 'place', keywords: ['La Défense', 'Affaires'] },
];

export const SEO_SERVICES: SeoService[] = [
    {
        slug: 'conventionne-cpam',
        title: 'Taxi Conventionné CPAM',
        description: 'Transport médical assis (VSL) agréé Sécurité Sociale.',
        keywords: ['médical', 'hôpital', 'dialyse', 'radiothérapie', 'consultation'],
        href: '/transport-medical'
    },
    {
        slug: 'van-minibus',
        title: 'Taxi Van & Minibus',
        description: 'Transport de groupe jusqu\'à 7 passagers avec bagages.',
        keywords: ['groupe', 'famille', 'van', 'grand taxi'],
        href: '/vehicules/dacia-jogger-7p'
    },
    {
        slug: 'longue-distance',
        title: 'Taxi Longue Distance',
        description: 'Trajets toutes distances au départ ou vers votre ville.',
        keywords: ['province', 'long trajet', 'kilomètres'],
        href: '/longue-distance'
    },
    {
        slug: 'nuit',
        title: 'Taxi de Nuit',
        description: 'Service disponible 24h/24 et 7j/7 pour vos sorties et urgences.',
        keywords: ['nuit', 'soirée', 'urgence', '24h/24'],
        href: '/nuit'
    },
    {
        slug: 'taxi-pmr',
        title: 'Taxi PMR',
        description: 'Transport adapté pour personnes à mobilité réduite. Véhicule accessible fauteuil roulant.',
        keywords: ['PMR', 'handicap', 'fauteuil roulant', 'mobilité réduite', 'accessible'],
        href: '/taxi-pmr'
    }
];
