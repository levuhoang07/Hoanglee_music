import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { getSavedSupabaseConfig, saveSupabaseConfig } from '../../core/supabase/client';
import { Cloud, Check, ExternalLink } from 'lucide-react';

interface CloudSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const CloudSettingsModal: React.FC<CloudSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const currentConfig = getSavedSupabaseConfig();
  const [url, setUrl] = useState(currentConfig.url);
  const [anonKey, setAnonKey] = useState(currentConfig.anonKey);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig({
      url: url.trim(),
      anonKey: anonKey.trim(),
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onConfigSaved();
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Kết Nối Supabase Cloud Backend">
      <div className="space-y-4 text-xs">
        <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/20 text-text-secondary leading-relaxed">
          <p>
            Dán <strong>Project URL</strong> và <strong>Anon API Key</strong> từ trang quản trị Supabase của bạn để kích hoạt lưu trữ đám mây và chia sẻ nhạc cùng bạn bè.
          </p>
          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="text-accent-cyan hover:underline inline-flex items-center gap-1 font-semibold mt-1"
          >
            <span>Mở Supabase Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">
              Supabase Project URL
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://xyzcompany.supabase.co"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">
              Supabase Anon Public API Key
            </label>
            <input
              type="password"
              required
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-accent hover:bg-accent/90 shadow-md shadow-accent/25 flex items-center gap-1.5"
            >
              {saved ? <Check className="w-4 h-4 text-emerald-400" /> : <Cloud className="w-4 h-4" />}
              <span>{saved ? 'Đã Lưu Thành Công!' : 'Lưu Cấu Hình'}</span>
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
