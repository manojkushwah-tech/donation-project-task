import React from 'react';
import { Edit2, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Toggle } from './Toggle';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit: (item: T) => void;
  onDelete: (item: T) => void;
  onRowClick?: (item: T) => void;
  onStatusToggle?: (item: T) => void;
  loading?: boolean;
  togglingId?: string | null;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

export function DataTable<T extends { _id: string; status?: boolean }>({
  data,
  columns,
  onEdit,
  onDelete,
  onRowClick,
  onStatusToggle,
  loading,
  togglingId,
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="w-full relative">
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white rounded">
          <Loader2 className="h-8 w-8 animate-spin text-[#ff6b6b]" />
          <p className="mt-2 text-xs font-medium text-gray-400">Loading data...</p>
        </div>
      )}
      
      <div className="grid grid-cols-[60px_repeat(var(--cols),1fr)_80px] gap-4 px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400" style={{ '--cols': columns.length } as any}>
        <div className="flex items-center justify-center">S.No.</div>
        {columns.map((col, idx) => (
          <div key={idx} className={cn('flex items-center', col.className)}>
            {col.header}
          </div>
        ))}
        <div className="flex items-center justify-end">Actions</div>
      </div>

      <div className="flex flex-col gap-3">
        {data.map((item, index) => (
          <div
            key={item._id}
            onClick={() => onRowClick?.(item)}
            className={cn(
              "card-shadow grid grid-cols-[60px_repeat(var(--cols),1fr)_80px] items-center gap-4 rounded bg-white px-6 py-4 transition-all duration-200",
              onRowClick && "cursor-pointer hover:bg-gray-50"
            )}
            style={{ '--cols': columns.length } as any}
          >
            <div className="flex items-center justify-center text-sm font-bold text-gray-400">
              {index + 1 + (pagination ? (pagination.currentPage - 1) * 10 : 0)}
            </div>
            
            {columns.map((col, idx) => (
              <div key={idx} className={cn('flex items-center text-sm font-medium text-gray-700', col.className)}>
                {col.header === 'Status' ? (
                  <Toggle
                    enabled={!!item.status}
                    onChange={() => onStatusToggle?.(item)}
                    loading={togglingId === item._id}
                  />
                ) : typeof col.accessor === 'function' ? (
                  col.accessor(item)
                ) : (
                  (item[col.accessor] as React.ReactNode)
                )}
              </div>
            ))}

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item);
                }}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        
        {data.length === 0 && (
          <div className="card-shadow flex h-40 items-center justify-center rounded bg-white text-sm text-gray-400">
            No data found
          </div>
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            disabled={pagination.currentPage === 1}
            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
            className="flex h-10 w-10 items-center justify-center rounded bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => pagination.onPageChange(page)}
                className={cn(
                  'h-10 w-10 rounded text-sm font-bold transition-all',
                  pagination.currentPage === page
                    ? 'bg-[#ff6b6b] text-white shadow-lg shadow-[#ff6b6b]/20'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                )}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            disabled={pagination.currentPage === pagination.totalPages}
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            className="flex h-10 w-10 items-center justify-center rounded bg-white text-gray-500 shadow-sm transition-all hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

