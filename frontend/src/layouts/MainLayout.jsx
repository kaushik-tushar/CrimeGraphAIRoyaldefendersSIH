import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  Network, 
  FolderArchive, 
  FileText, 
  AlertTriangle, 
  Radio, 
  LogOut, 
  UserCheck, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Users // Added for Entity Intelligence
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

/**
 * Main Tactical Layout Shell
 * Features a collapsible sidebar, operational threat status header, and active case filter bar.
 */
export default function MainLayout() {
  const navigate = useNavigate();
  const { 
    officer, 
    cases, 
    activeCaseId, 
    setActiveCaseId, 
    getActiveCase, 
    unreadAlertsCount,
    sidebarCollapsed, 
    toggleSidebar,
    liveAlertsStreamActive,
    toggleLiveStream,
    setOfficer
  } = useAppStore();

  const activeCase = getActiveCase();

  const handleLogout = () => {
    setOfficer(null);
    localStorage.removeItem('tactical_auth_token');
    localStorage.removeItem('tactical_auth_user');
    navigate('/login');
  };

  const navItems = [
    { label: 'Operational Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Entity Intelligence', path: '/entities', icon: Users },
    { label: 'Link Network Analysis', path: '/link-analysis', icon: Network },
    { label: 'Case Management', path: '/cases', icon: FolderArchive },
    { label: 'User Management', path: '/usermanagement', icon: FileText },
    { label: 'AI Assistant ', path: '/intelligence', icon: Network },
    { label: 'CDR Analysis', path: '/cdr-analysis', icon: Database },
    { label: 'Vehicle Managemnt', path: '/vehicles', icon: Database },
    { label: 'Digital Evidence Vault', path: '/evidence', icon: FileText },
    { label: 'Reports', path: '/reports', icon: FileText },
    { label: 'Timeline', path: '/timeline', icon: FileText },
    { label: 'Settings', path: '/settings', icon: FileText },
  ];


  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 bg-tactical-grid">
      {/* ------------------------------------------------------------------ */}
      {/* Sidebar Navigation */}
      {/* ------------------------------------------------------------------ */}
      <aside
        className={`relative flex flex-col border-r border-slate-800 bg-slate-900/90 backdrop-blur transition-all duration-300 z-20 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Header Branding */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Shield className="h-5 w-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <h1 className="text-sm font-bold tracking-wider text-slate-100">NCRB INTEL</h1>
                <p className="text-[10px] font-mono tracking-widest text-cyan-400">TAC-SYS V1.0</p>
              </div>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center space-x-3 rounded-md px-3 py-2.5 text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* Officer Session Info Footer */}
        <div className="border-t border-slate-800 p-3">
          {!sidebarCollapsed ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 truncate">
                <UserCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-200 truncate">{officer?.name || 'Officer'}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{officer?.badgeNumber}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="rounded p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                title="Terminate Session"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="flex w-full justify-center rounded p-1.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
              title="Terminate Session"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* ------------------------------------------------------------------ */}
      {/* Main Workspace Area */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Operational Header Bar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur">
          {/* Active Case Selector */}
          <div className="flex items-center space-x-4">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400">Target Case File:</label>
            <select
              value={activeCaseId}
              onChange={(e) => setActiveCaseId(e.target.value)}
              className="rounded-md border border-slate-700 bg-slate-950 px-3 py-1.5 text-xs font-mono text-cyan-300 focus:border-cyan-500 focus:outline-none"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  [{c.firNo}] {c.title}
                </option>
              ))}
            </select>
            {activeCase && (
              <span className={`rounded border px-2 py-0.5 text-[10px] font-mono ${
                activeCase.severity === 'CRITICAL' 
                  ? 'bg-red-950/80 text-red-400 border-red-800' 
                  : 'bg-amber-950/80 text-amber-400 border-amber-800'
              }`}>
                {activeCase.severity}
              </span>
            )}
          </div>

          {/* Real-time Telemetry & Live Feed Toggles */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLiveStream}
              className={`flex items-center space-x-2 rounded border px-3 py-1.5 text-xs font-mono transition-colors ${
                liveAlertsStreamActive
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-700 bg-slate-800 text-slate-400'
              }`}
            >
              <Radio className={`h-3.5 w-3.5 ${liveAlertsStreamActive ? 'animate-pulse text-emerald-400' : ''}`} />
              <span>{liveAlertsStreamActive ? 'LIVE INTEL FEED' : 'STREAM PAUSED'}</span>
            </button>

            {/* Unread Critical Threat Indicator */}
            <div className="flex items-center space-x-1 rounded bg-red-950/60 border border-red-800/80 px-2.5 py-1 text-xs text-red-400">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span className="font-mono font-bold">{unreadAlertsCount}</span>
              <span className="text-[10px]">THREATS</span>
            </div>
          </div>
        </header>

        {/* Page View Container */}
        <main className="flex-1 overflow-y-auto p-6 bg-radial-glow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}