"use client";

declare global {
    interface Window {
        dataLayer: Record<string, unknown>[];
        gtag?: (...args: unknown[]) => void;
    }
}

/**
 * Pousse un événement standardisé dans window.dataLayer pour Google Tag Manager et GA4.
 */
export function pushDataLayer(event: string, params: Record<string, unknown> = {}): void {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event,
        ...params,
    });
}

/**
 * Consultation d'un véhicule dans le catalogue ou sur une landing page
 */
export function trackViewItem(car: {
    id: string;
    name: string;
    category?: string;
    dailyPriceEur?: number;
    dailyPriceMad?: number;
    currency?: string;
}, hub?: string): void {
    pushDataLayer("view_item", {
        item_id: car.id,
        item_name: car.name,
        item_category: car.category || "Location Voiture",
        value: car.dailyPriceEur || 25,
        currency: car.currency || "EUR",
        city: hub || "maroc",
        pickup_hub: hub || "maroc",
    });
}

/**
 * Ouverture du tunnel de réservation / devis (Panier initial)
 */
export function trackBeginCheckout(params: {
    vehicleId: string;
    vehicleName: string;
    valueEur: number;
    valueMad?: number;
    currency?: string;
    days: number;
    pickupHub: string;
    returnHub?: string;
    depositAcompteEur?: number;
    balanceOnSiteEur?: number;
    hasZeroDeposit?: boolean;
}): void {
    pushDataLayer("begin_checkout", {
        item_id: params.vehicleId,
        item_name: params.vehicleName,
        value: params.valueEur,
        currency: params.currency || "EUR",
        days: params.days,
        pickup_hub: params.pickupHub,
        return_hub: params.returnHub || params.pickupHub,
        acompte_value: params.depositAcompteEur || Math.round(params.valueEur * 0.2),
        balance_value: params.balanceOnSiteEur || Math.round(params.valueEur * 0.8),
        deposit_type: params.hasZeroDeposit ? "zero_deposit" : "standard",
    });
}

/**
 * Achat / Réservation confirmée avec acompte (Panier moyen & GMV)
 */
export function trackPurchase(params: {
    transactionId: string;
    valueEur: number;
    valueMad?: number;
    currency?: string;
    vehicleId: string;
    vehicleName: string;
    acompteEur?: number;
    balanceEur?: number;
    days: number;
    pickupHub: string;
    hasZeroDeposit?: boolean;
}): void {
    if (typeof window !== "undefined") {
        const storageKey = `zwincar_tracked_purchase_${params.transactionId}`;
        try {
            if (sessionStorage.getItem(storageKey)) return; // Anti-doublon refresh
            sessionStorage.setItem(storageKey, "1");
        } catch {
            // ignore quota
        }
    }

    pushDataLayer("purchase", {
        transaction_id: params.transactionId,
        value: params.valueEur,
        currency: params.currency || "EUR",
        acompte_value: params.acompteEur || Math.round(params.valueEur * 0.2),
        balance_value: params.balanceEur || Math.round(params.valueEur * 0.8),
        item_id: params.vehicleId,
        item_name: params.vehicleName,
        days: params.days,
        pickup_hub: params.pickupHub,
        deposit_type: params.hasZeroDeposit ? "zero_deposit" : "standard",
        items: [
            {
                item_id: params.vehicleId,
                item_name: params.vehicleName,
                price: params.valueEur,
                quantity: 1,
            },
        ],
    });
}

/**
 * Demande de lead / devis ou contact
 */
export function trackLead(params: {
    leadType: string;
    city?: string;
    value?: number;
    currency?: string;
}): void {
    pushDataLayer("generate_lead", {
        lead_type: params.leadType,
        city: params.city || "maroc",
        value: params.value || 30.0,
        currency: params.currency || "EUR",
    });
}

/**
 * Clic sur le bouton WhatsApp VIP Concierge
 */
export function trackWhatsAppClick(source: string, hub?: string): void {
    pushDataLayer("click_whatsapp", {
        source,
        hub: hub || "maroc",
        click_url: "https://wa.me/212720794046",
    });
}

/**
 * Recherche ou consultation d'un bon de réservation
 */
export function trackVoucherLookup(ref?: string): void {
    pushDataLayer("lookup_voucher", {
        transaction_id: ref || "unknown",
    });
}
