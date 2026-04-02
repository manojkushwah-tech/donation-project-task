import React from 'react';
import { ChevronLeft, Calendar, User, MessageCircle, Clock, Tag, Image as ImageIcon } from 'lucide-react';
import { Event, CommitteeMember, FAQ } from '../types';
import { cn } from '../lib/utils';

interface DetailsViewProps {
  item: Event | CommitteeMember | FAQ;
  type: 'events' | 'committee' | 'faq';
  onBack: () => void;
}

export function DetailsView({ item, type, onBack }: DetailsViewProps) {
  const isEvent = type === 'events';
  const isCommittee = type === 'committee';
  const isFAQ = type === 'faq';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm font-bold text-gray-500 transition-colors hover:text-[#ff6b6b] cursor-pointer"
      >
        <ChevronLeft size={18} />
        Back to List
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="card-shadow overflow-hidden rounded bg-white">
            {(isEvent || isCommittee) && (item as any).image && (
              <div className="aspect-video w-full overflow-hidden bg-gray-100">
                <img
                  src={(item as any).image}
                  alt=""
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
            <div className="p-8">
              <div className="mb-4 flex items-center gap-3">
                <span className={cn(
                  "rounded px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                  item.status ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                )}>
                  {item.status ? 'Active' : 'Inactive'}
                </span>
                <span className="text-xs font-medium text-gray-400">
                  ID: {item._id}
                </span>
              </div>

              <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900">
                {isEvent ? (item as Event).title : isCommittee ? (item as CommitteeMember).name : (item as FAQ).question}
              </h1>

              <div className="prose prose-sm max-w-none text-gray-600">
                {isEvent && (
                  <div className="space-y-6">
                    <p className="text-lg font-medium text-gray-900">{(item as Event).description}</p>
                    <div className="whitespace-pre-wrap">{(item as Event).content}</div>
                  </div>
                )}
                {isCommittee && (
                  <div className="space-y-4">
                    <p className="text-xl font-semibold text-[#ff6b6b]">{(item as CommitteeMember).designation}</p>
                    <p>Member of the Dadunani Committee.</p>
                  </div>
                )}
                {isFAQ && (
                  <div className="space-y-4">
                    <p className="text-lg leading-relaxed">{(item as FAQ).answer}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="card-shadow rounded bg-white p-8">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-400">Quick Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-50 text-gray-400">
                  <Tag size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Status</p>
                  <p className="text-sm font-bold text-gray-900">{item.status ? 'Live' : 'Hidden'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-50 text-gray-400">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Slug</p>
                  <p className="text-sm font-bold text-gray-900 truncate max-w-[150px]">{(item as any).slug || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-50 text-gray-400">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Created At</p>
                  <p className="text-sm font-bold text-gray-900">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-50 text-gray-400">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Updated At</p>
                  <p className="text-sm font-bold text-gray-900">
                    {(item as any).updatedAt ? new Date((item as any).updatedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card-shadow rounded bg-[#ff6b6b] p-8 text-white">
            <h3 className="mb-4 text-lg font-bold">Need to update?</h3>
            <p className="mb-6 text-sm opacity-80 leading-relaxed">
              You can edit this {(type.slice(0, -1))} directly from the list view or by clicking the edit icon in the table.
            </p>
            <button 
              onClick={onBack}
              className="w-full rounded bg-white py-3 text-sm font-bold text-[#ff6b6b] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
