import React, { useState, useEffect } from 'react';
import { Event } from '../types';
import { Loader2 } from 'lucide-react';

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: Omit<Event, '_id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function EventForm({ initialData, onSubmit, onCancel, loading }: EventFormProps) {
  const [formData, setFormData] = useState<Omit<Event, '_id'>>({
    title: '',
    description: '',
    content: '',
    image: '',
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
    // Ensure we don't send status if it's not needed, but keep it in state if API requires it
    // The user said "remove status radio button", which I already did (it wasn't in JSX)
    // But I'll make sure it's not being toggled here.
    onSubmit(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Title</label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-[#ff6b6b] focus:bg-white"
          placeholder="Enter event title"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Description</label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="h-24 w-full rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-[#ff6b6b] focus:bg-white"
          placeholder="Enter short description"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Content</label>
        <textarea
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="h-40 w-full rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-[#ff6b6b] focus:bg-white"
          placeholder="Enter full event content"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Event Image</label>
        <div className="flex flex-col gap-4">
          {formData.image && (
            <img src={formData.image} alt="Preview" className="h-32 w-full rounded object-cover border border-gray-200" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ff6b6b]/10 file:text-[#ff6b6b] hover:file:bg-[#ff6b6b]/20"
          />
        </div>
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
          {loading ? 'Processing...' : (initialData ? 'Update Event' : 'Create Event')}
        </button>
      </div>
    </form>
  );
}

