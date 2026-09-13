import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  ShieldAlert,
  ArrowRight,
  Eye,
  EyeOff,
  Building2,
  CheckCircle2,
  Fingerprint,
  Radio
} from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [badgeId, setBadgeId] = useState('NCRB-OFFICER-8021');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [step, setStep] = useState(1); // 1: Credentials, 2: 2FA Verification
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCredentialSubmit = (e) => {
    e.preventDefault();
    if (!badgeId || !password) {
      setErrorMsg('Please enter both Officer Badge ID and Password.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    // Simulate authentication check
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1000);
  };

  const handle2FASubmit = (e) => {
    e.preventDefault();
    if (!twoFactorCode || twoFactorCode.length < 6) {
      setErrorMsg('Please enter a valid 6-digit Security Authenticator token.');
      return;
    }
    setErrorMsg('');
    setIsLoading(true);

    // Simulate final token verification
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-6 font-sans relative overflow-hidden">
      
      {/* Background Decorative Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none"></div>

      {/* Top Banner Notice */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between border-b border-slate-800/80 pb-4 z-10">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400">
          <ShieldCheck size={18} />
          <span>GOVERNMENT OF INDIA • LAW ENFORCEMENT PORTAL</span>
        </div>
        <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-mono font-bold">
          RESTRICTED ACCESS
        </span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto z-10">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 backdrop-blur-md">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-3">
              <Building2 size={24} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Investigative Portal Login
            </h1>
            <p className="text-xs text-slate-400">
              National Crime Records Bureau & Central Law Enforcement Intelligence Mesh
            </p>
          </div>

          {/* Error Message Display */}
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: CREDENTIAL ENTRY */}
          {step === 1 && (
            <form onSubmit={handleCredentialSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Officer Badge ID / Service Number
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={badgeId}
                    onChange={(e) => setBadgeId(e.target.value)}
                    placeholder="e.g. NCRB-OFFICER-8021"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Portal Access Password
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 font-mono">
                    <Radio size={14} className="animate-spin" /> Verifying Credentials...
                  </span>
                ) : (
                  <>
                    Proceed to 2FA Step <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: 2FA VERIFICATION */}
          {step === 2 && (
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-xs text-cyan-300 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-cyan-400 shrink-0" />
                <span>Credentials Validated. Enter 6-digit TOTP key from your hardware token.</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Hardware Authenticator Token (2FA)
                </label>
                <div className="relative">
                  <Fingerprint size={16} className="absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 892014"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-center tracking-[0.5em] font-mono text-base font-bold text-cyan-400 focus:outline-none focus:border-cyan-500 transition"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-2/3 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2 font-mono">
                      <Radio size={14} className="animate-spin" /> Authenticating...
                    </span>
                  ) : (
                    <>
                      Authorize & Enter Portal <ShieldCheck size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Footer Security Notice */}
          <div className="pt-4 border-t border-slate-800/80 text-center text-[10px] text-slate-500 leading-relaxed">
            Unauthorized attempt to access this system is punishable under Information Technology Act, 2000 & IPC Sections. All login actions are recorded under immutable SHA-256 system log files.
          </div>

        </div>
      </div>

      {/* Bottom Copyright & Node Info */}
      <div className="w-full max-w-md mx-auto text-center text-[11px] font-mono text-slate-600 z-10">
        System Node ID: <span className="text-slate-400">DELHI-NCRB-NODE-04</span> • Encr: <span className="text-slate-400">AES-256-GCM</span>
      </div>

    </div>
  );
}