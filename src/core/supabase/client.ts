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

  const defaultUrl = 'https://jmumzoeuslfvisubwtxe.supabase.co';
  const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptdW16b2V1c2xmdmlzdWJ3dHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMDUyNTEsImV4cCI6MjEwMjY4MTI1MX0.lnIHvPHSh-VMBdEdipUDBBBDmALNQiVSDC1mCnlhmL4';

  return {
    url: (import.meta as any).env?.VITE_SUPABASE_URL || defaultUrl,
    anonKey: (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || defaultKey,
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
