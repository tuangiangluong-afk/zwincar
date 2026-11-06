"use client";

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

// Client-side Supabase client for auth in browser components
export const supabaseBrowser = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
