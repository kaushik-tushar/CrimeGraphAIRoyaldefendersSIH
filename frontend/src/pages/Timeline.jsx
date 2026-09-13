import React, { useState } from 'react';
import {
  Clock,
  Search,
  Filter,
  Calendar,
  Phone,
  CreditCard,
  Film,
  FileCheck2,
  AlertTriangle,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Plus,
  ArrowUpDown,
  Download,
  Share2,
  CheckCircle2,
  User,
  X,
  Eye,
  Trash2,
  Sparkles
} from 'lucide-react';

export default function Timeline() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [caseFilter, setCaseFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Modal / Notification states
  const [toastMessage, setToastMessage] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEventModal, setSelectedEventModal] = useState(null);

  // New Event Form State
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('TELECOM_CDR');
  const [newEventActor, setNewEventActor] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventThreat, setNewEventThreat] = useState('HIGH');

  // Chronological Event Ledger
  const [events, setEvents] = useState([
    {
      id: 'EVT-9081',
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021',
      timestamp: '12 Jan 2026, 02:14:22 IST',
      category: 'TELECOM_CDR',
      title: 'Peak Inter-Suspect Call Duration (184 Seconds)',
      description: 'Burner SIM (+91 98210-XXXXX) initiated an encrypted cellular link with Kingpin node (+91 98112-XXXXX) connected to Sector 62 Tower.',
      location: 'Noida Sector 62 Tower Dump Node',
      actor: 'Vikram "Raja" Malhotra',
      threatLevel: 'HIGH',
      hashSignature: 'SHA256: e3b0c...852b855'
    },
    {
      id: 'EVT-9078',
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021',
      timestamp: '12 Jan 2026, 02:45:10 IST',
      category: 'FINANCIAL',
      title: 'RTGS Electronic Funds Transfer (₹45,00,000)',
      description: 'Mule Account #9041 transferred funds to Apex Horizon Shell Corp offshore account via Axis Bank API gateway.',
      location: 'Axis Bank Corp Gateway, Mumbai',
      actor: 'Anand "Micro" Verma',
      threatLevel: 'CRITICAL',
      hashSignature: 'SHA256: 7f83b...126d9069'
    },
    {
      id: 'EVT-9065',
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021',
      timestamp: '12 Jan 2026, 03:10:00 IST',
      category: 'CCTV_SIGHTING',
      title: 'ATM Counter Facial Identification Match',
      description: 'CCTV Counter #4 captured suspect Anand Verma withdrawing cash using cloned card.',
      location: 'Axis Bank ATM, Connaught Place, New Delhi',
      actor: 'Anand "Micro" Verma',
      threatLevel: 'MEDIUM',
      hashSignature: 'SHA256: a1b2c...56789abc'
    },
    {
      id: 'EVT-9012',
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021',
      timestamp: '12 Jan 2026, 14:22:00 IST',
      category: 'EVIDENCE_INGEST',
      title: 'Tower Dump CDR & CCTV Drive Vaulted',
      description: 'Inspector R. Deshmukh ingested forensic drive dumps into the cryptographic evidence repository with SHA-256 chain lock.',
      location: 'NCRB Cyber Cell Vault, New Delhi',
      actor: 'Inspector R. Deshmukh',
      threatLevel: 'INFO',
      hashSignature: 'SHA256: cb56d...0077e23d'
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportLog = () => {
    showToast('Exporting cryptographic event ledger log as JSON/CSV...');
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(events, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `Case_Timeline_Ledger_${Date.now()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    if (!newEventTitle || !newEventActor) {
      showToast('Please fill out all required event fields.');
      return;
    }

    const newEvt = {
      id: `EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021',
      timestamp: 'Just Now, 2026 IST',
      category: newEventCategory,
      title: newEventTitle,
      description: newEventDescription || 'Manual operational event marker added to timeline vault.',
      location: newEventLocation || 'Cyber Crime Division HQ',
      actor: newEventActor,
      threatLevel: newEventThreat,
      hashSignature: `SHA256: ${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 7)}`
    };

    setEvents([newEvt, ...events]);
    setIsAddModalOpen(false);
    setNewEventTitle('');
    setNewEventDescription('');
    setNewEventActor('');
    setNewEventLocation('');
    showToast(`Successfully added event marker ${newEvt.id} to ledger!`);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
    showToast(`Event marker ${id} purged from timeline.`);
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'TELECOM_CDR':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-[10px] font-mono font-bold">
            <Phone size={12} /> CDR Call Link
          </span>
        );
      case 'FINANCIAL':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg text-[10px] font-mono font-bold">
            <CreditCard size={12} /> Financial Wire
          </span>
        );
      case 'CCTV_SIGHTING':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg text-[10px] font-mono font-bold">
            <Film size={12} /> CCTV Sight
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-[10px] font-mono font-bold">
            <FileCheck2 size={12} /> Evidence Vault
          </span>
        );
    }
  };

  const getThreatColor = (level) => {
    switch (level) {
      case 'CRITICAL':
        return 'border-l-red-500 bg-red-500/5';
      case 'HIGH':
        return 'border-l-amber-500 bg-amber-500/5';
      case 'MEDIUM':
        return 'border-l-cyan-500 bg-cyan-500/5';
      default:
        return 'border-l-emerald-500 bg-emerald-500/5';
    }
  };

  const filteredEvents = events
    .filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;
      const matchesCase = caseFilter === 'ALL' || e.caseId === caseFilter;

      return matchesSearch && matchesCategory && matchesCase;
    })
    .sort((a, b) => {
      if (sortOrder === 'DESC') {
        return new Date(b.timestamp) - new Date(a.timestamp);
      }
      return new Date(a.timestamp) - new Date(b.timestamp);
    });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans relative">
      
      {/* Toast Feedback Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-cyan-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-cyan-400 animate-bounce">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Clock size={16} />
            <span>CHRONOLOGICAL CASE EVENT RECONSTRUCTION</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Case Timeline & Sequence Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Time-series cross-verification of calls, wire transactions, and evidence artifacts linked to active FIRs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportLog}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            <Download size={14} className="text-cyan-400" /> Export Event Log
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus size={16} /> Add Event Marker
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
        
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Events, Suspects, Details..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-2.5 text-slate-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
          <Filter size={14} className="text-slate-500 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent w-full text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950">Category: All Events</option>
            <option value="TELECOM_CDR" className="bg-slate-950">Telecom CDR Links</option>
            <option value="FINANCIAL" className="bg-slate-950">Financial Transfers</option>
            <option value="CCTV_SIGHTING" className="bg-slate-950">CCTV Sightings</option>
            <option value="EVIDENCE_INGEST" className="bg-slate-950">Evidence Ingestions</option>
          </select>
        </div>

        {/* Target Case Filter */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
          <FileCheck2 size={14} className="text-slate-500 shrink-0" />
          <select
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
            className="bg-transparent w-full text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950">Case: All Active FIRs</option>
            <option value="26189-042" className="bg-slate-950">FIR-2026-NCRB-9021</option>
            <option value="26189-088" className="bg-slate-950">FIR-2026-DL-4410</option>
          </select>
        </div>

        {/* Sort Order Toggle */}
        <button
          onClick={() => setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC')}
          className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 hover:border-slate-700 transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-cyan-400" />
            Sort: {sortOrder === 'DESC' ? 'Newest First' : 'Oldest First'}
          </span>
        </button>

      </div>

      {/* Main Timeline Event Stream */}
      <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-3 md:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
        
        {filteredEvents.length === 0 ? (
          <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-xs">
            No events match the current filter parameters.
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <div key={evt.id} className="relative group">
              
              {/* Timeline Marker Circle */}
              <div className="absolute -left-6 md:-left-8 top-4 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 group-hover:scale-125 group-hover:bg-cyan-400 transition-all duration-200 z-10" />

              {/* Event Card */}
              <div className={`bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-xl border-l-4 ${getThreatColor(evt.threatLevel)} space-y-3`}>
                
                {/* Event Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
                  <div className="flex items-center gap-3">
                    {getCategoryBadge(evt.category)}
                    <span className="text-xs font-mono font-bold text-slate-400 flex items-center gap-1">
                      <Clock size={12} className="text-cyan-400" /> {evt.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] font-mono">
                    <span className="text-slate-500">ID: {evt.id}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-cyan-400 font-semibold">{evt.firNo}</span>
                    <div className="flex items-center gap-1 ml-2">
                      <button 
                        onClick={() => setSelectedEventModal(evt)}
                        title="View Full Details"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded cursor-pointer transition"
                      >
                        <Eye size={12} />
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(evt.id)}
                        title="Delete Marker"
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded cursor-pointer transition"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Event Core Body */}
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{evt.title}</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{evt.description}</p>
                </div>

                {/* Event Footer Meta */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-400 border-t border-slate-800/40">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                      <User size={13} className="text-slate-500" /> Key Actor: <strong className="text-white">{evt.actor}</strong>
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <MapPin size={13} className="text-slate-500" /> {evt.location}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                    <ShieldCheck size={12} /> {evt.hashSignature}
                  </div>
                </div>

              </div>

            </div>
          ))
        )}

      </div>

      {/* Add Event Marker Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
              <X size={18} />
            </button>
            <h3 className="text-lg font-black text-white">Add Timeline Event Marker</h3>
            
            <form onSubmit={handleAddEventSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Event Title</label>
                <input 
                  type="text"
                  required
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  placeholder="e.g., Encrypted PGP Key Broadcast Detected"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Category</label>
                  <select 
                    value={newEventCategory}
                    onChange={(e) => setNewEventCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="TELECOM_CDR">Telecom CDR Link</option>
                    <option value="FINANCIAL">Financial Transfer</option>
                    <option value="CCTV_SIGHTING">CCTV Sighting</option>
                    <option value="EVIDENCE_INGEST">Evidence Ingestion</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Threat Level</label>
                  <select 
                    value={newEventThreat}
                    onChange={(e) => setNewEventThreat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="INFO">INFO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Key Actor / Suspect</label>
                  <input 
                    type="text"
                    required
                    value={newEventActor}
                    onChange={(e) => setNewEventActor(e.target.value)}
                    placeholder="e.g., Vikram Malhotra"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold block mb-1">Location Node</label>
                  <input 
                    type="text"
                    value={newEventLocation}
                    onChange={(e) => setNewEventLocation(e.target.value)}
                    placeholder="e.g., Delhi Cyber Hub"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-1">Detailed Description</label>
                <textarea 
                  rows={3}
                  value={newEventDescription}
                  onChange={(e) => setNewEventDescription(e.target.value)}
                  placeholder="Provide brief intelligence notes..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer">
                  Commit to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details View Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setSelectedEventModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer">
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold">
              <ShieldCheck size={16} /> SECURE CRYPTOGRAPHIC EVENT DOSSIER
            </div>
            <h3 className="text-lg font-black text-white">{selectedEventModal.title}</h3>
            
            <div className="bg-slate-950 p-4 rounded-xl space-y-2 font-mono text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">Event ID:</span>
                <span className="text-white font-bold">{selectedEventModal.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">Timestamp:</span>
                <span className="text-cyan-400">{selectedEventModal.timestamp}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">Actor:</span>
                <span>{selectedEventModal.actor}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">Location:</span>
                <span>{selectedEventModal.location}</span>
              </div>
              <div className="flex flex-col pt-1">
                <span className="text-slate-500 mb-1">SHA-256 Ledger Signature:</span>
                <span className="text-emerald-400 break-all bg-slate-900 p-2 rounded border border-slate-800">{selectedEventModal.hashSignature}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setSelectedEventModal(null)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}