import { api } from './api';
import { MOCK_CASES } from '../data/mockData';

/**
 * Tactical Case File & FIR Management Service
 * Handles CRUD operations, case lookups, and evidence associations.
 */

export const caseService = {
  /**
   * Fetch list of active cases with optional query filters
   * @param {Object} [params] - Filters like { status, severity, query }
   */
  async getCases(params = {}) {
    try {
      // Production API route:
      // return await api.get(`/cases?${new URLSearchParams(params)}`);

      await new Promise((resolve) => setTimeout(resolve, 300));
      let results = [...MOCK_CASES];

      if (params.status) {
        results = results.filter((c) => c.status === params.status);
      }
      if (params.severity) {
        results = results.filter((c) => c.severity === params.severity);
      }
      if (params.query) {
        const q = params.query.toLowerCase();
        results = results.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.firNo.toLowerCase().includes(q) ||
            c.id.toLowerCase().includes(q)
        );
      }

      return { success: true, cases: results, total: results.length };
    } catch (error) {
      console.error('Failed to fetch cases:', error);
      return { success: false, cases: [], error: error.message };
    }
  },

  /**
   * Fetch specific case details by Case ID or FIR number
   * @param {string} caseId
   */
  async getCaseById(caseId) {
    try {
      // Production API route:
      // return await api.get(`/cases/${caseId}`);

      await new Promise((resolve) => setTimeout(resolve, 200));
      const caseRecord = MOCK_CASES.find(
        (c) => c.id === caseId || c.firNo === caseId
      );

      if (!caseRecord) {
        throw new Error(`Case file ${caseId} not found.`);
      }

      return { success: true, caseData: caseRecord };
    } catch (error) {
      console.error(`Failed to fetch case ${caseId}:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Register a new FIR / Case record
   * @param {Object} casePayload
   */
  async createCase(casePayload) {
    try {
      // Production API route:
      // return await api.post('/cases', casePayload);

      await new Promise((resolve) => setTimeout(resolve, 500));
      const newCase = {
        id: `26189-${Math.floor(100 + Math.random() * 900)}`,
        status: 'ACTIVE',
        suspectCount: 0,
        evidenceFilesCount: 0,
        lastUpdated: new Date().toISOString(),
        ...casePayload
      };

      MOCK_CASES.unshift(newCase);
      return { success: true, caseData: newCase };
    } catch (error) {
      console.error('Failed to create case:', error);
      throw error;
    }
  },

  /**
   * Update status or details of an existing case
   * @param {string} caseId
   * @param {Object} updates
   */
  async updateCase(caseId, updates) {
    try {
      // Production API route:
      // return await api.patch(`/cases/${caseId}`, updates);

      await new Promise((resolve) => setTimeout(resolve, 300));
      const index = MOCK_CASES.findIndex((c) => c.id === caseId);

      if (index === -1) {
        throw new Error('Case not found');
      }

      MOCK_CASES[index] = {
        ...MOCK_CASES[index],
        ...updates,
        lastUpdated: new Date().toISOString()
      };

      return { success: true, caseData: MOCK_CASES[index] };
    } catch (error) {
      console.error(`Failed to update case ${caseId}:`, error);
      throw error;
    }
  }
};

export default caseService;