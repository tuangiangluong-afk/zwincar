import test from "node:test";
import assert from "node:assert/strict";
import {
    recordWhatsAppMessage,
    getAllWhatsAppThreads,
    getWhatsAppThreadById,
    markWhatsAppThreadAsRead,
    processWhatsAppInboundPayload,
} from "../src/lib/whatsapp-chat-store.ts";
import { sendWhatsAppDirectText } from "../src/lib/whatsapp.ts";

test("WhatsApp Studio — enregistre un message entrant client et crée le thread", () => {
    const { thread, message } = recordWhatsAppMessage({
        phone: "+212 7 20 79 40 46",
        sender: "customer",
        text: "Bonjour ZwinCar, je souhaite des infos sur une location",
        customerName: "Marc L.",
    });

    assert.ok(thread);
    assert.equal(thread.id, "212720794046");
    assert.equal(thread.customerName, "Marc L.");
    assert.equal(thread.lastMessage, "Bonjour ZwinCar, je souhaite des infos sur une location");
    assert.equal(message.sender, "customer");
    assert.ok(thread.unreadCount >= 1);
});

test("WhatsApp Studio — traite un payload brut Meta Webhook (format Graph API v21.0)", async () => {
    const metaPayload = {
        object: "whatsapp_business_account",
        entry: [
            {
                id: "2045446579548940",
                changes: [
                    {
                        field: "messages",
                        value: {
                            messaging_product: "whatsapp",
                            metadata: { display_phone_number: "212720794046", phone_number_id: "1382758468252907" },
                            contacts: [{ profile: { name: "Mehdi Benani" }, wa_id: "212622334455" }],
                            messages: [
                                {
                                    from: "212622334455",
                                    id: "wamid.HBgNMjEyNjIyMzM0NDU1FQIAEhgg",
                                    timestamp: "1730005000",
                                    text: { body: "Bonjour ZwinCar, est-ce que le Duster est disponible pour 5 jours à Marrakech ?" },
                                    type: "text",
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };

    const res = await processWhatsAppInboundPayload(metaPayload);
    assert.equal(res.success, true);
    assert.equal(res.processedCount, 1);

    const thread = getWhatsAppThreadById("212622334455");
    assert.ok(thread);
    assert.equal(thread.customerName, "Mehdi Benani");
    assert.equal(thread.lastMessage, "Bonjour ZwinCar, est-ce que le Duster est disponible pour 5 jours à Marrakech ?");
    assert.ok(thread.unreadCount >= 1);
});

test("WhatsApp Studio — l'admin répond au client et le fil est mis à jour", async () => {
    const customerPhone = "212655443322";

    // Client envoie
    recordWhatsAppMessage({
        phone: customerPhone,
        sender: "customer",
        text: "Pouvez-vous livrer au Riad dans la médina de Marrakech ?",
        customerName: "Camille Dupont",
    });

    // Admin répond
    const adminReplyText = "Bonjour Camille ! Oui tout à fait, la livraison à votre riad est offerte et incluse.";
    const sendResult = await sendWhatsAppDirectText({
        toPhone: customerPhone,
        message: adminReplyText,
    });
    assert.equal(sendResult.success, true);

    const { thread: updatedThread, message: replyMsg } = recordWhatsAppMessage({
        phone: customerPhone,
        sender: "admin",
        text: adminReplyText,
        messageId: sendResult.messageId,
        status: "sent",
    });

    assert.ok(updatedThread);
    assert.equal(updatedThread.lastMessage, adminReplyText);
    assert.equal(replyMsg.sender, "admin");

    // Marquer comme lu
    const readSuccess = markWhatsAppThreadAsRead(customerPhone);
    assert.equal(readSuccess, true);
    const readThread = getWhatsAppThreadById(customerPhone);
    assert.equal(readThread?.unreadCount, 0);
});

test("WhatsApp Studio — liste toutes les conversations triées par activité", () => {
    const all = getAllWhatsAppThreads();
    assert.ok(Array.isArray(all));
    assert.ok(all.length >= 3);

    // Vérifier que c'est trié par date décroissante
    for (let i = 0; i < all.length - 1; i++) {
        const t1 = new Date(all[i].lastMessageAt).getTime();
        const t2 = new Date(all[i + 1].lastMessageAt).getTime();
        assert.ok(t1 >= t2, `Le thread ${i} doit être plus récent que ${i + 1}`);
    }
});
