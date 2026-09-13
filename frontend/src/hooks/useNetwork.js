import { useState, useEffect, useCallback } from 'react';

/**
 * Advanced Hook for managing large-scale node-link graph data (30+ nodes, 100+ links)
 * representing multi-tier cyber criminal syndicates, money laundering channels, and telecom metadata.
 */
export function useNetwork(caseId = null) {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('ALL'); // ALL, PHONE, SUSPECT, BANK, TOWER, IMEI, CRYPTO, SHELL
  const [loading, setLoading] = useState(true);

  const fetchNetworkGraph = useCallback(async () => {
    setLoading(true);

    // Massive Simulated Intelligence Network (30+ Nodes, 100+ Links)
    const masterGraph = {
      nodes: [
        // --- TIER 1: CORE HANDLERS & KINGPINS (Nodes 1-5) ---
        { id: 'node-1', label: 'Vikram @ Ghost (Mastermind)', type: 'SUSPECT', risk: 99, group: 1, details: { role: 'Syndicate Head', jurisdiction: 'Dubai/Delhi', warrants: 4 } },
        { id: 'node-2', label: 'Alex @ DarkWeb (Tech Lead)', type: 'SUSPECT', risk: 95, group: 1, details: { role: 'Malware & Phishing Infrastructure', jurisdiction: 'SE Asia' } },
        { id: 'node-3', label: 'Meera Sharma (Operations Handler)', type: 'SUSPECT', risk: 90, group: 1, details: { role: 'Recruitment & Call Center Head', jurisdiction: 'Noida' } },
        { id: 'node-4', label: 'Zeeshan Khan (Logistics)', type: 'SUSPECT', risk: 88, group: 1, details: { role: 'SIM/Kyc Broker', jurisdiction: 'Delhi' } },
        { id: 'node-5', label: 'Chen Wei (Crypto Over-The-Counter)', type: 'SUSPECT', risk: 92, group: 2, details: { role: 'P2P Escrow & USDT Layering', jurisdiction: 'Shenzhen' } },

        // --- TIER 2: PHONE NUMBERS & SIMS (Nodes 6-12) ---
        { id: 'node-6', label: 'Burner SIM +91 98210-44112', type: 'PHONE', risk: 92, group: 1, details: { carrier: 'Jio', owner: 'Dummy KYC 1' } },
        { id: 'node-7', label: 'Burner SIM +91 97110-88331', type: 'PHONE', risk: 89, group: 1, details: { carrier: 'Airtel', owner: 'Dummy KYC 2' } },
        { id: 'node-8', label: 'Intl VoIP +44 7911 123456', type: 'PHONE', risk: 94, group: 1, details: { carrier: 'Twilio Virtual', owner: 'Spoofed' } },
        { id: 'node-9', label: 'Burner SIM +91 99102-33445', type: 'PHONE', risk: 85, group: 1, details: { carrier: 'Vi', owner: 'Dummy KYC 3' } },
        { id: 'node-10', label: 'Burner SIM +91 88001-99221', type: 'PHONE', risk: 87, group: 1, details: { carrier: 'Jio', owner: 'Dummy KYC 4' } },
        { id: 'node-11', label: 'WhatsApp Business +91 93111-55667', type: 'PHONE', risk: 91, group: 1, details: { carrier: 'Telegram/WA Bot', usage: 'Extortion' } },
        { id: 'node-12', label: 'Burner SIM +91 95551-77889', type: 'PHONE', risk: 84, group: 1, details: { carrier: 'BSNL', owner: 'Dummy KYC 5' } },

        // --- TIER 3: BANK ACCOUNTS & SHELL COMPANIES (Nodes 13-20) ---
        { id: 'node-13', label: 'Axis Acct #9041289 (Apex Trading)', type: 'BANK', risk: 88, group: 2, details: { type: 'Current', turnover: '₹4.2 Cr' } },
        { id: 'node-14', label: 'HDFC Acct #5019283 (Amit Kumar)', type: 'BANK', risk: 82, group: 2, details: { type: 'Savings (Mule 1)', turnover: '₹85 Lakh' } },
        { id: 'node-15', label: 'ICICI Acct #1102938 (Priya Traders)', type: 'SHELL', risk: 90, group: 2, details: { type: 'Shell Company', turnover: '₹2.1 Cr' } },
        { id: 'node-16', label: 'SBI Acct #3302192 (Rahul Enterprises)', type: 'SHELL', risk: 87, group: 2, details: { type: 'Shell Company', turnover: '₹1.8 Cr' } },
        { id: 'node-17', label: 'Kotak Acct #7788291 (Mule Accounts Pool)', type: 'BANK', risk: 86, group: 2, details: { type: 'Current (Pooled)', turnover: '₹3.5 Cr' } },
        { id: 'node-18', label: 'Paytm Payments Bank #881920', type: 'BANK', risk: 79, group: 2, details: { type: 'Wallet Aggregator', turnover: '₹40 Lakh' } },
        { id: 'node-19', label: 'IndusInd Acct #4432190 (Global Exports)', type: 'SHELL', risk: 91, group: 2, details: { type: 'Import-Export Shell', turnover: '₹5.6 Cr' } },
        { id: 'node-20', label: 'Yes Bank Acct #2219384 (Mule 2 - Rohit)', type: 'BANK', risk: 83, group: 2, details: { type: 'Savings', turnover: '₹62 Lakh' } },

        // --- TIER 4: CRYPTO WALLETS (Nodes 21-25) ---
        { id: 'node-21', label: 'USDT Wallet TXYZ...89pl (Binance)', type: 'CRYPTO', risk: 96, group: 3, details: { volume: '$420,000', mixer: 'Used' } },
        { id: 'node-22', label: 'BTC Wallet 1A1zP1...5GHv (Cold Storage)', type: 'CRYPTO', risk: 94, group: 3, details: { volume: '14.5 BTC', mixer: 'Wasabi' } },
        { id: 'node-23', label: 'ETH Wallet 0x71C...98a2 (Uniswap Pool)', type: 'CRYPTO', risk: 90, group: 3, details: { volume: '120 ETH', riskScore: 'High' } },
        { id: 'node-24', label: 'USDT TRC20 TVPr9...jj21 (P2P Hot)', type: 'CRYPTO', risk: 93, group: 3, details: { volume: '$180,000', status: 'Flagged' } },
        { id: 'node-25', label: 'Tron Wallet TK9qW...44lm (Layering)', type: 'CRYPTO', risk: 89, group: 3, details: { volume: '$95,000', nodeType: 'Bridge' } },

        // --- TIER 5: CELL TOWERS & HARDWARE / IMEIs (Nodes 26-32) ---
        { id: 'node-26', label: 'Cell Tower #62 (Noida Sec-62)', type: 'TOWER', risk: 50, group: 4, details: { operator: 'Airtel BTS', pings: 1420 } },
        { id: 'node-27', label: 'Cell Tower #104 (Connaught Place)', type: 'TOWER', risk: 55, group: 4, details: { operator: 'Jio BTS', pings: 3100 } },
        { id: 'node-28', label: 'Cell Tower #18 (Gurugram CyberCity)', type: 'TOWER', risk: 60, group: 4, details: { operator: 'Vi BTS', pings: 2450 } },
        { id: 'node-29', label: 'IMEI 869402049182391 (OnePlus)', type: 'IMEI', risk: 85, group: 4, details: { simSwaps: 4 } },
        { id: 'node-30', label: 'IMEI 354819028491029 (iPhone 14)', type: 'IMEI', risk: 88, group: 4, details: { simSwaps: 2 } },
        { id: 'node-31', label: 'IMEI 861294028591023 (Samsung S22)', type: 'IMEI', risk: 86, group: 4, details: { simSwaps: 3 } },
        { id: 'node-32', label: 'Wi-Fi Router MAC 00:1A:2B:3C:4D:5E', type: 'TOWER', risk: 75, group: 4, details: { location: 'Laxmi Nagar Flat 402' } }
      ],
      links: [
        // --- 100+ Interconnected Links (Simulating High-Density Syndication) ---
        // Kingpin connections
        { source: 'node-1', target: 'node-2', label: 'Direct Comm', weight: 10 },
        { source: 'node-1', target: 'node-3', label: 'Orders & Tasking', weight: 9 },
        { source: 'node-1', target: 'node-5', label: 'Financial Direction', weight: 9 },
        { source: 'node-2', target: 'node-8', label: 'VoIP Routing', weight: 8 },
        { source: 'node-3', target: 'node-6', label: 'SIM Allocation', weight: 7 },
        { source: 'node-3', target: 'node-7', label: 'SIM Allocation', weight: 7 },
        { source: 'node-3', target: 'node-9', label: 'SIM Allocation', weight: 6 },
        { source: 'node-3', target: 'node-10', label: 'SIM Allocation', weight: 6 },
        
        // Phone to IMEI & Towers
        { source: 'node-6', target: 'node-29', label: 'Hardware Link', weight: 10 },
        { source: 'node-7', target: 'node-30', label: 'Hardware Link', weight: 10 },
        { source: 'node-9', target: 'node-31', label: 'Hardware Link', weight: 10 },
        { source: 'node-6', target: 'node-26', label: 'Tower Ping', weight: 5 },
        { source: 'node-7', target: 'node-27', label: 'Tower Ping', weight: 5 },
        { source: 'node-8', target: 'node-28', label: 'Tower Ping', weight: 6 },
        { source: 'node-9', target: 'node-26', label: 'Tower Ping', weight: 4 },
        { source: 'node-10', target: 'node-27', label: 'Tower Ping', weight: 4 },
        { source: 'node-11', target: 'node-32', label: 'IP / Wi-Fi Log', weight: 8 },
        { source: 'node-12', target: 'node-28', label: 'Tower Ping', weight: 5 },

        // Call bursts between SIMs and Suspects
        { source: 'node-6', target: 'node-1', label: '14 Calls Burst', weight: 9 },
        { source: 'node-7', target: 'node-2', label: 'Encrypted Ping', weight: 8 },
        { source: 'node-9', target: 'node-3', label: 'Coordination', weight: 7 },
        { source: 'node-10', target: 'node-4', label: 'Logistics Call', weight: 6 },
        { source: 'node-11', target: 'node-3', label: 'Chat Logs Found', weight: 8 },
        { source: 'node-12', target: 'node-4', label: 'Status Update', weight: 5 },
        { source: 'node-6', target: 'node-7', label: 'Cross Talk', weight: 4 },
        { source: 'node-8', target: 'node-1', label: 'VoIP Bridge', weight: 9 },

        // Bank Accounts & Shell Companies Interlinks (Layering)
        { source: 'node-13', target: 'node-15', label: 'Wire Transfer', weight: 9 },
        { source: 'node-13', target: 'node-16', label: 'Wire Transfer', weight: 8 },
        { source: 'node-14', target: 'node-13', label: 'Cash Out / UPI', weight: 7 },
        { source: 'node-15', target: 'node-17', label: 'Bulk Transfer', weight: 9 },
        { source: 'node-16', target: 'node-17', label: 'Bulk Transfer', weight: 9 },
        { source: 'node-17', target: 'node-18', label: 'Wallet Load', weight: 6 },
        { source: 'node-19', target: 'node-13', label: 'Invoice Loop', weight: 8 },
        { source: 'node-20', target: 'node-14', label: 'P2P Transfer', weight: 7 },
        { source: 'node-18', target: 'node-20', label: 'Fund Routing', weight: 5 },
        { source: 'node-19', target: 'node-15', label: 'Cross-Shell Move', weight: 8 },

        // Crypto P2P and Exchange Bridges
        { source: 'node-5', target: 'node-21', label: 'Escrow Control', weight: 10 },
        { source: 'node-13', target: 'node-21', label: 'Fiat to Crypto', weight: 9 },
        { source: 'node-15', target: 'node-24', label: 'USDT Purchase', weight: 9 },
        { source: 'node-21', target: 'node-22', label: 'Cold Storage Move', weight: 8 },
        { source: 'node-21', target: 'node-23', label: 'Liquidity Pool', weight: 7 },
        { source: 'node-24', target: 'node-25', label: 'Cross-Chain Bridge', weight: 8 },
        { source: 'node-22', target: 'node-5', label: 'Withdrawal', weight: 9 },
        { source: 'node-25', target: 'node-21', label: 'Circular Wash', weight: 8 },

        // Complex cross-tier links to reach 100+ density
        { source: 'node-4', target: 'node-14', label: 'ATM Cash Withdrawal', weight: 8 },
        { source: 'node-4', target: 'node-20', label: 'ATM Cash Withdrawal', weight: 7 },
        { source: 'node-3', target: 'node-14', label: 'Account Control', weight: 9 },
        { source: 'node-3', target: 'node-20', label: 'Account Control', weight: 8 },
        { source: 'node-1', target: 'node-21', label: 'Master Wallet Access', weight: 10 },
        { source: 'node-2', target: 'node-22', label: 'Private Key Holder', weight: 9 },
        { source: 'node-26', target: 'node-29', label: 'BTS Geolocation', weight: 6 },
        { source: 'node-27', target: 'node-30', label: 'BTS Geolocation', weight: 6 },
        { source: 'node-28', target: 'node-31', label: 'BTS Geolocation', weight: 6 },
        { source: 'node-32', target: 'node-11', label: 'IP Binding', weight: 7 },

        // Additional interlocking operational links (simulated high density network)
        { source: 'node-6', target: 'node-13', label: 'Linked UPI ID', weight: 8 },
        { source: 'node-7', target: 'node-14', label: 'Linked UPI ID', weight: 7 },
        { source: 'node-9', target: 'node-18', label: 'Linked UPI ID', weight: 6 },
        { source: 'node-10', target: 'node-20', label: 'Linked UPI ID', weight: 6 },
        { source: 'node-5', target: 'node-19', label: 'Foreign Invoice', weight: 8 },
        { source: 'node-4', target: 'node-7', label: 'SIM Swap Visit', weight: 7 },
        { source: 'node-3', target: 'node-15', label: 'Director Nomination', weight: 9 },
        { source: 'node-2', target: 'node-23', label: 'Smart Contract Deploy', weight: 8 },
        { source: 'node-1', target: 'node-19', label: 'Beneficial Owner', weight: 10 },
        { source: 'node-12', target: 'node-16', label: 'KYC Match', weight: 5 },
        
        // Batch 51-75 links
        { source: 'node-13', target: 'node-14', label: 'Internal Transfer 1', weight: 5 },
        { source: 'node-14', target: 'node-15', label: 'Internal Transfer 2', weight: 5 },
        { source: 'node-15', target: 'node-16', label: 'Internal Transfer 3', weight: 5 },
        { source: 'node-16', target: 'node-17', label: 'Internal Transfer 4', weight: 5 },
        { source: 'node-17', target: 'node-18', label: 'Internal Transfer 5', weight: 5 },
        { source: 'node-18', target: 'node-19', label: 'Internal Transfer 6', weight: 5 },
        { source: 'node-19', target: 'node-20', label: 'Internal Transfer 7', weight: 5 },
        { source: 'node-21', target: 'node-24', label: 'Crypto Hop 1', weight: 7 },
        { source: 'node-22', target: 'node-25', label: 'Crypto Hop 2', weight: 7 },
        { source: 'node-23', target: 'node-21', label: 'Crypto Hop 3', weight: 7 },
        { source: 'node-6', target: 'node-8', label: 'Secondary Bridge 1', weight: 4 },
        { source: 'node-7', target: 'node-9', label: 'Secondary Bridge 2', weight: 4 },
        { source: 'node-10', target: 'node-12', label: 'Secondary Bridge 3', weight: 4 },
        { source: 'node-26', target: 'node-27', label: 'Corridor Ping 1', weight: 5 },
        { source: 'node-27', target: 'node-28', label: 'Corridor Ping 2', weight: 5 },
        { source: 'node-29', target: 'node-30', label: 'Device Swap 1', weight: 6 },
        { source: 'node-30', target: 'node-31', label: 'Device Swap 2', weight: 6 },
        { source: 'node-1', target: 'node-13', label: 'Master Audit Link 1', weight: 9 },
        { source: 'node-2', target: 'node-15', label: 'Master Audit Link 2', weight: 9 },
        { source: 'node-3', target: 'node-16', label: 'Master Audit Link 3', weight: 9 },
        { source: 'node-4', target: 'node-17', label: 'Master Audit Link 4', weight: 8 },
        { source: 'node-5', target: 'node-20', label: 'Master Audit Link 5', weight: 8 },
        { source: 'node-8', target: 'node-21', label: 'Virtual Gateway 1', weight: 8 },
        { source: 'node-11', target: 'node-24', label: 'Virtual Gateway 2', weight: 8 },
        { source: 'node-32', target: 'node-28', label: 'Router Telemetry', weight: 6 },

        // Batch 76-105+ links (Completing dense graph topology)
        { source: 'node-1', target: 'node-7', label: 'Direct Override', weight: 7 },
        { source: 'node-2', target: 'node-9', label: 'Direct Override', weight: 7 },
        { source: 'node-3', target: 'node-11', label: 'Chat Relay', weight: 8 },
        { source: 'node-4', target: 'node-6', label: 'SIM Provisioning', weight: 6 },
        { source: 'node-5', target: 'node-22', label: 'Whale Transfer', weight: 9 },
        { source: 'node-13', target: 'node-22', label: 'Direct OTC Buy', weight: 8 },
        { source: 'node-14', target: 'node-21', label: 'Retail P2P', weight: 7 },
        { source: 'node-15', target: 'node-23', label: 'Pool Stake', weight: 7 },
        { source: 'node-16', target: 'node-24', label: 'Escrow Lock', weight: 7 },
        { source: 'node-17', target: 'node-25', label: 'Bridge Fee', weight: 6 },
        { source: 'node-26', target: 'node-30', label: 'Proximity Match', weight: 5 },
        { source: 'node-27', target: 'node-31', label: 'Proximity Match', weight: 5 },
        { source: 'node-28', target: 'node-29', label: 'Proximity Match', weight: 5 },
        { source: 'node-6', target: 'node-32', label: 'Data Session', weight: 6 },
        { source: 'node-7', target: 'node-32', label: 'Data Session', weight: 6 },
        { source: 'node-9', target: 'node-26', label: 'Repeated Ping', weight: 5 },
        { source: 'node-10', target: 'node-28', label: 'Repeated Ping', weight: 5 },
        { source: 'node-12', target: 'node-27', label: 'Repeated Ping', weight: 5 },
        { source: 'node-18', target: 'node-13', label: 'Reversal Loop', weight: 4 },
        { source: 'node-20', target: 'node-15', label: 'Reversal Loop', weight: 4 },
        { source: 'node-1', target: 'node-25', label: 'Final Settlement', weight: 10 },
        { source: 'node-2', target: 'node-24', label: 'Final Settlement', weight: 10 },
        { source: 'node-3', target: 'node-23', label: 'Final Settlement', weight: 9 },
        { source: 'node-4', target: 'node-22', label: 'Final Settlement', weight: 9 },
        { source: 'node-5', target: 'node-21', label: 'Final Settlement', weight: 10 }
      ]
    };

    await new Promise((resolve) => setTimeout(resolve, 300));
    setGraphData(masterGraph);
    setLoading(false);
  }, [caseId]);

  useEffect(() => {
    fetchNetworkGraph();
  }, [fetchNetworkGraph]);

  const selectNode = useCallback((nodeId) => {
    const node = graphData.nodes.find((n) => n.id === nodeId);
    setSelectedNode(node || null);
  }, [graphData]);

  const getFilteredNodes = useCallback(() => {
    if (filterType === 'ALL') return graphData.nodes;
    return graphData.nodes.filter(n => n.type === filterType);
  }, [graphData.nodes, filterType]);

  const addCustomNode = useCallback((newNode) => {
    setGraphData((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
  }, []);

  return {
    nodes: getFilteredNodes(),
    allNodes: graphData.nodes,
    links: graphData.links,
    selectedNode,
    selectNode,
    loading,
    filterType,
    setFilterType,
    addCustomNode,
    refreshGraph: fetchNetworkGraph
  };
}

export default useNetwork;