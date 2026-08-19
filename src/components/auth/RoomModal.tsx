import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Users, Copy, Check } from 'lucide-react';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoomCode: string;
  isAdmin?: boolean;
  onJoinRoom: (code: string) => void;
}

export const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  currentRoomCode,
  isAdmin = false,
  onJoinRoom,
}) => {
  const [code, setCode] = useState(currentRoomCode);
  const [copied, setCopied] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onJoinRoom(code.trim().toUpperCase());
      onClose();
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentRoomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Phòng Nghe Nhạc Chung">
      <div className="space-y-4 text-xs">
        <p className="text-text-secondary leading-relaxed">
          {isAdmin
            ? 'Chia sẻ mã phòng này cho bạn bè. Khi bạn bè đăng nhập vào, mọi bài hát bạn hoặc bạn bè tải lên sẽ được đồng bộ và nghe chung tức thì!'
            : 'Bạn đang tham gia phòng nghe nhạc chung của HoangLee Music. Mọi bài hát trong phòng được đồng bộ thời gian thực từ đám mây.'}
        </p>

        {/* Current Room Code Box */}
        <div className="p-4 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-accent-cyan tracking-wider">
              Mã phòng hiện tại
            </span>
            <p className="text-xl font-mono font-black text-white tracking-widest mt-0.5">
              {currentRoomCode}
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            className="glass-button px-3 py-2 rounded-xl text-text-primary hover:text-white flex items-center gap-1.5 font-semibold text-xs border border-accent/40"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Đã sao chép</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-accent" />
                <span>Sao Chép</span>
              </>
            )}
          </button>
        </div>

        {/* Join / Switch Room Form (Only for Admin) */}
        {isAdmin && (
          <form onSubmit={handleSave} className="space-y-3 pt-2 border-t border-white/10">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase mb-1">
                Đổi Hoặc Nhập Mã Phòng Mới (Quyền Quản Trị)
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ví dụ: HOANGLEE, CHILLVIBE, BANDEM..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-sm font-mono font-bold text-white placeholder:text-text-muted focus:outline-none focus:border-accent tracking-wider uppercase"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-accent hover:bg-accent/90 shadow-md shadow-accent/25 flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" />
                <span>Tham Gia Phòng</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
