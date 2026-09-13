import { api } from './api';

/**
 * Digital Forensic Evidence & Cryptographic Chain-of-Custody Service
 * Manages evidence records, SHA-256 checksum validations, and custody logs.
 */

const MOCK_EVIDENCE_STORE = [
  {
    id: 'EVD-101',
    fileName: 'tower_dump_sector_62_noida.csv',
    fileSize: '42.8 MB',
    type: 'CDR_TOWER_DUMP',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    collectedBy: 'Inspector R. S. Verma',
    timestamp: '2026-09-08 23:14:00 IST',
    caseId: '26189-042',
    firNo: 'FIR-2026-NCRB-9021',
    integrityStatus: 'VERIFIED',
    custodyChain: [
      { officer: 'Inspector R. S. Verma', action: 'Ingested into Cryptographic Vault', date: '2026-09-08 23:14:00 IST' },
      { officer: 'Sub-Inspector M. Sharma', action: 'Exported for CDR Analysis', date: '2026-09-09 01:10:00 IST' }
    ]
  },
  {
    id: 'EVD-102',
    fileName: 'bank_statement_axis_9041.pdf',
    fileSize: '3.1 MB',
    type: 'FINANCIAL_RECORD',
    sha256Hash: '8f4e2a1b9c3d5e7f6a8b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
    collectedBy: 'Sub-Inspector M. Sharma',
    timestamp: '2026-09-09 01:20:00 IST',
    caseId: '26189-088',
    firNo: 'FIR-2026-DL-4410',
    integrityStatus: 'VERIFIED',
    custodyChain: [
      { officer: 'Sub-Inspector M. Sharma', action: 'Ingested into Ledger', date: '2026-09-09 01:20:00 IST' }
    ]
  }
];

export const evidenceService = {
  /**
   * Fetch digital evidence items linked to a case or global registry
   * @param {Object} [params] - { caseId, type }
   */
  async getEvidence(params = {}) {
    try {
      // Production API route:
      // return await api.get(`/evidence?${new URLSearchParams(params)}`);

      await new Promise((resolve) => setTimeout(resolve, 300));
      let results = [...MOCK_EVIDENCE_STORE];

      if (params.caseId) {
        results = results.filter((e) => e.caseId === params.caseId);
      }
      if (params.type) {
        results = results.filter((e) => e.type === params.type);
      }

      return { success: true, evidence: results, total: results.length };
    } catch (error) {
      console.error('Failed to fetch evidence files:', error);
      return { success: false, evidence: [], error: error.message };
    }
  },

  /**
   * Perform SHA-256 cryptographic verification check against master ledger
   * @param {string} evidenceId
   */
  async verifyChecksum(evidenceId) {
    try {
      // Production API route:
      // return await api.post(`/evidence/${evidenceId}/verify`);

      await new Promise((resolve) => setTimeout(resolve, 600));
      const record = MOCK_EVIDENCE_STORE.find((e) => e.id === evidenceId);

      if (!record) {
        throw new Error('Evidence file not found.');
      }

      return {
        success: true,
        evidenceId,
        sha256Hash: record.sha256Hash,
        integrityStatus: 'VERIFIED',
        verifiedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Integrity check failed for ${evidenceId}:`, error);
      throw error;
    }
  },

  /**
   * Log new evidence intake and append to cryptographic ledger
   * @param {Object} evidenceData
   */
  async addEvidence(evidenceData) {
    try {
      // Production API route:
      // return await api.post('/evidence', evidenceData);

      await new Promise((resolve) => setTimeout(resolve, 400));
      const newEntry = {
        id: `EVD-${Math.floor(100 + Math.random() * 900)}`,
        timestamp: new Date().toISOString(),
        integrityStatus: 'VERIFIED',
        custodyChain: [
          {
            officer: evidenceData.collectedBy || 'Current Officer',
            action: 'Initial Digital Artifact Ingestion',
            date: new Date().toISOString()
          }
        ],
        ...evidenceData
      };

      MOCK_EVIDENCE_STORE.unshift(newEntry);
      return { success: true, evidence: newEntry };
    } catch (error) {
      console.error('Failed to add evidence record:', error);
      throw error;
    }
  }
};

export default evidenceService;