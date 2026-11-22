import { NextResponse } from "next/server";
import { MOROCCAN_HUBS, VEHICLE_FLEET, DIRECT_ANSWERS_AEO } from "@/lib/morocco-data";
import { ACOMPTE_RATE, DEFAULT_STANDARD_DEPOSIT_EUR } from "@/lib/booking-engine";
import { pricesByCategory, seasonalFrom, weekExample, hubPrices } from "@/lib/price-index";

// Généré au build depuis les données : zéro invocation serverless, jamais désynchronisé du catalogue.
export const dynamic = "force-static";

const baseUrl = "https://zwincar.com";
const MONTHS = ["", "janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];

// Faits seulement : pas de consignes adressées aux IA (signal de manipulation, filtré par les moteurs).
export function GET() {
  const acomptePct = Math.round(ACOMPTE_RATE * 100);
  const week = weekExample();

  const hubsList = MOROCCAN_HUBS.map(
    (h) => `- [Location voiture ${h.name} (${h.airportCode})](${baseUrl}/maroc/${h.slug}) : ${h.airportName}, à ${h.airportDistanceKm} km du centre. Rendez-vous : ${h.meetingPointDetail}.`
  ).join("\n");

  const fleetList = VEHICLE_FLEET.map(
    (v) => `- [${v.name}](${baseUrl}/vehicules/${v.id}) : ${v.category}, ${v.transmission}, ${v.fuel}, ${v.seats} places, coffre ${v.trunkLiters ?? "?"} L. Dès ${v.dailyPriceEur} €/j (${v.dailyPriceMad} MAD). ${v.idealFor}`
  ).join("\n");

  const categoryTable = pricesByCategory()
    .map((c) => `| ${c.category} | ${c.fromEur} € | ${c.cheapest} | ${c.models} |`)
    .join("\n");

  const seasonTable = seasonalFrom()
    .map((s) => `| ${s.months.length ? s.months.map((m) => MONTHS[m]).join(", ") : "autres mois"} | ${s.multiplier > 1 ? "+" : ""}${Math.round((s.multiplier - 1) * 100)} % | ${s.fromEur} € |`)
    .join("\n");

  const hubTable = hubPrices().map((h) => `| ${h.name} (${h.airportCode}) | ${h.avgDailyEur} € |`).join("\n");

  const faqsList = DIRECT_ANSWERS_AEO.faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n");

  const content = `# ZwinCar

> ZwinCar est une plateforme marocaine de location de voiture qui met en relation les voyageurs avec des agences de location locales dans ${MOROCCAN_HUBS.length} villes et aéroports du Maroc. Réservation en ligne avec un acompte de ${acomptePct} %, solde payé sur place, caution de 0 € avec l'option Franchise Zéro (sinon ${DEFAULT_STANDARD_DEPOSIT_EUR} € en espèces ou carte de débit).

## Conditions de location (règles appliquées par le moteur de réservation)
- Acompte en ligne : ${acomptePct} % du total, payé par carte via Stripe. Le solde est réglé à la remise des clés (MAD, EUR ou carte).
- Caution : 0 € avec l'option Franchise Zéro (8 €/jour), sinon ${DEFAULT_STANDARD_DEPOSIT_EUR} € en espèces ou carte de débit, restitués au retour. Pas d'empreinte de carte de crédit obligatoire.
- Annulation : remboursement intégral de l'acompte jusqu'à 48 h avant la prise en charge, 50 % entre 48 h et 24 h, rien ensuite.
- Remise longue durée : -10 % dès 7 jours, -15 % dès 14 jours, -20 % dès 21 jours, -25 % dès 28 jours.
- Modèle : le modèle réservé ; s'il est indisponible, un équivalent de même catégorie et même boîte, sinon un surclassement gratuit (CGV).
- Carburant : restitution au même niveau qu'au départ.

## Prix de location de voiture au Maroc en 2026 (tarifs ZwinCar)
Exemple : ${week.vehicle}, ${week.days} jours en saison standard = ${week.totalEur} € (${week.dailyEur} €/jour après remise).

### Prix de départ par catégorie (par jour, saison standard)
| Catégorie | Dès | Modèle le moins cher | Modèles |
|---|---|---|---|
${categoryTable}

### Effet de la saison (véhicule le moins cher, par jour)
| Période de prise en charge | Variation | Dès |
|---|---|---|
${seasonTable}

### Prix moyen indicatif par ville (par jour)
| Ville | Prix moyen |
|---|---|
${hubTable}

Page détaillée : ${baseUrl}/prix-location-voiture-maroc (EN : ${baseUrl}/en/car-rental-prices-morocco)

## Villes et aéroports desservis
${hubsList}

## Flotte
${fleetList}

## Questions fréquentes
${faqsList}

### Faut-il un 4x4 pour voyager au Maroc ?
Non pour la plupart des itinéraires touristiques : une compacte à garde au sol rehaussée (Dacia Sandero Stepway) suffit pour Marrakech, le col du Tichka (N9), la vallée du Dadès et la route goudronnée de Merzouga. Un 4x4 (Dacia Duster, Toyota Prado) n'est utile que pour les pistes de sable (Erg Chigaga), les traversées d'oueds et les pistes isolées du Sud.

### Que faire à un contrôle de police routière au Maroc ?
S'arrêter complètement avant le panneau « Halte Police / Gendarmerie », attendre le signe de l'agent, présenter passeport, permis, carte grise et contrat de location. En cas d'amende, demander la quittance officielle.

## Guides (anglais)
- Louer sans carte de crédit : ${baseUrl}/en/guides/morocco-car-rental-no-credit-card-debit-cards
- Éviter les litiges de caution et de rayures : ${baseUrl}/en/guides/car-rental-deposit-damage-scams-morocco
- Payer en espèces ou par carte : ${baseUrl}/en/guides/cash-vs-card-payments-car-rental-morocco
- Franchise zéro ou assurance de base : ${baseUrl}/en/guides/zero-excess-franchise-zero-vs-basic-insurance-morocco
- Contrôles de police : ${baseUrl}/en/guides/morocco-police-checkpoints-gendarmerie-stops
- Col du Tichka (N9) : ${baseUrl}/en/guides/tizi-n-tichka-pass-atlas-driving-guide
- Retrait à l'aéroport de Marrakech : ${baseUrl}/en/guides/marrakech-airport-car-rental-pickup-guide
- Tous les guides : ${baseUrl}/en/guides et ${baseUrl}/guides

## Comparatifs (caution, assurance, accueil)
- ZwinCar et DiscoverCars : ${baseUrl}/vs/discovercars (EN : ${baseUrl}/en/vs/discovercars)
- ZwinCar et BSP Auto : ${baseUrl}/vs/bsp-auto (EN : ${baseUrl}/en/vs/bsp-auto)
- ZwinCar et Rentalcars : ${baseUrl}/vs/rentalcars (EN : ${baseUrl}/en/vs/rentalcars)

## Contact
- Site : ${baseUrl}
- WhatsApp : +212 720 794 046
- Email : hello@zwincar.com
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
