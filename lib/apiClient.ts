// API Client utility for backend communication using axios
// Provides centralized error handling and logging

import axios, { AxiosError } from 'axios';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  private handleError(error: unknown): { error: string; status: number } {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ error?: string; message?: string }>;
      return {
        error: axiosError.response?.data?.error || 
               axiosError.response?.data?.message || 
               axiosError.message || 
               'An error occurred',
        status: axiosError.response?.status || 0
      };
    }
    
    return {
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 0
    };
  }

  async post<T>(endpoint: string, body: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await axios.post(`${this.baseUrl}${endpoint}`, body, {
        headers: { 'Content-Type': 'application/json' }
      });

      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error(`API POST ${endpoint} failed:`, error);
      const { error: errorMessage, status } = this.handleError(error);
      return { error: errorMessage, status };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' }
      });

      return {
        data: response.data,
        status: response.status
      };
    } catch (error) {
      console.error(`API GET ${endpoint} failed:`, error);
      const { error: errorMessage, status } = this.handleError(error);
      return { error: errorMessage, status };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient('/api');

// Export types
export type { ApiResponse };
