/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 */

import { API_ENDPOINTS } from '@/config/env';
import { LoginRequest, LoginResponse, User } from '@/types/auth.types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from './client';

const TOKEN_KEY = '@crm_auth_token';
const USER_KEY = '@crm_user';

export class AuthService {
  /**
   * Login Mutation
   * Authenticates user and stores token
   */
  async loginMutation(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_ENDPOINTS.LOGIN,
        credentials
      );

      // Use the 'data' field if it exists, otherwise fallback to 'rf_tk_exp'
      const token = response.data || response.rf_tk_exp;

      if (token) {
        // Store the token
        await this.storeToken(token);
        // Store user data if it exists
        if (response.id) {
          await this.storeUser(response as User);
        }
      }

      return response;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Logout Mutation
   * Clears stored authentication data
   */
  async logoutMutation(): Promise<void> {
    try {
      const token = await this.getToken();
      console.log('Logging out... Current token:', token ? 'exists' : 'null');
      
      if (token) {
        console.log('Calling Logout API: POST', API_ENDPOINTS.LOGOUT);
        const response = await apiClient.post(API_ENDPOINTS.LOGOUT, {}, token);
        console.log('Logout API Response:', response);
      }
    } catch (error) {
      console.error('API Logout error:', error);
      // We continue to clear local storage even if API fails
    } finally {
      console.log('Clearing local storage (AsyncStorage.clear)...');
      try {
        await AsyncStorage.clear();
        console.log('Local storage cleared successfully.');
      } catch (error) {
        console.error('Error clearing storage:', error);
      }
    }
  }

  /**
   * Store authentication token
   */
  private async storeToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
      throw error;
    }
  }

  /**
   * Store user data
   */
  private async storeUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error storing user:', error);
      throw error;
    }
  }

  /**
   * Get stored authentication token
   */
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error retrieving token:', error);
      return null;
    }
  }

  /**
   * Get stored user data
   */
  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error retrieving user:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }
}

export const authService = new AuthService();
