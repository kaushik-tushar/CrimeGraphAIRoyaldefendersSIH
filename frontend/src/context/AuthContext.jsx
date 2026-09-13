import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Tactical Security Authorization Context
 * Provides global authentication state, token persistence, and role-based access control (RBAC)
 * for law enforcement officers, investigators, and system administrators.
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('tactical_auth_token'));
  const [loading, setLoading] = useState(true);

  // Restore authenticated session on mount if valid token exists
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('tactical_auth_token');
      const storedUser = localStorage.getItem('tactical_auth_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (err) {
          console.error('Failed to parse cached authentication session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Authenticate officer credentials with backend API
   * @param {string} badgeNumber / Email / Officer Identifier
   * @param {string} password
   * @returns {Promise<{ success: boolean, error?: string }>}
   */
  const login = async (badgeNumber, password) => {
    try {
      // In production, invoke your API endpoint (e.g., POST /api/v1/auth/login)
      // Here we simulate a successful authentication payload:
      const simulatedResponse = {
        token: 'jwt_sec_token_' + Math.random().toString(36).substring(2),
        user: {
          id: 'OFFICER-9041',
          badgeNumber: badgeNumber || 'INSP-26189',
          name: 'Inspector R. S. Verma',
          rank: 'Senior Cyber Investigator',
          unit: 'Special Crime Cell, Cyber Crime HQ',
          role: 'ADMIN', // 'ADMIN' | 'INVESTIGATOR' | 'ANALYST'
          clearanceLevel: 'LEVEL_4_TOP_SECRET'
        }
      };

      localStorage.setItem('tactical_auth_token', simulatedResponse.token);
      localStorage.setItem('tactical_auth_user', JSON.stringify(simulatedResponse.user));

      setToken(simulatedResponse.token);
      setUser(simulatedResponse.user);

      return { success: true };
    } catch (error) {
      console.error('Authentication failure:', error);
      return { success: false, error: error.message || 'Authentication failed' };
    }
  };

  /**
   * Terminate authenticated session and clear security tokens
   */
  const logout = () => {
    localStorage.removeItem('tactical_auth_token');
    localStorage.removeItem('tactical_auth_user');
    setToken(null);
    setUser(null);
  };

  /**
   * Check if user possesses required access permissions
   * @param {Array<string>} allowedRoles
   */
  const hasRole = (allowedRoles = []) => {
    if (!user) return false;
    if (allowedRoles.length === 0) return true;
    return allowedRoles.includes(user.role);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

/**
 * Custom Hook to consume Authentication Context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;