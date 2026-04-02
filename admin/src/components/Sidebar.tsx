import React from 'react';
import { Calendar, Users, MessageCircle, ChevronRight, LogOut } from 'lucide-react';
import { Section } from '../types';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  user: {
    firstname: string;
    lastname: string;
    role: string;
  } | null;
}

export function Sidebar({ activeSection, onSectionChange, isOpen, onClose, onLogout, user }: SidebarProps) {
  const menuItems = [
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'committee', label: 'Committee', icon: Users },
    { id: 'faq', label: 'FAQs', icon: MessageCircle },
  ];

  const fullName = user ? `${user.firstname} ${user.lastname}` : 'Admin User';
  const role = user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Super Admin';

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "sidebar-shadow fixed left-0 top-0 bottom-0 w-72 bg-white flex flex-col z-50 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="https://www.shrinanusatidadi.com/_next/image?url=%2Fimages%2Flogo%2Flogo-dadi.png&w=256&q=75" 
              alt="Dadunani" 
              className="h-10 w-10 object-contain"
            />
            <h1 className="text-xl font-bold tracking-tight text-[#ff6b6b]">Dadunani</h1>
          </div>
        </div>

        <div className="px-6 mb-8">
          <div className="flex items-center gap-3 p-4 rounded bg-gray-50 border border-gray-100">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstname || 'admin'}`} 
              alt="Admin" 
              className="h-10 w-10 rounded bg-gray-200"
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">{fullName}</p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-[#ff6b6b] transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="px-6 flex-1 overflow-y-auto">
          <p className="px-4 mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Management</p>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id as Section);
                    onClose();
                  }}
                  className={cn(
                    'flex items-center justify-between rounded px-4 py-3 text-sm font-medium transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'active-nav-item'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? 'text-[#ff6b6b]' : 'text-gray-400'} />
                    {item.label}
                  </div>
                  {isActive && <ChevronRight size={14} />}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

