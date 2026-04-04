import React, { useState, useEffect } from 'react';
import { CommitteeMember } from '../types';
import { Loader2 } from 'lucide-react';

interface CommitteeFormProps {
  initialData?: CommitteeMember;
  onSubmit: (data: Omit<CommitteeMember, '_id'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function CommitteeForm({ initialData, onSubmit, onCancel, loading }: CommitteeFormProps) {
  const [formData, setFormData] = useState<Omit<CommitteeMember, '_id'>>({
    name: '',
    designation: '',
    image: '',
    status: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      const { _id, ...rest } = initialData;
      setFormData(rest);
      if (rest.image) setImagePreview(rest.image);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('designation', formData.designation);
    data.append('status', String(formData.status));
    if (imageFile) {
      data.append('image', imageFile);
    }
    onSubmit(data as any);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-[#ff6b6b] focus:bg-white"
          placeholder="Enter member name"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Designation</label>
        <input
          type="text"
          required
          value={formData.designation}
          onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
          className="w-full rounded border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition-all focus:border-[#ff6b6b] focus:bg-white"
          placeholder="e.g. President, Secretary"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700">Member Photo</label>
        <div className="flex flex-col gap-4">
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="h-32 w-full rounded object-cover border border-gray-200" />
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
          {loading ? 'Processing...' : (initialData ? 'Update Member' : 'Create Member')}
        </button>
      </div>
    </form>
  );
}

