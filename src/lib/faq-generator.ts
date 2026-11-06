import { CityConfig } from "@/lib/db";
import { seededRandom, stringHash } from "@/lib/content";

interface GeneratedFAQ {
    question: string;
    answer: string;
}

/**
 * Generates hyper-local FAQs for a city based on its configuration.
 * Uses deterministic seeding for consistent output across renders.
 */
export function generateCityFAQs(city: CityConfig, type: "general" | "medical" | "airport" | "local" | "pmr" | "night" | "price", count: number = 4): GeneratedFAQ[] {
    const seed = stringHash(city.city + type + "faq");
    const faqs: GeneratedFAQ[] = [];

    // Template pools for each type
    const templates: Record<string, { questions: string[]; answers: string[] }> = {
        general: {
            questions: [
                `Quel est le prix d'un taxi à ${city.city} ?`,
                `Comment réserver un taxi rapidement à ${city.city} ?`,
                `Y a-t-il des taxis disponibles la nuit à ${city.city} ?`,
                `Peut-on réserver un taxi pour le lendemain à ${city.city} ?`,
                `Acceptez-vous les animaux de compagnie dans vos taxis à ${city.city} ?`,
                `Quels modes de paiement acceptent vos taxis à ${city.city} ?`,
                `Comment annuler une réservation de taxi à ${city.city} ?`,
                `Combien de temps à l'avance faut-il réserver un taxi à ${city.city} ?`,
                `Un taxi à ${city.city} peut-il attendre pendant une course ou un rendez-vous ?`,
                `Proposez-vous des sièges auto pour enfants à ${city.city} ?`,
                `Puis-je payer mon taxi à ${city.city} par virement ou avec une facture professionnelle ?`,
                `Que faire si j'oublie un objet dans le taxi à ${city.city} ?`,
            ],
            answers: [
                `Le tarif moyen pour une course locale à ${city.city} démarre à ${city.pricing.base}. Pour les trajets aéroports et gares, nous proposons des forfaits fixes sans surprise.`,
                `Vous pouvez réserver en quelques secondes via notre formulaire en ligne ou par téléphone. Un chauffeur stationné près de ${city.city} vous sera attribué sous 10 minutes.`,
                `Oui, notre service est disponible 24h/24 et 7j/7 à ${city.city}, y compris les nuits, week-ends et jours fériés. Des tarifs de nuit réglementés s'appliquent après 19h.`,
                `Absolument. Nous vous encourageons même à réserver votre taxi au moins quelques heures à l'avance pour garantir la disponibilité, surtout pour les départs matinaux.`,
                `Oui, sous réserve de signaler la présence de votre animal lors de la réservation. Les petits animaux (moins de 10kg) en caisse sont généralement acceptés sans supplément.`,
                `Nos chauffeurs à ${city.city} acceptent les espèces et les cartes bancaires (Visa, Mastercard, Amex). Certains acceptent également Apple Pay et Google Pay.`,
                `Vous pouvez annuler gratuitement votre réservation jusqu'à 1 heure avant le départ prévu. Au-delà, des frais d'annulation peuvent s'appliquer.`,
                `Pour une demande immédiate, comptez 10 à 15 minutes d'attente à ${city.city}. Pour un départ matinal (avant 7h) ou un jour de grande affluence, réservez la veille : c'est gratuit et cela garantit votre créneau.`,
                `Oui, le taxi peut vous attendre (cours, restaurant, rendez-vous médical). La première tranche d'attente est généralement incluse, puis un tarif horaire réglementé s'applique. Prévenez simplement le chauffeur à la réservation.`,
                `Oui, sur demande préalable nous équipons le véhicule de sièges bébé (groupe 0+) ou de réhausseurs adaptés à l'âge et au poids de l'enfant, sans supplément à ${city.city}.`,
                `Oui, les chauffeurs de ${city.city} remettent une facture professionnelle pour tous les déplacements d'affaires. Le paiement par carte ou par virement sur facture est accepté pour les entreprises.`,
                `Contactez-nous dès que possible : chaque course est tracée avec le chauffeur et le véhicule. Nous retrouvons la grande majorité des objets perdus (téléphones, bagages, papiers) en moins de 24h à ${city.city}.`,
            ],
        },
        night: {
            questions: [
                `Quel est le tarif d'un taxi de nuit à ${city.city} ?`,
                `Y a-t-il des taxis après 2h du matin à ${city.city} ?`,
                `Le taxi de nuit est-il sûr à ${city.city} ?`,
                `Comment rentrer de soirée à ${city.city} sans conduire ?`,
            ],
            answers: [
                `La nuit (19h-7h), une majoration réglementée s'applique au compteur à ${city.city}. Elle est fixée par l'arrêté préfectoral et reste inférieure au tarif de jour sur les longues distances. Le prix est toujours affiché avant le départ.`,
                `Oui, notre réseau fonctionne 24h/24 à ${city.city}, y compris la nuit profonde et les jours fériés. Pour les horaires très tardifs (vols, fins de concerts), la réservation anticipée est recommandée.`,
                `Oui : chauffeurs vérifiés et identifiés, véhicules en règle, itinéraires connus. C'est même souvent la solution la plus sûre pour rentrer de soirée à ${city.city}, surtout après la fermeture des transports en commun.`,
                `En réservant votre taxi de nuit à ${city.city}, vous repartez sans attendre, sans conduire fatigué et sans chercher de parking. Un réflexe simple pour une soirée réussie.`,
            ],
        },
        price: {
            questions: [
                `Comment est calculé le prix d'un taxi à ${city.city} ?`,
                `Les forfaits aéroport à ${city.city} sont-ils fixes ?`,
                `Le prix du taxi augmente-t-il aux heures de pointe à ${city.city} ?`,
                `Y a-t-il des suppléments bagages ou péages à ${city.city} ?`,
            ],
            answers: [
                `Le prix d'un taxi à ${city.city} combine une prise en charge (${city.pricing.base}), un tarif au kilomètre et une éventuelle majoration horaire (nuit, dimanche, jour férié). Tous nos compteurs sont homologués et scellés par les autorités.`,
                `Oui, les trajets vers les aéroports et gares depuis ${city.city} bénéficient de forfaits fixes annoncés à l'avance : pas de surprise, même en cas de bouchons.`,
                `Non, contrairement aux applications de VTC, le taxi réglementé à ${city.city} n'applique pas de tarification dynamique : le prix au compteur ne dépend pas de la demande.`,
                `Les bagages et le premier sac sont gratuits à ${city.city}. Seuls les péages autoroutiers éventuels sont ajoutés au compteur, comme dans toutes les villes de France.`,
            ],
        },
        medical: {
            questions: [
                `Comment obtenir un bon de transport pour mon taxi médical à ${city.city} ?`,
                `Le taxi conventionné est-il gratuit à ${city.city} ?`,
                `Pouvez-vous m'accompagner jusqu'à la salle d'attente de l'hôpital ?`,
                `Faites-vous la dialyse et les rendez-vous réguliers à ${city.city} ?`,
                `Quels hôpitaux desservez-vous depuis ${city.city} ?`,
            ],
            answers: [
                `Votre médecin traitant ou le spécialiste peut vous prescrire un "Bon de Transport" (document Cerfa). Présentez-le à notre chauffeur et la Sécurité Sociale prendra en charge tout ou partie des frais.`,
                `Avec une prescription médicale et le tiers payant, vous n'avez rien à avancer. Nous sommes conventionnés CPAM et gérons directement la facturation.`,
                `Oui, nos chauffeurs formés au transport de personnes à mobilité réduite vous assistent depuis votre domicile jusqu'au service médical, et inversement.`,
                `Nous sommes spécialisés dans les transports réguliers (dialyse, chimiothérapie, rééducation). Nous pouvons même planifier vos allers-retours sur plusieurs semaines.`,
                city.hospitals && city.hospitals.length > 0
                    ? `Nous desservons notamment : ${city.hospitals.slice(0, 3).join(", ")}. Contactez-nous pour toute autre destination médicale.`
                    : `Nous desservons tous les hôpitaux et cliniques de la région. Contactez-nous pour une estimation.`,
            ],
        },
        pmr: {
            questions: [
                `Votre taxi est-il accessible en fauteuil roulant à ${city.city} ?`,
                `Comment réserver un taxi PMR à ${city.city} ?`,
                `Le transport PMR est-il pris en charge par la CPAM ?`,
                `Quels équipements PMR avez-vous dans vos véhicules ?`,
                `Faut-il une prescription médicale pour un taxi PMR à ${city.city} ?`,
                `Prenez-vous en charge les personnes avec déambulateur à ${city.city} ?`,
            ],
            answers: [
                `Oui, notre flotte à ${city.city} comprend des véhicules spécialement aménagés avec rampe d'accès ou plateforme élévatrice pour accueillir les fauteuils roulants en toute sécurité.`,
                `La réservation est simple : appelez-nous ou utilisez notre formulaire en ligne en précisant vos besoins PMR. Nous vous attribuons un véhicule adapté, disponible sous 30 minutes.`,
                `Oui, avec une prescription médicale (bon de transport Cerfa), le transport PMR est pris en charge par la CPAM. Nous pratiquons le tiers payant, vous n'avancez aucun frais.`,
                `Nos véhicules PMR sont équipés de rampes d'accès, système d'arrimage pour fauteuils roulants, suspensions confort et barres de maintien. Nos chauffeurs sont formés à l'aide à l'embarquement.`,
                `Pour un transport médical avec prise en charge CPAM, oui une prescription est nécessaire. Pour un déplacement privé (courses, loisirs), aucune prescription n'est requise.`,
                `Absolument. Nos chauffeurs assistent les personnes utilisant un déambulateur, des béquilles ou ayant des difficultés de déplacement. L'aide à la montée et à la descente est incluse.`,
            ],
        },
        airport: {
            questions: [
                `Combien coûte un taxi de ${city.city} vers l'aéroport ?`,
                `Faites-vous des navettes Orly et Roissy CDG depuis ${city.city} ?`,
                `Que se passe-t-il si mon vol est annulé ?`,
                `Avez-vous des vans pour les groupes voyageant à l'aéroport ?`,
                `Votre chauffeur vient-il me chercher dans le terminal ?`,
            ],
            answers: [
                `Le prix varie selon la destination. Depuis ${city.city}, comptez environ 45€ à 75€ pour Orly et 60€ à 90€ pour Roissy CDG. Demandez un devis précis via notre formulaire.`,
                `Oui, c'est notre spécialité ! Navettes disponibles 24h/24 vers tous les aéroports parisiens et les gares TGV. Réservation conseillée pour garantir le créneau.`,
                `Nous vous informons dès que nous détectons un retard. En cas d'annulation, la réservation peut être décalée sans frais ou remboursée intégralement.`,
                `Absolument. Notre flotte comprend des vans pouvant transporter jusqu'à 8 passagers et tous leurs bagages pour les transferts de groupe vers l'aéroport.`,
                `Oui, pour les arrivées, votre chauffeur vous attend avec une pancarte nominative juste à la sortie des bagages de votre terminal.`,
            ],
        },
        local: {
            questions: city.neighborhoods && city.neighborhoods.length > 0
                ? [
                    `Intervenez-vous dans le quartier ${city.neighborhoods[0]} à ${city.city} ?`,
                    `Y a-t-il un taxi stationné près de chez moi à ${city.city} ?`,
                    `Quel est le temps d'attente moyen pour un taxi local à ${city.city} ?`,
                    `Peut-on réserver un taxi pour des courses locales à ${city.city} ?`,
                ]
                : [
                    `Y a-t-il des taxis de proximité à ${city.city} ?`,
                    `Comment trouver un taxi rapidement dans mon quartier ?`,
                    `Quel est le temps d'attente moyen à ${city.city} ?`,
                    `Les petites courses sont-elles acceptées ?`,
                ],
            answers: [
                city.neighborhoods && city.neighborhoods.length > 0
                    ? `Oui, nous couvrons tous les quartiers de ${city.city}, dont ${city.neighborhoods.slice(0, 3).join(", ")}. Nos chauffeurs locaux connaissent parfaitement ces secteurs.`
                    : `Oui, notre réseau de taxis locaux couvre l'intégralité de ${city.city} et ses environs immédiats.`,
                `Notre application vous met en relation avec le taxi le plus proche. En général, vous êtes pris en charge sous 5 à 10 minutes.`,
                `En moyenne, un taxi arrive en moins de 10 minutes pour une demande immédiate à ${city.city}. La réservation anticipée garantit la ponctualité.`,
                `Bien sûr ! Que ce soit pour un court trajet dans ${city.city} ou une course vers la gare la plus proche, aucune course n'est trop petite pour nous.`,
            ],
        },
    };

    const pool = templates[type] || templates.general;

    // Create an array of indices [0, 1, 2, ... length-1]
    const indices = Array.from({ length: pool.questions.length }, (_, i) => i);

    // Shuffle indices deterministically using the seed
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed + i) * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Select the first 'count' indices
    const selectedIndices = indices.slice(0, Math.min(count, pool.questions.length));

    for (const index of selectedIndices) {
        faqs.push({
            question: pool.questions[index],
            answer: pool.answers[index],
        });
    }

    return faqs;
}

/**
 * Generates FAQs structured for Schema.org FAQPage markup.
 */
export function generateFAQSchema(city: CityConfig): { "@type": "Question"; name: string; acceptedAnswer: { "@type": "Answer"; text: string } }[] {
    const allFaqs = [
        ...generateCityFAQs(city, "general", 3),
        ...generateCityFAQs(city, "airport", 2),
        ...generateCityFAQs(city, "medical", 2),
        ...generateCityFAQs(city, "night", 2),
        ...generateCityFAQs(city, "price", 2),
    ];

    return allFaqs.map((faq) => ({
        "@type": "Question" as const,
        name: faq.question,
        acceptedAnswer: {
            "@type": "Answer" as const,
            text: faq.answer,
        },
    }));
}
