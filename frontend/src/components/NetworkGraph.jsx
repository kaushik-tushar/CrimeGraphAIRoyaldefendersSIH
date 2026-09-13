import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  Sliders,
  Layers,
  Search,
  Users,
  Phone,
  Car,
  MapPin,
  Building2,
  CreditCard,
  Briefcase,
  GitFork,
  Activity,
  ChevronRight,
  ShieldAlert,
  ArrowRight,
  Eye,
  RefreshCw,
  Zap
} from 'lucide-react';

export default function NetworkGraph({ selectedCaseId = '26189-042', onSelectEntity }) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [hopDepth, setHopDepth] = useState('2-hop');
  const [timeFilter, setTimeFilter] = useState(100); // 0 to 100 timeline %
  const [highlightSuspicious, setHighlightSuspicious] = useState(true);
  const [shortestPathMode, setShortestPathMode] = useState(false);

  // Mock Graph Data matching NCRB Crime Graph Ontology
  const initialNodes = [
    { id: 'ENT-9021', name: 'Rajesh "Raju" Sharma', type: 'Person', riskScore: 94, centrality: 0.96, connections: 18, x: 280, y: 180, isKey: true },
    { id: 'ENT-4412', name: 'Vikram Choudhury', type: 'Person', riskScore: 89, centrality: 0.88, connections: 12, x: 520, y: 140, isKey: false },
    { id: 'ENT-1108', name: '+91 98765 43210', type: 'Phone', riskScore: 91, centrality: 0.92, connections: 24, x: 380, y: 310, isKey: true },
    { id: 'ENT-3390', name: 'Apex Logistics Pvt Ltd', type: 'Organization', riskScore: 84, centrality: 0.79, connections: 9, x: 620, y: 280, isKey: false },
    { id: 'ENT-7701', name: 'Safehouse - Sector 62', type: 'Location', riskScore: 78, centrality: 0.65, connections: 8, x: 180, y: 340, isKey: false },
    { id: 'ENT-2204', name: 'DL-01-AB-9012 (SUV)', type: 'Vehicle', riskScore: 72, centrality: 0.58, connections: 5, x: 120, y: 190, isKey: false },
    { id: 'ENT-8841', name: 'HDFC Ac #...9041', type: 'Account', riskScore: 88, centrality: 0.83, connections: 11, x: 470, y: 410, isKey: true },
  ];

  const initialEdges = [
    { source: 'ENT-9021', target: 'ENT-1108', label: 'OWNS_SIM', weight: 'High', type: 'Communication' },
    { source: 'ENT-9021', target: 'ENT-2204', label: 'DRIVES', weight: 'Med', type: 'Ownership' },
    { source: 'ENT-9021', target: 'ENT-7701', label: 'VISITED_14X', weight: 'High', type: 'Geographic' },
    { source: 'ENT-1108', target: 'ENT-4412', label: '47_CALLS_2HR', weight: 'Critical', type: 'Communication', anomalous: true },
    { source: 'ENT-4412', target: 'ENT-3390', label: 'DIRECTOR', weight: 'High', type: 'Corporate' },
    { source: 'ENT-1108', target: 'ENT-8841', label: 'UPI_LINKED', weight: 'High', type: 'Financial' },
    { source: 'ENT-8841', target: 'ENT-3390', label: 'TRANSFERRED_₹42L', weight: 'Critical', type: 'Financial', anomalous: true },
    { source: 'ENT-7701', target: 'ENT-2204', label: 'PARKED_AT', weight: 'Med', type: 'Geographic' },
  ];

  const getNodeIcon = (type) => {
    switch (type) {
      case 'Person': return <Users size={16} className="text-red-400" />;
      case 'Phone': return <Phone size={16} className="text-cyan-400" />;
      case 'Vehicle': return <Car size={16} className="text-amber-400" />;
      case 'Location': return <MapPin size={16} className="text-emerald-400" />;
      case 'Organization': return <Building2 size={16} className="text-purple-400" />;
      case 'Account': return <CreditCard size={16} className="text-blue-400" />;
      default: return <GitFork size={16} className="text-slate-400" />;
    }
  };

  const getNodeColor = (type, isSelected, isKey) => {
    if (isSelected) return 'stroke-cyan-400 fill-slate-900 stroke-[3px] shadow-lg shadow-cyan-500/50';
    if (isKey && highlightSuspicious) return 'stroke-red-500 fill-slate-950 stroke-[2.5px]';
    return 'stroke-slate-700 fill-slate-900 stroke-2';
  };

  return (
    <div className="relative w-full h-[680px] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden font-sans select-none flex flex-col">
      
      {/* Top Controls Toolbar */}
      <div className="z-10 p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Entity & Hop Filters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            {['ALL', 'Person', 'Phone', 'Location', 'Account'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  filterType === t
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-800"></div>

          {/* Depth Control */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            {['1-hop', '2-hop', '3-hop'].map((hop) => (
              <button
                key={hop}
                onClick={() => setHopDepth(hop)}
                className={`px-2.5 py-1 rounded-lg font-mono font-semibold transition ${
                  hopDepth === hop
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {hop}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Graph Highlight & Path Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHighlightSuspicious(!highlightSuspicious)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              highlightSuspicious
                ? 'bg-red-500/10 text-red-400 border-red-500/30'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <ShieldAlert size={14} />
            Highlight Anomalies
          </button>

          <button
            onClick={() => setShortestPathMode(!shortestPathMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              shortestPathMode
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Zap size={14} />
            Shortest Path Tracer
          </button>
        </div>

        {/* Right: Zoom & Reset */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setZoomLevel(Math.min(zoomLevel + 0.15, 2))}
            className="p-1.5 hover:bg-slate-900 text-slate-300 rounded-lg"
            title="Zoom In"
          >
            <ZoomIn size={15} />
          </button>
          <span className="text-[10px] font-mono font-bold text-cyan-400 px-1">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(Math.max(zoomLevel - 0.15, 0.6))}
            className="p-1.5 hover:bg-slate-900 text-slate-300 rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut size={15} />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 hover:bg-slate-900 text-slate-300 rounded-lg"
            title="Reset Graph Position"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      {/* Interactive SVG Canvas Area */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center">
        
        {/* Subtle Background Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#38bdf8 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        ></div>

        {/* Graph Render Container */}
        <svg
          className="w-full h-full transition-transform duration-200 cursor-grab active:cursor-grabbing"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="22"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
            </marker>
            <marker
              id="arrowhead-danger"
              markerWidth="10"
              markerHeight="7"
              refX="22"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
            </marker>
          </defs>

          {/* Render Edges */}
          {initialEdges.map((edge, index) => {
            const sourceNode = initialNodes.find((n) => n.id === edge.source);
            const targetNode = initialNodes.find((n) => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;

            const isAnomalous = edge.anomalous && highlightSuspicious;

            return (
              <g key={index} className="group">
                <line
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={isAnomalous ? '#ef4444' : '#334155'}
                  strokeWidth={isAnomalous ? 2.5 : 1.5}
                  strokeDasharray={isAnomalous ? '4 2' : undefined}
                  markerEnd={isAnomalous ? 'url(#arrowhead-danger)' : 'url(#arrowhead)'}
                  className="transition-all"
                />
                
                {/* Edge Label Pill */}
                <rect
                  x={(sourceNode.x + targetNode.x) / 2 - 35}
                  y={(sourceNode.y + targetNode.y) / 2 - 10}
                  width="70"
                  height="16"
                  rx="4"
                  fill="#020617"
                  stroke={isAnomalous ? '#ef4444' : '#1e293b'}
                  strokeWidth="1"
                />
                <text
                  x={(sourceNode.x + targetNode.x) / 2}
                  y={(sourceNode.y + targetNode.y) / 2 + 2}
                  textAnchor="middle"
                  className={`text-[9px] font-mono font-bold ${
                    isAnomalous ? 'fill-red-400' : 'fill-slate-400'
                  }`}
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Render Nodes */}
          {initialNodes.map((node) => {
            if (filterType !== 'ALL' && node.type !== filterType) return null;

            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => {
                  setSelectedNode(node);
                  if (onSelectEntity) onSelectEntity(node);
                }}
                className="cursor-pointer group"
              >
                {/* Outer Pulse for Key/Anomalous Entities */}
                {node.isKey && highlightSuspicious && (
                  <circle
                    r="26"
                    className="fill-red-500/10 stroke-red-500/30 animate-ping"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  r="20"
                  className={getNodeColor(node.type, isSelected, node.isKey)}
                />

                {/* Node Label underneath */}
                <text
                  y="34"
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-200 tracking-tight"
                >
                  {node.name}
                </text>
                <text
                  y="46"
                  textAnchor="middle"
                  className="text-[9px] font-mono fill-cyan-400/80"
                >
                  {node.id} • Risk: {node.riskScore}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Entity Detail Drawer (When Node Selected) */}
        {selectedNode && (
          <div className="absolute right-4 top-4 bottom-16 w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl p-4 shadow-2xl z-20 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    {getNodeIcon(selectedNode.type)}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      {selectedNode.type} Entity
                    </span>
                    <h3 className="text-sm font-bold text-white leading-snug">
                      {selectedNode.name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-500 hover:text-slate-300 text-xs font-mono font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Risk & Centrality Score Dashboard */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400">Risk Score</span>
                  <div className="text-base font-bold text-red-400">{selectedNode.riskScore}/100</div>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
                  <span className="text-[10px] text-slate-400">PageRank Centrality</span>
                  <div className="text-base font-bold text-cyan-400">
                    {Math.round(selectedNode.centrality * 100)}%
                  </div>
                </div>
              </div>

              {/* Entity Connection Stats */}
              <div className="space-y-2 text-xs mb-4">
                <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                  <span className="text-slate-400">Total Graph Connections:</span>
                  <span className="font-bold text-white">{selectedNode.connections} Degree</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                  <span className="text-slate-400">Cluster Membership:</span>
                  <span className="font-bold text-purple-400">Syndicate Alpha-04</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                  <span className="text-slate-400">Cross-Case References:</span>
                  <span className="font-bold text-amber-400">03 Linked Cases</span>
                </div>
              </div>
            </div>

            {/* Actions for Selected Node */}
            <div className="space-y-2 pt-3 border-t border-slate-800">
              <a
                href={`/entities/${selectedNode.id}`}
                className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-2 rounded-lg text-xs transition"
              >
                <Eye size={14} /> Open Deep Profile
              </a>
              <button className="w-full flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold py-2 rounded-lg text-xs border border-slate-800 transition">
                <RefreshCw size={13} /> Expand 1-Hop Neighborhood
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Timeline Control Slider */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-4 text-xs">
        <span className="text-slate-400 font-medium shrink-0">Temporal Sequence:</span>
        <input
          type="range"
          min="0"
          max="100"
          value={timeFilter}
          onChange={(e) => setTimeFilter(Number(e.target.value))}
          className="w-full accent-cyan-400 bg-slate-950 h-1.5 rounded-lg cursor-pointer"
        />
        <span className="text-cyan-400 font-mono font-bold shrink-0">
          Jan 2026 - Present
        </span>
      </div>

    </div>
  );
}