import API, { AUTH_API } from './api';

export const authService = {
  /**
   * Register new customer
   */
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }
      return { token, user };
    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration failed.';
      throw new Error(msg);
    }
  },

  /**
   * Login user or admin
   * @param {string|object} emailOrCredentials - Email string or credentials object { email, password }
   * @param {string} [password] - Password string if first argument is email
   */
  login: async (emailOrCredentials, password) => {
    let email = '';
    let pass = '';

    if (
      typeof emailOrCredentials === 'object' &&
      emailOrCredentials !== null
    ) {
      email =
        emailOrCredentials.email ||
        emailOrCredentials.username ||
        '';

      pass =
        emailOrCredentials.password ||
        emailOrCredentials.passcode ||
        '';
    } else {
      email = emailOrCredentials || '';
      pass = password || '';
    }

    email = email.trim();
    pass = pass.trim();

    if (!email || !pass) {
      throw new Error('Please provide both email and password.');
    }

    const isAdmin = email.toLowerCase() === 'admin@sushma.com' || email.toLowerCase() === 'admin@sushmajewels.com';

    // 1. Admin Login Branch
    if (isAdmin) {
      try {
        const response = await AUTH_API.post(
          '/admin/login',
          null,
          {
            params: {
              email,
              password: pass
            }
          }
        );

        const token = response.data;

        if (!token || typeof token !== 'string') {
          throw new Error('Invalid authentication response from server.');
        }

        localStorage.setItem('token', token);

        const adminUser = {
          id: 1,
          name: 'Sushma Admin',
          email,
          role: 'ADMIN'
        };

        localStorage.setItem('user', JSON.stringify(adminUser));

        return {
          user: adminUser,
          token
        };
      } catch (error) {
        const msg = error.response?.data?.message || (typeof error.response?.data === 'string' ? error.response.data : null) || 'Invalid administrator credentials.';
        throw new Error(msg);
      }
    }

    // 2. Regular Customer Login Branch
    try {
      const response = await API.post('/auth/login', {
        email,
        password: pass
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      return { user, token };

    } catch (error) {
      // If server returned a 401 / 400 error, report it directly
      if (error.response && error.response.data) {
        const msg = error.response.data?.message || 'Invalid email or password.';
        throw new Error(msg);
      }

      // If backend server is offline/unreachable, gracefully allow offline demo session
      console.warn('Backend server unreachable, falling back to local session.');
      if (pass.length < 4) {
        throw new Error('Password must be at least 4 characters.');
      }

      const formattedName =
        email
          .split('@')[0]
          .replace(/[._-]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase()) ||
        'Valued Customer';

      const userResponse = {
        user: {
          id: Math.floor(100 + Math.random() * 900),
          name: formattedName,
          email,
          role: 'USER'
        },
        token: `mock-jwt-user-token-${Date.now()}`
      };

      localStorage.setItem('user', JSON.stringify(userResponse.user));
      localStorage.setItem('token', userResponse.token);

      return userResponse;
    }
  },

  /**
   * Logout user and clear tokens
   */
  logout: async () => {
    try {
      await API.post('/auth/logout');
    } catch (e) {
      // Local authentication will still be cleared.
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      try {
        localStorage.removeItem('sushma_admin_auth');
        localStorage.removeItem('sushma_auth_token');
        localStorage.removeItem('isLoggedIn');
      } catch (e) {
        // Silent ignore
      }
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: () => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Get JWT token
   */
  getToken: () => {
    return localStorage.getItem('token') || null;
  },

  /**
   * Get profile from backend
   */
  getProfile: async () => {
    try {
      const response = await API.get('/auth/me');
      return response.data;
    } catch (error) {
      return authService.getCurrentUser();
    }
  },

  /**
   * Update customer profile
   */
  updateProfile: async (profileData) => {
    try {
      const response = await API.put('/auth/me', profileData);
      const updated = response.data;
      if (updated) {
        const current = authService.getCurrentUser() || {};
        localStorage.setItem('user', JSON.stringify({
          ...current,
          ...updated
        }));
      }
      return updated;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile.';
      throw new Error(msg);
    }
  },

  /**
   * Change user password
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await API.post('/auth/change-password', { currentPassword, newPassword });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to change password.';
      throw new Error(msg);
    }
  },

  /**
   * Check authentication status
   */
  isAuthenticated: () => {
    return Boolean(authService.getToken());
  }
};

export default authService;