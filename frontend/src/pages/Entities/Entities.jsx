import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  User,
  Phone,
  Building2,
  CreditCard,
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  FileCheck2,
  Plus,
  Download,
  CheckCircle2,
  Lock,
  ArrowUpDown
} from 'lucide-react';

export default function Entities() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('riskScore');

  // Master Entity Registry Data
  const [entities, setEntities] = useState([
    {
      id: 'ENT-801',
      name: 'Vikram "Raja" Malhotra',
      type: 'SUSPECT',
      role: 'Primary Kingpin / Syndicate Operative',
      linkedCases: ['26189-042', '26189-088'],
      firNo: 'FIR-2026-NCRB-9021',
      riskScore: 92,
      connectionsCount: 12,
      status: 'UNDER_SURVEILLANCE',
      lastSeen: '12 Jan 2026 - Noida Sector 62',
      primaryIdentifier: 'AADHAAR: XXXX-XXXX-9012'
    },
    {
      id: 'ENT-802',
      name: '+91 98210-XXXXX',
      type: 'PHONE',
      role: 'Burner SIM Line (Tower Dump Link)',
      linkedCases: ['26189-042'],
      firNo: 'FIR-2026-NCRB-9021',
      riskScore: 78,
      connectionsCount: 5,
      status: 'FLAGGED',
      lastSeen: '12 Jan 2026 - CDR Call Peak',
      primaryIdentifier: 'IMSI: 4044509128XXXXX'
    },
    {
      id: 'ENT-803',
      name: 'Apex Horizon Shell Corp Ltd.',
      type: 'ENTITY',
      role: 'Offshore Financial Proxy Company',
      linkedCases: ['26189-088'],
      firNo: 'FIR-2026-DL-4410',
      riskScore: 88,
      connectionsCount: 8,
      status: 'FROZEN',
      lastSeen: '05 Feb 2026 - Wire Transfer',
      primaryIdentifier: 'CIN: U72200DL2024PTC9021'
    },
    {
      id: 'ENT-804',
      name: 'Axis Bank Mule Acct #9041',
      type: 'FINANCIAL',
      role: 'Mule Account (Money Laundering)',
      linkedCases: ['26189-042', '26189-088'],
      firNo: 'FIR-2026-NCRB-9021',
      riskScore: 65,
      connectionsCount: 4,
      status: 'INVESTIGATING',
      lastSeen: '15 Jan 2026 - ATM Withdrawal',
      primaryIdentifier: 'IFSC: UTIB0000102'
    },
    {
      id: 'ENT-805',
      name: 'Anand "Micro" Verma',
      type: 'SUSPECT',
      role: 'Technical Conduit / Mule Recruiter',
      linkedCases: ['26189-102'],
      firNo: 'FIR-2026-MH-1102',
      riskScore: 71,
      connectionsCount: 6,
      status: 'DETAINED',
      lastSeen: '20 Feb 2026 - In Custody',
      primaryIdentifier: 'PAN: BKPPR9021K'
    }
  ]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'SUSPECT':
        return <User size={16} className="text-red-400" />;
      case 'PHONE':
        return <Phone size={16} className="text-amber-400" />;
      case 'ENTITY':
        return <Building2 size={16} className="text-purple-400" />;
      case 'FINANCIAL':
        return <CreditCard size={16} className="text-cyan-400" />;
      default:
        return <Users size={16} className="text-slate-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'UNDER_SURVEILLANCE':
        return (
          <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-[10px] font-mono font-bold">
            SURVEILLANCE
          </span>
        );
      case 'FROZEN':
        return (
          <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded text-[10px] font-mono font-bold">
            FROZEN
          </span>
        );
      case 'DETAINED':
        return (
          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded text-[10px] font-mono font-bold">
            DETAINED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded text-[10px] font-mono font-bold">
            INVESTIGATING
          </span>
        );
    }
  };

  const filteredEntities = entities
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.primaryIdentifier.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => b[sortField] - a[sortField]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <Users size={16} />
            <span>CENTRAL SYNDICATE & ENTITY MASTER INDEX</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Target & Suspect Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Master intelligence index cross-referencing suspects, CDR burner SIM cards, corporate shell entities, and bank accounts.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 transition">
            <Download size={14} className="text-cyan-400" /> Export Dossier List
          </button>
          <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20">
            <Plus size={16} /> Register Target Entity
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
        
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Target Name, Identifier (Aadhaar/PAN/CIN/IMSI), or Role..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        {/* Entity Category Filter */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
          <Filter size={14} className="text-slate-500 shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent w-full text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950">Category: All Entities</option>
            <option value="SUSPECT" className="bg-slate-950">Individuals / Suspects</option>
            <option value="PHONE" className="bg-slate-950">CDR Phone Lines</option>
            <option value="ENTITY" className="bg-slate-950">Corporate Shell Entities</option>
            <option value="FINANCIAL" className="bg-slate-950">Bank Mule Accounts</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
          <ShieldAlert size={14} className="text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent w-full text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950">Status: All Statuses</option>
            <option value="UNDER_SURVEILLANCE" className="bg-slate-950">Under Surveillance</option>
            <option value="FROZEN" className="bg-slate-950">Account / Entity Frozen</option>
            <option value="DETAINED" className="bg-slate-950">Detained in Custody</option>
            <option value="INVESTIGATING" className="bg-slate-950">Under Investigation</option>
          </select>
        </div>

      </div>

      {/* Main Entities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEntities.length === 0 ? (
          <div className="col-span-full bg-slate-900/80 border border-slate-800 p-8 rounded-2xl text-center text-slate-500 text-xs">
            No intelligence entities found matching your search parameters.
          </div>
        ) : (
          filteredEntities.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                      {getTypeIcon(item.type)}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 block">
                        {item.id}
                      </span>
                      <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                        {item.name}
                      </h3>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {/* Role Description */}
                <p className="text-xs text-slate-300 font-medium">
                  {item.role}
                </p>

                {/* Primary Identification Metadata */}
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400">
                  <span className="text-[10px] text-slate-500 block">Primary Identification</span>
                  <span className="text-slate-200 font-bold mt-0.5 block">{item.primaryIdentifier}</span>
                </div>

                {/* Threat Score & Associated Connections Bar */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Threat Score</span>
                    <span className="text-sm font-mono font-black text-red-400">{item.riskScore} / 100</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-500 block">Linked Graph Nodes</span>
                    <span className="text-sm font-mono font-black text-cyan-400">{item.connectionsCount} Links</span>
                  </div>
                </div>

              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 font-mono">
                  {item.firNo}
                </span>

                <Link
                  to={`/network?node=${item.id}`}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold text-[11px] transition"
                >
                  Inspect Link Graph <ChevronRight size={14} />
                </Link>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}