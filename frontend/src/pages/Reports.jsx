import React, { useState } from 'react';
import {
  FileText,
  Download,
  Filter,
  Search,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileSpreadsheet,
  FileCheck2,
  ExternalLink,
  Printer,
  Sparkles,
  AlertCircle,
  BarChart3,
  Scale,
  RefreshCw,
  X,
  Eye,
  Trash2
} from 'lucide-react';

export default function Reports() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCase, setSelectedCase] = useState('26189-042');
  const [selectedTemplate, setSelectedTemplate] = useState('LEGAL_AFFIDAVIT');
  const [isGenerating, setIsGenerating] = useState(false);

  // Modal / Notification states
  const [modalReport, setModalReport] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Mock Generated Reports Repository
  const [reportsList, setReportsList] = useState([
    {
      id: 'RPT-2026-9011',
      title: 'Section 65B Electronic Evidence Affidavit & Hash Certificate',
      type: 'LEGAL_AFFIDAVIT',
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021',
      generatedBy: 'Inspector R. Deshmukh',
      generatedAt: '12 Jan 2026, 16:40 IST',
      status: 'READY',
      size: '2.4 MB',
      format: 'PDF',
      hashSignature: 'SHA256: 9f8a0...c418e'
    },
    {
      id: 'RPT-2026-8842',
      title: 'Comprehensive Telecom CDR & Tower Dump Frequency Analysis',
      type: 'CDR_ANALYSIS',
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021',
      generatedBy: 'DySP S. Pattnaik',
      generatedAt: '18 Jan 2026, 11:15 IST',
      status: 'READY',
      size: '14.8 MB',
      format: 'PDF',
      hashSignature: 'SHA256: a14c8...e901b'
    },
    {
      id: 'RPT-2026-8710',
      title: 'Multi-Layer Shell Account Money Laundering Trail (FIU Dump)',
      type: 'FINANCIAL_TRAIL',
      caseId: '26189-088',
      firNo: 'FIR-2026-DL-4410',
      generatedBy: 'Senior Investigator V. Kumar',
      generatedAt: '05 Feb 2026, 09:30 IST',
      status: 'READY',
      size: '8.2 MB',
      format: 'EXCEL',
      hashSignature: 'SHA256: e8812...a0421'
    },
    {
      id: 'RPT-2026-8501',
      title: 'Master Syndicate Linkage & Inter-Suspect Network Dossier',
      type: 'DOSSIER',
      caseId: '26189-102',
      firNo: 'FIR-2026-MH-1102',
      generatedBy: 'Forensic Expert A. Mehta',
      generatedAt: '22 Feb 2026, 14:05 IST',
      status: 'PROCESSING',
      size: 'Calculating...',
      format: 'PDF',
      hashSignature: 'PENDING_CHAIN_LOCK'
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleGenerateReport = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      let title = 'Section 65B Electronic Evidence Affidavit & Hash Certificate';
      let type = selectedTemplate;
      let format = type === 'FINANCIAL_TRAIL' ? 'EXCEL' : 'PDF';
      let fir = selectedCase === '26189-042' ? 'FIR-2026-NCRB-9021' : selectedCase === '26189-088' ? 'FIR-2026-DL-4410' : 'FIR-2026-MH-1102';

      if (type === 'CDR_ANALYSIS') title = 'Comprehensive Telecom CDR & Tower Dump Frequency Analysis';
      if (type === 'FINANCIAL_TRAIL') title = 'Multi-Layer Shell Account Money Laundering Trail (FIU Dump)';
      if (type === 'DOSSIER') title = 'Master Syndicate Linkage & Inter-Suspect Network Dossier';

      const newReport = {
        id: `RPT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title,
        type,
        caseId: selectedCase,
        firNo: fir,
        generatedBy: 'Tushar Kaushik (Cloud & Sec Architect)',
        generatedAt: 'Just Now',
        status: 'READY',
        size: `${(Math.random() * 5 + 1.5).toFixed(1)} MB`,
        format,
        hashSignature: `SHA256: ${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 7)}`
      };

      setReportsList([newReport, ...reportsList]);
      setIsGenerating(false);
      showToast(`Successfully compiled and anchored report ${newReport.id}!`);
    }, 1500);
  };

  const handleDownload = (report) => {
    showToast(`Downloading secure file: ${report.id}.${report.format.toLowerCase()}...`);
    // Simulating file download action
    const element = document.createElement("a");
    const file = new Blob([`Forensic Report ID: ${report.id}\nTitle: ${report.title}\nHash: ${report.hashSignature}\nCase: ${report.caseId}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${report.id}_${report.type}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleBatchPrint = () => {
    const readyReports = reportsList.filter(r => r.status === 'READY');
    showToast(`Preparing ${readyReports.length} ready reports for secure batch printing...`);
    window.print();
  };

  const handleDeleteReport = (id) => {
    setReportsList(reportsList.filter(r => r.id !== id));
    showToast(`Report ${id} removed from repository.`);
  };

  const getReportTypeBadge = (type) => {
    switch (type) {
      case 'LEGAL_AFFIDAVIT':
        return <span className="px-2 py-0.5 bg-purple-500/10 border border-purple-500/30 text-purple-400 rounded text-[10px] font-mono font-bold flex items-center gap-1 w-fit"><Scale size={11} /> Legal Sec 65B</span>;
      case 'CDR_ANALYSIS':
        return <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded text-[10px] font-mono font-bold flex items-center gap-1 w-fit"><BarChart3 size={11} /> Telecom CDR</span>;
      case 'FINANCIAL_TRAIL':
        return <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded text-[10px] font-mono font-bold flex items-center gap-1 w-fit"><FileSpreadsheet size={11} /> Financial Trail</span>;
      default:
        return <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded text-[10px] font-mono font-bold flex items-center gap-1 w-fit"><FileCheck2 size={11} /> Master Dossier</span>;
    }
  };

  const filteredReports = reportsList.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.firNo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || r.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans relative">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400 animate-bounce">
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <FileText size={16} />
            <span>COURT-ADMISSIBLE FORENSIC REPORTING ENGINE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Investigative Reports & Certifications
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Export legally compliant Section 65B affidavits, CDR network analysis, and case dossiers anchored on SHA-256 hashes.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button 
            onClick={handleBatchPrint}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            <Printer size={14} className="text-slate-400" /> Batch Print
          </button>
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={15} className="animate-spin" /> Compiling Forensic Data...
              </>
            ) : (
              <>
                <Sparkles size={15} /> Generate Sec 65B Certificate
              </>
            )}
          </button>
        </div>
      </div>

      {/* Quick Report Builder Panel */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Instant Forensic Report Generator</h2>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">STANDARDS: BHARATIYA SAKSHYA ADHINIYAM (BSA)</span>
        </div>

        <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Target Case */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Target Case FIR</label>
            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="26189-042">FIR-2026-NCRB-9021 (Noida Cyber Heist)</option>
              <option value="26189-088">FIR-2026-DL-4410 (Shell Banking Laundering)</option>
              <option value="26189-102">FIR-2026-MH-1102 (Burner Phone Network)</option>
            </select>
          </div>

          {/* Report Template Type */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Report Format / Template</label>
            <select 
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="LEGAL_AFFIDAVIT">Section 65B / BSA Hash Affidavit (PDF)</option>
              <option value="CDR_ANALYSIS">Tower Dump & Call Frequency Matrix (PDF)</option>
              <option value="FINANCIAL_TRAIL">Financial Flow & Mule Audit Trail (XLSX)</option>
              <option value="DOSSIER">Complete Suspect & Network Master Dossier (PDF)</option>
            </select>
          </div>

          {/* Include Hash Chain */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">Cryptographic Ledger Lock</label>
            <div className="flex items-center h-[38px] bg-slate-950 border border-slate-800 rounded-xl px-3 text-xs text-emerald-400 font-mono">
              <ShieldCheck size={14} className="mr-2" /> SHA-256 Ledger Anchor Included
            </div>
          </div>

          {/* Trigger Generate */}
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full h-[38px] bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? 'Building Output...' : 'Generate Report Now'}
            </button>
          </div>
        </form>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl">
        
        {/* Search */}
        <div className="relative md:col-span-2">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Report Title, Report ID, or FIR Number..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-2.5 text-slate-500 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Report Type Filter */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
          <Filter size={14} className="text-slate-500 shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent w-full text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950">Type: All Reports</option>
            <option value="LEGAL_AFFIDAVIT" className="bg-slate-950">Section 65B Affidavits</option>
            <option value="CDR_ANALYSIS" className="bg-slate-950">CDR Analysis Reports</option>
            <option value="FINANCIAL_TRAIL" className="bg-slate-950">Financial Trail Audits</option>
            <option value="DOSSIER" className="bg-slate-950">Master Case Dossiers</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
          <Clock size={14} className="text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent w-full text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950">Status: All Statuses</option>
            <option value="READY" className="bg-slate-950">Ready for Download</option>
            <option value="PROCESSING" className="bg-slate-950">Compilation in Progress</option>
          </select>
        </div>

      </div>

      {/* Generated Reports Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Report Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Case & FIR Reference</th>
                <th className="py-3.5 px-4">Generated By & Time</th>
                <th className="py-3.5 px-4">Status & Hash</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No generated reports matching your search parameters.
                  </td>
                </tr>
              ) : (
                filteredReports.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/40 transition">
                    
                    {/* Title & ID */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 text-emerald-400">
                          <FileText size={18} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-slate-500 block mb-0.5">
                            {r.id} • {r.format} ({r.size})
                          </span>
                          <span className="font-bold text-white block text-sm">
                            {r.title}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      {getReportTypeBadge(r.type)}
                    </td>

                    {/* Case Link */}
                    <td className="py-4 px-4">
                      <span className="font-mono text-cyan-400 font-semibold block">{r.firNo}</span>
                      <span className="text-[11px] text-slate-500">Case #{r.caseId}</span>
                    </td>

                    {/* Generated By */}
                    <td className="py-4 px-4">
                      <span className="text-slate-200 font-medium block">{r.generatedBy}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock size={11} /> {r.generatedAt}
                      </span>
                    </td>

                    {/* Status & Ledger Lock */}
                    <td className="py-4 px-4">
                      {r.status === 'READY' ? (
                        <div>
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-bold text-[10px] mb-0.5">
                            <CheckCircle2 size={12} /> READY
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 block truncate max-w-[130px]">
                            {r.hashSignature}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-mono font-bold text-[10px]">
                          <RefreshCw size={12} className="animate-spin" /> COMPILING...
                        </span>
                      )}
                    </td>

                    {/* Download & Management Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status === 'READY' ? (
                          <>
                            <button 
                              onClick={() => setModalReport(r)}
                              title="Quick View Details"
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition inline-flex items-center cursor-pointer"
                            >
                              <Eye size={13} />
                            </button>
                            <button 
                              onClick={() => handleDownload(r)}
                              title="Export File"
                              className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition inline-flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                            >
                              <Download size={13} /> Export
                            </button>
                          </>
                        ) : (
                          <button disabled className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-600 cursor-not-allowed inline-flex items-center gap-1 font-bold text-[11px]">
                            Wait...
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteReport(r.id)}
                          title="Delete Report Entry"
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition inline-flex items-center cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick View Modal */}
      {modalReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setModalReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold">
              <ShieldCheck size={16} /> VERIFIED COURT-ADMISSIBLE DOCUMENT
            </div>
            <h3 className="text-lg font-black text-white">{modalReport.title}</h3>
            
            <div className="bg-slate-950 p-4 rounded-xl space-y-2 font-mono text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">Report ID:</span>
                <span className="text-white font-bold">{modalReport.id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">FIR Reference:</span>
                <span className="text-cyan-400 font-bold">{modalReport.firNo}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">Generated By:</span>
                <span>{modalReport.generatedBy}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-1">
                <span className="text-slate-500">Format & Size:</span>
                <span>{modalReport.format} ({modalReport.size})</span>
              </div>
              <div className="flex flex-col pt-1">
                <span className="text-slate-500 mb-1">SHA-256 Cryptographic Hash:</span>
                <span className="text-emerald-400 break-all bg-slate-900 p-2 rounded border border-slate-800">{modalReport.hashSignature}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setModalReport(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
              <button 
                onClick={() => { handleDownload(modalReport); setModalReport(null); }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Download size={14} /> Download File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}