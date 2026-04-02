import React from 'react';
import { Search, Bell, ShoppingCart, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

interface TopBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onMenuClick: () => void;
}

export function TopBar({ searchValue, onSearchChange, onMenuClick }: TopBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 z-30 px-4 sm:px-8 flex items-center justify-between lg:left-72">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button 
          onClick={onMenuClick}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded lg:hidden cursor-pointer"
        >
          <Menu size={24} />
        </button>
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 w-full rounded bg-gray-50 pl-12 pr-4 text-sm text-gray-900 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-[#ff6b6b]/10"
          />
        </div>
      </div>
    </div>
  );
}
