/**
 * Field Validation Utilities
 * Validates Indian Phone Numbers, IMEIs, Bank IFSCs, FIR Numbers, and Hashes.
 */

/**
 * Validate Indian Phone Numbers (10 digits, option for +91 / 0 prefix)
 * @param {string} phone
 * @returns {boolean}
 */
export const isValidIndianPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const regex = /^(?:\+91|0)?[6-9]\d{9}$/;
  return regex.test(cleaned);
};

/**
 * Validate 15-digit IMEI number using Luhn Checksum algorithm
 * @param {string} imei
 * @returns {boolean}
 */
export const isValidIMEI = (imei) => {
  if (!imei) return false;
  const cleaned = imei.replace(/[\s\-]/g, '');
  if (!/^\d{15}$/.test(cleaned)) return false;

  let sum = 0;
  for (let i = 0; i < 15; i++) {
    let digit = parseInt(cleaned.charAt(i), 10);
    if (i % 2 !== 0) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return sum % 10 === 0;
};

/**
 * Validate Indian Bank IFSC Code (4 alpha, 0, 6 alphanumeric)
 * @param {string} ifsc
 * @returns {boolean}
 */
export const isValidIFSC = (ifsc) => {
  if (!ifsc) return false;
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
  return regex.test(ifsc.trim());
};

/**
 * Validate Indian FIR Registration Number format
 * @param {string} firNo
 * @returns {boolean}
 */
export const isValidFIRNumber = (firNo) => {
  if (!firNo) return false;
  // Format matching FIR-YYYY-STATE/DEPT-XXXX or similar patterns
  const regex = /^FIR-\d{4}-[A-Z0-9\-]+$/i;
  return regex.test(firNo.trim());
};

/**
 * Validate SHA-256 hash string (64 hexadecimal characters)
 * @param {string} hash
 * @returns {boolean}
 */
export const isValidSHA256 = (hash) => {
  if (!hash) return false;
  return /^[a-fA-F0-9]{64}$/.test(hash.trim());
};