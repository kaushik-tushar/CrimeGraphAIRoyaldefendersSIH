import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Phone,
  Building2,
  CreditCard,
  ShieldAlert,
  ChevronRight,
  Network,
  ExternalLink,
  MapPin,
  Lock,
  Radio,
  FileCheck2
} from 'lucide-react';

/**
 * EntityCard Props
 * @param {Object} entity - The intelligence entity data object
 * @param {Function} [onSelect] - Optional click handler when selecting entity in a list
 */
export default function EntityCard({ entity, onSelect }) {
  if (!entity) return null;

  const {
    id = 'ENT-801',
    name = 'Vikram "Raja" Malhotra',
    type = 'SUSPECT', // 'SUSPECT' | 'PHONE' | 'ENTITY' | 'FINANCIAL'
    role = 'Primary Kingpin / Syndicate Operative',
    firNo = 'FIR-2026-NCRB-9021',
    caseId = '26189-042',
    riskScore = 92,
    connectionsCount = 12,
    status = 'UNDER_SURVEILLANCE', // 'UNDER_SURVEILLANCE' | 'FROZEN' | 'DETAINED' | 'INVESTIGATING'
    primaryIdentifier = 'AADHAAR: XXXX-XXXX-9012',
    lastSeen = 'Sector 62, Noida'
  } = entity;

  // Render type icon
  const getTypeIcon = () => {
    switch (type) {
      case 'SUSPECT':
        return <User size={16} className="text-red-400" />;
      case 'PHONE':
        return <Phone size={16} className="text-amber-400" />;
      case 'ENTITY':
        return <Building2 size={16} className="text-purple-400" />;
      case 'FINANCIAL':
        return <CreditCard size={16} className="text-cyan-400" />;
      default:
        return <User size={16} className="text-slate-400" />;
    }
  };

  // Status badge styling
  const getStatusBadge = () => {
    switch (status) {
      case 'UNDER_SURVEILLANCE':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 rounded text-[10px] font-mono font-bold">
            <Radio size={10} className="animate-pulse" /> SURVEILLANCE
          </span>
        );
      case 'FROZEN':
        return (
          <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded text-[10px] font-mono font-bold">
            <Lock size={10} /> FROZEN
          </span>
        );
      case 'DETAINED':
        return (
          <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded text-[10px] font-mono font-bold">
            DETAINED
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded text-[10px] font-mono font-bold">
            INVESTIGATING
          </span>
        );
    }
  };

  return (
    <div
      onClick={() => onSelect && onSelect(entity)}
      className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition space-y-4 flex flex-col justify-between group"
    >
      <div className="space-y-3">
        
        {/* Top Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl shrink-0">
              {getTypeIcon()}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 block">
                {id}
              </span>
              <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                {name}
              </h3>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        {/* Role & Primary ID */}
        <p className="text-xs text-slate-300 font-medium leading-relaxed">
          {role}
        </p>

        <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px]">
          <span className="text-[10px] text-slate-500 block">Primary Identification</span>
          <span className="text-slate-200 font-bold mt-0.5 block">{primaryIdentifier}</span>
        </div>

        {/* Threat Score & Network Graph Count */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <span className="text-[10px] text-slate-500 block">Threat Score</span>
            <span className="text-sm font-mono font-black text-red-400">{riskScore} / 100</span>
          </div>
          <div className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl">
            <span className="text-[10px] text-slate-500 block">Graph Links</span>
            <span className="text-sm font-mono font-black text-cyan-400">{connectionsCount} Nodes</span>
          </div>
        </div>

      </div>

      {/* Footer Controls */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <Link
          to={`/entities/${id}`}
          className="flex items-center gap-1 text-slate-400 hover:text-white font-semibold text-[11px] transition"
        >
          View Dossier <ExternalLink size={12} />
        </Link>

        <Link
          to={`/network?node=${id}`}
          className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold text-[11px] transition"
        >
          Inspect Graph <ChevronRight size={14} />
        </Link>
      </div>

    </div>
  );
}