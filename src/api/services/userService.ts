import { BaseApiClient } from "../baseApiClient";
import { API_CONFIG, USE_MOCK_API } from "../config";
import * as mockApi from "../mockApi";
import type { User, ApiResponse } from "../../types/invoice";

/**
 * User API Service
 * Handles all user-related API calls
 */
export class UserApiService extends BaseApiClient {
    async getUserProfile(): Promise<ApiResponse<User>> {
        if (USE_MOCK_API) {
            return mockApi.getUserProfileApi();
        }

        return this.get<User>(API_CONFIG.ENDPOINTS.USER_PROFILE);
    }

    async updateUserProfile(
        userData: Partial<User>
    ): Promise<ApiResponse<User>> {
        if (USE_MOCK_API) {
            // Mock implementation
            return {
                success: true,
                data: { ...userData } as User,
                message: "Cập nhật thông tin thành công",
            };
        }

        return this.put<User>(API_CONFIG.ENDPOINTS.UPDATE_PROFILE, userData);
    }
}

// Export singleton instance
export const userApiService = new UserApiService();
