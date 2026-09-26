import { createClient } from '@supabase/supabase-js';

// Support Vite env variables with fallback to specification credentials
const meta = import.meta as unknown as { env?: Record<string, string> };

const SUPABASE_URL = 
  meta?.env?.VITE_SUPABASE_URL ||
  'https://nnqjmmworlkadlwcapgw.supabase.co';

const SUPABASE_ANON_KEY = 
  meta?.env?.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ucWptbXdvcmxrYWRsd2NhcGd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzODA0MTYsImV4cCI6MjEwMzk1NjQxNn0.IzEdgggPb2Gy5h63f8g6N7YUj9G6b0LYTyBMEixhYos';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

