import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  GitFork,
  FileText,
  AlertTriangle,
  MapPin,
  TrendingUp,
  Search,
  ExternalLink,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  Filter,
  Eye,
  Activity
} from 'lucide-react';

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedRegion, setSelectedRegion] = useState('All');

  // Interactive Modal States
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [selectedEntityModal, setSelectedEntityModal] = useState(null);
  const [selectedAlertModal, setSelectedAlertModal] = useState(null);
  const [graphModalOpen, setGraphModalOpen] = useState(false);
  const [allAlertsModalOpen, setAllAlertsModalOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState('');

  // Helper for Toast Notifications
  const triggerToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast('');
    }, 3000);
  };

  // KPI Mock Data
  const kpis = [
    { title: 'Active Cases', count: '142', change: '+12%', status: 'up', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'High-Risk Entities', count: '38', change: '+5', status: 'up', icon: Users, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'Detected Networks', count: '19', change: '+2', status: 'up', icon: GitFork, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Critical Alerts', count: '07', change: '-3', status: 'down', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Evidence Logs', count: '1,842', change: '+124', status: 'up', icon: ShieldAlert, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  // High-Risk Individuals
  const highRiskEntities = [
    { id: 'ENT-9021', name: 'Rajesh "Raju" Sharma', alias: 'Shadow', riskScore: 94, centrality: '96%', connections: 42, type: 'Person', primaryCrime: 'Human Trafficking Syndicate' },
    { id: 'ENT-4412', name: 'Vikram Choudhury', alias: 'Vicky', riskScore: 89, centrality: '91%', connections: 31, type: 'Person', primaryCrime: 'Financial Fraud / Laundering' },
    { id: 'ENT-1108', name: '+91 98765 43210', alias: 'Burner SIM-09', riskScore: 87, centrality: '88%', connections: 56, type: 'Phone', primaryCrime: 'Extortion Network' },
    { id: 'ENT-3390', name: 'Apex Logistics Pvt Ltd', alias: 'Front Org', riskScore: 84, centrality: '82%', connections: 24, type: 'Organization', primaryCrime: 'Illegal Transport' },
  ];

  // Critical Alerts
  const criticalAlerts = [
    { id: 'ALT-882', title: 'Sudden Communication Burst', description: '47 calls detected between Person-001 & Burner-09 within 2 hrs', timestamp: '14 mins ago', severity: 'HIGH', category: 'CDR Anomaly' },
    { id: 'ALT-881', title: 'Circular Financial Transaction', description: '₹42,00,000 looped across 4 shell accounts in 30 minutes', timestamp: '1 hr ago', severity: 'CRITICAL', category: 'Financial' },
    { id: 'ALT-879', title: 'Location Co-location Detected', description: '3 high-risk entities spotted at Sector 62 Safehouse', timestamp: '3 hrs ago', severity: 'HIGH', category: 'Geographic' },
  ];

  // Recent Intelligence Feed
  const recentActivity = [
    { id: 'ACT-102', action: 'FIR-2026-901 parsed & connected to Case #26189-042', agent: 'AI Ingestion Engine', time: '10m ago', verified: true },
    { id: 'ACT-101', action: 'SHA-256 Blockchain Hash generated for Evidence #EV-4419', agent: 'Officer V. Kumar', time: '25m ago', verified: true },
    { id: 'ACT-100', action: 'New edge added: ENT-9021 -> TRANSFERRED -> ENT-3390', agent: 'Graph Analytics System', time: '1h ago', verified: true },
    { id: 'ACT-099', action: 'Intelligence Brief generated for NCRB Women Safety Cell', agent: 'Senior Analyst R. Roy', time: '2h ago', verified: true },
  ];

  const regions = ['All', 'NCR Zone - District 04', 'Western Corridor', 'Eastern Financial Hub'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans relative">
      
      {/* Toast Notification Popup */}
      {notificationToast && (
        <div className="fixed top-5 right-5 z-50 bg-cyan-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <CheckCircle2 size={16} /> {notificationToast}
        </div>
      )}

      {/* Top Bar / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Ministry of Home Affairs • NCRB Women Safety Division
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mt-1">
            Intelligence Command Dashboard
          </h1>
          <p className="text-sm text-slate-400">
            AI-Powered Criminal Network Analysis & Cross-Jurisdictional Intelligence System
          </p>
        </div>

        {/* Global Controls - Fully Functional */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {['24h', '7d', '30d', 'All'].map((range) => (
              <button
                key={range}
                onClick={() => {
                  setTimeRange(range);
                  triggerToast(`Time filter updated to: ${range}`);
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  timeRange === range
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setRegionModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-lg text-xs font-medium text-slate-200 transition cursor-pointer active:scale-95"
          >
            <Filter size={14} className="text-cyan-400" />
            <span>Region: {selectedRegion}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div
              key={index}
              onClick={() => triggerToast(`Filtered view by: ${kpi.title}`)}
              className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-4 hover:border-cyan-500/50 transition shadow-lg relative overflow-hidden cursor-pointer active:scale-95"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{kpi.title}</span>
                <div className={`p-2 rounded-lg ${kpi.bg}`}>
                  <Icon size={18} className={kpi.color} />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="text-2xl font-bold text-white tracking-tight">{kpi.count}</h3>
                <span className={`text-xs font-semibold ${kpi.status === 'up' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Network & Geographic Threat Intelligence (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Network Overview Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <GitFork size={18} className="text-cyan-400" />
                <h2 className="text-base font-semibold text-white">Active Criminal Networks Overview</h2>
              </div>
              <button 
                onClick={() => setGraphModalOpen(true)} 
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                Open Full Graph <ArrowUpRight size={12} />
              </button>
            </div>

            {/* Network Mini Analytics Summary */}
            <div className="grid grid-cols-3 gap-4 mb-4 bg-slate-950/60 p-3.5 rounded-lg border border-slate-800/50">
              <div>
                <p className="text-xs text-slate-400">Total Graph Clusters</p>
                <p className="text-lg font-bold text-cyan-400">19 Identified</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Largest Cluster Size</p>
                <p className="text-lg font-bold text-purple-400">128 Entities</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Cross-Border Interlinks</p>
                <p className="text-lg font-bold text-amber-400">14 Links</p>
              </div>
            </div>

            {/* Visual Simulated Graph Container - Clickable */}
            <div 
              onClick={() => setGraphModalOpen(true)}
              className="relative h-64 bg-slate-950 rounded-lg border border-slate-800/80 flex items-center justify-center overflow-hidden cursor-pointer hover:border-cyan-500/50 transition group"
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
              
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
                <Activity size={32} className="text-cyan-400 animate-pulse mb-2 group-hover:scale-110 transition" />
                <p className="text-xs font-semibold text-slate-200">Interactive Network Topology Engine Ready</p>
                <p className="text-[11px] text-slate-500 max-w-sm mt-1">
                  128 entities and 384 relational edges synced in Neo4j. Click to launch full canvas graph.
                </p>
              </div>

              <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-md text-[10px] text-slate-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Graph Engine: Active
              </div>
            </div>
          </div>

          {/* High-Risk Entities Watchlist */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-red-400" />
                <h2 className="text-base font-semibold text-white">Top High-Risk Entity Watchlist</h2>
              </div>
              <span className="text-xs text-slate-400">Ranked by Centrality & Risk Score</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Entity ID / Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Primary Category</th>
                    <th className="p-3">Connections</th>
                    <th className="p-3">Centrality</th>
                    <th className="p-3">Risk Score</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {highRiskEntities.map((entity) => (
                    <tr key={entity.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-3">
                        <div className="font-semibold text-white">{entity.name}</div>
                        <div className="text-[10px] text-slate-400">{entity.id} • Alias: {entity.alias}</div>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                          {entity.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">{entity.primaryCrime}</td>
                      <td className="p-3 font-medium text-slate-200">{entity.connections}</td>
                      <td className="p-3 text-cyan-400 font-semibold">{entity.centrality}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-red-500 h-1.5 rounded-full"
                              style={{ width: `${entity.riskScore}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-red-400">{entity.riskScore}</span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedEntityModal(entity)}
                          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-lg cursor-pointer active:scale-95 transition"
                        >
                          <Eye size={13} /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column: Alerts & Real-time Audit Stream */}
        <div className="space-y-6">

          {/* Critical Threat & Anomaly Alerts */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                <h2 className="text-base font-semibold text-white">Critical Anomaly Alerts</h2>
              </div>
              <button onClick={() => setAllAlertsModalOpen(true)} className="text-xs text-cyan-400 hover:underline cursor-pointer">View All</button>
            </div>

            <div className="space-y-3">
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-slate-950/80 border border-slate-800/80 hover:border-amber-500/40 rounded-lg p-3.5 transition"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {alert.category}
                    </span>
                    <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 mt-1">{alert.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {alert.description}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-800/40 flex justify-end">
                    <button 
                      onClick={() => setSelectedAlertModal(alert)}
                      className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      Investigate Anomaly <ArrowUpRight size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geographic Threat Heatmap Summary */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-emerald-400" />
                <h2 className="text-base font-semibold text-white">Geographic Hotspots</h2>
              </div>
              <span className="text-xs text-slate-400">Women Safety Division</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div 
                onClick={() => triggerToast('Zooming into NCR Zone - District 04')}
                className="flex justify-between items-center p-2.5 bg-slate-950/60 rounded border border-slate-800/50 hover:border-cyan-500/50 cursor-pointer transition"
              >
                <span className="text-slate-300 font-medium">NCR Zone - District 04</span>
                <span className="text-red-400 font-bold">28 Active Nodes</span>
              </div>
              <div 
                onClick={() => triggerToast('Zooming into Western Corridor')}
                className="flex justify-between items-center p-2.5 bg-slate-950/60 rounded border border-slate-800/50 hover:border-cyan-500/50 cursor-pointer transition"
              >
                <span className="text-slate-300 font-medium">Western Corridor (Safehouses)</span>
                <span className="text-amber-400 font-bold">14 Active Nodes</span>
              </div>
              <div 
                onClick={() => triggerToast('Zooming into Eastern Financial Transfer Hubs')}
                className="flex justify-between items-center p-2.5 bg-slate-950/60 rounded border border-slate-800/50 hover:border-cyan-500/50 cursor-pointer transition"
              >
                <span className="text-slate-300 font-medium">Eastern Financial Transfer Hubs</span>
                <span className="text-cyan-400 font-bold">09 Active Nodes</span>
              </div>
            </div>
          </div>

          {/* System & Audit Log Stream */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800/60 pb-3">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-purple-400" />
                <h2 className="text-base font-semibold text-white">System Audit & Integrity Stream</h2>
              </div>
            </div>

            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div 
                  key={activity.id} 
                  onClick={() => triggerToast(`Verified Audit Hash: ${activity.id}`)}
                  className="flex gap-2.5 text-xs hover:bg-slate-950 p-2 rounded-lg cursor-pointer transition"
                >
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-slate-200 leading-snug">{activity.action}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span>{activity.agent}</span>
                      <span>•</span>
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* --- MODALS FOR INTERACTIVE BUTTONS --- */}

      {/* Region Filter Selection Modal */}
      {regionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Filter size={16} className="text-cyan-400" /> Select Jurisdiction Region
              </h3>
              <button onClick={() => setRegionModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-xs">✕</button>
            </div>
            <div className="space-y-2">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => {
                    setSelectedRegion(region);
                    setRegionModalOpen(false);
                    triggerToast(`Region filter updated to: ${region}`);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    selectedRegion === region ? 'bg-cyan-500 text-slate-950' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Entity Profile Inspection Modal */}
      {selectedEntityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users size={16} className="text-red-400" /> High-Risk Entity Dossier
              </h3>
              <button onClick={() => setSelectedEntityModal(null)} className="text-slate-400 hover:text-white font-bold text-xs">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <p><strong className="text-cyan-400">ID & Name:</strong> {selectedEntityModal.id} - {selectedEntityModal.name}</p>
              <p><strong className="text-cyan-400">Alias:</strong> {selectedEntityModal.alias}</p>
              <p><strong className="text-cyan-400">Type:</strong> {selectedEntityModal.type}</p>
              <p><strong className="text-cyan-400">Primary Charge:</strong> {selectedEntityModal.primaryCrime}</p>
              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 block">Risk Score</span>
                  <span className="text-sm font-mono font-bold text-red-400">{selectedEntityModal.riskScore} / 100</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Graph Centrality</span>
                  <span className="text-sm font-mono font-bold text-cyan-400">{selectedEntityModal.centrality}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => {
                  triggerToast(`Exported intelligence brief for ${selectedEntityModal.id}`);
                  setSelectedEntityModal(null);
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Export Brief
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Critical Alert Investigation Modal */}
      {selectedAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-400" /> Anomaly Investigation Room
              </h3>
              <button onClick={() => setSelectedAlertModal(null)} className="text-slate-400 hover:text-white font-bold text-xs">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <p><strong className="text-cyan-400">Alert ID:</strong> {selectedAlertModal.id}</p>
              <p><strong className="text-cyan-400">Category:</strong> {selectedAlertModal.category}</p>
              <p><strong className="text-cyan-400">Title:</strong> {selectedAlertModal.title}</p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block mb-1 font-mono">ANOMALY LOG DETAILS</span>
                <p className="text-slate-400">{selectedAlertModal.description}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => {
                  triggerToast(`Anomaly ${selectedAlertModal.id} marked as resolved!`);
                  setSelectedAlertModal(null);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Graph View Simulator Modal */}
      {graphModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-2xl w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <GitFork size={18} className="text-cyan-400" /> Full Network Topology Graph View
              </h3>
              <button onClick={() => setGraphModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>
            <div className="h-64 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center p-6">
              <Activity size={40} className="text-cyan-400 animate-spin mb-3" />
              <p className="text-sm font-bold text-white">Neo4j Cluster Graph Stream Loaded</p>
              <p className="text-xs text-slate-400 mt-1">Showing all 128 interlinked nodes and 384 relational edges in real-time cluster view.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => {
                  setGraphModalOpen(false);
                  triggerToast('Full network graph snapshot downloaded.');
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Export Graph Snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* All Alerts Modal */}
      {allAlertsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" /> All Critical System Alerts
              </h3>
              <button onClick={() => setAllAlertsModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-sm">✕</button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {criticalAlerts.map(alert => (
                <div key={alert.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <div className="flex justify-between font-bold text-amber-400">
                    <span>{alert.title}</span>
                    <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                  </div>
                  <p className="text-slate-400 mt-1">{alert.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button 
                onClick={() => setAllAlertsModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}