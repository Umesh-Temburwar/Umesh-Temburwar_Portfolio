import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vfgihxeixuyyubmftbjs.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'sb_publishable_pvXYLRIqh1kKlemKbSLCjA_J6s9m5Zb';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
export default supabase;

