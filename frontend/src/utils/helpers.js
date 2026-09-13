/**
 * Generic Helper Utilities
 * Array grouping, debouncing, file size formatting, and deep cloning.
 */

/**
 * Debounce utility function for search and filter inputs
 * @param {Function} func
 * @param {number} waitMs
 */
export const debounce = (func, waitMs = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, waitMs);
  };
};

/**
 * Group list of objects by key
 * @param {Array} array
 * @param {string} key
 */
export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  return array.reduce((result, item) => {
    const groupKey = item[key] || 'OTHER';
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {});
};

/**
 * Convert bytes to human-readable file size strings
 * @param {number} bytes
 * @returns {string} e.g. "42.8 MB"
 */
export const formatBytes = (bytes) => {
  if (bytes === 0 || !bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Safely download blob content as a file
 * @param {Blob|string} content
 * @param {string} fileName
 * @param {string} [mimeType='text/plain']
 */
export const downloadFile = (content, fileName, mimeType = 'text/plain') => {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
};

/**
 * Deep clone serializable JSON objects
 * @param {T} obj
 * @returns {T}
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
};