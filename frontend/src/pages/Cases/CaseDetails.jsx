import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Briefcase,
  ShieldAlert,
  Users,
  GitFork,
  Clock,
  FileCheck2,
  Phone,
  CreditCard,
  MapPin,
  AlertTriangle,
  Bot,
  FileSpreadsheet,
  ArrowLeft,
  Share2,
  Lock,
  Download,
  Plus,
  ExternalLink,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  FileText,
  Search,
  Zap,
  Activity,
  Send,
  Eye,
  Shield,
  Layers,
  BarChart3
} from 'lucide-react';

import NetworkGraph from '../../components/NetworkGraph';

export default function CaseDetails() {
  const { caseId = '26189-042' } = useParams();
  const [activeTab, setActiveTab] = useState('Overview');
  const [aiQuery, setAiQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Case #26189-042 analysis loaded. I have indexed 126 evidence files and identified 24 primary entities. How can I assist your investigation?',
      citation: 'System Auto-Ingest Engine'
    }
  ]);

  // Case Metadata
  const caseMeta = {
    id: `CASE #${caseId}`,
    firNo: 'FIR-2026-NCRB-9021',
    title: 'Interstate Cyber Exploitation & Trafficking Syndicate',
    category: 'Organized Crime / Cyber Fraud',
    riskScore: 87,
    status: 'ACTIVE INVESTIGATION',
    assignedOfficer: 'Senior Investigator V. Kumar',
    leadAgency: 'NCRB Women Safety Cell',
    dateOpened: '12 Jan 2026',
    entitiesCount: 48,
    relationshipsCount: 384,
    evidenceCount: 126,
    alertsCount: 14,
  };

  const tabs = [
    { name: 'Overview', icon: Briefcase },
    { name: 'Entities', icon: Users, count: '48' },
    { name: 'Network', icon: GitFork, count: 'Hero' },
    { name: 'Timeline', icon: Clock },
    { name: 'Evidence', icon: FileCheck2, count: '126' },
    { name: 'Communications', icon: Phone, count: '31 CDRs' },
    { name: 'Financial', icon: CreditCard },
    { name: 'Locations', icon: MapPin },
    { name: 'Alerts', icon: AlertTriangle, count: '14' },
    { name: 'AI Assistant', icon: Bot },
    { name: 'Audit', icon: FileSpreadsheet },
  ];

  const handleAiSearch = (e) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    const userText = aiQuery;
    setAiQuery('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText },
      {
        sender: 'ai',
        text: `Analysis generated for "${userText}": Cross-referencing 47 CDR logs and UPI transfer records. Person-001 (Rajesh Sharma) transferred ₹42,00,000 to Shell Account #8841 within 30 minutes of 14 calls made to Burner SIM +91 98765 43210.`,
        citation: 'Source: Evidence #EV-0231 (CDR Log) & #EV-0412 (Bank Statement)'
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Link to="/cases" className="hover:text-cyan-400 flex items-center gap-1">
              <ArrowLeft size={13} /> All Cases
            </Link>
            <ChevronRight size={12} />
            <span className="text-cyan-400 font-mono">{caseMeta.id}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {caseMeta.title}
            </h1>
            <span className="px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold uppercase tracking-wider">
              {caseMeta.status}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1">
            {caseMeta.firNo} • Opened: {caseMeta.dateOpened} • Lead Officer: <span className="text-slate-200 font-medium">{caseMeta.assignedOfficer}</span>
          </p>
        </div>

        {/* Global Case Actions */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 transition">
            <Share2 size={14} className="text-cyan-400" /> Export Brief
          </button>
          <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20">
            <Plus size={15} /> Add Evidence / Entity
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-800/80 overflow-x-auto custom-scrollbar pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.name;

          return (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-cyan-300 border border-slate-800 shadow-inner'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              <Icon size={15} className={isActive ? 'text-cyan-400' : 'text-slate-500'} />
              <span>{tab.name}</span>
              {tab.count && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full border font-mono ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                      : 'bg-slate-950 text-slate-500 border-slate-800'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'Overview' && (
        <div className="space-y-6">
          
          {/* Metrics Summary Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center">
              <p className="text-[10px] font-bold uppercase text-slate-500">Risk Assessment</p>
              <p className="text-xl font-black text-red-400 mt-1">{caseMeta.riskScore}/100</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center">
              <p className="text-[10px] font-bold uppercase text-slate-500">Persons</p>
              <p className="text-xl font-bold text-white mt-1">24</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center">
              <p className="text-[10px] font-bold uppercase text-slate-500">Vehicles</p>
              <p className="text-xl font-bold text-amber-400 mt-1">08</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center">
              <p className="text-[10px] font-bold uppercase text-slate-500">Burner Phones</p>
              <p className="text-xl font-bold text-cyan-400 mt-1">31</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center">
              <p className="text-[10px] font-bold uppercase text-slate-500">Safehouses</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">13</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center">
              <p className="text-[10px] font-bold uppercase text-slate-500">Shell Orgs</p>
              <p className="text-xl font-bold text-purple-400 mt-1">04</p>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl text-center">
              <p className="text-[10px] font-bold uppercase text-slate-500">Evidence Vault</p>
              <p className="text-xl font-bold text-slate-200 mt-1">{caseMeta.evidenceCount}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* AI Case Executive Summary */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-cyan-400 animate-pulse" />
                  <h2 className="text-base font-semibold text-white">AI Executive Brief & Findings</h2>
                </div>
                <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
                  Confidence: 94%
                </span>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-xs leading-relaxed text-slate-300 space-y-3">
                <p>
                  <strong>Primary Allegation:</strong> Operation of a multi-state illegal financial laundering and recruitment network targeting victims across 4 union territories.
                </p>
                <p>
                  <strong>Key AI Recommendation:</strong> Person <span className="text-red-400 font-bold">Rajesh "Raju" Sharma (ENT-9021)</span> exhibits a 96% PageRank centrality score. Communication patterns indicate he coordinates financial transfers with <span className="text-purple-400 font-bold">Apex Logistics (ENT-3390)</span> using 4 rotating burner numbers.
                </p>
                <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg text-red-300 text-[11px] flex items-start gap-2">
                  <AlertTriangle size={15} className="shrink-0 mt-0.5 text-red-400" />
                  <div>
                    <strong>Action Item:</strong> Immediate issuance of look-out circular for Vehicle DL-01-AB-9012 spotted near Safehouse Sector 62.
                  </div>
                </div>
              </div>

              {/* Quick Network Topology Sample */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Network Sub-graph Preview</h3>
                <NetworkGraph selectedCaseId={caseId} />
              </div>
            </div>

            {/* Right Side: Key Entities & Immediate Alerts */}
            <div className="space-y-6">
              
              {/* Key Suspects Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg">
                <h2 className="text-base font-semibold text-white mb-3 border-b border-slate-800/80 pb-2">
                  Primary Key Suspects
                </h2>
                <div className="space-y-3">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Rajesh "Raju" Sharma</p>
                      <p className="text-[10px] text-slate-500">ID: ENT-9021 • Kingpin</p>
                    </div>
                    <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      Risk 94
                    </span>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Vikram Choudhury</p>
                      <p className="text-[10px] text-slate-500">ID: ENT-4412 • Operator</p>
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      Risk 89
                    </span>
                  </div>
                </div>
              </div>

              {/* Case Audit Security Stamp */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Shield size={16} /> Evidence Chain Integrity Secured
                </div>
                <p className="text-[11px] text-slate-400">
                  All 126 evidence files are cryptographically anchored using SHA-256 hashes on the Hyperledger Fabric ledger.
                </p>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB CONTENT: NETWORK GRAPH */}
      {activeTab === 'Network' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-300 font-semibold">Interactive Criminal Network Graph Engine</span>
            <span className="text-cyan-400 font-mono">384 Relationship Edges Loaded</span>
          </div>
          <NetworkGraph selectedCaseId={caseId} />
        </div>
      )}

      {/* TAB CONTENT: AI ASSISTANT & COPILOT */}
      {activeTab === 'AI Assistant' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl max-w-4xl mx-auto space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bot size={20} className="text-cyan-400" />
            <h2 className="text-base font-bold text-white">Case Investigation Copilot</h2>
          </div>

          <div className="h-96 overflow-y-auto space-y-3 p-4 bg-slate-950 rounded-xl border border-slate-800">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`p-3.5 rounded-xl max-w-lg text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-slate-950 font-medium'
                      : 'bg-slate-900 border border-slate-800 text-slate-200'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.citation && (
                    <p className="text-[10px] text-cyan-400 mt-2 pt-2 border-t border-slate-800/80 font-mono">
                      {msg.citation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAiSearch} className="flex gap-2">
            <input
              type="text"
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              placeholder="Ask AI: 'Who are the associates of Person A who visited Location X?'"
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-1.5 transition"
            >
              <Send size={14} /> Ask AI
            </button>
          </form>
        </div>
      )}

      {/* Fallback View for Other Tabs */}
      {['Entities', 'Timeline', 'Evidence', 'Communications', 'Financial', 'Locations', 'Alerts', 'Audit'].includes(
        activeTab
      ) && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center space-y-3">
          <Layers size={36} className="mx-auto text-cyan-400 animate-pulse" />
          <h3 className="text-base font-bold text-white">{activeTab} Workspace Active</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Showing indexed {activeTab.toLowerCase()} data for Case #{caseId}. Fully connected with NCRB intelligence repository.
          </p>
        </div>
      )}

    </div>
  );
}