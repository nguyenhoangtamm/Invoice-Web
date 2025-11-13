import React, { createContext, useContext, useReducer, useEffect } from 'react';
import type { User, AuthResponse } from '../types/invoice';
import { apiClient } from '../api/apiClient';

// Auth State interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth Actions
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: AuthResponse }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
      
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
      
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
      
    case 'AUTH_LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
      
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
      
    default:
      return state;
  }
}

// Auth Context interface
interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, phone?: string, companyName?: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// Create context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Auth Provider component
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user from token on app start
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          apiClient.setAuthToken(token);
          const response = await apiClient.getUserProfile();
          
          if (response.success && response.data) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: response.data,
                token,
                refresh_token: localStorage.getItem('refresh_token') || '',
                expires_in: 3600
              }
            });
          } else {
            // Token invalid, clear it
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
            apiClient.clearAuthToken();
            dispatch({ type: 'AUTH_LOGOUT' });
          }
        } catch (error) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          apiClient.clearAuthToken();
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } else {
        dispatch({ type: 'AUTH_LOGOUT' });
      }
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await apiClient.login({ email, password });
      
      if (response.success && response.data) {
        const { token, refresh_token } = response.data;
        
        // Store tokens
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refresh_token);
        
        // Set auth header for future requests
        apiClient.setAuthToken(token);
        
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
        return true;
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: response.message || 'Đăng nhập thất bại' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Lỗi kết nối mạng' });
      return false;
    }
  };

  // Register function
  const register = async (
    email: string, 
    password: string, 
    name: string, 
    phone?: string, 
    companyName?: string
  ): Promise<boolean> => {
    dispatch({ type: 'AUTH_START' });
    
    try {
      const response = await apiClient.register({ 
        email, 
        password, 
        name, 
        phone,
        company_name: companyName 
      });
      
      if (response.success && response.data) {
        const { token, refresh_token } = response.data;
        
        // Store tokens
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refresh_token);
        
        // Set auth header for future requests
        apiClient.setAuthToken(token);
        
        dispatch({ type: 'AUTH_SUCCESS', payload: response.data });
        return true;
      } else {
        dispatch({ type: 'AUTH_ERROR', payload: response.message || 'Đăng ký thất bại' });
        return false;
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR', payload: 'Lỗi kết nối mạng' });
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API if using real API
      await apiClient.logout();
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      // Clear local storage and state regardless of API call result
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      apiClient.clearAuthToken();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;