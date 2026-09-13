import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  Lock,
  Key,
  Database,
  Bell,
  Cpu,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  HardDrive,
  FileCode,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  Radio,
  Sparkles,
  Terminal,
  Activity
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('SECURITY');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Security & Authentication Settings State
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('15');
  const [ipWhitelisting, setIpWhitelisting] = useState(true);
  const [securityClearance, setSecurityClearance] = useState('TOP_SECRET_LEVEL_3');

  // Node & API Connectivity Settings State
  const [cdrParserNode, setCdrParserNode] = useState('https://node-delhi-04.ncrb.gov.in/api/v2/cdr');
  const [fiuBankingNode, setFiuBankingNode] = useState('https://fiu-gateway.fin.gov.in/v1/ledger');
  const [ledgerAnchorNode, setLedgerAnchorNode] = useState('0x9041...c821b (Mainnet Relay Node 2)');
  const [autoVerifyHash, setAutoVerifyHash] = useState(true);

  // Notification & Audit Alert State
  const [notifyHighPriorityCase, setNotifyHighPriorityCase] = useState(true);
  const [notifyHashTamperAlert, setNotifyHashTamperAlert] = useState(true);
  const [notifyCdrCompletion, setNotifyCdrCompletion] = useState(false);

  // System Diagnostics / Cache State
  const [isFlushingCache, setIsFlushingCache] = useState(false);
  const [isTestingNodes, setIsTestingNodes] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      showToast('All administrative settings securely committed to mainnet node!');
      setTimeout(() => setIsSaved(false), 3000);
    }, 1200);
  };

  const handleFlushCache = () => {
    setIsFlushingCache(true);
    setTimeout(() => {
      setIsFlushingCache(false);
      showToast('System cache and temporary cryptographic tokens flushed successfully.');
    }, 1500);
  };

  const handleTestConnections = () => {
    setIsTestingNodes(true);
    setTimeout(() => {
      setIsTestingNodes(false);
      showToast('Node connectivity check passed: All endpoints responding with <15ms latency.');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans relative">
      
      {/* Floating Feedback Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-cyan-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-cyan-400 animate-bounce">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <SettingsIcon size={16} />
            <span>SYSTEM CONTROL & SECURITY CONFIGURATION</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Portal Administration Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure cryptographic nodes, officer security clearance levels, 2FA tokens, and CDR parsing integration feeds.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-xl animate-fade-in">
              <CheckCircle2 size={15} /> System Configuration Updated
            </span>
          )}
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw size={15} className="animate-spin" /> Committing Changes...
              </>
            ) : (
              <>
                <Save size={15} /> Save All Settings
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('SECURITY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'SECURITY'
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Lock size={14} /> Security & Authorization
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('NODES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'NODES'
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Server size={14} /> API & Node Integration
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('NOTIFICATIONS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'NOTIFICATIONS'
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Bell size={14} /> Alerts & Notifications
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('SYSTEM')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'SYSTEM'
              ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Cpu size={14} /> Hardware & Audit Logs
        </button>
      </div>

      {/* Main Settings Content Form */}
      <form onSubmit={handleSaveSettings} className="space-y-6">

        {/* TAB 1: SECURITY & AUTHENTICATION */}
        {activeTab === 'SECURITY' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Security Clearance Profile */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <ShieldCheck size={18} className="text-cyan-400" />
                <h2 className="text-sm font-bold text-white">Officer Security Clearance Level</h2>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Assigned Clearance Tier
                </label>
                <select
                  value={securityClearance}
                  onChange={(e) => {
                    setSecurityClearance(e.target.value);
                    showToast(`Clearance tier updated to ${e.target.value}`);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-cyan-400 focus:outline-none focus:border-cyan-500 cursor-pointer font-mono"
                >
                  <option value="TOP_SECRET_LEVEL_3">LEVEL 3 - TOP SECRET (Full Evidence & Financial Access)</option>
                  <option value="SECRET_LEVEL_2">LEVEL 2 - SECRET (CDR & Case Dossier Access)</option>
                  <option value="RESTRICTED_LEVEL_1">LEVEL 1 - RESTRICTED (Read-Only Case View)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Higher clearances require biometric hardware token validation.
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  Inactivity Auto-Lock Timeout
                </label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => {
                    setSessionTimeout(e.target.value);
                    showToast(`Session auto-lock timeout set to ${e.target.value} minutes.`);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="5">5 Minutes (High Security)</option>
                  <option value="15">15 Minutes (Recommended)</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>
            </div>

            {/* Authentication Protocols */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                <Key size={18} className="text-cyan-400" />
                <h2 className="text-sm font-bold text-white">Multi-Factor Hardware Security</h2>
              </div>

              {/* Toggle 2FA */}
              <div 
                onClick={() => {
                  setTwoFactorAuth(!twoFactorAuth);
                  showToast(`Hardware Token 2FA ${!twoFactorAuth ? 'Enabled' : 'Disabled'}`);
                }}
                className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Hardware Token 2FA</span>
                  <span className="text-[10px] text-slate-500">Require YubiKey or TOTP hardware token on login.</span>
                </div>
                <input
                  type="checkbox"
                  checked={twoFactorAuth}
                  onChange={() => {}} // handled by parent div
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Toggle IP Whitelisting */}
              <div 
                onClick={() => {
                  setIpWhitelisting(!ipWhitelisting);
                  showToast(`Police Intranet IP Whitelisting ${!ipWhitelisting ? 'Enabled' : 'Disabled'}`);
                }}
                className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Police Intranet IP Whitelisting</span>
                  <span className="text-[10px] text-slate-500">Restrict access exclusively to whitelisted NCRB VPN nodes.</span>
                </div>
                <input
                  type="checkbox"
                  checked={ipWhitelisting}
                  onChange={() => {}}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: API & NODE INTEGRATION */}
        {activeTab === 'NODES' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Server size={18} className="text-cyan-400" />
                <h2 className="text-sm font-bold text-white">Central Intelligence Data Endpoints</h2>
              </div>
              <button
                type="button"
                onClick={handleTestConnections}
                disabled={isTestingNodes}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-xs rounded-xl font-bold transition cursor-pointer"
              >
                {isTestingNodes ? <RefreshCw size={12} className="animate-spin" /> : <Radio size={12} />}
                Test Node Links
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Telecom Tower Dump / CDR Parsing Service Endpoint
                </label>
                <input
                  type="text"
                  value={cdrParserNode}
                  onChange={(e) => setCdrParserNode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Financial Intelligence Unit (FIU) Banking Feed Relay
                </label>
                <input
                  type="text"
                  value={fiuBankingNode}
                  onChange={(e) => setFiuBankingNode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-cyan-400 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  SHA-256 Chain of Custody Ledger Relay Node
                </label>
                <input
                  type="text"
                  value={ledgerAnchorNode}
                  onChange={(e) => setLedgerAnchorNode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div 
                onClick={() => {
                  setAutoVerifyHash(!autoVerifyHash);
                  showToast(`Auto-verify hash integrity ${!autoVerifyHash ? 'Activated' : 'Deactivated'}`);
                }}
                className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Auto-Verify Hash Integrity on Upload</span>
                  <span className="text-[10px] text-slate-500">Automatically cross-check SHA-256 hashes against ledger records during ingestion.</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoVerifyHash}
                  onChange={() => {}}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: NOTIFICATIONS & ALERTS */}
        {activeTab === 'NOTIFICATIONS' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Bell size={18} className="text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Investigative Alert Preferences</h2>
            </div>

            <div className="space-y-3">
              <div 
                onClick={() => {
                  setNotifyHashTamperAlert(!notifyHashTamperAlert);
                  showToast(`Cryptographic Tamper Alerts ${!notifyHashTamperAlert ? 'Enabled' : 'Disabled'}`);
                }}
                className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition"
              >
                <div>
                  <span className="text-xs font-bold text-white block">Cryptographic Tamper Alerts</span>
                  <span className="text-[10px] text-slate-500">Immediate dispatch if an evidence SHA-256 hash fails verification.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyHashTamperAlert}
                  onChange={() => {}}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div 
                onClick={() => {
                  setNotifyHighPriorityCase(!notifyHighPriorityCase);
                  showToast(`High Priority Case Activity notifications ${!notifyHighPriorityCase ? 'Enabled' : 'Disabled'}`);
                }}
                className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition"
              >
                <div>
                  <span className="text-xs font-bold text-white block">High Priority Case Activity</span>
                  <span className="text-[10px] text-slate-500">Notify when new evidence or suspect notes are added to assigned FIRs.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyHighPriorityCase}
                  onChange={() => {}}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>

              <div 
                onClick={() => {
                  setNotifyCdrCompletion(!notifyCdrCompletion);
                  showToast(`CDR Processing Completion notifications ${!notifyCdrCompletion ? 'Enabled' : 'Disabled'}`);
                }}
                className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition"
              >
                <div>
                  <span className="text-xs font-bold text-white block">CDR Processing Completion</span>
                  <span className="text-[10px] text-slate-500">Notify as soon as telecom tower dumps finish automated matrix parsing.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyCdrCompletion}
                  onChange={() => {}}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM HARDWARE & AUDIT LOGS */}
        {activeTab === 'SYSTEM' && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Cpu size={18} className="text-cyan-400" />
                <h2 className="text-sm font-bold text-white">System Node Diagnostics</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFlushCache}
                  disabled={isFlushingCache}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs rounded-xl font-bold transition hover:bg-red-500/20 cursor-pointer"
                >
                  {isFlushingCache ? <RefreshCw size={12} className="animate-spin" /> : <Terminal size={12} />}
                  Flush Node Cache
                </button>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono px-2.5 py-1 rounded font-bold">
                  HEALTH: 100%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Active Node Cluster</span>
                <span className="text-sm font-bold text-white font-mono mt-0.5 block">DELHI-NCRB-NODE-04</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Storage Vault Capacity</span>
                <span className="text-sm font-bold text-cyan-400 font-mono mt-0.5 block">14.2 TB / 50 TB Used</span>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-500 block">Ledger Consensus Latency</span>
                <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">12ms (SHA-256 Lock)</span>
              </div>
            </div>
          </div>
        )}

      </form>

    </div>
  );
}