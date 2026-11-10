/**
 * ZwinCar Pro — Dictionnaire i18n Bilingue (Français & Anglais)
 * Dédié à l'onboarding et à l'authentification des loueurs partenaires.
 */

export type VendorLocale = "fr" | "en";

export interface VendorTranslation {
    meta: {
        loginTitle: string;
        loginDesc: string;
        registerTitle: string;
        registerDesc: string;
    };
    common: {
        partnerCert: string;
        alreadyPartner: string;
        login: string;
        becomePartner: string;
        brandPro: string;
        language: string;
    };
    login: {
        badge: string;
        title: string;
        subtitle: string;
        idLabel: string;
        idPlaceholder: string;
        pwdLabel: string;
        forgot: string;
        forgotWaText: string;
        pwdPlaceholder: string;
        showPwd: string;
        hidePwd: string;
        submit: string;
        loading: string;
        demoBtn: string;
        newAgency: string;
        createAccount: string;
        errEmptyId: string;
        errShortPwd: string;
        errGeneric: string;
        errNetwork: string;
    };
    register: {
        step1Badge: string;
        step2Badge: string;
        step1Title: string;
        step1Subtitle: string;
        agencyNameLabel: string;
        agencyNamePlaceholder: string;
        hubLabel: string;
        iceLabel: string;
        icePlaceholder: string;
        managerNameLabel: string;
        managerNamePlaceholder: string;
        whatsappLabel: string;
        whatsappPlaceholder: string;
        emailLabel: string;
        emailPlaceholder: string;
        passwordLabel: string;
        passwordPlaceholder: string;
        strength: {
            tooShort: string;
            medium: string;
            strong: string;
            excellent: string;
        };
        advancedToggle: string;
        rcLabel: string;
        rcPlaceholder: string;
        ifLabel: string;
        ifPlaceholder: string;
        ribLabel: string;
        ribPlaceholder: string;
        btnNext: string;
        step2Title: string;
        step2Subtitle: string;
        carModelLabel: string;
        plateLabel: string;
        platePlaceholder: string;
        priceLabel: string;
        priceUnit: string;
        charterText: string;
        btnBack: string;
        btnSubmit: string;
        btnSubmitting: string;
        footerTrust: string;
        popularModels: Array<{ name: string; defaultPrice: number; tag: string }>;
        errors: {
            agencyName: string;
            ice: string;
            managerName: string;
            whatsapp: string;
            email: string;
            password: string;
            plate: string;
            charter: string;
            network: string;
            generic: string;
        };
    };
}

export const VENDOR_I18N: Record<VendorLocale, VendorTranslation> = {
    fr: {
        meta: {
            loginTitle: "Connexion Loueur Partenaire • ZwinCar Maroc",
            loginDesc: "Espace d'administration et de gestion de flotte réservé aux agences locales partenaires ZwinCar au Maroc.",
            registerTitle: "Devenir Loueur Partenaire au Maroc • ZwinCar",
            registerDesc: "Rejoignez le réseau d'agences locales partenaires ZwinCar au Maroc. Zéro caution abusive, modèle exact garanti et réservations directes.",
        },
        common: {
            partnerCert: "Plateforme certifiée ZwinCar Pro • Réservé aux loueurs agréés au Maroc",
            alreadyPartner: "Déjà partenaire ?",
            login: "Connexion",
            becomePartner: "Devenir partenaire",
            brandPro: "ZwinCar Pro",
            language: "Langue",
        },
        login: {
            badge: "Espace Pro Loueurs",
            title: "Connexion Agence",
            subtitle: "Gérez vos livraisons aéroport et votre flotte en temps réel.",
            idLabel: "Email ou Numéro WhatsApp",
            idPlaceholder: "contact@agence.ma ou +212 6...",
            pwdLabel: "Mot de passe",
            forgot: "Oublié ?",
            forgotWaText: "Bonjour ZwinCar, j'ai oublié mon mot de passe agence",
            pwdPlaceholder: "••••••••••••",
            showPwd: "Afficher le mot de passe",
            hidePwd: "Masquer le mot de passe",
            submit: "Se connecter",
            loading: "Connexion en cours...",
            demoBtn: "Tester avec le compte démo Atlas Drive (1 clic)",
            newAgency: "Nouvelle agence ?",
            createAccount: "Créer mon compte agence",
            errEmptyId: "Veuillez renseigner votre email ou numéro WhatsApp.",
            errShortPwd: "Le mot de passe doit comporter au moins 8 caractères.",
            errGeneric: "Identifiants incorrects ou agence introuvable.",
            errNetwork: "Impossible de contacter le serveur. Vérifiez votre connexion.",
        },
        register: {
            step1Badge: "Agence & Contact",
            step2Badge: "Premier Véhicule",
            step1Title: "Inscrire votre Agence",
            step1Subtitle: "Accédez aux clients arrivant aux aéroports marocains sans intermédiaire.",
            agencyNameLabel: "Nom de l'agence *",
            agencyNamePlaceholder: "Ex: Atlas Drive Cars SARL",
            hubLabel: "Aéroport / Hub principal *",
            iceLabel: "Numéro ICE (15 chiffres) *",
            icePlaceholder: "002847192000084",
            managerNameLabel: "Nom & Prénom du Gérant *",
            managerNamePlaceholder: "Karim Benjelloun",
            whatsappLabel: "Numéro WhatsApp Direct *",
            whatsappPlaceholder: "+212 6 61 23 45 67",
            emailLabel: "Email de Connexion *",
            emailPlaceholder: "contact@agence.ma",
            passwordLabel: "Mot de passe (min 12 car.) *",
            passwordPlaceholder: "••••••••••••",
            strength: {
                tooShort: "Min. 12 caractères",
                medium: "Moyen",
                strong: "Robuste",
                excellent: "Excellent",
            },
            advancedToggle: "Informations fiscales & bancaires (RC, IF, RIB) • Optionnel",
            rcLabel: "RC & Ville",
            rcPlaceholder: "94821 / Marrakech",
            ifLabel: "Identifiant Fiscal (IF)",
            ifPlaceholder: "40182934",
            ribLabel: "RIB (24 Chiffres)",
            ribPlaceholder: "011 780 0000...",
            btnNext: "Continuer vers le premier véhicule",
            step2Title: "Votre Premier Véhicule",
            step2Subtitle: "Ajoutez une première voiture pour activer instantanément votre tableau de bord.",
            carModelLabel: "Modèle du véhicule *",
            plateLabel: "Plaque d'immatriculation *",
            platePlaceholder: "Ex: 45821-B-26 ou WW...",
            priceLabel: "Tarif indicatif journalier (MAD)",
            priceUnit: "DH / jour",
            charterText: "Je certifie que mon agence est immatriculée au Maroc et m'engage à honorer les livraisons réservées avec transparence (aucun frais caché au client, véhicule conforme).",
            btnBack: "Retour",
            btnSubmit: "Valider et Accéder à mon Espace",
            btnSubmitting: "Création du compte...",
            footerTrust: "Agrément Partenaire Loueur ZwinCar Maroc • Vérification sous 24h",
            popularModels: [
                { name: "Dacia Sandero Stepway", defaultPrice: 280, tag: "Le plus loué" },
                { name: "Renault Clio 5 Automatique", defaultPrice: 330, tag: "Automatique" },
                { name: "Dacia Duster 4x4 Prestige", defaultPrice: 390, tag: "SUV Pistes" },
                { name: "Peugeot 208 PureTech", defaultPrice: 270, tag: "Économique" },
                { name: "Hyundai Tucson BVA Luxe", defaultPrice: 590, tag: "SUV Premium" },
                { name: "Autre véhicule", defaultPrice: 300, tag: "" },
            ],
            errors: {
                agencyName: "Veuillez renseigner le nom de votre agence.",
                ice: "Numéro ICE invalide (au moins 8 chiffres requis au Maroc).",
                managerName: "Veuillez renseigner le nom du gérant ou responsable.",
                whatsapp: "Numéro WhatsApp valide requis pour recevoir les alertes de réservation.",
                email: "Veuillez renseigner un email professionnel valide.",
                password: "Le mot de passe doit comporter au moins 12 caractères.",
                plate: "Veuillez renseigner l'immatriculation du premier véhicule.",
                charter: "Veuillez accepter la charte de transparence ZwinCar.",
                network: "Connexion au serveur impossible. Vérifiez votre réseau.",
                generic: "Une erreur est survenue lors de l'inscription.",
            },
        },
    },
    en: {
        meta: {
            loginTitle: "Partner Car Rental Agency Login • ZwinCar Morocco",
            loginDesc: "Fleet management and booking dispatch portal reserved for verified local car rental agencies in Morocco.",
            registerTitle: "Become a Partner Rental Agency in Morocco • ZwinCar",
            registerDesc: "Join the verified Moroccan local rental network on ZwinCar. Zero deposit extortion, exact model guarantee and direct airport customer handovers.",
        },
        common: {
            partnerCert: "Certified ZwinCar Pro Platform • Authorized Moroccan Rental Agencies Only",
            alreadyPartner: "Already a partner?",
            login: "Sign In",
            becomePartner: "Become a Partner",
            brandPro: "ZwinCar Pro",
            language: "Language",
        },
        login: {
            badge: "Pro Agency Portal",
            title: "Partner Agency Login",
            subtitle: "Manage your airport handovers and vehicle fleet in real time.",
            idLabel: "Email or WhatsApp Number",
            idPlaceholder: "contact@agency.ma or +212 6...",
            pwdLabel: "Password",
            forgot: "Forgot?",
            forgotWaText: "Hello ZwinCar, I forgot my partner agency password",
            pwdPlaceholder: "••••••••••••",
            showPwd: "Show password",
            hidePwd: "Hide password",
            submit: "Sign In",
            loading: "Signing in...",
            demoBtn: "Try with Atlas Drive demo account (1 click)",
            newAgency: "New agency?",
            createAccount: "Register your agency",
            errEmptyId: "Please enter your email or WhatsApp number.",
            errShortPwd: "Password must be at least 8 characters.",
            errGeneric: "Invalid credentials or agency not found.",
            errNetwork: "Unable to reach server. Please check your network.",
        },
        register: {
            step1Badge: "Agency & Contact",
            step2Badge: "First Vehicle",
            step1Title: "Register your Agency",
            step1Subtitle: "Get direct booking handovers from arriving tourists at Moroccan airports.",
            agencyNameLabel: "Agency Name *",
            agencyNamePlaceholder: "Ex: Atlas Drive Cars SARL",
            hubLabel: "Main Airport / Hub *",
            iceLabel: "ICE Tax Number (15 digits) *",
            icePlaceholder: "002847192000084",
            managerNameLabel: "Manager Full Name *",
            managerNamePlaceholder: "Karim Benjelloun",
            whatsappLabel: "Direct WhatsApp Number *",
            whatsappPlaceholder: "+212 6 61 23 45 67",
            emailLabel: "Login Email *",
            emailPlaceholder: "contact@agency.ma",
            passwordLabel: "Password (min 12 chars) *",
            passwordPlaceholder: "••••••••••••",
            strength: {
                tooShort: "Min. 12 characters",
                medium: "Medium",
                strong: "Strong",
                excellent: "Excellent",
            },
            advancedToggle: "Fiscal & banking details (RC, IF, RIB) • Optional",
            rcLabel: "Trade Register (RC) & City",
            rcPlaceholder: "94821 / Marrakech",
            ifLabel: "Tax Identifier (IF)",
            ifPlaceholder: "40182934",
            ribLabel: "Bank RIB (24 Digits)",
            ribPlaceholder: "011 780 0000...",
            btnNext: "Continue to first vehicle",
            step2Title: "Your First Vehicle",
            step2Subtitle: "Add a first car to activate your partner dashboard instantly.",
            carModelLabel: "Vehicle Model *",
            plateLabel: "License Plate *",
            platePlaceholder: "Ex: 45821-B-26 or WW...",
            priceLabel: "Indicative Daily Rate (MAD)",
            priceUnit: "MAD / day",
            charterText: "I certify that my agency is officially registered in Morocco and agree to honor booked handovers with full transparency (no hidden fees, exact vehicle model provided).",
            btnBack: "Back",
            btnSubmit: "Validate & Access Dashboard",
            btnSubmitting: "Creating account...",
            footerTrust: "ZwinCar Morocco Partner Certification • Verified within 24h",
            popularModels: [
                { name: "Dacia Sandero Stepway", defaultPrice: 280, tag: "Most Popular" },
                { name: "Renault Clio 5 Automatique", defaultPrice: 330, tag: "Automatic" },
                { name: "Dacia Duster 4x4 Prestige", defaultPrice: 390, tag: "Off-Road 4x4" },
                { name: "Peugeot 208 PureTech", defaultPrice: 270, tag: "Economy" },
                { name: "Hyundai Tucson BVA Luxe", defaultPrice: 590, tag: "Premium SUV" },
                { name: "Autre véhicule", defaultPrice: 300, tag: "" },
            ],
            errors: {
                agencyName: "Please enter your agency name.",
                ice: "Invalid ICE number (at least 8 digits required in Morocco).",
                managerName: "Please enter the manager's full name.",
                whatsapp: "Valid WhatsApp number required to receive booking alerts.",
                email: "Please enter a valid business email address.",
                password: "Password must be at least 12 characters long.",
                plate: "Please enter the license plate of the first vehicle.",
                charter: "Please accept the ZwinCar transparency charter.",
                network: "Unable to reach server. Please check your connection.",
                generic: "An error occurred during registration.",
            },
        },
    },
};
