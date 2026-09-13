import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ShieldAlert,
  Phone,
  CreditCard,
  Radio,
  FileCheck2,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Share2,
  MapPin,
  Lock
} from 'lucide-react';

/**
 * AlertCard Props
 * @param {Object} alert - The threat/anomaly alert object
 * @param {Function} onAcknowledge - Callback when an officer marks the alert as reviewed
 * @param {Function} onDismiss - Callback to dismiss or archive the alert
 */
export default function AlertCard({ alert, onAcknowledge, onDismiss }) {
  if (!alert) return null;

  const {
    id = 'ALT-2026-001',
    type = 'CDR_SPIKE', // 'CDR_SPIKE' | 'FINANCIAL_WIRE' | 'TOWER_DUMP' | 'UNAUTHORIZED_ACCESS'
    severity = 'HIGH', // 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
    title = 'Suspicious CDR Call Pattern Detected',
    description = 'Burner SIM (+91 98210-XXXXX) initiated 14 consecutive calls to blacklisted kingpin node during midnight hours.',
    timestamp = '12 Jan 2026, 02:14:22 IST',
    location = 'Sector 62 Tower Dump Node, Noida',
    firNo = 'FIR-2026-NCRB-9021',
    caseId = '26189-042',
    acknowledged = false
  } = alert;

  // Icon mapping based on alert category
  const getAlertIcon = () => {
    switch (type) {
      case 'CDR_SPIKE':
        return <Phone size={18} className="text-amber-400" />;
      case 'FINANCIAL_WIRE':
        return <CreditCard size={18} className="text-cyan-400" />;
      case 'TOWER_DUMP':
        return <Radio size={18} className="text-purple-400" />;
      case 'UNAUTHORIZED_ACCESS':
        return <Lock size={18} className="text-red-400" />;
      default:
        return <AlertTriangle size={18} className="text-amber-400" />;
    }
  };

  // Severity indicator styling
  const getSeverityBadge = () => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-[10px] font-mono font-bold animate-pulse">
            <ShieldAlert size={12} /> CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-[10px] font-mono font-bold">
            <AlertTriangle size={12} /> HIGH THREAT
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg text-[10px] font-mono font-bold">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-500/10 border border-slate-500/30 text-slate-400 rounded-lg text-[10px] font-mono font-bold">
            INFORMATIONAL
          </span>
        );
    }
  };

  // Left border accent color
  const getBorderColor = () => {
    switch (severity) {
      case 'CRITICAL':
        return 'border-l-red-500';
      case 'HIGH':
        return 'border-l-amber-500';
      case 'MEDIUM':
        return 'border-l-cyan-500';
      default:
        return 'border-l-slate-600';
    }
  };

  return (
    <div
      className={`bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl border-l-4 ${getBorderColor()} transition space-y-4 relative group`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
            {getAlertIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-cyan-400">{id}</span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                <Clock size={11} className="text-slate-500" /> {timestamp}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white tracking-tight leading-snug mt-0.5">
              {title}
            </h3>
          </div>
        </div>

        {getSeverityBadge()}
      </div>

      {/* Main Alert Body */}
      <div className="space-y-2">
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {description}
        </p>

        {/* Location & Case Meta */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
          {location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} className="text-slate-500" /> {location}
            </span>
          )}
          {firNo && (
            <span className="flex items-center gap-1 font-mono text-slate-300">
              <FileCheck2 size={12} className="text-cyan-400" /> {firNo}
            </span>
          )}
        </div>
      </div>

      {/* Footer Controls & Link Action */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        {/* Acknowledge State */}
        {acknowledged ? (
          <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold">
            <CheckCircle2 size={14} /> Reviewed by Duty Officer
          </span>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onAcknowledge && onAcknowledge(id)}
              className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition"
            >
              <CheckCircle2 size={13} className="text-emerald-400" /> Mark Reviewed
            </button>
            <button
              onClick={() => onDismiss && onDismiss(id)}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-300 px-2 py-1.5 rounded-lg text-[11px] transition"
            >
              <XCircle size={13} /> Dismiss
            </button>
          </div>
        )}

        {/* Deep Dive Link */}
        <Link
          to={`/cases/${caseId}`}
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold text-[11px] transition"
        >
          Inspect Case File <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}