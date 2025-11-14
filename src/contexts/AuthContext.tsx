import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
  refreshToken as refreshTokenApi,
  getCurrentUser as getCurrentUserApi,
  clearAuthTokens,
  getAuthToken,
  getRefreshTokenValue
} from '../api/services/authService';
import type {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  UserDto
} from '../api/services/authService';

// Auth Context Interface
interface AuthContextType {
  user: UserDto | null;
  currentUserInfo: UserDto | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginDto) => Promise<AuthResponseDto>;
  register: (userData: RegisterDto) => Promise<AuthResponseDto>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  getCurrentUser: () => Promise<void>;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local Storage Keys
const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'invoice_access_token',
  REFRESH_TOKEN: 'invoice_refresh_token',
  USER: 'invoice_user',
  CURRENT_USER_INFO: 'invoice_current_user_info'
};

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [currentUserInfo, setCurrentUserInfo] = useState<UserDto | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Computed property for authentication status
  const isAuthenticated = !!user && !!accessToken;

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    initializeAuthState();
  }, []);

  // Token is automatically handled by axios interceptor
  // No need for manual token setting

  /**
   * Initialize authentication state from localStorage
   */
  const initializeAuthState = () => {
    try {
      // Support tokens stored under either the legacy keys used by
      // the auth service ("authToken"/"refreshToken") or the
      // local keys used by this context (invoice_access_token/...)
      const storedAccessToken = getAuthToken() || localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      const storedRefreshToken = getRefreshTokenValue() || localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || localStorage.getItem('invoice_user');
      const storedCurrentUserInfo = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER_INFO) || localStorage.getItem('invoice_current_user_info');

      if (storedAccessToken && storedRefreshToken && storedUser) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));

        if (storedCurrentUserInfo) {
          setCurrentUserInfo(JSON.parse(storedCurrentUserInfo));
        }

        // Tokens are automatically handled by axios interceptor        
        getCurrentUser();
      }
    } catch (error) {
      console.error('Error initializing auth state:', error);
      clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Store authentication data in localStorage and state
   */
  const storeAuthData = (authData: AuthResponseDto) => {
    setAccessToken(authData.accessToken);
    setRefreshToken(authData.refreshToken);
    setUser(authData.user);

    // Persist tokens in both the context-specific keys and the
    // legacy/global keys used by axios/auth utilities so any
    // consumer can find them.
    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, authData.accessToken);
    localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, authData.refreshToken);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(authData.user));

    // Also save the keys the axios client and auth service expect
    // (keep for backward compatibility).
    try {
      localStorage.setItem('authToken', authData.accessToken);
      localStorage.setItem('refreshToken', authData.refreshToken);
    } catch (e) {
      // ignore storage errors
    }

    // Tokens are automatically handled by axios interceptor
  };

  /**
   * Clear all auth data from localStorage and state
   */
  const clearAuthData = () => {
    setUser(null);
    setCurrentUserInfo(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_USER_INFO);

    // Clear tokens using utility function
    clearAuthTokens();
  };

  /**
   * Login function
   */
  const login = async (credentials: LoginDto): Promise<AuthResponseDto> => {
    setIsLoading(true);

    try {
      const response = await loginApi(credentials);

      storeAuthData(response);
      // Get additional user info after login
      await getCurrentUser();

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register function
   */
  const register = async (userData: RegisterDto): Promise<AuthResponseDto> => {
    setIsLoading(true);

    try {
      const response = await registerApi(userData);

      storeAuthData(response);
      // Get additional user info after registration
      await getCurrentUser();

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   */
  const logout = async (): Promise<void> => {
    setIsLoading(true);

    try {
      // Call logout API
      await logoutApi();
    } catch (error) {
      console.error('Logout API error:', error);
      // Even if API call fails, still clear local data
    } finally {
      clearAuthData();
      setIsLoading(false);
    }
  };

  /**
   * Refresh access token using refresh token
   */
  const refreshAccessToken = async (): Promise<boolean> => {
    if (!refreshToken) {
      clearAuthData();
      return false;
    }

    try {
      const response = await refreshTokenApi({ refreshToken });

      storeAuthData(response);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuthData();
      return false;
    }
  };

  /**
   * Get current user information
   */
  const getCurrentUser = async (): Promise<void> => {
    if (!accessToken) return;

    try {
      const response = await getCurrentUserApi();

      // Ensure we populate both the minimal `user` used for auth checks
      // and the `currentUserInfo` used for richer profile data.
      // Some backends return the user only via the /me endpoint and the
      // login response may not include a `user` field, so set both here.
      setUser(response as UserDto);
      setCurrentUserInfo(response);
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(response));
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER_INFO, JSON.stringify(response));
    } catch (error) {
      console.error('Get current user error:', error);
      // Don't clear auth data on this error, just log it
    }
  };

  // Context value
  const contextValue: AuthContextType = {
    user,
    currentUserInfo,
    accessToken,
    refreshToken,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshAccessToken,
    getCurrentUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use AuthContext
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

// Export default
export default AuthContext;
