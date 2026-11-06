import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// We need to match the slug used in db.ts CITIES export for taxivincennes.com
// which is: clone(_taxivincennes, "taxivincennes.com", "taxivincennes_com")
const TENANT_ID_CODE = 'taxivincennes_com';
const GA_ID = 'G-FZYD3C4XZF';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Missing Supabase Env Vars");
    process.exit(1);
}

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
    console.log(`Fixing GA for ${TENANT_ID_CODE}...`);

    const { error } = await supabase
        .from('tenants')
        .upsert({
            id: TENANT_ID_CODE, // The Critical Fix: Matching the code's slug
            name: 'Taxi Vincennes 94',
            domain: 'taxivincennes.com',
            email: 'contact@taxivincennes.com',
            phone_number: '01 84 60 94 00',
            primary_color: '#facc15',
            ga_id: GA_ID // Setting the GA ID as requested
        }, { onConflict: 'id' });

    if (error) {
        console.error("Error:", error.message);
    } else {
        console.log(`✅ Success! Tenant ${TENANT_ID_CODE} created/updated with GA: ${GA_ID}`);
    }
}

main();
