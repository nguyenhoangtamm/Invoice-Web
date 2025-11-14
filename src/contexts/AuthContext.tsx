import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApiService } from '../api/services/authService';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  CurrentUserResponse,
  AuthUser,
  ApiResponse
} from '../types/invoice';

// Auth Context Interface
interface AuthContextType {
  user: AuthUser | null;
  currentUserInfo: CurrentUserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<ApiResponse<AuthResponse>>;
  register: (userData: RegisterRequest) => Promise<ApiResponse<AuthResponse>>;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentUserInfo, setCurrentUserInfo] = useState<CurrentUserResponse | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Computed property for authentication status
  const isAuthenticated = !!user && !!accessToken;

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    initializeAuthState();
  }, []);

  // Set up axios interceptor for token refresh
  useEffect(() => {
    if (accessToken) {
      authApiService.setAuthToken(accessToken);
    }
  }, [accessToken]);

  /**
   * Initialize authentication state from localStorage
   */
  const initializeAuthState = () => {
    try {
      const storedAccessToken = localStorage.getItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
      const storedRefreshToken = localStorage.getItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
      const storedUser = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      const storedCurrentUserInfo = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_USER_INFO);

      if (storedAccessToken && storedRefreshToken && storedUser) {
        setAccessToken(storedAccessToken);
        setRefreshToken(storedRefreshToken);
        setUser(JSON.parse(storedUser));

        if (storedCurrentUserInfo) {
          setCurrentUserInfo(JSON.parse(storedCurrentUserInfo));
        }

        // Set token in API client
        authApiService.setAuthToken(storedAccessToken);        // Get fresh user info
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
   * Store auth data to localStorage and state
   */
  const storeAuthData = (authData: AuthResponse) => {
    const { data } = authData;

    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);

    localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
    localStorage.setItem(LOCAL_STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(data.user));

    // Set token in API client
    authApiService.setAuthToken(data.accessToken);
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

    // Clear token from API client
    authApiService.clearAuthToken();
  };

  /**
   * Login function
   */
  const login = async (credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    setIsLoading(true);

    try {
      const response = await authApiService.login(credentials);

      if (response.success && response.data) {
        storeAuthData(response.data);
        // Get additional user info after login
        await getCurrentUser();
      }

      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Đăng nhập thất bại',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Register function
   */
  const register = async (userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    setIsLoading(true);

    try {
      const response = await authApiService.register(userData);

      if (response.success && response.data) {
        storeAuthData(response.data);
        // Get additional user info after registration
        await getCurrentUser();
      }

      return response;
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Đăng ký thất bại',
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
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
      await authApiService.logout();
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
      const response = await authApiService.refreshToken({ RefreshToken: refreshToken });

      if (response.success && response.data) {
        storeAuthData(response.data);
        return true;
      } else {
        clearAuthData();
        return false;
      }
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
      const response = await authApiService.getCurrentUser();

      if (response.success && response.data) {
        setCurrentUserInfo(response.data);
        localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_USER_INFO, JSON.stringify(response.data));
      }
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
