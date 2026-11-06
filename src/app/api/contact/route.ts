import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123'); // Safe fallback to avoid crash if env missing

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, subject, message, domain, city, confirm_email } = body;

        // HONEYPOT TRAP
        // If the hidden field is filled, it's a bot.
        // We return success to trick them into thinking it worked (and stop trying).
        if (confirm_email) {
            console.warn(`🤖 SPAM BOT BLOCKED: ${domain} - ${email}`);
            return NextResponse.json({ success: true, message: "Sent" });
        }

        // Validation simple
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
        }

        // Send Email via Resend
        // If API Key is not set, we just log it (Simulated Mode)
        if (!process.env.RESEND_API_KEY) {
            console.log("⚠️ SIMULATION RESEND (No API Key found)");
            console.log("To: compareandcash@gmail.com");
            console.log(`Subject: [${city}] Nouveau message de ${name}`);
            console.log("Body:", message);

            // Simulate delay
            await new Promise(r => setTimeout(r, 1000));
            return NextResponse.json({ success: true, simulated: true });
        }

        const fromEmail = process.env.RESEND_FROM_EMAIL || 'ZwinCar <hello@zwincar.com>';
        const toEmail = process.env.CONTACT_DESTINATION_EMAIL || 'hello@zwincar.com';
        const data = await resend.emails.send({
            from: fromEmail,
            to: [toEmail],
            replyTo: email,
            subject: `[ZwinCar - ${city || 'Maroc'}] Contact: ${subject} - ${name}`,
            html: `
                <h1>Nouveau message de contact ZwinCar.com</h1>
                <p><strong>Ville / Hub :</strong> ${city || 'Maroc'}</p>
                <p><strong>Nom :</strong> ${name}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Sujet :</strong> ${subject}</p>
                <hr />
                <h3>Message :</h3>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        });

        if (data.error) {
            console.error("Resend API Error:", data.error);
            return NextResponse.json({ error: data.error.message || "Erreur d'envoi Resend" }, { status: 400 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Contact API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
