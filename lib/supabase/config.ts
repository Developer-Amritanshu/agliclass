export type SupabaseConfig = {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
  enabled: boolean;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || undefined;

export const supabaseConfig: SupabaseConfig = {
  url,
  anonKey,
  serviceRoleKey,
  enabled: Boolean(url && anonKey),
};
