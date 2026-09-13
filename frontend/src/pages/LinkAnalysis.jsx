import React, { useEffect, useState, useRef } from 'react';
import { 
  Network, 
  Search, 
  RefreshCw, 
  Phone, 
  User, 
  Radio, 
  Layers,
  CheckCircle2,
  Share2,
  GitFork,
  PlusCircle,
  Car,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { useAppStore } from '../store/appStore';

/**
 * CrimeGraph AI - Optimized Link Analysis Matrix with Draggable Nodes
 */
export default function LinkAnalysis() {
  const { activeCaseId } = useAppStore();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');

  // Modal States
  const [addEntityModalOpen, setAddEntityModalOpen] = useState(false);
  const [addLinkModalOpen, setAddLinkModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [shortestPathModalOpen, setShortestPathModalOpen] = useState(false);

  // New Entity Form States
  const [newNodeType, setNewNodeType] = useState('Suspect');
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeDetail, setNewNodeDetail] = useState('');
  const [newNodeLocation, setNewNodeLocation] = useState('');

  // New Link Form States
  const [linkSourceId, setLinkSourceId] = useState('');
  const [linkTargetId, setLinkTargetId] = useState('');
  const [linkRelation, setLinkRelation] = useState('Communicates With');

  // Canvas Zoom & Pan State
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [canvasDragStart, setCanvasDragStart] = useState({ x: 0, y: 0 });

  // Individual Node Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [nodeDragOffset, setNodeDragOffset] = useState({ x: 0, y: 0 });

  // Toast State
  const [notificationToast, setNotificationToast] = useState('');
  const containerRef = useRef(null);

  const triggerToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(''), 3000);
  };

  const loadGraph = async () => {
    setLoading(true);
    try {
      const initialNodes = [
        { id: 'ENT-803', label: 'Ravi Kumar', type: 'Suspect', riskScore: 94, x: 300, y: 250, details: { role: 'Mastermind', age: '34 years', location: 'Connaught Place' } },
        { id: 'MKT-101', label: 'Guntur Market', type: 'Location', riskScore: 75, x: 150, y: 120, details: { category: 'Meeting Point' } },
        { id: 'SIM-402', label: '+91-98***-1234', type: 'Phone', riskScore: 88, x: 550, y: 140, details: { provider: 'Airtel', status: 'Active' } },
        { id: 'VEH-202', label: 'AP-16-CD-5678', type: 'Vehicle', riskScore: 82, x: 400, y: 110, details: { model: 'White SUV' } },
        { id: 'JCT-303', label: 'Vijayawada Junction', type: 'Location', riskScore: 65, x: 600, y: 280, details: { zone: 'Transit Hub' } },
        { id: 'CRM-102', label: 'Phone Scam', type: 'Crime', riskScore: 90, x: 720, y: 180, details: { type: 'Financial Fraud', amount: '₹1.5 Crores' } },
        { id: 'CRM-103', label: 'Bank Fraud', type: 'Crime', riskScore: 92, x: 680, y: 420, details: { type: 'Banking Fraud', section: 'IPC 420' } },
        { id: 'MOH-909', label: 'Mohan Reddy', type: 'Suspect', riskScore: 91, x: 300, y: 500, details: { role: 'Kingpin', status: 'Under Surveillance' } },
        { id: 'SIM-999', label: '+91-76***-5678', type: 'Phone', riskScore: 85, x: 480, y: 580, details: { provider: 'Jio' } }
      ];
      setGraphData({
        nodes: initialNodes,
        links: [
          { source: 'ENT-803', target: 'MKT-101', relation: 'Visited' },
          { source: 'ENT-803', target: 'SIM-402', relation: 'Uses Phone' },
          { source: 'ENT-803', target: 'VEH-202', relation: 'Drives' },
          { source: 'ENT-803', target: 'JCT-303', relation: 'Transit' },
          { source: 'ENT-803', target: 'MOH-909', relation: 'Associate' },
          { source: 'MOH-909', target: 'SIM-999', relation: 'Uses Phone' }
        ]
      });
      if (initialNodes.length > 0) {
        setLinkSourceId(initialNodes[0].id);
        setLinkTargetId(initialNodes[1]?.id || initialNodes[0].id);
      }
    } catch (err) {
      console.error('Failed to load graph:', err);
    } finally {
      setLoading(false);
      triggerToast('Graph synchronized successfully.');
    }
  };

  useEffect(() => {
    loadGraph();
  }, [activeCaseId]);

  const summaryCounts = {
    suspects: graphData.nodes.filter(n => n.type === 'Suspect').length,
    crimes: graphData.nodes.filter(n => n.type === 'Crime').length,
    locations: graphData.nodes.filter(n => n.type === 'Location').length,
    vehicles: graphData.nodes.filter(n => n.type === 'Vehicle').length,
  };

  const filteredNodes = graphData.nodes.filter((n) => {
    const matchesSearch = n.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypeFilter === 'All' || n.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const handleAddNodeSubmit = (e) => {
    e.preventDefault();
    if (!newNodeName.trim()) {
      triggerToast('Please provide an entity name.');
      return;
    }
    const newNode = {
      id: `ENT-${Math.floor(1000 + Math.random() * 9000)}`,
      label: newNodeName,
      type: newNodeType,
      riskScore: Math.floor(70 + Math.random() * 25),
      x: 350 + Math.random() * 150,
      y: 300 + Math.random() * 150,
      details: { role: newNodeDetail || 'Manual Entry', location: newNodeLocation || 'Unknown' }
    };
    setGraphData(prev => ({ ...prev, nodes: [...prev.nodes, newNode] }));
    setNewNodeName('');
    setNewNodeDetail('');
    setNewNodeLocation('');
    setAddEntityModalOpen(false);
    triggerToast(`Successfully added new ${newNodeType}!`);
  };

  const handleAddLinkSubmit = (e) => {
    e.preventDefault();
    if (!linkSourceId || !linkTargetId) {
      triggerToast('Select both source and target entities.');
      return;
    }
    if (linkSourceId === linkTargetId) {
      triggerToast('Source and Target cannot be the same.');
      return;
    }
    const newLink = { source: linkSourceId, target: linkTargetId, relation: linkRelation };
    setGraphData(prev => ({ ...prev, links: [...prev.links, newLink] }));
    setAddLinkModalOpen(false);
    triggerToast(`Link established via "${linkRelation}"!`);
  };

  const getNodeIcon = (type) => {
    switch (type) {
      case 'Phone': return <Phone className="h-4 w-4 text-amber-400" />;
      case 'Suspect': return <User className="h-4 w-4 text-red-400" />;
      case 'Crime': return <ShieldAlert className="h-4 w-4 text-purple-400" />;
      case 'Location': return <Radio className="h-4 w-4 text-emerald-400" />;
      case 'Vehicle': return <Car className="h-4 w-4 text-cyan-400" />;
      default: return <Network className="h-4 w-4 text-blue-400" />;
    }
  };

  // --- MOUSE HANDLERS FOR CANVAS & NODES ---
  const handleMouseDownCanvas = (e) => {
    if (draggingNodeId) return;
    setIsDraggingCanvas(true);
    setCanvasDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  };

  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation(); // Prevent canvas panning when dragging a node
    setDraggingNodeId(node.id);
    
    // Calculate offset relative to node current position taking zoom into account
    setNodeDragOffset({
      x: (e.clientX / zoomLevel) - node.x,
      y: (e.clientY / zoomLevel) - node.y
    });
    
    setSelectedNode(node);
  };

  const handleMouseMove = (e) => {
    // Handle Node Dragging
    if (draggingNodeId) {
      const newX = (e.clientX / zoomLevel) - nodeDragOffset.x;
      const newY = (e.clientY / zoomLevel) - nodeDragOffset.y;

      setGraphData(prev => ({
        ...prev,
        nodes: prev.nodes.map(n => n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n)
      }));
      return;
    }

    // Handle Canvas Panning
    if (!isDraggingCanvas) return;
    setPanPosition({ x: e.clientX - canvasDragStart.x, y: e.clientY - canvasDragStart.y });
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
    setDraggingNodeId(null);
  };

  const renderSvgLinks = () => {
    return graphData.links.map((link, idx) => {
      const sourceNode = graphData.nodes.find((n) => n.id === link.source);
      const targetNode = graphData.nodes.find((n) => n.id === link.target);
      if (!sourceNode || !targetNode) return null;

      const x1 = (sourceNode.x || 100) + 90;
      const y1 = (sourceNode.y || 100) + 35;
      const x2 = (targetNode.x || 100) + 90;
      const y2 = (targetNode.y || 100) + 35;

      const dx = Math.abs(x2 - x1) * 0.5;
      const pathData = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

      return (
        <g key={idx}>
          <path
            d={pathData}
            fill="none"
            stroke="#00f0ff"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            className="transition-colors duration-200 hover:stroke-cyan-300 hover:stroke-width-2 cursor-pointer"
            onClick={() => triggerToast(`Link: ${sourceNode.label} ➔ ${targetNode.label} [${link.relation}]`)}
          />
        </g>
      );
    });
  };

  return (
    <div className="flex h-full flex-col space-y-3 relative select-none">
      
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed top-5 right-5 z-50 bg-cyan-400 text-slate-950 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <CheckCircle2 size={16} /> {notificationToast}
        </div>
      )}

      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h2 className="text-sm font-bold text-slate-100 font-mono tracking-wide">
              CrimeGraph AI <span className="text-slate-500 font-normal">/ Investigator Matrix</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-cyan-400">
              Nodes: {graphData.nodes.length}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-cyan-400">
              Links: {graphData.links.length}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap">
          <button
            onClick={() => setAddEntityModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-md border border-cyan-500/50 bg-cyan-500/10 px-3 py-1.5 text-xs text-cyan-400 hover:bg-cyan-500/20 cursor-pointer font-bold"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Add Entity</span>
          </button>
          <button
            onClick={() => setAddLinkModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 hover:border-cyan-500 cursor-pointer font-bold"
          >
            <GitFork className="h-3.5 w-3.5 text-cyan-400" />
            <span>Add Link</span>
          </button>
          <button
            onClick={() => setShortestPathModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-md border border-amber-500/40 bg-slate-900 px-3 py-1.5 text-xs text-amber-400 hover:border-amber-500 cursor-pointer"
          >
            <GitFork className="h-3.5 w-3.5" />
            <span>Path Finder</span>
          </button>
          <button
            onClick={() => setExportModalOpen(true)}
            className="flex items-center space-x-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-cyan-400 hover:border-cyan-500 cursor-pointer"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>
          <button
            onClick={loadGraph}
            className="flex items-center space-x-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-red-400 hover:border-red-500 cursor-pointer"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800 text-xs">
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase flex items-center gap-1 pl-1">
            <SlidersHorizontal size={12} /> Filter:
          </span>
          {['All', 'Suspect', 'Crime', 'Location', 'Phone', 'Vehicle'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedTypeFilter(type)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition cursor-pointer whitespace-nowrap ${
                selectedTypeFilter === type
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search entity name, ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-800 bg-slate-950 pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 overflow-hidden" style={{ minHeight: '560px' }}>
        
        {/* Center Canvas */}
        <div 
          ref={containerRef}
          onMouseDown={handleMouseDownCanvas}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`${selectedNode ? 'lg:col-span-9' : 'lg:col-span-12'} relative tactical-card rounded-lg overflow-hidden flex flex-col p-4 border border-slate-800 bg-slate-950 cursor-grab active:cursor-grabbing transition-all duration-300`}
          style={{ minHeight: '540px' }}
        >
          <div className="absolute inset-0 bg-tactical-grid opacity-30 pointer-events-none" />
          
          {/* TOP FLOATING SUMMARY CARDS */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 grid grid-cols-4 gap-2 z-20 pointer-events-auto">
            <div className="bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-center shadow-lg">
              <span className="text-xs font-bold text-red-400 block">{summaryCounts.suspects}</span>
              <span className="text-[9px] font-mono text-slate-400 uppercase">Suspects</span>
            </div>
            <div className="bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-center shadow-lg">
              <span className="text-xs font-bold text-purple-400 block">{summaryCounts.crimes}</span>
              <span className="text-[9px] font-mono text-slate-400 uppercase">Crimes</span>
            </div>
            <div className="bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-center shadow-lg">
              <span className="text-xs font-bold text-emerald-400 block">{summaryCounts.locations}</span>
              <span className="text-[9px] font-mono text-slate-400 uppercase">Locations</span>
            </div>
            <div className="bg-slate-900/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded-lg text-center shadow-lg">
              <span className="text-xs font-bold text-cyan-400 block">{summaryCounts.vehicles}</span>
              <span className="text-[9px] font-mono text-slate-400 uppercase">Vehicles</span>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-3 z-10">
              <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin" />
              <p className="text-xs font-mono text-cyan-400 tracking-wider">COMPUTING LINK TOPOLOGY...</p>
            </div>
          ) : (
            <div 
              className="relative w-full h-full transition-transform duration-75"
              style={{
                transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                transformOrigin: 'center center',
                minHeight: '1400px',
                minWidth: '1400px'
              }}
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-auto z-0" style={{ minWidth: '1400px', minHeight: '1400px' }}>
                {renderSvgLinks()}
              </svg>

              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const posX = node.x || 150;
                const posY = node.y || 150;

                return (
                  <div
                    key={node.id}
                    onMouseDown={(e) => handleNodeMouseDown(e, node)}
                    style={{ left: `${posX}px`, top: `${posY}px`, width: '180px' }}
                    className={`node-card absolute cursor-move rounded-xl p-2.5 backdrop-blur transition-shadow duration-200 border z-10 ${
                      isSelected
                        ? 'border-cyan-400 bg-slate-900/95 shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-105'
                        : 'border-slate-800 bg-slate-900/90 hover:border-slate-600 shadow-xl'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <div className="p-1 rounded bg-slate-800 border border-slate-700">
                          {getNodeIcon(node.type)}
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 truncate max-w-[90px]">{node.id}</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-red-500/10 text-red-400 border border-red-500/30">
                        {node.riskScore}%
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 truncate mb-1">{node.label}</h4>
                    
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-800 pt-1">
                      <span className="uppercase text-cyan-400">{node.type}</span>
                      <span className="text-slate-500">Active</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Zoom Controls */}
          <div className="absolute bottom-3 right-3 flex flex-col space-y-1 bg-slate-900/90 border border-slate-800 rounded-lg p-1 z-20">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.8))}
              className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.5))}
              className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
            <button 
              onClick={() => { setZoomLevel(1); setPanPosition({ x: 0, y: 0 }); }}
              className="p-1.5 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 rounded cursor-pointer"
              title="Reset View"
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-slate-950/95 border border-slate-800 rounded-lg p-2.5 text-[10px] font-mono text-slate-300 z-20 shadow-xl pointer-events-none">
            <span className="font-bold text-cyan-400 block mb-1 uppercase text-[9px]">Node Legend</span>
            <div className="space-y-1">
              <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-red-500"></span><span>Suspect</span></div>
              <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span><span>Crime</span></div>
              <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span>Location</span></div>
              <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span><span>Phone</span></div>
              <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-cyan-400"></span><span>Vehicle</span></div>
            </div>
          </div>
        </div>

        {/* Right Panel: Entity Inspector */}
        {selectedNode && (
          <div className="lg:col-span-3 tactical-card rounded-lg p-4 border border-slate-800 bg-slate-900 flex flex-col justify-between overflow-y-auto animate-fadeIn">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  {selectedNode.type}
                </span>
                <button 
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                  title="Close Inspector"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1">{selectedNode.label}</h3>
                  <span className="text-[10px] font-mono text-slate-400">ID: {selectedNode.id}</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 font-mono">
                  <div className="flex justify-between">
                    <span className="text-slate-400">RISK SCORE:</span>
                    <span className="text-red-400 font-bold">{selectedNode.riskScore}%</span>
                  </div>
                  {selectedNode.details && Object.entries(selectedNode.details).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-slate-400 uppercase">{key}:</span>
                      <span className="text-slate-200">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={() => {
                  setGraphData(prev => ({
                    ...prev,
                    nodes: prev.nodes.filter(n => n.id !== selectedNode.id),
                    links: prev.links.filter(l => l.source !== selectedNode.id && l.target !== selectedNode.id)
                  }));
                  setSelectedNode(null);
                  triggerToast('Entity removed from graph.');
                }}
                className="flex-1 rounded-xl bg-red-500/10 border border-red-500/40 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20 transition cursor-pointer"
              >
                Remove
              </button>
              <button
                onClick={() => setSelectedNode(null)}
                className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- ADD ENTITY MODAL --- */}
      {addEntityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PlusCircle size={16} className="text-cyan-400" /> Add New Entity to Canvas
              </h3>
              <button onClick={() => setAddEntityModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleAddNodeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Node Type</label>
                <select
                  value={newNodeType}
                  onChange={(e) => setNewNodeType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-cyan-400 font-mono focus:outline-none"
                >
                  <option value="Suspect">Suspect</option>
                  <option value="Crime">Crime</option>
                  <option value="Location">Location</option>
                  <option value="Phone">Phone / Device</option>
                  <option value="Vehicle">Vehicle</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Name / Label</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Role / Detail</label>
                <input
                  type="text"
                  placeholder="e.g. Accused / Accomplice"
                  value={newNodeDetail}
                  onChange={(e) => setNewNodeDetail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Guntur Market"
                  value={newNodeLocation}
                  onChange={(e) => setNewNodeLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAddEntityModalOpen(false)} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition cursor-pointer">Inject Node</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD LINK MODAL --- */}
      {addLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GitFork size={16} className="text-cyan-400" /> Establish Inter-Entity Link
              </h3>
              <button onClick={() => setAddLinkModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleAddLinkSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Source Entity (From)</label>
                <select
                  value={linkSourceId}
                  onChange={(e) => setLinkSourceId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-cyan-400 font-mono focus:outline-none"
                >
                  {graphData.nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.label} ({n.type}) - {n.id}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Target Entity (To)</label>
                <select
                  value={linkTargetId}
                  onChange={(e) => setLinkTargetId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-cyan-400 font-mono focus:outline-none"
                >
                  {graphData.nodes.map(n => (
                    <option key={n.id} value={n.id}>{n.label} ({n.type}) - {n.id}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Relationship Type</label>
                <select
                  value={linkRelation}
                  onChange={(e) => setLinkRelation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-amber-400 font-mono focus:outline-none"
                >
                  <option value="Communicates With">Communicates With</option>
                  <option value="Associate">Associate / Accomplice</option>
                  <option value="Visited">Visited Location</option>
                  <option value="Drives">Drives Vehicle</option>
                  <option value="Financial Transfer">Financial Transfer</option>
                  <option value="Family Relation">Family Relation</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setAddLinkModalOpen(false)} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl transition cursor-pointer">Connect Link</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EXPORT MODAL --- */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 size={16} className="text-cyan-400" /> Export CrimeGraph AI Topology
              </h3>
              <button onClick={() => setExportModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <p>Exporting active network topology and nodes for Case #{activeCaseId}.</p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-400">
                Format: Vector JSON Matrix + High-Res PNG Snapshot
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setExportModalOpen(false)} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer">Cancel</button>
              <button 
                onClick={() => { setExportModalOpen(false); triggerToast('Graph successfully exported!'); }}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Confirm Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- PATH FINDER MODAL --- */}
      {shortestPathModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GitFork size={16} className="text-amber-400" /> Neural Shortest Path Finder
              </h3>
              <button onClick={() => setShortestPathModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <p>Find connection degrees between two entities across the network matrix.</p>
              <div className="space-y-1">
                <label className="text-slate-400 text-[11px]">Source Entity:</label>
                <select id="pathSrc" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200">
                  {graphData.nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 text-[11px]">Target Entity:</label>
                <select id="pathTgt" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200">
                  {graphData.nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShortestPathModalOpen(false)} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer">Cancel</button>
              <button 
                onClick={() => { setShortestPathModalOpen(false); triggerToast('Shortest path computed successfully!'); }}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Compute Path
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}