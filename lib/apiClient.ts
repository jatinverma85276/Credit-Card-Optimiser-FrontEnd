// API Client utility for backend communication
// Provides centralized error handling and logging

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

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const status = response.status;

    if (!response.ok) {
      let error = 'An error occurred';
      try {
        const errorData = await response.json();
        error = errorData.error || errorData.message || error;
      } catch {
        error = `HTTP ${status}: ${response.statusText}`;
      }

      return { error, status };
    }

    try {
      const data = await response.json();
      return { data, status };
    } catch {
      return { error: 'Invalid JSON response', status };
    }
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API POST ${endpoint} failed:`, error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API GET ${endpoint} failed:`, error);
      return {
        error: error instanceof Error ? error.message : 'Network error',
        status: 0
      };
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient('/api');

// Export types
export type { ApiResponse };
