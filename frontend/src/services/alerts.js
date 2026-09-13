import { api } from './api';
import { MOCK_THREAT_FEED } from '../data/mockdata';

/**
 * Tactical Threat Alert Service
 * Manages real-time alert feeds, notification subscriptions, and severity filtering.
 */

export const alertService = {
  /**
   * Fetch recent tactical alerts for a given case or global feed
   * @param {Object} [params] - Filter options { caseId, severity, limit }
   */
  async getAlerts(params = {}) {
    try {
      // Production API route:
      // return await api.get(`/alerts?${new URLSearchParams(params)}`);

      // Fallback/Simulated response using mock dataset
      await new Promise((resolve) => setTimeout(resolve, 300));
      let filtered = [...MOCK_THREAT_FEED];

      if (params.caseId) {
        filtered = filtered.filter((a) => a.caseId === params.caseId);
      }
      if (params.severity) {
        filtered = filtered.filter((a) => a.severity === params.severity);
      }
      if (params.limit) {
        filtered = filtered.slice(0, params.limit);
      }

      return { success: true, alerts: filtered, total: filtered.length };
    } catch (error) {
      console.error('Failed to fetch tactical alerts:', error);
      return { success: false, alerts: [], error: error.message };
    }
  },

  /**
   * Acknowledge or dismiss a tactical alert
   * @param {string} alertId
   */
  async acknowledgeAlert(alertId) {
    try {
      // Production API route:
      // return await api.post(`/alerts/${alertId}/acknowledge`);
      return { success: true, alertId, status: 'ACKNOWLEDGED' };
    } catch (error) {
      console.error('Failed to acknowledge alert:', error);
      throw error;
    }
  },

  /**
   * Subscribe to real-time WebSockets alert stream
   * @param {Function} onNewAlert - Callback function triggered on incoming alert packet
   * @returns {Function} Unsubscribe cleanup function
   */
  subscribeToLiveAlerts(onNewAlert) {
    const interval = setInterval(() => {
      const liveEvent = {
        id: `ALT-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: 'Real-time CDR Tower Ping Match',
        type: 'CDR',
        severity: Math.random() > 0.5 ? 'CRITICAL' : 'HIGH',
        timestamp: 'Just now • ' + new Date().toLocaleTimeString('en-IN') + ' IST',
        description: 'Target SIM registered active ping on Sector 62 Cell Tower.',
        location: 'Sector 62 Tower Dump Node, Noida',
        caseId: '26189-042',
        firNo: 'FIR-2026-NCRB-9021'
      };

      if (typeof onNewAlert === 'function') {
        onNewAlert(liveEvent);
      }
    }, 15000);

    return () => clearInterval(interval);
  }
};

export default alertService;