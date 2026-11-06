# ZwinCar — Location de Voiture au Maroc (Sans Caution & Direct Loueurs)

Plateforme moderne de location de véhicules au Maroc connectant directement les voyageurs aux agences locales vérifiées. Zéro mauvaise surprise au comptoir, carte de débit acceptée, sans caution bloquée, et paiement d'un simple acompte de 20% en ligne.

---

## 🚀 Architecture & Fonctionnalités Clés

- **Matrice pSEO & GEO Multilingue (398 pages statiques)** :
  - **4 langues intégrées** : Français (`/maroc/`), Anglais (`/en/`), Espagnol (`/es/`), Néerlandais (`/nl/`).
  - **Balises `hreflang` bidirectionnelles** avec `x-default` pointant vers l'international.
  - **8 Hubs Stratégiques** : Marrakech, Casablanca, Agadir, Tanger, Fès, Rabat, Ouarzazate, Nador (aéroports, gares ONCF, ports et médinas).
  - **5 Intentions d'achat fortes** :
    1. *Sans Caution / No Deposit* (carte de débit acceptée, zéro franchise abusive).
    2. *Boîte Automatique* (conduite souple en ville et dans les cols de l'Atlas).
    3. *SUV & 4x4* (garde au sol 21 cm, routes du Sud et désert).
    4. *7 Places & Famille* (alternative aux petits taxis limités à 3 passagers).
    5. *Livraison Riad & Médina* (point de rencontre aux Babs historiques avec parking gardé).
- **Catalogue & Radar Routier Marocain** :
  - Fiches véhicules détaillées avec analyse technique (garde au sol, volume coffre en valises, passage col du Tichka, pistes d'Agafay).
  - Double affichage transparent des prix : **Dirhams marocains (MAD)** et **Euros (€)**.
- **Tunnel de Réservation & Paiement Stripe** :
  - Paiement sécurisé d'un acompte de 20% par carte bancaire via Stripe Checkout.
  - Solde restant réglé directement au loueur lors de la remise des clés (espèces MAD/EUR ou carte).
  - Options voyage : Pack Sérénité, Conducteur additionnel, Siège bébé, eSIM Holafly/Airalo Maroc.
- **Espace Loueurs Partenaires** :
  - Portail d'inscription et de connexion pour les agences de location locales.
  - Gestion de la flotte de véhicules, tarifs par saison et statut des réservations.
- **SEO Technique & Performance** :
  - Core Web Vitals optimisés (Next.js 16 App Router + Turbopack).
  - Données structurées `AutoRental`, `Product`, `FAQPage`, `BreadcrumbList`.
  - Sitemap XML dynamique (`/sitemap.xml`) indexant l'ensemble des 398 pages.

---

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router) + React 19 + TypeScript
- **Styling** : Tailwind CSS, Lucide React
- **Paiements** : Stripe Checkout & Webhooks
- **Base de données & Auth** : Supabase (PostgreSQL, Row Level Security)
- **Emails transactionnels** : Resend
- **Enrichissement Local** : Serper API (Points de retrait physiques géolocalisés)

---

## 💻 Démarrage Local

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement (port 3000)
npm run dev

# Vérification TypeScript
npx tsc --noEmit

# Build de production
npm run build
```

---

## 🔐 Variables d'Environnement (`.env.local`)

```env
# --- Supabase ---
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# --- Stripe ---
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# --- Resend (Emails Vouchers) ---
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=reservations@zwincar.com

# --- Serper (Enrichissement POI & Adresses Locales) ---
SERPER_API_KEY=your-serper-key
```

---

## 📄 Licence

Propriétaire — ZwinCar © 2026. Tous droits réservés.
