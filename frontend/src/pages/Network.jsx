import React, { useState, useRef } from 'react';

export default function Network() {
  // --- Navigation & Tab States ---
  const [activeTopTab, setActiveTopTab] = useState('Incidents');

  // --- Canvas Interaction States (Pan & Zoom) ---
  const [zoomLevel, setZoomLevel] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // --- Dataset States with explicit canvas coordinates (x, y) ---
  const [nodes, setNodes] = useState([
    { id: 'NODE-1', name: 'Ravi Kumar', type: 'Suspect', role: 'Primary Suspect', age: '34 years', location: 'Vijayawada', status: 'UNDER INVESTIGATION', cases: 'Case #2024-001, Case #2024-045', threat: 98, x: 280, y: 160 },
    { id: 'NODE-2', name: 'Mohan Reddy', type: 'Suspect', role: 'Associate', age: '29 years', location: 'Guntur', status: 'ACTIVE', cases: 'Case #2024-012', threat: 85, x: 160, y: 340 },
    { id: 'NODE-3', name: 'Priya Sharma', type: 'Suspect', role: 'Field Operative', age: '27 years', location: 'Vijayawada', status: 'MONITORED', threat: 75, x: 440, y: 380 },
    { id: 'NODE-4', name: 'Suresh Babu', type: 'Suspect', role: 'Logistics Handler', age: '41 years', location: 'Tirupati', status: 'WATCHLIST', threat: 82, x: 380, y: 520 },
    { id: 'NODE-5', name: 'Phone Scam', type: 'Crime', role: 'Financial Fraud', status: 'OPEN', threat: 90, x: 500, y: 140 },
    { id: 'NODE-6', name: 'Bank Fraud', type: 'Crime', role: 'Syndicate Extortion', status: 'OPEN', threat: 95, x: 520, y: 250 },
    { id: 'NODE-7', name: 'Gunfor Market', type: 'Location', role: 'Meeting Point', status: 'VERIFIED', threat: 60, x: 380, y: 70 },
    { id: 'NODE-8', name: 'Vijayawada Junction', type: 'Location', role: 'Transit Hub', status: 'VERIFIED', threat: 50, x: 460, y: 300 },
    { id: 'NODE-9', name: 'Trupati Highway', type: 'Location', role: 'Drop Zone', status: 'MONITORED', threat: 65, x: 600, y: 480 },
    { id: 'NODE-10', name: '+91-08***-1234', type: 'Phone', role: 'Burner Device 1', status: 'INTERCEPTED', threat: 88, x: 420, y: 180 },
    { id: 'NODE-11', name: '+91-76***-5678', type: 'Phone', role: 'Burner Device 2', status: 'INTERCEPTED', threat: 80, x: 260, y: 440 },
    { id: 'NODE-12', name: 'AP-08-CD-5678', type: 'Vehicle', role: 'Escape SUV', status: 'TRACKED', threat: 82, x: 390, y: 230 },
    { id: 'NODE-13', name: 'AP-39-AB-1234', type: 'Vehicle', role: 'Delivery Truck', status: 'TRACKED', threat: 70, x: 540, y: 600 }
  ]);

  const [links, setLinks] = useState([
    { id: 'LINK-1', source: 'NODE-1', target: 'NODE-5', label: 'Phone Scam', connectionType: 'Accused' },
    { id: 'LINK-2', source: 'NODE-1', target: 'NODE-6', label: 'Bank Fraud', connectionType: 'Mastermind' },
    { id: 'LINK-3', source: 'NODE-1', target: 'NODE-2', label: 'Mohan Reddy', connectionType: 'Associate' },
    { id: 'LINK-4', source: 'NODE-1', target: 'NODE-10', label: '+91-08***-1234', connectionType: 'Owner' },
    { id: 'LINK-5', source: 'NODE-1', target: 'NODE-12', label: 'AP-08-CD-5678', connectionType: 'Driver' },
    { id: 'LINK-6', source: 'NODE-1', target: 'NODE-7', label: 'Gunfor Market', connectionType: 'Spotted At' },
    { id: 'LINK-7', source: 'NODE-1', target: 'NODE-8', label: 'Vijayawada Junction', connectionType: 'Transit' },
    { id: 'LINK-8', source: 'NODE-2', target: 'NODE-11', label: '+91-76***-5678', connectionType: 'Owner' },
    { id: 'LINK-9', source: 'NODE-4', target: 'NODE-9', label: 'Trupati Highway', connectionType: 'Drop Zone' },
    { id: 'LINK-10', source: 'NODE-4', target: 'NODE-13', label: 'AP-39-AB-1234', connectionType: 'Operator' }
  ]);

  const [selectedNode, setSelectedNode] = useState(nodes[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [exportNotification, setExportNotification] = useState(false);

  // --- Modal States ---
  const [isNodeModalOpen, setIsNodeModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // Form states for New Node
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeType, setNewNodeType] = useState('Suspect');
  const [newNodeRole, setNewNodeRole] = useState('Operative');
  const [newNodeThreat, setNewNodeThreat] = useState(80);
  const [newNodeLocation, setNewNodeLocation] = useState('Indore');

  // Form states for New Link
  const [linkSource, setLinkSource] = useState(nodes[0]?.id || '');
  const [linkTarget, setLinkTarget] = useState(nodes[1]?.id || '');
  const [linkConnectionType, setLinkConnectionType] = useState('Associated');

  // --- Canvas Mouse Handlers for Drag & Pan ---
  const handleMouseDown = (e) => {
    // Only drag canvas if clicking directly on the background container, not on nodes
    if (e.target.dataset && e.target.dataset.canvas === 'true') {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDraggingCanvas) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
  };

  // Handlers
  const handleExport = () => {
    setExportNotification(true);
    setTimeout(() => setExportNotification(false), 3000);
  };

  const handleReset = () => {
    setZoomLevel(100);
    setPan({ x: 0, y: 0 });
    setSearchTerm('');
    setSelectedNode(nodes[0]);
  };

  const handleRemoveNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setLinks(links.filter(l => l.source !== nodeId && l.target !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(nodes[0] || null);
    }
  };

  const handleCreateNode = (e) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;
    const genId = `NODE-${nodes.length + 1}`;
    const newNode = {
      id: genId,
      name: newNodeName,
      type: newNodeType,
      role: newNodeRole,
      age: '30 years',
      location: newNodeLocation,
      status: 'ACTIVE',
      threat: Number(newNodeThreat),
      cases: 'Case #2026-999',
      x: Math.floor(200 + Math.random() * 250),
      y: Math.floor(150 + Math.random() * 300)
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode);
    setNewNodeName('');
    setIsNodeModalOpen(false);
  };

  const handleCreateLink = (e) => {
    e.preventDefault();
    if (linkSource === linkTarget) {
      alert('Source and target nodes cannot be identical.');
      return;
    }
    const targetNodeObj = nodes.find(n => n.id === linkTarget);
    const newLink = {
      id: `LINK-${links.length + 1}`,
      source: linkSource,
      target: linkTarget,
      label: targetNodeObj ? targetNodeObj.name : 'Connection',
      connectionType: linkConnectionType
    };
    setLinks([...links, newLink]);
    setIsLinkModalOpen(false);
  };

  // Helper to render node shape icon
  const renderNodeIcon = (type) => {
    switch(type) {
      case 'Suspect': return <div className="w-5 h-5 rounded-full border-2 border-red-500 bg-red-950/80 flex items-center justify-center shadow-lg"><div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div></div>;
      case 'Crime': return <div className="w-4 h-4 rotate-45 border-2 border-amber-400 bg-amber-950/80 shadow-lg"></div>;
      case 'Location': return <div className="w-0 h-0 border-x-8 border-x-transparent border-b-[14px] border-b-emerald-400 filter drop-shadow"></div>;
      case 'Phone': return <div className="w-4 h-4 rounded border-2 border-amber-300 bg-amber-950/80 shadow-lg"></div>;
      case 'Vehicle': return <div className="text-purple-400 font-bold text-sm drop-shadow">★</div>;
      default: return <div className="w-4 h-4 rounded-full bg-cyan-500"></div>;
    }
  };

  const filteredNodes = nodes.filter(n => 
    n.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 font-sans flex flex-col select-none text-xs">
      
      {/* 1. Top Application Bar & Tabs */}
      <div className="bg-[#0b101c] border-b border-slate-800 px-3 py-1.5 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-1">
          {['Settings', 'Incidents', 'i-Core Analysis'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTopTab(tab)}
              className={`px-3 py-1 rounded-t border text-xs font-medium transition ${activeTopTab === tab ? 'bg-[#121826] border-slate-700 border-b-[#121826] text-cyan-400 shadow-sm' : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Top Control Action Bar */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#121826] border border-slate-700/80 px-2.5 py-1 rounded-full text-[11px] font-mono text-slate-300 flex items-center gap-2">
            <span>Nodes <strong className="text-cyan-400">{nodes.length}</strong></span>
            <span>|</span>
            <span>Links <strong className="text-purple-400">{links.length}</strong></span>
          </div>

          <button 
            onClick={handleExport}
            className="bg-[#121826] hover:bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1 rounded text-xs transition flex items-center gap-1 font-semibold"
          >
            📤 Export
          </button>
          <button 
            onClick={handleReset}
            className="bg-red-950/60 hover:bg-red-900/80 border border-red-800 text-red-300 px-3 py-1 rounded text-xs transition flex items-center gap-1 font-semibold"
          >
            🔄 Reset
          </button>
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold px-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
          </span>
        </div>
      </div>

      {/* 2. Main Workspace Grid */}
      <div className="flex-1 grid grid-cols-12 gap-1 p-1 bg-[#04060a] overflow-hidden">
        
        {/* LEFT COLUMN: Filters & Node Legend */}
        <div className="col-span-3 flex flex-col space-y-1">
          
          <div className="bg-[#0b101c] border border-slate-800 rounded p-2.5 flex flex-col space-y-2 flex-1 shadow-md overflow-y-auto max-h-[440px]">
            <div className="font-bold text-slate-300 border-b border-slate-800 pb-1.5 flex justify-between items-center">
              <span>Filters & Precinct Tree</span>
              <span className="text-[10px] text-cyan-400">Active Tree</span>
            </div>

            <div className="space-y-1 text-slate-400">
              <div className="font-semibold text-slate-200">⚙️ Animation Settings</div>
              <div className="font-semibold text-slate-200 pt-1">🔍 Reachability Analysis (Hops: 3)</div>
              <div className="font-semibold text-slate-200 pt-1">📋 Offense Detail Settings</div>
              
              <div className="pt-2 border-t border-slate-800 font-bold text-slate-200">Filters</div>
              <label className="flex items-center space-x-2 cursor-pointer pl-1">
                <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-700 text-cyan-500" />
                <span className="font-semibold text-slate-200">Incidents</span>
              </label>
              
              <div className="pl-3 space-y-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-700 text-cyan-500" />
                  <span>Offense</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-900 border-slate-700 text-cyan-500" />
                  <span className="font-semibold text-slate-200">District</span>
                </label>
                
                {/* Precinct Sub-tree */}
                <div className="pl-3 space-y-1 text-[11px]">
                  <div className="font-medium text-slate-300">☑ East Precinct (47 Incidents)</div>
                  <div className="pl-3 space-y-1 text-slate-400">
                    <div>☑ C (13 Incidents)</div>
                    <div>☑ E (21 Incidents)</div>
                    <div>☑ G (13 Incidents)</div>
                  </div>
                  
                  <div className="font-medium text-slate-300 pt-1">☑ North Precinct (89 Incidents)</div>
                  <div className="pl-3 space-y-1 text-slate-400">
                    <div>☑ B (27 Incidents)</div>
                    <div>☑ J (7 Incidents)</div>
                    <div>☑ L (25 Incidents)</div>
                    <div>☑ N (8 Incidents)</div>
                    <div>☑ U (30 Incidents)</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5 mt-auto">
              <button 
                onClick={() => setIsNodeModalOpen(true)}
                className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-1.5 rounded transition shadow"
              >
                + Add Entity Node
              </button>
              <button 
                onClick={() => setIsLinkModalOpen(true)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-1.5 rounded transition border border-slate-700"
              >
                🔗 Link Entities
              </button>
            </div>
          </div>

          {/* Node Legend Box */}
          <div className="bg-[#0b101c] border border-slate-800 rounded p-2.5 flex flex-col shadow-md space-y-2">
            <div className="font-bold text-slate-300 border-b border-slate-800 pb-1 text-[11px] tracking-wider uppercase">
              Node Legend
            </div>
            <div className="grid grid-cols-1 gap-1.5 text-[11px] text-slate-400">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Suspect</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rotate-45 bg-amber-400"></div> Crime / Case</div>
              <div className="flex items-center gap-2"><div className="w-0 h-0 border-x-4 border-x-transparent border-b-[8px] border-b-emerald-400"></div> Location</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-amber-300"></div> Phone / Device</div>
              <div className="flex items-center gap-2"><span className="text-purple-400 font-bold">★</span> Vehicle</div>
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: Panning & Zooming Network Graph Canvas */}
        <div className="col-span-6 flex flex-col space-y-1">
          
          <div className="bg-[#0b101c] border border-slate-800 rounded p-3 flex flex-col flex-1 relative shadow-md min-h-[480px]">
            
            {/* Graph Header instructions */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-[11px] text-slate-400">
                <span>✋ Click & Drag anywhere to pan canvas • Scroll to zoom</span>
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Search Graph..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white w-32 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Draggable & Pannable Graph Viewport */}
            <div 
              className={`flex-1 bg-[#060a12] rounded border border-slate-800/80 mt-2 relative overflow-hidden ${isDraggingCanvas ? 'cursor-grabbing' : 'cursor-grab'}`}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              data-canvas="true"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" data-canvas="true"></div>
              
              {/* Zoom Indicator */}
              <div className="absolute top-2 left-3 text-[10px] text-slate-500 font-mono z-20 pointer-events-none">ZOOM: {zoomLevel}%</div>

              {/* Pan & Zoom Transformer Layer */}
              <div 
                className="absolute inset-0 w-full h-full pointer-events-none" 
                style={{ 
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoomLevel / 100})`, 
                  transformOrigin: '0 0',
                  transition: isDraggingCanvas ? 'none' : 'transform 0.05s ease-out'
                }}
                data-canvas="true"
              >
                {/* SVG Connecting Lines Renderer */}
                <svg className="absolute inset-0 w-[2000px] h-[2000px] pointer-events-none">
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                    </marker>
                  </defs>
                  {links.map((link) => {
                    const sourceNode = nodes.find(n => n.id === link.source);
                    const targetNode = nodes.find(n => n.id === link.target);
                    if (!sourceNode || !targetNode) return null;
                    return (
                      <g key={link.id}>
                        <path
                          d={`M ${sourceNode.x + 40} ${sourceNode.y + 25} Q ${(sourceNode.x + targetNode.x) / 2} ${(sourceNode.y + targetNode.y) / 2 - 30} ${targetNode.x + 40} ${targetNode.y + 25}`}
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                          strokeOpacity="0.7"
                          markerEnd="url(#arrow)"
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Nodes Positioned on Pannable Canvas */}
                {filteredNodes.map((node) => (
                  <div
                    key={node.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNode(node);
                    }}
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    className={`absolute cursor-pointer p-2 rounded-lg border transition flex flex-col items-center shadow-2xl w-24 z-10 pointer-events-auto ${selectedNode?.id === node.id ? 'bg-cyan-950/90 border-cyan-400 ring-2 ring-cyan-400/60 scale-105' : 'bg-slate-900/90 border-slate-700 hover:border-slate-500'}`}
                  >
                    {renderNodeIcon(node.type)}
                    <span className="font-semibold text-slate-200 text-[10px] mt-1 text-center truncate w-full">{node.name}</span>
                    <span className="text-[8px] text-cyan-400 font-mono">{node.role}</span>
                  </div>
                ))}
              </div>

              {/* Floating Canvas Controls (Zoom In/Out) */}
              <div className="absolute right-4 bottom-4 flex flex-col space-y-1 bg-slate-900 border border-slate-700 rounded p-1 shadow-lg z-30">
                <button onClick={() => setZoomLevel(prev => Math.min(prev + 10, 150))} className="w-7 h-7 text-white font-bold hover:bg-slate-800 rounded flex items-center justify-center">+</button>
                <button onClick={() => setZoomLevel(prev => Math.max(prev - 10, 50))} className="w-7 h-7 text-white font-bold hover:bg-slate-800 rounded flex items-center justify-center">-</button>
              </div>
            </div>
          </div>

          {/* Bottom Temporal Timeline Scrubber */}
          <div className="bg-[#0b101c] border border-slate-800 rounded p-2.5 shadow-md h-24 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1">
              <span className="font-bold text-slate-300">Temporal Incident Timeline Scrubber</span>
              <span className="text-[10px] text-cyan-400 font-mono">Jun '07 - Sep '08</span>
            </div>
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded mt-1 relative flex items-end px-2 pb-1">
              <div className="w-full h-10 flex items-end gap-0.5 opacity-70">
                {[20,35,50,70,85,60,40,30,80,95,65,45,30,60,85,90,70,50,40,75,90].map((h, i) => (
                  <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-cyan-500 rounded-t"></div>
                ))}
              </div>
              <div className="absolute inset-x-12 top-1 bottom-1 border border-cyan-400 bg-cyan-500/10 rounded pointer-events-none"></div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Entity Inspector Panel */}
        <div className="col-span-3 flex flex-col space-y-1">
          
          <div className="bg-[#0b101c] border border-slate-800 rounded p-3 flex flex-col space-y-3 shadow-md flex-1 overflow-y-auto">
            
            {/* Inspector Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="bg-red-950 text-red-400 border border-red-800 px-2 py-0.5 rounded text-[10px] font-bold">
                  {selectedNode?.type.toUpperCase() || 'ENTITY'}
                </span>
              </div>
              <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-white font-bold">✕</button>
            </div>

            {selectedNode ? (
              <>
                <div>
                  <div className="text-sm font-bold text-white">{selectedNode.name}</div>
                </div>

                {/* Metadata Fields */}
                <div className="space-y-2 text-[11px] bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-500 uppercase">Role</span>
                    <span className="text-slate-200 font-medium">{selectedNode.role}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-500 uppercase">Age</span>
                    <span className="text-slate-200 font-medium">{selectedNode.age || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-500 uppercase">Location</span>
                    <span className="text-slate-200 font-medium">{selectedNode.location || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-800 pb-1">
                    <span className="text-slate-500 uppercase">Cases</span>
                    <span className="text-slate-200 font-medium text-right max-w-[140px] truncate">{selectedNode.cases}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-slate-500 uppercase">Status</span>
                    <span className="bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded font-bold text-[10px]">
                      {selectedNode.status}
                    </span>
                  </div>
                </div>

                {/* Connections Section */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-300">Connections</span>
                    <span className="bg-cyan-950 text-cyan-400 px-1.5 py-0.2 rounded font-mono text-[10px]">
                      {links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id).length}
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[180px] overflow-y-auto">
                    {links.filter(l => l.source === selectedNode.id || l.target === selectedNode.id).map((link) => {
                      const otherId = link.source === selectedNode.id ? link.target : link.source;
                      const otherNode = nodes.find(n => n.id === otherId);
                      return (
                        <div key={link.id} className="bg-slate-900 p-2 rounded border border-slate-800 flex items-center justify-between">
                          <span className="text-slate-200 font-medium truncate max-w-[110px]">{otherNode ? otherNode.name : link.label}</span>
                          <span className="text-[10px] bg-slate-800 text-cyan-300 px-1.5 py-0.5 rounded font-mono">{link.connectionType}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Inspector Actions */}
                <div className="pt-2 border-t border-slate-800 flex gap-2 mt-auto">
                  <button 
                    onClick={() => handleRemoveNode(selectedNode.id)}
                    className="flex-1 bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 font-semibold py-1.5 rounded transition flex items-center justify-center gap-1"
                  >
                    🗑️ Remove
                  </button>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-1.5 rounded transition border border-slate-700"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-500 py-12">Select any node on the graph to inspect intelligence dossier.</div>
            )}

          </div>

        </div>

      </div>

      {/* --- Modal: Create New Node --- */}
      {isNodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0b101c] border border-slate-700 rounded-lg p-4 w-full max-w-sm shadow-2xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-xs">Add New Entity Node</h3>
              <button onClick={() => setIsNodeModalOpen(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateNode} className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Entity Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Vikram Singh" 
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Type</label>
                  <select 
                    value={newNodeType}
                    onChange={(e) => setNewNodeType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                  >
                    <option value="Suspect">Suspect</option>
                    <option value="Crime">Crime</option>
                    <option value="Location">Location</option>
                    <option value="Phone">Phone</option>
                    <option value="Vehicle">Vehicle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Threat Score</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={newNodeThreat}
                    onChange={(e) => setNewNodeThreat(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Role / Designation</label>
                <input 
                  type="text" 
                  value={newNodeRole}
                  onChange={(e) => setNewNodeRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                  placeholder="e.g. Accomplice"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsNodeModalOpen(false)} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded font-medium">Cancel</button>
                <button type="submit" className="bg-cyan-600 text-white px-3 py-1.5 rounded font-medium">Save Node</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Modal: Link Entities --- */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0b101c] border border-slate-700 rounded-lg p-4 w-full max-w-sm shadow-2xl space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-white text-xs">Establish Relationship Link</h3>
              <button onClick={() => setIsLinkModalOpen(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>
            <form onSubmit={handleCreateLink} className="space-y-2.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Source Node</label>
                <select 
                  value={linkSource}
                  onChange={(e) => setLinkSource(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                >
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.id} - {n.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Target Node</label>
                <select 
                  value={linkTarget}
                  onChange={(e) => setLinkTarget(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                >
                  {nodes.map(n => <option key={n.id} value={n.id}>{n.id} - {n.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Connection Type Label</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Associate, Mastermind, Owner" 
                  value={linkConnectionType}
                  onChange={(e) => setLinkConnectionType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={() => setIsLinkModalOpen(false)} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded font-medium">Cancel</button>
                <button type="submit" className="bg-cyan-600 text-white px-3 py-1.5 rounded font-medium">Link Nodes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export Notification Toast */}
      {exportNotification && (
        <div className="fixed bottom-4 right-4 bg-cyan-600 text-white px-4 py-2 rounded shadow-2xl text-xs font-semibold animate-bounce z-50">
          ✔ Intelligence graph successfully compiled & exported!
        </div>
      )}

    </div>
  );
}