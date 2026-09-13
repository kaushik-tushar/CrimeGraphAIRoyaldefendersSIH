import React, { useState } from 'react';
import {
  Clock,
  Calendar,
  Filter,
  PhoneCall,
  CreditCard,
  MapPin,
  ShieldAlert,
  FileCheck2,
  ChevronRight,
  UserCheck,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

/**
 * Timeline Component - Chronological Case Sequence & CDR Event Visualizer
 *
 * @param {Object} props
 * @param {Array} [props.events] - Array of chronological timeline events [{ id, timestamp, date, title, category, description, source, target, riskScore, status }]
 * @param {Function} [props.onSelectEvent] - Callback when an officer selects a timeline node
 * @param {string} [props.className=""] - Custom Tailwind CSS wrapper class
 */
export default function Timeline({
  events: initialEvents,
  onSelectEvent,
  className = ''
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeEventId, setActiveEventId] = useState(null);

  // Default simulated event sequence for tactical investigation
  const defaultEvents = [
    {
      id: 'EVT-9001',
      timestamp: '02:14:22 IST',
      date: '2026-09-09',
      title: 'Midnight Call Burst Sequence',
      category: 'CDR',
      description: 'Primary Burner SIM (+91 98210-XXXXX) placed 14 high-frequency calls to known syndicate mule accounts within 8 minutes.',
      source: '+91 98210-XXXXX',
      target: '+91 97110-XXXXX',
      location: 'Sector 62 Tower Dump Node, Noida',
      riskScore: 92,
      status: 'CRITICAL'
    },
    {
      id: 'EVT-9002',
      timestamp: '01:58:10 IST',
      date: '2026-09-09',
      title: 'High-Value RTGS Cash Transfer',
      category: 'FINANCIAL',
      description: 'Wire of ₹45,00,000 initiated from compromised corporate portal into Axis Bank Mule Account #9041.',
      source: 'HDFC Corp Portal',
      target: 'Axis Bank Acct #9041',
      location: 'Connaught Place Branch, Delhi',
      riskScore: 88,
      status: 'HIGH'
    },
    {
      id: 'EVT-9003',
      timestamp: '23:40:00 IST',
      date: '2026-09-08',
      title: 'IMEI Swap & Unregistered SIM Activation',
      category: 'DEVICE',
      description: 'Secondary handset IMEI (869402049182391) registered a new subscriber SIM card under fake ID.',
      source: 'IMEI 869402049182391',
      target: 'SIM IMSI-40445',
      location: 'Indirapuram Tower Cell, Ghaziabad',
      riskScore: 75,
      status: 'MEDIUM'
    },
    {
      id: 'EVT-9004',
      timestamp: '18:15:30 IST',
      date: '2026-09-08',
      title: 'FIR Case Registration & NCB Sync',
      category: 'LEGAL',
      description: 'FIR #2026-NCRB-9021 lodged under IT Act Sec 66D & IPC 420. Forensic drive hash ingested.',
      source: 'Cyber Crime Cell',
      target: 'NCRB Database',
      location: 'HQ Cyber Police Station',
      riskScore: 40,
      status: 'VERIFIED'
    }
  ];

  const events = initialEvents || defaultEvents;

  // Filter events based on active category tab & search input
  const filteredEvents = events.filter((evt) => {
    const matchesCategory =
      selectedCategory === 'ALL' || evt.category === selectedCategory;
    const matchesQuery =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (evt.source && evt.source.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesQuery;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'CDR':
        return <PhoneCall size={14} className="text-amber-400" />;
      case 'FINANCIAL':
        return <CreditCard size={14} className="text-cyan-400" />;
      case 'DEVICE':
        return <ShieldAlert size={14} className="text-red-400" />;
      case 'LEGAL':
        return <FileCheck2 size={14} className="text-emerald-400" />;
      default:
        return <Clock size={14} className="text-slate-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse">
            <AlertTriangle size={10} /> CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded text-[10px] font-mono font-bold">
            HIGH RISK
          </span>
        );
      case 'VERIFIED':
        return (
          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-[10px] font-mono font-bold flex items-center gap-1">
            <CheckCircle2 size={10} /> VERIFIED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded text-[10px] font-mono font-bold">
            LOGGED
          </span>
        );
    }
  };

  return (
    <div className={`bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col font-sans ${className}`}>
      
      {/* Header & Controls */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400 shrink-0">
            <Clock size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Chronological Case Event Stream
              <span className="px-1.5 py-0.2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono rounded">
                EVIDENCE TIMELINE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Sequenced audit trail of subscriber pings, wire transactions, and police filings
            </p>
          </div>
        </div>

        {/* Filter Search Field */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter timeline events..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 transition font-sans"
          />
        </div>
      </div>

      {/* Category Tabs Bar */}
      <div className="p-2 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-1 text-[11px] font-mono overflow-x-auto">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1 rounded-lg transition font-bold whitespace-nowrap ${
            selectedCategory === 'ALL'
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ALL EVENTS ({events.length})
        </button>
        <button
          onClick={() => setSelectedCategory('CDR')}
          className={`px-3 py-1 rounded-lg transition font-bold whitespace-nowrap ${
            selectedCategory === 'CDR'
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          CDR / CALLS
        </button>
        <button
          onClick={() => setSelectedCategory('FINANCIAL')}
          className={`px-3 py-1 rounded-lg transition font-bold whitespace-nowrap ${
            selectedCategory === 'FINANCIAL'
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          BANK WIRES
        </button>
        <button
          onClick={() => setSelectedCategory('DEVICE')}
          className={`px-3 py-1 rounded-lg transition font-bold whitespace-nowrap ${
            selectedCategory === 'DEVICE'
              ? 'bg-red-500/10 border border-red-500/30 text-red-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          IMEI / HARDWARE
        </button>
        <button
          onClick={() => setSelectedCategory('LEGAL')}
          className={`px-3 py-1 rounded-lg transition font-bold whitespace-nowrap ${
            selectedCategory === 'LEGAL'
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          FIR / LEGAL
        </button>
      </div>

      {/* Main Vertical Timeline Content Stream */}
      <div className="p-4 sm:p-6 max-h-[520px] overflow-y-auto space-y-0 relative">
        
        {/* Continuous Vertical Backbone Spine Line */}
        <div className="absolute left-7 sm:left-9 top-6 bottom-6 w-0.5 bg-slate-800" />

        {filteredEvents.length > 0 ? (
          filteredEvents.map((evt, idx) => {
            const isSelected = activeEventId === evt.id;

            return (
              <div
                key={evt.id}
                onClick={() => {
                  setActiveEventId(evt.id);
                  if (onSelectEvent) onSelectEvent(evt);
                }}
                className="relative pl-10 sm:pl-14 pb-8 last:pb-0 group cursor-pointer"
              >
                {/* Node Milestone Icon Marker */}
                <div
                  className={`absolute left-0 top-0.5 p-2 rounded-xl border transition-all duration-200 z-10 ${
                    isSelected
                      ? 'bg-slate-950 border-cyan-400 text-cyan-400 shadow-lg shadow-cyan-500/20 scale-110'
                      : 'bg-slate-900 border-slate-800 text-slate-400 group-hover:border-slate-600 group-hover:text-slate-200'
                  }`}
                >
                  {getCategoryIcon(evt.category)}
                </div>

                {/* Event Card Content Box */}
                <div
                  className={`p-4 rounded-2xl border transition-all duration-200 space-y-2.5 ${
                    isSelected
                      ? 'bg-slate-950/90 border-cyan-500/40 shadow-xl'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-slate-800/60 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-cyan-400">
                        {evt.id}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Calendar size={10} /> {evt.date}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock size={10} /> {evt.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(evt.status)}
                      <span className="text-[10px] font-mono font-black text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                        RISK: {evt.riskScore}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition leading-snug">
                      {evt.title}
                    </h4>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  {/* Operational Detail Pills (Source / Target / Location) */}
                  <div className="pt-1 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
                    {evt.source && (
                      <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <ArrowUpRight size={10} className="text-amber-400" />
                        <span className="text-slate-500">SRC:</span> {evt.source}
                      </span>
                    )}

                    {evt.target && (
                      <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1">
                        <ArrowDownLeft size={10} className="text-cyan-400" />
                        <span className="text-slate-500">TGT:</span> {evt.target}
                      </span>
                    )}

                    {evt.location && (
                      <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded flex items-center gap-1 ml-auto">
                        <MapPin size={10} className="text-slate-500" />
                        {evt.location}
                      </span>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 font-mono">
            No events match the specified filter or query criteria.
          </div>
        )}

      </div>

      {/* Footer Status Bar */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <span>TIMELINE RECONSTRUCTION MODE: ACTIVE</span>
        <span className="text-cyan-400 font-bold">TOTAL SEQUENCED: {filteredEvents.length} NODES</span>
      </div>

    </div>
  );
}