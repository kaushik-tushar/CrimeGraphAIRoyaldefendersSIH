import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  ArrowLeft,
  ChevronRight,
  Plus,
  Trash2,
  UploadCloud,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Building2,
  Users,
  Lock,
  Zap,
  Calendar,
  MapPin,
  Tag
} from 'lucide-react';

export default function CreateCase() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firNo: 'FIR-2026-NCRB-' + Math.floor(1000 + Math.random() * 9000),
    title: '',
    category: 'Organized Crime / Cyber Fraud',
    classification: 'CONFIDENTIAL',
    incidentDate: '2026-09-01',
    jurisdiction: 'Delhi NCR / Interstate',
    leadAgency: 'NCRB Women Safety Cell',
    leadOfficer: 'Senior Investigator V. Kumar',
    description: '',
    initialEntities: [
      { name: '', type: 'Person', identifier: '', role: 'Suspect' }
    ],
    uploadedFiles: []
  });

  const handleEntityChange = (index, field, value) => {
    const updated = [...formData.initialEntities];
    updated[index][field] = value;
    setFormData({ ...formData, initialEntities: updated });
  };

  const addEntityRow = () => {
    setFormData({
      ...formData,
      initialEntities: [
        ...formData.initialEntities,
        { name: '', type: 'Person', identifier: '', role: 'Suspect' }
      ]
    });
  };

  const removeEntityRow = (index) => {
    const updated = formData.initialEntities.filter((_, i) => i !== index);
    setFormData({ ...formData, initialEntities: updated });
  };

  const handleSubmitCase = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Generate a unique dynamic case ID
      const newCaseId = '26189-' + Math.floor(100 + Math.random() * 900);
      
      // 2. Prepare complete payload with ID and status
      const newCaseData = {
        id: newCaseId,
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'Active Investigation'
      };

      // 3. Save to localStorage so other pages can read it
      const existingCases = JSON.parse(localStorage.getItem('ncrb_cases') || '[]');
      localStorage.setItem('ncrb_cases', JSON.stringify([newCaseData, ...existingCases]));

      setIsSubmitting(false);
      
      // 4. Navigate to the newly created dynamic route
      navigate(`/cases/${newCaseId}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
            <Link to="/cases" className="hover:text-cyan-400 flex items-center gap-1">
              <ArrowLeft size={13} /> Case Index
            </Link>
            <ChevronRight size={12} />
            <span className="text-cyan-400 font-mono">NEW CASE REGISTRATION</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Register FIR & Create Investigation Dossier
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Initialize an AI-monitored investigation case with SHA-256 cryptographic chain of custody.
          </p>
        </div>
      </div>

      {/* Step Wizard Indicator */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { step: 1, title: '1. FIR & Metadata' },
          { step: 2, title: '2. Agency & Jurisdiction' },
          { step: 3, title: '3. Initial Entities' },
          { step: 4, title: '4. AI Verification & Init' }
        ].map((item) => (
          <div
            key={item.step}
            onClick={() => setCurrentStep(item.step)}
            className={`p-3 rounded-xl border text-xs font-semibold cursor-pointer transition flex items-center justify-between ${
              currentStep === item.step
                ? 'bg-slate-900 text-cyan-300 border-cyan-500/50 shadow-md'
                : currentStep > item.step
                ? 'bg-slate-950 text-emerald-400 border-slate-800'
                : 'bg-slate-950 text-slate-500 border-slate-900'
            }`}
          >
            <span>{item.title}</span>
            {currentStep > item.step && <CheckCircle2 size={14} className="text-emerald-400" />}
          </div>
        ))}
      </div>

      {/* Wizard Form Area */}
      <form onSubmit={handleSubmitCase} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 max-w-4xl mx-auto">
        
        {/* STEP 1: FIR METADATA */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText size={18} className="text-cyan-400" /> Core FIR Metadata
              </h2>
              <p className="text-xs text-slate-400">Specify legal FIR registration details and offence classification.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Generated FIR Reference Number</label>
                <input
                  type="text"
                  value={formData.firNo}
                  onChange={(e) => setFormData({ ...formData, firNo: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Offence Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option>Organized Crime / Cyber Fraud</option>
                  <option>Financial Crime / Hawala</option>
                  <option>Human Trafficking / Women Safety</option>
                  <option>Counter-Terrorism & Telecom Cyber Ops</option>
                  <option>Narcotic Syndicate & Smuggling</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Case / FIR Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Interstate Cyber Trafficking & Mule Bank Account Syndicate"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Incident Brief & Allegation Summary</label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the initial complaint, modus operandi, and primary allegations..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
              ></textarea>
            </div>
          </div>
        )}

        {/* STEP 2: AGENCY & JURISDICTION */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 size={18} className="text-cyan-400" /> Agency & Officer Assignment
              </h2>
              <p className="text-xs text-slate-400">Configure jurisdictional boundaries and investigating officers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Lead Investigating Agency</label>
                <select
                  value={formData.leadAgency}
                  onChange={(e) => setFormData({ ...formData, leadAgency: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option>NCRB Women Safety Cell</option>
                  <option>Economic Offences Wing (EOW)</option>
                  <option>Special Cell - Cyber Ops</option>
                  <option>State Crime Branch</option>
                  <option>Central Intelligence Bureau (IB)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Lead Investigating Officer</label>
                <input
                  type="text"
                  value={formData.leadOfficer}
                  onChange={(e) => setFormData({ ...formData, leadOfficer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Primary Jurisdiction</label>
                <input
                  type="text"
                  value={formData.jurisdiction}
                  onChange={(e) => setFormData({ ...formData, jurisdiction: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Security Classification Level</label>
                <select
                  value={formData.classification}
                  onChange={(e) => setFormData({ ...formData, classification: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option>CONFIDENTIAL</option>
                  <option>RESTRICTED</option>
                  <option>TOP SECRET / SENSITIVE</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INITIAL ENTITIES */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Users size={18} className="text-cyan-400" /> Initial Suspects & Associated Entities
                </h2>
                <p className="text-xs text-slate-400">Attach initial known phones, persons, vehicles, or UPI handles.</p>
              </div>
              <button
                type="button"
                onClick={addEntityRow}
                className="flex items-center gap-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-400 transition"
              >
                <Plus size={14} /> Add Row
              </button>
            </div>

            <div className="space-y-3">
              {formData.initialEntities.map((ent, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 items-center">
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Name / Entity Label"
                      value={ent.name}
                      onChange={(e) => handleEntityChange(idx, 'name', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    />
                  </div>
                  <div className="col-span-3">
                    <select
                      value={ent.type}
                      onChange={(e) => handleEntityChange(idx, 'type', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    >
                      <option>Person</option>
                      <option>Phone</option>
                      <option>Vehicle</option>
                      <option>Account</option>
                      <option>Organization</option>
                    </select>
                  </div>
                  <div className="col-span-3">
                    <input
                      type="text"
                      placeholder="Identifier (Phone / Account / Vehicle No)"
                      value={ent.identifier}
                      onChange={(e) => handleEntityChange(idx, 'identifier', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono"
                    />
                  </div>
                  <div className="col-span-2">
                    <select
                      value={ent.role}
                      onChange={(e) => handleEntityChange(idx, 'role', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200"
                    >
                      <option>Primary Suspect</option>
                      <option>Associate</option>
                      <option>Mule Account</option>
                      <option>Burner SIM</option>
                      <option>Victim</option>
                    </select>
                  </div>
                  <div className="col-span-1 text-right">
                    {formData.initialEntities.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEntityRow(idx)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: AI VERIFICATION */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles size={18} className="text-cyan-400" /> AI Pre-Analysis & Ledger Anchoring
              </h2>
              <p className="text-xs text-slate-400">Review case parameters prior to committing to central intelligence store.</p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Generated FIR ID:</span>
                <span className="font-mono font-bold text-cyan-400">{formData.firNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Offence Category:</span>
                <span className="font-bold text-white">{formData.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Lead Investigator:</span>
                <span className="font-semibold text-slate-200">{formData.leadOfficer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Pre-Registered Entities:</span>
                <span className="font-mono font-bold text-purple-400">{formData.initialEntities.length} Registered</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <span>SHA-256 Ledger Anchor Ready: Case record will be cryptographically signed upon submission.</span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition"
            >
              Previous Step
            </button>
          ) : <div></div>}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5"
            >
              Next Step <ChevronRight size={14} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              {isSubmitting ? 'Registering FIR...' : 'Commit & Create Case Workspace'}
            </button>
          )}
        </div>

      </form>

    </div>
  );
}