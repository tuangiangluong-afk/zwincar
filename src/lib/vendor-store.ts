/**
 * ZwinCar Pro — Store serveur Loueurs Partenaires & Flotte Réelle.
 *
 * Gère l'inscription, la session sécurisée, la flotte physique par agence
 * et la liaison avec les dossiers de réservation du hub.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getBookingStore } from "./booking-store.ts";
import type { BookingRecord } from "./booking-engine.ts";

export interface VendorVehicleRecord {
    id: string;
    agencyId: string;
    catalogModelId?: string;
    name: string;
    plate: string;
    color: string;
    year: number;
    transmission: "Manuelle" | "Automatique";
    fuel: "Diesel" | "Essence";
    dailyPriceMad: number;
    dailyPriceEur: number;
    status: "available" | "rented" | "blocked";
    currentLocation: string;
    createdAt: string;
}

export interface VendorAgencyRecord {
    id: string;
    agencyName: string;
    cityHub: string;
    iceNumber: string;
    rcNumber: string;
    address: string;
    managerName: string;
    managerPhone: string;
    managerEmail: string;
    passwordHash: string;
    salt: string;
    fleetSizeEstimate: string;
    status: "active" | "suspended" | "onboarding";
    createdAt: string;
}

const SCRYPT_KEYLEN = 64;
const SCRYPT_COST = { N: 16384, r: 8, p: 1 }; // ~100ms on commodity hardware

function hashPassword(password: string, salt: string): string {
    return scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_COST).toString("hex");
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
    const derived = scryptSync(password, salt, SCRYPT_KEYLEN, SCRYPT_COST);
    const expected = Buffer.from(storedHash, "hex");
    return derived.length === expected.length && timingSafeEqual(derived, expected);
}

// ---------------------------------------------------------------------------
// Store Mémoire & Fallback
// ---------------------------------------------------------------------------

const globalVendors = globalThis as unknown as {
    __zwincarAgencies?: Map<string, VendorAgencyRecord>;
    __zwincarFleet?: Map<string, VendorVehicleRecord>;
    __zwincarSessions?: Map<string, { agencyId: string; expiresAt: number }>;
};

if (!globalVendors.__zwincarAgencies) {
    globalVendors.__zwincarAgencies = new Map();
    globalVendors.__zwincarFleet = new Map();
    globalVendors.__zwincarSessions = new Map();

    // Agence témoin par défaut : Atlas Drive Marrakech
    const demoSalt = "demo_salt_atlas_2026";
    // Pre-computed scrypt hash of "Marrakech2026!" with the demo salt.
    const demoHash = "cbdb8eb9aa660c400ba36aef80aee913c674d795fc46a28bf611f41243838ca8e42b4db78895a94b5f41025d680475b731286c42111115efc222e9c524e391f1";
    const demoAgency: VendorAgencyRecord = {
        id: "vnd-atlas-drive",
        agencyName: "Atlas Drive Marrakech SARL",
        cityHub: "marrakech",
        iceNumber: "002847192000084",
        rcNumber: "94821 / Marrakech",
        address: "Avenue Mohammed VI, Guéliz, Marrakech",
        managerName: "Karim Benjelloun",
        managerPhone: "+212661234567",
        managerEmail: "contact@atlasdrive-marrakech.ma",
        passwordHash: demoHash,
        salt: demoSalt,
        fleetSizeEstimate: "15 à 30 véhicules",
        status: "active",
        createdAt: "2026-01-15T10:00:00Z",
    };
    globalVendors.__zwincarAgencies.set(demoAgency.id, demoAgency);

    const demoFleet: VendorVehicleRecord[] = [
        {
            id: "v-1",
            agencyId: demoAgency.id,
            catalogModelId: "dacia-duster-4x4",
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
            createdAt: "2026-01-15T10:00:00Z",
        },
        {
            id: "v-2",
            agencyId: demoAgency.id,
            catalogModelId: "renault-clio-5-auto",
            name: "Renault Clio 5 Automatique",
            plate: "12903-A-26",
            color: "Blanc Glacier",
            year: 2024,
            transmission: "Automatique",
            fuel: "Essence",
            dailyPriceMad: 330,
            dailyPriceEur: 30,
            status: "available",
            currentLocation: "Parking Menara Dépose Express",
            createdAt: "2026-01-15T10:00:00Z",
        },
        {
            id: "v-3",
            agencyId: demoAgency.id,
            catalogModelId: "dacia-sandero-stepway",
            name: "Dacia Sandero Stepway",
            plate: "78210-B-26",
            color: "Orange Atacama",
            year: 2025,
            transmission: "Manuelle",
            fuel: "Diesel",
            dailyPriceMad: 260,
            dailyPriceEur: 24,
            status: "available",
            currentLocation: "Garage Guéliz",
            createdAt: "2026-01-15T10:00:00Z",
        },
        {
            id: "v-4",
            agencyId: demoAgency.id,
            catalogModelId: "hyundai-tucson-auto",
            name: "Hyundai Tucson BVA Luxe",
            plate: "33190-A-26",
            color: "Noir Ebène",
            year: 2024,
            transmission: "Automatique",
            fuel: "Diesel",
            dailyPriceMad: 590,
            dailyPriceEur: 54,
            status: "blocked",
            currentLocation: "Bloqué manuellement (Client direct)",
            createdAt: "2026-01-15T10:00:00Z",
        },
    ];

    for (const v of demoFleet) {
        globalVendors.__zwincarFleet.set(v.id, v);
    }
}

function getSupabaseClient(): SupabaseClient | null {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !serviceKey) return null;
    return createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
}

// ---------------------------------------------------------------------------
// Méthodes Publiques du Store Loueur
// ---------------------------------------------------------------------------

export interface RegisterAgencyInput {
    agencyName: string;
    cityHub: string;
    iceNumber: string;
    rcNumber?: string;
    address?: string;
    managerName: string;
    managerPhone: string;
    managerEmail: string;
    password: string;
    fleetSizeEstimate?: string;
    firstCar: {
        model: string;
        plate: string;
        color?: string;
        year?: number;
        transmission?: "Manuelle" | "Automatique";
        fuel?: "Diesel" | "Essence";
        dailyPriceMad?: number;
        dailyPriceEur?: number;
    };
}

export async function registerVendorAgency(input: RegisterAgencyInput): Promise<{
    agency: Omit<VendorAgencyRecord, "passwordHash" | "salt">;
    token: string;
}> {
    const emailLower = input.managerEmail.trim().toLowerCase();
    const phoneClean = input.managerPhone.replace(/[^0-9+]/g, "");

    // Vérifier doublon
    for (const a of globalVendors.__zwincarAgencies!.values()) {
        if (a.managerEmail.toLowerCase() === emailLower || a.managerPhone.replace(/[^0-9+]/g, "") === phoneClean) {
            throw new Error("Une agence avec cet email ou ce numéro WhatsApp existe déjà.");
        }
    }

    const salt = randomBytes(16).toString("hex");
    const passwordHash = hashPassword(input.password, salt);
    const agencyId = `vnd-${randomBytes(6).toString("hex")}`;

    const agencyRecord: VendorAgencyRecord = {
        id: agencyId,
        agencyName: input.agencyName.trim(),
        cityHub: input.cityHub.trim().toLowerCase(),
        iceNumber: input.iceNumber.trim(),
        rcNumber: input.rcNumber?.trim() || "En cours",
        address: input.address?.trim() || "Aéroport / Centre-ville",
        managerName: input.managerName.trim(),
        managerPhone: input.managerPhone.trim(),
        managerEmail: input.managerEmail.trim(),
        passwordHash,
        salt,
        fleetSizeEstimate: input.fleetSizeEstimate || "10 à 25 véhicules",
        status: "active",
        createdAt: new Date().toISOString(),
    };

    globalVendors.__zwincarAgencies!.set(agencyId, agencyRecord);

    // Première voiture
    const carId = `v-${randomBytes(6).toString("hex")}`;
    const priceMad = input.firstCar.dailyPriceMad || 280;
    const priceEur = input.firstCar.dailyPriceEur || Math.round(priceMad / 11);

    const firstCarRecord: VendorVehicleRecord = {
        id: carId,
        agencyId,
        name: input.firstCar.model,
        plate: input.firstCar.plate.trim(),
        color: input.firstCar.color || "Blanc Glacier",
        year: input.firstCar.year || 2024,
        transmission: input.firstCar.transmission || "Manuelle",
        fuel: input.firstCar.fuel || "Diesel",
        dailyPriceMad: priceMad,
        dailyPriceEur: priceEur,
        status: "available",
        currentLocation: `Parking Aéroport ${agencyRecord.cityHub.toUpperCase()}`,
        createdAt: new Date().toISOString(),
    };

    globalVendors.__zwincarFleet!.set(carId, firstCarRecord);

    // Sync Supabase si accessible
    const sb = getSupabaseClient();
    if (sb) {
        try {
            await sb.from("agencies").insert({
                name: agencyRecord.agencyName,
                city_slug: agencyRecord.cityHub,
                manager_name: agencyRecord.managerName,
                whatsapp_phone: agencyRecord.managerPhone,
                email: agencyRecord.managerEmail,
                status: "active",
            });
        } catch (e) {
            console.warn("Supabase agency sync failed (fallback memory used):", e);
        }
    }

    const token = createVendorSession(agencyId);
    const { passwordHash: _p, salt: _s, ...safeAgency } = agencyRecord;
    return { agency: safeAgency, token };
}

export async function authenticateVendor(
    identifier: string,
    passwordPlain: string
): Promise<{
    agency: Omit<VendorAgencyRecord, "passwordHash" | "salt">;
    token: string;
} | null> {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPhone = identifier.replace(/[^0-9+]/g, "");

    let found: VendorAgencyRecord | null = null;
    for (const a of globalVendors.__zwincarAgencies!.values()) {
        if (
            a.managerEmail.toLowerCase() === cleanId ||
            a.managerPhone.replace(/[^0-9+]/g, "") === cleanPhone ||
            cleanId.includes(a.cityHub)
        ) {
            found = a;
            break;
        }
    }

    if (!found) return null;

    if (!verifyPassword(passwordPlain, found.salt, found.passwordHash)) {
        return null;
    }

    const token = createVendorSession(found.id);
    const { passwordHash: _p, salt: _s, ...safeAgency } = found;
    return { agency: safeAgency, token };
}

export function createVendorSession(agencyId: string): string {
    const token = `zwin_vnd_${randomBytes(24).toString("hex")}`;
    const expiresAt = Date.now() + 30 * 86_400_000; // 30 jours
    globalVendors.__zwincarSessions!.set(token, { agencyId, expiresAt });
    return token;
}

export function getVendorFromToken(token: string): Omit<VendorAgencyRecord, "passwordHash" | "salt"> | null {
    if (!token) return null;
    const session = globalVendors.__zwincarSessions!.get(token);
    if (!session || session.expiresAt < Date.now()) {
        return null;
    }
    const agency = globalVendors.__zwincarAgencies!.get(session.agencyId);
    if (!agency) return null;
    const { passwordHash: _p, salt: _s, ...safeAgency } = agency;
    return safeAgency;
}

export function revokeVendorSession(token: string): void {
    globalVendors.__zwincarSessions!.delete(token);
}

export function getVendorFleet(agencyId: string): VendorVehicleRecord[] {
    const fleet: VendorVehicleRecord[] = [];
    for (const v of globalVendors.__zwincarFleet!.values()) {
        if (v.agencyId === agencyId) {
            fleet.push(structuredClone(v));
        }
    }
    return fleet.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addVendorVehicle(
    agencyId: string,
    car: {
        name: string;
        plate: string;
        color?: string;
        year?: number;
        transmission?: "Manuelle" | "Automatique";
        fuel?: "Diesel" | "Essence";
        dailyPriceMad?: number;
        dailyPriceEur?: number;
        currentLocation?: string;
    }
): VendorVehicleRecord {
    const id = `v-${Date.now()}`;
    const priceMad = car.dailyPriceMad || 280;
    const priceEur = car.dailyPriceEur || Math.round(priceMad / 11);

    const vehicle: VendorVehicleRecord = {
        id,
        agencyId,
        name: car.name,
        plate: car.plate.trim(),
        color: car.color || "Blanc",
        year: car.year || 2024,
        transmission: car.transmission || "Manuelle",
        fuel: car.fuel || "Diesel",
        dailyPriceMad: priceMad,
        dailyPriceEur: priceEur,
        status: "available",
        currentLocation: car.currentLocation || "Parking Agence",
        createdAt: new Date().toISOString(),
    };

    globalVendors.__zwincarFleet!.set(id, vehicle);
    return vehicle;
}

export function setVendorVehicleStatus(
    agencyId: string,
    vehicleId: string,
    status: "available" | "blocked" | "rented"
): VendorVehicleRecord | null {
    const car = globalVendors.__zwincarFleet!.get(vehicleId);
    if (!car || car.agencyId !== agencyId) return null;

    car.status = status;
    globalVendors.__zwincarFleet!.set(vehicleId, car);
    return structuredClone(car);
}

/**
 * Récupère les réservations réelles de ZwinCar associées au hub de l'agence.
 */
export async function getVendorHubBookings(cityHub: string): Promise<BookingRecord[]> {
    const store = getBookingStore();
    const all = await store.list();
    const hubNormalized = cityHub.trim().toLowerCase();

    return all.filter((b) => {
        const pickup = b.rental.pickupHub.toLowerCase();
        return pickup === hubNormalized || pickup.includes(hubNormalized) || hubNormalized.includes(pickup);
    });
}
