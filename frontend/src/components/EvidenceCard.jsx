import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Lock,
  Clock,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  ShieldCheck,
  FileText,
  Phone,
  HardDrive,
  Database,
  Hash
} from 'lucide-react';

/**
 * EvidenceCard Props
 * @param {Object} evidence - The digital evidence item object
 * @param {Function} [onVerify] - Optional callback to trigger manual SHA-256 integrity check
 * @param {Function} [onDownload] - Optional callback to handle secure file download
 */
export default function EvidenceCard({ evidence, onVerify, onDownload }) {
  const [copied, setCopied] = useState(false);

  if (!evidence) return null;

  const {
    id = 'EVT-9081',
    title = 'Inter-Suspect CDR Tower Call Dump (184s)',
    type = 'CDR_LOG', // 'CDR_LOG' | 'WIRE_TRANSFER' | 'DISK_FORENSICS' | 'DATABASE_RECORD'
    hash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    timestamp = '12 Jan 2026, 02:14:22 IST',
    sourceDevice = 'Cell Tower Node #402 (Sector 62 Noida)',
    fileSize = '42.8 MB',
    caseId = '26189-042',
    firNo = 'FIR-2026-NCRB-9021',
    verified = true,
    investigator = 'Inspector R. Sharma (Cyber Cell)'
  } = evidence;

  // Icon selector based on evidence type
  const getTypeIcon = () => {
    switch (type) {
      case 'CDR_LOG':
        return <Phone size={16} className="text-amber-400" />;
      case 'WIRE_TRANSFER':
        return <Database size={16} className="text-cyan-400" />;
      case 'DISK_FORENSICS':
        return <HardDrive size={16} className="text-purple-400" />;
      default:
        return <FileText size={16} className="text-slate-400" />;
    }
  };

  // Copy SHA-256 hash to clipboard
  const handleCopyHash = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Truncate hash for compact display
  const truncatedHash = `${hash.slice(0, 10)}...${hash.slice(-10)}`;

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition space-y-4 flex flex-col justify-between group">
      
      <div className="space-y-3">
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
              {getTypeIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-cyan-400">{id}</span>
                <span className="text-slate-600">•</span>
                <span className="text-[10px] font-mono text-slate-400">{fileSize}</span>
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                {title}
              </h3>
            </div>
          </div>

          {/* SHA-256 Chain of Custody Lock Badge */}
          {verified ? (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg text-[10px] font-mono font-bold shrink-0">
              <ShieldCheck size={13} /> SECURED
            </span>
          ) : (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-[10px] font-mono font-bold shrink-0">
              <AlertTriangle size={13} /> UNVERIFIED
            </span>
          )}
        </div>

        {/* Source & Timestamp Info */}
        <div className="space-y-1.5 text-xs text-slate-300 font-sans">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock size={12} className="text-slate-500 shrink-0" />
            <span className="font-mono text-[11px]">{timestamp}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <HardDrive size={12} className="text-cyan-400 shrink-0" />
            <span className="text-[11px] font-medium">{sourceDevice}</span>
          </div>
        </div>

        {/* Cryptographic SHA-256 Fingerprint Block */}
        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span className="flex items-center gap-1">
              <Hash size={11} className="text-cyan-400" /> SHA-256 CHECKSUM
            </span>
            <button
              onClick={handleCopyHash}
              className="text-slate-400 hover:text-cyan-400 transition flex items-center gap-1"
              title="Copy Full Hash"
            >
              {copied ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={11} /> Copied
                </span>
              ) : (
                <>
                  <Copy size={11} /> Copy
                </>
              )}
            </button>
          </div>
          <p className="font-mono text-[11px] font-bold text-slate-200 tracking-wider break-all">
            {truncatedHash}
          </p>
        </div>
      </div>

      {/* Footer & Action Controls */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDownload && onDownload(id)}
            className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition"
          >
            <Download size={12} className="text-cyan-400" /> Download
          </button>

          {onVerify && (
            <button
              onClick={() => onVerify(id)}
              className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1.5 text-[11px] transition"
            >
              Verify Lock
            </button>
          )}
        </div>

        <Link
          to={`/cases/${caseId}`}
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold text-[11px] transition"
        >
          Case File <ExternalLink size={12} />
        </Link>
      </div>

    </div>
  );
}