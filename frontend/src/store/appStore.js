import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  MOCK_OFFICER_PROFILE, 
  MOCK_KPI_STATS, 
  MOCK_THREAT_FEED, 
  MOCK_CASES 
} from '../data/mockData';

/**
 * Global App State Store
 * Manages active case focus, real-time tactical alert feeds, active filters,
 * system status indicators, and operational UI state.
 */
export const useAppStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ---------------------------------------------------------------------
        // Authentication & Officer State
        // ---------------------------------------------------------------------
        officer: MOCK_OFFICER_PROFILE,
        setOfficer: (officer) => set({ officer }, false, 'setOfficer'),

        // ---------------------------------------------------------------------
        // Case Management State
        // ---------------------------------------------------------------------
        cases: MOCK_CASES,
        activeCaseId: MOCK_CASES[0]?.id || '26189-042',
        
        setActiveCaseId: (caseId) => set({ activeCaseId: caseId }, false, 'setActiveCaseId'),
        
        setCases: (cases) => set({ cases }, false, 'setCases'),

        updateCaseStatus: (caseId, status) =>
          set(
            (state) => ({
              cases: state.cases.map((c) =>
                c.id === caseId
                  ? { ...c, status, lastUpdated: new Date().toISOString() }
                  : c
              )
            }),
            false,
            'updateCaseStatus'
          ),

        // Helper selector to retrieve the currently focused case record
        getActiveCase: () => {
          const state = get();
          return state.cases.find((c) => c.id === state.activeCaseId) || state.cases[0] || null;
        },

        // ---------------------------------------------------------------------
        // Threat Alert Feed State
        // ---------------------------------------------------------------------
        alerts: MOCK_THREAT_FEED,
        alertFilter: 'ALL', // 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'CDR' | 'FINANCIAL'
        unreadAlertsCount: MOCK_THREAT_FEED.filter((a) => a.severity === 'CRITICAL').length,

        setAlertFilter: (filter) => set({ alertFilter: filter }, false, 'setAlertFilter'),

        addAlert: (newAlert) =>
          set(
            (state) => ({
              alerts: [newAlert, ...state.alerts],
              unreadAlertsCount: state.unreadAlertsCount + 1
            }),
            false,
            'addAlert'
          ),

        acknowledgeAlert: (alertId) =>
          set(
            (state) => ({
              alerts: state.alerts.filter((a) => a.id !== alertId),
              unreadAlertsCount: Math.max(0, state.unreadAlertsCount - 1)
            }),
            false,
            'acknowledgeAlert'
          ),

        clearUnreadCount: () => set({ unreadAlertsCount: 0 }, false, 'clearUnreadCount'),

        // ---------------------------------------------------------------------
        // Analytical KPI State
        // ---------------------------------------------------------------------
        kpiStats: MOCK_KPI_STATS,
        setKpiStats: (stats) => set({ kpiStats: stats }, false, 'setKpiStats'),

        // ---------------------------------------------------------------------
        // UI & Tactical Display Toggles
        // ---------------------------------------------------------------------
        sidebarCollapsed: false,
        liveAlertsStreamActive: true,
        highContrastMode: true, // Law enforcement dark-mode default
        activeTab: 'OVERVIEW',

        toggleSidebar: () =>
          set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }), false, 'toggleSidebar'),

        toggleLiveStream: () =>
          set(
            (state) => ({ liveAlertsStreamActive: !state.liveAlertsStreamActive }),
            false,
            'toggleLiveStream'
          ),

        setActiveTab: (tab) => set({ activeTab: tab }, false, 'setActiveTab'),

        // Reset application state
        resetStore: () =>
          set(
            {
              activeCaseId: MOCK_CASES[0]?.id || null,
              alerts: MOCK_THREAT_FEED,
              alertFilter: 'ALL',
              unreadAlertsCount: MOCK_THREAT_FEED.filter((a) => a.severity === 'CRITICAL').length
            },
            false,
            'resetStore'
          )
      }),
      {
        name: 'tactical_intel_store',
        partialize: (state) => ({
          activeCaseId: state.activeCaseId,
          sidebarCollapsed: state.sidebarCollapsed,
          highContrastMode: state.highContrastMode
        })
      }
    ),
    { name: 'AppStore' }
  )
);

export default useAppStore;