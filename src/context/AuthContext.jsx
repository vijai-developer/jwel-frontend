import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [token, setToken] = useState(() => authService.getToken());
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Derive admin authentication status directly from user.role === "ADMIN"
  const isAdminAuthenticated = user?.role === 'ADMIN';

  useEffect(() => {
    // Proactively clear any legacy authentication keys that may persist in user browsers
    try {
      localStorage.removeItem('sushma_admin_auth');
      localStorage.removeItem('sushma_auth_token');
      localStorage.removeItem('isLoggedIn');
    } catch (e) {
      // Ignore storage access errors
    }

    const initAuth = async () => {
      try {
        const savedToken = authService.getToken();
        const savedUser = authService.getCurrentUser();

        if (savedToken && savedUser) {
          setUser(savedUser);
          setToken(savedToken);
        }
      } catch (err) {
        console.error('Auth context initialization error:', err);
      }
    };
    initAuth();
  }, []);

  /**
   * Primary Login function
   * @param {string} email 
   * @param {string} password 
   */
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      if (response && response.user) {
        setUser(response.user);
        setToken(response.token);
        return response;
      }
      throw new Error('Invalid response from authentication server.');
    } catch (err) {
      const errorMessage = err.message || 'Authentication failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Primary Logout function
   */
  const logout = async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    setError(null);

    setIsAdminLoginOpen(false);
  };

  // Backwards compatible aliases for existing modals & components
  const loginAdmin = async (passcode) => {
    try {
      const res = await login('admin@sushma.com', passcode);

      if (res && res.token) {
        setIsAdminLoginOpen(false);
        return true;
      }

      return false;
    } catch (e) {
      console.error('Admin login failed:', e);
      return false;
    }
  };

  const logoutAdmin = logout;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        isAdminAuthenticated,
        isAdminLoginOpen,
        setIsAdminLoginOpen,
        login,
        logout,
        loginAdmin,
        logoutAdmin,
        loading,
        error,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
