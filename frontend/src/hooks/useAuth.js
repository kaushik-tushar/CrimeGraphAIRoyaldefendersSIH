import { useAuth as useAuthContext } from '../context/authcontext';

/**
 * Hook for consuming global authentication state, token management,
 * and role-based permissions throughout the application.
 */
export function useAuth() {
  return useAuthContext();
}

export default useAuth;