import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  User,
  Phone,
  Building2,
  CreditCard,
  ShieldAlert,
  ArrowLeft,
  Share2,
  Download,
  FileCheck2,
  Clock,
  ExternalLink,
  Lock,
  MapPin,
  Calendar,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Network,
  Eye,
  Activity,
  Maximize2
} from 'lucide-react';

export default function EntityDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('DOSSIER');

  // Simulated Entity Profile Data (In production, fetched via API using `id`)
  const entity = {
    id: id || 'ENT-801',
    name: 'Vikram "Raja" Malhotra',
    type: 'SUSPECT',
    role: 'Primary Kingpin / Syndicate Operative',
    status: 'UNDER_SURVEILLANCE',
    riskScore: 92,
    primaryIdentifier: 'AADHAAR: XXXX-XXXX-9012',
    alternateIdentifiers: [
      { label: 'PAN Card', value: 'ABCDE1234F' },
      { label: 'Passport', value: 'Z-8041920' },
      { label: 'Primary IMEI', value: '869402049182391' }
    ],
    primaryFIR: 'FIR-2026-NCRB-9021',
    caseId: '26189-042',
    registeredAddress: 'House No. 42, Block C, Sector 62, Noida, UP - 201301',
    lastKnownLocation: 'Tower Dump Sector 62, Noida (12 Jan 2026, 02:14:22 IST)',
    linkedCases: [
      { caseId: '26189-042', firNo: 'FIR-2026-NCRB-9021', title: 'Cyber Financial Fraud & Wire Hijack', role: 'Key Accused' },
      { caseId: '26189-088', firNo: 'FIR-2026-DL-4410', title: 'Offshore Shell Account Money Laundering', role: 'Co-Conspirator' }
    ],
    linkedDevices: [
      { type: 'Phone SIM', value: '+91 98210-XXXXX', label: 'Burner SIM (Airtel NCR)' },
      { type: 'Phone SIM', value: '+91 98112-XXXXX', label: 'Primary Encrypted Line' },
      { type: 'Bank Acct', value: 'Axis Bank - Acct #9041', label: 'Mule Receiver Node' }
    ],
    evidenceLog: [
      { id: 'EVT-9081', timestamp: '12 Jan 2026, 02:14:22 IST', title: 'Inter-Suspect Tower Call (184s)', hash: 'SHA256: e3b0c...852b855' },
      { id: 'EVT-9078', timestamp: '12 Jan 2026, 02:45:10 IST', title: 'RTGS Wire Transfer (₹45,00,000)', hash: 'SHA256: 7f83b...126d9069' }
    ]
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'UNDER_SURVEILLANCE':
        return (
          <span className="px-3 py-1 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
            <Radio size={14} className="animate-pulse" /> SURVEILLANCE ACTIVE
          </span>
        );
      case 'FROZEN':
        return (
          <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
            <Lock size={14} /> ACCOUNT FROZEN
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5">
            <Activity size={14} /> UNDER INVESTIGATION
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      
      {/* Top Navigation & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <Link
            to="/entities"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition mb-2"
          >
            <ArrowLeft size={14} /> Back to Master Entity Directory
          </Link>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-cyan-400">
              <User size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400">{entity.id}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs font-mono text-slate-400">{entity.primaryIdentifier}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {entity.name}
              </h1>
            </div>
          </div>
        </div>

        {/* Action Controls & Threat Metric */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-3">
            <ShieldAlert size={22} className="text-red-400" />
            <div>
              <span className="text-[10px] font-mono text-red-400 font-bold block">THREAT SCORE</span>
              <span className="text-lg font-mono font-black text-red-400 leading-none">{entity.riskScore} / 100</span>
            </div>
          </div>

          <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 transition">
            <Download size={14} className="text-cyan-400" /> Export Dossier
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('DOSSIER')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'DOSSIER'
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <User size={14} /> Profile & Identifiers
        </button>

        <button
          onClick={() => setActiveTab('CASES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'CASES'
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <FileCheck2 size={14} /> Linked FIR Cases
        </button>

        <button
          onClick={() => setActiveTab('EVIDENCE')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'EVIDENCE'
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Clock size={14} /> Associated Evidence Logs
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TAB 1: DOSSIER & PROFILE */}
        {activeTab === 'DOSSIER' && (
          <>
            {/* Primary Dossier Summary */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <User size={16} className="text-cyan-400" /> Executive Intelligence Summary
                </h2>
                {getStatusBadge(entity.status)}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block">Primary Role in Syndicate</span>
                  <span className="text-xs font-bold text-slate-200 block">{entity.role}</span>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono block">Anchor FIR Reference</span>
                  <Link to={`/cases/${entity.caseId}`} className="text-xs font-bold text-cyan-400 hover:underline block">
                    {entity.primaryFIR}
                  </Link>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1 md:col-span-2">
                  <span className="text-[10px] text-slate-500 font-mono block">Registered Physical Address</span>
                  <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <MapPin size={14} className="text-cyan-400 shrink-0" /> {entity.registeredAddress}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl space-y-1 md:col-span-2">
                  <span className="text-[10px] text-slate-500 font-mono block">Last Known Geolocation (CDR/Tower)</span>
                  <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1.5 mt-0.5">
                    <Radio size={14} className="text-amber-400 shrink-0" /> {entity.lastKnownLocation}
                  </span>
                </div>
              </div>

              {/* Verified Identity Records */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Secondary Identity Credentials
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {entity.alternateIdentifiers.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">{item.label}</span>
                      <span className="text-xs font-mono font-bold text-slate-200 mt-0.5 block">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Side Panel: Linked Devices & Quick Network Link */}
            <div className="space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <h2 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Phone size={16} className="text-cyan-400" /> Linked Devices & Accounts
                </h2>

                <div className="space-y-2.5">
                  {entity.linkedDevices.map((dev, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 block">{dev.label}</span>
                        <span className="text-xs font-mono font-bold text-slate-200 mt-0.5 block">{dev.value}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded">
                        {dev.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Link Graph Shortcut */}
              <div className="bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/20 rounded-2xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Network size={18} />
                  <h3 className="text-xs font-bold uppercase tracking-wider">Syndicate Link Graph</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Inspect phone call links, shared IP addresses, and money trails for this entity.
                </p>
                <Link
                  to={`/network?node=${entity.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20"
                >
                  <Maximize2 size={14} /> Open Graph Visualizer
                </Link>
              </div>
            </div>
          </>
        )}

        {/* TAB 2: LINKED CASES */}
        {activeTab === 'CASES' && (
          <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <FileCheck2 size={16} className="text-cyan-400" /> Associated First Information Reports (FIRs)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {entity.linkedCases.map((c) => (
                <div key={c.caseId} className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">{c.firNo}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded font-bold">
                      {c.role}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{c.title}</h3>
                  <Link
                    to={`/cases/${c.caseId}`}
                    className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline font-semibold"
                  >
                    View Case File Dossier <ExternalLink size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: EVIDENCE LOGS */}
        {activeTab === 'EVIDENCE' && (
          <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <h2 className="text-sm font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Clock size={16} className="text-cyan-400" /> Evidence Chain Ingestions
            </h2>

            <div className="space-y-3">
              {entity.evidenceLog.map((log) => (
                <div key={log.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">{log.id}</span>
                      <span className="text-xs font-mono text-slate-500">• {log.timestamp}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1">{log.title}</h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    {log.hash}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}