import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_KEY;
const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);
const missingSupabaseConfigMessage =
  'Missing Supabase client credentials. Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.';

if (!hasSupabaseConfig) {
  console.error(missingSupabaseConfigMessage);
}

export const supabase = hasSupabaseConfig ? createClient(supabaseUrl, supabaseAnonKey) : null;
export { hasSupabaseConfig, missingSupabaseConfigMessage };

export default supabase;
