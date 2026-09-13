import { api } from './api';
import { MOCK_KPI_STATS, MOCK_TIMELINE_EVENTS } from '../data/mockData';

/**
 * Tactical Intelligence & Analytics Service
 * Provides analytical metrics, timeline sequences, threat scoring, and KPI summaries.
 */

export const intelligenceService = {
  /**
   * Fetch high-level executive & operational KPI metrics
   */
  async getKpiStats() {
    try {
      // Production API route:
      // return await api.get('/intelligence/kpi');

      await new Promise((resolve) => setTimeout(resolve, 200));
      return { success: true, stats: MOCK_KPI_STATS };
    } catch (error) {
      console.error('Failed to fetch KPI stats:', error);
      return { success: false, stats: [], error: error.message };
    }
  },

  /**
   * Fetch chronological intelligence timeline events
   * @param {Object} [params] - Filters like { caseId, category, startDate, endDate }
   */
  async getTimelineEvents(params = {}) {
    try {
      // Production API route:
      // return await api.get(`/intelligence/timeline?${new URLSearchParams(params)}`);

      await new Promise((resolve) => setTimeout(resolve, 300));
      let events = [...MOCK_TIMELINE_EVENTS];

      if (params.category && params.category !== 'ALL') {
        events = events.filter((e) => e.category === params.category);
      }
      if (params.caseId) {
        events = events.filter((e) => e.caseId === params.caseId);
      }

      return { success: true, events, total: events.length };
    } catch (error) {
      console.error('Failed to fetch timeline events:', error);
      return { success: false, events: [], error: error.message };
    }
  },

  /**
   * Calculate threat risk matrix and suspect clustering scores
   * @param {string} caseId
   */
  async getThreatAssessment(caseId) {
    try {
      // Production API route:
      // return await api.get(`/intelligence/threat-assessment/${caseId}`);

      await new Promise((resolve) => setTimeout(resolve, 350));
      return {
        success: true,
        assessment: {
          caseId: caseId || '26189-042',
          overallRiskScore: 92,
          threatLevel: 'CRITICAL',
          primaryVector: 'CDR_BURST_SPOOFING',
          flaggedNodesCount: 14,
          estimatedFinancialLoss: '₹3,42,80,000',
          relevanceConfidence: '98.4%'
        }
      };
    } catch (error) {
      console.error(`Failed to fetch threat assessment for ${caseId}:`, error);
      return { success: false, error: error.message };
    }
  }
};

export default intelligenceService;