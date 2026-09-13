import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for searching and extracting entities (Phone Numbers, IMEIs, Bank Accounts, Persons)
 * linked to active intelligence cases.
 */
export function useEntities(caseId = null) {
  const [entities, setEntities] = useState([]);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  // Simulated entity dataset
  const mockEntities = [
    {
      id: 'ENT-901',
      name: '+91 98210-XXXXX',
      type: 'PHONE_NUMBER',
      riskScore: 92,
      associatedCase: '26189-042',
      operator: 'Airtel',
      circle: 'Delhi NCR',
      status: 'UNDER_SURVEILLANCE'
    },
    {
      id: 'ENT-902',
      name: 'IMEI 869402049182391',
      type: 'DEVICE_IMEI',
      riskScore: 85,
      associatedCase: '26189-042',
      deviceModel: 'OnePlus Nord CE 3',
      status: 'FLAGGED'
    },
    {
      id: 'ENT-903',
      name: 'Axis Bank Acct #9041',
      type: 'BANK_ACCOUNT',
      riskScore: 88,
      associatedCase: '26189-088',
      branch: 'Connaught Place',
      status: 'FROZEN'
    },
    {
      id: 'ENT-904',
      name: 'Rajesh Kumar (Alias: Raju)',
      type: 'SUSPECT',
      riskScore: 95,
      associatedCase: '26189-042',
      status: 'ABSCONDING'
    }
  ];

  useEffect(() => {
    setLoading(true);
    let result = mockEntities;
    if (caseId) {
      result = result.filter((e) => e.associatedCase === caseId);
    }
    setEntities(result);
    setLoading(false);
  }, [caseId]);

  const filteredEntities = entities.filter((ent) => {
    if (filterType === 'ALL') return true;
    return ent.type === filterType;
  });

  return {
    entities: filteredEntities,
    selectedEntity,
    setSelectedEntity,
    loading,
    filterType,
    setFilterType
  };
}

export default useEntities;