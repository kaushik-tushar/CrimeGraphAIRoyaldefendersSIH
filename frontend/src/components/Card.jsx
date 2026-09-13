import React from 'react';
import { Shield, ChevronRight, MoreVertical } from 'lucide-react';

/**
 * Modular Card Component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card body content
 * @param {string} [props.title] - Card header title
 * @param {string} [props.subtitle] - Card header subtitle or description
 * @param {React.ReactNode} [props.icon] - Icon displayed in the header
 * @param {React.ReactNode} [props.badge] - Custom badge/status rendered in top right
 * @param {React.ReactNode} [props.footer] - Custom footer element
 * @param {string} [props.borderAccent] - Optional accent color ('red' | 'amber' | 'cyan' | 'purple' | 'emerald')
 * @param {string} [props.className] - Additional Tailwind CSS classes
 * @param {Function} [props.onClick] - Click handler for interactive cards
 */
export default function Card({
  children,
  title,
  subtitle,
  icon,
  badge,
  footer,
  borderAccent,
  className = '',
  onClick
}) {
  // Border accent configuration for threat levels / case statuses
  const getAccentClass = () => {
    switch (borderAccent) {
      case 'red':
        return 'border-l-4 border-l-red-500';
      case 'amber':
        return 'border-l-4 border-l-amber-500';
      case 'cyan':
        return 'border-l-4 border-l-cyan-500';
      case 'purple':
        return 'border-l-4 border-l-purple-500';
      case 'emerald':
        return 'border-l-4 border-l-emerald-500';
      default:
        return '';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all duration-200 ${getAccentClass()} ${
        onClick ? 'cursor-pointer hover:border-slate-700/90 hover:bg-slate-900' : ''
      } ${className}`}
    >
      {/* Card Header (Rendered if title, subtitle, or icon exists) */}
      {(title || subtitle || icon || badge) && (
        <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-3.5 mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-cyan-400 shrink-0">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h3 className="text-sm font-bold text-white tracking-tight leading-snug">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {badge && <div className="shrink-0">{badge}</div>}
        </div>
      )}

      {/* Main Content Area */}
      <div className="space-y-3">{children}</div>

      {/* Card Footer */}
      {footer && (
        <div className="pt-3.5 mt-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
}