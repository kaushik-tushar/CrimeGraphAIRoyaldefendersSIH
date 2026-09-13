import { api } from './api';

/**
 * Tactical Report Generation & Intelligence Export Service
 * Manages court-admissible dossier generation, executive summaries, PDF exports,
 * and automated briefing documentation.
 */

const MOCK_REPORTS_HISTORY = [
  {
    id: 'RPT-2026-091',
    title: 'Operation Phantom Call - Master Dossier',
    type: 'COURT_DOSSIER',
    format: 'PDF',
    caseId: '26189-042',
    firNo: 'FIR-2026-NCRB-9021',
    generatedBy: 'Inspector R. S. Verma',
    generatedAt: '2026-09-08 22:30 IST',
    status: 'COMPLETED',
    fileSize: '14.2 MB',
    downloadUrl: '/exports/RPT-2026-091.pdf'
  },
  {
    id: 'RPT-2026-084',
    title: 'Connaught Place Shell Accounts - CDR & Bank Link Analysis',
    type: 'LINK_ANALYSIS_SUMMARY',
    format: 'PDF',
    caseId: '26189-088',
    firNo: 'FIR-2026-DL-4410',
    generatedBy: 'Sub-Inspector M. Sharma',
    generatedAt: '2026-09-07 18:15 IST',
    status: 'COMPLETED',
    fileSize: '8.7 MB',
    downloadUrl: '/exports/RPT-2026-084.pdf'
  }
];

export const reportService = {
  /**
   * Fetch history of generated intelligence reports
   * @param {Object} [params] - Optional filters { caseId, type }
   */
  async getReportHistory(params = {}) {
    try {
      // Production API route:
      // return await api.get(`/reports?${new URLSearchParams(params)}`);

      await new Promise((resolve) => setTimeout(resolve, 300));
      let results = [...MOCK_REPORTS_HISTORY];

      if (params.caseId) {
        results = results.filter((r) => r.caseId === params.caseId);
      }
      if (params.type) {
        results = results.filter((r) => r.type === params.type);
      }

      return { success: true, reports: results, total: results.length };
    } catch (error) {
      console.error('Failed to fetch report history:', error);
      return { success: false, reports: [], error: error.message };
    }
  },

  /**
   * Request generation of a new court dossier or analytical report
   * @param {Object} reportRequest - { caseId, type, includeEvidenceHash, includeGraph, format }
   */
  async generateReport(reportRequest) {
    try {
      // Production API route:
      // return await api.post('/reports/generate', reportRequest);

      await new Promise((resolve) => setTimeout(resolve, 800));

      const newReport = {
        id: `RPT-2026-${Math.floor(100 + Math.random() * 900)}`,
        title: reportRequest.title || `Intelligence Briefing - Case #${reportRequest.caseId}`,
        type: reportRequest.type || 'EXECUTIVE_BRIEFING',
        format: reportRequest.format || 'PDF',
        caseId: reportRequest.caseId || '26189-042',
        firNo: reportRequest.firNo || 'FIR-2026-NCRB-9021',
        generatedBy: reportRequest.generatedBy || 'Inspector R. S. Verma',
        generatedAt: new Date().toISOString(),
        status: 'COMPLETED',
        fileSize: `${(Math.random() * 10 + 2).toFixed(1)} MB`,
        downloadUrl: `/exports/RPT-2026-${Math.floor(Math.random() * 1000)}.pdf`
      };

      MOCK_REPORTS_HISTORY.unshift(newReport);
      return { success: true, report: newReport };
    } catch (error) {
      console.error('Failed to generate report:', error);
      throw error;
    }
  },

  /**
   * Download generated report document
   * @param {string} reportId
   */
  async downloadReport(reportId) {
    try {
      // Production API route:
      // return await api.get(`/reports/${reportId}/download`, { responseType: 'blob' });

      await new Promise((resolve) => setTimeout(resolve, 400));
      const report = MOCK_REPORTS_HISTORY.find((r) => r.id === reportId);

      if (!report) {
        throw new Error('Report file not found.');
      }

      return {
        success: true,
        reportId,
        downloadUrl: report.downloadUrl,
        fileName: `${report.title.replace(/\s+/g, '_')}.pdf`
      };
    } catch (error) {
      console.error(`Failed to download report ${reportId}:`, error);
      throw error;
    }
  }
};

export default reportService;