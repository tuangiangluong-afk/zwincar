import { Locale } from "./i18n";

export interface VsComparison {
    slug: string;
    competitorName: string;
    competitorType: {
        fr: string;
        en: string;
        es: string;
        nl: string;
    };
    titles: Record<Locale, string>;
    metaDescriptions: Record<Locale, string>;
    heroH1: Record<Locale, string>;
    heroSubtitle: Record<Locale, string>;
    verdictBadge: Record<Locale, string>;
    keyTakeaway: Record<Locale, string>;
    tableHeaders: {
        criteria: Record<Locale, string>;
        competitor: Record<Locale, string>;
        zwincar: Record<Locale, string>;
    };
    comparisonRows: {
        label: Record<Locale, string>;
        competitorValue: Record<Locale, string>;
        competitorStatus: "bad" | "warning";
        zwincarValue: Record<Locale, string>;
        zwincarHighlight?: boolean;
    }[];
    forensicSection: {
        title: Record<Locale, string>;
        paragraphs: Record<Locale, string[]>;
    };
    faqs: {
        q: Record<Locale, string>;
        a: Record<Locale, string>;
    }[];
}

export const VS_COMPETITORS: VsComparison[] = [
    {
        slug: "discovercars",
        competitorName: "DiscoverCars",
        competitorType: {
            fr: "Courtier en ligne international (Riga, Lettonie)",
            en: "International Online Broker (Riga, Latvia)",
            es: "Buscador y Broker Internacional (Riga, Letonia)",
            nl: "Internationale Online Broker (Riga, Letland)",
        },
        titles: {
            fr: "ZwinCar vs DiscoverCars au Maroc • Comparatif Caution & Carte Débit",
            en: "ZwinCar vs DiscoverCars Morocco • Deposit & Debit Card Comparison",
            es: "ZwinCar vs DiscoverCars en Marruecos • Comparativa Fianza y Tarjeta",
            nl: "ZwinCar vs DiscoverCars in Marokko • Vergelijking Borg & Betaalpas",
        },
        metaDescriptions: {
            fr: "Pourquoi DiscoverCars bloque 1 500 € à 2 400 € sur carte de crédit à l'aéroport au Maroc ? Comparez avec ZwinCar : 0 € caution, cartes de débit acceptées, modèle garanti.",
            en: "Why DiscoverCars forces a €1,500-€2,400 credit card block at Morocco airport desks? Compare with ZwinCar: €0 deposit waiver, debit cards accepted, guaranteed exact models.",
            es: "¿Por qué DiscoverCars bloquea 1.500 € a 2.400 € en tarjeta de crédito en Marruecos? Compare con ZwinCar: 0 € fianza, tarjetas de débito aceptadas, modelo garantizado.",
            nl: "Waarom blokkeert DiscoverCars €1.500 tot €2.400 op creditcard in Marokko? Vergelijk met ZwinCar: €0 borg, pinpassen geaccepteerd, gegarandeerd model.",
        },
        heroH1: {
            fr: "ZwinCar vs DiscoverCars au Maroc : Le Vrai Coût de la Caution à l'Aéroport",
            en: "ZwinCar vs DiscoverCars in Morocco: The Truth About Airport Deposits",
            es: "ZwinCar vs DiscoverCars en Marruecos: La Verdad sobre la Fianza en el Aeropuerto",
            nl: "ZwinCar vs DiscoverCars in Marokko: De Waarheid over de Borg op de Luchthaven",
        },
        heroSubtitle: {
            fr: "Autopsie de la « Couverture Complète » vendue en ligne, du refus systématique des cartes de débit au guichet marocain et des 1 500 € bloqués à l'atterrissage.",
            en: "Forensic breakdown of the online 'Full Coverage' trap, the rejection of debit cards at airport counters, and the €1,500+ security hold on arrival.",
            es: "Análisis del seguro 'Cobertura Total' online, el rechazo de tarjetas de débito en mostradores marroquíes y los 1.500 € bloqueados al aterrizar.",
            nl: "Grondige analyse van de 'Volledige Dekking' online, de weigering van pinpassen aan de balie en de borg van € 1.500+ bij aankomst.",
        },
        verdictBadge: {
            fr: "Verdict Médico-Légal 2026",
            en: "2026 Forensic Verdict",
            es: "Veredicto Forense 2026",
            nl: "Forensisch Oordeel 2026",
        },
        keyTakeaway: {
            fr: "DiscoverCars est un comparateur tiers sans flotte au Maroc. L'assurance achetée en ligne n'a aucune valeur juridique pour les loueurs du terminal (Green Motion, Surprice, Keddy) qui exigent une carte de CRÉDIT physique pour bloquer 1 500 € à 2 400 €. ZwinCar est une plateforme directe d'agences vérifiées : 0 € de caution avec Franchise Zéro, cartes de débit et espèces acceptés, remise des clés en 5 minutes sans guichet.",
            en: "DiscoverCars is an offshore broker with no vehicles in Morocco. The 'Full Coverage' bought online is not recognized by airport desk franchisers, who mandate an embossed CREDIT card to freeze €1,500–€2,400. ZwinCar connects directly with certified local partners: €0 deposit with Zero Excess, debit cards and cash accepted, key handover in 5 minutes outside the terminal.",
            es: "DiscoverCars es un intermediario sin flota en Marruecos. El seguro contratado online no exime de dejar entre 1.500 € y 2.400 € de fianza en tarjeta de CRÉDITO en el mostrador. ZwinCar ofrece reserva directa con agencias verificadas: 0 € fianza con Pack Sin Franquicia, tarjetas de débito y efectivo aceptados, entrega de llaves en 5 min sin colas.",
            nl: "DiscoverCars is een externe broker zonder eigen wagenpark in Marokko. De online verzekering wordt niet erkend door de balieverhuurders op de luchthaven, die een creditcard eisen voor een borg van € 1.500 tot € 2.400. ZwinCar biedt directe boeking: € 0 borg met Geen Eigen Risico, pinpas en contant geld geaccepteerd, sleuteloverdracht in 5 minuten.",
        },
        tableHeaders: {
            criteria: { fr: "Critère de Comparaison", en: "Comparison Factor", es: "Criterio de Comparación", nl: "Vergelijkingscriterium" },
            competitor: { fr: "DiscoverCars (Courtier tiers)", en: "DiscoverCars (Broker)", es: "DiscoverCars (Intermediario)", nl: "DiscoverCars (Tussenpersoon)" },
            zwincar: { fr: "ZwinCar (Direct Agences Locales)", en: "ZwinCar (Direct Local Fleet)", es: "ZwinCar (Flota Local Directa)", nl: "ZwinCar (Direct Lokale Vloot)" },
        },
        comparisonRows: [
            {
                label: { fr: "Montant de la caution retenue", en: "Security deposit amount held", es: "Importe de la fianza retenida", nl: "Ingehouden borgsom" },
                competitorValue: { fr: "1 500 € à 2 400 € bloqués", en: "€1,500 to €2,400 blocked", es: "1.500 € a 2.400 € retenidos", nl: "€ 1.500 tot € 2.400 geblokkeerd" },
                competitorStatus: "bad",
                zwincarValue: { fr: "0 € (Franchise Zéro) ou 300 € max", en: "€0 (Zero Excess) or €300 max", es: "0 € (Sin Franquicia) o 300 € máx.", nl: "€ 0 (Geen Eigen Risico) of max € 300" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Cartes bancaires acceptées", en: "Accepted payment cards", es: "Tarjetas bancarias aceptadas", nl: "Geaccepteerde bankpassen" },
                competitorValue: { fr: "Carte de CRÉDIT stricte (relief)", en: "Embossed CREDIT card only", es: "Solo tarjeta de CRÉDITO física", nl: "Alleen fysieke CREDITCARD" },
                competitorStatus: "bad",
                zwincarValue: { fr: "Cartes Débit (Visa/MC/Revolut) & Espèces", en: "Debit cards (Visa/MC/Revolut) & Cash", es: "Tarjetas Débito (Visa/MC/Revolut) y Efectivo", nl: "Pinpassen (Visa/MC/Revolut) & Contant" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Valeur de l'assurance achetée en ligne", en: "Online insurance recognition at desk", es: "Validez del seguro online en mostrador", nl: "Erkenning online verzekering aan de balie" },
                competitorValue: { fr: "Non reconnue au guichet (remboursement ultérieur)", en: "Not recognized at desk (reimbursement scheme)", es: "No exime de fianza (reembolso a posteriori)", nl: "Niet erkend aan balie (achteraf declareren)" },
                competitorStatus: "bad",
                zwincarValue: { fr: "Franchise Zéro directe 100% contractuelle", en: "Direct zero-excess contract with the fleet", es: "Exención directa y contractual de fianza", nl: "Directe contractuele vrijstelling van borg" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Prise en charge à l'aéroport", en: "Airport pickup experience", es: "Recogida en el aeropuerto", nl: "Ophaalervaring luchthaven" },
                competitorValue: { fr: "File d'attente au guichet (30-60 min) ou navette", en: "Counter queue (30-60 min) or off-site shuttle", es: "Cola en mostrador (30-60 min) o autobús lanzadera", nl: "Wachtrij aan balie (30-60 min) of pendelbus" },
                competitorStatus: "warning",
                zwincarValue: { fr: "Agent avec pancarte nominative Parking P2 (5 min)", en: "Agent with name sign at Exit / Parking P2 (5 min)", es: "Agente con cartel nominativo en Parking P2 (5 min)", nl: "Agent met naambordje bij Parking P2 (5 min)" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Garantie du modèle réservé", en: "Exact vehicle model guarantee", es: "Garantía del modelo reservado", nl: "Garantie op exact model" },
                competitorValue: { fr: "« Ou similaire » (modèle souvent déclassé)", en: "'Or similar' (generic unpredictable tier)", es: "'O similar' (modelo no asegurado)", nl: "'Of vergelijkbaar' (onzeker model)" },
                competitorStatus: "warning",
                zwincarValue: { fr: "Modèle exact garanti ou surclassement offert", en: "Guaranteed exact model or free upgrade", es: "Modelo exacto garantizado o mejora gratis", nl: "Gegarandeerd exact model of gratis upgrade" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Assistance et conciergerie locale", en: "Local assistance & support", es: "Asistencia y soporte local", nl: "Lokale assistentie & support" },
                competitorValue: { fr: "Support délocalisé (email / ticket sous 48h)", en: "Offshore ticket support (24h-48h response)", es: "Ticket por email deslocalizado (24h-48h)", nl: "Helpdesk per ticket (24u-48u reactietijd)" },
                competitorStatus: "bad",
                zwincarValue: { fr: "WhatsApp direct 24/7 (FR/EN/ES/Arabe)", en: "Direct 24/7 WhatsApp (FR/EN/ES/Arabic)", es: "WhatsApp directo 24/7 (FR/EN/ES/Árabe)", nl: "Directe WhatsApp 24/7 (FR/EN/ES/Arabisch)" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Retard d'avion à l'arrivée", en: "Flight delays at arrival", es: "Retrasos de vuelo a la llegada", nl: "Vluchtvertraging bij aankomst" },
                competitorValue: { fr: "Risque de « No-Show » ou frais d'attente", en: "Risk of cancellation or after-hours fee", es: "Riesgo de cancelación por 'No-Show'", nl: "Risico op no-show of toeslag na sluitingstijd" },
                competitorStatus: "warning",
                zwincarValue: { fr: "Suivi en direct FlightRadar24, 0€ de frais", en: "Live FlightRadar24 tracking, €0 extra fee", es: "Seguimiento en directo FlightRadar24, 0€ recargo", nl: "Live FlightRadar24 tracking, €0 toeslag" },
                zwincarHighlight: true,
            },
        ],
        forensicSection: {
            title: {
                fr: "Autopsie Forensique : Pourquoi le piège DiscoverCars frappe à Marrakech et Casablanca",
                en: "Forensic Autopsy: Why Travelers Get Trapped by DiscoverCars at Moroccan Airports",
                es: "Autopsia Forense: Por qué los viajeros caen en la trampa en los aeropuertos de Marruecos",
                nl: "Forensische Analyse: Waarom reizigers stranden op de luchthaven met DiscoverCars",
            },
            paragraphs: {
                fr: [
                    "Le business model des comparateurs internationaux comme DiscoverCars repose sur un prix d'appel très bas affiché sur Google. Pour sécuriser sa marge, la plateforme propose en ligne une « Couverture Complète » à environ 9 € par jour. Cependant, cette assurance est un produit financier letton vendu par DiscoverCars, et non par le loueur marocain qui vous remet la voiture.",
                    "À votre atterrissage à l'aéroport de Marrakech-Ménara ou Casablanca-Mohammed V, l'agent au comptoir vous annonce que l'assurance DiscoverCars ne dispense en aucun cas du dépôt de garantie. Le terminal TPE marocain (norme bancaire CMI) impose une pré-autorisation de 1 500 € à 2 400 €.",
                    "Si votre carte bancaire porte la mention « DEBIT » (comme 85 % des cartes françaises, belges ou néerlandaises) ou provient d'une néobanque (Revolut, N26, BoursoBank), le TPE rejette l'opération. L'agence vous place alors devant un dilemme cruel : souscrire leur propre assurance locale à 25 € à 40 € par jour supplémentaires, ou voir votre réservation annulée sans aucun remboursement de l'acompte déjà versé.",
                    "Chez ZwinCar, ce problème n'existe pas. Nous travaillons directement avec des agences partenaires marocaines qui acceptent les cartes de débit et les espèces. Avec notre option Franchise Zéro, aucune caution n'est bloquée sur votre carte.",
                ],
                en: [
                    "The business model of international aggregators like DiscoverCars relies on ultra-low teaser prices displayed on search engines. To boost margins, the platform sells an online 'Full Coverage' policy for approximately €9/day. However, this policy is an insurance product issued in Latvia, not a direct contract with the local Moroccan car rental counter.",
                    "Upon arriving at Marrakech Menara or Casablanca Mohammed V airport, the desk clerk informs you that DiscoverCars' policy does not waive the mandatory on-site security deposit. Local payment terminals (CMI banking network) require an active credit pre-authorization ranging from €1,500 to €2,400.",
                    "If your card is stamped 'DEBIT' (as are most European cards from Revolut, Monzo, or Barclays) or is issued by a neobank, the terminal automatically rejects the pre-authorization. The desk clerk then forces you to buy their expensive in-house waiver (€25 to €40/day) or forfeits your booking with zero refund.",
                    "At ZwinCar, this friction is eliminated. We partner directly with verified Moroccan fleet owners who accept debit cards and cash. With our Zero Excess option, exactly €0 is blocked on your card.",
                ],
                es: [
                    "El modelo de negocio de los comparadores online se basa en precios gancho muy bajos. La plataforma ofrece una 'Cobertura Total' online por unos 9 € al día. Sin embargo, este seguro es una póliza extranjera que los mostradores locales de los aeropuertos marroquíes no reconocen como exención de fianza.",
                    "Al llegar al aeropuerto de Marrakech o Casablanca, el mostrador exige bloquear entre 1.500 € y 2.400 € en una tarjeta de CRÉDITO estricta. Si su tarjeta es de DÉBITO o de neobancos (Revolut, N26), el datáfono la rechaza automáticamente.",
                    "El viajero queda atrapado: o paga el seguro local del mostrador por 25 € a 40 € adicionales por día, o pierde la reserva y el dinero adelantado.",
                    "ZwinCar elimina este problema: relación directa con agencias verificadas, aceptación de tarjetas de débito y efectivo, y 0 € de fianza con el Pack Sin Franquicia.",
                ],
                nl: [
                    "Het verdienmodel van internationale brokers zoals DiscoverCars is gebaseerd op extreem lage lokprijzen. Online wordt een 'Volledige Dekking' verkocht voor circa € 9 per dag. Deze externe polis stelt u echter niet vrij van de verplichte borgsom aan de balie in Marokko.",
                    "Aangekomen op de luchthaven van Marrakech of Casablanca eist de balie een creditcardblokkade van € 1.500 tot € 2.400. Heeft u een normale betaalpas (DEBIT) of een pas van Revolut of Bunq, dan weigert het pinapparaat de pre-autorisatie.",
                    "U wordt dan gedwongen om alsnog ter plekke een dure balieverzekering van € 25 tot € 40 per dag af te sluiten, of u raakt uw auto en aanbetaling kwijt.",
                    "Bij ZwinCar boekt u direct bij gecontroleerde lokale verhuurders die pinpassen en contant geld accepteren, met de mogelijkheid van € 0 borg.",
                ],
            },
        },
        faqs: [
            {
                q: {
                    fr: "L'assurance « Couverture Complète » de DiscoverCars évite-t-elle la caution au Maroc ?",
                    en: "Does DiscoverCars 'Full Coverage' eliminate the deposit at Morocco airport desks?",
                    es: "¿El seguro 'Cobertura Total' de DiscoverCars evita la fianza en Marruecos?",
                    nl: "Voorkomt de 'Volledige Dekking' van DiscoverCars de borg in Marokko?",
                },
                a: {
                    fr: "Non, absolument pas. C'est une assurance de remboursement a posteriori. Le loueur au guichet exigera tout de même une carte de CRÉDIT pour bloquer 1 500 € à 2 400 €. En cas d'éraflure, le loueur prélève votre caution et vous devez constituer un dossier de réclamation auprès de DiscoverCars avec procès-verbal et devis d'expert pour espérer être remboursé.",
                    en: "No, absolutely not. It is an aftermarket reimbursement scheme. The rental desk will still demand an embossed credit card to block €1,500 to €2,400. In case of damage, your deposit is deducted and you must file a claim with DiscoverCars seeking reimbursement.",
                    es: "No, en absoluto. Es un seguro de reembolso a posteriori. El mostrador retendrá entre 1.500 € y 2.400 € en su tarjeta de crédito. En caso de siniestro, el loueur cobra la fianza y usted debe reclamar el dinero a DiscoverCars presentando atestados y presupuestos.",
                    nl: "Nee, absoluut niet. Het is een declaratieverzekering achteraf. De verhuurder blokkeert nog steeds € 1.500 tot € 2.400 op uw creditcard. Bij schade wordt het bedrag ingehouden en moet u achteraf declareren bij DiscoverCars.",
                },
            },
            {
                q: {
                    fr: "Puis-je louer chez DiscoverCars avec une carte de débit au Maroc ?",
                    en: "Can I rent with a debit card on DiscoverCars in Morocco?",
                    es: "¿Puedo alquilar en DiscoverCars con tarjeta de débito en Marruecos?",
                    nl: "Kan ik bij DiscoverCars huren met een pinpas in Marokko?",
                },
                a: {
                    fr: "Dans 95 % des cas, non. Même si votre carte passe en ligne pour payer l'acompte, les TPE des loueurs marocains aux aéroports (norme ISO 8583) rejettent les cartes portant la mention « DEBIT » pour la pré-autorisation de caution.",
                    en: "In 95% of cases, no. Even if your debit card works online to pay the initial voucher, Moroccan airport point-of-sale terminals reject cards marked 'DEBIT' for the security hold.",
                    es: "En el 95% de los casos, no. Aunque pague el anticipo online, los terminales de los mostradores marroquíes rechazan tarjetas con la palabra 'DEBIT' para la fianza.",
                    nl: "In 95% van de gevallen niet. Zelfs als de online aanbetaling lukt, weigeren de betaalautomaten op de Marokkaanse luchthaven kaarten met het opschrift 'DEBIT' voor de borgblokkade.",
                },
            },
            {
                q: {
                    fr: "Pourquoi ZwinCar est-il plus fiable pour un voyage au Maroc ?",
                    en: "Why is ZwinCar more reliable for traveling in Morocco?",
                    es: "¿Por qué ZwinCar es más fiable para viajar por Marruecos?",
                    nl: "Waarom is ZwinCar betrouwbaarder voor een reis in Marokko?",
                },
                a: {
                    fr: "ZwinCar contractualise directement avec des agences marocaines triées sur le volet. Vous connaissez exactement le modèle que vous allez conduire, la caution est de 0 € avec la Franchise Zéro, un agent vous remet les clés en main propre au parking P2 sans file d'attente, et vous avez une assistance WhatsApp locale 24/7 en cas de problème sur la route.",
                    en: "ZwinCar contracts directly with vetted local Moroccan agencies. You receive the exact model chosen, enjoy €0 deposit with Zero Excess, get greeted outside the terminal by an agent with your keys ready, and have 24/7 direct WhatsApp concierge assistance on the road.",
                    es: "ZwinCar trabaja directamente con agencias locales seleccionadas. El modelo reservado es exacto, la fianza es de 0 € con el Pack Sin Franquicia, un agente le entrega las llaves en mano en el Parking P2 y dispone de soporte WhatsApp local las 24 horas.",
                    nl: "ZwinCar werkt rechtstreeks samen met gecontroleerde lokale verhuurders. U krijgt het exacte gekozen model, betaalt € 0 borg met Geen Eigen Risico, wordt persoonlijk opgewacht bij Parking P2 en heeft 24/7 WhatsApp-hulp onderweg.",
                },
            },
        ],
    },
    {
        slug: "bsp-auto",
        competitorName: "BSP Auto",
        competitorType: {
            fr: "Grossiste & Courtier français traditionnel (Paris)",
            en: "Traditional French Car Rental Broker (Paris)",
            es: "Broker Mayorista Francés Tradicional (París)",
            nl: "Traditionele Franse Autoverhuur Broker (Parijs)",
        },
        titles: {
            fr: "ZwinCar vs BSP Auto au Maroc • Comparatif Caution, Débit & Avis",
            en: "ZwinCar vs BSP Auto Morocco • Deposit, Debit Cards & Airport Review",
            es: "ZwinCar vs BSP Auto en Marruecos • Comparativa Fianza y Tarjeta Débito",
            nl: "ZwinCar vs BSP Auto in Marokko • Vergelijking Borg en Pinpas",
        },
        metaDescriptions: {
            fr: "BSP Auto au Maroc : attention au refus des cartes de débit et à la caution bloquée de 1 500 € au comptoir. Comparez avec ZwinCar : caution 0€, modèle garanti, WhatsApp 24/7.",
            en: "BSP Auto Morocco review: beware of debit card rejections and €1,500+ deposits at airport counters. Compare with ZwinCar: €0 deposit, exact model guaranteed, 24/7 WhatsApp.",
            es: "BSP Auto en Marruecos: atención al rechazo de tarjetas de débito y fianzas de 1.500 €. Compare con ZwinCar: fianza 0€, modelo garantizado y WhatsApp local 24/7.",
            nl: "BSP Auto in Marokko: pas op voor geweigerde pinpassen en borgsommen van € 1.500+. Vergelijk met ZwinCar: € 0 borg, exact model gegarandeerd, 24/7 WhatsApp.",
        },
        heroH1: {
            fr: "ZwinCar vs BSP Auto au Maroc : Courtier Centralisé vs Flotte Locale Directe",
            en: "ZwinCar vs BSP Auto in Morocco: Centralized Broker vs Direct Local Fleet",
            es: "ZwinCar vs BSP Auto en Marruecos: Broker Centralizado vs Flota Local Directa",
            nl: "ZwinCar vs BSP Auto in Marokko: Tussenpersoon vs Directe Lokale Vloot",
        },
        heroSubtitle: {
            fr: "Comprendre pourquoi les conditions d'un courtier basé à Paris ne protègent pas les voyageurs atterrissant à Marrakech ou Casablanca à 23h.",
            en: "Understanding why booking through a Paris-based call-center broker leaves travelers unprotected when landing in Morocco late at night.",
            es: "Por qué reservar con un broker con sede en París no protege al viajero que aterriza de noche en Marrakech o Casablanca.",
            nl: "Waarom boeken via een Franse tussenpersoon reizigers onbeschermd laat bij late aankomst in Marokko.",
        },
        verdictBadge: {
            fr: "Comparatif Agence 2026",
            en: "2026 Agency Comparison",
            es: "Comparativa Agencias 2026",
            nl: "Bureauvergelijking 2026",
        },
        keyTakeaway: {
            fr: "BSP Auto est un courtier historique réputé en Europe, mais son modèle montre ses limites au Maroc : il transmet votre réservation à des franchisés d'aéroport qui exigent une carte de crédit avec 1 200 € à 2 000 € de caution. Si votre vol a 2 heures de retard, le service client téléphonique parisien est fermé, et l'agence locale peut annuler votre dossier pour non-présentation. ZwinCar suit votre vol en direct et un agent d'astreinte vous attend personnellement avec vos clés.",
            en: "BSP Auto is a legacy French broker, but its model fails travelers in Morocco: it resells stock from airport franchisees who freeze €1,200 to €2,000 on credit cards. If your flight is delayed by 2 hours, BSP's Paris phone lines are closed, risking a 'no-show' cancellation. ZwinCar monitors your flight live via radar and keeps your agent waiting at the gate.",
            es: "BSP Auto es un intermediario clásico. En Marruecos revende vehículos de franquicias que exigen tarjeta de crédito con 1.200 € a 2.000 € de bloqueo. Si el vuelo se retrasa, su centralita en París está cerrada. ZwinCar rastrea su vuelo en tiempo real y garantiza la entrega sin sobrecostes.",
            nl: "BSP Auto is een traditionele tussenpersoon. In Marokko stuurt het boekingen door naar baliebedrijven die € 1.200 tot € 2.000 blokkeren op een creditcard. Bij vluchtvertraging is de Franse klantenservice gesloten. ZwinCar volgt uw vlucht live en zorgt dat de agent op u wacht.",
        },
        tableHeaders: {
            criteria: { fr: "Critère de Comparaison", en: "Comparison Factor", es: "Criterio de Comparación", nl: "Vergelijkingscriterium" },
            competitor: { fr: "BSP Auto (Courtier Parisien)", en: "BSP Auto (French Broker)", es: "BSP Auto (Broker Francés)", nl: "BSP Auto (Franse Broker)" },
            zwincar: { fr: "ZwinCar (Direct Agences Maroc)", en: "ZwinCar (Direct Morocco Fleet)", es: "ZwinCar (Flota Local Marruecos)", nl: "ZwinCar (Direct Marokkaanse Vloot)" },
        },
        comparisonRows: [
            {
                label: { fr: "Gestion de la caution", en: "Deposit handling", es: "Gestión de la fianza", nl: "Afhandeling van de borg" },
                competitorValue: { fr: "1 200 € à 2 000 € bloqués sur carte", en: "€1,200 to €2,000 credit hold", es: "1.200 € a 2.000 € retenidos", nl: "€ 1.200 tot € 2.000 creditcardblokkade" },
                competitorStatus: "bad",
                zwincarValue: { fr: "0 € (Pack Franchise Zéro) ou 300 € max", en: "€0 (Zero Excess Pack) or €300 max", es: "0 € (Pack Sin Franquicia) o 300 € máx.", nl: "€ 0 (Geen Eigen Risico) of max € 300" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Acceptation des cartes de débit", en: "Debit card acceptance", es: "Aceptación de tarjetas de débito", nl: "Acceptatie van pinpassen" },
                competitorValue: { fr: "Refusées au guichet local", en: "Rejected by airport counters", es: "Rechazadas en mostrador local", nl: "Geweigerd aan de lokale balie" },
                competitorStatus: "bad",
                zwincarValue: { fr: "100 % acceptées (Visa, Mastercard, N26, Revolut)", en: "100% accepted (Visa, Mastercard, Revolut)", es: "100% aceptadas (Visa, Mastercard, Revolut)", nl: "100% geaccepteerd (Visa, Mastercard, Revolut)" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Retard de vol après 20h", en: "Flight delays after 8 PM", es: "Retrasos de vuelo después de las 20h", nl: "Vluchtvertraging na 20:00 uur" },
                competitorValue: { fr: "Service client fermé, risque de no-show", en: "Call center closed, cancellation risk", es: "Atención telefónica cerrada, riesgo de no-show", nl: "Helpdesk gesloten, risico op no-show" },
                competitorStatus: "bad",
                zwincarValue: { fr: "Suivi en direct FlightRadar, agent d'astreinte H24", en: "Live FlightRadar tracking, on-duty agent 24/7", es: "Seguimiento FlightRadar, agente de guardia 24/7", nl: "Live vluchtvolging, 24/7 agent aanwezig" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Canal de communication", en: "Support channels", es: "Canales de soporte", nl: "Communicatiekanalen" },
                competitorValue: { fr: "Numéro de téléphone français / formulaire web", en: "French phone number / web ticket form", es: "Teléfono francés / formulario de soporte", nl: "Frans telefoonnummer / webformulier" },
                competitorStatus: "warning",
                zwincarValue: { fr: "Fil WhatsApp dédié avec coordinateur local", en: "Dedicated WhatsApp thread with local manager", es: "Chat de WhatsApp con coordinador local", nl: "Directe WhatsApp-groep met lokale beheerder" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Prise en charge au Riad", en: "Riad & Hotel direct delivery", es: "Entrega directa en Riad u Hotel", nl: "Levering bij Riad of Hotel" },
                competitorValue: { fr: "Impossible (guichet aéroport uniquement)", en: "Not available (airport counters only)", es: "No disponible (solo mostrador de aeropuerto)", nl: "Niet mogelijk (alleen luchthavenbalie)" },
                competitorStatus: "warning",
                zwincarValue: { fr: "Offerte à votre Riad ou hôtel dans toutes les villes", en: "Complimentary at your Riad or city hotel", es: "Gratuita en su Riad u hotel en todas las ciudades", nl: "Gratis bij uw Riad of hotel in alle steden" },
                zwincarHighlight: true,
            },
        ],
        forensicSection: {
            title: {
                fr: "Le gouffre entre un courtier de bureau et la réalité du terrain marocain",
                en: "The Gulf Between a Remote European Broker and Moroccan Reality",
                es: "La distancia entre un broker en Europa y la realidad del terreno en Marruecos",
                nl: "Het verschil tussen een Europese tussenpersoon en de praktijk in Marokko",
            },
            paragraphs: {
                fr: [
                    "Réserver via BSP Auto peut paraître rassurant pour un voyageur français habitué aux locations en Europe. Mais au Maroc, BSP Auto ne possède aucun véhicule ni aucun employé sur place. Votre contrat est délégué à des franchisés indépendants dont les critères d'acceptation de carte sont stricts et impersonnels.",
                    "En cas de litige (rayure constatée sur la route du Tichka, pneu crevé dans le désert d'Agafay ou contrôle de gendarmerie), un courtier classique vous renvoie vers les petites lignes de votre contrat d'assurance. Vous devez avancer l'argent, faire établir des devis conformes aux normes européennes et attendre plusieurs semaines un remboursement incertain.",
                    "Avec ZwinCar, vous êtes en contact direct avec l'agence qui gère la voiture. Pas de tiers, pas d'intermédiaire qui prend sa commission sans assumer le suivi. Si vous avez une question sur les péages autoroutiers Jawaz, les zones de stationnement ou un phare grillé, votre coordinateur WhatsApp répond en moins de 5 minutes.",
                ],
                en: [
                    "Booking through a remote broker might feel familiar in Europe, but in Morocco, foreign brokers have zero staff on the ground. Your voucher is handed over to third-party airport franchisees whose rules are rigid.",
                    "If a dispute occurs—such as cosmetic damage from mountain gravel on the Tichka pass or a flat tire near Agafay—traditional brokers tell you to pay out-of-pocket and submit a claim back home. The process is lengthy, administrative, and often leads to partial rejections.",
                    "ZwinCar connects you directly with the local fleet owner. If you have questions about highway toll passes (Jawaz), parking guardians, or police checkpoints, your dedicated WhatsApp manager assists you in real-time.",
                ],
                es: [
                    "Reservar con un broker tradicional funciona bien en Europa, pero en Marruecos estos intermediarios no cuentan con personal local. Su reserva se delega a agencias que aplican condiciones muy estrictas.",
                    "Si surge cualquier imprevisto en carretera o un arañazo por gravilla, el intermediario le exige pagar los daños y abrir un largo expediente de reclamación por internet.",
                    "En ZwinCar la relación es directa y transparente. Su coordinador local de WhatsApp le ayuda de inmediato ante cualquier incidencia en carretera.",
                ],
                nl: [
                    "Boeken via een traditionele broker voelt vertrouwd, maar in Marokko hebben buitenlandse tussenpersonen geen personeel ter plaatse. Uw boeking wordt uitbesteed aan baliebedrijven met strenge creditcardeisen.",
                    "Bij schade door steenslag op de Atlaspassen moet u bij een broker zelf de kosten voorschieten en thuis een langdurig claimdossier indienen.",
                    "Bij ZwinCar staat u rechtstreeks in contact met de lokale verhuurder via WhatsApp, die u direct helpt bij vragen over tolwegen, parkeren of pech.",
                ],
            },
        },
        faqs: [
            {
                q: {
                    fr: "Puis-je modifier ma réservation facilement en cas de retard de vol ?",
                    en: "Can I easily update my booking if my flight is delayed?",
                    es: "¿Puedo modificar la reserva si mi vuelo sufre retraso?",
                    nl: "Kan ik mijn boeking aanpassen bij vluchtvertraging?",
                },
                a: {
                    fr: "Chez BSP Auto, toute modification passe par leur centrale d'appel en France, fermée le soir. Chez ZwinCar, nous suivons votre numéro de vol en direct sur FlightRadar24 : même avec 3 heures de retard à 1h du matin, notre agent vous attend avec le sourire et sans frais supplémentaires.",
                    en: "With BSP Auto, modifications require contacting their French office during business hours. At ZwinCar, we track your flight number in real time: even if your plane arrives at 1 AM with a 3-hour delay, your agent is at the terminal waiting with your keys at no extra charge.",
                    es: "En BSP Auto cualquier cambio depende del horario de oficina en Francia. En ZwinCar seguimos su vuelo en directo: aunque aterrice de madrugada con retraso, el agente le espera con las llaves sin recargo.",
                    nl: "Bij BSP Auto moet u bellen naar Frankrijk tijdens kantooruren. ZwinCar volgt uw vluchtnummer live via radar: zelfs bij uren vertraging 's nachts staat de agent kosteloos voor u klaar.",
                },
            },
            {
                q: {
                    fr: "Les prix de ZwinCar incluent-ils la livraison au Riad ?",
                    en: "Do ZwinCar rates include Riad delivery?",
                    es: "¿Los precios de ZwinCar incluyen la entrega en el Riad?",
                    nl: "Zijn leveringen bij een Riad inbegrepen bij ZwinCar?",
                },
                a: {
                    fr: "Oui, la livraison et la restitution à votre Riad ou hôtel (valeur 100 DH / 10 €) sont offertes et incluses d'office, alors que les courtiers traditionnels n'opèrent que depuis les guichets d'aéroports.",
                    en: "Yes, airport and Riad delivery (a €10 / 100 MAD value) is included free of charge, whereas brokers only provide collection at airport counters.",
                    es: "Sí, la entrega y devolución en su Riad u hotel está incluida de forma gratuita, mientras que los brokers tradicionales solo operan en los mostradores del aeropuerto.",
                    nl: "Ja, bezorging en inlevering bij uw Riad of hotel (t.w.v. € 10) is gratis inbegrepen. Traditionele brokers opereren alleen via balies op de luchthaven.",
                },
            },
        ],
    },
    {
        slug: "rentalcars",
        competitorName: "Rentalcars.com",
        competitorType: {
            fr: "Plateforme mondiale Booking Holdings (Manchester, UK)",
            en: "Global Aggregator Booking Holdings (Manchester, UK)",
            es: "Agregador Global Booking Holdings (Mánchester, Reino Unido)",
            nl: "Wereldwijde Broker Booking Holdings (Manchester, VK)",
        },
        titles: {
            fr: "ZwinCar vs Rentalcars au Maroc • Caution, Arnaque Franchise & Avis",
            en: "ZwinCar vs Rentalcars Morocco • Deposit Trap & Full Protection Review",
            es: "ZwinCar vs Rentalcars en Marruecos • Fianza, Seguro y Alternativa",
            nl: "ZwinCar vs Rentalcars in Marokko • Borg, Verzekering en Beoordeling",
        },
        metaDescriptions: {
            fr: "Rentalcars au Maroc : pourquoi leur Protection Complète ne supprime pas la caution de 2 000 € au comptoir. Comparez avec ZwinCar : caution 0€, débit accepté, service VIP.",
            en: "Rentalcars.com in Morocco: why their Full Protection doesn't waive the €2,000 counter deposit. Compare with ZwinCar: €0 deposit waiver, debit cards, VIP meet & greet.",
            es: "Rentalcars en Marruecos: por qué su Protección Total no elimina la fianza de 2.000 € en mostrador. Compare con ZwinCar: 0 € fianza, débito aceptado y entrega rápida.",
            nl: "Rentalcars in Marokko: waarom hun Volledige Bescherming de borg van € 2.000 niet opheft. Vergelijk met ZwinCar: € 0 borg, pinpas geaccepteerd, VIP-service.",
        },
        heroH1: {
            fr: "ZwinCar vs Rentalcars au Maroc : L'Illusion de la Protection Complète",
            en: "ZwinCar vs Rentalcars in Morocco: The Illusion of Full Protection",
            es: "ZwinCar vs Rentalcars en Marruecos: La Ilusión de la Protección Total",
            nl: "ZwinCar vs Rentalcars in Marokko: De Illusie van Volledige Bescherming",
        },
        heroSubtitle: {
            fr: "Comment l'assurance vendue par Rentalcars se transforme en 2 000 € débités à l'atterrissage, et pourquoi un réseau local direct vous protège mieux.",
            en: "How the online add-on sold by Rentalcars still leaves you facing a €2,000 security block at arrival, and why a direct local network keeps you safe.",
            es: "Cómo el seguro vendido por Rentalcars termina en 2.000 € bloqueados al llegar y por qué una red local directa ofrece mayor tranquilidad.",
            nl: "Hoe de verzekering van Rentalcars alsnog leidt tot een blokkade van € 2.000 bij aankomst, en waarom een direct lokaal netwerk u beter beschermt.",
        },
        verdictBadge: {
            fr: "Comparatif Plateforme 2026",
            en: "2026 Platform Review",
            es: "Comparativa Plataforma 2026",
            nl: "Platformvergelijking 2026",
        },
        keyTakeaway: {
            fr: "Rentalcars (Booking.com) est le plus gros distributeur au monde, mais au Maroc, il sous-traite à des loueurs d'aéroport aux méthodes agressives. L'option « Protection Complète » souscrite en ligne est systématiquement contestée au comptoir local, qui exige d'immobiliser 1 500 € à 2 500 € sur votre plafond de carte de crédit. Chez ZwinCar, la Franchise Zéro est contractuelle dès le départ : zéro caution bloquée, zéro mauvaise surprise, et une remise des clés en 5 minutes chrono.",
            en: "Rentalcars.com (part of Booking Holdings) is the world's largest distributor, but in Morocco, it outsources to aggressive airport franchise counters. Their online 'Full Protection' is not accepted as a deposit waiver locally, forcing a €1,500–€2,500 hold on your credit limit. With ZwinCar, our Zero Excess is direct and contractual: exactly €0 blocked, zero surprises, and key handover in 5 minutes flat.",
            es: "Rentalcars (Booking.com) subcontrata en Marruecos a franquicias de aeropuerto que exigen inmovilizar entre 1.500 € y 2.500 € en tarjeta de crédito, ignorando la póliza contratada online. Con ZwinCar, la Franchise Zéro es directa y real: 0 € retenidos en su tarjeta y entrega rápida en 5 minutos.",
            nl: "Rentalcars (Booking.com) besteedt in Marokko uit aan balieverhuurders die € 1.500 tot € 2.500 blokkeren op uw creditcard, ongeacht de online gekochte verzekering. Bij ZwinCar is Geen Eigen Risico direct contractueel geregeld: € 0 geblokkeerd en sleuteloverdracht in 5 minuten.",
        },
        tableHeaders: {
            criteria: { fr: "Critère de Comparaison", en: "Comparison Factor", es: "Criterio de Comparación", nl: "Vergelijkingscriterium" },
            competitor: { fr: "Rentalcars.com (Booking Transport)", en: "Rentalcars.com (Booking.com)", es: "Rentalcars.com (Booking)", nl: "Rentalcars.com (Booking)" },
            zwincar: { fr: "ZwinCar (Réseau Direct Maroc)", en: "ZwinCar (Direct Moroccan Network)", es: "ZwinCar (Red Directa Marruecos)", nl: "ZwinCar (Direct Marokkaans Netwerk)" },
        },
        comparisonRows: [
            {
                label: { fr: "Caution bloquée sur la carte", en: "Deposit frozen on card", es: "Fianza retenida en tarjeta", nl: "Borg geblokkeerd op kaart" },
                competitorValue: { fr: "1 500 € à 2 500 € (plafonnement CB)", en: "€1,500 to €2,500 credit freeze", es: "1.500 € a 2.500 € bloqueados", nl: "€ 1.500 tot € 2.500 geblokkeerd" },
                competitorStatus: "bad",
                zwincarValue: { fr: "0 € (Option Franchise Zéro) ou 300 €", en: "€0 (Zero Excess Option) or €300", es: "0 € (Opción Cero Fianza) o 300 €", nl: "€ 0 (Geen Eigen Risico) of € 300" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Refus des cartes de débit / néobanques", en: "Debit & Neobank refusal", es: "Rechazo de débito / neobancos", nl: "Weigering pinpas & neobank" },
                competitorValue: { fr: "Fréquent (annulation ou surcoût au guichet)", en: "Frequent (forced counter waiver or loss)", es: "Frecuente (seguro forzado en mostrador)", nl: "Veelvoorkomend (extra kosten ter plaatse)" },
                competitorStatus: "bad",
                zwincarValue: { fr: "Zéro refus : Débit, Revolut et Cash acceptés", en: "Zero refusal: Debit, Revolut & Cash accepted", es: "Cero rechazos: Débito, Revolut y Cash aceptados", nl: "Geen weigering: Pinpas, Revolut & Cash oké" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Temps d'attente à l'atterrissage", en: "Wait time at terminal", es: "Tiempo de espera al aterrizar", nl: "Wachttijd bij landing" },
                competitorValue: { fr: "30 à 60 minutes de queue aux heures de pointe", en: "30 to 60 min counter queue at peak times", es: "30 a 60 min de cola en horas punta", nl: "30 tot 60 min wachten in de rij" },
                competitorStatus: "warning",
                zwincarValue: { fr: "5 minutes : accueil direct au parking P2", en: "5 minutes: meet & greet at Parking P2", es: "5 minutos: entrega directa en Parking P2", nl: "5 minuten: persoonlijke ontmoeting P2" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Inspection du véhicule (état des lieux)", en: "Vehicle condition check", es: "Inspección del vehículo", nl: "Voertuiginspectie" },
                competitorValue: { fr: "Fait à la hâte sur parking sombre", en: "Rushed in dimly lit parking lots", es: "Rápida y a menudo descuidada en el parking", nl: "Vaak gehaast op donkere parkeerplaats" },
                competitorStatus: "warning",
                zwincarValue: { fr: "Protocole photo guidé 5 points avec l'agent", en: "Guided 5-point photo protocol with agent", es: "Protocolo guiado de 5 fotos con el agente", nl: "Begeleid 5-punts fotoprotocol met agent" },
                zwincarHighlight: true,
            },
            {
                label: { fr: "Contact en cas de panne ou litige", en: "Emergency & dispute contact", es: "Contacto en caso de avería", nl: "Contact bij pech of geschil" },
                competitorValue: { fr: "Serveur vocal interactif international", en: "International automated phone tree", es: "Centralita automatizada internacional", nl: "Internationaal keuzemenu" },
                competitorStatus: "bad",
                zwincarValue: { fr: "Conciergerie WhatsApp en direct 24/7", en: "Live 24/7 WhatsApp concierge", es: "Conserjería WhatsApp en vivo 24/7", nl: "Live 24/7 WhatsApp-conciërge" },
                zwincarHighlight: true,
            },
        ],
        forensicSection: {
            title: {
                fr: "Pourquoi le géant mondial Rentalcars ne résout pas le racket de la caution",
                en: "Why the World's Largest Rental Aggregator Fails at Deposit Transparency",
                es: "Por qué el gigante Rentalcars no soluciona el problema de las fianzas abusivas",
                nl: "Waarom de grootste autoverhuurder ter wereld het borgprobleem niet oplost",
            },
            paragraphs: {
                fr: [
                    "Rentalcars.com génère des millions de réservations dans le monde. Mais au Maroc, les loueurs franchisés opèrent avec des marges serrées et comptent sur les ventes additionnelles au guichet pour rentabiliser leur flotte.",
                    "Lorsque vous arrivez avec un bon Rentalcars, le guichetier sait que vous avez payé votre commission à Manchester, pas à Marrakech. Il applique alors la règle stricte de la caution maximale de 2 000 €. Si votre carte bancaire n'est pas une carte de crédit à débit différé avec un plafond suffisant, vous êtes piégé.",
                    "ZwinCar inverse ce modèle : nos partenaires locaux perçoivent 80 % du prix de la location directement à la remise des clés. Ils sont rémunérés équitablement et n'ont aucun intérêt à vous forcer la main pour des assurances inutiles. C'est un modèle sain basé sur la fidélité et la recommandation.",
                ],
                en: [
                    "Rentalcars.com handles millions of bookings worldwide. However, Moroccan airport franchises operate under thin margins and heavily rely on counter upselling to achieve profitability.",
                    "When presenting a Rentalcars voucher, the desk clerk knows the booking margin went to corporate headquarters in the UK, not to their local station. They consequently enforce the maximum security deposit requirement (€2,000+). If your card lacks an adequate credit line, you face high on-site upgrade charges.",
                    "ZwinCar reverses this incentive structure: our certified local partners receive 80% of the rental fee directly upon key handover. They are fairly compensated and have zero incentive to force unnecessary counter waivers upon you.",
                ],
                es: [
                    "Rentalcars.com gestiona millones de alquileres. Pero en Marruecos las franquicias locales dependen de la venta de seguros en mostrador para rentabilizar su negocio.",
                    "Al presentar el bono de Rentalcars, el agente aplica estrictamente la fianza de hasta 2.500 €. Si no dispone de tarjeta de crédito con límite suficiente, no podrá retirar el coche sin pagar un seguro adicional.",
                    "ZwinCar cambia las reglas: nuestros socios locales cobran el 80% del alquiler directamente en mano al entregar el coche, garantizando un trato personalizado y sin ventas forzadas.",
                ],
                nl: [
                    "Rentalcars.com verwerkt wereldwijd miljoenen reserveringen. In Marokko werken franchisenemers echter met kleine marges en rekenen zij op extra balieverkoop om winstgevend te zijn.",
                    "Met een voucher van Rentalcars eist de lokale baliemedewerker de maximale borg van € 2.000+. Zonder toereikende creditcardlimiet bent u verplicht extra verzekeringen af te sluiten.",
                    "ZwinCar werkt anders: onze lokale partners ontvangen 80% van het huurbedrag rechtstreeks bij de sleuteloverdracht, wat zorgt voor eerlijke service zonder agressieve verkoop.",
                ],
            },
        },
        faqs: [
            {
                q: {
                    fr: "La Protection Complète de Rentalcars couvre-t-elle les pistes et le désert ?",
                    en: "Does Rentalcars Full Protection cover desert and unpaved roads?",
                    es: "¿La Protección Total de Rentalcars cubre pistas y desierto?",
                    nl: "Dekt de Volledige Bescherming van Rentalcars onverharde wegen?",
                },
                a: {
                    fr: "Généralement non. Les conditions excluent les pistes non goudronnées, les sous-châssis et les dégâts dus au sable. Chez ZwinCar, nos véhicules de type Duster 4x4 ou Land Cruiser sont adaptés aux pistes carrossables d'Agafay et du Sud marocain.",
                    en: "Usually no. Their terms strictly exclude unpaved tracks, undercarriage damage, and sandstorms. At ZwinCar, our high-clearance 4x4 vehicles (Duster, Prado) are permitted on standard gravel tracks such as Agafay desert camps.",
                    es: "Por lo general, no. Las condiciones excluyen pistas de tierra y daños en los bajos. En ZwinCar, nuestros modelos 4x4 (Duster, Prado) están autorizados en pistas habituales como Agafay.",
                    nl: "Meestal niet. De voorwaarden sluiten onverharde wegen en bodemschade uit. Bij ZwinCar zijn onze 4x4-modellen (zoals de Duster) geschikt voor begaanbare pistes zoals in Agafay.",
                },
            },
            {
                q: {
                    fr: "Que se passe-t-il si j'ai un problème mécanique en plein roadtrip ?",
                    en: "What happens if I experience a mechanical breakdown during my roadtrip?",
                    es: "¿Qué ocurre en caso de avería mecánica durante el viaje?",
                    nl: "Wat gebeurt er bij mechanische pech tijdens de rondreis?",
                },
                a: {
                    fr: "Rentalcars vous renvoie vers le numéro d'assistance du loueur figurant sur le contrat papier. ZwinCar vous fournit une ligne WhatsApp directe avec un agent d'astreinte qui coordonne le dépannage ou le véhicule de remplacement en moins de 2 heures partout au Maroc.",
                    en: "Rentalcars directs you to the local rental contract's hotline, which is often difficult to reach. ZwinCar provides a direct WhatsApp concierge line that dispatches local roadside assistance or a replacement car within 2 hours across Morocco.",
                    es: "Rentalcars le remite al teléfono del contrato del loueur. ZwinCar le proporciona asistencia por WhatsApp directa que coordina el remolque o coche de sustitución en menos de 2 horas en todo Marruecos.",
                    nl: "Rentalcars verwijst u naar het nummer op het papieren huurcontract. ZwinCar biedt een directe WhatsApp-lijn die binnen 2 uur pechhulp of een vervangende auto regelt in heel Marokko.",
                },
            },
        ],
    },
];

export function getVsComparison(slug: string): VsComparison | undefined {
    return VS_COMPETITORS.find((c) => c.slug === slug);
}

export function getVsMetadata(slug: string, locale: Locale) {
    const comparison = getVsComparison(slug);
    if (!comparison) return { title: "Not Found" };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";
    const frUrl = `${baseUrl}/vs/${slug}`;
    const enUrl = `${baseUrl}/en/vs/${slug}`;
    const esUrl = `${baseUrl}/es/vs/${slug}`;
    const nlUrl = `${baseUrl}/nl/vs/${slug}`;

    const canonicalUrl =
        locale === "fr" ? frUrl : locale === "en" ? enUrl : locale === "es" ? esUrl : nlUrl;

    const title = comparison.titles[locale];
    const description = comparison.metaDescriptions[locale];

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
            languages: {
                fr: frUrl,
                "fr-FR": frUrl,
                en: enUrl,
                "en-US": enUrl,
                "en-GB": enUrl,
                es: esUrl,
                "es-ES": esUrl,
                nl: nlUrl,
                "nl-NL": nlUrl,
                "x-default": enUrl,
            },
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: "ZwinCar.com",
            locale: locale === "fr" ? "fr_FR" : locale === "en" ? "en_US" : locale === "es" ? "es_ES" : "nl_NL",
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}

