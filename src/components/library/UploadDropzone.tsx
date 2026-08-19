import React, { useState, useRef } from 'react';
import { UploadCloud, Plus, Loader2 } from 'lucide-react';

interface UploadDropzoneProps {
  onImportFiles: (files: FileList | File[]) => Promise<{ count: number; duplicates?: string[] }>;
  compact?: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onImportFiles,
  compact = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setIsUploading(true);
      await onImportFiles(e.dataTransfer.files);
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      await onImportFiles(e.target.files);
      setIsUploading(false);
      // Reset input value so same files can be re-uploaded if needed
      e.target.value = '';
    }
  };

  if (compact) {
    return (
      <>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="glass-button px-3.5 py-2 rounded-xl text-xs font-semibold text-text-primary hover:text-white flex items-center gap-2 border border-accent/30 hover:border-accent shadow-sm"
        >
          {isUploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-accent" />
          ) : (
            <Plus className="w-4 h-4 text-accent" />
          )}
          <span>Thêm Nhạc Local</span>
        </button>
      </>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
        isDragging
          ? 'border-accent bg-accent/10 scale-[1.01]'
          : 'border-white/15 hover:border-accent/50 hover:bg-white/5'
      }`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac"
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center gap-2.5">
        <div className="w-12 h-12 rounded-2xl bg-accent/15 flex items-center justify-center text-accent shadow-inner">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>

        <div>
          <p className="text-sm font-semibold text-text-primary">
            {isUploading ? 'Đang nạp file vào bộ nhớ IndexedDB...' : 'Kéo thả file nhạc vào đây hoặc click để duyệt'}
          </p>
          <p className="text-xs text-text-muted mt-1">
            Hỗ trợ MP3, WAV, FLAC, M4A, OGG • Lưu an toàn trên trình duyệt cá nhân
          </p>
        </div>
      </div>
    </div>
  );
};
