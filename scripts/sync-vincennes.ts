import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load env
dotenv.config({ path: '.env.local' });

const TO_SYNC = [
    {
        id: 'taxivincennes',
        name: 'Taxi Vincennes 94',
        domain: 'taxivincennes.com',
        email: 'contact@taxivincennes.com',
        phone_number: '01 84 60 94 00',
        primary_color: '#facc15'
    }
];

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Missing Supabase Env Vars");
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
    console.log(`Syncing ${TO_SYNC.length} tenants...`);

    for (const t of TO_SYNC) {
        const { error } = await supabase
            .from('tenants')
            .upsert({
                id: t.id,
                name: t.name,
                domain: t.domain,
                email: t.email,
                phone_number: t.phone_number,
                primary_color: t.primary_color,
                created_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (error) {
            console.error(`Error on ${t.id}:`, error.message);
        } else {
            console.log(`✅ Synced: ${t.id} (${t.domain})`);
        }
    }
}

main();
