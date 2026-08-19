import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../../types/cloud';

const STORAGE_KEY_CONFIG = 'auratunes_supabase_config';

// Lấy cấu hình từ LocalStorage hoặc file .env
export function getSavedSupabaseConfig(): SupabaseConfig {
  const localConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
  if (localConfig) {
    try {
      return JSON.parse(localConfig);
    } catch {
      // ignore
    }
  }

  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || '',
    anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '',
  };
}

export function saveSupabaseConfig(config: SupabaseConfig): void {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
  // Reset client instance
  supabaseInstance = null;
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const config = getSavedSupabaseConfig();
  if (config.url && config.anonKey) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.error('Lỗi khởi tạo Supabase:', err);
      return null;
    }
  }

  return null;
}

export function isSupabaseConfigured(): boolean {
  const config = getSavedSupabaseConfig();
  return Boolean(config.url && config.anonKey);
}
