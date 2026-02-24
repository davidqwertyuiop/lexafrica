import { createClient } from '@supabase/supabase-js';

// Use dummy values to prevent module-level throw if env vars are missing during build/init
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjM5MzQ3MzMsImV4cCI6MTkzOTUxMDczM30.placeholder';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Supabase credentials missing. Auth features will be disabled at runtime.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
