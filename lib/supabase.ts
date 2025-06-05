import { createClient } from '@supabase/supabase-js';

// Use a default empty client if environment variables are not available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ewivnbozikdxexaowiid.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aXZuYm96aWtkeGV4YW93aWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzMDQzMjksImV4cCI6MjA2MTg4MDMyOX0.u6F4nZNRh1hJZBN6Di3DSA1RJdeDOSjzOeGzQyQcz58';

// Only throw errors in development or if explicitly required
if (process.env.NODE_ENV === 'development' && (!supabaseUrl || !supabaseAnonKey)) {
    console.warn('Supabase environment variables are not set. Some features may not work correctly.');
    console.warn('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file');
}

// Create a Supabase client for use in the browser
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
    },
    global: {
        headers: {
            'x-application-name': 'cryptonested'
        }
    },
    db: {
        schema: 'public'
    },
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
});

// For server-side operations that require elevated privileges (if you have a service role key)
// export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || '');
