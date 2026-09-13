import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  ShieldAlert,
  Users,
  GitFork,
  FileCheck2,
  Clock,
  ChevronRight,
  SlidersHorizontal,
  ArrowUpDown,
  Download,
  Share2,
  AlertTriangle,
  Building2,
  Layers,
  Sparkles,
  Eye,
  X,
  ExternalLink,
  Pencil,
  Save
} from 'lucide-react';

export default function Cases() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  
  // Modal States
  const [selectedCase, setSelectedCase] = useState(null);
  const [editingCase, setEditingCase] = useState(null);
  const [isCreating, setIsCreating] = useState(false); // New Case Modal State

  // New Case Form State
  const [newCaseData, setNewCaseData] = useState({
    title: '',
    firNo: '',
    category: '',
    agency: '',
    assignedOfficer: '',
    riskScore: 50,
    status: 'ACTIVE',
    tags: ''
  });

  // Mock NCRB Case Index Data
  const [casesData, setCasesData] = useState([
    {
      id: '26189-042',
      firNo: 'FIR-2026-NCRB-9021',
      title: 'Interstate Cyber Exploitation & Trafficking Syndicate',
      category: 'Organized Crime / Cyber Fraud',
      riskScore: 94,
      status: 'ACTIVE',
      assignedOfficer: 'Senior Investigator V. Kumar',
      agency: 'NCRB Women Safety Cell',
      dateOpened: '12 Jan 2026',
      entitiesCount: 48,
      evidenceCount: 126,
      alertsCount: 14,
      lastActivity: '10 mins ago',
      tags: ['Cyber Fraud', 'Interstate', 'UPI Scam']
    },
    {
      id: '26189-088',
      firNo: 'FIR-2026-DL-4410',
      title: 'Hawala Money Laundering & Shell Corp Network',
      category: 'Financial Crime',
      riskScore: 89,
      status: 'ACTIVE',
      assignedOfficer: 'Inspector R. Deshmukh',
      agency: 'Economic Offences Wing (EOW)',
      dateOpened: '03 Feb 2026',
      entitiesCount: 32,
      evidenceCount: 84,
      alertsCount: 8,
      lastActivity: '2 hours ago',
      tags: ['Hawala', 'Shell Companies', 'Crypto']
    },
    {
      id: '26189-102',
      firNo: 'FIR-2026-MH-1102',
      title: 'Cross-Border Telecom Tower Dump & Burner SIM Ring',
      category: 'Telecom & Counter-Terror',
      riskScore: 78,
      status: 'UNDER REVIEW',
      assignedOfficer: 'DySP S. Pattnaik',
      agency: 'Special Cell - Cyber Ops',
      dateOpened: '18 Feb 2026',
      entitiesCount: 19,
      evidenceCount: 42,
      alertsCount: 5,
      lastActivity: '1 day ago',
      tags: ['Burner SIM', 'Tower Dump', 'SDR/CDR']
    },
    {
      id: '26189-144',
      firNo: 'FIR-2025-UP-8801',
      title: 'Commercial Cargo Theft & Vehicle Spoofing Ring',
      category: 'Vehicle Theft / Smuggling',
      riskScore: 62,
      status: 'ARCHIVED',
      assignedOfficer: 'Inspector A. Khan',
      agency: 'State Crime Branch',
      dateOpened: '10 Nov 2025',
      entitiesCount: 14,
      evidenceCount: 31,
      alertsCount: 0,
      lastActivity: '2 weeks ago',
      tags: ['GPS Spoofing', 'ANPR Match']
    }
  ]);

  // Handle Save Edited Case
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setCasesData((prev) =>
      prev.map((c) => (c.id === editingCase.id ? editingCase : c))
    );
    setEditingCase(null);
  };

  // Handle Create New Case
  const handleCreateCase = (e) => {
    e.preventDefault();
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    
    const processedTags = newCaseData.tags
      ? newCaseData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : ['General'];

    const newCase = {
      id: `26${String(randomId).slice(-5)}`,
      firNo: newCaseData.firNo || `FIR-2026-NCRB-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newCaseData.title,
      category: newCaseData.category || 'General Investigation',
      riskScore: Number(newCaseData.riskScore),
      status: newCaseData.status,
      assignedOfficer: newCaseData.assignedOfficer || 'Unassigned Investigator',
      agency: newCaseData.agency || 'NCRB Special Unit',
      dateOpened: currentDate,
      entitiesCount: 1,
      evidenceCount: 2,
      alertsCount: 1,
      lastActivity: 'Just now',
      tags: processedTags
    };

    setCasesData([newCase, ...casesData]);
    setIsCreating(false);
    setNewCaseData({
      title: '',
      firNo: '',
      category: '',
      agency: '',
      assignedOfficer: '',
      riskScore: 50,
      status: 'ACTIVE',
      tags: ''
    });
  };

  // Filtering Logic
  const filteredCases = casesData.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.firNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.assignedOfficer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || c.status === statusFilter;

    const matchesRisk =
      riskFilter === 'ALL' ||
      (riskFilter === 'HIGH' && c.riskScore >= 80) ||
      (riskFilter === 'MED' && c.riskScore >= 60 && c.riskScore < 80) ||
      (riskFilter === 'LOW' && c.riskScore < 60);

    return matchesSearch && matchesStatus && matchesRisk;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'UNDER REVIEW':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 p-6 space-y-6 font-sans">
      
      {/* Top Header & Action Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Briefcase size={16} />
            <span>CRIME INVESTIGATION MANAGEMENT WORKSPACE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Central Case Repository & Dossier Index
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access active police FIRs, AI entity graphs, evidence ledgers, and multi-agency intelligence dossiers.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex items-center gap-2 bg-[#0b1329] border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 transition cursor-pointer">
            <Download size={14} className="text-cyan-400" /> Export Case Summary
          </button>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            <Plus size={16} /> Register New FIR / Case
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-[#0b1329]/60 border border-slate-800/80 p-3.5 rounded-2xl backdrop-blur-md">
        
        {/* Search Bar */}
        <div className="relative md:col-span-2">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by FIR No, Case ID, Title, Officer..."
            className="w-full bg-[#070b14] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-[#070b14] border border-slate-800 rounded-xl px-3 py-1.5">
          <Filter size={14} className="text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent w-full text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950">Status: All Cases</option>
            <option value="ACTIVE" className="bg-slate-950">Status: Active Only</option>
            <option value="UNDER REVIEW" className="bg-slate-950">Status: Under Review</option>
            <option value="ARCHIVED" className="bg-slate-950">Status: Archived</option>
          </select>
        </div>

        {/* Risk Score Filter */}
        <div className="flex items-center gap-2 bg-[#070b14] border border-slate-800 rounded-xl px-3 py-1.5">
          <ShieldAlert size={14} className="text-slate-500 shrink-0" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-transparent w-full text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950">Risk: All Tiers</option>
            <option value="HIGH" className="bg-slate-950">Risk: High (&gt;80)</option>
            <option value="MED" className="bg-slate-950">Risk: Medium (60-80)</option>
            <option value="LOW" className="bg-slate-950">Risk: Low (&lt;60)</option>
          </select>
        </div>

      </div>

      {/* --- TABLE VIEW --- */}
      <div className="bg-[#0b1329]/60 border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#070b14]/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4">Case ID / FIR No</th>
                <th className="py-3.5 px-4">Case Title & Category</th>
                <th className="py-3.5 px-4">Lead Agency & Officer</th>
                <th className="py-3.5 px-4 text-center">Risk Score</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-center">Metrics</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredCases.length > 0 ? (
                filteredCases.map((c) => (
                  <tr 
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className="hover:bg-slate-900/60 transition cursor-pointer group"
                  >
                    {/* ID & FIR */}
                    <td className="py-4 px-4 font-mono">
                      <span className="font-bold text-cyan-400 block">#{c.id}</span>
                      <span className="text-[10px] text-slate-400">{c.firNo}</span>
                    </td>

                    {/* Title & Category */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-white group-hover:text-cyan-300 transition max-w-xs truncate">
                        {c.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{c.category}</div>
                    </td>

                    {/* Agency & Officer */}
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-200">{c.assignedOfficer}</div>
                      <div className="text-[11px] text-slate-400">{c.agency}</div>
                    </td>

                    {/* Risk Score */}
                    <td className="py-4 px-4 text-center font-mono">
                      <span className="font-black text-rose-400 text-sm">{c.riskScore}</span>
                      <span className="text-[10px] text-slate-500">/100</span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-mono font-bold uppercase ${getStatusBadge(c.status)}`}>
                        {c.status}
                      </span>
                    </td>

                    {/* Metrics */}
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-3 text-[11px] text-slate-300">
                        <span className="flex items-center gap-1" title="Entities">
                          <Users size={12} className="text-cyan-400" /> {c.entitiesCount}
                        </span>
                        <span className="flex items-center gap-1" title="Evidence Logs">
                          <FileCheck2 size={12} className="text-emerald-400" /> {c.evidenceCount}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-amber-400" title="Alerts">
                          <AlertTriangle size={12} /> {c.alertsCount}
                        </span>
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => setEditingCase(c)}
                          className="p-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-300 border border-slate-800 rounded-xl transition cursor-pointer shadow-sm"
                          title="Edit Case"
                        >
                          <Pencil size={14} />
                        </button>
                        <button 
                          onClick={() => setSelectedCase(c)}
                          className="p-2 bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-800 rounded-xl transition cursor-pointer shadow-sm"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <Link
                          to={`/cases/${c.id}`}
                          className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-3 py-1.5 rounded-xl transition shadow-sm"
                        >
                          Workspace <ChevronRight size={13} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500 font-medium">
                    No matching cases found in the repository.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- CREATE NEW CASE MODAL --- */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 block mb-1">
                  NCRB SECURE SYSTEM
                </span>
                <h2 className="text-lg font-bold text-white">Register New FIR / Case</h2>
              </div>
              <button 
                onClick={() => setIsCreating(false)}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition cursor-pointer border border-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs text-slate-300">
              
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-400 block">Case Title / Incident Subject *</label>
                <input
                  type="text"
                  placeholder="e.g. Cyber Extortion & Darkweb Crypto Syndicate"
                  value={newCaseData.title}
                  onChange={(e) => setNewCaseData({ ...newCaseData, title: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-400 block">FIR Number</label>
                  <input
                    type="text"
                    placeholder="e.g. FIR-2026-DEL-8991"
                    value={newCaseData.firNo}
                    onChange={(e) => setNewCaseData({ ...newCaseData, firNo: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-400 block">Crime Category *</label>
                  <input
                    type="text"
                    placeholder="e.g. Financial Cyber Crime"
                    value={newCaseData.category}
                    onChange={(e) => setNewCaseData({ ...newCaseData, category: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-400 block">Lead Agency *</label>
                  <input
                    type="text"
                    placeholder="e.g. Cyber Cell Delhi"
                    value={newCaseData.agency}
                    onChange={(e) => setNewCaseData({ ...newCaseData, agency: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-400 block">Assigned Officer *</label>
                  <input
                    type="text"
                    placeholder="e.g. Inspector A. Sharma"
                    value={newCaseData.assignedOfficer}
                    onChange={(e) => setNewCaseData({ ...newCaseData, assignedOfficer: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-400 block">Initial Status</label>
                  <select
                    value={newCaseData.status}
                    onChange={(e) => setNewCaseData({ ...newCaseData, status: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="UNDER REVIEW">UNDER REVIEW</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-400 block">Risk Score (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newCaseData.riskScore}
                    onChange={(e) => setNewCaseData({ ...newCaseData, riskScore: Number(e.target.value) })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-400 block">Tags (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Phishing, Crypto, Ransomware"
                  value={newCaseData.tags}
                  onChange={(e) => setNewCaseData({ ...newCaseData, tags: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white font-semibold transition cursor-pointer border border-slate-800 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl transition text-xs shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Plus size={14} /> Register Case
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* --- CASE DETAILS POP-UP MODAL --- */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    CASE #{selectedCase.id}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedCase.firNo}
                  </span>
                  <span className={`ml-2 px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase ${getStatusBadge(selectedCase.status)}`}>
                    {selectedCase.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white">
                  {selectedCase.title}
                </h2>
              </div>
              
              <button 
                onClick={() => setSelectedCase(null)}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition cursor-pointer border border-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#070b14] rounded-2xl border border-slate-800/80 shadow-inner">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Crime Category</span>
                  <span className="font-semibold text-slate-200">{selectedCase.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Lead Agency</span>
                  <span className="font-semibold text-slate-200">{selectedCase.agency}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#070b14] rounded-2xl border border-slate-800/80 shadow-inner text-center">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Lead Officer</span>
                  <span className="font-semibold text-slate-200">{selectedCase.assignedOfficer}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Date Opened</span>
                  <span className="font-mono text-slate-200">{selectedCase.dateOpened}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Risk Score</span>
                  <span className="font-mono font-black text-rose-400 text-sm">{selectedCase.riskScore}/100</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#070b14] rounded-2xl border border-slate-800/80 text-center">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Total Entities</span>
                  <div className="text-base font-bold text-cyan-400 flex items-center justify-center gap-1.5 mt-1">
                    <Users size={16} /> {selectedCase.entitiesCount}
                  </div>
                </div>
                <div className="p-3 bg-[#070b14] rounded-2xl border border-slate-800/80 text-center">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Evidence Logs</span>
                  <div className="text-base font-bold text-emerald-400 flex items-center justify-center gap-1.5 mt-1">
                    <FileCheck2 size={16} /> {selectedCase.evidenceCount}
                  </div>
                </div>
                <div className="p-3 bg-[#070b14] rounded-2xl border border-slate-800/80 text-center">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Active Alerts</span>
                  <div className="text-base font-bold text-amber-400 flex items-center justify-center gap-1.5 mt-1">
                    <AlertTriangle size={16} /> {selectedCase.alertsCount}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Investigation Tags:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCase.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#070b14] border border-slate-800 rounded-xl text-[11px] font-mono text-slate-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 font-mono">Last activity: {selectedCase.lastActivity}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    const c = selectedCase;
                    setSelectedCase(null);
                    setEditingCase(c);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 font-semibold transition cursor-pointer text-xs"
                >
                  <Pencil size={13} /> Edit Case
                </button>
                <Link
                  to={`/cases/${selectedCase.id}`}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold px-4 py-2 rounded-xl transition text-xs shadow-lg shadow-cyan-500/20"
                >
                  Open Workspace <ExternalLink size={13} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- EDIT CASE POP-UP MODAL --- */}
      {editingCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
            
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 block mb-1">
                  EDITING CASE #{editingCase.id}
                </span>
                <h2 className="text-lg font-bold text-white">Update Case Information</h2>
              </div>
              <button 
                onClick={() => setEditingCase(null)}
                className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition cursor-pointer border border-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs text-slate-300">
              
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-400 block">Case Title</label>
                <input
                  type="text"
                  value={editingCase.title}
                  onChange={(e) => setEditingCase({ ...editingCase, title: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-400 block">Crime Category</label>
                  <input
                    type="text"
                    value={editingCase.category}
                    onChange={(e) => setEditingCase({ ...editingCase, category: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-400 block">Status</label>
                  <select
                    value={editingCase.status}
                    onChange={(e) => setEditingCase({ ...editingCase, status: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="UNDER REVIEW">UNDER REVIEW</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-400 block">Lead Officer</label>
                  <input
                    type="text"
                    value={editingCase.assignedOfficer}
                    onChange={(e) => setEditingCase({ ...editingCase, assignedOfficer: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-400 block">Risk Score (0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingCase.riskScore}
                    onChange={(e) => setEditingCase({ ...editingCase, riskScore: Number(e.target.value) })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-xl px-3.5 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingCase(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white font-semibold transition cursor-pointer border border-slate-800 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition text-xs shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}