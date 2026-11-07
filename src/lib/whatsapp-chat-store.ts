/**
 * ZwinCar — WhatsApp Studio Conversation Store
 *
 * Gère le stockage persistant des conversations WhatsApp (inbound & outbound)
 * entre les clients et l'équipe ZwinCar (+212 7 20 79 40 46).
 *
 * Persistance mémoire (globalThis) + fichier local (/tmp/zwincar_whatsapp_threads.json)
 * pour résister aux redémarrages et cold starts.
 */

import fs from "node:fs";
import path from "node:path";
import { formatWhatsAppRecipientPhone } from "./whatsapp.ts";

export interface WhatsAppChatMessage {
    id: string;
    sender: "customer" | "admin" | "system";
    text: string;
    timestamp: string;
    status?: "sent" | "delivered" | "read" | "received" | "failed";
    rawMetadata?: Record<string, unknown>;
}

export interface WhatsAppChatThread {
    id: string; // Numéro formaté E.164 sans '+' (ex: "212720794046")
    phone: string; // Affichage (ex: "+212 7 20 79 40 46")
    customerName?: string;
    cityHub?: string;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    messages: WhatsAppChatMessage[];
    createdAt: string;
    updatedAt: string;
}

const STORAGE_FILE = path.join(process.cwd(), ".next", "zwincar_whatsapp_threads.json");
const TMP_BACKUP_FILE = "/tmp/zwincar_whatsapp_threads.json";

function formatDisplayPhone(raw: string): string {
    const digits = raw.replace(/[^0-9]/g, "");
    if (digits.startsWith("212") && digits.length >= 11) {
        // +212 7 20 79 40 46
        const rest = digits.slice(3);
        return `+212 ${rest.slice(0, 1)} ${rest.slice(1, 3)} ${rest.slice(3, 5)} ${rest.slice(5, 7)} ${rest.slice(7)}`;
    }
    if (digits.startsWith("33") && digits.length >= 11) {
        // +33 6 12 34 56 78
        const rest = digits.slice(2);
        return `+33 ${rest.slice(0, 1)} ${rest.slice(1, 3)} ${rest.slice(3, 5)} ${rest.slice(5, 7)} ${rest.slice(7)}`;
    }
    return `+${digits}`;
}

const globalStore = globalThis as unknown as {
    __zwincarWhatsAppThreads?: Map<string, WhatsAppChatThread>;
};

function loadPersistedThreads(): Map<string, WhatsAppChatThread> {
    const map = new Map<string, WhatsAppChatThread>();
    const filesToTry = [STORAGE_FILE, TMP_BACKUP_FILE];

    for (const filePath of filesToTry) {
        try {
            if (fs.existsSync(filePath)) {
                const raw = fs.readFileSync(filePath, "utf-8");
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    for (const thread of parsed) {
                        if (thread?.id) {
                            map.set(thread.id, thread);
                        }
                    }
                    if (map.size > 0) return map;
                }
            }
        } catch {
            // ignore & try next
        }
    }

    // Données de démonstration initiales si le store est vide
    const demoThread: WhatsAppChatThread = {
        id: "212720794046",
        phone: "+212 7 20 79 40 46",
        customerName: "Mohamed R.",
        cityHub: "marrakech",
        lastMessage: "Bonjour ZwinCar, je souhaite des infos sur une location",
        lastMessageAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        unreadCount: 1,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
        messages: [
            {
                id: "msg_demo_1",
                sender: "customer",
                text: "Bonjour ZwinCar, je souhaite des infos sur une location",
                timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
                status: "received",
            },
        ],
    };
    map.set(demoThread.id, demoThread);
    return map;
}

function persistThreads(map: Map<string, WhatsAppChatThread>): void {
    const array = Array.from(map.values());
    const data = JSON.stringify(array, null, 2);

    const filesToTry = [STORAGE_FILE, TMP_BACKUP_FILE];
    for (const filePath of filesToTry) {
        try {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(filePath, data, "utf-8");
        } catch {
            // ignore write error on readonly environments
        }
    }
}

function getStore(): Map<string, WhatsAppChatThread> {
    if (!globalStore.__zwincarWhatsAppThreads) {
        globalStore.__zwincarWhatsAppThreads = loadPersistedThreads();
    }
    return globalStore.__zwincarWhatsAppThreads;
}

/**
 * Enregistre un message entrant ou sortant dans la conversation WhatsApp
 */
export function recordWhatsAppMessage({
    phone,
    sender,
    text,
    customerName,
    cityHub,
    status = "received",
    messageId,
}: {
    phone: string;
    sender: "customer" | "admin" | "system";
    text: string;
    customerName?: string;
    cityHub?: string;
    status?: "sent" | "delivered" | "read" | "received" | "failed";
    messageId?: string;
}): { thread: WhatsAppChatThread; message: WhatsAppChatMessage } {
    const store = getStore();
    const cleanId = formatWhatsAppRecipientPhone(phone);
    const displayPhone = formatDisplayPhone(cleanId);
    const now = new Date().toISOString();

    let thread = store.get(cleanId);

    if (!thread) {
        thread = {
            id: cleanId,
            phone: displayPhone,
            customerName: customerName || "Visiteur ZwinCar",
            cityHub: cityHub || "maroc",
            lastMessage: text,
            lastMessageAt: now,
            unreadCount: sender === "customer" ? 1 : 0,
            messages: [],
            createdAt: now,
            updatedAt: now,
        };
    } else {
        thread.lastMessage = text;
        thread.lastMessageAt = now;
        thread.updatedAt = now;
        if (customerName) thread.customerName = customerName;
        if (cityHub && !thread.cityHub) thread.cityHub = cityHub;
        if (sender === "customer") {
            thread.unreadCount = (thread.unreadCount || 0) + 1;
        }
    }

    const message: WhatsAppChatMessage = {
        id: messageId || `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        sender,
        text,
        timestamp: now,
        status,
    };

    thread.messages.push(message);
    store.set(cleanId, thread);
    persistThreads(store);

    return { thread, message };
}

/**
 * Récupère toutes les conversations triées par date décroissante
 */
export function getAllWhatsAppThreads(): WhatsAppChatThread[] {
    const store = getStore();
    return Array.from(store.values()).sort(
        (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
}

/**
 * Récupère une conversation spécifique par son id (phone)
 */
export function getWhatsAppThreadById(phone: string): WhatsAppChatThread | null {
    const store = getStore();
    const cleanId = formatWhatsAppRecipientPhone(phone);
    return store.get(cleanId) || null;
}

/**
 * Marque tous les messages d'une conversation comme lus
 */
export function markWhatsAppThreadAsRead(phone: string): boolean {
    const store = getStore();
    const cleanId = formatWhatsAppRecipientPhone(phone);
    const thread = store.get(cleanId);
    if (!thread) return false;

    thread.unreadCount = 0;
    store.set(cleanId, thread);
    persistThreads(store);
    return true;
}

/**
 * Traite le payload webhook brut envoyé par Meta WhatsApp Cloud API
 */
export async function processWhatsAppInboundPayload(payload: any): Promise<{
    success: boolean;
    processedCount: number;
    messages: WhatsAppChatMessage[];
}> {
    if (payload?.object !== "whatsapp_business_account" || !Array.isArray(payload.entry)) {
        return { success: true, processedCount: 0, messages: [] };
    }

    const recordedMessages: WhatsAppChatMessage[] = [];

    for (const entry of payload.entry) {
        for (const change of entry.changes || []) {
            const value = change.value;
            if (!value || value.messaging_product !== "whatsapp") continue;

            const messages = value.messages || [];
            const contacts = value.contacts || [];

            for (const msg of messages) {
                const senderPhone = msg.from;
                const contact = contacts.find((c: any) => c.wa_id === senderPhone);
                const contactName = contact?.profile?.name || "Client WhatsApp";

                let messageBody = "";
                if (msg.type === "text" && msg.text?.body) {
                    messageBody = msg.text.body;
                } else if (msg.type === "button" && msg.button?.text) {
                    messageBody = `[Bouton cliqué] ${msg.button.text}`;
                } else if (msg.type === "interactive") {
                    messageBody =
                        msg.interactive?.button_reply?.title ||
                        msg.interactive?.list_reply?.title ||
                        "[Réponse interactive]";
                } else {
                    messageBody = `[Message type: ${msg.type}]`;
                }

                const { message } = recordWhatsAppMessage({
                    phone: senderPhone,
                    sender: "customer",
                    text: messageBody,
                    customerName: contactName,
                    messageId: msg.id,
                    status: "received",
                });
                recordedMessages.push(message);
            }
        }
    }

    return {
        success: true,
        processedCount: recordedMessages.length,
        messages: recordedMessages,
    };
}

