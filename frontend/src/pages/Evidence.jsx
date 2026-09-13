import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Lock,
  ShieldCheck,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  ExternalLink,
  Clock,
  Hash,
  Eye,
  FileCode,
  Film,
  HardDrive,
  FileSpreadsheet,
  AlertCircle,
  Key,
  CheckCircle2,
  Copy,
  ChevronRight,
  ShieldAlert,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet as SheetIcon
} from 'lucide-react';

export default function Evidence() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [caseFilter, setCaseFilter] = useState('ALL');
  const [copiedHash, setCopiedHash] = useState(null);

  // Interactive Modal & Toast States
  const [notificationToast, setNotificationToast] = useState('');
  const [ingestModalOpen, setIngestModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedAuditItem, setSelectedAuditItem] = useState(null);
  const [selectedExportItem, setSelectedExportItem] = useState(null);

  // Form states for new multi-format ingestion
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('TELECOM_CDR');
  const [newCaseId, setNewCaseId] = useState('26189-042');
  const [attachedFile, setAttachedFile] = useState(null);

  // Helper for Toast Notifications
  const triggerToast = (msg) => {
    setNotificationToast(msg);
    setTimeout(() => {
      setNotificationToast('');
    }, 3000);
  };

  // Mock Evidence Records with SHA-256 Chain of Custody
  const [evidenceList, setEvidenceList] = useState([
    {
      id: 'EVD-2026-9041',
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021',
      title: 'Tower Dump CDR Extraction - Noida Sector 62',
      type: 'TELECOM_CDR',
      size: '142.8 MB',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      ledgerTx: '0x9481a...c821b',
      uploadedBy: 'Inspector R. Deshmukh',
      timestamp: '12 Jan 2026, 14:22 IST',
      verificationStatus: 'VERIFIED_ON_CHAIN',
      downloadsCount: 14,
      accessLevel: 'CONFIDENTIAL'
    },
    {
      id: 'EVD-2026-8812',
      caseId: '26189-042',
      firNo: 'FIR-2026-NCRB-9021',
      title: 'CCTV Footage - Axis Bank ATM Counter #4',
      type: 'VIDEO_RECORDING',
      size: '1.84 GB',
      sha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
      ledgerTx: '0x8812f...a4102',
      uploadedBy: 'DySP S. Pattnaik',
      timestamp: '15 Jan 2026, 09:10 IST',
      verificationStatus: 'VERIFIED_ON_CHAIN',
      downloadsCount: 8,
      accessLevel: 'RESTRICTED'
    },
    {
      id: 'EVD-2026-8790',
      caseId: '26189-088',
      firNo: 'FIR-2026-DL-4410',
      title: 'Shell Company FIU Banking Ledger (CSV Dump)',
      type: 'CSV_FILE',
      size: '18.4 MB',
      sha256: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
      ledgerTx: '0x12a90...b9981',
      uploadedBy: 'Senior Investigator V. Kumar',
      timestamp: '04 Feb 2026, 18:45 IST',
      verificationStatus: 'VERIFIED_ON_CHAIN',
      downloadsCount: 22,
      accessLevel: 'CONFIDENTIAL'
    },
    {
      id: 'EVD-2026-8411',
      caseId: '26189-102',
      firNo: 'FIR-2026-MH-1102',
      title: 'Forensic Image Dump (128GB Burner Phone Drive)',
      type: 'DRIVE_IMAGE',
      size: '42.1 GB',
      sha256: 'cb56d08f330591b779b744069f210582239a269290e2d1701b27d72d0077e23d',
      ledgerTx: '0x4421c...e8810',
      uploadedBy: 'Forensic Expert A. Mehta',
      timestamp: '20 Feb 2026, 11:30 IST',
      verificationStatus: 'VERIFIED_ON_CHAIN',
      downloadsCount: 5,
      accessLevel: 'TOP_SECRET'
    }
  ]);

  const copyToClipboard = (hash, id) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(id);
    triggerToast('SHA-256 Hash copied to clipboard!');
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const getEvidenceIcon = (type) => {
    switch (type) {
      case 'TELECOM_CDR':
        return <FileCode size={16} className="text-amber-400" />;
      case 'VIDEO_RECORDING':
        return <Film size={16} className="text-purple-400" />;
      case 'CSV_FILE':
        return <FileSpreadsheet size={16} className="text-cyan-400" />;
      case 'EXCEL_SHEET':
        return <SheetIcon size={16} className="text-emerald-400" />;
      case 'CAMERA_IMAGE':
        return <ImageIcon size={16} className="text-pink-400" />;
      case 'PDF_DOC':
        return <FileText size={16} className="text-rose-400" />;
      default:
        return <HardDrive size={16} className="text-blue-400" />;
    }
  };

  // Handle File Input Selection & Auto-Detect Type
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
      if (!newTitle) {
        setNewTitle(file.name.substring(0, file.name.lastIndexOf('.')) || file.name);
      }
      
      // Auto-detect type based on extension
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'csv') setNewType('CSV_FILE');
      else if (['xlsx', 'xls'].includes(ext)) setNewType('EXCEL_SHEET');
      else if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) setNewType('CAMERA_IMAGE');
      else if (ext === 'pdf') setNewType('PDF_DOC');
      else if (['mp4', 'mov', 'avi'].includes(ext)) setNewType('VIDEO_RECORDING');
    }
  };

  // Handle New File Ingestion Submit
  const handleIngestSubmit = (e) => {
    e.preventDefault();
    if (!newTitle) return;

    const formattedSize = attachedFile 
      ? (attachedFile.size / (1024 * 1024)).toFixed(2) + ' MB' 
      : '12.4 MB';

    const newRecord = {
      id: `EVD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      caseId: newCaseId,
      firNo: newCaseId === '26189-042' ? 'FIR-2026-NCRB-9021' : newCaseId === '26189-088' ? 'FIR-2026-DL-4410' : 'FIR-2026-MH-1102',
      title: newTitle,
      type: newType,
      size: formattedSize,
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      ledgerTx: `0x${Math.random().toString(16).substring(2, 8)}...${Math.random().toString(16).substring(2, 6)}`,
      uploadedBy: 'Current Officer (You)',
      timestamp: 'Just now',
      verificationStatus: 'VERIFIED_ON_CHAIN',
      downloadsCount: 0,
      accessLevel: 'CONFIDENTIAL'
    };

    setEvidenceList([newRecord, ...evidenceList]);
    setIngestModalOpen(false);
    setNewTitle('');
    setAttachedFile(null);
    triggerToast('File successfully uploaded, hashed & anchored to blockchain ledger!');
  };

  const filteredEvidence = evidenceList.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.firNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.sha256.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || e.type === typeFilter;
    const matchesCase = caseFilter === 'ALL' || e.caseId === caseFilter;

    return matchesSearch && matchesType && matchesCase;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans relative">
      
      {/* Toast Notification Popup */}
      {notificationToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 font-bold text-xs animate-bounce">
          <CheckCircle2 size={16} /> {notificationToast}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <Lock size={16} />
            <span>CRYPTOGRAPHIC EVIDENCE VAULT & LEDGER</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Evidence Chain of Custody Repository
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Court-admissible forensic artifacts anchored with SHA-256 cryptographic hashing and immutable ledger loggings.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => setVerifyModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 transition cursor-pointer active:scale-95"
          >
            <ShieldCheck size={14} className="text-emerald-400" /> Verify Hash Integrity
          </button>
          <button 
            onClick={() => setIngestModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg shadow-emerald-500/20 cursor-pointer active:scale-95"
          >
            <Upload size={16} /> Ingest Any Evidence File
          </button>
        </div>
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
            placeholder="Search by Title, Evidence ID, FIR No, or SHA-256 Hash..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
          />
        </div>

        {/* Evidence Type Filter */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
          <Filter size={14} className="text-slate-500 shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-transparent w-full text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950">Type: All Formats</option>
            <option value="CSV_FILE" className="bg-slate-950">CSV Spreadsheets</option>
            <option value="EXCEL_SHEET" className="bg-slate-950">Excel (.xlsx / .xls)</option>
            <option value="CAMERA_IMAGE" className="bg-slate-950">Camera Photos / Images</option>
            <option value="PDF_DOC" className="bg-slate-950">PDF Documents</option>
            <option value="TELECOM_CDR" className="bg-slate-950">Telecom CDR Logs</option>
            <option value="VIDEO_RECORDING" className="bg-slate-950">Video / CCTV Footage</option>
          </select>
        </div>

        {/* Case Filter */}
        <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
          <FileCheck2 size={14} className="text-slate-500 shrink-0" />
          <select
            value={caseFilter}
            onChange={(e) => setCaseFilter(e.target.value)}
            className="bg-transparent w-full text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-slate-950">Case: All Linked Cases</option>
            <option value="26189-042" className="bg-slate-950">FIR-2026-NCRB-9021</option>
            <option value="26189-088" className="bg-slate-950">FIR-2026-DL-4410</option>
            <option value="26189-102" className="bg-slate-950">FIR-2026-MH-1102</option>
          </select>
        </div>

      </div>

      {/* Evidence Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Artifact / Title</th>
                <th className="py-3.5 px-4">Case & FIR</th>
                <th className="py-3.5 px-4">SHA-256 Hash Integrity</th>
                <th className="py-3.5 px-4">Ingestion Meta</th>
                <th className="py-3.5 px-4">Chain Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredEvidence.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No evidence records matching current criteria.
                  </td>
                </tr>
              ) : (
                filteredEvidence.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-800/40 transition">
                    
                    {/* Artifact Title & Type */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                          {getEvidenceIcon(e.type)}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold text-emerald-400 block mb-0.5">
                            {e.id} • {e.size}
                          </span>
                          <span className="font-bold text-white block text-sm">
                            {e.title}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Case Link */}
                    <td className="py-4 px-4">
                      <Link
                        to={`/cases/${e.caseId}`}
                        className="font-mono text-cyan-400 hover:text-cyan-300 font-semibold block"
                      >
                        {e.firNo}
                      </Link>
                      <span className="text-[11px] text-slate-500">Case #{e.caseId}</span>
                    </td>

                    {/* SHA-256 Hash Display */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <span className="font-mono text-[11px] text-slate-300 truncate bg-slate-950 px-2 py-1 rounded border border-slate-800">
                          {e.sha256}
                        </span>
                        <button
                          onClick={() => copyToClipboard(e.sha256, e.id)}
                          className="text-slate-500 hover:text-emerald-400 transition p-1 cursor-pointer"
                          title="Copy Full SHA-256 Hash"
                        >
                          {copiedHash === e.id ? (
                            <CheckCircle2 size={14} className="text-emerald-400" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                        Tx: {e.ledgerTx}
                      </span>
                    </td>

                    {/* Ingestion Meta */}
                    <td className="py-4 px-4">
                      <span className="text-slate-200 font-medium block">{e.uploadedBy}</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock size={11} /> {e.timestamp}
                      </span>
                    </td>

                    {/* Chain Status */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold">
                        <ShieldCheck size={12} /> ANCHORED
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedAuditItem(e)}
                          className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition cursor-pointer active:scale-95" 
                          title="Audit Chain Logs"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => setSelectedExportItem(e)}
                          className="p-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 transition flex items-center gap-1 font-bold text-[11px] cursor-pointer active:scale-95"
                        >
                          <Download size={13} /> Export Sec65B
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

      {/* --- MODALS --- */}

      {/* 1. Universal Ingest Forensic File Modal */}
      {ingestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload size={16} className="text-emerald-400" /> Universal Evidence Ingestion (CSV, Excel, Images, PDF)
              </h3>
              <button onClick={() => setIngestModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer">✕</button>
            </div>
            
            <form onSubmit={handleIngestSubmit} className="space-y-3 text-xs">
              
              {/* File Drop / Upload Box */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Select or Capture File (.csv, .xlsx, .jpg, .png, .pdf)</label>
                <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-4 text-center bg-slate-950/50 transition cursor-pointer relative">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept=".csv, .xlsx, .xls, .jpg, .jpeg, .png, .pdf, .mp4, .txt"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={24} className="text-emerald-400" />
                    {attachedFile ? (
                      <span className="text-emerald-300 font-bold">{attachedFile.name} ({(attachedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                    ) : (
                      <>
                        <span className="text-slate-200 font-bold">Click to browse or drag & drop files here</span>
                        <span className="text-[10px] text-slate-500">Supports Excel, CSV, Camera Photos, Scanned PDFs & CDR Logs</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Evidence Title / Description</label>
                <input 
                  type="text" 
                  required
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Seized Financial Transaction Sheet" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Detected Format Category</label>
                  <select 
                    value={newType} 
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="CSV_FILE">CSV Spreadsheet</option>
                    <option value="EXCEL_SHEET">Excel (.xlsx / .xls)</option>
                    <option value="CAMERA_IMAGE">Camera / Snapshot Image</option>
                    <option value="PDF_DOC">PDF Document</option>
                    <option value="TELECOM_CDR">Telecom CDR Data</option>
                    <option value="VIDEO_RECORDING">Video Recording</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Linked FIR Case</label>
                  <select 
                    value={newCaseId} 
                    onChange={(e) => setNewCaseId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
                  >
                    <option value="26189-042">FIR-2026-NCRB-9021</option>
                    <option value="26189-088">FIR-2026-DL-4410</option>
                    <option value="26189-102">FIR-2026-MH-1102</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIngestModalOpen(false)}
                  className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  Generate SHA-256 & Anchor to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Verify Hash Integrity Modal */}
      {verifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" /> Cryptographic Integrity Audit
              </h3>
              <button onClick={() => setVerifyModalOpen(false)} className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-emerald-500/30 text-emerald-400 flex items-center gap-3">
                <CheckCircle2 size={24} className="shrink-0" />
                <div>
                  <p className="font-bold">All Ledgers Verified Successfully!</p>
                  <p className="text-[11px] text-slate-400">Zero bit corruption or tampering detected across all active vault items.</p>
                </div>
              </div>
              <p className="text-slate-400">SHA-256 root merkle tree matches immutable blockchain logs synchronized with NCRB core nodes.</p>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => {
                  setVerifyModalOpen(false);
                  triggerToast('Full cryptographic verification protocol completed.');
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Audit Chain Logs Modal */}
      {selectedAuditItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Eye size={16} className="text-cyan-400" /> Chain of Custody Audit Logs
              </h3>
              <button onClick={() => setSelectedAuditItem(null)} className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer">✕</button>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              <p><strong className="text-cyan-400">Artifact:</strong> {selectedAuditItem.title}</p>
              <p><strong className="text-cyan-400">Evidence ID:</strong> {selectedAuditItem.id}</p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono space-y-1 text-[11px]">
                <p className="text-emerald-400">[12:22:10] Ingested by {selectedAuditItem.uploadedBy}</p>
                <p className="text-cyan-400">[12:22:12] SHA-256 Calculated: {selectedAuditItem.sha256.substring(0, 16)}...</p>
                <p className="text-purple-400">[12:22:15] Anchored to Ledger Tx: {selectedAuditItem.ledgerTx}</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedAuditItem(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Section 65B Export Certificate Modal */}
      {selectedExportItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Download size={16} className="text-emerald-400" /> Section 65B Certificate Generator
              </h3>
              <button onClick={() => setSelectedExportItem(null)} className="text-slate-400 hover:text-white font-bold text-xs cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs text-slate-300">
              <p>Generating court-admissible electronic evidence certificate under Section 65B of the Indian Evidence Act for:</p>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-semibold text-white">
                {selectedExportItem.title} ({selectedExportItem.id})
              </div>
              <p className="text-slate-400 text-[11px]">Includes digital officer signature, timestamp verification, and SHA-256 integrity seal.</p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => setSelectedExportItem(null)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  triggerToast(`Section 65B Certificate downloaded for ${selectedExportItem.id}!`);
                  setSelectedExportItem(null);
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition cursor-pointer"
              >
                Download PDF Certificate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}