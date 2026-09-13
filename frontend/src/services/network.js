import { api } from './api';

/**
 * Link Analysis & Network Graph Service
 * Handles network graph queries, node-edge relationships, call frequency weights, and entity link matrices.
 */

const MOCK_GRAPH_DATA = {
  nodes: [
    {
      id: 'node-1',
      label: 'Burner SIM (+91 98210-XXXXX)',
      type: 'PHONE',
      riskScore: 92,
      group: 1,
      details: { operator: 'Airtel', status: 'ACTIVE_SURVEILLANCE' }
    },
    {
      id: 'node-2',
      label: 'Kingpin (+91 97110-XXXXX)',
      type: 'SUSPECT',
      riskScore: 98,
      group: 1,
      details: { alias: 'Raju', status: 'ABSCONDING' }
    },
    {
      id: 'node-3',
      label: 'Axis Bank Acct #9041',
      type: 'BANK',
      riskScore: 88,
      group: 2,
      details: { branch: 'Connaught Place', balance: '₹45,00,000' }
    },
    {
      id: 'node-4',
      label: 'Tower Node #62 Noida',
      type: 'TOWER',
      riskScore: 50,
      group: 3,
      details: { azimuth: '120°', coordinates: '28.6273, 77.3725' }
    },
    {
      id: 'node-5',
      label: 'IMEI 869402049182391',
      type: 'IMEI',
      riskScore: 85,
      group: 1,
      details: { model: 'OnePlus Nord CE 3', simSwaps: 3 }
    }
  ],
  links: [
    {
      id: 'link-1-2',
      source: 'node-1',
      target: 'node-2',
      label: '14 Calls Burst',
      weight: 9,
      type: 'CDR_CALL'
    },
    {
      id: 'link-1-3',
      source: 'node-1',
      target: 'node-3',
      label: 'RTGS Mule Transfer',
      weight: 7,
      type: 'FINANCIAL'
    },
    {
      id: 'link-1-4',
      source: 'node-1',
      target: 'node-4',
      label: 'Sector 62 Ping',
      weight: 4,
      type: 'TOWER_PING'
    },
    {
      id: 'link-1-5',
      source: 'node-1',
      target: 'node-5',
      label: 'Hardware Binding',
      weight: 10,
      type: 'DEVICE_HARDWARE'
    }
  ]
};

export const networkService = {
  /**
   * Fetch link network nodes and relationships for graph visualization
   * @param {Object} [params] - { caseId, depth, minRiskScore }
   */
  async getNetworkGraph(params = {}) {
    try {
      // Production API route:
      // return await api.get(`/network/graph?${new URLSearchParams(params)}`);

      await new Promise((resolve) => setTimeout(resolve, 400));
      let data = { ...MOCK_GRAPH_DATA };

      if (params.minRiskScore) {
        const filteredNodes = data.nodes.filter((n) => n.riskScore >= params.minRiskScore);
        const validNodeIds = new Set(filteredNodes.map((n) => n.id));
        const filteredLinks = data.links.filter(
          (l) => validNodeIds.has(l.source) && validNodeIds.has(l.target)
        );
        data = { nodes: filteredNodes, links: filteredLinks };
      }

      return { success: true, graph: data };
    } catch (error) {
      console.error('Failed to fetch network graph:', error);
      return { success: false, graph: { nodes: [], links: [] }, error: error.message };
    }
  },

  /**
   * Query multi-degree node connection paths between two entities
   * @param {string} sourceNodeId
   * @param {string} targetNodeId
   */
  async findShortestPath(sourceNodeId, targetNodeId) {
    try {
      // Production API route:
      // return await api.get(`/network/shortest-path?source=${sourceNodeId}&target=${targetNodeId}`);

      await new Promise((resolve) => setTimeout(resolve, 300));
      return {
        success: true,
        path: ['node-1', 'node-5', 'node-2'],
        hops: 2,
        confidence: '96.2%'
      };
    } catch (error) {
      console.error('Failed to calculate network path:', error);
      throw error;
    }
  },

  /**
   * Expand node relationships dynamically on double click
   * @param {string} nodeId
   */
  async expandNode(nodeId) {
    try {
      // Production API route:
      // return await api.get(`/network/nodes/${nodeId}/expand`);

      await new Promise((resolve) => setTimeout(resolve, 250));
      const expandedNodes = [
        {
          id: `node-exp-${Math.floor(Math.random() * 1000)}`,
          label: '+91 97111-XXXXX (Secondary Mule)',
          type: 'PHONE',
          riskScore: 78,
          group: 2
        }
      ];

      return { success: true, newNodes: expandedNodes };
    } catch (error) {
      console.error(`Failed to expand node ${nodeId}:`, error);
      throw error;
    }
  }
};

export default networkService;