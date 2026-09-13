import React, { useState } from 'react';

export default function CdrAnalysis() {
  // --- CDR Dataset State ---
  const [cdrRecords, setCdrRecords] = useState([
    { id: 'CDR-101', caller: '+91-98765-43210', recipient: '+91-91234-56789', type: 'Outgoing', duration: '04m 12s', timestamp: '2026-06-06 14:32:10', towerId: 'TOWER-IND-402', location: 'Vijayawada Central' },
    { id: 'CDR-102', caller: '+91-91234-56789', recipient: '+91-98765-43210', type: 'Incoming', duration: '01m 45s', timestamp: '2026-06-06 14:40:05', towerId: 'TOWER-IND-405', location: 'Vijayawada North' },
    { id: 'CDR-103', caller: '+91-88888-11111', recipient: '+91-98765-43210', type: 'Missed', duration: '00m 00s', timestamp: '2026-06-06 16:15:22', towerId: 'TOWER-GNT-101', location: 'Guntur Highway' },
    { id: 'CDR-104', caller: '+91-98765-43210', recipient: '+91-77777-22222', type: 'Outgoing', duration: '12m 30s', timestamp: '2026-06-07 09:11:40', towerId: 'TOWER-TRP-303', location: 'Tirupati Junction' },
    { id: 'CDR-105', caller: '+91-55555-44444', recipient: '+91-91234-56789', type: 'Outgoing', duration: '03m 55s', timestamp: '2026-06-07 11:20:15', towerId: 'TOWER-IND-402', location: 'Vijayawada Central' }
  ]);

  // --- Filtering & Search States ---
  const [globalSearch, setGlobalSearch] = useState('');
  const [filterCaller, setFilterCaller] = useState('');
  const [filterRecipient, setFilterRecipient] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterTower, setFilterTower] = useState('');

  // --- Modal & Notification States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // Form states for New CDR Entry
  const [newCaller, setNewCaller] = useState('');
  const [newRecipient, setNewRecipient] = useState('');
  const [newType, setNewType] = useState('Outgoing');
  const [newDuration, setNewDuration] = useState('02m 00s');
  const [newTower, setNewTower] = useState('TOWER-IND-001');
  const [newLocation, setNewLocation] = useState('Indore HQ');

  // Handlers
  const handleCreateCdr = (e) => {
    e.preventDefault();
    if (!newCaller.trim() || !newRecipient.trim()) return;

    const newRecord = {
      id: `CDR-10${cdrRecords.length + 1}`,
      caller: newCaller,
      recipient: newRecipient,
      type: newType,
      duration: newDuration,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      towerId: newTower,
      location: newLocation
    };

    setCdrRecords([newRecord, ...cdrRecords]);
    setNewCaller('');
    setNewRecipient('');
    setIsModalOpen(false);
    showToast('New CDR entry successfully recorded & indexed.');
  };

  const handleDeleteRecord = (id) => {
    setCdrRecords(cdrRecords.filter(r => r.id !== id));
    showToast(`CDR entry ${id} removed from analysis engine.`);
  };

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  // Comprehensive Filtering Logic
  const filteredRecords = cdrRecords.filter(record => {
    const matchesGlobal = 
      record.caller.toLowerCase().includes(globalSearch.toLowerCase()) ||
      record.recipient.toLowerCase().includes(globalSearch.toLowerCase()) ||
      record.towerId.toLowerCase().includes(globalSearch.toLowerCase()) ||
      record.location.toLowerCase().includes(globalSearch.toLowerCase());

    const matchesCaller = record.caller.toLowerCase().includes(filterCaller.toLowerCase());
    const matchesRecipient = record.recipient.toLowerCase().includes(filterRecipient.toLowerCase());
    const matchesType = filterType === 'All' || record.type === filterType;
    const matchesTower = record.towerId.toLowerCase().includes(filterTower.toLowerCase());

    return matchesGlobal && matchesCaller && matchesRecipient && matchesType && matchesTower;
  });

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 font-sans flex flex-col select-none text-xs">
      
      {/* 1. Top Navigation Bar */}
      <div className="bg-[#0b101c] border-b border-slate-800 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm text-cyan-400">CrimeGraph AI</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 font-medium">CDR Intelligence & Telephony Analysis</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-[#121826] border border-slate-700/80 px-3 py-1 rounded-full text-[11px] font-mono text-slate-300 flex items-center gap-2">
            <span>Total Logs <strong className="text-cyan-400">{cdrRecords.length}</strong></span>
            <span>|</span>
            <span>Filtered <strong className="text-purple-400">{filteredRecords.length}</strong></span>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded text-xs transition font-semibold shadow flex items-center gap-1.5 cursor-pointer"
          >
            + Add CDR Log
          </button>
        </div>
      </div>

      {/* 2. Main Workspace */}
      <div className="flex-1 p-3 bg-[#04060a] flex flex-col space-y-3 overflow-hidden">
        
        {/* Granular Field Filters Panel */}
        <div className="bg-[#0b101c] border border-slate-800 rounded p-3 flex flex-col space-y-2.5 shadow-md">
          <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
            <span className="font-bold text-slate-300">Granular Field Filters & Search</span>
            <button 
              onClick={() => { setGlobalSearch(''); setFilterCaller(''); setFilterRecipient(''); setFilterType('All'); setFilterTower(''); }}
              className="text-[10px] text-cyan-400 hover:underline cursor-pointer font-mono"
            >
              Reset All Filters
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Global Search</label>
              <input 
                type="text" 
                placeholder="Search all fields..." 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Caller Number</label>
              <input 
                type="text" 
                placeholder="Filter caller..." 
                value={filterCaller}
                onChange={(e) => setFilterCaller(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Recipient Number</label>
              <input 
                type="text" 
                placeholder="Filter recipient..." 
                value={filterRecipient}
                onChange={(e) => setFilterRecipient(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Call Type</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="All">All Types</option>
                <option value="Incoming">Incoming</option>
                <option value="Outgoing">Outgoing</option>
                <option value="Missed">Missed</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Tower ID</label>
              <input 
                type="text" 
                placeholder="Filter tower..." 
                value={filterTower}
                onChange={(e) => setFilterTower(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* CDR Records Table */}
        <div className="bg-[#0b101c] border border-slate-800 rounded shadow-md flex-1 overflow-hidden flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#121826] border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-mono">
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Caller Number</th>
                  <th className="p-3">Recipient Number</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Tower ID & Location</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-900/50 transition">
                    <td className="p-3 text-cyan-400 font-bold">{record.id}</td>
                    <td className="p-3 text-white">{record.caller}</td>
                    <td className="p-3 text-white">{record.recipient}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                        record.type === 'Incoming' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800' :
                        record.type === 'Outgoing' ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800' :
                        'bg-red-950/80 text-red-400 border-red-800'
                      }`}>
                        {record.type}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{record.duration}</td>
                    <td className="p-3 text-slate-400 text-[11px]">{record.timestamp}</td>
                    <td className="p-3">
                      <div className="text-slate-200 font-bold">{record.towerId}</div>
                      <div className="text-[10px] text-slate-500 font-sans">{record.location}</div>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button 
                        onClick={() => handleDeleteRecord(record.id)}
                        className="bg-red-950/60 hover:bg-red-900 text-red-300 px-2.5 py-1 rounded transition font-medium border border-red-900 font-sans text-[11px]"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-slate-500 font-sans">No CDR logs match your selected filter parameters.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* --- Modal: Add New CDR Log --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0b101c] border border-slate-700 rounded-lg p-4 w-full max-w-sm shadow-2xl space-y-3 font-sans">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-xs">Import / Log New CDR Record</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            
            <form onSubmit={handleCreateCdr} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Caller Number</label>
                <input 
                  type="text" 
                  required 
                  placeholder="+91-98765-XXXXX" 
                  value={newCaller}
                  onChange={(e) => setNewCaller(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Recipient Number</label>
                <input 
                  type="text" 
                  required 
                  placeholder="+91-91234-XXXXX" 
                  value={newRecipient}
                  onChange={(e) => setNewRecipient(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Call Type</label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                  >
                    <option value="Incoming">Incoming</option>
                    <option value="Outgoing">Outgoing</option>
                    <option value="Missed">Missed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Duration</label>
                  <input 
                    type="text" 
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono"
                    placeholder="02m 30s"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Tower ID</label>
                  <input 
                    type="text" 
                    value={newTower}
                    onChange={(e) => setNewTower(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Location Node</label>
                  <input 
                    type="text" 
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded font-medium">Cancel</button>
                <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1.5 rounded font-medium">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Action Notification Toast */}
      {notification && (
        <div className="fixed bottom-4 right-4 bg-cyan-600 text-white px-4 py-2 rounded shadow-2xl text-xs font-semibold animate-bounce z-50">
          ✔ {notification}
        </div>
      )}

    </div>
  );
}