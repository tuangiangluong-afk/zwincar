/**
 * ZwinCar.com — Matrice d'Intentions pSEO & Contenu "Info Gain" Authentique
 * Spécifiquement conçu pour contrer les Doorway Pages et répondre aux intentions réelles
 * relevées sur Reddit (r/Morocco), forums de voyage et PAA Google.
 */

export interface PurchaseIntent {
    id: string; // Ex: "sans-caution"
    slugs: {
        fr: string;
        en: string;
        es: string;
        nl: string;
    };
    titles: {
        fr: string;
        en: string;
        es: string;
        nl: string;
    };
    metaDescriptions: {
        fr: string;
        en: string;
        es: string;
        nl: string;
    };
    badge: {
        fr: string;
        en: string;
        es: string;
        nl: string;
    };
    headline: {
        fr: string;
        en: string;
        es: string;
        nl: string;
    };
    intro: {
        fr: string;
        en: string;
        es: string;
        nl: string;
    };
    // Information Gain Spécifique & Technique (Anti-Doorway)
    analysisTitle: {
        fr: string;
        en: string;
        es: string;
        nl: string;
    };
    analysisPoints: {
        title: { fr: string; en: string; es: string; nl: string };
        desc: { fr: string; en: string; es: string; nl: string };
    }[];
    practicalAdvice: {
        fr: string;
        en: string;
        es: string;
        nl: string;
    };
    faqs: {
        q: { fr: string; en: string; es: string; nl: string };
        a: { fr: string; en: string; es: string; nl: string };
    }[];
    // Type de filtre pour Client Component (serializable)
    filterType: "all" | "automatic" | "suv" | "7seats";
}

export const PURCHASE_INTENTS: PurchaseIntent[] = [
    {
        id: "sans-caution",
        slugs: {
            fr: "sans-caution",
            en: "no-deposit",
            es: "sin-fianza",
            nl: "zonder-borg",
        },
        titles: {
            fr: "Location Voiture {hub} Sans Caution CB | ZwinCar",
            en: "Car Rental {hub} No Credit Card Deposit | ZwinCar",
            es: "Alquiler Coche {hub} Sin Fianza Tarjeta | ZwinCar",
            nl: "Autoverhuur {hub} Zonder Creditcard Borg | ZwinCar",
        },
        metaDescriptions: {
            fr: "Louez une voiture à {hub} sans bloquer 1 500 € sur votre carte. Cartes de débit (Revolut, N26, Visa) et espèces acceptées. Restitution sans stress.",
            en: "Rent a car in {hub} without a €1,500 credit card block. Debit cards (Revolut, Monzo, Wise, Visa) & cash accepted. Fast airport delivery.",
            es: "Alquile un coche en {hub} sin bloqueo de 1.500 € en tarjeta de crédito. Tarjetas de débito y efectivo aceptados. Entrega rápida en aeropuerto.",
            nl: "Huur een auto in {hub} zonder €1.500 creditcard blokkade. Betaalpassen (Revolut, N26, Visa Debit) en contant geaccepteerd. Vlotte levering.",
        },
        badge: {
            fr: "Zéro Empreinte Bancaire Abusive",
            en: "Zero Credit Card Block",
            es: "Sin Bloqueo de Tarjeta",
            nl: "Geen Creditcard Blokkade",
        },
        headline: {
            fr: "Louez à {hub} sans risquer 1 500 € bloqués au comptoir",
            en: "Rent in {hub} without a €1,500 deposit hold",
            es: "Alquile en {hub} sin bloqueo de 1.500 €",
            nl: "Huur in {hub} zonder €1.500 borg blokkade",
        },
        intro: {
            fr: "Le piège n°1 à l'arrivée au Maroc : les courtiers low-cost imposent une carte de CRÉDIT physique et bloquent 1 500 € à 2 500 € sur votre plafond de vacances. ZwinCar casse cette pratique avec des agences locales vérifiées : formule 0 € caution ou dépôt modéré de 300 € en cash/débit rendu en main propre.",
            en: "The #1 tourist trap in Morocco: airport car hire desks require a physical CREDIT card and freeze €1,500 to €2,500 on your travel budget. ZwinCar changes the game with vetted local partners: choose between Zero Deposit or a light €300 cash/debit deposit returned immediately on return.",
            es: "La trampa nº 1 al llegar a Marruecos: las agencias tradicionales exigen tarjeta de CRÉDITO y bloquean de 1.500 € a 2.500 € en su cuenta. ZwinCar ofrece agencias locales verificadas: opción Cero Fianza o depósito flexible de 300 € en efectivo/débito devuelto al instante.",
            nl: "De grootste valkuil in Marokko: autoverhuurders op de luchthaven eisen een fysieke CREDITCARD en blokkeren €1.500 tot €2.500. ZwinCar biedt geverifieerde lokale partners: kies voor 0 € borg of een lichte borg van €300 in contanten/betaalpas, direct terugbetaald.",
        },
        analysisTitle: {
            fr: "Pourquoi l'aéroport refuse votre carte de débit au Maroc ?",
            en: "Why airport desks reject European debit cards in Morocco",
            es: "¿Por qué el aeropuerto rechaza su tarjeta de débito en Marruecos?",
            nl: "Waarom weigeren traditionele verhuurders uw debetkaart in Marokko?",
        },
        analysisPoints: [
            {
                title: {
                    fr: "Le traquenard du mot 'DÉBIT' sur la carte",
                    en: "The 'DEBIT' label trap at the counter",
                    es: "La trampa de la palabra 'DÉBITO' en su tarjeta",
                    nl: "De 'DEBIT' kaart valkuil aan de balie",
                },
                desc: {
                    fr: "85% des cartes françaises (Revolut, BoursoBank, N26, Visa Classic) portent la mention DÉBIT. Les terminaux des grands loueurs bloquent volontairement l'empreinte pour vous forcer à payer 25 € à 40 €/jour d'assurance locale non remboursable.",
                    en: "Most European cards (Revolut, Monzo, Wise, Chase, N26) are debit cards. Airport desks refuse pre-authorizations on them, forcing you to buy their mandatory daily waiver at €25-€40/day.",
                    es: "La mayoría de tarjetas europeas son de débito. Las compañías de alquiler rechazan la preautorización para obligarle a contratar su seguro propio por 25 € a 40 € diarios.",
                    nl: "De meeste Europese bankpassen zijn debetkaarten. Verhuurders weigeren pre-autorisaties om u te dwingen een dure lokale verzekering van €25-€40 per dag af te sluiten.",
                },
            },
            {
                title: {
                    fr: "Restitution en espèces : inspection vidéo en 5 minutes",
                    en: "Cash deposit returned on the spot with video walkaround",
                    es: "Devolución en efectivo: inspección en video de 5 minutos",
                    nl: "Borg ter plekke contant terug na 5 minuten video-inspectie",
                },
                desc: {
                    fr: "Avec nos agences partenaires à {hub}, l'état des lieux d'entrée se fait par vidéo sur smartphone. Au retour, le dépôt de 300 € (ou 0 € si option Franchise Zéro) vous est remis immédiatement en main propre sans délai bancaire de 3 semaines.",
                    en: "With our local partners in {hub}, the check-in is recorded on smartphone video. On return, your €300 deposit (or €0 with Zero Excess option) is handed right back to you in cash or unblocked immediately.",
                    es: "Con nuestros socios locales en {hub}, la inspección se graba en vídeo. Al devolver el vehículo, su depósito de 300 € (o 0 € con Franquicia Cero) se entrega en mano inmediatamente.",
                    nl: "Bij onze lokale partners in {hub} wordt de beginstaat op video vastgelegd. Bij inlevering ontvangt u uw borg van €300 (of €0 bij Nul-Eigen-Risico) direct contant terug.",
                },
            },
            {
                title: {
                    fr: "Cartes bancaires testées et 100% acceptées",
                    en: "Tested and 100% accepted payment cards",
                    es: "Tarjetas bancarias probadas y 100% aceptadas",
                    nl: "Geteste en 100% geaccepteerde betaalkaarten",
                },
                desc: {
                    fr: "Revolut, N26, Wise, Fortuneo, BoursoBank, BNP, Société Générale, Visa, Mastercard, ainsi que les règlements en Dirhams (MAD) et Euros (€).",
                    en: "Revolut, Monzo, Wise, Chase, Barclays, N26, Visa, Mastercard, plus cash payments in Moroccan Dirhams (MAD) and Euros (€).",
                    es: "Revolut, N26, Wise, Santander, BBVA, CaixaBank, Visa, Mastercard y pagos en efectivo en Dirhams (MAD) y Euros (€).",
                    nl: "Revolut, N26, Wise, ING, Rabobank, ABN AMRO, Visa, Mastercard en contante betalingen in Dirham (MAD) en Euro (€).",
                },
            },
        ],
        practicalAdvice: {
            fr: "Conseil terrain : photographiez toujours les jantes, le bas de caisse et le niveau de carburant au départ sur le parking {hub}. Notre agent local signe le bon numérique avec vous en 5 minutes.",
            en: "Local tip: always take clear photos of the rims, lower bumper, and fuel gauge at pick-up at {hub} airport. Our local representative completes the digital form with you in 5 minutes.",
            es: "Consejo local: tome fotos claras de las llantas, bajos y nivel de gasolina al retirar en el aparcamiento de {hub}. Nuestro agente firma el contrato digital con usted en 5 minutos.",
            nl: "Lokale tip: maak altijd duidelijke foto's van de velgen, onderkant en brandstofstand bij het ophalen op de parkeerplaats in {hub}. Onze vertegenwoordiger regelt dit binnen 5 minuten met u.",
        },
        faqs: [
            {
                q: {
                    fr: "Puis-je louer à {hub} sans aucune carte bancaire de crédit ?",
                    en: "Can I rent a car in {hub} without a credit card?",
                    es: "¿Puedo alquilar un coche en {hub} sin tarjeta de crédito?",
                    nl: "Kan ik een auto huren in {hub} zonder creditcard?",
                },
                a: {
                    fr: "Oui, à 100%. Vous réservez en ligne avec un simple acompte Stripe (toutes cartes acceptées), et vous choisissez sur place entre la formule Franchise Zéro (0 € de caution) ou un dépôt modéré de 300 € en espèces ou carte de débit, rendu immédiatement au retour.",
                    en: "Yes, 100%. You book online with a small Stripe down-payment (any card accepted), and on-site you choose between Zero Excess (0 € deposit) or a light €300 deposit in cash or debit card, returned immediately on drop-off.",
                    es: "Sí, 100%. Reserva online con un anticipo por Stripe y elige en destino entre Franquicia Cero (0 € de fianza) o un depósito de 300 € en efectivo o débito, reembolsado de inmediato.",
                    nl: "Ja, 100%. U reserveert online met een kleine aanbetaling via Stripe en kiest ter plekke tussen Nul Eigen Risico (0 € borg) of een borg van €300 contant of per pin, direct geretourneerd bij inlevering.",
                },
            },
            {
                q: {
                    fr: "Comment est restituée la caution en cas de dépôt espèces ?",
                    en: "How is the cash security deposit refunded?",
                    es: "¿Cómo se devuelve la fianza si pago en efectivo?",
                    nl: "Hoe wordt de contante borg terugbetaald?",
                },
                a: {
                    fr: "En main propre, immédiatement à l'aéroport ou à votre hébergement dès que l'agent a vérifié le niveau d'essence (same-to-same) et fait le tour rapide du véhicule avec vous. Zéro délai de virement bancaire.",
                    en: "Directly in cash, on the spot at the airport or your accommodation as soon as the agent checks the fuel level (same-to-same) and does a quick 2-minute visual check. No 3-week bank delays.",
                    es: "En mano, inmediatamente en el aeropuerto o su hotel tras revisar el nivel de gasolina y el estado del vehículo en 2 minutos. Sin esperas bancarias.",
                    nl: "Direct contant in uw hand, ter plekke op de luchthaven of bij uw riad nadat het brandstofniveau is gecontroleerd en een snelle controle is uitgevoerd.",
                },
            },
        ],
        filterType: "all",
    },
    {
        id: "boite-automatique",
        slugs: {
            fr: "boite-automatique",
            en: "automatic",
            es: "cambio-automatico",
            nl: "automaat",
        },
        titles: {
            fr: "Location Voiture Automatique {hub} | ZwinCar",
            en: "Automatic Car Rental {hub} | ZwinCar",
            es: "Alquiler Coche Automático {hub} | ZwinCar",
            nl: "Autoverhuur Automaat {hub} | ZwinCar",
        },
        metaDescriptions: {
            fr: "Louez une voiture à boîte automatique garantie à {hub} (Clio 5 BVA, Tucson BVA). Conduite fluide dans les ronds-points et cols de montagne sans caler.",
            en: "Rent a guaranteed automatic car in {hub} (Clio 5 Auto, Tucson Auto). Effortless driving through Moroccan traffic, roundabouts, and mountain switchbacks.",
            es: "Alquile un coche automático garantizado en {hub} (Clio 5 BVA, Tucson BVA). Conducción relajada en rotondas y puertos de montaña sin calarse.",
            nl: "Huur een gegarandeerde automaat in {hub} (Clio 5 Automaat, Tucson Automaat). Zorgeloos rijden in druk stadsverkeer en over bergpassen.",
        },
        badge: {
            fr: "Transmission Automatique Garantie",
            en: "Guaranteed Automatic Gearbox",
            es: "Cambio Automático Garantizado",
            nl: "Gegarandeerde Automaat",
        },
        headline: {
            fr: "Voiture automatique à {hub} : zéro calage garanti",
            en: "Automatic Car Rental in {hub}: Stress-Free Drive",
            es: "Coche automático en {hub}: conducción sin calarse",
            nl: "Automaat huren in {hub}: zorgeloos rijden",
        },
        intro: {
            fr: "Au Maroc, 90% des parcs de location low-cost sont en boîte manuelle. Si vous réservez une automatique sur un comparateur international, vous risquez la mention 'ou similaire' et une vieille manuelle au comptoir. Sur ZwinCar, la transmission automatique est contractuellement garantie sur le modèle choisi.",
            en: "In Morocco, 90% of budget rental fleets are manual gearboxes. When booking an automatic on big broker sites, fine print often says 'or similar'—landing you with a manual car at 11 PM. On ZwinCar, your automatic transmission is strictly guaranteed on the booked car.",
            es: "En Marruecos, el 90% de las flotas de alquiler son manuales. Con los intermediarios corre el riesgo del 'o similar'. En ZwinCar garantizamos por contrato la transmisión automática en el vehículo elegido.",
            nl: "In Marokko heeft 90% van de huurauto's een handgeschakelde versnellingsbak. Bij grote brokers krijgt u vaak 'of vergelijkbaar'. Bij ZwinCar is de automatische transmissie contractueel gegarandeerd.",
        },
        analysisTitle: {
            fr: "Pourquoi la boîte automatique change tout pour rouler au Maroc ?",
            en: "Why is an automatic transmission essential for driving in Morocco?",
            es: "¿Por qué un coche automático marca la diferencia en Marruecos?",
            nl: "Waarom maakt een automaat een enorm verschil in Marokko?",
        },
        analysisPoints: [
            {
                title: {
                    fr: "La gestion des carrefours et ronds-points marocains",
                    en: "Handling busy Moroccan roundabouts and city flow",
                    es: "El tráfico denso y las rotondas marroquíes",
                    nl: "Drukke rotondes en stadsverkeer zonder stress",
                },
                desc: {
                    fr: "Dans les centres urbains comme {hub}, la circulation dense (deux-roues, calèches, piétons) exige une attention constante. La boîte automatique libère votre pied gauche et supprime tout risque de caler au milieu d'un carrefour giratoire.",
                    en: "In lively city hubs like {hub}, mixed traffic (scooters, pedestrians, taxis) demands quick reactions. An automatic gearbox keeps you focused on the road with zero risk of stalling in a busy roundabout.",
                    es: "En ciudades activas como {hub}, el tráfico intenso requiere atención continua. El cambio automático le permite concentrarse en la vía sin preocuparse por el embrague.",
                    nl: "In levendige steden zoals {hub} vereist het verkeer (brommers, voetgangers, taxi's) uw volle aandacht. Een automaat zorgt voor rust en voorkomt afslaan.",
                },
            },
            {
                title: {
                    fr: "Cols de montagne et pentes de l'Atlas",
                    en: "Atlas Mountain switchbacks and steep inclines",
                    es: "Puertos de montaña y subidas del Atlas",
                    nl: "Bergpassen in de Atlas en steile hellingen",
                },
                desc: {
                    fr: "Que vous montiez le col du Tichka ou la vallée de l'Ourika, la gestion automatique des rapports évite de faire surchauffer l'embrayage dans les virages en épingle à cheveux et redémarrages en côte.",
                    en: "Whether crossing the Tizi n'Tichka pass or climbing through the Ourika valley, the automatic transmission prevents clutch burn and makes hill starts effortless.",
                    es: "Al cruzar el puerto de Tichka o valles del Atlas, la transmisión automática evita quemar el embrague en curvas cerradas y arranques en pendiente.",
                    nl: "Of u nu de Tizi n'Tichka pas oversteekt of door de bergen rijdt: een automaat voorkomt oververhitting van de koppeling bij steile hellingen.",
                },
            },
        ],
        practicalAdvice: {
            fr: "Nos modèles automatiques populaires à {hub} : Renault Clio 5 BVA (idéale pour la ville et les escapades côtières) et Hyundai Tucson BVA Luxe (SUV surélevé parfait pour les longs roadtrips).",
            en: "Our top automatic models in {hub}: Renault Clio 5 Automatic (compact for city and coastal trips) and Hyundai Tucson Auto (elevated SUV for long scenic roadtrips).",
            es: "Nuestros modelos automáticos más populares en {hub}: Renault Clio 5 Automático y Hyundai Tucson BVA Luxe.",
            nl: "Onze populairste automaten in {hub}: Renault Clio 5 Automaat (ideaal voor de stad) en Hyundai Tucson Automaat (hoge SUV voor lange rondreizen).",
        },
        faqs: [
            {
                q: {
                    fr: "Suis-je certain d'avoir une boîte automatique et non une manuelle ?",
                    en: "Is the automatic gearbox 100% guaranteed?",
                    es: "¿Está garantizada la caja automática al 100%?",
                    nl: "Is de automatische versnellingsbak 100% gegarandeerd?",
                },
                a: {
                    fr: "Oui. Chez ZwinCar, la politique 'Modèle Exact Garanti' s'applique. Si vous réservez une Clio 5 BVA ou un Tucson BVA, vous recevez exactement ce véhicule en boîte automatique, jamais une manuelle de substitution.",
                    en: "Yes. Under ZwinCar's 'Exact Model Guarantee', when you book an automatic vehicle, you get that exact car with automatic transmission, never a manual downgrade.",
                    es: "Sí. Gracias a nuestra garantía de modelo exacto, recibirá exactamente el vehículo automático reservado, nunca un manual de sustitución.",
                    nl: "Ja. Dankzij onze 'Exact Model Garantie' ontvangt u exact de gereserveerde automaat, nooit een handgeschakeld vervangend model.",
                },
            },
        ],
        filterType: "automatic",
    },
    {
        id: "suv-4x4",
        slugs: {
            fr: "suv-4x4",
            en: "suv-4x4",
            es: "suv-4x4",
            nl: "suv-4x4",
        },
        titles: {
            fr: "Location SUV & 4x4 {hub} Pistes Atlas | ZwinCar",
            en: "SUV & 4x4 Rental {hub} Atlas Trails | ZwinCar",
            es: "Alquiler SUV y 4x4 {hub} Pistas Atlas | ZwinCar",
            nl: "SUV & 4x4 Huren {hub} Atlas Pistes | ZwinCar",
        },
        metaDescriptions: {
            fr: "Louez un SUV ou 4x4 à {hub} (Dacia Duster 4x4, Hyundai Tucson). Garde au sol 21 cm, pistes carrossables et désert d'Agafay autorisés sans surcoût.",
            en: "Rent an SUV or 4x4 in {hub} (Dacia Duster 4x4, Hyundai Tucson). 21 cm ground clearance, unpaved gravel tracks and Agafay desert officially permitted.",
            es: "Alquile un SUV o 4x4 en {hub} (Dacia Duster 4x4, Hyundai Tucson). 21 cm de altura libre, pistas de tierra y desierto de Agafay autorizados.",
            nl: "Huur een SUV of 4x4 in {hub} (Dacia Duster 4x4, Hyundai Tucson). 21 cm bodemvrijheid, onverharde pistes en Agafay woestijn officieel toegestaan.",
        },
        badge: {
            fr: "Pistes Carrossables Autorisées",
            en: "Unpaved Tracks Authorized",
            es: "Pistas de Tierra Autorizadas",
            nl: "Onverharde Pistes Toegestaan",
        },
        headline: {
            fr: "Location SUV & 4x4 à {hub} : pistes autorisées",
            en: "SUV & 4x4 Rental in {hub}: 21 cm clearance",
            es: "Alquiler SUV y 4x4 en {hub}: pistas autorizadas",
            nl: "SUV & 4x4 huren in {hub}: toegestane pistes",
        },
        intro: {
            fr: "Les plus beaux spots du Maroc (bivouacs d'Agafay, kasbahs de l'Atlas, plages secrètes du Sud) nécessitent d'emprunter des pistes de graviers. Les loueurs low-cost interdisent formellement les routes non goudronnées dans leurs CGV pour confisquer les cautions. Sur ZwinCar, nos SUV Duster 4x4 et Tucson intègrent l'autorisation officielle des pistes carrossables.",
            en: "Morocco's most magical destinations (Agafay luxury camps, Atlas kasbahs, remote surf spots) require driving on gravel tracks. Traditional rental companies secretly ban unpaved roads to seize customer deposits. At ZwinCar, our Duster 4x4 and Tucson SUVs explicitly authorize unpaved accessible trails.",
            es: "Los rincones más bellos de Marruecos (campamentos de Agafay, kasbahs, calas del sur) requieren transitar por pistas de tierra. Las agencias low-cost prohíben las pistas para retener fianzas. En ZwinCar autorizamos oficialmente las pistas transitables.",
            nl: "De mooiste plekken in Marokko (Agafay woestijnkampen, Atlas kasba's, rustige stranden) liggen aan grindwegen. Veel verhuurders verbieden onverharde wegen stiekem. Bij ZwinCar zijn toegankelijke pistes officieel toegestaan.",
        },
        analysisTitle: {
            fr: "Pourquoi le Duster 4x4 est le roi du roadtrip au Maroc ?",
            en: "Why the Dacia Duster 4x4 is king of Moroccan road trips",
            es: "¿Por qué el Duster 4x4 es el rey del roadtrip en Marruecos?",
            nl: "Waarom is de Dacia Duster 4x4 de koning van de Marokkaanse roadtrip?",
        },
        analysisPoints: [
            {
                title: {
                    fr: "Garde au sol de 210 mm : zéro choc sous le châssis",
                    en: "210 mm ground clearance: zero underbody damage",
                    es: "210 mm de altura libre: sin golpes en los bajos",
                    nl: "210 mm bodemvrijheid: geen schade aan de onderkant",
                },
                desc: {
                    fr: "Une berline classique touche sur les nids-de-poule et cailloux saillants. Avec 21 cm sous caisse et sabots de protection, le Duster passe partout sans angoisse de fissurer le carter d'huile.",
                    en: "Standard hatchbacks risk scraping bottom on potholes or rocks. With 21 cm ground clearance and protective skid plates, the Duster rolls over rough gravel with total peace of mind.",
                    es: "Los turismos bajos tocan fácilmente con piedras. Con 21 cm de altura libre y protecciones inferiores, el Duster supera cualquier bache con tranquilidad.",
                    nl: "Gewone sedans lopen snel schade op door steenslag of kuilen. Met 21 cm bodemvrijheid rijdt u met een gerust hart over onverharde wegen.",
                },
            },
            {
                title: {
                    fr: "Consommation diesel économique : 5,2 L / 100 km",
                    en: "Fuel-efficient diesel engine: ~5.2 L / 100 km",
                    es: "Motor diésel muy económico: 5,2 L / 100 km",
                    nl: "Zuinige dieselmotor: ca. 5,2 L / 100 km",
                },
                desc: {
                    fr: "Contrairement aux gros 4x4 énergivores (type Toyota Prado ou Land Cruiser), le Duster offre une autonomie de plus de 900 km par plein de gasoil pour traverser le Sud sans stress de station-service.",
                    en: "Unlike thirsty full-size 4x4s, the Duster's diesel engine delivers over 900 km on a single tank—vital when driving through vast remote desert stretches.",
                    es: "A diferencia de los grandes 4x4 pesados, el motor diésel del Duster rinde más de 900 km por depósito, ideal para grandes distancias en el sur.",
                    nl: "In tegenstelling tot zware dorstige 4x4's rijdt de Duster ruim 900 km op één tank diesel—ideaal voor lange trajecten door het zuiden.",
                },
            },
        ],
        practicalAdvice: {
            fr: "Pression des pneus recommandée : 2,1 bars sur autoroute, 1,8 bar sur piste caillouteuse pour adoucir le confort. Pensez à vérifier la roue de secours présente dans le coffre.",
            en: "Tire pressure tip: 2.1 bar for highway cruising, 1.8 bar on rocky tracks for optimal comfort. A full-size spare tire is checked and supplied in the trunk.",
            es: "Consejo de neumáticos: 2,1 bar en autopista y 1,8 bar en pista de tierra para mayor confort. Rueda de repuesto completa verificada en el maletero.",
            nl: "Bandenspanningstip: 2,1 bar op de snelweg, 1,8 bar op steenachtige pistes voor maximaal comfort. Een volwaardig reservewiel is aanwezig in de kofferbak.",
        },
        faqs: [
            {
                q: {
                    fr: "Puis-je rouler dans les dunes de Merzouga avec le Duster ?",
                    en: "Can I drive directly into sand dunes with the Duster?",
                    es: "¿Puedo conducir directamente en las dunas con el Duster?",
                    nl: "Mag ik direct door de zandduinen rijden met de Duster?",
                },
                a: {
                    fr: "Les pistes de sable tassé menant aux auberges et bivouacs sont 100% autorisées. En revanche, le franchissement libre de dunes vives (dune bashing) nécessite un équipement de désensablement lourd et un guide local pour éviter tout enlisement.",
                    en: "Packed sand tracks leading to luxury camps and desert hotels are 100% permitted. Pure off-road dune climbing ('dune bashing') is restricted, as it requires specialized recovery gear and a local guide.",
                    es: "Las pistas de arena firme que conducen a los campamentos y hoteles están 100% autorizadas. Subir dunas vírgenes requiere guía local y equipo de rescate especializado.",
                    nl: "Vaste zandpistes naar woestijnkampen en hotels zijn 100% toegestaan. Vrij duinrijden (dune bashing) vereist gespecialiseerd materiaal en een lokale gids.",
                },
            },
        ],
        filterType: "suv",
    },
    {
        id: "7-places",
        slugs: {
            fr: "7-places",
            en: "7-seater",
            es: "7-plazas",
            nl: "7-persoons",
        },
        titles: {
            fr: "Location Voiture 7 Places {hub} | ZwinCar",
            en: "7-Seater Car Rental {hub} Family | ZwinCar",
            es: "Alquiler Coche 7 Plazas {hub} | ZwinCar",
            nl: "7-Persoons Auto Huren {hub} | ZwinCar",
        },
        metaDescriptions: {
            fr: "Louez un véhicule 7 places spacieux à {hub} (Dacia Jogger 7). Évitez l'interdiction des petits taxis à 3 passagers. Sièges enfants ISOFIX disponibles.",
            en: "Rent a spacious 7-seater car in {hub} (Dacia Jogger 7). Overcome the 3-passenger taxi limit in Morocco. European ISOFIX child seats available.",
            es: "Alquile un monovolumen de 7 plazas en {hub} (Dacia Jogger 7). Evite el límite de 3 pasajeros en los taxis marroquíes. Sillas de niño ISOFIX.",
            nl: "Huur een ruime 7-persoons auto in {hub} (Dacia Jogger 7). Omzeil de 3-personen taxilimiet in Marokko. ISOFIX kinderzitjes beschikbaar.",
        },
        badge: {
            fr: "Spacieux Famille & Groupe",
            en: "Spacious Family & Group",
            es: "Espacioso Familias y Grupos",
            nl: "Ruim voor Families & Groepen",
        },
        headline: {
            fr: "Location 7 places à {hub} : voyagez en famille",
            en: "7-Seater Rental in {hub}: Family Travel",
            es: "Alquiler 7 plazas en {hub}: viaje en familia",
            nl: "7-persoons auto huren in {hub}: voor families",
        },
        intro: {
            fr: "Au Maroc, la législation sur les 'Petits Taxis' est inflexible : ils ont l'interdiction absolue de transporter plus de 3 passagers. Pour une famille de 4 ou 5 personnes, chaque déplacement nécessite deux taxis distincts ! Louer un Dacia Jogger 7 places vous permet de voyager réunis, d'installer vos sièges bébé ISOFIX et de diviser vos coûts de transport par deux.",
            en: "In Morocco, local law strictly forbids city taxis ('Petits Taxis') from carrying more than 3 passengers. A family of 4 or 5 is forced to hail two separate cabs for every outing! Renting a 7-seater Dacia Jogger keeps the whole family together with ISOFIX car seats and cuts local transport bills in half.",
            es: "En Marruecos la ley prohíbe a los taxis urbanos llevar más de 3 pasajeros. Una familia de 4 o 5 personas se ve obligada a tomar dos taxis cada vez. Alquilar un 7 plazas permite viajar juntos y ahorrar considerablemente.",
            nl: "In Marokko verbiedt de wet stadstaxi's om meer dan 3 passagiers te vervoeren. Een gezin van 4 of 5 moet telkens twee taxi's nemen! Een 7-persoons Dacia Jogger houdt het hele gezin gezellig bij elkaar.",
        },
        analysisTitle: {
            fr: "Configuration bagages & modularité pour votre séjour en famille",
            en: "Luggage space & modular seating for family road trips",
            es: "Espacio de equipaje y modularidad para viajes familiares",
            nl: "Bagageruimte en flexibele zitplaatsen voor gezinnen",
        },
        analysisPoints: [
            {
                title: {
                    fr: "Configuration 7 sièges vs 5 sièges modulable",
                    en: "7-seat mode vs 5-seat huge trunk mode",
                    es: "Modo 7 plazas vs modo 5 plazas con gran maletero",
                    nl: "7-zits configuratie versus 5-zits met enorme kofferbak",
                },
                desc: {
                    fr: "En configuration 5 places, le coffre offre plus de 700 litres (jusqu'à 4 grandes valises + poussette). En configuration 7 places, les deux sièges d'appoint arrière accueillent confortablement deux adolescents ou adultes de gabarit moyen.",
                    en: "In 5-seat mode, the trunk expands to over 700 liters (fitting 4 large suitcases + stroller). In 7-seat mode, the third row comfortably accommodates two teenagers or medium-build adults.",
                    es: "En modo 5 plazas el maletero supera los 700 litros (4 maletas grandes + carrito). En modo 7 plazas, la tercera fila acomoda perfectamente a dos adultos o niños.",
                    nl: "In 5-persoons opstelling biedt de kofferbak ruim 700 liter (4 grote koffers + kinderwagen). In 7-persoons opstelling biedt de achterste rij comfortabel plek aan twee passagiers.",
                },
            },
            {
                title: {
                    fr: "Sièges enfants et bébés homologués ISOFIX",
                    en: "Certified ISOFIX child and infant seats",
                    es: "Sillas de bebé y niño homologadas ISOFIX",
                    nl: "Gecertificeerde ISOFIX kinder- en babyzitjes",
                },
                desc: {
                    fr: "Inutile d'encombrer l'avion avec vos sièges auto. Nous installons avant votre arrivée à {hub} des sièges homologués norme européenne ECE R129 propres et vérifiés.",
                    en: "No need to haul bulky child seats through airport terminals. We pre-install clean, European ECE R129-certified car seats before your arrival in {hub}.",
                    es: "Evite cargar sillas de coche en el avión. Instalamos previamente en {hub} sillas homologadas con normativa europea ECE R129, limpias y revisadas.",
                    nl: "U hoeft geen zware autostoeltjes mee te sjouwen in het vliegtuig. Wij installeren schone, ECE R129 goedgekeurde stoeltjes vooraf in {hub}.",
                },
            },
        ],
        practicalAdvice: {
            fr: "Pour les transferts aéroport avec 7 passagers et 7 grandes valises, demandez notre option barres de toit ou réservez un transfert bagages dédié le premier jour jusqu'au Riad.",
            en: "For airport arrival with 7 passengers plus 7 large bags, request our roof-rack option or a small dedicated luggage transfer for check-in day at your riad.",
            es: "Para llegadas de 7 pasajeros con 7 maletas grandes, consulte nuestra opción de barras de techo o un traslado de maletas directo al Riad el primer día.",
            nl: "Reist u met 7 personen én 7 grote koffers vanaf de luchthaven? Vraag naar dakdragers of laat koffers rechtstreeks naar uw verblijf brengen.",
        },
        faqs: [
            {
                q: {
                    fr: "Faut-il un permis spécial pour conduire un 7 places au Maroc ?",
                    en: "Do I need a special driver's license for a 7-seater in Morocco?",
                    es: "¿Se necesita un permiso especial para conducir un 7 plazas en Marruecos?",
                    nl: "Heb ik een speciaal rijbewijs nodig voor een 7-persoons auto in Marokko?",
                },
                a: {
                    fr: "Non, un permis B standard (permis de conduire français, européen ou international) délivré depuis plus de 2 ans est amplement suffisant jusqu'à 9 places assises.",
                    en: "No, a standard category B driver's license (European, UK, US, or international) held for at least 2 years is valid for all passenger vehicles up to 9 seats.",
                    es: "No, el permiso de conducir estándar B (europeo o internacional) con más de 2 años de antigüedad es suficiente para vehículos de hasta 9 plazas.",
                    nl: "Nee, een standaard B-rijbewijs (Europees of internationaal) dat minimaal 2 jaar in bezit is, is geldig voor voertuigen tot 9 personen.",
                },
            },
        ],
        filterType: "7seats",
    },
    {
        id: "livraison-riad",
        slugs: {
            fr: "livraison-riad",
            en: "riad-delivery",
            es: "entrega-riad",
            nl: "riad-bezorging",
        },
        titles: {
            fr: "Location Voiture {hub} Livraison Riad | ZwinCar",
            en: "Car Rental {hub} Riad Delivery | ZwinCar",
            es: "Alquiler Coche {hub} Entrega en Riad | ZwinCar",
            nl: "Autoverhuur {hub} Riad Bezorging | ZwinCar",
        },
        metaDescriptions: {
            fr: "Faites-vous livrer votre voiture devant la porte de votre Riad ou hôtel à {hub}. Évitez le retour à l'aéroport et garez-vous dans les parkings gardés.",
            en: "Get your car delivered directly to your Riad entrance or hotel in {hub}. Skip the trip back to the airport and learn where to park securely in the Medina.",
            es: "Reciba su coche en la puerta de su Riad u hotel en {hub}. Evite desplazarse al aeropuerto y aparque con seguridad junto a la Medina.",
            nl: "Laat uw huurauto direct bezorgen bij uw riad of hotel in {hub}. Bespaar een rit naar de luchthaven en parkeer veilig nabij de medina.",
        },
        badge: {
            fr: "Remise des Clés au Riad",
            en: "Riad & Hotel Handover",
            es: "Entrega Directa en Riad",
            nl: "Sleuteloverdracht bij Riad",
        },
        headline: {
            fr: "Livraison de votre voiture au Riad à {hub}",
            en: "Car Delivery directly to your Riad in {hub}",
            es: "Entrega directa de coche en su Riad en {hub}",
            nl: "Bezorging van uw huurauto bij uw Riad in {hub}",
        },
        intro: {
            fr: "Beaucoup de voyageurs passent leurs 2 premiers jours à pied dans la médina de {hub} avant de partir explorer l'Atlas ou la côte. Plutôt que de payer un taxi pour retourner à l'aéroport louer une voiture, notre agent local vous livre le véhicule propre au point carrossable le plus proche de votre riad ou à la réception de votre hôtel.",
            en: "Many travelers spend their first 2 days exploring the pedestrian medina of {hub} on foot before hitting the road. Instead of paying for a taxi back to the airport to pick up a car, our local agent delivers your vehicle right to the nearest accessible gate of your riad or hotel lobby.",
            es: "Muchos viajeros disfrutan los primeros días a pie por la medina de {hub}. En lugar de tomar un taxi al aeropuerto, nuestro agente le entrega el coche en la puerta más cercana a su riad o en la recepción de su hotel.",
            nl: "Veel reizigers verkennen eerst de autovrije medina van {hub} te voet. In plaats van een taxi terug naar het vliegveld te nemen, bezorgt onze lokale agent de auto bij de dichtstbijzijnde toegangspoort van uw riad.",
        },
        analysisTitle: {
            fr: "Comment gérer le stationnement et la livraison en Médina ?",
            en: "How to handle Medina delivery and secure overnight parking",
            es: "Cómo gestionar el aparcamiento y la entrega en la Medina",
            nl: "Hoe werkt de bezorging en veilig parkeren bij de medina?",
        },
        analysisPoints: [
            {
                title: {
                    fr: "Point de rendez-vous aux portes historiques (Bab)",
                    en: "Handover at historic city gates ('Bab')",
                    es: "Punto de encuentro en las puertas históricas ('Bab')",
                    nl: "Ontmoetingspunt bij historische stadspoorten ('Bab')",
                },
                desc: {
                    fr: "Les ruelles de médina étant piétonnes, notre agent convient avec vous par WhatsApp de la porte la plus proche (ex: Bab Doukkala, Riad Laarous, Bab Taghzout). Vous signez le contrat sur place en 5 minutes.",
                    en: "Since medina alleyways are strictly pedestrian, our agent coordinates via WhatsApp at the closest accessible gate (e.g. Bab Doukkala, Place Riad Laarous). Digital contract signed in 5 minutes.",
                    es: "Al ser peatonales las callejuelas de la medina, coordinamos por WhatsApp en la puerta accesible más cercana (ej. Bab Doukkala). Contrato firmado en 5 minutos.",
                    nl: "Omdat de medina autovrij is, spreken we via WhatsApp af bij de dichtstbijzijnde stadspoort (bijv. Bab Doukkala). Digitaal contract binnen 5 minuten getekend.",
                },
            },
            {
                title: {
                    fr: "Parkings gardés de nuit officiels (20 à 30 MAD/nuit)",
                    en: "Official guarded overnight parking (20 to 30 MAD/night)",
                    es: "Aparcamientos vigilados oficiales (20 a 30 MAD/noche)",
                    nl: "Officiële bewaakte nachtparkings (20 tot 30 MAD/nacht)",
                },
                desc: {
                    fr: "Chaque porte de médina dispose d'un parking gardé 24h/24 avec gardien officiel en gilet. Le tarif habituel est de 20 à 30 dirhams (~2-3 €) par nuit. Conservez toujours vos clés avec vous.",
                    en: "Every city gate has a 24/7 guarded parking lot managed by an official parking attendant. Standard fee is 20 to 30 MAD (~€2-€3) per night. Always keep your car keys with you.",
                    es: "Cada puerta de la medina cuenta con aparcamiento vigilado 24h. La tarifa oficial es de 20 a 30 dirhams (~2-3 €) por noche. Guarde siempre las llaves consigo.",
                    nl: "Elke stadspoort beschikt over een 24/7 bewaakte parkeerplaats met officiële parkeerwacht. Het tarief is ca. 20 tot 30 dirham (~€2-€3) per nacht. Neem altijd uw autosleutels zelf mee.",
                },
            },
        ],
        practicalAdvice: {
            fr: "Indiquez simplement le nom et l'adresse de votre Riad lors de la réservation en ligne. Notre conciergerie WhatsApp vous contacte 24h avant pour caler l'horaire précis de livraison.",
            en: "Simply enter your Riad name and address when booking online. Our WhatsApp concierge will reach out 24 hours prior to confirm the exact delivery hour and meeting spot.",
            es: "Indique el nombre y dirección de su Riad al reservar. Nuestro equipo de WhatsApp le contactará 24 horas antes para confirmar la hora exacta y el punto de encuentro.",
            nl: "Vul eenvoudig de naam en het adres van uw riad in bij de boeking. Onze WhatsApp conciërge neemt 24 uur van tevoren contact op om het exacte bezorgtijdstip af te stemmen.",
        },
        faqs: [
            {
                q: {
                    fr: "La livraison au Riad ou à l'hôtel entraîne-t-elle des frais cachés ?",
                    en: "Is there an extra fee for riad or hotel delivery?",
                    es: "¿Tiene coste adicional la entrega en el Riad o el hotel?",
                    nl: "Zijn er extra kosten voor bezorging bij de riad of het hotel?",
                },
                a: {
                    fr: "Non, la livraison dans le périmètre urbain de {hub} est offerte ou proposée à tarif fixe transparent (affiché directement sur votre devis avant validation).",
                    en: "No, delivery within {hub} urban boundaries is either included or clearly displayed upfront with zero hidden charges at delivery.",
                    es: "No, la entrega dentro del perímetro urbano de {hub} está incluida o especificada de forma transparente antes de confirmar.",
                    nl: "Nee, bezorging binnen de stadsgrenzen van {hub} is inbegrepen of transparant vermeld zonder verrassingen achteraf.",
                },
            },
        ],
        filterType: "all",
    },
];

export function getPurchaseIntent(idOrSlug: string): PurchaseIntent | undefined {
    return PURCHASE_INTENTS.find(
        (intent) =>
            intent.id === idOrSlug ||
            intent.slugs.fr === idOrSlug ||
            intent.slugs.en === idOrSlug ||
            intent.slugs.es === idOrSlug ||
            intent.slugs.nl === idOrSlug
    );
}
