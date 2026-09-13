import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  Radio,
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  GitFork,
  Smartphone,
  CreditCard,
  Car,
  MapPin,
  Flame,
  SlidersHorizontal,
  Zap,
  Layers,
  ArrowUpRight,
  UserCheck
} from 'lucide-react';

export default function Alerts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [ackStateFilter, setAckStateFilter] = useState('UNACKNOWLEDGED');

  // Mock Real-time Intelligence Alerts Data
  const [alerts, setAlerts] = useState([
    {
      id: 'ALT-2026-9011',
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021',
      title: 'High-Velocity Hawala UPI Transfer Detected',
      category: 'Financial Anomaly',
      severity: 'CRITICAL',
      score: 96,
      timestamp: '2 mins ago',
      location: 'Noida Sector 62, UP',
      source: 'NPCI / FIU Automated Stream',
      description: 'Multiple structured micro-transactions totaling ₹42,000,000 executed across 18 mule bank accounts within 120 seconds.',
      entitiesInvolved: ['ACC-9921-X', 'ACC-8831-Y', 'Rahul Verma (Suspect)'],
      acknowledged: false,
      tags: ['Hawala', 'UPI Mule', 'Real-time FIU']
    },
    {
      id: 'ALT-2026-8942',
      caseId: '26189-088',
      firNo: 'FIR-2026-DL-4410',
      title: 'Burner IMEI Active on Tower Dump Boundary',
      category: 'Telecom Intelligence',
      severity: 'HIGH',
      score: 84,
      timestamp: '14 mins ago',
      location: 'Connaught Place Outer Ring, Delhi',
      source: 'SDR / CDR Live Feed',
      description: 'Target IMEI #864192040182741 registered activity on Sector-4 Cell Tower following 14 days of radio silence.',
      entitiesInvolved: ['IMEI-864192040182741', '+91 98100-XXXXX'],
      acknowledged: false,
      tags: ['Tower Dump', 'Burner SIM', 'Cell ID']
    },
    {
      id: 'ALT-2026-8890',
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021',
      title: 'ANPR Camera Match for Wanted Syndicate Vehicle',
      category: 'Vehicle Tracking',
      severity: 'HIGH',
      score: 81,
      timestamp: '45 mins ago',
      location: 'Delhi-Gurugram Expressway Toll Gate 3',
      source: 'National ANPR Camera Mesh',
      description: 'License plate DL-01-AB-9921 flagged on toll camera heading Westbound. Vehicle linked to suspect transport operations.',
      entitiesInvolved: ['DL-01-AB-9921 (SUV)', 'Toll-Gate-3-Cam'],
      acknowledged: true,
      acknowledgedBy: 'DySP S. Pattnaik',
      tags: ['ANPR', 'Vehicle Intercept', 'Live Camera']
    },
    {
      id: 'ALT-2026-8712',
      caseId: '26189-102',
      firNo: 'FIR-2026-MH-1102',
      title: 'Crypto Wallet Mixing Activity Detected',
      category: 'Cyber / Crypto',
      severity: 'MEDIUM',
      score: 68,
      timestamp: '3 hours ago',
      location: 'Decentralized Blockchain Network',
      source: 'On-Chain Ledger Observer',
      description: '14.2 BTC transferred into Tornado Cash-style mixer from wallet previously tagged in ransom extortion scheme.',
      entitiesInvolved: ['0x71C...4f2', 'Mixer Smart Contract'],
      acknowledged: true,
      acknowledgedBy: 'Inspector R. Deshmukh',
      tags: ['Blockchain', 'Crypto Mixer', 'Ransomware']
    }
  ]);

  // Acknowledge Alert Handler
  const handleAcknowledge = (id) => {
    setAlerts(
      alerts.map((alt) =>
        alt.id === id
          ? {
              ...alt,
              acknowledged: true,
              acknowledgedBy: 'Current Officer (You)'
            }
          : alt
      )
    );
  };

  // Filtering Logic
  const filteredAlerts = alerts.filter((alt) => {
    const matchesSearch =
      alt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alt.firNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alt.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      severityFilter === 'ALL' || alt.severity === severityFilter;

    const matchesCategory =
      categoryFilter === 'ALL' || alt.category === categoryFilter;

    const matchesAck =
      ackStateFilter === 'ALL' ||
      (ackStateFilter === 'UNACKNOWLEDGED' && !alt.acknowledged) ||
      (ackStateFilter === 'ACKNOWLEDGED' && alt.acknowledged);

    return matchesSearch && matchesSeverity && matchesCategory && matchesAck;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Financial Anomaly':
        return <CreditCard size={15} className="text-cyan-400" />;
      case 'Telecom Intelligence':
        return <Smartphone size={15} className="text-amber-400" />;
      case 'Vehicle Tracking':
        return <Car size={15} className="text-emerald-400" />;
      default:
        return <Radio size={15} className="text-purple-400" />;
    }
  };

  const unackCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-400 mb-1">
            <Radio size={16} className="animate-pulse" />
            <span>REAL-TIME THREAT & INTELLIGENCE STREAM</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
            Active Alerts & Anomaly Monitor
            {unackCount > 0 && (
              <span className="text-xs bg-red-500/20 border border-red-500/40 text-red-400 px-2.5 py-0.5 rounded-full font-mono font-bold">
                {unackCount} Action Required
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated alerts triggered across FIU streams, telecom tower dumps, ANPR cameras, and AI risk models.
          </p>
        </div>

        {/* Live Stream Status Indicator */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-mono text-emerald-400 font-bold">LIVE SOCKET CONNECTED</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Latency: <span className="text-slate-200 font-mono">18ms</span></span>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
        
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by FIR, IMEI, Wallet, Title..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          />
        </div>

        {/* Ack State Filter */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
          <Bell size={14} className="text-slate-500 shrink-0" />
          <select
            value={ackStateFilter}
            onChange={(e) => setAckStateFilter(e.target.value)}
            className="bg-transparent w-full text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="UNACKNOWLEDGED" className="bg-slate-950">Action: Unacknowledged Only</option>
            <option value="ACKNOWLEDGED" className="bg-slate-950">Action: Acknowledged</option>
            <option value="ALL" className="bg-slate-950">Action: All Statuses</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
          <ShieldAlert size={14} className="text-slate-500 shrink-0" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-transparent w-full text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950">Severity: All Tiers</option>
            <option value="CRITICAL" className="bg-slate-950">Severity: Critical Only</option>
            <option value="HIGH" className="bg-slate-950">Severity: High</option>
            <option value="MEDIUM" className="bg-slate-950">Severity: Medium</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
          <Filter size={14} className="text-slate-500 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent w-full text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950">Category: All Feeds</option>
            <option value="Financial Anomaly" className="bg-slate-950">Financial Anomaly</option>
            <option value="Telecom Intelligence" className="bg-slate-950">Telecom Intelligence</option>
            <option value="Vehicle Tracking" className="bg-slate-950">Vehicle Tracking</option>
            <option value="Cyber / Crypto" className="bg-slate-950">Cyber / Crypto</option>
          </select>
        </div>

      </div>

      {/* Alerts Feed List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl">
            <CheckCircle2 size={36} className="text-emerald-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-white">No Matching Alerts</h3>
            <p className="text-xs text-slate-500 mt-1">All threat flags under selected filters have been addressed or cleared.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition shadow-xl space-y-4 ${
                alert.acknowledged
                  ? 'bg-slate-900/40 border-slate-800/80 opacity-80'
                  : alert.severity === 'CRITICAL'
                  ? 'bg-slate-900 border-red-500/40 shadow-red-950/20'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              {/* Alert Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    {getCategoryIcon(alert.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono font-bold text-cyan-400">{alert.id}</span>
                      <span className="text-slate-600">•</span>
                      <Link
                        to={`/cases/${alert.caseId}`}
                        className="text-xs font-mono text-slate-400 hover:text-cyan-300 transition underline"
                      >
                        {alert.firNo}
                      </Link>
                    </div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {alert.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase ${getSeverityBadge(
                      alert.severity
                    )}`}
                  >
                    {alert.severity} ({alert.score}/100)
                  </span>

                  <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    <Clock size={12} className="text-slate-500" /> {alert.timestamp}
                  </span>
                </div>
              </div>

              {/* Description & Location */}
              <div className="space-y-2">
                <p className="text-xs text-slate-300 leading-relaxed">{alert.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-red-400" /> Location: <strong className="text-slate-200">{alert.location}</strong>
                  </span>
                  <span className="flex items-center gap-1">
                    <Radio size={13} className="text-cyan-400" /> Source Stream: <strong className="text-slate-200">{alert.source}</strong>
                  </span>
                </div>
              </div>

              {/* Entities Involved */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mr-1">Entities Flagged:</span>
                {alert.entitiesInvolved.map((ent, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-md text-[11px] font-mono text-cyan-300"
                  >
                    {ent}
                  </span>
                ))}
              </div>

              {/* Card Action Controls */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                
                {/* Acknowledged status */}
                <div>
                  {alert.acknowledged ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                      <UserCheck size={14} /> Acknowledged by {alert.acknowledgedBy}
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium flex items-center gap-1.5">
                      <AlertTriangle size={14} /> Requires Officer Acknowledgment
                    </span>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                  {!alert.acknowledged && (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition"
                    >
                      Acknowledge Alert
                    </button>
                  )}

                  <Link
                    to={`/cases/${alert.caseId}`}
                    className="px-3.5 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg transition flex items-center gap-1"
                  >
                    Investigate in Workspace <ArrowUpRight size={14} />
                  </Link>
                </div>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}