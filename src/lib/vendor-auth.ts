/**
 * ZwinCar Pro — Gestion de profil et authentification Loueurs Partenaires
 */

export interface VendorVehicle {
    id: string;
    name: string;
    plate: string;
    color: string;
    year?: number;
    transmission?: "Manuelle" | "Automatique";
    fuel?: "Diesel" | "Essence";
    dailyPriceMad?: number;
    dailyPriceEur?: number;
    status: "available" | "rented" | "blocked";
    currentLocation: string;
}

export interface VendorProfile {
    id: string;
    agencyName: string;
    cityHub: string;
    iceNumber: string;
    rcNumber: string;
    address: string;
    managerName: string;
    managerPhone: string;
    managerEmail: string;
    fleetSizeEstimate: string;
    createdAt: string;
}

export const DEFAULT_VENDOR_PROFILE: VendorProfile = {
    id: "vnd-atlas-drive",
    agencyName: "Atlas Drive Marrakech SARL",
    cityHub: "marrakech",
    iceNumber: "002847192000084",
    rcNumber: "94821 / Marrakech",
    address: "Avenue Mohammed VI, Guéliz, Marrakech",
    managerName: "Karim Benjelloun",
    managerPhone: "+212661234567",
    managerEmail: "contact@atlasdrive-marrakech.ma",
    fleetSizeEstimate: "15 à 30 véhicules",
    createdAt: "2026-01-15T10:00:00Z",
};

export const INITIAL_VENDOR_FLEET: VendorVehicle[] = [
    {
        id: "v-1",
        name: "Dacia Duster 4x4 Prestige",
        plate: "45821-B-26",
        color: "Gris Comète",
        year: 2024,
        transmission: "Manuelle",
        fuel: "Diesel",
        dailyPriceMad: 390,
        dailyPriceEur: 35,
        status: "available",
        currentLocation: "Parking P2 Menara",
    },
    {
        id: "v-2",
        name: "Renault Clio 5 Automatique",
        plate: "12903-A-26",
        color: "Blanc Glacier",
        year: 2024,
        transmission: "Automatique",
        fuel: "Essence",
        dailyPriceMad: 330,
        dailyPriceEur: 30,
        status: "rented",
        currentLocation: "En location (retour 18h)",
    },
    {
        id: "v-3",
        name: "Dacia Sandero Stepway",
        plate: "78210-B-26",
        color: "Orange Atacama",
        year: 2025,
        transmission: "Manuelle",
        fuel: "Essence",
        dailyPriceMad: 260,
        dailyPriceEur: 24,
        status: "available",
        currentLocation: "Garage Guéliz",
    },
    {
        id: "v-4",
        name: "Hyundai Tucson BVA Luxe",
        plate: "33190-A-26",
        color: "Noir Ebène",
        year: 2024,
        transmission: "Automatique",
        fuel: "Diesel",
        dailyPriceMad: 590,
        dailyPriceEur: 54,
        status: "blocked",
        currentLocation: "Bloqué manuellement (Client WhatsApp direct)",
    },
];

const STORAGE_KEY_PROFILE = "zwincar_vendor_profile";
const STORAGE_KEY_FLEET = "zwincar_vendor_fleet";
const STORAGE_KEY_AUTH = "zwincar_vendor_authenticated";

export function getStoredVendorProfile(): VendorProfile {
    if (typeof window === "undefined") return DEFAULT_VENDOR_PROFILE;
    try {
        const raw = localStorage.getItem(STORAGE_KEY_PROFILE);
        if (raw) return JSON.parse(raw);
    } catch {
        // fallback
    }
    return DEFAULT_VENDOR_PROFILE;
}

export function saveVendorProfile(profile: VendorProfile): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
        localStorage.setItem(STORAGE_KEY_AUTH, "true");
    } catch {
        // ignore
    }
}

export function getStoredVendorFleet(): VendorVehicle[] {
    if (typeof window === "undefined") return INITIAL_VENDOR_FLEET;
    try {
        const raw = localStorage.getItem(STORAGE_KEY_FLEET);
        if (raw) return JSON.parse(raw);
    } catch {
        // fallback
    }
    return INITIAL_VENDOR_FLEET;
}

export function saveVendorFleet(fleet: VendorVehicle[]): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEY_FLEET, JSON.stringify(fleet));
    } catch {
        // ignore
    }
}

export function isVendorAuthenticated(): boolean {
    if (typeof window === "undefined") return true;
    try {
        return localStorage.getItem(STORAGE_KEY_AUTH) === "true";
    } catch {
        return true;
    }
}

export function logoutVendor(): void {
    if (typeof window === "undefined") return;
    try {
        localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {
        // ignore
    }
}
