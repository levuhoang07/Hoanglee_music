import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Playlist } from '../../types/library';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description?: string) => Promise<void>;
  initialPlaylist?: Playlist | null;
}

export const PlaylistModal: React.FC<PlaylistModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPlaylist,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialPlaylist) {
      setName(initialPlaylist.name);
      setDescription(initialPlaylist.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [initialPlaylist, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(name, description);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialPlaylist ? 'Chỉnh Sửa Playlist' : 'Tạo Playlist Mới'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
            Tên Playlist <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Chill Vibe, Lofi Night, Tập Trung..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">
            Mô tả (tùy chọn)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ghi chú về danh sách bài hát này..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={!name.trim() || isSubmitting}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-accent hover:bg-accent/90 disabled:opacity-50 transition-all shadow-md shadow-accent/20"
          >
            {isSubmitting ? 'Đang lưu...' : initialPlaylist ? 'Cập Nhật' : 'Tạo Ngay'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
