/**
 * ZwinCar — Moteur de réservation (source de vérité unique).
 *
 * Ce module est 100 % pur : aucune dépendance, aucun accès réseau, aucune I/O.
 * Il est utilisé par les routes API (autorité serveur) ET par la suite de tests
 * (`node --test`), ce qui garantit que le prix affiché, le prix facturé et le
 * prix remboursé sortent exactement de la même fonction.
 *
 * Règles produit encodées ici :
 *  - tarification saisonnière + remise longue durée + options + frais
 *  - acompte en ligne 20 %, solde au comptoir, caution (franchise zéro => 0 €)
 *  - politique d'annulation par paliers (48h / 24h / no-show)
 *  - modification de dates (recalcul d'acompte + frais admin)
 *  - machine à états du dossier (impossible de check-out un dossier non check-in)
 *  - validation check-in (âge, permis, photos, carburant, contrat)
 *  - clôture check-out (carburant, km, retard, dommages) et restitution de caution
 *  - planification des emails du cycle de vie (J-7, J-1, J0, J+1, J+30)
 */

export type Currency = "EUR" | "MAD";
export type Locale = "fr" | "en" | "es" | "nl";
export type Transmission = "Manuelle" | "Automatique";
export type FuelLevel = "0" | "1/4" | "1/2" | "3/4" | "1";

export type BookingStatus =
    | "awaiting_payment"
    | "confirmed"
    | "checked_in"
    | "checked_out"
    | "completed"
    | "cancelled"
    | "no_show"
    | "expired";

/** Taux de conversion commercial fixe (aligné sur l'affichage du site). */
export const MAD_PER_EUR = 11;
/** Part réglée en ligne à la réservation. */
export const ACOMPTE_RATE = 0.2;
/** Caution standard quand la formule Franchise Zéro n'est pas souscrite. */
export const DEFAULT_STANDARD_DEPOSIT_EUR = 300;
/** Tolérance de retard sans pénalité. */
export const GRACE_MINUTES = 59;
/** Franchise kilométrique incluse par jour. */
export const DEFAULT_KM_PER_DAY = 250;
/** Prix du km additionnel. */
export const EXTRA_KM_PRICE_EUR = 0.25;
/** Coût de référence d'un plein complet (45 L). */
export const FUEL_REFILL_EUR = 60;
/** Frais de dossier pour une modification à moins de 48h. */
export const LATE_CHANGE_FEE_EUR = 25;
/** Supplément jeune conducteur (moins de 25 ans). */
export const YOUNG_DRIVER_FEE_EUR = 8;
/** Supplément retour dans un autre hub. */
export const CROSS_HUB_FEE_EUR = 25;
/** Durée maximale d'une location en ligne. */
export const MAX_RENTAL_DAYS = 90;
/** Seuil de gratuité d'annulation. */
export const FREE_CANCEL_HOURS = 48;
/** Seuil de remboursement partiel. */
export const PARTIAL_CANCEL_HOURS = 24;

// ---------------------------------------------------------------------------
// Catalogue d'options (doit rester aligné avec UPSELL_OPTIONS de morocco-data)
// ---------------------------------------------------------------------------

export interface UpsellDefinition {
    id: string;
    label: string;
    priceEur: number;
    priceMad: number;
    type: "per_day" | "fixed";
}

export const UPSELLS: UpsellDefinition[] = [
    { id: "franchise-zero", label: "Franchise Zéro (Zéro Caution)", priceEur: 8, priceMad: 90, type: "per_day" },
    { id: "esim-maroc", label: "eSIM Maroc 20 Go 5G", priceEur: 19, priceMad: 210, type: "fixed" },
    { id: "badge-jawaz", label: "Pass Télépéage Jawaz", priceEur: 7, priceMad: 75, type: "fixed" },
    { id: "siege-bebe", label: "Siège Enfant / Rehausseur ISOFIX", priceEur: 4, priceMad: 45, type: "per_day" },
    { id: "conducteur-additionnel", label: "2ème Conducteur Enregistré", priceEur: 0, priceMad: 0, type: "fixed" },
    { id: "restitution-flexible", label: "Restitution Flexible (+3h)", priceEur: 15, priceMad: 165, type: "fixed" },
];

export const UPSELL_IDS = UPSELLS.map((u) => u.id);

export interface VehicleRate {
    id: string;
    name: string;
    dailyPriceEur: number;
    dailyPriceMad: number;
    transmission: Transmission;
    seats: number;
    standardDepositEur?: number;
}

// ---------------------------------------------------------------------------
// Utilitaires déterministes
// ---------------------------------------------------------------------------

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isValidIsoDate(value: unknown): value is string {
    if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
    const [y, m, d] = value.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function isValidTime(value: unknown): value is string {
    return typeof value === "string" && TIME.test(value);
}

/** Convertit date + heure locales Maroc en timestamp UTC stable (pas de DST surprise). */
export function toUtcMs(date: string, time: string): number {
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    return Date.UTC(y, m - 1, d, hh, mm, 0, 0);
}

/** Nombre de jours facturés : toute tranche de 24h commencée est due, minimum 1. */
export function rentalDays(pickupDate: string, pickupTime: string, returnDate: string, returnTime: string): number {
    const start = toUtcMs(pickupDate, pickupTime);
    const end = toUtcMs(returnDate, returnTime);
    if (!Number.isFinite(start) || !Number.isFinite(end)) {
        throw new Error("Dates de location invalides");
    }
    if (end <= start) {
        throw new Error("La date de restitution doit être postérieure à la prise en charge");
    }
    return Math.max(1, Math.ceil((end - start) / 86_400_000));
}

export interface SeasonRule {
    months: number[];
    multiplier: number;
    label: string;
}

/** Haute saison : juillet-août, fêtes de fin d'année, printemps. */
export const SEASONS: SeasonRule[] = [
    { months: [7, 8], multiplier: 1.35, label: "Haute saison (été)" },
    { months: [12], multiplier: 1.25, label: "Fêtes de fin d'année" },
    { months: [4], multiplier: 1.15, label: "Vacances de printemps" },
    { months: [5, 10], multiplier: 1.1, label: "Moyenne saison" },
    { months: [1, 2], multiplier: 0.9, label: "Basse saison" },
];

export function seasonFor(pickupDate: string): SeasonRule {
    const month = Number(pickupDate.slice(5, 7));
    return (
        SEASONS.find((season) => season.months.includes(month)) ?? {
            months: [],
            multiplier: 1,
            label: "Saison standard",
        }
    );
}

/** Remise longue durée : dégressive et cumulable avec la saison. */
export function longStayDiscount(days: number): number {
    if (days >= 28) return 0.25;
    if (days >= 21) return 0.2;
    if (days >= 14) return 0.15;
    if (days >= 7) return 0.1;
    return 0;
}

export function roundEur(value: number): number {
    return Math.round(value);
}

function money(value: number): number {
    return Math.round(value * 100) / 100;
}

// ---------------------------------------------------------------------------
// Devis
// ---------------------------------------------------------------------------

export interface QuoteRequest {
    vehicle: VehicleRate;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    pickupHub: string;
    returnHub?: string;
    upsells?: string[];
    driverAge?: number;
    currency?: Currency;
}

export type QuoteLineKind = "base" | "season" | "discount" | "upsell" | "fee";

export interface QuoteLine {
    id: string;
    label: string;
    kind: QuoteLineKind;
    amountEur: number;
    amountMad: number;
}

export interface Quote {
    currency: Currency;
    days: number;
    dailyRateEur: number;
    dailyRateMad: number;
    seasonLabel: string;
    seasonMultiplier: number;
    discountRate: number;
    lines: QuoteLine[];
    baseEur: number;
    baseMad: number;
    extrasEur: number;
    extrasMad: number;
    totalEur: number;
    totalMad: number;
    acompteEur: number;
    acompteMad: number;
    balanceEur: number;
    balanceMad: number;
    depositEur: number;
    depositMad: number;
    hasZeroDeposit: boolean;
    youngDriver: boolean;
    crossHub: boolean;
    upsells: string[];
}

export function quoteBooking(request: QuoteRequest): Quote {
    const {
        vehicle,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        pickupHub,
        returnHub,
        driverAge,
    } = request;

    if (!vehicle || typeof vehicle.dailyPriceEur !== "number" || vehicle.dailyPriceEur <= 0) {
        throw new Error("Véhicule invalide");
    }
    if (!isValidIsoDate(pickupDate) || !isValidIsoDate(returnDate)) {
        throw new Error("Dates invalides");
    }
    if (!isValidTime(pickupTime) || !isValidTime(returnTime)) {
        throw new Error("Heures invalides");
    }

    const days = rentalDays(pickupDate, pickupTime, returnDate, returnTime);
    if (days > MAX_RENTAL_DAYS) {
        throw new Error(`Location limitée à ${MAX_RENTAL_DAYS} jours`);
    }

    const upsells = Array.from(new Set((request.upsells ?? []).filter((id) => UPSELL_IDS.includes(id))));
    const season = seasonFor(pickupDate);
    const discountRate = longStayDiscount(days);
    const crossHub = Boolean(returnHub && pickupHub && returnHub !== pickupHub);
    const youngDriver = typeof driverAge === "number" && driverAge > 0 && driverAge < 25;
    const hasZeroDeposit = upsells.includes("franchise-zero");

    const baseEur = vehicle.dailyPriceEur * days;
    const baseMad = vehicle.dailyPriceMad * days;

    const seasonEur = Math.round(baseEur * (season.multiplier - 1));
    const seasonMad = Math.round(baseMad * (season.multiplier - 1));

    const discountEur = -Math.round((baseEur + seasonEur) * discountRate);
    const discountMad = -Math.round((baseMad + seasonMad) * discountRate);

    const lines: QuoteLine[] = [
        {
            id: "base",
            label: `${vehicle.name} — ${days} jour${days > 1 ? "s" : ""}`,
            kind: "base",
            amountEur: baseEur,
            amountMad: baseMad,
        },
    ];

    if (seasonEur !== 0 || seasonMad !== 0) {
        lines.push({
            id: "season",
            label: season.label,
            kind: "season",
            amountEur: seasonEur,
            amountMad: seasonMad,
        });
    }

    if (discountRate > 0) {
        lines.push({
            id: "discount",
            label: `Remise longue durée −${Math.round(discountRate * 100)} %`,
            kind: "discount",
            amountEur: discountEur,
            amountMad: discountMad,
        });
    }

    let extrasEur = 0;
    let extrasMad = 0;

    for (const id of upsells) {
        const definition = UPSELLS.find((u) => u.id === id)!;
        const amountEur = definition.type === "per_day" ? definition.priceEur * days : definition.priceEur;
        const amountMad = definition.type === "per_day" ? definition.priceMad * days : definition.priceMad;
        extrasEur += amountEur;
        extrasMad += amountMad;
        lines.push({
            id: `upsell:${id}`,
            label: definition.label,
            kind: "upsell",
            amountEur,
            amountMad,
        });
    }

    if (youngDriver) {
        const amountEur = YOUNG_DRIVER_FEE_EUR * days;
        const amountMad = roundEur(YOUNG_DRIVER_FEE_EUR * MAD_PER_EUR) * days;
        extrasEur += amountEur;
        extrasMad += amountMad;
        lines.push({
            id: "fee:young-driver",
            label: "Supplément jeune conducteur (moins de 25 ans)",
            kind: "fee",
            amountEur,
            amountMad,
        });
    }

    if (crossHub) {
        const amountEur = CROSS_HUB_FEE_EUR;
        const amountMad = roundEur(CROSS_HUB_FEE_EUR * MAD_PER_EUR);
        extrasEur += amountEur;
        extrasMad += amountMad;
        lines.push({
            id: "fee:cross-hub",
            label: "Restitution dans une autre ville",
            kind: "fee",
            amountEur,
            amountMad,
        });
    }

    const totalEur = Math.max(0, roundEur(baseEur + seasonEur + discountEur + extrasEur));
    const totalMad = Math.max(0, roundEur(baseMad + seasonMad + discountMad + extrasMad));

    const acompteEur = Math.max(1, roundEur(totalEur * ACOMPTE_RATE));
    const acompteMad = Math.max(1, roundEur(totalMad * ACOMPTE_RATE));

    const depositEur = hasZeroDeposit ? 0 : vehicle.standardDepositEur ?? DEFAULT_STANDARD_DEPOSIT_EUR;

    return {
        currency: request.currency ?? "EUR",
        days,
        dailyRateEur: vehicle.dailyPriceEur,
        dailyRateMad: vehicle.dailyPriceMad,
        seasonLabel: season.label,
        seasonMultiplier: season.multiplier,
        discountRate,
        lines,
        baseEur,
        baseMad,
        extrasEur,
        extrasMad,
        totalEur,
        totalMad,
        acompteEur,
        acompteMad,
        balanceEur: Math.max(0, totalEur - acompteEur),
        balanceMad: Math.max(0, totalMad - acompteMad),
        depositEur,
        depositMad: roundEur(depositEur * MAD_PER_EUR),
        hasZeroDeposit,
        youngDriver,
        crossHub,
        upsells,
    };
}

export function quoteLineTotal(lines: QuoteLine[], key: "amountEur" | "amountMad"): number {
    return lines.reduce((sum, line) => sum + line[key], 0);
}

// ---------------------------------------------------------------------------
// Machine à états
// ---------------------------------------------------------------------------

export const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
    awaiting_payment: ["confirmed", "cancelled", "expired"],
    confirmed: ["checked_in", "cancelled", "no_show"],
    checked_in: ["checked_out", "completed"],
    checked_out: ["completed"],
    completed: [],
    cancelled: [],
    no_show: [],
    expired: [],
};

export function canTransition(from: BookingStatus, to: BookingStatus): boolean {
    return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function assertTransition(from: BookingStatus, to: BookingStatus): void {
    if (!canTransition(from, to)) {
        throw new Error(`Transition interdite: ${from} → ${to}`);
    }
}

export function isTerminal(status: BookingStatus): boolean {
    return ALLOWED_TRANSITIONS[status].length === 0;
}

/** Une réservation peut être annulée par le client jusqu'à la remise des clés. */
export function isCancellable(status: BookingStatus): boolean {
    return status === "awaiting_payment" || status === "confirmed";
}

/** Une modification de dates n'est possible qu'avant le check-in. */
export function isModifiable(status: BookingStatus): boolean {
    return status === "awaiting_payment" || status === "confirmed";
}

// ---------------------------------------------------------------------------
// Annulation
// ---------------------------------------------------------------------------

export type CancellationTier = "free" | "partial" | "late" | "no_show" | "not_allowed";

export interface CancellationPolicy {
    allowed: boolean;
    tier: CancellationTier;
    hoursBeforePickup: number;
    refundRate: number;
    paidEur: number;
    refundEur: number;
    refundMad: number;
    retainedEur: number;
    /** Avoir commercial 12 mois proposé quand aucun remboursement n'est dû. */
    creditNoteEur: number;
    message: string;
}

export function cancellationPolicy(booking: BookingRecord, now: Date = new Date()): CancellationPolicy {
    const paidEur = Math.max(0, roundEur(booking.paidEur));
    const empty: CancellationPolicy = {
        allowed: false,
        tier: "not_allowed",
        hoursBeforePickup: 0,
        refundRate: 0,
        paidEur,
        refundEur: 0,
        refundMad: 0,
        retainedEur: 0,
        creditNoteEur: 0,
        message: "Ce dossier ne peut plus être annulé en ligne.",
    };

    if (!isCancellable(booking.status)) return empty;

    const hoursBeforePickup =
        (toUtcMs(booking.rental.pickupDate, booking.rental.pickupTime) - now.getTime()) / 3_600_000;

    if (hoursBeforePickup <= 0) {
        return {
            ...empty,
            allowed: true,
            tier: "no_show",
            hoursBeforePickup: Math.round(hoursBeforePickup * 100) / 100,
            retainedEur: paidEur,
            message: "La prise en charge est dépassée : l'acompte est conservé (no-show).",
        };
    }

    if (hoursBeforePickup >= FREE_CANCEL_HOURS) {
        return {
            allowed: true,
            tier: "free",
            hoursBeforePickup: Math.round(hoursBeforePickup * 100) / 100,
            refundRate: 1,
            paidEur,
            refundEur: paidEur,
            refundMad: roundEur(paidEur * MAD_PER_EUR),
            retainedEur: 0,
            creditNoteEur: paidEur,
            message: "Annulation gratuite : acompte remboursé en totalité sous 5 jours ouvrés.",
        };
    }

    if (hoursBeforePickup >= PARTIAL_CANCEL_HOURS) {
        const refundEur = roundEur(paidEur * 0.5);
        return {
            allowed: true,
            tier: "partial",
            hoursBeforePickup: Math.round(hoursBeforePickup * 100) / 100,
            refundRate: 0.5,
            paidEur,
            refundEur,
            refundMad: roundEur(refundEur * MAD_PER_EUR),
            retainedEur: paidEur - refundEur,
            creditNoteEur: paidEur,
            message: "Annulation à moins de 48h : 50 % de l'acompte est remboursé.",
        };
    }

    return {
        allowed: true,
        tier: "late",
        hoursBeforePickup: Math.round(hoursBeforePickup * 100) / 100,
        refundRate: 0,
        paidEur,
        refundEur: 0,
        refundMad: 0,
        retainedEur: paidEur,
        creditNoteEur: paidEur,
        message:
            "Annulation à moins de 24h : l'acompte n'est pas remboursé, mais un avoir de 100 % valable 12 mois est émis.",
    };
}

// ---------------------------------------------------------------------------
// Modification de dates / options
// ---------------------------------------------------------------------------

export interface ModificationInput {
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    returnHub?: string;
    upsells?: string[];
    driverAge?: number;
}

export interface ModificationResult {
    allowed: boolean;
    reason?: string;
    quote?: Quote;
    adminFeeEur: number;
    adminFeeMad: number;
    amountToPayNowEur: number;
    amountToPayNowMad: number;
    refundDueEur: number;
    refundDueMad: number;
    newAcompteEur: number;
    newBalanceEur: number;
    deltaTotalEur: number;
    message: string;
}

export function modificationPolicy(
    booking: BookingRecord,
    modification: ModificationInput,
    vehicle: VehicleRate,
    pickupHub: string,
    now: Date = new Date()
): ModificationResult {
    const refused = (reason: string): ModificationResult => ({
        allowed: false,
        reason,
        adminFeeEur: 0,
        adminFeeMad: 0,
        amountToPayNowEur: 0,
        amountToPayNowMad: 0,
        refundDueEur: 0,
        refundDueMad: 0,
        newAcompteEur: 0,
        newBalanceEur: 0,
        deltaTotalEur: 0,
        message: reason,
    });

    if (!isModifiable(booking.status)) {
        return refused("Les dates ne peuvent plus être modifiées après la remise des clés.");
    }

    if (!isValidIsoDate(modification.pickupDate) || !isValidIsoDate(modification.returnDate)) {
        return refused("Dates invalides.");
    }

    const pickupAt = toUtcMs(modification.pickupDate, modification.pickupTime);
    if (pickupAt <= now.getTime()) {
        return refused("La nouvelle prise en charge doit être dans le futur.");
    }

    let quote: Quote;
    try {
        quote = quoteBooking({
            vehicle,
            pickupDate: modification.pickupDate,
            pickupTime: modification.pickupTime,
            returnDate: modification.returnDate,
            returnTime: modification.returnTime,
            pickupHub,
            returnHub: modification.returnHub,
            upsells: modification.upsells,
            driverAge: modification.driverAge,
        });
    } catch (error) {
        return refused(error instanceof Error ? error.message : "Devis impossible.");
    }

    const hoursBeforePickup =
        (toUtcMs(booking.rental.pickupDate, booking.rental.pickupTime) - now.getTime()) / 3_600_000;
    const adminFeeEur = hoursBeforePickup < FREE_CANCEL_HOURS ? LATE_CHANGE_FEE_EUR : 0;
    const adminFeeMad = roundEur(adminFeeEur * MAD_PER_EUR);

    const newAcompteEur = quote.acompteEur;
    const newBalanceEur = quote.balanceEur;
    const acompteDelta = newAcompteEur - roundEur(booking.paidEur);

    const amountToPayNowEur = Math.max(0, acompteDelta) + adminFeeEur;
    const refundDueEur = Math.max(0, Math.min(-acompteDelta, roundEur(booking.paidEur)) - adminFeeEur);

    const totalDelta = quote.totalEur - roundEur(booking.paidEur / ACOMPTE_RATE);

    return {
        allowed: true,
        quote,
        adminFeeEur,
        adminFeeMad,
        amountToPayNowEur,
        amountToPayNowMad: roundEur(amountToPayNowEur * MAD_PER_EUR),
        refundDueEur,
        refundDueMad: roundEur(refundDueEur * MAD_PER_EUR),
        newAcompteEur,
        newBalanceEur,
        deltaTotalEur: totalDelta,
        message:
            adminFeeEur > 0
                ? `Modification enregistrée avec frais de dossier de ${LATE_CHANGE_FEE_EUR} €.`
                : "Modification gratuite enregistrée.",
    };
}

// ---------------------------------------------------------------------------
// Check-in (remise des clés)
// ---------------------------------------------------------------------------

export interface CheckInInput {
    driverAge: number;
    licenseIssuedAt: string;
    fuelLevel: FuelLevel;
    mileageKm: number;
    photos: number;
    contractSigned: boolean;
    balanceCollected: boolean;
}

export interface CheckInIssue {
    code: string;
    message: string;
}

export interface CheckInResult {
    ok: boolean;
    issues: CheckInIssue[];
    depositRequiredEur: number;
    zeroDeposit: boolean;
}

const FUEL_FRACTION: Record<FuelLevel, number> = { "0": 0, "1/4": 0.25, "1/2": 0.5, "3/4": 0.75, "1": 1 };

export function validateCheckIn(input: CheckInInput, quote: Quote, pickupDate: string): CheckInResult {
    const issues: CheckInIssue[] = [];

    if (!Number.isFinite(input.driverAge) || input.driverAge < 21) {
        issues.push({ code: "driver_age", message: "Le conducteur doit avoir au moins 21 ans." });
    }
    if (input.driverAge > 99) {
        issues.push({ code: "driver_age_max", message: "Âge conducteur invalide." });
    }
    if (!isValidIsoDate(input.licenseIssuedAt)) {
        issues.push({ code: "license_date", message: "Date d'obtention du permis invalide." });
    } else {
        const years = (toUtcMs(pickupDate, "00:00") - toUtcMs(input.licenseIssuedAt, "00:00")) / (365.25 * 86_400_000);
        if (years < 1) {
            issues.push({ code: "license_seniority", message: "Permis détenu depuis moins d'un an : non éligible." });
        }
    }
    if (!(input.fuelLevel in FUEL_FRACTION)) {
        issues.push({ code: "fuel_level", message: "Niveau de carburant invalide." });
    }
    if (!Number.isFinite(input.mileageKm) || input.mileageKm < 0 || input.mileageKm > 600_000) {
        issues.push({ code: "mileage", message: "Kilométrage invalide." });
    }
    if (!Number.isFinite(input.photos) || input.photos < 4) {
        issues.push({ code: "photos", message: "4 photos minimum sont requises (avant, arrière, flancs)." });
    }
    if (!input.contractSigned) {
        issues.push({ code: "contract", message: "Le contrat doit être signé par le client." });
    }
    if (!input.balanceCollected) {
        issues.push({ code: "balance", message: "Le solde doit être encaissé avant la remise des clés." });
    }

    return {
        ok: issues.length === 0,
        issues,
        depositRequiredEur: quote.depositEur,
        zeroDeposit: quote.hasZeroDeposit,
    };
}

// ---------------------------------------------------------------------------
// Check-out (restitution) et caution
// ---------------------------------------------------------------------------

export interface CheckOutInput {
    fuelOnPickup: FuelLevel;
    fuelOnReturn: FuelLevel;
    mileageOnPickup: number;
    mileageOnReturn: number;
    damageEur?: number;
    lateMinutes?: number;
    cleaningEur?: number;
    tollsEur?: number;
    finesEur?: number;
    includedKmPerDay?: number;
    extraKmPriceEur?: number;
}

export interface CheckOutResult {
    days: number;
    includedKm: number;
    drivenKm: number;
    extraKm: number;
    fuelPenaltyEur: number;
    extraKmPenaltyEur: number;
    latePenaltyEur: number;
    damageEur: number;
    cleaningEur: number;
    otherEur: number;
    totalChargesEur: number;
    totalChargesMad: number;
    depositEur: number;
    depositRefundEur: number;
    depositRefundMad: number;
    amountDueByClientEur: number;
    amountDueByClientMad: number;
}

export function checkoutSettlement(
    input: CheckOutInput,
    quote: Quote,
    options: { dailyRateEur?: number } = {}
): CheckOutResult {
    const days = quote.days;
    const includedKmPerDay = input.includedKmPerDay ?? DEFAULT_KM_PER_DAY;
    const extraKmPriceEur = input.extraKmPriceEur ?? EXTRA_KM_PRICE_EUR;

    const includedKm = includedKmPerDay * days;
    const drivenKm = Math.max(0, Math.round((input.mileageOnReturn ?? 0) - (input.mileageOnPickup ?? 0)));
    const extraKm = Math.max(0, drivenKm - includedKm);

    const pickupFraction = FUEL_FRACTION[input.fuelOnPickup] ?? 0;
    const returnFraction = FUEL_FRACTION[input.fuelOnReturn] ?? 0;
    const missingFuel = Math.max(0, pickupFraction - returnFraction);
    const fuelPenaltyEur = roundEur(missingFuel * FUEL_REFILL_EUR);

    const extraKmPenaltyEur = money(extraKm * extraKmPriceEur);

    const lateMinutes = Math.max(0, input.lateMinutes ?? 0);
    const lateDays = lateMinutes > GRACE_MINUTES ? Math.ceil((lateMinutes - GRACE_MINUTES) / 1440) : 0;
    const dailyRateEur = options.dailyRateEur ?? quote.dailyRateEur;
    const latePenaltyEur = roundEur(lateDays * dailyRateEur);

    const damageEur = Math.max(0, roundEur(input.damageEur ?? 0));
    const cleaningEur = Math.max(0, roundEur(input.cleaningEur ?? 0));
    const otherEur = Math.max(0, roundEur((input.tollsEur ?? 0) + (input.finesEur ?? 0)));

    const totalChargesEur = roundEur(
        fuelPenaltyEur + extraKmPenaltyEur + latePenaltyEur + damageEur + cleaningEur + otherEur
    );

    const depositEur = quote.depositEur;
    const depositRefundEur = Math.max(0, depositEur - totalChargesEur);
    const amountDueByClientEur = Math.max(0, totalChargesEur - depositEur);

    return {
        days,
        includedKm,
        drivenKm,
        extraKm,
        fuelPenaltyEur,
        extraKmPenaltyEur,
        latePenaltyEur,
        damageEur,
        cleaningEur,
        otherEur,
        totalChargesEur,
        totalChargesMad: roundEur(totalChargesEur * MAD_PER_EUR),
        depositEur,
        depositRefundEur,
        depositRefundMad: roundEur(depositRefundEur * MAD_PER_EUR),
        amountDueByClientEur,
        amountDueByClientMad: roundEur(amountDueByClientEur * MAD_PER_EUR),
    };
}

// ---------------------------------------------------------------------------
// Référence de dossier (avec clé de contrôle anti-énumération)
// ---------------------------------------------------------------------------

const REF_ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function bookingRefCheckDigit(digits: string): string {
    let sum = 0;
    for (let i = 0; i < digits.length; i += 1) {
        sum += Number(digits[i]) * (i + 7);
    }
    return REF_ALPHABET[sum % REF_ALPHABET.length];
}

export function generateBookingRef(random: () => number = Math.random): string {
    const n = Math.floor(random() * 90_000) + 10_000;
    const digits = String(n).padStart(5, "0");
    return `ZW-${digits}${bookingRefCheckDigit(digits)}`;
}

export function isValidBookingRef(ref: string): boolean {
    if (typeof ref !== "string") return false;
    const match = /^ZW-(\d{5})([0-9A-Z])$/.exec(ref);
    if (!match) return false;
    return bookingRefCheckDigit(match[1]) === match[2];
}

// ---------------------------------------------------------------------------
// Cycle de vie : quels emails, quand, une seule fois
// ---------------------------------------------------------------------------

export type LifecycleEmailType = "j7_prepare" | "j1_pickup" | "j0_checkin" | "j1_review" | "j30_rebook";

export interface LifecycleEmail {
    type: LifecycleEmailType;
    sendAt: string;
    key: string;
}

const DAY = 86_400_000;

export function planLifecycleEmails(booking: {
    ref: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
}): LifecycleEmail[] {
    const pickup = toUtcMs(booking.pickupDate, booking.pickupTime);
    // Les rappels partent à 9h00 heure locale du jour concerné, pas 7×24h avant
    // l'heure exacte de prise en charge (sinon un vol à 22h envoie le J-7 à 15h).
    const pickupDay = toUtcMs(booking.pickupDate, "00:00");
    const dropoffDay = toUtcMs(booking.returnDate, "00:00");

    const schedule: Array<{ type: LifecycleEmailType; at: number }> = [
        { type: "j7_prepare", at: pickupDay - 7 * DAY + 9 * 3_600_000 },
        { type: "j1_pickup", at: pickupDay - DAY + 9 * 3_600_000 },
        { type: "j0_checkin", at: pickup - 2 * 3_600_000 },
        { type: "j1_review", at: dropoffDay + DAY + 11 * 3_600_000 },
        { type: "j30_rebook", at: dropoffDay + 30 * DAY + 10 * 3_600_000 },
    ];

    return schedule.map((item) => ({
        type: item.type,
        sendAt: new Date(item.at).toISOString(),
        key: `${booking.ref}:${item.type}`,
    }));
}

const LIFECYCLE_STATUSES: Record<LifecycleEmailType, BookingStatus[]> = {
    j7_prepare: ["confirmed"],
    j1_pickup: ["confirmed"],
    j0_checkin: ["confirmed", "awaiting_payment"],
    j1_review: ["completed", "checked_out"],
    j30_rebook: ["completed", "checked_out"],
};

export function dueLifecycleEmails(
    booking: BookingRecord,
    now: Date = new Date(),
    alreadySent: string[] = []
): LifecycleEmail[] {
    const sent = new Set(alreadySent);
    return planLifecycleEmails({ ...booking.rental, ref: booking.ref }).filter(
        (email) =>
            !sent.has(email.key) &&
            LIFECYCLE_STATUSES[email.type].includes(booking.status) &&
            new Date(email.sendAt).getTime() <= now.getTime()
    );
}

// ---------------------------------------------------------------------------
// Dossier (shape partagée entre le store, les routes et l'UI)
// ---------------------------------------------------------------------------

export interface BookingClient {
    fullName: string;
    email: string;
    phone: string;
    flightNumber?: string;
    notes?: string;
}

export interface BookingRental {
    vehicleId: string;
    vehicleName: string;
    vehicleCategory?: string;
    vehicleImage?: string;
    transmission: Transmission;
    pickupHub: string;
    hubName: string;
    returnHub: string;
    airportCode?: string;
    meetingPointDetail?: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    days: number;
}

export interface BookingEvent {
    at: string;
    type: string;
    actor: "client" | "vendor" | "system";
    note?: string;
}

export interface BookingRecord {
    ref: string;
    version: number;
    status: BookingStatus;
    locale: Locale;
    createdAt: string;
    updatedAt: string;
    accessToken: string;
    client: BookingClient;
    rental: BookingRental;
    quote: Quote;
    paidEur: number;
    events: BookingEvent[];
    lifecycleSent: string[];
    checkin?: {
        at: string;
        fuelLevel: FuelLevel;
        mileageKm: number;
        photos: number;
        driverAge: number;
        licenseIssuedAt: string;
    };
    checkout?: {
        at: string;
        result: CheckOutResult;
        photos: number;
        notes?: string;
    };
    stripeSessionId?: string;
    /** Complément à encaisser après une modification de dates (calculé serveur). */
    pendingPayment?: { kind: "acompte" | "change"; amountEur: number; createdAt: string };
}

/** Projection envoyée au navigateur : jamais de token ni d'événements internes. */
export interface PublicBooking {
    ref: string;
    status: BookingStatus;
    locale: Locale;
    createdAt: string;
    updatedAt: string;
    client: { fullName: string; email: string; phone: string; flightNumber?: string; notes?: string };
    rental: BookingRental;
    quote: Quote;
    paidEur: number;
    lifecycle: LifecycleEmail[];
}

export function toPublicBooking(record: BookingRecord): PublicBooking {
    return {
        ref: record.ref,
        status: record.status,
        locale: record.locale,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt,
        client: record.client,
        rental: record.rental,
        quote: record.quote,
        paidEur: record.paidEur,
        lifecycle: planLifecycleEmails({ ...record.rental, ref: record.ref }),
    };
}

/** Adaptateur vers l'ancien format "voucher" consommé par /booking/[ref]. */
export function buildVoucher(record: BookingRecord) {
    const { rental, quote } = record;
    return {
        ref: record.ref,
        createdAt: record.createdAt,
        status: record.status,
        client: {
            fullName: record.client.fullName,
            phone: record.client.phone,
            email: record.client.email,
            flightNumber: record.client.flightNumber ?? "À préciser",
            notes: record.client.notes ?? "",
        },
        rental: {
            vehicleId: rental.vehicleId,
            vehicleName: rental.vehicleName,
            vehicleCategory: rental.vehicleCategory ?? "",
            vehicleImage: rental.vehicleImage ?? "",
            pickupHub: rental.pickupHub,
            hubName: rental.hubName,
            airportName: rental.hubName,
            airportCode: rental.airportCode ?? "",
            meetingPointDetail: rental.meetingPointDetail ?? "",
            pickupDate: rental.pickupDate,
            returnDate: rental.returnDate,
            days: rental.days,
            fuelPolicy: "Niveau identique (Same-to-Same)",
            depositPolicy: quote.hasZeroDeposit ? "0 € de caution" : `${quote.depositEur} € de caution`,
        },
        financials: {
            currency: quote.currency,
            dailyPriceEur: quote.dailyRateEur,
            dailyPriceMad: quote.dailyRateMad,
            vendorUpsellsEur: 0,
            vendorUpsellsMad: 0,
            platformUpsellsEur: quote.extrasEur,
            platformUpsellsMad: quote.extrasMad,
            depositAcompteEur: quote.acompteEur,
            depositAcompteMad: quote.acompteMad,
            balanceOnSiteEur: quote.balanceEur,
            balanceOnSiteMad: quote.balanceMad,
            selectedUpsells: quote.upsells,
            totalEur: quote.totalEur,
            totalMad: quote.totalMad,
            cautionEur: quote.depositEur,
            cautionMad: quote.depositMad,
        },
    };
}

// ---------------------------------------------------------------------------
// Validation des entrées API (aucune confiance dans le client)
// ---------------------------------------------------------------------------

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; errors: string[] };

export interface CreateBookingInput {
    vehicleId: string;
    pickupHub: string;
    returnHub?: string;
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
    upsells: string[];
    driverAge?: number;
    currency: Currency;
    locale: Locale;
    client: { fullName: string; email: string; phone: string; flightNumber?: string; notes?: string };
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const PHONE = /^\+?[0-9][0-9\s().-]{6,19}$/;
const LOCALES: Locale[] = ["fr", "en", "es", "nl"];

export function validateCreateBooking(input: unknown): ValidationResult<CreateBookingInput> {
    const errors: string[] = [];
    if (!input || typeof input !== "object") {
        return { ok: false, errors: ["Corps de requête invalide"] };
    }
    const body = input as Record<string, unknown>;

    const vehicleId = typeof body.vehicleId === "string" ? body.vehicleId.trim() : "";
    if (!vehicleId) errors.push("vehicleId requis");

    const pickupHub = typeof body.pickupHub === "string" ? body.pickupHub.trim() : "";
    if (!pickupHub) errors.push("pickupHub requis");

    const pickupDate = body.pickupDate;
    const returnDate = body.returnDate;
    const pickupTime = body.pickupTime;
    const returnTime = body.returnTime;

    if (!isValidIsoDate(pickupDate)) errors.push("pickupDate invalide (YYYY-MM-DD)");
    if (!isValidIsoDate(returnDate)) errors.push("returnDate invalide (YYYY-MM-DD)");
    if (!isValidTime(pickupTime)) errors.push("pickupTime invalide (HH:MM)");
    if (!isValidTime(returnTime)) errors.push("returnTime invalide (HH:MM)");

    if (typeof pickupDate === "string" && typeof returnDate === "string" && isValidIsoDate(pickupDate) && isValidIsoDate(returnDate)) {
        if (toUtcMs(returnDate, typeof returnTime === "string" && isValidTime(returnTime) ? returnTime : "00:00") <=
            toUtcMs(pickupDate, typeof pickupTime === "string" && isValidTime(pickupTime) ? pickupTime : "00:00")) {
            errors.push("La restitution doit être postérieure à la prise en charge");
        }
    }

    const upsellsRaw = Array.isArray(body.upsells) ? body.upsells : [];
    const upsells = upsellsRaw.filter((id): id is string => typeof id === "string" && UPSELL_IDS.includes(id));
    if (upsellsRaw.length !== upsells.length) {
        errors.push("Option inconnue dans le panier");
    }

    const currency: Currency = body.currency === "MAD" ? "MAD" : "EUR";
    const locale: Locale = LOCALES.includes(body.locale as Locale) ? (body.locale as Locale) : "fr";

    const rawClient = (body.client ?? {}) as Record<string, unknown>;
    const fullName = typeof rawClient.fullName === "string" ? rawClient.fullName.trim() : "";
    const email = typeof rawClient.email === "string" ? rawClient.email.trim().toLowerCase() : "";
    const phone = typeof rawClient.phone === "string" ? rawClient.phone.trim() : "";

    if (fullName.length < 2 || fullName.length > 120) errors.push("Nom du client invalide");
    if (!EMAIL.test(email)) errors.push("Email invalide");
    if (!PHONE.test(phone)) errors.push("Téléphone invalide");

    const driverAge = typeof body.driverAge === "number" ? body.driverAge : Number(body.driverAge);
    if (body.driverAge !== undefined && (!Number.isFinite(driverAge) || driverAge < 18 || driverAge > 99)) {
        errors.push("Âge conducteur invalide");
    }

    if (errors.length > 0) return { ok: false, errors };

    return {
        ok: true,
        value: {
            vehicleId,
            pickupHub,
            returnHub: typeof body.returnHub === "string" && body.returnHub.trim() ? body.returnHub.trim() : undefined,
            pickupDate: pickupDate as string,
            pickupTime: pickupTime as string,
            returnDate: returnDate as string,
            returnTime: returnTime as string,
            upsells,
            driverAge: body.driverAge === undefined ? undefined : driverAge,
            currency,
            locale,
            client: {
                fullName,
                email,
                phone,
                flightNumber:
                    typeof rawClient.flightNumber === "string" ? rawClient.flightNumber.trim().slice(0, 20) : undefined,
                notes: typeof rawClient.notes === "string" ? rawClient.notes.trim().slice(0, 500) : undefined,
            },
        },
    };
}

/** Un conducteur peut-il louer ce véhicule (permis, âge) ? */
export function isVehicleEligible(vehicle: VehicleRate, driverAge?: number): boolean {
    if (!driverAge) return true;
    if (driverAge < 21) return false;
    if (vehicle.seats >= 7 && driverAge < 25) return true;
    return true;
}
