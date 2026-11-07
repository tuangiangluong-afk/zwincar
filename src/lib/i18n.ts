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
            myVoucher: string;
            findBooking: string;
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
            orEquivalent: string;
            airportCounterBenchmark: string;
            freeUpgradeGuaranteed: string;
            freeDeliveryIncluded: string;
            savingsTotalTrip: string;
            longStayDiscountTag: string;
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
            longStayDiscountBadge: string;
            longStayDiscountBreakdown: string;
            partnerCheckStockBtn: string;
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
        pricingTiers: {
            includedPerksTitle: string;
            perkDelivery: string;
            perkMileage: string;
            perkModel: string;
            perkSupport: string;
            standardTitle: string;
            standardBadge: string;
            standardDesc: string;
            standardDepositLabel: string;
            serenityTitle: string;
            serenityBadge: string;
            serenityDesc: string;
            serenityDepositLabel: string;
            switchStandard: string;
            switchSerenity: string;
        };
        voucher: {
            confirmedBadge: string;
            voucherTitle: string;
            downloadPdf: string;
            print: string;
            sosButton: string;
            emailSentTo: string;
            resendEmail: string;
            resendSuccess: string;
            statusTitle: string;
            statusGuaranteed: string;
            statusCheckedIn: string;
            statusCompleted: string;
            statusCancelled: string;
            folderRef: string;
            pickup: string;
            returnDropoff: string;
            meetingPointTitle: string;
            customsAlertPrompt: string;
            customsAlertBtn: string;
            accountingTitle: string;
            depositPaidOnline: string;
            collectedByStripe: string;
            balanceDueOnSite: string;
            balancePaymentMethods: string;
            depositAtDelivery: string;
            depositZeroActive: string;
            depositReturnedAtCheckout: string;
            optionsIncluded: string;
            progressTitle: string;
            progressSubtitle: string;
            kycTitle: string;
            kycDesc: string;
            kycUploadBtn: string;
            kycUploading: string;
            kycUploadedSuccess: string;
            kycWhatsappBtn: string;
            kycPrivacyNote: string;
            flightTitle: string;
            flightSubtitle: string;
            flightRadarStatus: string;
            flightRadarOnTime: string;
            flightGuaranteeDesc: string;
            cautionProtocolTitle: string;
            cautionZeroDesc: string;
            cautionStandardDesc: string;
            sealedEnvelope1: string;
            sealedEnvelope2: string;
            sealedEnvelope3: string;
            esimTitle: string;
            esimSubtitle: string;
            esimActive: string;
            esimQrTitle: string;
            esimQrDesc: string;
        };
    }
> = {
    fr: {
        nav: {
            vehicles: "Véhicules",
            airports: "Aéroports & Villes",
            zeroDeposit: "Zéro Caution",
            guides: "Guides & Conseils",
            vendorSpace: "Espace Loueur",
            contact: "Assistance",
            bookNow: "Réserver",
            myVoucher: "Mon Bon",
            findBooking: "Retrouver ma réservation",
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
            exactModelPill: "Modèle ou équivalent garanti (surclassement offert)",
            airportDeliveryPill: "Livraison aéroport & riad offerte (Valeur 100 DH)",
            freeCancellationPill: "Annulation gratuite jusqu'à 48h",
        },
        catalog: {
            title: "Flotte Réelle & Tarifs Transparents",
            subtitle: "Modèles garantis ou équivalents même catégorie révisés pour le climat marocain, livrés sans attente à l'aéroport ou à votre riad.",
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
            orEquivalent: "ou modèle équivalent même catégorie",
            airportCounterBenchmark: "Tarif moyen comptoir aéroport",
            freeUpgradeGuaranteed: "Modèle garanti ou surclassement offert",
            freeDeliveryIncluded: "Livraison aéroport & riad offerte (Valeur 100 DH incluse)",
            savingsTotalTrip: "Économisez ~{amount} vs comptoir aéroport",
            longStayDiscountTag: "Remise Long Séjour ({discount}%)",
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
            payTodayStripe: "Acompte de réservation (après validation WhatsApp)",
            payTodayNote: "Aucun débit immédiat — Vous réglez l'acompte par lien Stripe sécurisé uniquement après confirmation agent.",
            balanceOnSite: "Solde à régler à l'agence (remise des clés) :",
            ctaProceed: "Continuer vers la Réservation",
            lockVehicleBtn: "Bloquer ce véhicule • Acompte {amount}",
            whatsappAvailabilityBtn: "Demander disponibilité sur WhatsApp",
            freeCancellationNotice: "Annulation sans frais jusqu'à 48h",
            stripeNotice: "Paiement sécurisé par Stripe",
            longStayDiscountBadge: "Remise Long Séjour : -{pct}% ({days} {daysCount})",
            longStayDiscountBreakdown: "Remise Long Séjour ({days} j. : -{pct}%)",
            partnerCheckStockBtn: "Voir les disponibilités aéroport (Partenaire)",
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
        pricingTiers: {
            includedPerksTitle: "Inclus d'Office dans Tous Nos Tarifs",
            perkDelivery: "Livraison Aéroport & Riad/Hôtel Offerte (Valeur 100 DH incluse)",
            perkMileage: "Kilométrage Illimité Inclus",
            perkModel: "Modèle Garanti ou Surclassement Offert",
            perkSupport: "Assistance VIP & Conciergerie WhatsApp 24/7",
            standardTitle: "Formule Standard",
            standardBadge: "Tarif Économique",
            standardDesc: "Caution 300 € (espèces ou carte débit). Restituée en main propre au retour sous protocole Enveloppe Scellée. Zéro empreinte de 1 500 €.",
            standardDepositLabel: "Caution 300 € (restituée au retour)",
            serenityTitle: "Pack Sérénité 0 € Franchise",
            serenityBadge: "Le Choix Sérénité (Recommandé)",
            serenityDesc: "Caution 0 € absolue. Rachat total franchise rayures, bris de glace et pneus. Restitution express en 2 minutes sans formalités.",
            serenityDepositLabel: "Caution 0 € (Zéro blocage bancaire)",
            switchStandard: "Choisir Formule Standard (Caution 300€)",
            switchSerenity: "Activer Pack Sérénité (0€ Caution)",
        },
        voucher: {
            confirmedBadge: "Réservation Confirmée • Modèle Garanti",
            voucherTitle: "Voucher de Location",
            downloadPdf: "Télécharger en PDF",
            print: "Imprimer",
            sosButton: "SOS 24/7",
            emailSentTo: "Bon de réservation envoyé à",
            resendEmail: "Renvoyer l'email de confirmation",
            resendSuccess: "Email renvoyé avec succès !",
            statusTitle: "Statut du dossier",
            statusGuaranteed: "Véhicule Garanti & Prêt pour Livraison",
            statusCheckedIn: "En cours de location • Clés remises au client",
            statusCompleted: "Location clôturée • Caution restituée avec succès",
            statusCancelled: "Dossier annulé",
            folderRef: "Référence Dossier",
            pickup: "Prise en charge",
            returnDropoff: "Restitution",
            meetingPointTitle: "Point de rencontre exact :",
            customsAlertPrompt: "Valises récupérées ? Avertissez votre agent en 1 clic :",
            customsAlertBtn: "Je viens de sortir de la douane",
            accountingTitle: "Décompte Financier Transparent (Zéro Frais Caché)",
            depositPaidOnline: "Acompte Réglé en Ligne",
            collectedByStripe: "✓ Encaissé par Stripe",
            balanceDueOnSite: "Solde à Régler à l'Arrivée",
            balancePaymentMethods: "Espèces (EUR/MAD) ou Carte",
            depositAtDelivery: "Caution à la Livraison",
            depositZeroActive: "0 € (Pack Sérénité actif)",
            depositReturnedAtCheckout: "Restituée immédiatement au retour",
            optionsIncluded: "Options incluses :",
            progressTitle: "Pré-Check-in Express (80% complété)",
            progressSubtitle: "Plus qu'une étape pour votre remise des clés express sans guichet !",
            kycTitle: "Permis de Conduire & Pièce d'Identité",
            kycDesc: "Photographiez votre permis pour pré-imprimer votre contrat et récupérer vos clés en moins de 60 secondes au parking.",
            kycUploadBtn: "Prendre en photo / Téléverser mon permis",
            kycUploading: "Chiffrement et vérification sécurisée...",
            kycUploadedSuccess: "✓ Permis enregistré ! Votre contrat est pré-imprimé pour une remise immédiate au parking.",
            kycWhatsappBtn: "Envoyer mon permis sur WhatsApp au Loueur",
            kycPrivacyNote: "Données chiffrées de bout en bout et automatiquement supprimées 48h après la fin de la location.",
            flightTitle: "Suivi de Vol en Direct & Garantie Retard",
            flightSubtitle: "Vol :",
            flightRadarStatus: "Statut radar aéroportuaire :",
            flightRadarOnTime: "À l'heure • Atterrissage surveillé sur FlightRadar24",
            flightGuaranteeDesc: "Notre équipe locale surveille votre vol en continu sur FlightRadar24. En cas de retard de 1h, 2h ou 4h, votre véhicule reste garanti sans aucun frais supplémentaire.",
            cautionProtocolTitle: "Protocole de Caution Transparent & Zéro Litige",
            cautionZeroDesc: "Vous êtes 100% couvert par le Pack Sérénité ZwinCar. Aucun dépôt de garantie ne vous sera demandé sur le parking. Restitution en 2 minutes chrono.",
            cautionStandardDesc: "Comment se passe la caution de 300 € à la remise des clés ?",
            sealedEnvelope1: "1. Enveloppe Scellée : Vos 300 € (cash ou dirhams) sont placés dans une enveloppe ZwinCar scellée et signée sur le rabat.",
            sealedEnvelope2: "2. Zéro Débit Bancaire : L'enveloppe reste sous scellé dans le coffre de l'agence. Rien n'est débité sur votre carte.",
            sealedEnvelope3: "3. Restitution Immédiate : Au retour, après le tour du véhicule (2 min), l'enveloppe scellée vous est rendue intacte en main propre.",
            esimTitle: "eSIM Maroc 20 Go 5G (Réseau Maroc Telecom / Orange)",
            esimSubtitle: "Connexion data haut débit instantanée dès l'atterrissage sur le tarmac",
            esimActive: "Activée & Prête",
            esimQrTitle: "Votre QR Code d'activation eSIM Maroc",
            esimQrDesc: "Scannez ce QR Code dans les réglages de votre téléphone : Réglages > Données cellulaires > Ajouter une eSIM.",
        },
    },
    en: {
        nav: {
            vehicles: "Cars",
            airports: "Airports & Cities",
            zeroDeposit: "Zero Deposit",
            guides: "Travel Guides",
            vendorSpace: "Partners",
            contact: "Support",
            bookNow: "Book Now",
            myVoucher: "My Voucher",
            findBooking: "Find my booking",
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
            exactModelPill: "Model or equivalent guaranteed (free upgrade)",
            airportDeliveryPill: "Free airport & riad delivery (100 MAD value)",
            freeCancellationPill: "Free cancellation up to 48h",
        },
        catalog: {
            title: "Real Fleet & Transparent Rates",
            subtitle: "Guaranteed models or equivalent category inspected for Moroccan climate, delivered with zero waiting time at the airport or your riad.",
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
            orEquivalent: "or equivalent model in same category",
            airportCounterBenchmark: "Airport counter average rate",
            freeUpgradeGuaranteed: "Guaranteed model or free upgrade",
            freeDeliveryIncluded: "Free airport & riad delivery (100 MAD value included)",
            savingsTotalTrip: "Save ~{amount} vs airport counter",
            longStayDiscountTag: "Long Stay Discount ({discount}%)",
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
            payTodayStripe: "Reservation deposit (after WhatsApp confirmation)",
            payTodayNote: "No immediate charge — Pay via secure Stripe link only after agent confirms availability.",
            balanceOnSite: "Balance due on collection (to local partner):",
            ctaProceed: "Continue to Booking",
            lockVehicleBtn: "Lock this vehicle • Deposit {amount}",
            whatsappAvailabilityBtn: "Check availability on WhatsApp",
            freeCancellationNotice: "Free cancellation up to 48h",
            stripeNotice: "Secure payment powered by Stripe",
            longStayDiscountBadge: "Long Stay Discount: -{pct}% ({days} {daysCount})",
            longStayDiscountBreakdown: "Long Stay Discount ({days} d. : -{pct}%)",
            partnerCheckStockBtn: "Check Airport Availability (Partner)",
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
        pricingTiers: {
            includedPerksTitle: "Included as Standard in All Our Rates",
            perkDelivery: "Free Airport & Riad/Hotel Delivery (100 MAD value included)",
            perkMileage: "Unlimited Mileage Included",
            perkModel: "Guaranteed Model or Free Upgrade",
            perkSupport: "24/7 VIP WhatsApp Concierge & Support",
            standardTitle: "Standard Formula",
            standardBadge: "Value Rate",
            standardDesc: "Low €300 deposit (cash or debit card). Returned in hand upon checkout under Sealed Envelope protocol. Zero €1,500 bank hold.",
            standardDepositLabel: "€300 Deposit (returned at checkout)",
            serenityTitle: "Serenity Pack €0 Excess",
            serenityBadge: "Peace of Mind (Recommended)",
            serenityDesc: "Strict €0 deposit required. Zero deductible for scratches, glass, and tires. 2-minute express key return.",
            serenityDepositLabel: "€0 Deposit (Zero card hold)",
            switchStandard: "Choose Standard Formula (€300 deposit)",
            switchSerenity: "Enable Serenity Pack (€0 deposit)",
        },
        voucher: {
            confirmedBadge: "Booking Confirmed • Guaranteed Model",
            voucherTitle: "Rental Voucher",
            downloadPdf: "Download PDF",
            print: "Print",
            sosButton: "SOS 24/7",
            emailSentTo: "Booking voucher sent to",
            resendEmail: "Resend confirmation email",
            resendSuccess: "Email resent successfully!",
            statusTitle: "Booking Status",
            statusGuaranteed: "Vehicle Guaranteed & Ready for Delivery",
            statusCheckedIn: "Active Rental • Keys Handed to Customer",
            statusCompleted: "Rental Completed • Deposit Returned Successfully",
            statusCancelled: "Booking Cancelled",
            folderRef: "Booking Reference",
            pickup: "Pick-up",
            returnDropoff: "Drop-off",
            meetingPointTitle: "Exact meeting point:",
            customsAlertPrompt: "Luggage collected? Notify your coordinator in 1 click:",
            customsAlertBtn: "I just exited customs",
            accountingTitle: "Transparent Financial Breakdown (Zero Hidden Fees)",
            depositPaidOnline: "Deposit Paid Online",
            collectedByStripe: "✓ Secured via Stripe",
            balanceDueOnSite: "Balance Due on Arrival",
            balancePaymentMethods: "Cash (EUR/MAD) or Card",
            depositAtDelivery: "Security Deposit at Delivery",
            depositZeroActive: "€0 (Serenity Pack active)",
            depositReturnedAtCheckout: "Returned immediately upon checkout",
            optionsIncluded: "Included options:",
            progressTitle: "Express Pre-Check-in (80% completed)",
            progressSubtitle: "Only one step left to collect your keys in 60 seconds with zero counter queue!",
            kycTitle: "Driver's License & ID",
            kycDesc: "Snap a photo of your driver's license to pre-print your contract and collect your car in under 60 seconds at the parking.",
            kycUploadBtn: "Take photo / Upload license",
            kycUploading: "Encrypting and verifying...",
            kycUploadedSuccess: "✓ License registered! Your contract is pre-printed for instant car collection.",
            kycWhatsappBtn: "Send license via WhatsApp to Coordinator",
            kycPrivacyNote: "End-to-end encrypted and automatically deleted 48 hours after rental completion.",
            flightTitle: "Live Flight Tracking & Delay Guarantee",
            flightSubtitle: "Flight:",
            flightRadarStatus: "Airport radar tracking:",
            flightRadarOnTime: "On Time • Landing monitored on FlightRadar24",
            flightGuaranteeDesc: "Our local team continuously tracks your flight on FlightRadar24. If your flight is delayed by 1h, 2h, or 4h, your car remains guaranteed with no extra fee.",
            cautionProtocolTitle: "Transparent Deposit Protocol & Zero Dispute",
            cautionZeroDesc: "You are 100% protected by the ZwinCar Serenity Pack. Zero deposit required upon arrival. 2-minute key return.",
            cautionStandardDesc: "How does the €300 deposit work at key delivery?",
            sealedEnvelope1: "1. Sealed Envelope: Your €300 (cash or dirhams) is placed inside a ZwinCar envelope, sealed and co-signed on the flap.",
            sealedEnvelope2: "2. Zero Bank Charge: The envelope is kept sealed inside the agency safe. Nothing is charged to your card.",
            sealedEnvelope3: "3. Immediate Hand-over: At checkout, after a quick 2-min vehicle walk-around, the sealed envelope is returned intact in your hands.",
            esimTitle: "Morocco eSIM 20 GB 5G (Maroc Telecom / Orange Network)",
            esimSubtitle: "Instant high-speed mobile data upon landing on the tarmac",
            esimActive: "Activated & Ready",
            esimQrTitle: "Your Morocco eSIM Activation QR Code",
            esimQrDesc: "Scan this QR code in your phone settings: Settings > Cellular > Add eSIM.",
        },
    },
    es: {
        nav: {
            vehicles: "Coches",
            airports: "Aeropuertos y Ciudades",
            zeroDeposit: "Cero Fianza",
            guides: "Guías de Viaje",
            vendorSpace: "Socios",
            contact: "Asistencia",
            bookNow: "Reservar",
            myVoucher: "Mi Bono",
            findBooking: "Buscar mi reserva",
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
            exactModelPill: "Modelo o equivalente garantizado (mejora gratis)",
            airportDeliveryPill: "Entrega gratis en aeropuerto y riad (Valor 100 DH)",
            freeCancellationPill: "Cancelación gratuita hasta 48h",
        },
        catalog: {
            title: "Flota Real y Precios Transparentes",
            subtitle: "Modelos garantizados o equivalente de misma categoría revisados para el clima de Marruecos, entregados sin colas en el aeropuerto o en su riad.",
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
            orEquivalent: "o modelo equivalente misma categoría",
            airportCounterBenchmark: "Tarifa media mostrador aeropuerto",
            freeUpgradeGuaranteed: "Modelo garantizado o mejora gratis",
            freeDeliveryIncluded: "Entrega gratis en aeropuerto y riad (Valor 100 DH incluido)",
            savingsTotalTrip: "Ahorre ~{amount} vs mostrador aeropuerto",
            longStayDiscountTag: "Descuento Larga Estancia ({discount}%)",
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
            payTodayStripe: "Anticipo de reserva (tras confirmación por WhatsApp)",
            payTodayNote: "Sin cargo inmediato — Pago por enlace Stripe seguro tras confirmación del agente.",
            balanceOnSite: "Saldo a pagar a la agencia local (en mano):",
            ctaProceed: "Continuar con la Reserva",
            lockVehicleBtn: "Reservar este coche • Anticipo {amount}",
            whatsappAvailabilityBtn: "Consultar disponibilidad por WhatsApp",
            freeCancellationNotice: "Cancelación gratuita hasta 48h",
            stripeNotice: "Pago seguro con Stripe",
            longStayDiscountBadge: "Descuento Larga Estancia: -{pct}% ({days} {daysCount})",
            longStayDiscountBreakdown: "Descuento Larga Estancia ({days} d. : -{pct}%)",
            partnerCheckStockBtn: "Ver disponibilidad aeropuerto (Socio)",
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
        pricingTiers: {
            includedPerksTitle: "Incluido de Serie en Todas Nuestras Tarifas",
            perkDelivery: "Entrega Gratis en Aeropuerto y Riad/Hotel (Valor 100 DH incluido)",
            perkMileage: "Kilometraje Ilimitado Incluido",
            perkModel: "Modelo Garantizado o Mejora Gratuita (Upgrade)",
            perkSupport: "Conserjería VIP y Asistencia WhatsApp 24/7",
            standardTitle: "Fórmula Estándar",
            standardBadge: "Tarifa Económica",
            standardDesc: "Fianza reducida de 300 € (efectivo o tarjeta de débito). Devuelta en mano al regreso bajo protocolo de Sobre Sellado. Sin retención de 1.500 €.",
            standardDepositLabel: "Fianza 300 € (devuelta a la entrega)",
            serenityTitle: "Pack Serenidad 0 € Franquicia",
            serenityBadge: "Máxima Tranquilidad (Recomendado)",
            serenityDesc: "Fianza de 0 € absoluta. Cobertura total de arañazos, lunas y neumáticos. Devolución de llaves en 2 minutos sin colas.",
            serenityDepositLabel: "Fianza 0 € (Sin retención bancaria)",
            switchStandard: "Elegir Fórmula Estándar (Fianza 300€)",
            switchSerenity: "Activar Pack Serenidad (0€ Fianza)",
        },
        voucher: {
            confirmedBadge: "Reserva Confirmada • Modelo Garantizado",
            voucherTitle: "Bono de Alquiler (Voucher)",
            downloadPdf: "Descargar en PDF",
            print: "Imprimir",
            sosButton: "SOS 24/7",
            emailSentTo: "Bono de reserva enviado a",
            resendEmail: "Reenviar correo de confirmación",
            resendSuccess: "¡Correo reenviado con éxito!",
            statusTitle: "Estado de la reserva",
            statusGuaranteed: "Vehículo Garantizado y Listo para Entrega",
            statusCheckedIn: "Alquiler en Curso • Llaves entregadas al cliente",
            statusCompleted: "Alquiler Finalizado • Fianza devuelta con éxito",
            statusCancelled: "Reserva cancelada",
            folderRef: "Referencia de Reserva",
            pickup: "Recogida",
            returnDropoff: "Devolución",
            meetingPointTitle: "Punto de encuentro exacto :",
            customsAlertPrompt: "¿Equipaje recogido? Avise a su agente en 1 clic :",
            customsAlertBtn: "Acabo de salir de la aduana",
            accountingTitle: "Desglose Financiero Transparente (Cero Costes Ocultos)",
            depositPaidOnline: "Anticipo Pagado Online",
            collectedByStripe: "✓ Procesado por Stripe",
            balanceDueOnSite: "Saldo Restante a la Llegada",
            balancePaymentMethods: "Efectivo (EUR/MAD) o Tarjeta",
            depositAtDelivery: "Fianza a la Entrega de Llaves",
            depositZeroActive: "0 € (Pack Serenidad activo)",
            depositReturnedAtCheckout: "Devuelta inmediatamente a la entrega",
            optionsIncluded: "Opciones incluidas :",
            progressTitle: "Pre-Check-in Exprés (80% completado)",
            progressSubtitle: "¡Solo un paso más para recoger sus llaves en 60 segundos sin pasar por ventanilla!",
            kycTitle: "Permiso de Conducir y Documento de Identidad",
            kycDesc: "Fotografíe su permiso para preimprimir el contrato y recoger su coche en menos de 60 segundos en el parking.",
            kycUploadBtn: "Tomar foto / Subir permiso",
            kycUploading: "Cifrado y verificación segura...",
            kycUploadedSuccess: "✓ ¡Permiso registrado! Su contrato está preimpreso para una entrega inmediata.",
            kycWhatsappBtn: "Enviar permiso por WhatsApp a la Agencia",
            kycPrivacyNote: "Datos cifrados de extremo a extremo y eliminados automáticamente 48h tras el alquiler.",
            flightTitle: "Seguimiento de Vuelo en Directo y Garantía de Retraso",
            flightSubtitle: "Vuelo :",
            flightRadarStatus: "Estado radar del aeropuerto :",
            flightRadarOnTime: "A tiempo • Aterrizaje supervisado en FlightRadar24",
            flightGuaranteeDesc: "Nuestro equipo local monitoriza su vuelo en directo en FlightRadar24. En caso de retraso de 1h, 2h o 4h, su vehículo queda garantizado sin recargo alguno.",
            cautionProtocolTitle: "Protocolo de Fianza Transparente y Cero Disputas",
            cautionZeroDesc: "Está 100% cubierto por el Pack Serenidad ZwinCar. No se le exigirá fianza en el parking. Devolución en 2 minutos.",
            cautionStandardDesc: "¿Cómo funciona la fianza de 300 € a la entrega de llaves ?",
            sealedEnvelope1: "1. Sobre Sellado : Sus 300 € (efectivo o dirhams) se colocan en un sobre ZwinCar precintado y firmado en la solapa.",
            sealedEnvelope2: "2. Cero Cobro Bancario : El sobre queda precintado en la caja fuerte de la agencia. Nada se carga en su tarjeta.",
            sealedEnvelope3: "3. Devolución Inmediata : A la devolución, tras revisar el coche (2 min), el sobre precintado se le devuelve intacto en mano.",
            esimTitle: "eSIM Marruecos 20 GB 5G (Red Maroc Telecom / Orange)",
            esimSubtitle: "Conexión de datos de alta velocidad inmediata al aterrizar",
            esimActive: "Activada y Lista",
            esimQrTitle: "Su Código QR de activación eSIM Marruecos",
            esimQrDesc: "Escanee este código QR en los ajustes de su teléfono : Ajustes > Datos móviles > Añadir eSIM.",
        },
    },
    nl: {
        nav: {
            vehicles: "Auto's",
            airports: "Luchthavens & Steden",
            zeroDeposit: "Zonder Borg",
            guides: "Reisgidsen",
            vendorSpace: "Partners",
            contact: "Klantenservice",
            bookNow: "Nu Boeken",
            myVoucher: "Mijn Voucher",
            findBooking: "Boeking opzoeken",
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
            exactModelPill: "Model of gelijkwaardig gegarandeerd (gratis upgrade)",
            airportDeliveryPill: "Gratis bezorging luchthaven & riad (Waarde 100 DH)",
            freeCancellationPill: "Gratis annuleren tot 48 uur",
        },
        catalog: {
            title: "Echte Vloot & Eerlijke Prijzen",
            subtitle: "Gegarandeerde modellen of gelijkwaardige categorie gecontroleerd voor het Marokkaanse klimaat en zonder wachttijd afgeleverd.",
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
            orEquivalent: "of gelijkwaardig model zelfde categorie",
            airportCounterBenchmark: "Gemiddelde luchthavenbalie prijs",
            freeUpgradeGuaranteed: "Gegarandeerd model of gratis upgrade",
            freeDeliveryIncluded: "Gratis levering luchthaven & riad (Waarde 100 DH inbegrepen)",
            savingsTotalTrip: "Bespaar ~{amount} vs luchthavenbalie",
            longStayDiscountTag: "Lang Verblijf Korting ({discount}%)",
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
            payTodayStripe: "Reserveringsaanbetaling (na WhatsApp-bevestiging)",
            payTodayNote: "Geen directe afschrijving — Betaal via beveiligde Stripe-link na bevestiging van agent.",
            balanceOnSite: "Restant te betalen bij aflevering (aan lokale partner):",
            ctaProceed: "Verder naar Reservering",
            lockVehicleBtn: "Auto reserveren • Aanbetaling {amount}",
            whatsappAvailabilityBtn: "Beschikbaarheid vragen via WhatsApp",
            freeCancellationNotice: "Gratis annuleren tot 48 uur",
            stripeNotice: "Veilige betaling via Stripe",
            longStayDiscountBadge: "Lang Verblijf Korting: -{pct}% ({days} {daysCount})",
            longStayDiscountBreakdown: "Lang Verblijf Korting ({days} d. : -{pct}%)",
            partnerCheckStockBtn: "Bekijk luchthaven beschikbaarheid (Partner)",
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
        pricingTiers: {
            includedPerksTitle: "Standaard Inbegrepen bij Al Onze Tarieven",
            perkDelivery: "Gratis Levering Luchthaven & Riad/Hotel (Waarde 100 DH inbegrepen)",
            perkMileage: "Onbeperkt Aantal Kilometers Inbegrepen",
            perkModel: "Gegarandeerd Model of Gratis Upgrade",
            perkSupport: "24/7 VIP WhatsApp Conciërge & Hulp",
            standardTitle: "Standaard Formule",
            standardBadge: "Voordelig Tarief",
            standardDesc: "Lage borg van € 300 (contant of pinpas). Ter plaatse direct contant geretourneerd onder Verzegelde Envelop protocol. Geen blokkade van € 1.500.",
            standardDepositLabel: "Borg € 300 (geretourneerd bij inlevering)",
            serenityTitle: "Serenity Pakket €0 Eigen Risico",
            serenityBadge: "Zorgeloos Reizen (Aanbevolen)",
            serenityDesc: "Strikte borg van € 0. Volledige dekking voor krassen, glasbreuk en banden. Sleutels inleveren in 2 minuten zonder wachttijd.",
            serenityDepositLabel: "Borg € 0 (Geen creditcardblokkade)",
            switchStandard: "Kies Standaard Formule (€ 300 borg)",
            switchSerenity: "Activeer Serenity Pakket (€ 0 borg)",
        },
        voucher: {
            confirmedBadge: "Reservering Bevestigd • Gegarandeerd Model",
            voucherTitle: "Huurvoucher",
            downloadPdf: "Download PDF",
            print: "Afdrukken",
            sosButton: "SOS 24/7",
            emailSentTo: "Reserveringsvoucher verzonden naar",
            resendEmail: "Bevestigingsmail opnieuw verzenden",
            resendSuccess: "E-mail succesvol opnieuw verzonden!",
            statusTitle: "Status van het dossier",
            statusGuaranteed: "Voertuig Gegarandeerd & Klaar voor Levering",
            statusCheckedIn: "Lopende Huur • Sleutels overhandigd aan klant",
            statusCompleted: "Huur Afgerond • Borg succesvol geretourneerd",
            statusCancelled: "Dossier geannuleerd",
            folderRef: "Dossierreferentie",
            pickup: "Ophalen",
            returnDropoff: "Inleveren",
            meetingPointTitle: "Exact ontmoetingspunt :",
            customsAlertPrompt: "Bagage opgehaald? Waarschuw uw contactpersoon in 1 klik :",
            customsAlertBtn: "Ik ben zojuist door de douane gekomen",
            accountingTitle: "Transparant Financieel Overzicht (Geen Verborgen Kosten)",
            depositPaidOnline: "Aanbetaling Online Voldaan",
            collectedByStripe: "✓ Beveiligd via Stripe",
            balanceDueOnSite: "Resterend Saldo bij Aankomst",
            balancePaymentMethods: "Contant (EUR/MAD) of Pinpas/Creditcard",
            depositAtDelivery: "Borg bij Sleuteloverdracht",
            depositZeroActive: "€ 0 (Serenity Pakket actief)",
            depositReturnedAtCheckout: "Direct geretourneerd bij inlevering",
            optionsIncluded: "Inbegrepen opties :",
            progressTitle: "Express Pre-Check-in (80% voltooid)",
            progressSubtitle: "Nog slechts één stap om uw sleutels binnen 60 seconden op te halen zonder balie-wachtrij!",
            kycTitle: "Rijbewijs & Identiteitsbewijs",
            kycDesc: "Maak een foto van uw rijbewijs om het contract vooraf in te vullen en uw wagen binnen 60 seconden op de parking mee te nemen.",
            kycUploadBtn: "Foto maken / Rijbewijs uploaden",
            kycUploading: "Beveiligde versleuteling en verificatie...",
            kycUploadedSuccess: "✓ Rijbewijs geregistreerd! Uw contract is vooraf ingevuld voor directe sleuteloverdracht.",
            kycWhatsappBtn: "Rijbewijs via WhatsApp sturen naar Verhuurder",
            kycPrivacyNote: "End-to-end versleuteld en automatisch verwijderd 48 uur na afloop van de huur.",
            flightTitle: "Live Vluchtvolging & Vertragingsgarantie",
            flightSubtitle: "Vlucht :",
            flightRadarStatus: "Luchthaven radarstatus :",
            flightRadarOnTime: "Op tijd • Landing gevolgd op FlightRadar24",
            flightGuaranteeDesc: "Ons lokale team volgt uw vlucht continu op FlightRadar24. Bij 1u, 2u of 4u vertraging blijft uw wagen gegarandeerd zonder extra kosten.",
            cautionProtocolTitle: "Transparant Borgprotocol & Nul Geschillen",
            cautionZeroDesc: "U bent 100% gedekt door het ZwinCar Serenity Pakket. Geen enkele borg vereist op de parking. Inleveren in 2 minuten.",
            cautionStandardDesc: "Hoe werkt de borg van € 300 bij sleuteloverdracht ?",
            sealedEnvelope1: "1. Verzegelde Envelop : Uw € 300 (contant of dirhams) wordt in een ZwinCar-envelop geplaatst, verzegeld en medeondertekend.",
            sealedEnvelope2: "2. Geen Bankafschrijving : De envelop blijft verzegeld in de kluis van de verhuurder. Er wordt niets van uw rekening afgeschreven.",
            sealedEnvelope3: "3. Directe Teruggave : Bij inlevering, na een korte controle (2 min), ontvangt u de verzegelde envelop direct intact terug in eigen hand.",
            esimTitle: "Marokko eSIM 20 GB 5G (Maroc Telecom / Orange Netwerk)",
            esimSubtitle: "Directe supersnelle mobiele data zodra u landt op het asfalt",
            esimActive: "Geactiveerd & Klaar",
            esimQrTitle: "Uw Marokko eSIM Activatie QR-code",
            esimQrDesc: "Scan deze QR-code in uw telefooninstellingen : Instellingen > Mobiel netwerk > eSIM toevoegen.",
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
