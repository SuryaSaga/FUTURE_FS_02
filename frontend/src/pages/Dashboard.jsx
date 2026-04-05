import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [newNote, setNewNote] = useState('');
  const [assignee, setAssignee] = useState('');
  const [stats, setStats] = useState({ total: 0, new: 0, converted: 0 });
  const [view, setView] = useState('overview'); // 'overview' or 'leads'
  
  // New Lead Form State
  const [formData, setFormData] = useState({ name: '', email: '', source: 'Manual' });

  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data } = await api.get('/leads');
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/leads/stats');
      setStats({
        total: data.total || 0,
        new: data.status?.new || 0,
        converted: data.status?.converted || 0
      });
    } catch (err) {
      console.error('Stats fetch failed:', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leads/${id}`, { status });
      fetchLeads();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const addNote = async (id) => {
    if (!newNote.trim()) return;
    try {
      setNewNote('');
      const { data } = await api.put(`/leads/${id}`, { note: newNote });
      fetchLeads();
      setSelectedLead(data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateAssignment = async (id, assignedTo) => {
    try {
      const { data } = await api.put(`/leads/${id}/assign`, { assignedTo });
      fetchLeads();
      setSelectedLead(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      await api.post('/leads', formData);
      setFormData({ name: '', email: '', source: 'Manual' });
      setShowAddModal(false);
      fetchLeads();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteLead = async (id) => {
    try {
      await api.delete(`/leads/${id}`);
      setDeleteConfirmId(null);
      // Close detail modal if the deleted lead was open
      if (selectedLead && selectedLead._id === id) {
        setSelectedLead(null);
      }
      fetchLeads();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || lead.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <h2 style={{ marginBottom: '2.5rem', color: 'var(--primary)', fontWeight: '800' }}>FutureCRM</h2>
        <button 
          onClick={() => setView('overview')} 
          className={`nav-link ${view === 'overview' ? 'active' : ''}`}
          style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}
        >
          <span>Overview</span>
        </button>
        <button 
          onClick={() => setView('leads')} 
          className={`nav-link ${view === 'leads' ? 'active' : ''}`}
          style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}
        >
          <span>Leads</span>
        </button>
        <div style={{ marginTop: 'auto' }}>
          <button 
            className="btn-primary" 
            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
            onClick={() => { localStorage.clear(); window.location.href = '/'; }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage your client leads efficiently</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              className="search-bar" 
              placeholder="Search leads..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn-primary" style={{ width: 'auto', padding: '0.8rem 1.5rem' }} onClick={() => setShowAddModal(true)}>
              + Add Lead
            </button>
          </div>
        </div>

        {view === 'overview' ? (
          <>
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="stat-card">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Total Leads</p>
                <h2 style={{ fontSize: '2rem' }}>{stats.total}</h2>
              </div>
              <div className="stat-card">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>New Leads</p>
                <h2 style={{ fontSize: '2rem', color: 'var(--info)' }}>{stats.new}</h2>
              </div>
              <div className="stat-card">
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Conversions</p>
                <h2 style={{ fontSize: '2rem', color: 'var(--success)' }}>{stats.converted}</h2>
              </div>
            </div>
            
            <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
               <h3>Welcome to your CRM</h3>
               <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>You have {stats.total} leads to manage today.</p>
               <button className="btn-primary" style={{ width: 'auto', marginTop: '1.5rem', padding: '0.8rem 2rem' }} onClick={() => setView('leads')}>
                 View All Leads
               </button>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              {['all', 'new', 'contacted', 'converted'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ 
                    background: 'transparent', border: 'none', color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: activeTab === tab ? '700' : '500', cursor: 'pointer', textTransform: 'capitalize',
                    padding: '0.5rem 1rem', position: 'relative'
                  }}
                >
                  {tab}
                  {activeTab === tab && <div style={{ position: 'absolute', bottom: '-1rem', left: 0, right: 0, height: '2px', background: 'var(--primary)' }} />}
                </button>
              ))}
            </div>

            {loading ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem' }}>Loading leads...</p>
            ) : filteredLeads.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No leads found</p>
                <p style={{ fontSize: '0.875rem' }}>
                  {searchTerm ? 'Try a different search term.' : 'Click "+ Add Lead" to get started.'}
                </p>
              </div>
            ) : (
              <div className="leads-grid" id="leads-section">
                {filteredLeads.map((lead, idx) => (
                  <div 
                    key={lead._id} 
                    className="lead-card animate-fade-in" 
                    style={{ animationDelay: `${idx * 0.05}s` }}
                    onClick={() => { setSelectedLead(lead); setAssignee(lead.assignedTo || ''); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <span className={`badge badge-${lead.status}`}>{lead.status}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{lead.source} • {lead.assignedTo}</span>
                    </div>
                    <h3 style={{ marginBottom: '0.25rem' }}>{lead.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>{lead.email}</p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <select 
                        value={lead.status} 
                        onChange={(e) => updateStatus(lead._id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        style={{ fontSize: '0.75rem', padding: '0.4rem', borderRadius: '8px', background: 'var(--glass)', color: 'white', border: '1px solid var(--border)' }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                      </select>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {deleteConfirmId === lead._id ? (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={(e) => { e.stopPropagation(); deleteLead(lead._id); }} style={{ color: '#ef4444', fontSize: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>Confirm</button>
                            <button onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(null); }} style={{ color: 'var(--text-muted)', fontSize: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>Cancel</button>
                          </div>
                        ) : (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setDeleteConfirmId(lead._id); }}
                            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.875rem' }}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="glass-card animate-fade-in" style={{ maxWidth: '500px' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ marginBottom: '1.5rem' }}>Add New Lead</h2>
              <form onSubmit={handleCreateLead}>
                <div className="input-group">
                  <label>Full Name</label>
                  <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="John Doe" />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@example.com" />
                </div>
                <div className="input-group">
                  <label>Source</label>
                  <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                    <option value="Manual">Manual Entry</option>
                    <option value="Website">Website Form</option>
                    <option value="Referral">Referral</option>
                    <option value="LinkedIn">LinkedIn</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <button type="submit" className="btn-primary">Create Lead</button>
                  <button type="button" className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--border)' }} onClick={() => setShowAddModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedLead && (
          <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
            <div className="glass-card animate-fade-in" style={{ maxWidth: '600px', position: 'relative' }} onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setSelectedLead(null)} 
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', fontSize: '1.25rem', cursor: 'pointer' }}
              >
                ✕
              </button>
              <h2>Lead Details: {selectedLead.name}</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{selectedLead.email}</p>
              
              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assigned To</label>
                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                   <input 
                     style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', borderRadius: '8px' }} 
                     value={assignee} 
                     onChange={(e) => setAssignee(e.target.value)}
                     placeholder="Unassigned"
                   />
                   <button 
                     className="btn-primary" 
                     style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                     onClick={() => updateAssignment(selectedLead._id, assignee)}
                   >
                     Update
                   </button>
                 </div>
              </div>

              <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px' }}>
                <h4 style={{ marginBottom: '0.5rem' }}>Follow-up Notes</h4>
                {selectedLead.notes.length === 0 && <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>No notes yet.</p>}
                {selectedLead.notes.map((note, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.8rem', borderRadius: '12px', marginTop: '0.5rem' }}>
                    <p style={{ fontSize: '0.875rem' }}>{note.text}</p>
                    <small style={{ color: 'var(--text-muted)' }}>{new Date(note.timestamp).toLocaleString()}</small>
                  </div>
                ))}
              </div>

              <div className="input-group">
                <textarea 
                  placeholder="Add a follow-up note..." 
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  style={{ minHeight: '80px' }}
                />
              </div>
              <button className="btn-primary" onClick={() => addNote(selectedLead._id)}>Add Note</button>
              <button 
                className="btn-primary" 
                style={{ background: 'transparent', border: '1px solid var(--border)', marginTop: '0.5rem' }}
                onClick={() => setSelectedLead(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
