import { api } from './api';

/**
 * Tactical Entity Intelligence Service
 * Handles lookups, extraction, and watchlist status for suspects, phone numbers,
 * IMEIs, bank accounts, and tower locations.
 */

const MOCK_ENTITIES_DATA = [
  {
    id: 'ENT-901',
    name: '+91 98210-XXXXX',
    type: 'PHONE_NUMBER',
    riskScore: 92,
    associatedCase: '26189-042',
    operator: 'Airtel',
    circle: 'Delhi NCR',
    status: 'UNDER_SURVEILLANCE',
    lastSeen: '2026-09-09 02:14 IST'
  },
  {
    id: 'ENT-902',
    name: 'IMEI 869402049182391',
    type: 'DEVICE_IMEI',
    riskScore: 85,
    associatedCase: '26189-042',
    deviceModel: 'OnePlus Nord CE 3',
    status: 'FLAGGED',
    lastSeen: '2026-09-08 23:40 IST'
  },
  {
    id: 'ENT-903',
    name: 'Axis Bank Acct #9041',
    type: 'BANK_ACCOUNT',
    riskScore: 88,
    associatedCase: '26189-088',
    branch: 'Connaught Place',
    status: 'FROZEN',
    lastSeen: '2026-09-09 01:58 IST'
  },
  {
    id: 'ENT-904',
    name: 'Rajesh Kumar (Alias: Raju)',
    type: 'SUSPECT',
    riskScore: 95,
    associatedCase: '26189-042',
    status: 'ABSCONDING',
    lastSeen: '2026-09-07 14:20 IST'
  }
];

export const entityService = {
  /**
   * Fetch entities with filtering by case ID, entity type, or search term
   * @param {Object} [params] - { caseId, type, query }
   */
  async getEntities(params = {}) {
    try {
      // Production API route:
      // return await api.get(`/entities?${new URLSearchParams(params)}`);

      await new Promise((resolve) => setTimeout(resolve, 300));
      let results = [...MOCK_ENTITIES_DATA];

      if (params.caseId) {
        results = results.filter((e) => e.associatedCase === params.caseId);
      }
      if (params.type && params.type !== 'ALL') {
        results = results.filter((e) => e.type === params.type);
      }
      if (params.query) {
        const q = params.query.toLowerCase();
        results = results.filter(
          (e) =>
            e.name.toLowerCase().includes(q) ||
            e.id.toLowerCase().includes(q) ||
            (e.deviceModel && e.deviceModel.toLowerCase().includes(q)) ||
            (e.branch && e.branch.toLowerCase().includes(q))
        );
      }

      return { success: true, entities: results, total: results.length };
    } catch (error) {
      console.error('Failed to fetch entities:', error);
      return { success: false, entities: [], error: error.message };
    }
  },

  /**
   * Fetch entity deep profile details
   * @param {string} entityId
   */
  async getEntityById(entityId) {
    try {
      // Production API route:
      // return await api.get(`/entities/${entityId}`);

      await new Promise((resolve) => setTimeout(resolve, 200));
      const entity = MOCK_ENTITIES_DATA.find((e) => e.id === entityId);

      if (!entity) {
        throw new Error(`Entity ${entityId} not found.`);
      }

      return { success: true, entity };
    } catch (error) {
      console.error(`Failed to fetch entity ${entityId}:`, error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update surveillance status or add flags to an entity
   * @param {string} entityId
   * @param {Object} updates
   */
  async updateEntityStatus(entityId, updates) {
    try {
      // Production API route:
      // return await api.patch(`/entities/${entityId}`, updates);

      await new Promise((resolve) => setTimeout(resolve, 250));
      const index = MOCK_ENTITIES_DATA.findIndex((e) => e.id === entityId);

      if (index !== -1) {
        MOCK_ENTITIES_DATA[index] = { ...MOCK_ENTITIES_DATA[index], ...updates };
        return { success: true, entity: MOCK_ENTITIES_DATA[index] };
      }

      throw new Error('Entity not found.');
    } catch (error) {
      console.error(`Failed to update entity ${entityId}:`, error);
      throw error;
    }
  }
};

export default entityService;