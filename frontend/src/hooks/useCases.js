import { useState, useEffect, useCallback } from 'react';
import { MOCK_CASES } from '../data/mockData';

/**
 * Custom hook for managing active law enforcement case files and FIR records.
 */
export function useCases(initialCaseId = null) {
  const [cases, setCases] = useState([]);
  const [activeCase, setActiveCase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all assigned cases
  const fetchCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      setCases(MOCK_CASES);

      if (initialCaseId) {
        const found = MOCK_CASES.find((c) => c.id === initialCaseId || c.firNo === initialCaseId);
        setActiveCase(found || MOCK_CASES[0] || null);
      } else {
        setActiveCase(MOCK_CASES[0] || null);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch case files.');
    } finally {
      setLoading(false);
    }
  }, [initialCaseId]);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  // Select active case by ID or FIR number
  const selectCase = useCallback(
    (caseId) => {
      const found = cases.find((c) => c.id === caseId || c.firNo === caseId);
      if (found) {
        setActiveCase(found);
      }
    },
    [cases]
  );

  // Update case status (e.g., ACTIVE, CLOSED, UNDER_INVESTIGATION)
  const updateCaseStatus = useCallback(async (caseId, newStatus) => {
    setCases((prevCases) =>
      prevCases.map((c) => (c.id === caseId ? { ...c, status: newStatus, lastUpdated: new Date().toISOString() } : c))
    );
    if (activeCase && activeCase.id === caseId) {
      setActiveCase((prev) => ({ ...prev, status: newStatus, lastUpdated: new Date().toISOString() }));
    }
  }, [activeCase]);

  return {
    cases,
    activeCase,
    loading,
    error,
    selectCase,
    updateCaseStatus,
    refreshCases: fetchCases
  };
}

export default useCases;