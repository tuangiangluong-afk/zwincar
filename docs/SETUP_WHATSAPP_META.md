# Guide de configuration complet — WhatsApp Business API (Meta)

> Guide pas-à-pas pour brancher la **Bourse aux Leads** : WhatsApp (double opt-in),
> Telegram (canal chauffeurs), Stripe (encaissement).
> Durée totale : 1 à 3 h (compte tenu des délais de validation Meta).
> Coût : ~0 € en phase de test (les 1 000 premières conversations « service » WhatsApp
> du mois sont gratuites).

---

## Sommaire

- [Partie 1 — Compte & numéro WhatsApp Business](#partie-1--compte--numéro-whatsapp-business)
- [Partie 2 — Créer le template de confirmation (obligatoire)](#partie-2--créer-le-template-de-confirmation-obligatoire)
- [Partie 3 — Configurer le webhook (recevoir le « OUI »)](#partie-3--configurer-le-webhook-recevoir-le--oui-)
- [Partie 4 — Récupérer les identifiants (Phone Number ID + Token)](#partie-4--récupérer-les-identifiants-phone-number-id--token)
- [Partie 5 — Configurer Telegram (canal + bot)](#partie-5--configurer-telegram-canal--bot)
- [Partie 6 — Configurer Stripe (encaissement)](#partie-6--configurer-stripe-encaissement)
- [Partie 7 — Remplir le .env.local et tester](#partie-7--remplir-le-envlocal-et-tester)
- [Partie 8 — Passage en production & points de vigilance](#partie-8--passage-en-production--points-de-vigilance)

---

## Partie 1 — Compte & numéro WhatsApp Business

### 1.1 Créer le compte WhatsApp Business

1. Va sur **https://business.whatsapp.com** → **"Commencer"**.
2. Connecte-toi avec un **compte Facebook/Meta** (celui qui administrera tout).
3. Suis les étapes pour créer le **Meta Business Manager** (nom de l'entreprise : `Taxi France`).

> ⚠️ Il faut un numéro de téléphone **dédié** (pas celui qui sert déjà à un compte
> WhatsApp perso). Prends une SIM pro ou un numéro virtuel. Le numéro doit pouvoir
> **recevoir un SMS ou un appel** une seule fois pour la validation.

### 1.2 Ajouter le numéro

1. Dans Meta Business Manager : **Paramètres** (⚙️ en bas à gauche) →
   **Comptes** → **Numéros de téléphone WhatsApp** → **Ajouter**.
2. Saisis le numéro (format international : `+33612345678`).
3. Choisis un **nom d'affichage** : `Taxi France` (il apparaît aux clients).
4. Valide le numéro avec le code reçu par SMS/appel.

### 1.3 Vérification de l'entreprise (OBLIGATOIRE pour la production)

Sans vérification, tu ne peux envoyer qu'à ~5 numéros de test. Pour envoyer
à de vrais clients :

1. **Paramètres** → **Centre de sécurité** → **Vérification de l'entreprise**.
2. Renseigne : SIREN/SIRET, site web officiel, domaine d'email professionnel.
3. Meta vérifie en 2 à 5 jours ouvrés. **Fais-le en premier** pour ne pas attendre.

---

## Partie 2 — Créer le template de confirmation (obligatoire)

> **Pourquoi ?** Meta interdit les messages texte libres **initiés par l'entreprise**
> (c'est notre cas : le client réserve sur le site, on l'écrit en premier).
> Tout message sortant doit utiliser un **template approuvé**.
> La réponse du client (« OUI ») ouvre une fenêtre de 24 h où on peut écrire
> librement (confirmation, relance…).

### 2.1 Créer le template

1. Meta Business Manager → **Paramètres** → **Gestion des messages WhatsApp** →
   onglet **Modèles de messages** → **Créer un modèle**.
2. Remplis :
   - **Nom** : `lead_confirmation` ← **exactement ce nom** (il est codé dans le site).
   - **Langue** : `Français (FR)`.
   - **Catégorie** : **Utilitaire** ← obligatoire, sinon le template est rejeté
     (jamais « Marketing »).
   - **Corps du message** (copier-coller) :

     ```
     Bonjour {{1}}, votre demande de taxi est bien reçue. Pour confirmer votre réservation et l'envoyer à nos chauffeurs, répondez simplement OUI.
     ```

   - **Bouton** : *Pied de page* → option « Répondre » → texte : `OUI`
     (optionnel mais augmente le taux de réponse).
3. **Ajouter le composant variable** : à droite, cliquer sur le `{{1}}` →
   type `Texte`, exemple : `Marie`.

### 2.2 Soumettre et attendre l'approbation

- Statut **En attente** → **Approuvé** (quelques minutes à 24 h en général pour
  la catégorie Utilitaire).
- ⚠️ Ne touche à rien tant que le statut n'est pas « Approuvé ».
- En cas de rejet : vérifie la catégorie (Utilitaire) et que le message est
  factuel/informatif (pas de promo).

---

## Partie 3 — Configurer le webhook (recevoir le « OUI »)

### 3.1 Déployer d'abord le site avec la nouvelle URL

Le webhook doit pointer vers une URL **publique HTTPS** :
`https://<ton-domaine>/api/whatsapp/webhook`
→ Déploie le code sur Vercel avant de continuer.

### 3.2 Créer le webhook dans Meta

1. Meta Business Manager → **Paramètres** → **Gestion des messages WhatsApp** →
   onglet **Configuration API**.
2. Section **Webhook** → **Configurer** :
   - **URL de rappel** : `https://<ton-domaine>/api/whatsapp/webhook`
   - **Jeton de vérification** : choisis une chaîne secrète libre, ex. `taxifrance2026`
     (elle doit être identique à `META_WEBHOOK_VERIFY_TOKEN` dans le `.env.local`).
3. Clique **Vérifier et enregistrer** → Meta teste l'URL, le serveur répond le
   `challenge` → « Vérifié ».

### 3.3 Abonner le champ « messages »

1. Toujours dans **Configuration API** → section **Champs webhook** → **Gérer**.
2. Coche **`messages`** (reçoit les messages entrants, dont le « OUI »).
3. Sauvegarde.

---

## Partie 4 — Récupérer les identifiants (Phone Number ID + Token)

### 4.1 Phone Number ID

1. **Gestion des messages WhatsApp** → **Numéros de téléphone** → ton numéro.
2. Le **Phone Number ID** est affiché (un identifiant numérique type `123456789012345`).
3. Copie-le → `META_PHONE_NUMBER_ID` dans le `.env.local`.

### 4.2 Token système permanent (System User)

> On n'utilise PAS le token temporaire « WhatsApp Test Number » : il expire.
> On crée un **System User** avec un token permanent.

1. Meta Business Manager → **Paramètres** → **Utilisateurs** → **Utilisateurs système** →
   **Ajouter** (nom : `API Leads`).
2. Rôle : **Administrateur**.
3. Après création : **Ajouter les actifs** → **WhatsApp** → sélectionne le compte
   WhatsApp Business.
4. **Générer un jeton** → durée de vie : **Jamais** (permanent).
5. **Choisir les autorisations** : coche `whatsapp_business_messaging` et
   `whatsapp_business_management`.
6. **Générer le jeton** → copie-le → `META_ACCESS_TOKEN` dans le `.env.local`.
   ⚠️ Il ne s'affiche qu'**une seule fois**.

---

## Partie 5 — Configurer Telegram (canal + bot)

### 5.1 Créer le bot

1. Sur Telegram, cherche **@BotFather** → `/newbot`.
2. Nom : `Taxi France Leads` → username : `TaxiFranceLeadsBot` (doit finir par `bot`).
3. Récupère le **token** (format `123456789:AA...`) → `TELEGRAM_BOT_TOKEN`.
4. Note le **username sans @** → `TELEGRAM_BOT_USERNAME` (il sert au bouton d'achat).

### 5.2 Créer le canal chauffeurs

1. Telegram → menu → **Nouveau canal** → nom : `🚨 Leads Taxi France (VIP)`.
2. Type : **Privé**. Ajoute le bot comme **administrateur** (droits d'édition).
3. Récupère l'ID du canal :
   - Poste un message de test dans le canal.
   - Cherche **@userinfobot** → `/start` → envoie-lui le lien du canal
     (ou le bot `@RawDataBot` qui donne l'ID : `-100xxxxxxxxxx`).
   - Copie-le → `TELEGRAM_CHANNEL_ID` (attention au signe `-100`).

### 5.3 Brancher le webhook du bot

Dans un terminal (remplace `<TOKEN>` et `<DOMAINE>`) :

```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://<DOMAINE>/api/telegram/webhook"
```

Réponse attendue : `{"ok":true,...}`.
Vérifier : `curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"`.

### 5.4 (Optionnel) Commandes du bot

@BotFather → `/setcommands` →
```
start - Rejoindre la bourse aux leads
```

---

## Partie 6 — Configurer Stripe (encaissement)

### 6.1 Créer le compte et la clé

1. **https://dashboard.stripe.com** → créer le compte (vérification SIRET requise
   pour encaisser réellement).
2. Mode **Test** pour commencer : clé `sk_test_...` → `STRIPE_SECRET_KEY`.
3. Plus tard, mode Live : clé `sk_live_...`.

### 6.2 Créer le webhook

1. Stripe Dashboard → **Développeurs** → **Webhooks** → **Ajouter un endpoint**.
2. URL : `https://<ton-domaine>/api/stripe/webhook`.
3. Événement : `checkout.session.completed`.
4. Après création : récupère le **secret de signature** (`whsec_...`) →
   `STRIPE_WEBHOOK_SECRET`.
5. ⚠️ Le mode du webhook (test/live) doit correspondre à la clé utilisée.

### 6.3 (Recommandé) Forcer la récupération du téléphone du client

Le formulaire demande déjà le numéro au client, mais si tu veux laisser Stripe
collecter le téléphone du client final (optionnel) :

- Stripe Dashboard → **Paramètres** → **Checkout** → activer « Téléphone » dans
  « Informations du client ». (Pas indispensable : on livre le numéro du client
  *taxi*, pas de l'acheteur.)

---

## Partie 7 — Remplir le .env.local et tester

### 7.1 Récapitulatif des variables

```env
# WhatsApp (Meta)
META_PHONE_NUMBER_ID=123456789012345
META_ACCESS_TOKEN=EAAG...
META_WEBHOOK_VERIFY_TOKEN=taxifrance2026
DRIVER_PHONE_NUMBER=+33612345678   # répartiteur (notification directe)

# Telegram
TELEGRAM_BOT_TOKEN=123456789:AA...
TELEGRAM_BOT_USERNAME=TaxiFranceLeadsBot
TELEGRAM_CHANNEL_ID=-1001234567890

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
LEAD_PRICE_CENTS=500
LEAD_SUCCESS_URL=https://taxifrance.fr
LEAD_CANCEL_URL=https://taxifrance.fr
```

### 7.2 Test complet du flux

1. **Test WhatsApp en direct** : ouvre un chat avec ton numéro WhatsApp Business
   depuis ton téléphone perso, envoie n'importe quel message (ouvre la fenêtre de
   24 h, permet le texte libre pendant le test). Réserve sur le site → tu dois
   recevoir le template `lead_confirmation`.
2. **Test du webhook** : réponds `OUI` → tu reçois la confirmation, et le lead
   doit apparaître sur le canal Telegram avec le bouton.
3. **Test de l'achat** : clique sur le bouton du canal → le bot t'envoie le lien
   Stripe → paie 1 € (mode test, carte `4242 4242 4242 4242`) → tu reçois le
   numéro du client en DM, et le message du canal passe en « 🔴 VENDU ».
4. **Test FOMO** : clique à nouveau sur un lead déjà vendu → message « trop lent ».

### 7.3 Pièges classiques

| Symptôme | Cause | Correctif |
|---|---|---|
| `(#131030) Recipient phone number not in allowed list` | Numéro non approuvé avant vérification entreprise | Ajoute le numéro dans « Numéros de test » du compte WhatsApp |
| `(#100) Param [template] is required` | Template pas encore approuvé | Attends l'approbation, vérifie le nom exact `lead_confirmation` |
| Template rejeté | Catégorie Marketing ou message promotionnel | Recrée en catégorie **Utilitaire** |
| Webhook Meta « Échec de vérification » | Le token ne correspond pas à `META_WEBHOOK_VERIFY_TOKEN` | Corrige la variable, redéploie |
| Pas de message reçu | Champs webhook non abonnés | Coche `messages` dans Configuration API |
| Stripe `401` sur le webhook | Secret `whsec_` invalide ou mauvais mode | Recopie le secret, vérifie test/live |

---

## Partie 8 — Passage en production & points de vigilance

1. **Vérification d'entreprise Meta** : obligatoire pour écrire à de vrais clients.
   Compte 3 à 5 jours. Fournis SIREN + site + email pro au nom du domaine.
2. **Tarifs WhatsApp** : les conversations « Service » (déclenchées par un message
   client) sont gratuites jusqu'à 1 000/mois, puis ~0,03 €/conversation.
   Le template de confirmation est **gratuit** (il initie la conversation « Service »
   sur une demande de service : c'est l'usage autorisé).
3. **Qualité des leads** : ne diffuse jamais un lead non confirmé. Le « OUI »
   garantit que le client est vivant et intéressé — c'est ta protection contre
   les remboursements chauffeurs.
4. **Conformité RGPD** : le client consent en réservant (case à cocher sur le
   formulaire). Stocke les numéros dans Supabase (déjà le cas) et mentionne le
   traitement dans les CGV (à ajouter).
5. **Stripe fees** : sur un lead à 5,00 €, Stripe prélève ~0,40 €
   (2,9 % + 0,25 €). Pense à `LEAD_PRICE_CENTS=550` si tu veux garder 5 € net.
6. **Mode test/live** : tout doit être cohérent (clé Stripe + webhook + numéro
   WhatsApp vérifié + template approuvé) avant de passer en live.
