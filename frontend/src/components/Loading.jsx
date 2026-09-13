import React from 'react';
import { Shield, Radio, Cpu, Lock } from 'lucide-react';

/**
 * Loading Spinner & Data Ingestion Overlay Component
 * @param {Object} props
 * @param {string} [props.message="Decrypting Intelligence Feeds..."] - Primary loading text
 * @param {string} [props.subMessage="Verifying SHA-256 Evidence Chain & Node Graph"] - Secondary status text
 * @param {boolean} [props.fullScreen=false] - Whether to render as full viewport modal/overlay
 * @param {string} [props.size="md"] - Icon size modifier ('sm' | 'md' | 'lg')
 */
export default function Loading({
  message = 'Decrypting Intelligence Feeds...',
  subMessage = 'Verifying SHA-256 Evidence Chain & Node Graph',
  fullScreen = false,
  size = 'md'
}) {
  // Size mappings
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { container: 'p-4', icon: 20, ring: 'w-10 h-10', text: 'text-xs' };
      case 'lg':
        return { container: 'p-12', icon: 36, ring: 'w-20 h-20', text: 'text-base' };
      default:
        return { container: 'p-8', icon: 28, ring: 'w-16 h-16', text: 'text-sm' };
    }
  };

  const currentSize = getSizeClasses();

  const loadingContent = (
    <div className={`flex flex-col items-center justify-center text-center ${currentSize.container} space-y-4`}>
      
      {/* Tactical Radar / Ingestion Animated Ring */}
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Aura */}
        <div className={`${currentSize.ring} rounded-full bg-cyan-500/10 animate-ping absolute inset-0`} />
        
        {/* Spinning Tactical Grid Ring */}
        <div className={`${currentSize.ring} rounded-full border-2 border-slate-800 border-t-cyan-400 border-r-cyan-500 animate-spin`} />
        
        {/* Center Shield Icon */}
        <div className="absolute text-cyan-400">
          <Shield size={currentSize.icon} className="animate-pulse" />
        </div>
      </div>

      {/* Text Feedback */}
      <div className="space-y-1 max-w-xs">
        <h3 className={`font-mono font-bold text-slate-100 tracking-wide uppercase ${currentSize.text}`}>
          {message}
        </h3>
        {subMessage && (
          <p className="text-[11px] font-mono text-slate-400 flex items-center justify-center gap-1.5">
            <Radio size={12} className="text-cyan-400 animate-pulse" />
            <span>{subMessage}</span>
          </p>
        )}
      </div>

      {/* Tactical Status Line */}
      <div className="flex items-center gap-2 pt-1">
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
          Secured Channel • 256-bit AES
        </span>
      </div>

    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl max-w-sm w-full mx-4">
          {loadingContent}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center bg-slate-900/50 border border-slate-800/80 rounded-2xl my-4">
      {loadingContent}
    </div>
  );
}