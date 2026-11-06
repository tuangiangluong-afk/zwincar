/**
 * Persistance des dossiers de location.
 *
 * Deux backends, même contrat :
 *  - Supabase (table `rental_bookings`) dès que SUPABASE_SERVICE_ROLE_KEY existe
 *    en production : c'est la seule source de vérité, avec contrôle de version
 *    optimiste pour éviter deux écritures concurrentes (double check-out).
 *  - Mémoire process (dev / preview sans base) : permet de tester le parcours
 *    complet localement sans configuration. Volontairement éphémère.
 *
 * Le store ne calcule jamais de prix : il stocke ce que le moteur a produit.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { BookingRecord } from "./booking-engine";

export interface BookingStore {
    readonly kind: "supabase" | "memory";
    create(record: BookingRecord): Promise<BookingRecord>;
    get(ref: string): Promise<BookingRecord | null>;
    save(record: BookingRecord, expectedVersion: number): Promise<BookingRecord>;
    list(filter?: { status?: string[]; from?: string; to?: string; email?: string }): Promise<BookingRecord[]>;
}

export class VersionConflictError extends Error {
    constructor(ref: string) {
        super(`Conflit de version sur le dossier ${ref}`);
        this.name = "VersionConflictError";
    }
}

// ---------------------------------------------------------------------------
// Backend mémoire
// ---------------------------------------------------------------------------

const globalStore = globalThis as unknown as { __zwincarBookings?: Map<string, BookingRecord> };

function memoryMap(): Map<string, BookingRecord> {
    if (!globalStore.__zwincarBookings) {
        globalStore.__zwincarBookings = new Map();
    }
    return globalStore.__zwincarBookings;
}

class MemoryBookingStore implements BookingStore {
    readonly kind = "memory" as const;

    async create(record: BookingRecord): Promise<BookingRecord> {
        if (memoryMap().has(record.ref)) {
            throw new Error(`La référence ${record.ref} existe déjà`);
        }
        memoryMap().set(record.ref, structuredClone(record));
        return record;
    }

    async get(ref: string): Promise<BookingRecord | null> {
        const stored = memoryMap().get(ref);
        return stored ? structuredClone(stored) : null;
    }

    async save(record: BookingRecord, expectedVersion: number): Promise<BookingRecord> {
        const current = memoryMap().get(record.ref);
        if (!current) throw new Error(`Dossier ${record.ref} introuvable`);
        if (current.version !== expectedVersion) throw new VersionConflictError(record.ref);
        const next: BookingRecord = { ...structuredClone(record), version: expectedVersion + 1 };
        memoryMap().set(record.ref, next);
        return next;
    }

    async list(filter: { status?: string[]; from?: string; to?: string; email?: string } = {}): Promise<BookingRecord[]> {
        return Array.from(memoryMap().values())
            .filter((record) => !filter.status || filter.status.includes(record.status))
            .filter((record) => !filter.from || record.rental.pickupDate >= filter.from)
            .filter((record) => !filter.to || record.rental.pickupDate <= filter.to)
            .filter((record) => !filter.email || record.client.email.toLowerCase() === filter.email.toLowerCase().trim())
            .map((record) => structuredClone(record));
    }
}

// ---------------------------------------------------------------------------
// Backend Supabase
// ---------------------------------------------------------------------------

interface BookingRow {
    ref: string;
    status: string;
    pickup_at: string;
    return_at: string;
    client_email: string;
    payload: BookingRecord;
}

class SupabaseBookingStore implements BookingStore {
    readonly kind = "supabase" as const;
    private client: SupabaseClient;

    constructor(url: string, serviceKey: string) {
        this.client = createClient(url, serviceKey, {
            auth: { persistSession: false, autoRefreshToken: false },
        });
    }

    private toRow(record: BookingRecord): BookingRow {
        return {
            ref: record.ref,
            status: record.status,
            pickup_at: `${record.rental.pickupDate}T${record.rental.pickupTime}:00Z`,
            return_at: `${record.rental.returnDate}T${record.rental.returnTime}:00Z`,
            client_email: record.client.email,
            payload: record,
        };
    }

    async create(record: BookingRecord): Promise<BookingRecord> {
        const { error } = await this.client.from("rental_bookings").insert(this.toRow(record));
        if (error) throw new Error(`Création du dossier impossible: ${error.message}`);
        return record;
    }

    async get(ref: string): Promise<BookingRecord | null> {
        const { data, error } = await this.client
            .from("rental_bookings")
            .select("payload")
            .eq("ref", ref)
            .maybeSingle();
        if (error) throw new Error(`Lecture du dossier impossible: ${error.message}`);
        return (data?.payload as BookingRecord) ?? null;
    }

    async save(record: BookingRecord, expectedVersion: number): Promise<BookingRecord> {
        const next: BookingRecord = {
            ...record,
            version: expectedVersion + 1,
            updatedAt: new Date().toISOString(),
        };
        const row = this.toRow(next);

        // Mise à jour conditionnelle : la version doit correspondre exactement.
        // Aucune ligne touchée => quelqu'un a écrit entre-temps => conflit.
        const { data, error } = await this.client
            .from("rental_bookings")
            .update({
                status: row.status,
                pickup_at: row.pickup_at,
                return_at: row.return_at,
                client_email: row.client_email,
                payload: row.payload,
                updated_at: next.updatedAt,
            })
            .eq("ref", record.ref)
            .eq("payload->>version", String(expectedVersion))
            .select("ref");

        if (error) throw new Error(`Mise à jour du dossier impossible: ${error.message}`);
        if (!data || data.length === 0) throw new VersionConflictError(record.ref);
        return next;
    }

    async list(filter: { status?: string[]; from?: string; to?: string; email?: string } = {}): Promise<BookingRecord[]> {
        let query = this.client.from("rental_bookings").select("payload");
        if (filter.status?.length) query = query.in("status", filter.status);
        if (filter.from) query = query.gte("pickup_at", `${filter.from}T00:00:00Z`);
        if (filter.to) query = query.lte("pickup_at", `${filter.to}T23:59:59Z`);
        if (filter.email) query = query.eq("client_email", filter.email.toLowerCase().trim());

        const { data, error } = await query.limit(500);
        if (error) throw new Error(`Liste des dossiers impossible: ${error.message}`);
        return (data ?? []).map((row) => row.payload as BookingRecord);
    }
}

// ---------------------------------------------------------------------------
// Sélection du backend
// ---------------------------------------------------------------------------

let singleton: BookingStore | null = null;

export function getBookingStore(): BookingStore {
    if (singleton) return singleton;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (url && serviceKey) {
        singleton = new SupabaseBookingStore(url, serviceKey);
    } else {
        if (process.env.NODE_ENV === "production") {
            console.warn(
                "⚠️  ZwinCar: SUPABASE_SERVICE_ROLE_KEY absente. Les réservations sont stockées en mémoire " +
                    "et seront perdues au redéploiement. Configurez Supabase avant d'encaisser de vrais paiements."
            );
        }
        singleton = new MemoryBookingStore();
    }

    return singleton;
}

/** Réservé aux tests : force la réinitialisation du singleton. */
export function __resetBookingStoreForTests(): void {
    singleton = null;
    memoryMap().clear();
}
