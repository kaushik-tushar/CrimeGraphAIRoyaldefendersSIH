import { api } from './api';
import { MOCK_OFFICER_PROFILE } from '../data/mockData';

/**
 * Authentication & Access Control Service
 * Handles officer authentication, token persistence, and session verification.
 */

export const authService = {
  /**
   * Authenticate officer credentials
   * @param {string} badgeNumber - Badge/ID/Email identifier
   * @param {string} password - Security password
   */
  async login(badgeNumber, password) {
    try {
      // Production API route:
      // const response = await api.post('/auth/login', { badgeNumber, password });
      // return response;

      // Simulated authentication delay & response
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (!badgeNumber || !password) {
        throw new Error('Badge number and password are required.');
      }

      const mockResponse = {
        success: true,
        token: 'jwt_sec_token_' + Math.random().toString(36).substring(2),
        user: {
          ...MOCK_OFFICER_PROFILE,
          badgeNumber: badgeNumber || MOCK_OFFICER_PROFILE.badgeNumber
        }
      };

      return mockResponse;
    } catch (error) {
      console.error('Login service failed:', error);
      throw error;
    }
  },

  /**
   * Verify and refresh current JWT session
   */
  async verifySession() {
    try {
      // Production API route:
      // return await api.get('/auth/me');

      const token = localStorage.getItem('tactical_auth_token');
      const userRaw = localStorage.getItem('tactical_auth_user');

      if (!token || !userRaw) {
        return { success: false, user: null };
      }

      return {
        success: true,
        user: JSON.parse(userRaw)
      };
    } catch (error) {
      console.error('Session verification failed:', error);
      return { success: false, user: null };
    }
  },

  /**
   * Terminate active user session
   */
  async logout() {
    try {
      // Production API route:
      // await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('tactical_auth_token');
      localStorage.removeItem('tactical_auth_user');
    }
  }
};

export default authService;