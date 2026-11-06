import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

// Server-side Supabase client for SSG/ISR pages
// Does NOT handle auth cookies - use supabase-server.ts for auth
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-build.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
