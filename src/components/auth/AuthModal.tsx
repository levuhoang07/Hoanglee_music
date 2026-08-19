import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { LogIn, UserPlus, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: (email: string, pass: string) => Promise<void>;
  onSignUp: (email: string, pass: string, name: string) => Promise<void>;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSignIn,
  onSignUp,
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (tab === 'login') {
        await onSignIn(identifier, password);
      } else {
        await onSignUp(identifier, password, displayName || 'Bạn Bè');
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Đã có lỗi xảy ra. Vui lòng kiểm tra lại tài khoản & mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillAdmin = () => {
    setTab('login');
    setIdentifier('levuhoang');
    setPassword('lvh@1605');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={tab === 'login' ? 'Đăng Nhập Thành Viên & Admin' : 'Tạo Tài Khoản Mới'}
    >
      <div className="space-y-4">
        {/* Tab switch */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              tab === 'login' ? 'bg-accent text-white shadow-md' : 'text-text-secondary hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              tab === 'register' ? 'bg-accent text-white shadow-md' : 'text-text-secondary hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Đăng Ký</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">
                Tên hiển thị
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ví dụ: Hoàng Lee, Linh Đan..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">
              Tài khoản hoặc Email
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="levuhoang hoặc email@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
            />
          </div>

          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-accent to-accent-cyan hover:brightness-110 shadow-lg shadow-accent/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>{tab === 'login' ? 'Đăng Nhập Ngay' : 'Tạo Tài Khoản'}</span>
            </button>
          </div>
        </form>

        {/* Quick Admin fill button */}
        <div className="pt-2 border-t border-white/10 text-center">
          <button
            type="button"
            onClick={handleFillAdmin}
            className="text-[11px] text-accent-cyan hover:underline inline-flex items-center gap-1 font-semibold opacity-90 hover:opacity-100"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Điền nhanh thông tin Admin (levuhoang)</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
