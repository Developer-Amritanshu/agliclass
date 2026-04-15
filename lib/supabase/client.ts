import { createClient } from "@supabase/supabase-js";

import { supabaseConfig } from "@/lib/supabase/config";

export function getSupabaseClient() {
  if (!supabaseConfig.enabled) {
    return null;
  }

  return createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSupabaseAdminClient() {
  if (!supabaseConfig.enabled || !supabaseConfig.serviceRoleKey) {
    return null;
  }

  return createClient(supabaseConfig.url, supabaseConfig.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
