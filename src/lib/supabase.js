import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lpgutiximcoluzvvaqhe.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_UWlogjTxG5Y6jnB-SlidDw_hDhAAoP2';

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase URL or Key missing. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
