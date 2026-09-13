import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  GitFork,
  FileCheck2,
  Clock,
  AlertTriangle,
  Bot,
  FileSpreadsheet,
  Settings,
  Shield,
  ChevronRight,
  LogOut,
  Radio
} from 'lucide-react';

export default function Sidebar({ collapsed = false, setCollapsed }) {
  const location = useLocation();

  // Navigation Items aligned with CrimeGraph AI spec
  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: 'Case Management',
      path: '/cases',
      icon: Briefcase,
      badge: '142',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    },
    {
      name: 'Entity Intelligence',
      path: '/entities',
      icon: Users,
      badge: null,
    },
    {
      name: 'Network Intelligence',
      path: '/network',
      icon: GitFork,
      badge: 'Hero',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    },
    {
      name: 'Evidence & Vault',
      path: '/evidence',
      icon: FileCheck2,
      badge: 'Blockchain',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      name: 'Timeline & Events',
      path: '/timeline',
      icon: Clock,
      badge: null,
    },
    {
      name: 'Alerts & Anomalies',
      path: '/alerts',
      icon: AlertTriangle,
      badge: '07 Critical',
      badgeColor: 'bg-red-500/10 text-red-400 border-red-500/20',
    },
    {
      name: 'Intelligence & AI',
      path: '/intelligence',
      icon: Bot,
      badge: 'AI Search',
      badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    },
    {
      name: 'Reports & Audit',
      path: '/reports',
      icon: FileSpreadsheet,
      badge: null,
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Upper Section: Brand & Navigation */}
      <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
        
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
              <Shield className="text-white" size={22} />
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
                  <span>MHA • NCRB</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <h2 className="text-sm font-black tracking-tight text-white leading-none mt-0.5">
                  CrimeGraph <span className="text-cyan-400">AI</span>
                </h2>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">Women Safety Division</p>
              </div>
            )}
          </div>
        </div>

        {/* System Operational Badge */}
        {!collapsed && (
          <div className="mx-3 mt-3 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-slate-300">Node Sync: Active</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
              26189
            </span>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 via-cyan-500/10 to-transparent text-cyan-300 border-l-2 border-cyan-400 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
                title={collapsed ? item.name : undefined}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.name}</span>}
                </div>

                {!collapsed && item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Settings & User Identity */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/90">
        
        {/* Settings Link */}
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
              isActive
                ? 'bg-slate-900 text-cyan-300'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`
          }
        >
          <Settings size={18} className="text-slate-400" />
          {!collapsed && <span>System Settings</span>}
        </NavLink>

        {/* Officer Profile Widget */}
        <div className="pt-2 border-t border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="h-8 w-8 rounded-full bg-slate-800 border border-cyan-500/40 flex items-center justify-center font-bold text-xs text-cyan-400 shrink-0">
              INV
            </div>
            {!collapsed && (
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate leading-none">
                  Officer V. Kumar
                </p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  Senior Investigator • Level 4
                </p>
              </div>
            )}
          </div>

          {!collapsed && (
            <button
              title="Logout Session"
              className="p-1.5 rounded-md hover:bg-slate-900 text-slate-400 hover:text-red-400 transition"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}