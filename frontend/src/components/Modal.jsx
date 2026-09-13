import React, { useEffect } from 'react';
import { X, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';

/**
 * Tactical Modal Dialog Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of the modal
 * @param {Function} props.onClose - Callback function triggered when closing the modal
 * @param {string} [props.title] - Modal header title
 * @param {string} [props.subtitle] - Modal header subtitle or context text
 * @param {React.ReactNode} [props.icon] - Header icon element
 * @param {React.ReactNode} props.children - Modal body content
 * @param {React.ReactNode} [props.footer] - Optional custom footer actions
 * @param {string} [props.maxWidth="max-w-lg"] - Tailwind max-width class ('max-w-md' | 'max-w-lg' | 'max-w-2xl' | 'max-w-4xl')
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  maxWidth = 'max-w-lg'
}) {
  // Prevent background scrolling when modal is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      
      {/* Darkened Backdrop with Glassmorphism */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Main Modal Dialog Box */}
      <div
        className={`relative w-full ${maxWidth} bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl z-10 overflow-hidden transform transition-all animate-scale-up space-y-0`}
        role="dialog"
        aria-modal="true"
      >
        
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-800/80 bg-slate-950/60">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400 shrink-0">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5 leading-normal">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition cursor-pointer shrink-0"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-4 text-xs text-slate-300 font-sans">
          {children}
        </div>

        {/* Modal Footer (If Provided) */}
        {footer && (
          <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-end gap-2 text-xs">
            {footer}
          </div>
        )}

      </div>

    </div>
  );
}