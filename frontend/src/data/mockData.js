/**
 * Mock Intelligence Data Store
 * Tactical Law Enforcement Analytics & Syndicate Tracking Dataset
 */

export const MOCK_OFFICER_PROFILE = {
  id: 'OFFICER-9041',
  badgeNumber: 'INSP-26189',
  name: 'Inspector R. S. Verma',
  rank: 'Senior Cyber Investigator',
  unit: 'Special Crime Cell, Cyber Crime HQ',
  role: 'ADMIN',
  clearanceLevel: 'LEVEL_4_TOP_SECRET',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
};

export const MOCK_KPI_STATS = [
  {
    id: 'kpi-1',
    title: 'ACTIVE CASES UNDER SURVEILLANCE',
    value: '42',
    change: '+3 cases this week',
    isPositive: true,
    category: 'CASES'
  },
  {
    id: 'kpi-2',
    title: 'FLAGGED TOWER SUSPECT NODES',
    value: '1,284',
    change: '+14% spike in 24h',
    isPositive: false,
    category: 'CDR'
  },
  {
    id: 'kpi-3',
    title: 'FROZEN MULE ACCOUNT FUNDS',
    value: '₹3,42,80,000',
    change: '8 accounts locked',
    isPositive: true,
    category: 'FINANCIAL'
  },
  {
    id: 'kpi-4',
    title: 'EVIDENCE CHAIN SHA-256 INTEGRITY',
    value: '100%',
    change: 'Zero tamper alerts',
    isPositive: true,
    category: 'SYSTEM'
  }
];

export const MOCK_THREAT_FEED = [
  {
    id: 'ALT-2026-901',
    title: 'Midnight Call Frequency Spike (Kingpin Node)',
    type: 'CDR',
    severity: 'CRITICAL',
    timestamp: 'Just now • 02:14:22 IST',
    description: 'Burner SIM (+91 98210-XXXXX) initiated 14 rapid calls to blacklisted syndicate number within 8 minutes.',
    location: 'Sector 62 Tower Dump Node, Noida',
    caseId: '26189-042',
    firNo: 'FIR-2026-NCRB-9021'
  },
  {
    id: 'ALT-2026-898',
    title: 'Suspicious RTGS Mule Fund Transfer',
    type: 'FINANCIAL',
    severity: 'CRITICAL',
    timestamp: '4 mins ago • 02:10:05 IST',
    description: 'High-value wire of ₹45,00,000 transferred to flagged shell account in Axis Bank (Acct #9041).',
    location: 'Connaught Place Branch, Delhi',
    caseId: '26189-088',
    firNo: 'FIR-2026-DL-4410'
  },
  {
    id: 'ALT-2026-892',
    title: 'New IMEI Link Discovered on Tower Ping',
    type: 'CDR',
    severity: 'HIGH',
    timestamp: '18 mins ago • 01:56:12 IST',
    description: 'Primary suspect handset IMEI (869402049182391) registered a secondary unregistered SIM activation.',
    location: 'Indirapuram Cell Node, Ghaziabad',
    caseId: '26189-042',
    firNo: 'FIR-2026-NCRB-9021'
  },
  {
    id: 'ALT-2026-885',
    title: 'Evidence Chain SHA-256 Checksum Verified',
    type: 'SYSTEM',
    severity: 'MEDIUM',
    timestamp: '35 mins ago • 01:39:00 IST',
    description: 'Disk forensic dump (42.8 MB) verified against master cryptographic ledger.',
    location: 'HQ Forensic Unit',
    caseId: '26189-042',
    firNo: 'FIR-2026-NCRB-9021'
  }
];

export const MOCK_TIMELINE_EVENTS = [
  {
    id: 'EVT-9001',
    timestamp: '02:14:22 IST',
    date: '2026-09-09',
    title: 'Midnight Call Burst Sequence',
    category: 'CDR',
    description: 'Primary Burner SIM (+91 98210-XXXXX) placed 14 high-frequency calls to known syndicate mule accounts within 8 minutes.',
    source: '+91 98210-XXXXX',
    target: '+91 97110-XXXXX',
    location: 'Sector 62 Tower Dump Node, Noida',
    riskScore: 92,
    status: 'CRITICAL'
  },
  {
    id: 'EVT-9002',
    timestamp: '01:58:10 IST',
    date: '2026-09-09',
    title: 'High-Value RTGS Cash Transfer',
    category: 'FINANCIAL',
    description: 'Wire of ₹45,00,000 initiated from compromised corporate portal into Axis Bank Mule Account #9041.',
    source: 'HDFC Corp Portal',
    target: 'Axis Bank Acct #9041',
    location: 'Connaught Place Branch, Delhi',
    riskScore: 88,
    status: 'HIGH'
  },
  {
    id: 'EVT-9003',
    timestamp: '23:40:00 IST',
    date: '2026-09-08',
    title: 'IMEI Swap & Unregistered SIM Activation',
    category: 'DEVICE',
    description: 'Secondary handset IMEI (869402049182391) registered a new subscriber SIM card under fake ID.',
    source: 'IMEI 869402049182391',
    target: 'SIM IMSI-40445',
    location: 'Indirapuram Tower Cell, Ghaziabad',
    riskScore: 75,
    status: 'MEDIUM'
  },
  {
    id: 'EVT-9004',
    timestamp: '18:15:30 IST',
    date: '2026-09-08',
    title: 'FIR Case Registration & NCB Sync',
    category: 'LEGAL',
    description: 'FIR #2026-NCRB-9021 lodged under IT Act Sec 66D & IPC 420. Forensic drive hash ingested.',
    source: 'Cyber Crime Cell',
    target: 'NCRB Database',
    location: 'HQ Cyber Police Station',
    riskScore: 40,
    status: 'VERIFIED'
  }
];

export const MOCK_CASES = [
  {
    id: '26189-042',
    firNo: 'FIR-2026-NCRB-9021',
    title: 'Operation Phantom Call - Cross-Border Cyber Financial Scam',
    assignedOfficer: 'Inspector R. S. Verma',
    status: 'ACTIVE',
    severity: 'CRITICAL',
    suspectCount: 8,
    evidenceFilesCount: 14,
    lastUpdated: '2026-09-09 02:14 IST'
  },
  {
    id: '26189-088',
    firNo: 'FIR-2026-DL-4410',
    title: 'Connaught Place Shell Account Laundering Ring',
    assignedOfficer: 'Sub-Inspector M. Sharma',
    status: 'UNDER_INVESTIGATION',
    severity: 'HIGH',
    suspectCount: 4,
    evidenceFilesCount: 9,
    lastUpdated: '2026-09-09 01:50 IST'
  }
];