/**
 * ZwinCar.com — Système i18n & Dictionnaire Multilingue (FR, EN, ES, NL)
 * Couvre 100% de l'interface : header, formulaires, widgets, modales, checkout, boutons et SEO.
 */

export type Locale = "fr" | "en" | "es" | "nl";

export const SUPPORTED_LOCALES: Locale[] = ["fr", "en", "es", "nl"];

export const LOCALE_LABELS: Record<Locale, { name: string; flag: string }> = {
    fr: { name: "Français", flag: "🇫🇷" },
    en: { name: "English", flag: "🇬🇧" },
    es: { name: "Español", flag: "🇪🇸" },
    nl: { name: "Nederlands", flag: "🇳🇱" },
};

export const TRANSLATIONS: Record<
    Locale,
    {
        nav: {
            vehicles: string;
            airports: string;
            zeroDeposit: string;
            guides: string;
            vendorSpace: string;
            contact: string;
            bookNow: string;
        };
        search: {
            sameReturn: string;
            oneWay: string;
            allGearboxes: string;
            autoOnly: string;
            zeroDepositOnly: string;
            noDepositHoldNotice: string;
            pickupLocation: string;
            dropoffLocation: string;
            pickupPlaceholder: string;
            pickupDate: string;
            returnDate: string;
            daysCount: string;
            ctaButton: string;
            searchingBtn: string;
            noDepositPill: string;
            exactModelPill: string;
            airportDeliveryPill: string;
            freeCancellationPill: string;
        };
        catalog: {
            title: string;
            subtitle: string;
            all: string;
            seats: string;
            luggage: string;
            manual: string;
            automatic: string;
            petrol: string;
            diesel: string;
            depositPill: string;
            zeroExcessPill: string;
            fromPerDay: string;
            totalEstimate: string;
            bookCar: string;
            viewDetails: string;
            verifiedPartner: string;
        };
        bookingWidget: {
            guaranteedRate: string;
            partnerRate: string;
            perDay: string;
            depositNoticeZero: string;
            depositNoticeStandard: string;
            pickupLocationLabel: string;
            pickupDateLabel: string;
            returnDateLabel: string;
            hubSheetLink: string;
            pickupReturn: string;
            sameAirportNotice: string;
            fuelPolicy: string;
            fuelPolicyDesc: string;
            pistePolicy: string;
            pistePolicyDesc: string;
            optionsTitle: string;
            optionsSubtitle: string;
            breakdownTitle: string;
            rentalBase: string;
            selectedOptions: string;
            depositAtCounter: string;
            depositReturnedNote: string;
            zeroDepositActive: string;
            payTodayStripe: string;
            payTodayNote: string;
            balanceOnSite: string;
            ctaProceed: string;
            lockVehicleBtn: string;
            whatsappAvailabilityBtn: string;
            freeCancellationNotice: string;
            stripeNotice: string;
            brokerComparisonTitle: string;
            brokerComparisonLegacy: string;
            brokerComparisonZwincar: string;
        };
        checkoutModal: {
            modalTitle: string;
            depositSummaryZero: string;
            depositSummaryStandard: string;
            acceptedCardsNotice: string;
            pickupLabel: string;
            returnLabel: string;
            fullNameLabel: string;
            fullNamePlaceholder: string;
            phoneLabel: string;
            phonePlaceholder: string;
            emailLabel: string;
            emailPlaceholder: string;
            flightNumberLabel: string;
            flightNumberPlaceholder: string;
            flightTrackNote: string;
            notesLabel: string;
            notesPlaceholder: string;
            payStripeBtn: string;
            securePaymentNotice: string;
            cancelFreeNotice: string;
        };
        sosModal: {
            badge: string;
            title: string;
            tabNumbers: string;
            tabAccident: string;
            tabPolice: string;
            freeCallNotice: string;
            gendarmerie: string;
            gendarmerieDetail: string;
            police: string;
            policeDetail: string;
            highway: string;
            highwayDetail: string;
            medical: string;
            medicalDetail: string;
            conciergeTitle: string;
            conciergeDesc: string;
            conciergeBtn: string;
            closeBtn: string;
        };
        footer: {
            tagline: string;
            supportNotice: string;
            networkTitle: string;
            destinationsTitle: string;
            transparencyTitle: string;
            rights: string;
            stripeSecure: string;
            whatsappAssist: string;
        };
    }
> = {
    fr: {
        nav: {
            vehicles: "Véhicules",
            airports: "Aéroports & Villes",
            zeroDeposit: "Zéro Caution CB",
            guides: "Guides & Conseils",
            vendorSpace: "Espace Loueur",
            contact: "Assistance",
            bookNow: "Réserver",
        },
        search: {
            sameReturn: "Restitution au même endroit",
            oneWay: "Aller simple (+ frais)",
            allGearboxes: "Toutes boîtes",
            autoOnly: "Boîte Automatique",
            zeroDepositOnly: "Zéro caution uniquement",
            noDepositHoldNotice: "Pas d'empreinte de 1 500 € • Débit & Cash acceptés",
            pickupLocation: "Lieu de prise en charge",
            dropoffLocation: "Lieu de restitution",
            pickupPlaceholder: "Choisir un aéroport ou une ville...",
            pickupDate: "Date de départ",
            returnDate: "Date de retour",
            daysCount: "jours",
            ctaButton: "Voir les voitures disponibles",
            searchingBtn: "Recherche en cours...",
            noDepositPill: "Zéro caution CB bloquée",
            exactModelPill: "Modèle exact garanti",
            airportDeliveryPill: "Livraison aéroport & riad offerte",
            freeCancellationPill: "Annulation gratuite jusqu'à 48h",
        },
        catalog: {
            title: "Flotte Réelle & Tarifs Transparents",
            subtitle: "Modèles garantis, révisés pour le climat marocain et livrés sans attente à l'aéroport ou à votre riad.",
            all: "Tous les véhicules",
            seats: "pl.",
            luggage: "bag.",
            manual: "Manuelle",
            automatic: "Automatique",
            petrol: "Essence",
            diesel: "Diesel",
            depositPill: "Caution 0€ ou 300€",
            zeroExcessPill: "Option 0€ Caution",
            fromPerDay: "par jour",
            totalEstimate: "Estimation séjour",
            bookCar: "Réserver",
            viewDetails: "Fiche & Détails",
            verifiedPartner: "Partenaire Vérifié",
        },
        bookingWidget: {
            guaranteedRate: "Tarif Garanti Partenaire",
            partnerRate: "Tarif Garanti Partenaire",
            perDay: "jour",
            depositNoticeZero: "Caution : 0 € (Option Franchise Zéro active). Aucun blocage de 1 500 € sur votre carte. Cartes de débit & espèces acceptées.",
            depositNoticeStandard: "Caution : 300 € (restituée au retour). Aucun blocage abusif. Débit & espèces acceptés.",
            pickupLocationLabel: "Lieu de prise en charge",
            pickupDateLabel: "Début location",
            returnDateLabel: "Fin location",
            hubSheetLink: "Fiche {hub} →",
            pickupReturn: "Prise en charge & Restitution",
            sameAirportNotice: "Restitution au même endroit ou à votre Riad sans frais cachés.",
            fuelPolicy: "Politique Carburant : Same-to-Same",
            fuelPolicyDesc: "Vous rendez le véhicule avec le même niveau qu'au départ. Pas de surfacturation de plein.",
            pistePolicy: "Autorisation Pistes :",
            pistePolicyDesc: "Pistes carrossables menant aux hébergements et désert autorisées.",
            optionsTitle: "Options & Services Voyage",
            optionsSubtitle: "Sélectionnez vos options utiles. Modifiable sans frais avant la prise en charge.",
            breakdownTitle: "Détail du Tarif & Modalités",
            rentalBase: "Location du véhicule",
            selectedOptions: "Options sélectionnées",
            depositAtCounter: "Caution à la remise des clés",
            depositReturnedNote: "restituée immédiatement au retour",
            zeroDepositActive: "0 € (Option Franchise Zéro active)",
            payTodayStripe: "Acompte à régler aujourd'hui (Stripe)",
            payTodayNote: "Bloque définitivement le véhicule et vos options",
            balanceOnSite: "Solde à régler à l'agence (remise des clés) :",
            ctaProceed: "Continuer vers la Réservation",
            lockVehicleBtn: "Bloquer ce véhicule • Acompte {amount}",
            whatsappAvailabilityBtn: "Demander disponibilité sur WhatsApp",
            freeCancellationNotice: "Annulation sans frais jusqu'à 48h",
            stripeNotice: "Paiement sécurisé par Stripe",
            brokerComparisonTitle: "Rappel transparence caution",
            brokerComparisonLegacy: "Courtiers classiques : Bloquent 1 500 € à 2 500 € sur carte de crédit physique obligatoire à l'arrivée.",
            brokerComparisonZwincar: "ZwinCar : 0 € de caution avec Franchise Zéro (ou 300 € en formule standard). Cartes de débit & espèces acceptées. Remise directe au parking.",
        },
        checkoutModal: {
            modalTitle: "Réservation Sécurisée & Modèle Garanti",
            depositSummaryZero: "0 € (Pack Franchise Zéro inclus)",
            depositSummaryStandard: "300 € (restitué en main propre au retour)",
            acceptedCardsNotice: "Cartes de débit & espèces acceptées",
            pickupLabel: "Prise en charge",
            returnLabel: "Restitution",
            fullNameLabel: "Nom & Prénom *",
            fullNamePlaceholder: "ex: Thomas Martin",
            phoneLabel: "WhatsApp / Téléphone *",
            phonePlaceholder: "+33 6 12 34 56 78",
            emailLabel: "Email de confirmation *",
            emailPlaceholder: "thomas@exemple.com",
            flightNumberLabel: "N° de Vol (Suivi de retard)",
            flightNumberPlaceholder: "ex: AF1234, TO4560, FR789",
            flightTrackNote: "Suivi en direct sur FlightRadar24. En cas de retard, l'agent vous attend sans supplément.",
            notesLabel: "Adresse de votre Riad / Précisions",
            notesPlaceholder: "Nom du Riad, porte Bab souhaitée ou demande particulière...",
            payStripeBtn: "Régler l'acompte et bloquer le véhicule",
            securePaymentNotice: "Paiement sécurisé par carte bancaire (Stripe 256-bit).",
            cancelFreeNotice: "Annulation gratuite jusqu'à 48h avant l'arrivée.",
        },
        sosModal: {
            badge: "Assistance Voyageur Maroc 24/7",
            title: "Numéros d'Urgence & Sécurité",
            tabNumbers: "Numéros Utiles",
            tabAccident: "En cas d'Accident",
            tabPolice: "Contrôles Routiers",
            freeCallNotice: "Numéros gratuits officiels accessibles depuis n'importe quel mobile au Maroc :",
            gendarmerie: "Gendarmerie Royale",
            gendarmerieDetail: "Routes nationales & hors agglomération",
            police: "Police / Sûreté Nationale",
            policeDetail: "En ville (Médina, Guéliz, Centre)",
            highway: "Assistance Autoroute",
            highwayDetail: "Autoroutes ADM (A1, A3, A7)",
            medical: "Protection Civile / SAMU",
            medicalDetail: "Secours médical & pompiers",
            conciergeTitle: "Astreinte Conciergerie ZwinCar 24/7",
            conciergeDesc: "Un voyant moteur, une clé égarée, un pneu crevé ou une question sur votre contrat ? Notre équipe locale intervient immédiatement.",
            conciergeBtn: "Contacter l'astreinte WhatsApp (+212 6 00 00 00 00)",
            closeBtn: "Fermer",
        },
        footer: {
            tagline: "Plateforme de réservation de voitures au Maroc auprès d'agences locales indépendantes vérifiées. Zéro caution bloquée sur carte de crédit.",
            supportNotice: "Assistance WhatsApp 24/7 pour nos conducteurs partout au Maroc.",
            networkTitle: "Notre Flotte",
            destinationsTitle: "Aéroports & Villes",
            transparencyTitle: "Transparence & Guides",
            rights: "ZwinCar.com • Tous droits réservés.",
            stripeSecure: "Paiement sécurisé par Stripe",
            whatsappAssist: "Assistance WhatsApp 24/7",
        },
    },
    en: {
        nav: {
            vehicles: "Cars",
            airports: "Airports & Cities",
            zeroDeposit: "No Credit Card Hold",
            guides: "Travel Guides",
            vendorSpace: "Partners",
            contact: "Support",
            bookNow: "Book Now",
        },
        search: {
            sameReturn: "Return to same location",
            oneWay: "One-way rental (+ fee)",
            allGearboxes: "All gearboxes",
            autoOnly: "Automatic only",
            zeroDepositOnly: "Zero deposit only",
            noDepositHoldNotice: "No €1,500 credit card hold • Debit cards & cash accepted",
            pickupLocation: "Pick-up Location",
            dropoffLocation: "Drop-off Location",
            pickupPlaceholder: "Select an airport or city...",
            pickupDate: "Pick-up Date",
            returnDate: "Drop-off Date",
            daysCount: "days",
            ctaButton: "View Available Cars",
            searchingBtn: "Searching available cars...",
            noDepositPill: "No €1,500 credit card freeze",
            exactModelPill: "Exact model guaranteed",
            airportDeliveryPill: "Free airport & riad delivery",
            freeCancellationPill: "Free cancellation up to 48h",
        },
        catalog: {
            title: "Real Fleet & Transparent Rates",
            subtitle: "Guaranteed models, inspected for Moroccan climate, delivered with zero waiting time at the airport or your riad.",
            all: "All Vehicles",
            seats: "seats",
            luggage: "bags",
            manual: "Manual",
            automatic: "Automatic",
            petrol: "Petrol",
            diesel: "Diesel",
            depositPill: "0€ or €300 Deposit",
            zeroExcessPill: "0€ Deposit Option",
            fromPerDay: "per day",
            totalEstimate: "Total estimated",
            bookCar: "Book Car",
            viewDetails: "Details & Specs",
            verifiedPartner: "Verified Partner",
        },
        bookingWidget: {
            guaranteedRate: "Guaranteed Partner Price",
            partnerRate: "Guaranteed Partner Rate",
            perDay: "day",
            depositNoticeZero: "Deposit: €0 (Zero-Excess option active). No €1,500 blocked on your card. Debit cards & cash accepted.",
            depositNoticeStandard: "Deposit: €300 (returned upon drop-off). No abusive card holds. Debit & cash accepted.",
            pickupLocationLabel: "Pick-up location",
            pickupDateLabel: "Pick-up date",
            returnDateLabel: "Drop-off date",
            hubSheetLink: "{hub} Guide →",
            pickupReturn: "Pick-up & Drop-off",
            sameAirportNotice: "Drop off at the same spot or your Riad with zero hidden surprises.",
            fuelPolicy: "Fuel Policy: Same-to-Same",
            fuelPolicyDesc: "Return the vehicle with the exact same fuel level. No prepaid tank markups.",
            pistePolicy: "Off-Road & Trail Permission:",
            pistePolicyDesc: "Accessible gravel tracks leading to hotels and desert camps officially permitted.",
            optionsTitle: "Travel Options & Extras",
            optionsSubtitle: "Select your optional add-ons. Fully amendable free of charge before pick-up.",
            breakdownTitle: "Price Breakdown & Terms",
            rentalBase: "Vehicle rental",
            selectedOptions: "Selected options",
            depositAtCounter: "Security deposit on arrival",
            depositReturnedNote: "returned immediately in cash on drop-off",
            zeroDepositActive: "€0 (Zero Excess option active)",
            payTodayStripe: "Down payment due today (Stripe)",
            payTodayNote: "Secures the vehicle and selected options",
            balanceOnSite: "Balance due on collection (to local partner):",
            ctaProceed: "Continue to Booking",
            lockVehicleBtn: "Lock this vehicle • Deposit {amount}",
            whatsappAvailabilityBtn: "Check availability on WhatsApp",
            freeCancellationNotice: "Free cancellation up to 48h",
            stripeNotice: "Secure payment powered by Stripe",
            brokerComparisonTitle: "Deposit transparency reminder",
            brokerComparisonLegacy: "Standard brokers: Block €1,500 to €2,500 on a mandatory physical credit card upon arrival.",
            brokerComparisonZwincar: "ZwinCar: €0 deposit with Zero-Excess (or €300 standard). Debit cards & cash accepted. Direct lot handover.",
        },
        checkoutModal: {
            modalTitle: "Secure Booking & Guaranteed Model",
            depositSummaryZero: "€0 (Zero Excess pack included)",
            depositSummaryStandard: "€300 (handed back in cash upon return)",
            acceptedCardsNotice: "Debit cards & cash fully accepted",
            pickupLabel: "Pick-up",
            returnLabel: "Drop-off",
            fullNameLabel: "Full Name *",
            fullNamePlaceholder: "e.g., John Smith",
            phoneLabel: "WhatsApp / Mobile *",
            phonePlaceholder: "+44 7123 456789",
            emailLabel: "Confirmation Email *",
            emailPlaceholder: "john@example.com",
            flightNumberLabel: "Flight Number (Delay Monitoring)",
            flightNumberPlaceholder: "e.g., BA1234, U28450, FR789",
            flightTrackNote: "Tracked live on FlightRadar24. In case of delay, our agent waits with no extra charge.",
            notesLabel: "Riad Name / Delivery Notes",
            notesPlaceholder: "Name of your Riad, preferred gate or special requests...",
            payStripeBtn: "Pay down-payment & lock vehicle",
            securePaymentNotice: "Secure online payment powered by Stripe (256-bit encryption).",
            cancelFreeNotice: "Free cancellation up to 48 hours prior to arrival.",
        },
        sosModal: {
            badge: "Morocco 24/7 Traveler Assistance",
            title: "Emergency Numbers & Road Safety",
            tabNumbers: "Helpline Numbers",
            tabAccident: "In Case of Accident",
            tabPolice: "Police Checkpoints",
            freeCallNotice: "Toll-free official emergency numbers from any mobile phone in Morocco:",
            gendarmerie: "Royal Gendarmerie",
            gendarmerieDetail: "Highways, rural roads & mountain passes",
            police: "National Police",
            policeDetail: "City centers (Medina, Guéliz, Downtown)",
            highway: "Motorway Roadside Rescue",
            highwayDetail: "ADM Tollways (A1, A3, A7)",
            medical: "Civil Protection / Ambulance",
            medicalDetail: "Emergency paramedic & fire rescue",
            conciergeTitle: "24/7 ZwinCar Concierge On-Call",
            conciergeDesc: "A dashboard warning light, a flat tire, misplaced keys or an insurance question? Our local team assists you immediately.",
            conciergeBtn: "Open WhatsApp Support (+212 6 00 00 00 00)",
            closeBtn: "Close",
        },
        footer: {
            tagline: "The premier car rental booking platform in Morocco with verified local independent agencies. Zero abusive credit card holds.",
            supportNotice: "24/7 English-speaking WhatsApp support throughout Morocco.",
            networkTitle: "Our Fleet",
            destinationsTitle: "Airports & Cities",
            transparencyTitle: "Transparency & Guides",
            rights: "ZwinCar.com • All rights reserved.",
            stripeSecure: "Secure payment by Stripe",
            whatsappAssist: "24/7 WhatsApp Support",
        },
    },
    es: {
        nav: {
            vehicles: "Coches",
            airports: "Aeropuertos y Ciudades",
            zeroDeposit: "Sin Fianza de Tarjeta",
            guides: "Guías de Viaje",
            vendorSpace: "Socios",
            contact: "Asistencia",
            bookNow: "Reservar",
        },
        search: {
            sameReturn: "Devolver en el mismo lugar",
            oneWay: "Solo ida (+ suplemento)",
            allGearboxes: "Todas las cajas",
            autoOnly: "Solo Automático",
            zeroDepositOnly: "Solo sin fianza",
            noDepositHoldNotice: "Sin bloqueo de 1.500 € en tarjeta • Débito y efectivo aceptados",
            pickupLocation: "Punto de recogida",
            dropoffLocation: "Punto de devolución",
            pickupPlaceholder: "Seleccione un aeropuerto o ciudad...",
            pickupDate: "Fecha de salida",
            returnDate: "Fecha de devolución",
            daysCount: "días",
            ctaButton: "Ver coches disponibles",
            searchingBtn: "Buscando coches disponibles...",
            noDepositPill: "Sin retención de 1.500 € en tarjeta",
            exactModelPill: "Modelo exacto garantizado",
            airportDeliveryPill: "Entrega gratuita en aeropuerto y riad",
            freeCancellationPill: "Cancelación gratuita hasta 48h",
        },
        catalog: {
            title: "Flota Real y Precios Transparentes",
            subtitle: "Modelos garantizados, revisados para el clima de Marruecos y entregados sin colas en el aeropuerto o en su riad.",
            all: "Todos los coches",
            seats: "plazas",
            luggage: "maletas",
            manual: "Manual",
            automatic: "Automático",
            petrol: "Gasolina",
            diesel: "Diésel",
            depositPill: "Fianza 0€ o 300€",
            zeroExcessPill: "Opción 0€ Fianza",
            fromPerDay: "por día",
            totalEstimate: "Total estimado",
            bookCar: "Reservar",
            viewDetails: "Detalles y Ficha",
            verifiedPartner: "Socio Verificado",
        },
        bookingWidget: {
            guaranteedRate: "Tarifa Garantizada de Socio",
            partnerRate: "Tarifa Garantizada de Socio",
            perDay: "día",
            depositNoticeZero: "Fianza: 0 € (Opción Franquicia Cero activa). Sin bloqueo de 1.500 € en tarjeta. Débito y efectivo aceptados.",
            depositNoticeStandard: "Fianza: 300 € (devuelta al entregar). Sin bloqueos abusivos. Débito y efectivo aceptados.",
            pickupLocationLabel: "Lugar de recogida",
            pickupDateLabel: "Fecha de recogida",
            returnDateLabel: "Fecha de devolución",
            hubSheetLink: "Guía {hub} →",
            pickupReturn: "Recogida y Devolución",
            sameAirportNotice: "Devolución en el mismo punto o en su Riad sin costes ocultos.",
            fuelPolicy: "Política de Combustible: Mismo a Mismo",
            fuelPolicyDesc: "Devuelve el coche con el mismo nivel de combustible. Sin recargos abusivos de depósito.",
            pistePolicy: "Autorización de Pistas:",
            pistePolicyDesc: "Pistas transitables a hoteles y campamentos del desierto autorizadas.",
            optionsTitle: "Opciones y Extras de Viaje",
            optionsSubtitle: "Seleccione sus extras. Modificables sin coste antes de la recogida.",
            breakdownTitle: "Desglose de Tarifas y Condiciones",
            rentalBase: "Alquiler de vehículo",
            selectedOptions: "Opciones seleccionadas",
            depositAtCounter: "Fianza en la entrega",
            depositReturnedNote: "devuelta en mano inmediatamente a la entrega",
            zeroDepositActive: "0 € (Opción Franquicia Cero activa)",
            payTodayStripe: "Anticipo a pagar hoy (Stripe)",
            payTodayNote: "Bloquea definitivamente el coche y sus opciones",
            balanceOnSite: "Saldo a pagar a la agencia local (en mano):",
            ctaProceed: "Continuar con la Reserva",
            lockVehicleBtn: "Reservar este coche • Anticipo {amount}",
            whatsappAvailabilityBtn: "Consultar disponibilidad por WhatsApp",
            freeCancellationNotice: "Cancelación gratuita hasta 48h",
            stripeNotice: "Pago seguro con Stripe",
            brokerComparisonTitle: "Recordatorio de transparencia de fianza",
            brokerComparisonLegacy: "Brokers habituales: Bloquean de 1.500 € a 2.500 € en tarjeta de crédito física obligatoria a la llegada.",
            brokerComparisonZwincar: "ZwinCar: 0 € de fianza con Franquicia Cero (o 300 € estándar). Débito y efectivo aceptados. Entrega directa en parking.",
        },
        checkoutModal: {
            modalTitle: "Reserva Segura y Modelo Garantizado",
            depositSummaryZero: "0 € (Pack Franquicia Cero incluido)",
            depositSummaryStandard: "300 € (devueltos en mano a la devolución)",
            acceptedCardsNotice: "Tarjetas de débito y efectivo totalmente aceptados",
            pickupLabel: "Recogida",
            returnLabel: "Devolución",
            fullNameLabel: "Nombre y Apellidos *",
            fullNamePlaceholder: "ej: Carlos García",
            phoneLabel: "WhatsApp / Teléfono *",
            phonePlaceholder: "+34 612 345 678",
            emailLabel: "Email de confirmación *",
            emailPlaceholder: "carlos@ejemplo.com",
            flightNumberLabel: "Nº de Vuelo (Seguimiento de retrasos)",
            flightNumberPlaceholder: "ej: IB3340, VY7350, FR123",
            flightTrackNote: "Monitoreo en vivo con FlightRadar24. En caso de retraso, nuestro agente le espera sin coste.",
            notesLabel: "Nombre del Riad / Detalles",
            notesPlaceholder: "Nombre de su Riad, puerta de la medina o peticiones especiales...",
            payStripeBtn: "Pagar anticipo y bloquear vehículo",
            securePaymentNotice: "Pago seguro con tarjeta bancaria mediante Stripe (encriptación de 256 bits).",
            cancelFreeNotice: "Cancelación gratuita hasta 48 horas antes de la llegada.",
        },
        sosModal: {
            badge: "Asistencia al Viajero en Marruecos 24/7",
            title: "Teléfonos de Urgencia y Seguridad Vial",
            tabNumbers: "Teléfonos Útiles",
            tabAccident: "En Caso de Accidente",
            tabPolice: "Controles Policiales",
            freeCallNotice: "Teléfonos de emergencia oficiales y gratuitos desde cualquier móvil en Marruecos:",
            gendarmerie: "Gendarmería Real",
            gendarmerieDetail: "Carreteras nacionales, autopistas y zonas rurales",
            police: "Policía Nacional",
            policeDetail: "En ciudad (Medina, Guéliz, Centro)",
            highway: "Asistencia en Autopista",
            highwayDetail: "Autopistas ADM (A1, A3, A7)",
            medical: "Protección Civil / SAMU",
            medicalDetail: "Emergencias sanitarias y bomberos",
            conciergeTitle: "Guardia de Conserjería ZwinCar 24/7",
            conciergeDesc: "¿Un testigo en el panel, una rueda pinchada, llaves extraviadas o una duda del seguro? Nuestro equipo local responde de inmediato.",
            conciergeBtn: "Contactar por WhatsApp (+212 6 00 00 00 00)",
            closeBtn: "Cerrar",
        },
        footer: {
            tagline: "Plataforma de reserva de vehículos en Marruecos con agencias locales independientes verificadas. Sin retenciones abusivas en tarjeta de crédito.",
            supportNotice: "Asistencia WhatsApp en español 24/7 en todo Marruecos.",
            networkTitle: "Nuestra Flota",
            destinationsTitle: "Aeropuertos y Ciudades",
            transparencyTitle: "Transparencia y Guías",
            rights: "ZwinCar.com • Todos los derechos reservados.",
            stripeSecure: "Pago seguro con Stripe",
            whatsappAssist: "Asistencia WhatsApp 24/7",
        },
    },
    nl: {
        nav: {
            vehicles: "Auto's",
            airports: "Luchthavens & Steden",
            zeroDeposit: "Geen Creditcard Borg",
            guides: "Reisgidsen",
            vendorSpace: "Partners",
            contact: "Klantenservice",
            bookNow: "Nu Boeken",
        },
        search: {
            sameReturn: "Inleveren op dezelfde locatie",
            oneWay: "Enkele reis (+ toeslag)",
            allGearboxes: "Alle transmissies",
            autoOnly: "Alleen automaat",
            zeroDepositOnly: "Alleen zonder borg",
            noDepositHoldNotice: "Geen blokkade van € 1.500 op creditcard • Betaalpas & contant geaccepteerd",
            pickupLocation: "Ophaallocatie",
            dropoffLocation: "Inleverlocatie",
            pickupPlaceholder: "Kies een luchthaven of stad...",
            pickupDate: "Ophaaldatum",
            returnDate: "Inleverdatum",
            daysCount: "dagen",
            ctaButton: "Bekijk beschikbare auto's",
            searchingBtn: "Beschikbaarheid controleren...",
            noDepositPill: "Geen €1.500 creditcard blokkade",
            exactModelPill: "Exact model gegarandeerd",
            airportDeliveryPill: "Gratis levering op luchthaven & riad",
            freeCancellationPill: "Gratis annuleren tot 48 uur",
        },
        catalog: {
            title: "Echte Vloot & Eerlijke Prijzen",
            subtitle: "Gegarandeerde modellen, gecontroleerd voor het Marokkaanse klimaat en zonder wachttijd afgeleverd.",
            all: "Alle Voertuigen",
            seats: "zitpl.",
            luggage: "koffers",
            manual: "Handgeschakeld",
            automatic: "Automaat",
            petrol: "Benzine",
            diesel: "Diesel",
            depositPill: "0€ of €300 Borg",
            zeroExcessPill: "0€ Borg Optie",
            fromPerDay: "per dag",
            totalEstimate: "Geschat totaal",
            bookCar: "Reserveren",
            viewDetails: "Details & Specificaties",
            verifiedPartner: "Geverifieerde Partner",
        },
        bookingWidget: {
            guaranteedRate: "Gegarandeerde Partnerprijs",
            partnerRate: "Gegarandeerd Partnertarief",
            perDay: "dag",
            depositNoticeZero: "Borg: € 0 (Geen Eigen Risico actief). Geen blokkade van € 1.500 op creditcard. Betaalpas & contant geaccepteerd.",
            depositNoticeStandard: "Borg: € 300 (terugbetaald bij inlevering). Geen oneerlijke blokkades. Betaalpas & contant geaccepteerd.",
            pickupLocationLabel: "Ophaallocatie",
            pickupDateLabel: "Ophaaldatum",
            returnDateLabel: "Inleverdatum",
            hubSheetLink: "{hub} Gids →",
            pickupReturn: "Ophalen & Inleveren",
            sameAirportNotice: "Inleveren op dezelfde locatie of bij uw riad zonder verborgen kosten.",
            fuelPolicy: "Brandstofbeleid: Same-to-Same",
            fuelPolicyDesc: "Lever de auto in met hetzelfde brandstofniveau. Geen dure verplichte tankkosten.",
            pistePolicy: "Off-Road & Pistes:",
            pistePolicyDesc: "Toegankelijke grindwegen naar hotels en woestijnkampen officieel toegestaan.",
            optionsTitle: "Reisopties & Extra's",
            optionsSubtitle: "Kies uw extra opties. Kosteloos aanpasbaar vóór het ophalen.",
            breakdownTitle: "Prijsoverzicht & Voorwaarden",
            rentalBase: "Autohuur",
            selectedOptions: "Geselecteerde opties",
            depositAtCounter: "Borg bij aflevering",
            depositReturnedNote: "direct contant geretourneerd bij inlevering",
            zeroDepositActive: "€0 (Nul-Eigen-Risico optie actief)",
            payTodayStripe: "Aanbetaling vandaag (Stripe)",
            payTodayNote: "Blokkeert definitief het voertuig en uw opties",
            balanceOnSite: "Restant te betalen bij aflevering (aan lokale partner):",
            ctaProceed: "Verder naar Reservering",
            lockVehicleBtn: "Auto reserveren • Aanbetaling {amount}",
            whatsappAvailabilityBtn: "Beschikbaarheid vragen via WhatsApp",
            freeCancellationNotice: "Gratis annuleren tot 48 uur",
            stripeNotice: "Veilige betaling via Stripe",
            brokerComparisonTitle: "Transparantie over borgsommen",
            brokerComparisonLegacy: "Klassieke brokers: Blokkeren € 1.500 tot € 2.500 op verplichte fysieke creditcard bij aankomst.",
            brokerComparisonZwincar: "ZwinCar: € 0 borg met Geen Eigen Risico (of € 300 standaard). Betaalpas & contant geaccepteerd. Directe overdracht op parking.",
        },
        checkoutModal: {
            modalTitle: "Veilige Boeking & Gegarandeerd Model",
            depositSummaryZero: "€0 (Nul-Eigen-Risico pakket inbegrepen)",
            depositSummaryStandard: "€300 (contant terugbetaald bij inlevering)",
            acceptedCardsNotice: "Betaalpassen (pin) & contant volledig geaccepteerd",
            pickupLabel: "Ophalen",
            returnLabel: "Inleveren",
            fullNameLabel: "Volledige Naam *",
            fullNamePlaceholder: "bijv. Daan Bakker",
            phoneLabel: "WhatsApp / Mobiel *",
            phonePlaceholder: "+31 6 12345678",
            emailLabel: "Bevestigingsmail *",
            emailPlaceholder: "daan@voorbeeld.nl",
            flightNumberLabel: "Vluchtnummer (Vluchtmonitoring)",
            flightNumberPlaceholder: "bijv. HV5678, KL1234, FR890",
            flightTrackNote: "Live gevolgd via FlightRadar24. Bij vertraging wacht onze agent kosteloos op u.",
            notesLabel: "Naam Riad / Aanwijzingen",
            notesPlaceholder: "Naam van uw riad, gewenste stadspoort of verzoeken...",
            payStripeBtn: "Aanbetaling voldoen & auto vastleggen",
            securePaymentNotice: "Veilig online betalen via Stripe (256-bit encryptie).",
            cancelFreeNotice: "Kosteloos annuleren tot 48 uur voor aankomst.",
        },
        sosModal: {
            badge: "24/7 Reishulp Marokko",
            title: "Noodnummers & Verkeersveiligheid",
            tabNumbers: "Handige Nummers",
            tabAccident: "Bij Ongeval",
            tabPolice: "Politiecontroles",
            freeCallNotice: "Gratis officiële noodnummers vanaf elke mobiele telefoon in Marokko:",
            gendarmerie: "Koninklijke Gendarmerie",
            gendarmerieDetail: "Snelwegen, provinciale wegen & bergen",
            police: "Nationale Politie",
            policeDetail: "In de stad (Medina, Guéliz, Centrum)",
            highway: "Pechhulp Snelweg (ADM)",
            highwayDetail: "Tolwegen A1, A3, A7",
            medical: "Ambulance / Brandweer",
            medicalDetail: "Medische noodgevallen",
            conciergeTitle: "24/7 ZwinCar Conciërge Bereikbaar",
            conciergeDesc: "Een waarschuwingslampje, lekke band, verloren sleutels of een vraag over de verzekering? Ons lokale team helpt u direct.",
            conciergeBtn: "Open WhatsApp Klantenservice (+212 6 00 00 00 00)",
            closeBtn: "Sluiten",
        },
        footer: {
            tagline: "Het toonaangevende autoverhuurplatform in Marokko met onafhankelijke geverifieerde lokale partners. Geen oneerlijke creditcard borg.",
            supportNotice: "24/7 WhatsApp ondersteuning voor reizigers in heel Marokko.",
            networkTitle: "Onze Vloot",
            destinationsTitle: "Luchthavens & Steden",
            transparencyTitle: "Transparantie & Gidsen",
            rights: "ZwinCar.com • Alle rechten voorbehouden.",
            stripeSecure: "Veilig betalen via Stripe",
            whatsappAssist: "24/7 WhatsApp Klantenservice",
        },
    },
};

export function getTranslation(locale: string = "fr") {
    const validLocale = (SUPPORTED_LOCALES.includes(locale as Locale) ? locale : "fr") as Locale;
    return TRANSLATIONS[validLocale];
}

/**
 * Génère les URLs hreflang parfaites (bidirectionnelles) pour n'importe quelle page
 */
export function getHreflangAlternates(canonicalPath: {
    fr: string;
    en: string;
    es: string;
    nl: string;
}) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://zwincar.com";
    return {
        canonical: `${baseUrl}${canonicalPath.fr}`,
        languages: {
            "fr-FR": `${baseUrl}${canonicalPath.fr}`,
            "en-US": `${baseUrl}${canonicalPath.en}`,
            "es-ES": `${baseUrl}${canonicalPath.es}`,
            "nl-NL": `${baseUrl}${canonicalPath.nl}`,
            "x-default": `${baseUrl}${canonicalPath.en}`, // Default to English for international searchers
        },
    };
}
