import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  loading?: boolean;
  className?: string;
}

export function Toggle({ enabled, onChange, loading, className }: ToggleProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!loading) onChange(!enabled);
      }}
      disabled={loading}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] focus:ring-offset-2',
        enabled ? 'bg-[#ff6b6b]' : 'bg-gray-200',
        loading && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <span
        className={cn(
          'pointer-events-none flex items-center justify-center h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
          enabled ? 'translate-x-5' : 'translate-x-0'
        )}
      >
        {loading && (
          <Loader2 className="h-3 w-3 animate-spin text-[#ff6b6b]" />
        )}
      </span>
    </button>
  );
}
