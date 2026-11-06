import type { CityConfig } from "@/lib/db";

export type ContentType =
    | "hero_title"
    | "hero_subtitle"
    | "hero_badge"
    | "about_us"
    | "medical_title"
    | "medical_intro"
    | "medical_cta"
    | "airport_title"
    | "airport_intro"
    | "long_distance_title"
    | "long_distance_intro"
    | "cta_button"
    | "vehicle_sedan_title"
    | "vehicle_sedan_desc"
    | "vehicle_van_title"
    | "vehicle_van_desc"
    | "review_name_1"
    | "review_text_1"
    | "review_name_2"
    | "review_text_2"
    | "review_name_3"
    | "review_text_3"
    | "meta_title"
    | "meta_description"
    | "guide_intro"
    | "guide_bus_pain"
    | "guide_taxi_solution"
    | "partner_description"
    | "partner_meta_description"
    | "station_description"
    | "station_meta_description"
    | "services_intro"
    | "cta_primary"
    | "cta_secondary"
    | "pmr_title"
    | "pmr_intro"
    | "pmr_cta"
    | "intro"
    | "medical"
    | "station"
    | "cta"
    // --- AEO / GEO / Helpful Content (2026 refresh) ---
    | "conseils_title"
    | "conseils_intro"
    | "comparison_title"
    | "comparison_intro"
    | "local_knowledge_title"
    | "news_title"
    | "news_intro"
    | "night_title"
    | "night_intro"
    | "price_title"
    | "price_intro"
    | "booking_tips_intro"
    | "luggage_title"
    | "luggage_intro"
    | "animal_title"
    | "animal_intro";

// ----------------------------------------------------------------------------
// SEEDED RANDOM ENGINE (Deterministic per render/Google bot crawl)
// ----------------------------------------------------------------------------

function mulberry32(a: number) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

// Fallback to simple deterministic random for reviews if needed
export function seededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

export function stringHash(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

/**
 * Process spintax: {A|B|C} -> selects one deterministically based on seed string
 */
export function spin(text: string, seedString: string): string {
    const seed = stringHash(seedString);
    const random = mulberry32(seed);
    let processed = text;
    let hasSpintax = true;

    while (hasSpintax) {
        const next = processed.replace(/{([^{}]+)}/g, (match, content) => {
            const choices = content.split("|");
            const choiceIndex = Math.floor(random() * choices.length);
            return choices[choiceIndex];
        });

        if (next === processed) {
            hasSpintax = false;
        } else {
            processed = next;
        }
    }

    return processed;
}

/**
 * Deterministic Fisher-Yates shuffle (no duplicates, stable per seed)
 */
function seededShuffle<T>(items: T[], seed: number): T[] {
    const arr = [...items];
    const random = mulberry32(seed);
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// ----------------------------------------------------------------------------
// TEMPLATE ENGINE
// ----------------------------------------------------------------------------

const formatList = (items: string[]): string => {
    if (!items || items.length === 0) return "";
    if (items.length === 1) return items[0];
    const last = items[items.length - 1];
    const rest = items.slice(0, items.length - 1);
    return `${rest.join(", ")} et ${last}`;
};

const templates: Record<ContentType, string[]> = {
    meta_title: [
        "{Taxi|Chauffeur Privé} {{city}} | {Réservez votre trajet|Tarifs fixes & disponibles 24h/7}",
        "Taxi {{city}} | {Chauffeur VSL agréé CPAM & Navette Aéroport|Navettes Gares & Aéroports}",
        "{Réserver un Taxi|Chauffeur Privé} à {{city}} | {Prix fixe garanti|Disponible immédiatement}",
        "Taxi {{city}} {pas cher|au meilleur prix} | {Réservation en ligne 24h/24|Devis gratuit & immédiat}",
        "Meilleur Taxi à {{city}} | {Chauffeur agréé, prix réglementés|VSL CPAM & aéroport 7j/7}",
        "Taxi {{city}} : {réservez en 30 secondes|votre chauffeur en 10 minutes} | Prix transparents"
    ],
    meta_description: [
        "Réservez votre taxi à {{city}}{{dept_bracket}}. Chauffeur {professionnel|expérimenté|ponctuel} pour vos trajets vers {les gares et aéroports|la gares et aéroports} et déplacements conventionnés CPAM (VSL).",
        "Besoin d'un taxi ou d'un VSL à {{city}} ? Profitez d'un chauffeur privé agréé CPAM et navette aéroport. {Réservation 24h/7 en ligne|Tarif fixe sans surprise}.",
        "Chauffeur privé et taxi à {{city}}{{dept_bracket}} pour tous vos trajets locaux, professionnels ou médicaux (VSL). Flotte de berlines et vans récents.",
        "Taxi à {{city}} : {réservation immédiate|devis gratuit}, tarifs {réglementés|fixes}, {disponible 24h/24|disponible 7j/7}. Gares, aéroports, transport médical CPAM et longue distance.",
        "Le taxi de référence à {{city}}{{dept_bracket}}. {Chauffeurs locaux|Chauffeurs certifiés}, {paiement CB accepté|facture disponible}, {navettes aéroports|transferts gares} avec suivi de vol."
    ],
    hero_title: [
        "Votre Chauffeur Privé et Taxi à <span class=\"text-transparent bg-clip-text bg-gradient-to-tr from-yellow-300 to-yellow-600\">{{city}}</span>",
        "Réservez votre Taxi professionnel à <span class=\"text-transparent bg-clip-text bg-gradient-to-tr from-yellow-300 to-yellow-600\">{{city}}</span>",
        "Chauffeur de confiance et Taxi à <span class=\"text-transparent bg-clip-text bg-gradient-to-tr from-yellow-300 to-yellow-600\">{{city}}</span>",
        "Taxi disponible 24h/7 à <span class=\"text-transparent bg-clip-text bg-gradient-to-tr from-yellow-300 to-yellow-600\">{{city}}</span>",
        "Déplacez-vous en toute sérénité à <span class=\"text-transparent bg-clip-text bg-gradient-to-tr from-yellow-300 to-yellow-600\">{{city}}</span>",
        "Votre taxi local à <span class=\"text-transparent bg-clip-text bg-gradient-to-tr from-yellow-300 to-yellow-600\">{{city}}</span> — gare, aéroport & VSL"
    ],
    hero_subtitle: [
        "Service premium de réservation de taxi à {{city}} et dans le {{dept}}. Nous assurons vos liaisons directes{{stations_text}} et tous les aéroports parisiens avec un tarif fixé à l'avance.",
        "Déplacez-vous facilement à {{city}} et dans le {{dept}}. Profitez d'un chauffeur expérimenté pour vos trajets locaux, professionnels ou médicaux avec un prix garanti sans surprise.",
        "Navettes aéroports, trajets professionnels et taxis conventionnés CPAM au départ de {{city}}. Confort, sécurité et ponctualité assurés.",
        "Un taxi fiable à {{city}}, disponible en quelques minutes. Trajets locaux, gares, aéroports et transport médical avec des chauffeurs locaux qui connaissent parfaitement le {{dept}}.",
        "Choisissez la tranquillité à {{city}} : chauffeur ponctuel, véhicule récent, prix transparent et assistance 7j/7 pour tous vos déplacements.",
        "Le réflexe taxi à {{city}} : réservez en ligne en 30 secondes, payez à bord ou par CB, et voyagez l'esprit léger vers les gares{{stations_text}} et les aéroports."
    ],
    hero_badge: [
        "Taxi Officiel {{city}}",
        "Chauffeur Privé {{city}}",
        "Service Agréé {{city}}",
        "Disponible 24h/24 à {{city}}",
        "Taxi Certifié {{city}}"
    ],
    about_us: [
        "Nous sommes des chauffeurs professionnels ancrés à {{city}}, dédiés à vous fournir une expérience de transport sécurisée, ponctuelle et confortable.",
        "Notre réseau de chauffeurs basés à {{city}} met tout en œuvre pour simplifier vos trajets locaux, médicaux et vers les aéroports.",
        "Implantés à {{city}} depuis des années, nos chauffeurs connaissent chaque rue du {{dept}} : le meilleur itinéraire, le plus court et le plus fluide, à toute heure."
    ],
    medical_title: [
        "Taxi Conventionné CPAM et VSL à <span class=\"text-blue-600\">{{city}}</span>",
        "Transport Médical Agréé CPAM (VSL) à <span class=\"text-blue-600\">{{city}}</span>",
        "Taxi Santé à <span class=\"text-blue-600\">{{city}}</span> — VSL conventionné & tiers payant"
    ],
    medical_intro: [
        "Besoin d'un transport médicalisé à {{city}} ? Nos taxis conventionnés vous accompagnent vers les centres de soins de la région{{hospitals_text}}. Nous vous aidons avec les démarches administratives pour la prise en charge CPAM.",
        "Nos chauffeurs de {{city}} sont agréés CPAM pour tous vos déplacements médicaux (consultations, dialyse, rééducation). Voyagez dans des véhicules confortables avec un chauffeur attentif et bénéficiez du tiers payant.",
        "Dialyse, chimiothérapie, rééducation ou simple consultation : le transport assis conventionné à {{city}} est pris en charge sur prescription. Nos VSL vous attendent à la sortie et vous ramènent chez vous, en toute régularité.",
        "Ne renoncez plus à un rendez-vous médical faute de transport. À {{city}}, notre service VSL conventionné CPAM assure vos allers-retours{{hospitals_text}}, avec aide à la marche et accompagnement jusqu'au service si nécessaire."
    ],
    medical_cta: [
        "Réserver un taxi conventionné",
        "Contacter un chauffeur VSL",
        "Demander un transport médical"
    ],
    airport_title: [
        "Navette Gare et Aéroport au départ de <span class=\"text-blue-600\">{{city}}</span>",
        "Transferts Aéroport et Gare depuis <span class=\"text-blue-600\">{{city}}</span>",
        "Taxi Aéroport depuis <span class=\"text-blue-600\">{{city}}</span> — forfaits fixes & suivi de vol"
    ],
    airport_intro: [
        "Évitez le stress des transports et les problèmes de stationnement{{stations_text}}. Depuis {{city}}, nos chauffeurs vous déposent exactement à votre terminal ou quai d'embarquement. Nous suivons votre vol/train en temps réel pour être là à la bonne heure.",
        "Partez sereinement depuis {{city}} vers les gares TGV et aéroports (Roissy CDG, Orly). Voyagez confortablement, peu importe l'heure ou vos bagages. Nos tarifs vers les aéroports sont fixes et annoncés à l'avance.",
        "Un départ à 5h du matin ou un vol qui atterrit à minuit ? Nos chauffeurs de {{city}} assurent vos transferts{{stations_text}} et vers les aéroports 24h/24, avec attente pancarte nominative et suivi en temps réel de votre vol.",
        "Fini le casse-tête du parking et des correspondances. Depuis {{city}}, réservez votre navette privée vers la gare ou l'aéroport : le chauffeur vous attend, prend vos bagages et vous dépose porte à porte."
    ],
    long_distance_title: [
        "Taxi Longue Distance au départ de <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600\">{{city}}</span>",
        "Liaisons Longue Distance toutes distances depuis <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600\">{{city}}</span>",
        "Taxi Grandes Distances depuis <span class=\"text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600\">{{city}}</span> — France & Europe"
    ],
    long_distance_intro: [
        "Vous devez quitter {{city}} pour rejoindre la province ou un autre pays européen ? Oubliez les contraintes des horaires de train. Notre service longue distance vous garantit un trajet direct de porte à porte, idéal pour les voyages d'affaires ou les départs en vacances.",
        "Voyagez confortablement sur de longues distances depuis {{city}}. Nos berlines haut de gamme et chauffeurs expérimentés vous assurent un trajet sûr, reposant et direct vers la destination de votre choix.",
        "Départ de {{city}} pour une autre région, une gare TGV lointaine ou un aéroport international ? Le taxi longue distance vous évite les changements, les bagages à porter et les retards. Un forfait clair, un chauffeur dédié, un trajet sans escale.",
        "Voyages d'affaires, déménagements ponctuels ou vacances en famille : la longue distance depuis {{city}} se fait en berline confort ou van spacieux, avec pauses à la demande et facture professionnelle."
    ],
    cta_button: [
        "Commander mon taxi",
        "Réserver mon chauffeur",
        "Obtenir mon taxi immédiatement"
    ],
    cta_primary: [
        "Commander mon taxi",
        "Réserver mon chauffeur",
        "Réserver maintenant"
    ],
    cta: [
        "Commander mon taxi",
        "Réserver mon chauffeur",
        "Réserver maintenant"
    ],
    cta_secondary: [
        "Estimer mon tarif",
        "Demander un devis",
        "Voir les prix"
    ],
    vehicle_sedan_title: [
        "Berline Confort",
        "Berline Affaires",
        "Berline Élégance"
    ],
    vehicle_sedan_desc: [
        "Idéal pour circuler dans les rues de {{city}} et les trajets professionnels.",
        "Véhicule de standing discret, confortable et équipé pour vos trajets quotidiens à {{city}}.",
        "Climatisation, silence et confort : la berline idéale pour arriver détendu à vos rendez-vous à {{city}}."
    ],
    vehicle_van_title: [
        "Van Premium",
        "Minibus Premium",
        "Van 7 Places"
    ],
    vehicle_van_desc: [
        "Voyagez en groupe depuis {{city}} vers l'aéroport avec tous vos bagages (jusqu'à 7 passagers).",
        "Option idéale pour vos déplacements en équipe ou en famille au départ de {{city}}.",
        "Espace, bagages, confort : le van de {{city}} accueille jusqu'à 7 passagers avec leurs valises, pour les aéroports et les longs trajets."
    ],
    review_name_1: ["Marie L.", "Sophie P.", "Jean-Marc T.", "Céline D.", "Karim B."],
    review_text_1: [
        "J'habite à {{city}} et je fais souvent appel à eux pour aller à l'aéroport. Chauffeur toujours ponctuel, c'est très rassurant.",
        "Excellent service de transport à {{city}}. Voiture très propre et chauffeur courtois.",
        "Chauffeur arrivé en avance à {{city}}, trajet fluide et prix conforme à l'estimation. Je recommande."
    ],
    review_name_2: ["Thomas D.", "Éric B.", "Laurence G.", "Nadia M.", "Philippe R."],
    review_text_2: [
        "Parfait. La voiture était très propre et le chauffeur m'a aidé avec mes bagages lors de mon retour à {{city}}.",
        "Réservation facile par téléphone, prix respecté et chauffeur agréable.",
        "Pour mes rendez-vous médicaux à {{city}}, le chauffeur VSL a été aux petits soins. Ponctuel et attentionné."
    ],
    review_name_3: ["Sophie M.", "Nathalie R.", "Antoine V.", "Julie K.", "Sébastien L."],
    review_text_3: [
        "Service VSL irréprochable. Le chauffeur a été très patient pour m'accompagner à mes rendez-vous médicaux depuis {{city}}.",
        "Très bon transport conventionné pour mes séances de rééducation depuis {{city}}. Chauffeur professionnel.",
        "Taxi réservé la veille pour un départ très matinal à {{city}} : le chauffeur était là 5 minutes en avance. Parfait."
    ],
    guide_intro: [
        "En visite ou de passage à {{city}} ? Laissez-vous conduire par un chauffeur local qui connaît parfaitement la ville. Profitez de votre journée pour explorer les alentours sans vous soucier du trafic.",
        "Besoin de vous déplacer à {{city}} ? Un chauffeur professionnel vous accompagne à chaque étape de votre visite pour un trajet fluide.",
        "Découvrir {{city}} sans stress : votre chauffeur vous conseille les bons plans, vous dépose à la porte des lieux à voir et vous attend le temps de votre visite."
    ],
    guide_bus_pain: [
        "Trouver une place de parking à {{city}} est souvent considéré comme {{parking_difficulty}}. Ne perdez pas 30 minutes à tourner en rond ni à payer un stationnement hors de prix. Les transports en commun peuvent aussi s'avérer contraignants si vous êtes chargé.",
        "Se déplacer à {{city}} avec son véhicule personnel ajoute du stress (stationnement qualifié de {{parking_difficulty}}). Les transports locaux ne sont pas toujours pratiques."
    ],
    guide_taxi_solution: [
        "La solution de confort : votre chauffeur vient vous chercher directement à votre porte à {{city}} et vous dépose exactement où vous le souhaitez. Une expérience premium, sûre et reposante.",
        "Gagnez du temps et de l'énergie : votre taxi prend soin de vous de porte à porte depuis {{city}}."
    ],
    partner_description: [
        "Besoin d'un taxi certifié et ponctuel à {{city}} ?",
        "Trouvez votre chauffeur professionnel et disponible à {{city}}.",
        "Réservez un taxi fiable à {{city}}, disponible immédiatement et à prix réglementé."
    ],
    station_description: [
        "Besoin d'un taxi certifié et ponctuel à {{city}} ?",
        "Trouvez votre chauffeur professionnel et disponible à {{city}}.",
        "Réservez un taxi fiable à {{city}}, disponible immédiatement et à prix réglementé."
    ],
    partner_meta_description: [
        "Taxi {{city}} : Devis gratuit, prix garanti et réservation en quelques clics.",
        "Trouvez et réservez votre taxi de confiance à {{city}} facilement.",
        "Taxi à {{city}} 24h/7 : chauffeurs locaux, tarifs réglementés, gares, aéroports et transport médical."
    ],
    station_meta_description: [
        "Taxi {{city}} : Devis gratuit, prix garanti et réservation en quelques clics.",
        "Trouvez et réservez votre taxi de confiance à {{city}} facilement.",
        "Taxi à {{city}} 24h/7 : chauffeurs locaux, tarifs réglementés, gares, aéroports et transport médical."
    ],
    services_intro: [
        "Nos Solutions de Transport à {{city}}",
        "Découvrez nos services de transport à {{city}}",
        "Tous nos services de taxi à {{city}}"
    ],
    pmr_title: [
        "Taxi PMR Adapté à <span class=\"text-blue-600\">{{city}}</span>",
        "Transport PMR / Fauteuil Roulant à <span class=\"text-blue-600\">{{city}}</span>",
        "Taxi Accessible Fauteuil à <span class=\"text-blue-600\">{{city}}</span>"
    ],
    pmr_intro: [
        "Nous disposons de véhicules spécialement équipés d'une rampe d'accès pour les personnes à mobilité réduite (PMR) résidant à {{city}}. Nos chauffeurs sont formés pour assurer un transfert sécurisé, confortable et respectueux pour vos sorties ou rendez-vous médicaux.",
        "Pour vos déplacements PMR à {{city}}, faites confiance à un véhicule certifié avec rampe et des chauffeurs sensibilisés à la sécurité.",
        "Véhicule avec rampe ou plateforme élévatrice, arrimage du fauteuil et chauffeur formé à l'aide à l'embarquement : le taxi PMR de {{city}} vous accompagne en toute autonomie, pour le médical comme pour les loisirs."
    ],
    pmr_cta: [
        "Réserver un taxi PMR",
        "Contacter le service PMR",
        "Demander un véhicule adapté"
    ],
    intro: [
        "Vous cherchez un moyen de transport fiable et confortable à {{city}} ? Notre réseau de chauffeurs est à votre disposition pour tous vos déplacements personnels ou professionnels.",
        "Découvrez notre service de transport privé sur mesure à {{city}} et réservez votre trajet en toute simplicité."
    ],
    medical: [
        "Transport médical agréé CPAM",
        "Taxi conventionné CPAM VSL",
        "Transport assis professionnalisé"
    ],
    station: [
        "Navettes gares et aéroports directes",
        "Transfert direct gares et aéroports",
        "Navette privée 24h/24"
    ],
    // ------------------------------------------------------------------
    // AEO / GEO CONTENT TYPES (2026 refresh)
    // ------------------------------------------------------------------
    conseils_title: [
        "Nos Conseils pour bien voyager en taxi à {{city}}",
        "5 conseils d'initiés pour votre taxi à {{city}}",
        "Astuces pratiques pour votre trajet en taxi à {{city}}",
        "Bien réserver son taxi à {{city}} : nos conseils"
    ],
    conseils_intro: [
        "Nos chauffeurs de {{city}} partagent leurs astuces pour un trajet sans accroc : réservation, tarifs, ponctualité. Tout ce qu'il faut savoir avant de monter à bord.",
        "Quelques réflexes simples font toute la différence quand on prend un taxi à {{city}}. Voici nos conseils d'équipe, testés au quotidien."
    ],
    comparison_title: [
        "Taxi, Uber ou VTC à {{city}} : quel choix ?",
        "Taxi vs Uber vs VTC vs Bus à {{city}} : le comparatif",
        "Quel transport choisir à {{city}} ? Notre comparatif honnête"
    ],
    comparison_intro: [
        "À {{city}}, plusieurs options s'offrent à vous pour vous déplacer. Voici un comparatif transparent des tarifs, délais et garanties de chaque solution, sans parti pris.",
        "Bus, métro, Uber, VTC ou taxi à {{city}} : chaque option a ses avantages. Voici comment choisir selon votre situation (bagages, horaires, budget)."
    ],
    local_knowledge_title: [
        "Le saviez-vous sur {{city}} ?",
        "Bien connaître {{city}} avant de vous déplacer",
        "{{city}} côté coulisses : ce que les visiteurs ignorent"
    ],
    news_title: [
        "Actualités Taxi à {{city}}",
        "Les dernières actus du transport à {{city}}",
        "Infos pratiques & nouveautés à {{city}}"
    ],
    news_intro: [
        "Les dernières actualités et nouveautés du transport à {{city}} : réglementation, tarifs, événements qui impactent la circulation.",
        "Restez informé sur l'actualité des taxis et de la mobilité à {{city}}."
    ],
    night_title: [
        "Taxi de Nuit à {{city}}",
        "Votre taxi la nuit à {{city}}",
        "Sorties de soirée : le taxi de nuit à {{city}}"
    ],
    night_intro: [
        "Concerts, restaurants, aéroports au petit matin : le taxi de nuit à {{city}} vous ramène en sécurité 24h/24. Des chauffeurs sobres, vérifiés, qui connaissent les itinéraires de nuit.",
        "Après 22h, les transports se font rares à {{city}}. Notre service de nuit prend le relais : réservez votre retour de soirée à l'avance et repartez serein."
    ],
    price_title: [
        "Prix d'un Taxi à {{city}} : tarifs & forfaits",
        "Combien coûte un taxi à {{city}} ?",
        "Tarifs Taxi à {{city}} : tout comprendre"
    ],
    price_intro: [
        "Le prix d'un taxi à {{city}} se compose d'une prise en charge, d'un tarif au kilomètre et éventuellement de majorations (nuit, dimanches, jours fériés). Pour les trajets gares et aéroports, nous proposons des forfaits fixes connus à l'avance.",
        "Pas de mauvaise surprise à {{city}} : tous nos tarifs respectent l'arrêté préfectoral en vigueur, et les forfaits aéroports sont annoncés avant la course."
    ],
    booking_tips_intro: [
        "Réserver son taxi à {{city}} en 3 étapes simples, que vous soyez sur place ou à l'avance. Voici comment faire pour être sûr d'avoir un chauffeur au bon endroit, au bon moment.",
        "Réservation immédiate ou planifiée : nos conseils pour réserver votre taxi à {{city}} sans attendre."
    ],
    luggage_title: [
        "Taxi & bagages à {{city}}",
        "Voyager avec ses bagages en taxi à {{city}}"
    ],
    luggage_intro: [
        "Voyagez l'esprit léger : à {{city}}, nos chauffeurs vous aident avec vos valises, sacs et poussettes. Pour les gros volumes ou les groupes, optez pour le van.",
        "Du studio à l'aéroport avec trois valises ? Pas de souci : le taxi à {{city}} vous prend en charge avec vos bagages, sans supplément pour les aider à charger."
    ],
    animal_title: [
        "Voyager avec son animal en taxi à {{city}}",
        "Taxi acceptant les animaux à {{city}}"
    ],
    animal_intro: [
        "Petit chien, chat en caisse ou animal d'assistance : les chauffeurs de {{city}} acceptent les animaux sous conditions. Signalez-le à la réservation, sans supplément pour les animaux en caisse de moins de 10 kg.",
        "Votre compagnon à quatre pattes vous accompagne ? Précisez-le lors de la réservation à {{city}} et votre chauffeur prévoira une caisse ou un siège adapté."
    ]
};

// ----------------------------------------------------------------------------
// LIST POOLS (for conseils, faits locaux, actus) - generated with variables
// ----------------------------------------------------------------------------

const CONSEIL_ITEMS: string[] = [
    "Réservez à l'avance pour les départs matinaux (avant 7h) : le chauffeur sera là 5 minutes en avance et vous partirez sans stress.",
    "Pour un trajet gare ou aéroport, demandez toujours le forfait fixe : il est connu à l'avance et ne varie pas avec les bouchons.",
    "Vérifiez que le compteur est bien lancé au départ, ou demandez le forfait avant de démarrer : c'est votre droit le plus simple.",
    "Signalez vos bagages volumineux ou une poussette à la réservation : on vous enverra un véhicule adapté, sans mauvaise surprise.",
    "Voyager avec un animal ? Prévenez à la réservation : les animaux en caisse de moins de 10 kg sont acceptés sans supplément à {{city}}.",
    "Un vol qui arrive tard ou tôt ? Indiquez le numéro de vol : le chauffeur le suit en temps réel et s'adapte aux retards, sans frais.",
    "Prévoyez le paiement par carte si vous n'avez pas d'espèces : la CB est acceptée dans tous nos véhicules à {{city}}.",
    "Le tarif de nuit (19h-7h) et les dimanches/jours fériés comportent une majoration réglementée : elle est affichée, rien de caché.",
    "En zone très dense à {{city}}, le chauffeur connaît les raccourcis : faites-lui confiance plutôt qu'au GPS, il vous fera gagner du temps.",
    "Pour les rendez-vous médicaux réguliers (dialyse, kiné), réservez vos allers-retours en série : un seul appel pour toute la semaine.",
    "Vérifiez le numéro d'immatriculation et la plaque taxi avant de monter, surtout le soir : la sécurité d'abord.",
    "Un oubli dans le véhicule ? Appelez-nous immédiatement : chaque course est tracée et on retrouve les objets perdus rapidement."
];

const LOCAL_KNOWLEDGE_ITEMS: string[] = [
    "Le stationnement à {{city}} est réputé {{parking_difficulty}} : en taxi, vous êtes déposé à la porte, sans tourner en rond.",
    "Les chauffeurs de {{city}} connaissent les itinéraires de contournement des heures de pointe : un trajet fluide même aux heures chargées.",
    "De {{city}}, les principaux aéroports parisiens sont accessibles 24h/24 en forfait fixe, y compris les jours fériés.",
    "Les gares{{stations_text}} sont desservies toute la journée : idéal pour prendre un TGV sans stress de correspondance.",
    "Le transport médical conventionné depuis {{city}} est pris en charge par la CPAM sur prescription : pensez-y pour vos rendez-vous.",
    "En soirée, la demande explose à {{city}} : une réservation anticipée garantit votre créneau, surtout le week-end.",
    "Les grands événements à {{city}} (concerts, matchs) génèrent des fermetures de rues : nos chauffeurs adaptent l'itinéraire en direct."
];

const NEWS_ITEMS: string[] = [
    "Nouveauté {{year}} : la réservation en ligne se fait désormais en 30 secondes depuis votre téléphone, avec confirmation immédiate à {{city}}.",
    "Nos chauffeurs de {{city}} sont équipés du paiement sans contact : réglez votre course en un geste, comme au supermarché.",
    "Le service VSL conventionné de {{city}} renforce sa flotte de véhicules PMR avec rampe d'accès pour personnes à mobilité réduite.",
    "Tarifs 2026 à {{city}} : les forfaits aéroports restent fixes et annoncés à l'avance, conformément à l'arrêté préfectoral.",
    "La navette {{city}} → aéroports étend ses horaires : désormais disponible de 3h du matin à 23h, 7j/7, pour les vols très matinaux.",
    "Départ en vacances ? Pensez à la réservation aller-retour depuis {{city}} : créneau garanti pour votre retour."
];

const COMPARISON_HEADLINES: string[] = [
    "Prix garanti à l'avance (forfait aéroport)",
    "Chauffeur local qui connaît {{city}} et ses raccourcis",
    "Disponible 24h/24 même pour les vols tardifs",
    "Paiement CB, espèces ou facture professionnelle",
    "Aide avec les bagages incluse",
    "Transport médical conventionné CPAM (VSL)"
];

const TAXI_VS_POINTS: string[] = [
    "Bus et métro s'arrêtent tôt le soir : après 0h30, le taxi est souvent la seule option à {{city}}.",
    "Le VTC applique la tarification dynamique : le prix peut doubler aux heures de pointe ou sous la pluie, ce qui n'arrive jamais avec nos forfaits fixes.",
    "Uber affiche parfois un prix attractif, puis ajoute des suppléments (trafic, zone). Le taxi réglementé à {{city}} affiche le tarif officiel dès le départ.",
    "Avec les bagages ou une poussette, marcher jusqu'à un arrêt de bus est pénible : le taxi vous dépose porte à porte.",
    "Pour un rendez-vous médical, seuls le taxi et le VSL conventionné permettent une prise en charge par la Sécurité Sociale à {{city}}."
];

// ----------------------------------------------------------------------------
// PUBLIC API
// ----------------------------------------------------------------------------

export function getHelpfulContent(
    type: ContentType,
    site: CityConfig | string,
    context: 'HUB' | 'LOCAL' = 'HUB'
): string {
    const cityStr = typeof site === 'string' ? site : site.city;
    const dept = typeof site === 'string' ? "75" : (site.department || "75");

    const hospitals = typeof site !== 'string' && site.hospitals?.length ? site.hospitals : [];
    const stations = typeof site !== 'string' && site.stations?.length ? site.stations : [];
    const parkingDiff = typeof site !== 'string' ? site.points_of_interest?.parking_difficulty : "Moyenne";

    // Format special dynamic block variables
    const deptBracket = dept ? ` (${dept})` : "";
    const hospitalsText = hospitals.length > 0 ? `, notamment ${formatList(hospitals)}` : "";
    const stationsText = stations.length > 0 ? ` vers la gare de ${formatList(stations)}` : " vers la gare de votre choix";

    const vars: Record<string, string> = {
        city: cityStr,
        dept: dept,
        dept_bracket: deptBracket,
        hospitals_text: hospitalsText,
        stations_text: stationsText,
        parking_difficulty: parkingDiff.toLowerCase(),
        year: new Date().getFullYear().toString()
    };

    // Deterministically pick template using string hash of the city, type and context
    const seedString = `${cityStr}-${type}-${context}`;
    const hash = stringHash(seedString);
    const pool = templates[type] || [`[Missing template for ${type}]`];
    const rawTemplate = pool[hash % pool.length];

    // Replace placeholders like {{city}}
    let text = rawTemplate.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return key in vars ? vars[key] : match;
    });

    // Spin final nested brackets like {A|B|C}
    return spin(text, seedString);
}

/**
 * Returns a deterministic, de-duplicated list of generated items
 * (conseils, faits locaux, actus...) seeded per city.
 */
export function getHelpfulList(
    pool: "conseil" | "local_knowledge" | "news" | "comparison_point" | "taxi_vs",
    site: CityConfig | string,
    count: number,
    context: 'HUB' | 'LOCAL' = 'HUB'
): string[] {
    const cityStr = typeof site === 'string' ? site : site.city;
    const dept = typeof site === 'string' ? "75" : (site.department || "75");
    const stations = typeof site !== 'string' && site.stations?.length ? site.stations : [];
    const stationsText = stations.length > 0 ? ` vers la gare de ${formatList(stations)}` : " vers la gare de votre choix";
    const parkingDiff = typeof site !== 'string' ? site.points_of_interest?.parking_difficulty : "Moyenne";

    const vars: Record<string, string> = {
        city: cityStr,
        dept: dept,
        parking_difficulty: parkingDiff.toLowerCase(),
        stations_text: stationsText,
        year: new Date().getFullYear().toString()
    };

    let rawPool: string[];
    switch (pool) {
        case "conseil": rawPool = CONSEIL_ITEMS; break;
        case "local_knowledge": rawPool = LOCAL_KNOWLEDGE_ITEMS; break;
        case "news": rawPool = NEWS_ITEMS; break;
        case "comparison_point": rawPool = COMPARISON_HEADLINES; break;
        case "taxi_vs": rawPool = TAXI_VS_POINTS; break;
        default: rawPool = [];
    }

    const seedString = `${cityStr}-${pool}-${context}`;
    const seed = stringHash(seedString);

    // Replace vars in raw pool first
    const filled = rawPool.map(t => t.replace(/\{\{(\w+)\}\}/g, (match, key) => key in vars ? vars[key] : match));

    // Deterministic shuffle, then pick without replacement
    const shuffled = seededShuffle(filled, seed);
    return shuffled.slice(0, Math.min(count, shuffled.length)).map(t => spin(t, `${seedString}-${t}`));
}
