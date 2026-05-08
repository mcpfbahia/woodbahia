import { createClient } from "@supabase/supabase-js";
import { env } from "~/env";

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || `https://czeayphtvpirdfbzbpgc.supabase.co`;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
