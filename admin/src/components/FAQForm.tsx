import React, { useState, useEffect } from 'react';
import { FAQ } from '../types';
import { Loader2 } from 'lucide-react';

interface FAQFormProps {
  initialData?: FAQ;
  onSubmit: (data: Omit<FAQ, '_id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function FAQForm({ initialData, onSubmit, onCancel, loading }: FAQFormProps) {
  const [formData, setFormData] = useState<Omit<FAQ, '_id'>>({
    question: '',
    answer: '',
    status: true,
  });

  useEffect(() => {
    if (initialData) {
      const { _id, ...rest } = initialData;
      setFormData(rest);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Question</label>
        <input
          type="text"
          required
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          className="w-full rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-[#ff6b6b] focus:bg-white"
          placeholder="Enter question"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Answer</label>
        <textarea
          required
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          className="h-32 w-full rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-[#ff6b6b] focus:bg-white"
          placeholder="Enter answer"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded border border-gray-200 bg-white py-3 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 rounded bg-[#ff6b6b] py-3 text-sm font-bold text-white shadow-lg shadow-[#ff6b6b]/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Processing...' : (initialData ? 'Update FAQ' : 'Create FAQ')}
        </button>
      </div>
    </form>
  );
}

