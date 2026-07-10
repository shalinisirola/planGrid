import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const API_TIMEOUT = 5000; // 5 seconds

// Cache utilities
const getCachedUser = () => {
  try {
    const cached = localStorage.getItem('userCache');
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
  } catch (error) {
    console.warn('Error reading user cache:', error);
  }
  return null;
};

const setCachedUser = (userData) => {
  try {
    localStorage.setItem('userCache', JSON.stringify({
      data: userData,
      timestamp: Date.now()
    }));
  } catch (error) {
    console.warn('Error setting user cache:', error);
  }
};

const clearUserCache = () => {
  try {
    localStorage.removeItem('userCache');
  } catch (error) {
    console.warn('Error clearing user cache:', error);
  }
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = (() => {
    const isLocalHost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    const envUrl = import.meta.env.VITE_API_BASE_URL;
    if (envUrl && envUrl.trim()) {
      const normalizedEnvUrl = envUrl.trim();
      const envIsLocalHost =
        normalizedEnvUrl.includes('localhost') ||
        normalizedEnvUrl.includes('127.0.0.1');

      // Never use localhost API from a deployed frontend.
      if (!isLocalHost && envIsLocalHost) {
        return 'https://plangrid.onrender.com';
      }

      return normalizedEnvUrl;
    }

    return isLocalHost ? 'http://localhost:5000' : 'https://plangrid.onrender.com';
  })();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Check cache first
      const cachedUser = getCachedUser();
      if (cachedUser) {
        setUser(cachedUser);
        setLoading(false);
        return;
      }
      
      // Verify token and get user info with role (with timeout)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      
      axios.get(`${apiUrl}/api/me`, { 
        signal: controller.signal,
        timeout: API_TIMEOUT 
      })
        .then((res) => {
          clearTimeout(timeoutId);
          const userData = { 
            username: res.data.username, 
            role: res.data.role, 
            email: res.data.email 
          };
          setUser(userData);
          setCachedUser(userData); // Cache the user data
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          if (error.name !== 'AbortError' && error.code !== 'ECONNABORTED') {
            console.warn('Token verification failed:', error.message);
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            clearUserCache();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      
      const response = await axios.post(`${apiUrl}/api/login`, {
        username,
        password
      }, {
        signal: controller.signal,
        timeout: API_TIMEOUT
      });
      
      clearTimeout(timeoutId);
      const { access_token, user: userData } = response.data;
      localStorage.setItem('token', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(userData);
      setCachedUser(userData); // Cache the user data
      return { success: true };
    } catch (error) {
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        return { 
          success: false, 
          error: 'Login request timed out. Please check your connection and try again.' 
        };
      }
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (username, email, password) => {
    try {
      await axios.post(`${apiUrl}/api/register`, {
        username,
        email,
        password
      });
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const refreshUser = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      
      const response = await axios.get(`${apiUrl}/api/me`, {
        signal: controller.signal,
        timeout: API_TIMEOUT
      });
      
      clearTimeout(timeoutId);
      const userData = { 
        username: response.data.username, 
        role: response.data.role, 
        email: response.data.email 
      };
      setUser(userData);
      setCachedUser(userData); // Update cache
      return response.data;
    } catch (error) {
      if (error.name === 'AbortError' || error.code === 'ECONNABORTED') {
        console.warn('User refresh timed out');
        return null;
      }
      console.error('Error refreshing user data:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    clearUserCache(); // Clear cached user data
  };

  // Forgot password methods
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(`${apiUrl}/api/forgot-password`, {
        email
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to send reset email' 
      };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      const response = await axios.post(`${apiUrl}/api/reset-password`, {
        token,
        new_password: newPassword
      });
      return { success: true, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to reset password' 
      };
    }
  };

  const verifyResetToken = async (token) => {
    try {
      const response = await axios.post(`${apiUrl}/api/verify-reset-token`, {
        token
      });
      return { 
        success: response.data.valid, 
        email: response.data.email,
        error: response.data.error 
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to verify token' 
      };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    refreshUser,
    loading,
    forgotPassword,
    resetPassword,
    verifyResetToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
