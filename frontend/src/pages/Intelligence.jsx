import React, { useState } from 'react';
import {
  BrainCircuit,
  Search,
  Sparkles,
  Zap,
  ShieldAlert,
  Sliders,
  Filter,
  FileSearch,
  PhoneCall,
  MapPin,
  GitFork,
  ArrowRight,
  Database,
  TrendingUp,
  Clock,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Bot,
  BarChart3,
  ExternalLink,
  ChevronRight,
  Download,
  Share2,
  RefreshCw,
  Eye
} from 'lucide-react';

export default function Intelligence() {
  const [activeAnalysisType, setActiveAnalysisType] = useState('ALL');
  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Interactive Modal & Toast States
  const [notificationToast, setNotificationToast] = useState('');
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedSubGraphItem, setSelectedSubGraphItem] = useState(null);
  const [hypothesisModalOpen, setHypothesisModalOpen] = useState(false);

  // Helper for Toast Notifications
  const triggerToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast('');
    }, 3000);
  };

  const [intelligenceResults, setIntelligenceResults] = useState([
    {
      id: 'INT-2026-8801',
      title: 'High-Frequency CDR & UPI Burst Pattern Identified',
      type: 'Pattern Mining',
      confidence: 96,
      caseId: '26189-042',
      timestamp: '10 Mins Ago',
      severity: 'CRITICAL',
      summary:
        'Detected 47 short-duration CDR calls between Burner SIM (+91 98765 43210) and Target Phone (+91 91234 56789) immediately followed by 3 high-value UPI transfers totaling ₹42,00,000 to Shell Account HDFC #9041.',
      entitiesInvolved: ['Rajesh "Raju" Sharma', '+91 98765 43210', 'HDFC Ac #...9041'],
      recommendedAction: 'Issue immediate freeze request to bank nodal officer for Account HDFC #9041.'
    },
    {
      id: 'INT-2026-8802',
      title: 'Cross-Case Identity Mapping Match (Fingerprint/Phone)',
      type: 'Cross-Case Link',
      confidence: 91,
      caseId: '26189-088',
      timestamp: '1 Hour Ago',
      severity: 'HIGH',
      summary:
        'Suspect Vikram Choudhury (ENT-4412) matched with unlinked phone record in Case #26189-088. Common rendezvous point discovered at Safehouse Sector 62.',
      entitiesInvolved: ['Vikram Choudhury', 'Safehouse - Sector 62'],
      recommendedAction: 'Link Case #26189-042 and #26189-088 in Central Intelligence Repository.'
    },
    {
      id: 'INT-2026-8803',
      title: 'Geospatial Co-location Anomaly near Border Checkpoint',
      type: 'Geospatial Hotspot',
      confidence: 88,
      caseId: '26189-102',
      timestamp: '3 Hours Ago',
      severity: 'MEDIUM',
      summary:
        'Vehicle DL-01-AB-9012 recorded at Toll Plaza 14 simultaneously with Tower Dump signal from Burner SIM +91 98765 43210 at 02:14 AM.',
      entitiesInvolved: ['DL-01-AB-9012 (SUV)', '+91 98765 43210'],
      recommendedAction: 'Request ANPR camera footage from Toll Plaza 14 for timestamp 02:10 - 02:20 AM.'
    }
  ]);

  // Integrated with FastAPI backend RAG pipeline (/chat endpoint)
  const handleRunAiAnalysis = async (e) => {
    e.preventDefault();
    if (!naturalLanguagePrompt.trim()) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: naturalLanguagePrompt }),
      });

      const data = await response.json();
      
      if (response.ok && data.status === 'success') {
        const aiResult = data.data;
        const newReport = {
          id: `INT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          title: `AI Neural Query Results`,
          type: 'Custom Query',
          confidence: 95,
          caseId: '26189-042',
          timestamp: 'Just Now',
          severity: 'HIGH',
          summary: aiResult.answer, // Backend se aane wala RAG response
          entitiesInvolved: aiResult.sources && aiResult.sources.length > 0 
            ? aiResult.sources 
            : ['Target Database Vector'],
          recommendedAction: 'Review source records linked in the intelligence workspace.'
        };
        setIntelligenceResults([newReport, ...intelligenceResults]);
        triggerToast('AI Neural Query executed successfully!');
      } else {
        triggerToast('Error: Failed to fetch AI intelligence.');
      }
    } catch (error) {
      console.error('API Error:', error);
      triggerToast('Network error connecting to AI backend.');
    } finally {
      setIsAnalyzing(false);
      setNaturalLanguagePrompt('');
    }
  };

  const handleGlobalScan = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      triggerToast('Global Crime Engine Scan completed! 2 new anomalies detected.');
    }, 1500);
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans relative">
      
      {/* Toast Notification Popup */}
      {notificationToast && (
        <div className="fixed top-5 right-5 z-50 bg-cyan-400 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <CheckCircle2 size={16} /> {notificationToast}
        </div>
      )}

      {/* Top Workspace Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-1">
            <BrainCircuit size={16} />
            <span>AI PATTERN MINING & INTELLIGENCE REPOSITORY</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Automated Crime Intelligence & Anomaly Mining
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Leverage neural pattern discovery, CDR tower dumps, financial velocity matching, and cross-case criminal linkage algorithms.
          </p>
        </div>

        {/* Global Controls - Fully Interactive */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setExportModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 transition cursor-pointer active:scale-95"
          >
            <Share2 size={14} className="text-cyan-400" /> Export Intelligence Brief
          </button>
          <button
            onClick={handleGlobalScan}
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-cyan-500/20 cursor-pointer active:scale-95"
          >
            <RefreshCw size={14} className={isAnalyzing ? 'animate-spin' : ''} />
            Run Global Scan
          </button>
        </div>
      </div>

      {/* Natural Language Prompt Query Engine */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-cyan-400 animate-pulse" />
          <h2 className="text-sm font-bold text-white">Ask AI Natural Language Intelligence Query</h2>
        </div>

        <form onSubmit={handleRunAiAnalysis} className="flex flex-col md:flex-row gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
            <input
              type="text"
              value={naturalLanguagePrompt}
              onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
              placeholder="e.g., What are the names of the accused persons and directors mentioned in the Om Shivao Infracons Limited FIR case?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={isAnalyzing}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs flex items-center justify-center gap-2 transition shrink-0 cursor-pointer active:scale-95"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Mining Pattern...
              </>
            ) : (
              <>
                <Zap size={14} /> Execute AI Query
              </>
            )}
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 pt-1">
          <span className="font-semibold text-slate-500">Preset Scans:</span>
          {[
            'What are the names of the accused persons and directors mentioned in the Om Shivao Infracons Limited FIR case?',
            'Tower Dump Co-location',
            'CDR Bursts & Nighttime Anomaly',
            'Burner SIM Rotation Detection'
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setNaturalLanguagePrompt(preset);
                triggerToast(`Preset loaded: "${preset.substring(0, 30)}..."`);
              }}
              className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 font-mono transition cursor-pointer truncate max-w-xs"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto custom-scrollbar">
        {[
          { label: 'ALL INTELLIGENCE', value: 'ALL' },
          { label: 'PATTERN MINING', value: 'Pattern Mining' },
          { label: 'CROSS-CASE LINKS', value: 'Cross-Case Link' },
          { label: 'GEOSPATIAL HOTSPOTS', value: 'Geospatial Hotspot' },
          { label: 'CDR & SDR ANOMALIES', value: 'CDR Anomaly' }
        ].map((type) => (
          <button
            key={type.value}
            onClick={() => {
              setActiveAnalysisType(type.value);
              triggerToast(`Filtered by: ${type.label}`);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
              activeAnalysisType === type.value
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Intelligence Cards + Right Summary Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Center Column: Intelligence Reports (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {intelligenceResults
            .filter(
              (item) =>
                activeAnalysisType === 'ALL' || item.type === activeAnalysisType
            )
            .map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-lg space-y-4 transition"
              >
                {/* Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider ${getSeverityBadge(
                        item.severity
                      )}`}
                    >
                      {item.severity}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {item.id}
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs font-semibold text-slate-400">
                      Case #{item.caseId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                    <Clock size={13} className="text-slate-500" />
                    <span>{item.timestamp}</span>
                    <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-cyan-300 font-bold">
                      Confidence: {item.confidence}%
                    </span>
                  </div>
                </div>

                {/* Title & Detailed Summary */}
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-300 whitespace-pre-line">
                    {item.summary}
                  </p>
                </div>

                {/* Entities Involved */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Sources / Linked Entities Involved:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.entitiesInvolved.map((ent, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium text-slate-200"
                      >
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>

                {/* AI Action Item */}
                <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex items-start gap-2 text-xs">
                  <Zap size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-cyan-300">Recommended Operational Action: </span>
                    <span className="text-slate-300">{item.recommendedAction}</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <a
                    href={`/cases/${item.caseId}`}
                    className="flex items-center gap-1.5 font-bold text-cyan-400 hover:text-cyan-300 transition"
                  >
                    Open Case Intelligence Workspace <ChevronRight size={14} />
                  </a>

                  <button 
                    onClick={() => setSelectedSubGraphItem(item)}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-white font-medium transition cursor-pointer"
                  >
                    <Eye size={14} /> Visualize Sub-graph
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* Right Panel: Intelligence Health & System Metrics (1 Col) */}
        <div className="space-y-6">
          
          {/* Intelligence Engine Stats */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 size={16} className="text-cyan-400" /> Engine Scan Performance
              </h2>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Indexed CDR Records:</span>
                <span className="font-mono font-bold text-white">4,812,090 Call Rows</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">UPI/Bank Statements Analyzed:</span>
                <span className="font-mono font-bold text-cyan-400">₹142.8 Crore Total</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Cross-Case Match Accuracy:</span>
                <span className="font-mono font-bold text-emerald-400">98.4% Precision</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/50">
                <span className="text-slate-400">Active High-Priority Anomalies:</span>
                <span className="font-mono font-bold text-red-400">14 Detected</span>
              </div>
            </div>
          </div>

          {/* AI Automated Hypothesis Generator */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Bot size={18} />
              <h3 className="text-xs font-bold uppercase tracking-wider">AI Automated Hypothesis</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              Pattern mining predicts a 89% probability that <span className="text-red-400 font-bold">Syndicate Alpha-04</span> will perform another multi-sim rotation within 48 hours based on historic bi-weekly disbursement cycles.
            </p>
            <button 
              onClick={() => setHypothesisModalOpen(true)}
              className="w-full bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 font-semibold py-2 rounded-xl text-xs transition cursor-pointer active:scale-95"
            >
              Generate Pre-emptive Alert
            </button>
          </div>

        </div>

      </div>

      {/* --- MODALS FOR INTERACTIVE BUTTONS --- */}

      {/* 1. Export Intelligence Brief Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Share2 size={16} className="text-cyan-400" /> Export Intelligence Brief Package
              </h3>
              <button onClick={() => setExportModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <p>Exporting compiled neural patterns, active anomalies, and cross-case link summaries for official investigative distribution.</p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-cyan-400">
                Package Format: Encrypted PDF + JSON Vector Dump
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setExportModalOpen(false)} className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer">Cancel</button>
              <button 
                onClick={() => {
                  setExportModalOpen(false);
                  triggerToast('Intelligence brief package downloaded successfully!');
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Confirm & Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Sub-graph Visualization Modal */}
      {selectedSubGraphItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <GitFork size={16} className="text-cyan-400" /> Neural Sub-graph Visualizer
              </h3>
              <button onClick={() => setSelectedSubGraphItem(null)} className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <p><strong className="text-cyan-400">Anomaly:</strong> {selectedSubGraphItem.title}</p>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 h-40 flex items-center justify-center text-slate-500 font-mono text-center">
                [ Interactive Node Network Graph Rendering: {selectedSubGraphItem.entitiesInvolved.join(' ↔ ')} ]
              </div>
              <p className="text-[11px] text-slate-400">Nodes maintain a direct confidence correlation weight of {selectedSubGraphItem.confidence}% based on telemetry vectors.</p>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedSubGraphItem(null)}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Close Visualizer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Pre-emptive Alert Modal */}
      {hypothesisModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Bot size={16} className="text-cyan-400" /> Pre-emptive Alert Dispatched
              </h3>
              <button onClick={() => setHypothesisModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-cyan-500/30 text-cyan-300 flex items-center gap-3">
                <CheckCircle2 size={24} className="shrink-0" />
                <div>
                  <p className="font-bold">Automated Alert Sent to Field Units</p>
                  <p className="text-[11px] text-slate-400">Syndicate Alpha-04 rotation warning broadcasted to monitoring sectors.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => {
                  setHypothesisModalOpen(false);
                  triggerToast('Pre-emptive alert acknowledged.');
                }}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}