export interface RouteConfig {
    slug: string; // paris-deauville
    start: string; // Paris
    end: string;   // Deauville
    startAddress: string; // Paris, France
    endAddress: string;   // Deauville, France
    description: string;
}

export const SEO_ROUTES: RouteConfig[] = [
    {
        slug: "taxi-paris-deauville",
        start: "Paris",
        end: "Deauville",
        startAddress: "Paris, France",
        endAddress: "Deauville, France",
        description: "Rejoignez la côte normande depuis la capitale en tout confort."
    },
    {
        slug: "taxi-paris-lille",
        start: "Paris",
        end: "Lille",
        startAddress: "Paris, France",
        endAddress: "Lille, France",
        description: "Liaison rapide vers le Nord de la France."
    },
    {
        slug: "taxi-paris-bruxelles",
        start: "Paris",
        end: "Bruxelles",
        startAddress: "Paris, France",
        endAddress: "Bruxelles, Belgique",
        description: "Voyagez vers la Belgique sans les contraintes du train."
    },
    {
        slug: "taxi-lyon-geneve",
        start: "Lyon",
        end: "Genève",
        startAddress: "Lyon, France",
        endAddress: "Genève, Suisse",
        description: "Transfert vers la Suisse et l'aéroport de Genève Cointrin."
    },
    {
        slug: "taxi-lyon-courchevel",
        start: "Lyon",
        end: "Courchevel",
        startAddress: "Lyon, France",
        endAddress: "Courchevel, France",
        description: "Transfert ski VIP vers les stations de Savoie."
    },
    {
        slug: "taxi-nice-monaco",
        start: "Nice",
        end: "Monaco",
        startAddress: "Nice, France",
        endAddress: "Monaco",
        description: "Liaison navette aéroport Nice vers la principauté."
    },
    {
        slug: "taxi-bordeaux-cap-ferret",
        start: "Bordeaux",
        end: "Cap Ferret",
        startAddress: "Bordeaux, France",
        endAddress: "Lège-Cap-Ferret, France",
        description: "Rejoignez le bassin d'Arcachon rapidement."
    },
    {
        slug: "taxi-paris-rouen",
        start: "Paris",
        end: "Rouen",
        startAddress: "Paris, France",
        endAddress: "Rouen, France",
        description: "Déplacement professionnel ou privé vers la Normandie."
    },
    {
        slug: "taxi-paris-le-touquet",
        start: "Paris",
        end: "Le Touquet",
        startAddress: "Paris, France",
        endAddress: "Le Touquet-Paris-Plage, France",
        description: "Week-end au Touquet ? Départ immédiat sans correspondances."
    },
    {
        slug: "taxi-lille-amsterdam",
        start: "Lille",
        end: "Amsterdam",
        startAddress: "Lille, France",
        endAddress: "Amsterdam, Pays-Bas",
        description: "Liaison directe vers les Pays-Bas."
    },
    {
        slug: "taxi-strasbourg-francfort",
        start: "Strasbourg",
        end: "Francfort",
        startAddress: "Strasbourg, France",
        endAddress: "Francfort-sur-le-Main, Allemagne",
        description: "Transfert aéroport et business international."
    },
    {
        slug: "taxi-paris-reims",
        start: "Paris",
        end: "Reims",
        startAddress: "Paris, France",
        endAddress: "Reims, France",
        description: "Visitez la Champagne ou déplacement business."
    },
    {
        slug: "taxi-marseille-aix",
        start: "Marseille",
        end: "Aix-en-Provence",
        startAddress: "Marseille, France",
        endAddress: "Aix-en-Provence, France",
        description: "Liaison fréquente TGV et Aéroport."
    }
];
