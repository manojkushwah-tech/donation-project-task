import React from 'react';
import { Plus, Filter, ArrowUpDown } from 'lucide-react';
import { Dropdown } from './Dropdown';

interface SectionHeaderProps {
  title: string;
  onCreateClick: () => void;
  onFilterChange: (status: 'all' | 'active' | 'inactive') => void;
  onSortChange: (sort: 'newest' | 'oldest' | 'name') => void;
  filterStatus: 'all' | 'active' | 'inactive';
  sortBy: 'newest' | 'oldest' | 'name';
}

export function SectionHeader({ 
  title, 
  onCreateClick, 
  onFilterChange, 
  onSortChange, 
  filterStatus, 
  sortBy 
}: SectionHeaderProps) {
  const filterOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Active Only', value: 'active' },
    { label: 'Inactive Only', value: 'inactive' },
  ];

  const sortOptions = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'Name (A-Z)', value: 'name' },
  ];

  return (
    <div className="mb-8">
      <div className="mb-6 flex items-center gap-2 text-xs font-medium text-gray-400">
        <span className="hover:text-gray-900 cursor-pointer">Dashboard</span>
        <span>/</span>
        <span className="text-gray-900">{title}</span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h2>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 p-1 rounded bg-white border border-gray-100">
            <Dropdown
              label="Filter"
              options={filterOptions}
              value={filterStatus}
              onChange={(val) => onFilterChange(val as any)}
              icon={<Filter size={16} />}
            />
            <Dropdown
              label="Sort by"
              options={sortOptions}
              value={sortBy}
              onChange={(val) => onSortChange(val as any)}
              icon={<ArrowUpDown size={16} />}
            />
          </div>
          
          <button
            onClick={onCreateClick}
            className="flex h-11 items-center justify-center gap-2 rounded bg-[#ff6b6b] px-6 text-sm font-bold text-white shadow-lg shadow-[#ff6b6b]/20 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus size={18} />
            Actions
          </button>
        </div>
      </div>
    </div>
  );
}

