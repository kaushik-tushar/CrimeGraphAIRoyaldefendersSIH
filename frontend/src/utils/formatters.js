/**
 * Tactical Data Formatters
 * Formatting utilities for timestamps, currency, phone numbers, hashes, and risk indicators.
 */

/**
 * Format ISO timestamp into Indian Standard Time (IST) tactical display
 * @param {string|Date} date
 * @returns {string} e.g. "09 Sep 2026, 23:14 IST"
 */
export const formatTacticalDate = (date) => {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return String(date);

  const day = String(d.getDate()).padStart(2, '0');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day} ${month} ${year}, ${hours}:${minutes} IST`;
};

/**
 * Format relative time (e.g., "5 mins ago", "2 hours ago")
 * @param {string|Date} date
 * @returns {string}
 */
export const formatTimeAgo = (date) => {
  if (!date) return '';
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

/**
 * Format currency to Indian Rupee (INR) format
 * @param {number|string} amount
 * @returns {string} e.g. "₹3,42,80,000"
 */
export const formatCurrencyINR = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
  if (isNaN(num)) return '₹0';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(num);
};

/**
 * Redact target phone numbers for secure multi-agency sharing
 * @param {string} phone e.g. "+91 9821012345"
 * @returns {string} e.g. "+91 98210-XXXXX"
 */
export const maskPhoneNumber = (phone) => {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\s+/g, '');
  if (cleaned.length < 10) return phone;
  return `${cleaned.slice(0, Math.max(0, cleaned.length - 5))}-XXXXX`;
};

/**
 * Truncate SHA-256 or cryptographic hashes for UI tables
 * @param {string} hash
 * @param {number} [chars=8]
 * @returns {string} e.g. "e3b0c442...7852b855"
 */
export const truncateHash = (hash, chars = 8) => {
  if (!hash) return '';
  if (hash.length <= chars * 2) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
};

/**
 * Map numerical risk score (0-100) to tactical severity configuration
 * @param {number} score
 * @returns {{ label: string, colorClass: string, badgeBg: string }}
 */
export const getRiskSeverityConfig = (score) => {
  const num = Number(score) || 0;
  if (num >= 85) {
    return { label: 'CRITICAL', colorClass: 'text-red-500', badgeBg: 'bg-red-950/80 text-red-400 border-red-800' };
  }
  if (num >= 70) {
    return { label: 'HIGH', colorClass: 'text-amber-500', badgeBg: 'bg-amber-950/80 text-amber-400 border-amber-800' };
  }
  if (num >= 40) {
    return { label: 'MEDIUM', colorClass: 'text-yellow-500', badgeBg: 'bg-yellow-950/80 text-yellow-400 border-yellow-800' };
  }
  return { label: 'LOW', colorClass: 'text-emerald-500', badgeBg: 'bg-emerald-950/80 text-emerald-400 border-emerald-800' };
};