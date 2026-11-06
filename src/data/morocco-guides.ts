/**
 * ZwinCar.com — Guides Routiers & Conseils Pratiques Maroc (High Information Gain & Non-Doorway)
 * Rédigés par des experts locaux de la route marocaine.
 */

export interface MoroccoGuide {
    slug: string;
    title: string;
    shortTitle: string;
    metaDescription: string;
    heroImage: string;
    publishedAt: string;
    updatedAt: string;
    readTimeMinutes: number;
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    category: "Réglementation" | "Itinéraire & Roadtrip" | "Assurance & Caution" | "Conseils Pratiques";
    summaryDirectAnswer: string;
    sections: {
        id: string;
        heading: string;
        content: string; // Markdown or rich text
        callout?: {
            type: "warning" | "tip" | "info";
            text: string;
        };
    }[];
    faqs: {
        question: string;
        answer: string;
    }[];
    relatedHubs: string[];
    relatedVehicles: string[];
    alternateSlug?: string;
}

export const MOROCCO_GUIDES: MoroccoGuide[] = [
    {
        slug: "conduire-au-maroc-reglementation-radars",
        title: "Conduire au Maroc en 2026 : Règles de Circulation, Radars Fixes et Contrôles de Police",
        shortTitle: "Règles, Radars & Contrôles Routiers",
        metaDescription: "Guide complet pour conduire sereinement au Maroc : limitations de vitesse réelles, pièges des ronds-points à priorité à droite, radars mobiles et barrages de gendarmerie.",
        heroImage: "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=1600&q=80",
        publishedAt: "2026-03-15",
        updatedAt: "2026-10-18",
        readTimeMinutes: 7,
        author: {
            name: "Hamza Benjelloun",
            role: "Directeur Opérations & Sécurité Routière ZwinCar",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
        },
        category: "Réglementation",
        summaryDirectAnswer: "Au Maroc, la conduite se fait à droite. Les limitations sont de 120 km/h sur autoroute, 100 km/h sur voie express hors agglomération et 60 km/h en ville (souvent 40 km/h en centre historique). Attention majeure : sur les carrefours giratoires sans panneau 'Cédez le passage', la priorité est à droite (véhicule entrant). Les barrages de gendarmerie royale et de police nationale sont fréquents : marquez toujours un arrêt complet au panneau 'Halte Police / Gendarmerie' avant d'être invité à avancer.",
        sections: [
            {
                id: "limitations-vitesse-radars",
                heading: "1. Limitations de Vitesse et Radars au Maroc",
                content: `Le réseau autoroutier marocain (géré par ADM) est moderne et fluide, mais très surveillé.
- **Autoroute :** 120 km/h (tolérance technique minime).
- **Voie express / Route nationale hors agglomération :** 100 km/h ou 80 km/h selon signalisation.
- **Agglomération / Villes :** 60 km/h, abaissé à 40 km/h près des écoles ou souks.

Le Maroc déploie des centaines de radars fixes nouvelle génération capables de flasher dans les deux sens de circulation ainsi que des radars tronçons sur les autoroutes A1 (Rabat-Casablanca) et A3 (Casablanca-Marrakech). Les gendarmes utilisent également des jumelles laser aux abords des descentes d'autoroute et des zones de travaux.`,
                callout: {
                    type: "warning",
                    text: "L'amende pour dépassement de vitesse inférieur à 20 km/h est de 150 MAD (environ 14 €) payable sur-le-champ avec reçu officiel remis par l'agent."
                }
            },
            {
                id: "piege-ronds-points",
                heading: "2. Le Piège des Ronds-Points : Priorité à Droite ou Giratoire ?",
                content: `C'est la cause numéro 1 d'accrochage pour les touristes européens au Maroc.
Dans la majorité des pays d'Europe, la priorité appartient toujours au véhicule déjà engagé sur l'anneau.
Au Maroc, **deux systèmes coexistent** :
1. **Carrefour Giratoire avec panneau 'Cédez le passage' :** Priorité aux véhicules déjà engagés sur l'anneau (standard européen).
2. **Rond-Point sans panneau 'Cédez le passage' :** La règle fondamentale du code de la route s'applique : **Priorité à Droite** ! Cela signifie que les voitures arrivant de l'extérieur ont la priorité absolue sur celles qui tournent sur le rond-point.

En cas de doute, ralentissez systématiquement et observez le comportement des conducteurs locaux avant de vous insérer.`
            },
            {
                id: "controles-barrages",
                heading: "3. Comment se comporter aux Barrages de Gendarmerie et Police ?",
                content: `À l'entrée et à la sortie de chaque grande ville marocaine, vous rencontrerez des barrages filtrants.
- **Panneau 'Halte Police' ou 'Ralentir Barrage' :** Marquez un arrêt obligatoire ou ralentissez à moins de 10 km/h jusqu'au signe de l'agent.
- **La nuit :** Allumez impérativement le plafonnier intérieur pour rendre l'habitacle visible et baissez votre vitre.
- **Documents obligatoires :** Permis de conduire original (permis français, européen, britannique ou international accepté), contrat de location ZwinCar, carte grise originale du véhicule (dans la pochette zippée dans la boîte à gants).`
            }
        ],
        faqs: [
            {
                question: "Le permis de conduire français ou européen est-il valable au Maroc ?",
                answer: "Oui, un permis de conduire national (France, Belgique, Suisse, Royaume-Uni, UE) en cours de validité suffit pour louer et conduire au Maroc pour un séjour touristique de moins de 90 jours. Le permis international n'est pas obligatoire."
            },
            {
                question: "Quel est le taux d'alcoolémie autorisé au volant au Maroc ?",
                answer: "Tolérance ZÉRO (0,00 g/L). Conduire sous l'empire d'un état alcoolique au Maroc entraîne la mise en fourrière immédiate du véhicule, une rétention de permis et des poursuites pénales sévères."
            }
        ],
        relatedHubs: ["marrakech", "casablanca", "agadir"],
        relatedVehicles: ["dacia-sandero-stepway", "renault-clio-5"]
    },
    {
        slug: "traverser-col-du-tichka-marrakech-ouarzazate",
        title: "Passer le Col du Tichka (N9) : État de la Route, Météo, Virages et Choix du Véhicule",
        shortTitle: "Traverser le Col du Tichka (N9)",
        metaDescription: "Guide pratique pour franchir le Tizi n'Tichka (2 260 m) reliant Marrakech à Ouarzazate : virages, conduite en montagne, neige en hiver et véhicule recommandé.",
        heroImage: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=80",
        publishedAt: "2026-04-10",
        updatedAt: "2026-10-22",
        readTimeMinutes: 8,
        author: {
            name: "Hamza Benjelloun",
            role: "Directeur Opérations & Sécurité Routière ZwinCar",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
        },
        category: "Itinéraire & Roadtrip",
        summaryDirectAnswer: "Le Tizi n'Tichka culmine à 2 260 mètres d'altitude sur la route nationale N9 reliant Marrakech à Ouarzazate (environ 200 km, comptez 4h de route). La route a été entièrement élargie et sécurisée en 2x2 voies sur de larges portions. Pour une traversée confortable, privilégiez un véhicule surélevé avec du couple (Dacia Duster Diesel ou Sandero Stepway). En hiver (décembre à février), renseignez-vous sur les chutes de neige au sommet avant le départ.",
        sections: [
            {
                id: "profil-route-n9",
                heading: "1. Profil de la Route et Temps de Trajet",
                content: `La N9 est l'une des plus spectaculaires routes de montagne au monde. Partant des plaines du Haouz (450 m), elle s'élève jusqu'à 2 260 m avant de redescendre vers les vallées présahariennes d'Ouarzazate.
- **Distance :** 195 km.
- **Durée réelle :** 3h45 à 4h15 avec les arrêts photos.
- **Revêtement :** Asphalte de bonne qualité sur 95% du tracé grâce aux récents travaux de modernisation des autorités marocaines.`
            },
            {
                id: "techniques-conduite-montagne",
                heading: "2. Techniques de Conduite et Sécurité dans les Lacets",
                content: `Dans la descente vers Ouarzazate, évitez de solliciter continuellement la pédale de frein pour ne pas faire surchauffer les plaquettes (phénomène de fading).
- **Rétrogradez en 2ème ou 3ème vitesse** pour utiliser le frein moteur.
- **Respectez scrupuleusement la ligne blanche continue :** Des contrôles par caméra et gendarmerie mobile sont postés aux belvédères.
- **Dépassement des poids lourds :** Les chauffeurs de camions marocains sont coopératifs : ils mettent souvent leur clignotant droit pour vous signaler que la voie est libre pour doubler.`
            },
            {
                id: "meteo-hiver-tichka",
                heading: "3. Conduire au Tichka en Hiver (Novembre à Mars)",
                content: `Entre décembre et février, le col peut être ponctuellement enneigé ou verglacé tôt le matin. Les chasse-neiges de l'équipement dégagent rapidement la chaussée, mais la circulation peut être ralentie ou soumise à l'obligation de chaînes lors d'épisodes de tempête. Consultez l'application ADM ou demandez conseil à votre agent ZwinCar avant de quitter Marrakech.`
            }
        ],
        faqs: [
            {
                question: "Une petite citadine (Clio, Picanto) peut-elle passer le Tichka ?",
                answer: "Oui, la route est totalement goudronnée. Cependant, avec la climatisation et 4 passagers avec bagages, une petite motorisation essence manquera de reprise dans les fortes montées. Un moteur turbo diesel comme celui du Duster ou de la Sandero Stepway offre un confort de conduite nettement supérieur."
            },
            {
                question: "Où faire une pause café sur la route du Tichka ?",
                answer: "Le village de Taddart (avant la montée finale) propose de nombreuses auberges réputées pour leurs tajines d'agneau et thé à la menthe avec vue sur la vallée."
            }
        ],
        relatedHubs: ["marrakech", "ouarzazate"],
        relatedVehicles: ["dacia-duster-4x4", "toyota-prado-tx", "dacia-sandero-stepway"]
    },
    {
        slug: "caution-voiture-maroc-pieges-a-eviter",
        title: "Caution Location de Voiture au Maroc : Comment Éviter le Piège des 1 500 € Bloqués",
        shortTitle: "Caution & Assurances : Les Pièges",
        metaDescription: "Pourquoi les courtiers bloquent 1 500 € à 2 500 € sur votre carte à l'aéroport au Maroc ? Différence carte de crédit vs débit et solution ZwinCar sans caution CB.",
        heroImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1600&q=80",
        publishedAt: "2026-05-02",
        updatedAt: "2026-10-28",
        readTimeMinutes: 6,
        author: {
            name: "Hamza Benjelloun",
            role: "Directeur Opérations & Sécurité Routière ZwinCar",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
        },
        category: "Assurance & Caution",
        summaryDirectAnswer: "Le piège numéro 1 des comparateurs à 7 €/jour au Maroc est l'obligation d'une 'Carte de Crédit' (à débit différé) pour bloquer 1 500 € à 2 500 € de caution au guichet de l'aéroport. Les cartes de débit courantes (Revolut, N26, Visa Classic Débit) y sont refusées, forçant le voyageur à acheter une assurance locale à 25 €/jour. De plus, l'assurance 'Remboursement de franchise' achetée sur les comparateurs est un produit étranger (souvent letton ou maltais) que les loueurs locaux ignorent totalement en cas de rayure. ZwinCar résout ce problème avec des cautions souples en espèces restituées sur place ou l'option Franchise Zéro.",
        sections: [
            {
                id: "mecanisme-piege-courtier",
                heading: "1. L'Anatomie du Piège des Comparateurs à Bas Prix",
                content: `Sur internet, vous trouvez des offres alléchantes : une voiture pour 8 € par jour à l'aéroport de Marrakech.
Une fois arrivé au guichet après 45 minutes d'attente, l'agent vous demande votre carte bancaire.
Si votre carte porte la mention 'DÉBIT' (ce qui est le cas de 85% des cartes françaises et européennes), l'agent refuse l'empreinte de caution de 1 500 € ou prétend que le terminal ne l'accepte pas.
**L'alternative imposée :** Vous devez soit payer leur assurance tous risques locale au prix fort (20 à 30 € par jour supplémentaire), soit repartir sans la voiture avec la réservation non remboursée.`
            },
            {
                id: "fausse-assurance-en-ligne",
                heading: "2. Pourquoi l'Assurance en Ligne du Courtier ne Fonctionne Pas sur Place",
                content: `Quand un comparateur vous vend sa propre 'Couverture Complète' à 9 €/jour, ce n'est PAS une assurance auprès du loueur marocain. C'est une police de remboursement basée dans l'Union Européenne.
En cas de rayure, de bris de glace ou d'accrochage :
- Le loueur marocain encaisse immédiatement votre caution sur place.
- C'est à vous, des semaines plus tard, de monter un dossier d'indemnisation avec rapports de police et factures certifiées pour espérer un remboursement par le courtier étranger.`
            },
            {
                id: "modele-zwincar",
                heading: "3. La Révolution ZwinCar : Transparence et Débit Accepté",
                content: `Chez ZwinCar, nous travaillons exclusivement avec des agences locales partenaires auditées selon un cahier des charges strict :
- **Cartes de débit acceptées :** Cartes classiques, Revolut, N26, Wise acceptées sans frais caché.
- **Option Franchise Zéro (+8€/j) :** Rachat complet des franchises carrosserie et bris de glace directement intégré auprès du partenaire local.
- **Dépôt cash souple restitué au départ :** Pour les formules standards, le faible dépôt de garantie (300 €) peut être laissé en espèces et vous est restitué en mains propres lors du check-out au parking.`
            }
        ],
        faqs: [
            {
                question: "Puis-je louer chez ZwinCar sans aucune carte bancaire ?",
                answer: "Oui, vous pouvez régler l'acompte de réservation en ligne par Stripe avec n'importe quelle carte, puis payer le solde restant et la caution en espèces (MAD ou EUR) directement à l'agent lors de la remise des clés."
            },
            {
                question: "Comment se passe l'état des lieux de retour chez ZwinCar ?",
                answer: "Le check-out prend moins de 3 minutes. Grâce aux 4 photos haute définition horodatées prises lors du départ avec notre outil d'inspection mobile, aucune contestation n'est possible."
            }
        ],
        relatedHubs: ["marrakech", "agadir", "casablanca", "tanger"],
        relatedVehicles: ["dacia-sandero-stepway", "renault-clio-5", "hyundai-accent-auto"]
    },
    {
        slug: "roadtrip-cote-atlantique-agadir-essaouira-taghazout",
        title: "Roadtrip Côte Atlantique : D'Agadir à Essaouira par la Route Côtière (Taghazout, Imsouane)",
        shortTitle: "Roadtrip Côte Atlantique (Agadir - Essaouira)",
        metaDescription: "Itinéraire de 175 km le long de l'Atlantique : spots de surf de Taghazout, falaise magique d'Imsouane, arganeraies et arrivée à Essaouira Mogador.",
        heroImage: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=80",
        publishedAt: "2026-06-12",
        updatedAt: "2026-10-30",
        readTimeMinutes: 7,
        author: {
            name: "Hamza Benjelloun",
            role: "Directeur Opérations & Sécurité Routière ZwinCar",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
        },
        category: "Itinéraire & Roadtrip",
        summaryDirectAnswer: "La route nationale N1 reliant Agadir à Essaouira longe l'océan Atlantique sur 175 km (comptez 3h30 sans les pauses). C'est l'itinéraire rêvé pour les surfeurs et amateurs de grands espaces côtiers, traversant Taghazout Bay, le spectaculaire panorama d'Imsouane et les forêts d'arganiers de Tamanar. Une compacte surélevée comme la Dacia Sandero Stepway ou un Duster 4x2 est parfaite pour accéder aux parkings de plages et sentiers côtiers.",
        sections: [
            {
                id: "etape-1-taghazout",
                heading: "Étape 1 : D'Agadir à Taghazout & Imi Ouaddar (25 km)",
                content: `À la sortie nord d'Agadir, la voie express à 4 voies longe la corniche d'Anza avant de déboucher sur la baie de Taghazout.
- **Points d'arrêt :** Le village de Taghazout (ruelles piétonnes, cafés face aux vagues), Anchor Point pour observer les pros surfer, et la plage de Paradis Plage à Imi Ouaddar.
- **Conseil stationnement :** Les esplanades en terre face aux spots sont surveillées par des gardiens locaux (10 à 20 MAD pour la demi-journée).`
            },
            {
                id: "etape-2-imsouane",
                heading: "Étape 2 : Le Panorama d'Imsouane (La plus longue vague d'Afrique)",
                content: `Après Tamri (connu pour ses bananeraies en bord de mer), quittez la N1 pour descendre vers la presqu'île d'Imsouane.
La descente offre une vue plongeante à 180° sur la baie de la Cathédrale et le port de pêche artisanale. Dégustez-y des poissons grillés ultra-frais directement à la sortie des barques bleues traditionnelles.`
            },
            {
                id: "etape-3-essaouira",
                heading: "Étape 3 : Traversée des Arganeraies vers Essaouira Mogador",
                content: `En remontant vers Essaouira, la route serpente à travers la réserve de biosphère de l'arganier. Soyez attentifs : les chèvres perchées dans les arbres sont fréquentes sur le bas-côté. Arrivée à Essaouira par la Porte Bab Doukkala ou Bab El Menzeh avec stationnement sur le grand parking gardé du port (25 MAD/24h).`
            }
        ],
        faqs: [
            {
                question: "Peut-on transporter une planche de surf avec les voitures ZwinCar ?",
                answer: "Oui, nous proposons sur demande des sangles souples de toit ou vous pouvez rabattre la banquette 2/3 - 1/3 sur les modèles Sandero Stepway et Duster pour glisser des planches jusqu'à 7'6 à l'intérieur."
            },
            {
                question: "Y a-t-il des stations-service fiables sur le trajet Agadir-Essaouira ?",
                answer: "Oui, des stations modernes (Afriquia, Shell, TotalEnergies) avec cafés propres et distributeurs sont situées à Taghazout Bay, Tamri, Tamanar et Smimou."
            }
        ],
        relatedHubs: ["agadir", "marrakech"],
        relatedVehicles: ["dacia-duster-4x4", "dacia-sandero-stepway"]
    }
];

export function getGuideBySlug(slug: string): MoroccoGuide | undefined {
    return MOROCCO_GUIDES.find((g) => g.slug === slug);
}
