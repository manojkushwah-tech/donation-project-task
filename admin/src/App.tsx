import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { SectionHeader } from './components/SectionHeader';
import { DataTable } from './components/DataTable';
import { Modal } from './components/Modal';
import { EventForm } from './components/EventForm';
import { CommitteeForm } from './components/CommitteeForm';
import { FAQForm } from './components/FAQForm';
import { DetailsView } from './components/DetailsView';
import { Section, Event, CommitteeMember, FAQ } from './types';
import { eventService, committeeService, faqService } from './services/api';
import { authService } from './services/authService';
import { Login } from './components/Login';
import { Loader2, LogOut } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(authService.isAuthenticated());
  const [activeSection, setActiveSection] = useState<Section>('events');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  
  // Data states
  const [events, setEvents] = useState<Event[]>([]);
  const [committee, setCommittee] = useState<CommitteeMember[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      let res;
      if (activeSection === 'events') {
        res = await eventService.getAll(page);
        const fetchedData = res.data.data;
        const data = fetchedData.events || (Array.isArray(fetchedData) ? fetchedData : []);
        setEvents(Array.isArray(data) ? data : []);
        setTotalPages(fetchedData.pagination?.totalPages || 1);
      } else if (activeSection === 'committee') {
        res = await committeeService.getAll(page);
        const fetchedData = res.data.data;
        console.log('Committee Fetched Data:', fetchedData);
        // Check for various possible keys or if the data itself is an array
        let data = [];
        if (fetchedData) {
          data = fetchedData.committees || fetchedData.committee || fetchedData.members || fetchedData.committeeMembers || fetchedData.data;
          if (!data && Array.isArray(fetchedData)) {
            data = fetchedData;
          } else if (!data && fetchedData.data && Array.isArray(fetchedData.data)) {
            data = fetchedData.data;
          }
        }
        setCommittee(Array.isArray(data) ? data : []);
        setTotalPages(fetchedData?.pagination?.totalPages || 1);
      } else if (activeSection === 'faq') {
        res = await faqService.getAll(page);
        const fetchedData = res.data.data;
        const data = fetchedData.faqs || (Array.isArray(fetchedData) ? fetchedData : []);
        setFaqs(Array.isArray(data) ? data : []);
        setTotalPages(fetchedData.pagination?.totalPages || 1);
      }
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData(1);
    }
    setSelectedItem(null);
  }, [activeSection, isLoggedIn]);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
  };

  const filteredData = useMemo(() => {
    let data: any[] = [];
    if (activeSection === 'events') data = [...events];
    else if (activeSection === 'committee') data = [...committee];
    else data = [...faqs];

    // Search filter
    const query = searchQuery.toLowerCase();
    data = data.filter(item => {
      if (activeSection === 'events') {
        return (item.title?.toLowerCase() || '').includes(query) || (item.description?.toLowerCase() || '').includes(query);
      } else if (activeSection === 'committee') {
        return (item.name?.toLowerCase() || '').includes(query) || (item.designation?.toLowerCase() || '').includes(query);
      } else {
        return (item.question?.toLowerCase() || '').includes(query) || (item.answer?.toLowerCase() || '').includes(query);
      }
    });

    // Status filter
    if (filterStatus !== 'all') {
      const isActive = filterStatus === 'active';
      data = data.filter(item => item.status === isActive);
    }

    // Sort
    data.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      if (sortBy === 'name') {
        const nameA = (a.title || a.name || a.question || '').toLowerCase();
        const nameB = (b.title || b.name || b.question || '').toLowerCase();
        return nameA.localeCompare(nameB);
      }
      return 0;
    });

    return data;
  }, [activeSection, events, committee, faqs, searchQuery, filterStatus, sortBy]);

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item: any) => {
    setItemToDelete(item);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    setLoading(true);
    try {
      let res;
      if (activeSection === 'events') res = await eventService.delete(itemToDelete._id);
      else if (activeSection === 'committee') res = await committeeService.delete(itemToDelete._id);
      else res = await faqService.delete(itemToDelete._id);
      
      if (res.data.status || res.status === 200 || res.status === 204) {
        fetchData(currentPage);
      }
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setLoading(false);
      setIsDeleteConfirmOpen(false);
      setItemToDelete(null);
    }
  };

  const handleStatusToggle = async (item: any) => {
    setTogglingId(item._id);
    try {
      const newStatus = !item.status;
      if (activeSection === 'events') {
        await eventService.update(item._id, { status: newStatus });
        setEvents(prev => prev.map(e => e._id === item._id ? { ...e, status: newStatus } : e));
      } else if (activeSection === 'committee') {
        await committeeService.update(item._id, { status: newStatus });
        setCommittee(prev => prev.map(c => c._id === item._id ? { ...c, status: newStatus } : c));
      } else if (activeSection === 'faq') {
        await faqService.update(item._id, { status: newStatus });
        setFaqs(prev => prev.map(f => f._id === item._id ? { ...f, status: newStatus } : f));
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (editingItem) {
        if (activeSection === 'events') await eventService.update(editingItem._id, data);
        else if (activeSection === 'committee') await committeeService.update(editingItem._id, data);
        else await faqService.update(editingItem._id, data);
      } else {
        if (activeSection === 'events') await eventService.create(data);
        else if (activeSection === 'committee') await committeeService.create(data);
        else await faqService.create(data);
      }
      setIsModalOpen(false);
      setSelectedItem(null);
      fetchData(currentPage);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const eventColumns = [
    { header: 'Title', accessor: 'title' },
    { 
      header: 'Content', 
      accessor: (item: Event) => (
        <span className="line-clamp-1 max-w-xs">{item.content}</span>
      )
    },
    { 
      header: 'Image', 
      accessor: (item: Event) => {
        const imageUrl = item.image ? (item.image.includes('?') ? `${item.image}&tr=w-50` : `${item.image}?tr=w-50`) : '';
        return (
          <img src={imageUrl} alt="" className="h-10 w-10 rounded object-cover bg-gray-100" referrerPolicy="no-referrer" />
        );
      }
    },
    { header: 'Status', accessor: 'status' as any },
  ];

  const committeeColumns = [
    { header: 'Name', accessor: (item: any) => item.name || item.member_name || item.title || 'N/A' },
    { header: 'Designation', accessor: (item: any) => item.designation || item.role || 'N/A' },
    { 
      header: 'Photo', 
      accessor: (item: CommitteeMember) => {
        const imageUrl = item.image ? (item.image.includes('?') ? `${item.image}&tr=w-50` : `${item.image}?tr=w-50`) : '';
        return (
          <img src={imageUrl} alt="" className="h-10 w-10 rounded object-cover bg-gray-100" referrerPolicy="no-referrer" />
        );
      }
    },
    { header: 'Status', accessor: 'status' as any },
  ];

  const faqColumns = [
    { header: 'Question', accessor: 'question' },
    { 
      header: 'Answer', 
      accessor: (item: FAQ) => (
        <span className="line-clamp-1 max-w-md">{item.answer}</span>
      )
    },
    { header: 'Status', accessor: 'status' as any },
  ];

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#f4f4f9]">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
        user={authService.getUser()}
      />
      <TopBar 
        searchValue={searchQuery} 
        onSearchChange={setSearchQuery} 
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      
      <main className="lg:pl-72 pt-20">
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          {selectedItem ? (
            <DetailsView
              item={selectedItem}
              type={activeSection}
              onBack={() => setSelectedItem(null)}
            />
          ) : (
            <>
              <SectionHeader
                title={activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                onCreateClick={handleCreate}
                onFilterChange={setFilterStatus}
                onSortChange={setSortBy}
                filterStatus={filterStatus}
                sortBy={sortBy}
              />

              <div className="mt-8 overflow-x-auto">
                <div className="min-w-[800px] lg:min-w-0">
                  {activeSection === 'events' && (
                    <DataTable
                      data={filteredData as Event[]}
                      columns={eventColumns}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onRowClick={setSelectedItem}
                      onStatusToggle={handleStatusToggle}
                      loading={loading}
                      togglingId={togglingId}
                      pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: fetchData
                      }}
                    />
                  )}
                  {activeSection === 'committee' && (
                    <DataTable
                      data={filteredData as CommitteeMember[]}
                      columns={committeeColumns}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onRowClick={setSelectedItem}
                      onStatusToggle={handleStatusToggle}
                      loading={loading}
                      togglingId={togglingId}
                      pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: fetchData
                      }}
                    />
                  )}
                  {activeSection === 'faq' && (
                    <DataTable
                      data={filteredData as FAQ[]}
                      columns={faqColumns}
                      onEdit={handleEdit}
                      onDelete={handleDeleteClick}
                      onRowClick={setSelectedItem}
                      onStatusToggle={handleStatusToggle}
                      loading={loading}
                      togglingId={togglingId}
                      pagination={{
                        currentPage,
                        totalPages,
                        onPageChange: fetchData
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem ? `Edit ${activeSection.slice(0, -1)}` : `Create New ${activeSection.slice(0, -1)}`}
      >
        {activeSection === 'events' && (
          <EventForm
            initialData={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            loading={loading}
          />
        )}
        {activeSection === 'committee' && (
          <CommitteeForm
            initialData={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            loading={loading}
          />
        )}
        {activeSection === 'faq' && (
          <FAQForm
            initialData={editingItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsModalOpen(false)}
            loading={loading}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        title="Confirm Delete"
        className="max-w-md"
      >
        <div className="text-center">
          <p className="mb-8 text-gray-600">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteConfirmOpen(false)}
              disabled={loading}
              className="flex-1 rounded border border-gray-200 py-3 text-sm font-bold text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={loading}
              className="flex-1 rounded bg-red-500 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

