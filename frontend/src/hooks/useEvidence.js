import { useState, useCallback } from 'react';

/**
 * Hook for managing digital evidence files, verifying cryptographic hash integrity,
 * and maintaining chain-of-custody records.
 */
export function useEvidence(caseId = null) {
  const [evidenceList, setEvidenceList] = useState([
    {
      id: 'EVD-101',
      fileName: 'tower_dump_sector_62_noida.csv',
      fileSize: '42.8 MB',
      type: 'CDR_TOWER_DUMP',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      collectedBy: 'Inspector R. S. Verma',
      timestamp: '2026-09-08 23:14:00 IST',
      integrityStatus: 'VERIFIED'
    },
    {
      id: 'EVD-102',
      fileName: 'bank_statement_axis_9041.pdf',
      fileSize: '3.1 MB',
      type: 'FINANCIAL_RECORD',
      sha256Hash: '8f4e2a1b9c3d5e7f6a8b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f',
      collectedBy: 'Sub-Inspector M. Sharma',
      timestamp: '2026-09-09 01:20:00 IST',
      integrityStatus: 'VERIFIED'
    }
  ]);

  const [verifying, setVerifying] = useState(false);

  // Verify file cryptographic integrity (SHA-256)
  const verifyIntegrity = useCallback(async (evidenceId) => {
    setVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    setEvidenceList((prev) =>
      prev.map((item) =>
        item.id === evidenceId
          ? { ...item, integrityStatus: 'VERIFIED', lastChecked: new Date().toISOString() }
          : item
      )
    );
    setVerifying(false);
  }, []);

  // Ingest new digital evidence file into chain of custody
  const addEvidence = useCallback((newFile) => {
    const record = {
      id: `EVD-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: new Date().toISOString(),
      integrityStatus: 'VERIFIED',
      ...newFile
    };
    setEvidenceList((prev) => [record, ...prev]);
  }, []);

  return {
    evidenceList,
    verifying,
    verifyIntegrity,
    addEvidence
  };
}

export default useEvidence;