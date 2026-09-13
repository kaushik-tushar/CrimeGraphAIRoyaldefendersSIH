import React, { useState } from 'react';
import {
  Search,
  Bell,
  Shield,
  User,
  ChevronDown,
  Activity,
  Sparkles,
  Lock,
  Terminal,
  ExternalLink,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function Navbar({ onSearchClick }) {
  const [showAlerts, setShowAlerts] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Quick notification feed for navbar
  const topAlerts = [
    { id: 1, text: 'Circular Money Flow detected: ₹42L looped in Case #26189', time: '12m ago', level: 'CRITICAL' },
    { id: 2, text: '47 calls in 2h detected for High-Risk SIM +91 98765 43210', time: '45m ago', level: 'HIGH' },
    { id: 3, text: 'New FIR Document EV-9021 verified via SHA-256 Blockchain', time: '1h ago', level: 'INFO' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between font-sans">
      
      {/* Left: Global Search Launcher */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div
          onClick={onSearchClick}
          className="w-full flex items-center gap-3 bg-slate-900/90 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl text-xs text-slate-400 cursor-pointer transition shadow-inner group"
        >
          <Search size={16} className="text-slate-500 group-hover:text-cyan-400 transition" />
          <span className="flex-1 truncate">
            Search entities, CDRs, phone numbers, FIRs or ask AI: <span className="text-slate-500 italic">"Find associates of Person A"</span>
          </span>
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right: Active Status, Alerts & User Controls */}
      <div className="flex items-center gap-4">

        {/* System Active Node Context Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-400 font-medium">NCRB Network Node:</span>
          <span className="text-cyan-400 font-bold font-mono">LIVE-IN-26189</span>
        </div>

        {/* Critical Alerts Trigger Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
            title="System Intelligence Alerts"
          >
            <Bell size={18} className="text-slate-300" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-slate-950 font-bold text-[9px] flex items-center justify-center border-2 border-slate-950 animate-pulse">
              3
            </span>
          </button>

          {/* Alerts Popup Menu */}
          {showAlerts && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
              <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Unreviewed Alerts</span>
                </div>
                <a href="/alerts" className="text-[11px] text-cyan-400 hover:underline">View All</a>
              </div>

              <div className="divide-y divide-slate-800/60 max-h-64 overflow-y-auto">
                {topAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 hover:bg-slate-800/40 transition">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        alert.level === 'CRITICAL'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : alert.level === 'HIGH'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {alert.level}
                      </span>
                      <span className="text-[10px] text-slate-500">{alert.time}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-snug">{alert.text}</p>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-slate-800 bg-slate-950/60 text-center">
                <span className="text-[10px] text-slate-500">Real-time Anomaly Stream Active</span>
              </div>
            </div>
          )}
        </div>

        {/* AI Assistant Quick Launcher */}
        <a
          href="/intelligence"
          className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/40 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-300 transition shadow-sm"
        >
          <Sparkles size={14} className="text-cyan-400 animate-pulse" />
          <span className="hidden sm:inline">AI Copilot</span>
        </a>

        {/* User Identity & Clearance Profile */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 pl-2 pr-3 py-1.5 rounded-xl transition"
          >
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-xs text-slate-950 shadow">
              VK
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-200 leading-none">Officer V. Kumar</p>
              <p className="text-[10px] text-cyan-400 mt-0.5 leading-none">MHA Level-4 Clearance</p>
            </div>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-2 text-xs space-y-1">
              <div className="p-2 border-b border-slate-800 bg-slate-950/60 rounded-lg mb-1">
                <p className="font-bold text-white">Officer V. Kumar</p>
                <p className="text-[10px] text-slate-400">Senior Cyber Crime Analyst</p>
                <p className="text-[10px] text-cyan-400 mt-1 font-mono">ID: NCRB-INV-2026-904</p>
              </div>

              <a href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition">
                <Shield size={14} className="text-cyan-400" />
                Security Credentials
              </a>
              <a href="/reports" className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 transition">
                <Terminal size={14} className="text-purple-400" />
                Audit Logs & Activity
              </a>

              <div className="border-t border-slate-800 pt-1 mt-1">
                <a href="/login" className="flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition font-semibold">
                  <Lock size={14} />
                  Lock / Logout Session
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
