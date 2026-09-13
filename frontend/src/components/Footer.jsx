import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldCheck,
  Lock,
  Cpu,
  Radio,
  FileCheck2,
  ExternalLink,
  Terminal,
  Activity
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs font-sans mt-auto">
      
      {/* Top Security & Status Banner */}
      <div className="max-w-7xl mx-auto px-6 py-4 border-b border-slate-900/80 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        
        {/* System Authorization Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400 shrink-0">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">RESTRICTED LAW ENFORCEMENT PORTAL</span>
              <span className="px-1.5 py-0.2 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-[9px] font-mono font-bold">
                OFFICIAL USE ONLY
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Authorized personnel access under National Cyber Crime Reporting Portal (NCRP) frameworks.
            </p>
          </div>
        </div>

        {/* Real-time System Connectivity Indicator */}
        <div className="flex items-center justify-start md:justify-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-xl text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-emerald-400 font-semibold">HQ NODE: ONLINE</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono text-slate-400">LATENCY: 14ms</span>
          </div>
        </div>

        {/* SHA-256 Ledger Lock Indicator */}
        <div className="flex items-center justify-start md:justify-end gap-2 text-[11px] font-mono">
          <Lock size={13} className="text-cyan-400" />
          <span className="text-slate-400">EVIDENCE CHAIN:</span>
          <span className="text-slate-200 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            SHA256 VERIFIED
          </span>
        </div>

      </div>

      {/* Main Footer Links & Directory */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Column 1: Platform Overview */}
        <div className="space-y-2 md:col-span-1">
          <div className="flex items-center gap-2 text-white font-black tracking-tight text-sm">
            <Shield size={16} className="text-cyan-400" />
            <span>CRIME INTEL PLATFORM</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Integrated intelligence grid cross-referencing tower dump CDRs, financial wire trails, and suspect network graphs.
          </p>
        </div>

        {/* Column 2: Investigation Modules */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            Core Modules
          </span>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <Link to="/cases" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <FileCheck2 size={12} className="text-slate-600" /> Master FIR Directory
              </Link>
            </li>
            <li>
              <Link to="/entities" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <Terminal size={12} className="text-slate-600" /> Suspect & Target Registry
              </Link>
            </li>
            <li>
              <Link to="/network" className="hover:text-cyan-400 transition flex items-center gap-1.5">
                <Activity size={12} className="text-slate-600" /> Link Graph Visualizer
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Forensic Resources */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            Forensic Utilities
          </span>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <span className="text-slate-400 hover:text-slate-200 cursor-pointer transition flex items-center gap-1.5">
                <Radio size={12} className="text-slate-600" /> CDR Tower Dump Parser
              </span>
            </li>
            <li>
              <span className="text-slate-400 hover:text-slate-200 cursor-pointer transition flex items-center gap-1.5">
                <Cpu size={12} className="text-slate-600" /> Crypto & Bank Wire Tracker
              </span>
            </li>
            <li>
              <span className="text-slate-400 hover:text-slate-200 cursor-pointer transition flex items-center gap-1.5">
                <Lock size={12} className="text-slate-600" /> Hash Chain Verifier
              </span>
            </li>
          </ul>
        </div>

        {/* Column 4: Compliance & Support */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block mb-2">
            Governance & Audit
          </span>
          <p className="text-[11px] text-slate-500 leading-normal">
            All database queries and entity inspection operations are logged under strict chain-of-custody protocols.
          </p>
          <div className="pt-1 text-[10px] font-mono text-slate-600">
            SYSTEM BUILD: v4.12.0-PROD
          </div>
        </div>

      </div>

      {/* Bottom Copyright & Disclaimer Bar */}
      <div className="border-t border-slate-900 bg-slate-950 py-3.5 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500 font-mono">
          <div>
            © {currentYear} Law Enforcement Intelligence Operations Division. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">Security Protocol 65-A</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Audit Logs</span>
            <span>•</span>
            <span className="hover:underline cursor-pointer">Helpdesk Duty Officer</span>
          </div>
        </div>
      </div>

    </footer>
  );
}