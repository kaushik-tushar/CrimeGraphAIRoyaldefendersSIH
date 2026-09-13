import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  ShieldAlert,
  Phone,
  CreditCard,
  AlertTriangle,
  Clock,
  ArrowRight,
  Filter,
  RefreshCw,
  CheckCircle2,
  Lock,
  ChevronRight,
  Layers
} from 'lucide-react';

/**
 * ThreatFeed Component
 * Real-time event log feed monitoring high-priority crime network alerts.
 * 
 * @param {Object} props
 * @param {Array} [props.threats] - Optional list of initial threat alert objects
 * @param {Function} [props.onSelectThreat] - Callback when an officer selects a feed item
 * @param {string} [props.className=""] - Extra Tailwind CSS classes
 */
export default function ThreatFeed({
  threats: initialThreats,
  onSelectThreat,
  className = ''
}) {
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'CDR' | 'FINANCIAL'
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulated Real-Time Intelligence Alert Events Stream
  const defaultThreats = [
    {
      id: 'ALT-2026-901',
      title: 'Midnight Call Frequency Spike (Kingpin Node)',
      type: 'CDR',
      severity: 'CRITICAL',
      timestamp: 'Just now • 02:14:22 IST',
      description: 'Burner SIM (+91 98210-XXXXX) initiated 14 rapid calls to blacklisted syndicate number within 8 minutes.',
      location: 'Sector 62 Tower Dump Node, Noida',
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021'
    },
    {
      id: 'ALT-2026-898',
      title: 'Suspicious RTGS Mule Fund Transfer',
      type: 'FINANCIAL',
      severity: 'CRITICAL',
      timestamp: '4 mins ago • 02:10:05 IST',
      description: 'High-value wire of ₹45,00,000 transferred to flagged shell account in Axis Bank (Acct #9041).',
      location: 'Connaught Place Branch, Delhi',
      caseId: '26189-088',
      firNo: 'FIR-2026-DL-4410'
    },
    {
      id: 'ALT-2026-892',
      title: 'New IMEI Link Discovered on Tower Ping',
      type: 'CDR',
      severity: 'HIGH',
      timestamp: '18 mins ago • 01:56:12 IST',
      description: 'Primary suspect handset IMEI (869402049182391) registered a secondary unregistered SIM activation.',
      location: 'Indirapuram Cell Node, Ghaziabad',
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021'
    },
    {
      id: 'ALT-2026-885',
      title: 'Evidence Chain SHA-256 Checksum Verified',
      type: 'SYSTEM',
      severity: 'MEDIUM',
      timestamp: '35 mins ago • 01:39:00 IST',
      description: 'Disk forensic dump (42.8 MB) verified against master cryptographic ledger.',
      location: 'HQ Forensic Unit',
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021'
    }
  ];

  const threatList = initialThreats || defaultThreats;

  // Filter alerts based on category or severity
  const filteredThreats = threatList.filter((item) => {
    if (filter === 'ALL') return true;
    if (filter === 'CRITICAL') return item.severity === 'CRITICAL';
    if (filter === 'CDR') return item.type === 'CDR';
    if (filter === 'FINANCIAL') return item.type === 'FINANCIAL';
    return true;
  });

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-[10px] font-mono font-bold flex items-center gap-1 animate-pulse shrink-0">
            <ShieldAlert size={10} /> CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded text-[10px] font-mono font-bold shrink-0">
            HIGH
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded text-[10px] font-mono font-bold shrink-0">
            INFO
          </span>
        );
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'CDR':
        return <Phone size={14} className="text-amber-400" />;
      case 'FINANCIAL':
        return <CreditCard size={14} className="text-cyan-400" />;
      default:
        return <Radio size={14} className="text-purple-400" />;
    }
  };

  return (
    <div className={`bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col font-sans ${className}`}>
      
      {/* Top Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-red-400 shrink-0">
            <Radio size={18} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              Tactical Threat Stream
              <span className="px-1.5 py-0.2 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono rounded">
                LIVE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Automated anomaly detection across active suspect nodes
            </p>
          </div>
        </div>

        {/* Refresh Stream Button */}
        <button
          onClick={handleRefresh}
          className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl transition"
          title="Refresh Threat Stream"
        >
          <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-cyan-400' : ''} />
        </button>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="p-2 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-1 text-[11px] font-mono">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1 rounded-lg transition font-bold ${
            filter === 'ALL'
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ALL ({threatList.length})
        </button>
        <button
          onClick={() => setFilter('CRITICAL')}
          className={`px-3 py-1 rounded-lg transition font-bold ${
            filter === 'CRITICAL'
              ? 'bg-red-500/10 border border-red-500/30 text-red-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          CRITICAL
        </button>
        <button
          onClick={() => setFilter('CDR')}
          className={`px-3 py-1 rounded-lg transition font-bold ${
            filter === 'CDR'
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          CDR / TOWER
        </button>
        <button
          onClick={() => setFilter('FINANCIAL')}
          className={`px-3 py-1 rounded-lg transition font-bold ${
            filter === 'FINANCIAL'
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          WIRES
        </button>
      </div>

      {/* Main Stream Item List */}
      <div className="divide-y divide-slate-800/80 max-h-[420px] overflow-y-auto">
        {filteredThreats.length > 0 ? (
          filteredThreats.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectThreat && onSelectThreat(item)}
              className="p-4 hover:bg-slate-800/40 transition cursor-pointer space-y-2.5 group"
            >
              {/* Event Meta Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
                    {getTypeIcon(item.type)}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400">{item.id}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                    <Clock size={10} /> {item.timestamp}
                  </span>
                </div>
                {getSeverityBadge(item.severity)}
              </div>

              {/* Event Title & Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-100 group-hover:text-cyan-400 transition leading-snug">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Footer Location & FIR Link */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>{item.location}</span>
                <Link
                  to={`/cases/${item.caseId}`}
                  className="text-cyan-400 hover:underline flex items-center gap-1 font-bold"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.firNo} <ChevronRight size={12} />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-500 font-mono">
            No active threat alerts match the selected filter criteria.
          </div>
        )}
      </div>

      {/* Footer Status Bar */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <CheckCircle2 size={12} /> SYNCED WITH HQ TOWER ENGINE
        </span>
        <span className="text-slate-400">LOG RETENTION: 90 DAYS</span>
      </div>

    </div>
  );
}