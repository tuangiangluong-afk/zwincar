import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Server-side Supabase client for SSG/ISR pages
// Does NOT handle auth cookies - use supabase-server.ts for auth
export const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
