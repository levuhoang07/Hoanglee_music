import React from 'react';
import { Search, UploadCloud, Menu, ArrowUp, ArrowDown } from 'lucide-react';
import { LibraryState } from '../../types/library';

interface HeaderProps {
  title: string;
  searchQuery: string;
  sortBy: LibraryState['sortBy'];
  sortOrder: LibraryState['sortOrder'];
  onSearchChange: (query: string) => void;
  onSortChange: (sort: LibraryState['sortBy']) => void;
  onOpenUpload: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  searchQuery,
  sortBy,
  sortOrder,
  onSearchChange,
  onSortChange,
  onOpenUpload,
  onToggleMobileSidebar,
}) => {
  return (
    <header className="h-16 border-b border-white/5 px-6 flex items-center justify-between gap-4 bg-background/50 backdrop-blur-md z-20">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-xl text-text-secondary hover:text-white hover:bg-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h2 className="text-lg font-bold text-text-primary truncate tracking-tight">
          {title}
        </h2>
      </div>

      {/* Right: Search, Sort & Action */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search Bar */}
        <div className="relative hidden sm:block w-48 md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm bài hát, ca sĩ..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
          />
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 text-xs text-text-secondary">
          <button
            onClick={() => onSortChange('addedAt')}
            title="Sắp xếp theo ngày thêm"
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              sortBy === 'addedAt' ? 'bg-accent text-white font-medium' : 'hover:text-white'
            }`}
          >
            <span>Mới nhất</span>
            {sortBy === 'addedAt' && (
              sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={() => onSortChange('title')}
            title="Sắp xếp theo tên bài hát"
            className={`px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
              sortBy === 'title' ? 'bg-accent text-white font-medium' : 'hover:text-white'
            }`}
          >
            <span>Tên</span>
            {sortBy === 'title' && (
              sortOrder === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Upload Button */}
        <button
          onClick={onOpenUpload}
          className="glass-button px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-accent to-accent-violet hover:from-indigo-500 hover:to-violet-500 flex items-center gap-2 shadow-md shadow-accent/20"
        >
          <UploadCloud className="w-4 h-4" />
          <span className="hidden sm:inline">Thêm Nhạc</span>
        </button>
      </div>
    </header>
  );
};
