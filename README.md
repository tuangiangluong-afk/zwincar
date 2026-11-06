# Taxi France — Réseau de sites taxis (30+ villes)

Réseau de sites locaux de taxis (Paris IDF + villes nationales) avec SEO local, AEO/GEO
(citation par les IA), réservation en ligne et **Bourse aux Leads automatisée**
(WhatsApp double opt-in → Telegram → Stripe).

## Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Supabase (bookings, faqs, pois, vehicles, tenants, lead_claims)
- Resend (email de secours), WhatsApp Business API (Meta), Telegram Bot API, Stripe

## Démarrage

```bash
npm install
npm run dev
```

## Variables d'environnement (.env.local)

```env
# --- Supabase ---
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# --- Google Maps ---
NEXT_PUBLIC_GOOGLE_MAPS_KEY=

# --- Email de secours ---
RESEND_API_KEY=

# --- WhatsApp Business API (Meta) ---
META_PHONE_NUMBER_ID=
META_ACCESS_TOKEN=
META_WEBHOOK_VERIFY_TOKEN=   # jeton libre que vous choisissez
DRIVER_PHONE_NUMBER=         # téléphone chauffeur/répartiteur (notification directe)

# --- Telegram Bot (canal des chauffeurs) ---
TELEGRAM_BOT_TOKEN=          # de @BotFather
TELEGRAM_BOT_USERNAME=       # ex: TaxiFranceLeadsBot (sans @)
TELEGRAM_CHANNEL_ID=         # ex: -1001234567890 (canal privé des chauffeurs)

# --- Stripe (encaissement des leads) ---
STRIPE_SECRET_KEY=           # sk_live_...
STRIPE_WEBHOOK_SECRET=       # whsec_... (Dashboard > Webhooks)
LEAD_PRICE_CENTS=500         # prix du lead : 5.00 €
LEAD_SUCCESS_URL=https://taxifrance.fr
LEAD_CANCEL_URL=https://taxifrance.fr
```

## Bourse aux Leads — flux complet

```
1. Client réserve sur le site        → /api/lead
2. WhatsApp : template de confirmation envoyé au client ("répondez OUI")
3. Client répond OUI                 → webhook /api/whatsapp/webhook
4. Lead vérifié, diffusé sur Telegram (canal chauffeurs) avec bouton d'achat
5. Chauffeur tape "ACHETER"          → deep-link t.me/<bot>?start=claim_<id>
6. Bot crée SA session Stripe        → webhook /api/telegram/webhook
7. Chauffeur paie 5 €                → webhook /api/stripe/webhook
8. Vente atomique (1er payé gagnant) → message "VENDU" sur le canal (FOMO)
9. Numéro du client livré en DM au chauffeur gagnant
```

### Mise en place WhatsApp (Meta)

1. Compte WhatsApp Business + numéro dédié, **soumis à vérification Meta**.
2. Créer le **template** `lead_confirmation` (catégorie *Utilitaire*), langue FR :
   - Corps : `Bonjour {{1}}, votre demande de taxi est bien reçue. Pour confirmer votre réservation et l'envoyer à nos chauffeurs, répondez simplement OUI.`
   - Composant : `{{1}}` = prénom du client.
3. WhatsApp > Configuration API : URL de rappel `https://<domaine>/api/whatsapp/webhook`,
   jeton = `META_WEBHOOK_VERIFY_TOKEN`, abonner le champ `messages`.
4. `META_PHONE_NUMBER_ID` et `META_ACCESS_TOKEN` (token système permanent).

> ⚠️ Les messages initiés par l'entreprise exigent un template approuvé.
> Les 1 000 premières conversations « service » du mois sont gratuites.

### Mise en place Telegram

1. `@BotFather` → `/newbot` → récupérer le token + username du bot.
2. Créer le canal privé des chauffeurs → `@ChannelID` (ou `-100...` via @userinfobot).
3. `@BotFather` → `/setcommands` :
   ```
   start - Rejoindre la bourse aux leads
   ```
4. Enregistrer le webhook du bot :
   ```
   curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<domaine>/api/telegram/webhook"
   ```

### Mise en place Stripe

1. Dashboard Stripe > Webhooks > `https://<domaine>/api/stripe/webhook`
   → événement `checkout.session.completed` → copier `whsec_...` dans `STRIPE_WEBHOOK_SECRET`.
2. En mode test (`sk_test_...`), activer le mode test dans l'URL des sessions si besoin.

### Base de données

Lancer la migration : `supabase/migrations/20260825_lead_dispatch.sql`
(colonnes lead sur `bookings` + table `lead_claims`).

### Guide de configuration Meta (WhatsApp) complet

👉 [`docs/SETUP_WHATSAPP_META.md`](docs/SETUP_WHATSAPP_META.md) — pas-à-pas :
compte WhatsApp Business, template `lead_confirmation`, webhook, tokens, Telegram, Stripe, tests et pièges.

## SEO / AEO / GEO

- Moteur de contenu déterministe par ville (`src/lib/content.ts`) : spintax enrichi,
  conseils, comparatifs, actus — unique par ville, stable au crawl.
- Pages `/conseils` par ville : conseils pratiques, tarifs, nuit, bagages, animaux.
- Schema.org : LocalBusiness, Service, FAQPage, WebSite, Organization, HowTo (StructuredData).
- `llms.txt` par ville + hub : FAQ prête à citer pour les agents IA (GEO).
- **Information gain** (`src/lib/info-gain.ts`) : distances, durées et tarifs réels
  calculés par ville (coordonnées GPS) vers Orly, CDG, Paris, La Défense.

## Données POI (hôtels, monuments, hôpitaux)

Fichier généré `src/config/enriched-pois.ts` — 60 villes, données réelles
(Serper API + fallback curaté, jamais de noms génériques).

```bash
# Régénérer (nécessite une clé Serper : https://serper.dev)
SERPER_API_KEY=xxx npx tsx scripts/auto-enrich-content.ts --generate-static
```

Le fichier généré est committé : le site en production lit le fichier statique,
**zéro appel API au runtime**, contenu déterministe. Le script déduplique
automatiquement les lieux présents sur plus de 3 villes (évite le contenu
dupliqué entre sites voisins).
