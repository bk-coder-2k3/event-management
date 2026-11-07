import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '@kalyanaconnect/shared';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

// In-memory token storage (XSS resistant, paired with HttpOnly refresh cookies)
let accessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = (): string | null => {
  return accessToken;
};

// Create configured Axios instance
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Send httpOnly refresh cookie automatically
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 1. Axios Request Interceptor
 * Injects Authorization Bearer header and handles multipart uploads
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // If sending FormData (e.g., image gallery upload), let browser calculate boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Mutex-protected Silent Token Refresh Function
 */
const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      // Direct POST to /auth/refresh bypassing 401 interceptor loop
      const res = await axios.post<ApiResponse<{ accessToken: string }>>(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );

      if (res.data?.success && res.data.data?.accessToken) {
        const freshToken = res.data.data.accessToken;
        setAccessToken(freshToken);
        return freshToken;
      }

      setAccessToken(null);
      return null;
    } catch {
      setAccessToken(null);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

/**
 * 2. Axios Response Interceptor
 * Detects 401 Unauthorized, automatically refreshes token, and retries the original request
 */
interface RetryableAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableAxiosRequestConfig | undefined;

    // If 401, token is present, and we haven't already retried this request
    if (
      error.response?.status === 401 &&
      accessToken &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      originalRequest._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // Re-execute request with new token
        return axiosInstance(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * High-Level API Wrapper
 * Guarantees type safety and backwards compatibility with all portal views
 */
class ApiClient {
  setToken(token: string | null) {
    setAccessToken(token);
  }

  getToken(): string | null {
    return getAccessToken();
  }

  async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    config: any = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.request<ApiResponse<T>>({
        method,
        url: endpoint,
        data,
        ...config,
      });

      return response.data;
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.response?.data) {
          return err.response.data as ApiResponse<T>;
        }
        return {
          success: false,
          error: {
            code: `HTTP_${err.response?.status || 'NETWORK_ERROR'}`,
            message: err.message || 'Network request failed',
          },
        };
      }

      return {
        success: false,
        error: {
          code: 'UNEXPECTED_ERROR',
          message: err?.message || 'An unexpected error occurred',
        },
      };
    }
  }

  get<T>(endpoint: string, config?: any) {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  post<T>(endpoint: string, body?: any, config?: any) {
    return this.request<T>('POST', endpoint, body, config);
  }

  patch<T>(endpoint: string, body?: any, config?: any) {
    return this.request<T>('PATCH', endpoint, body, config);
  }

  delete<T>(endpoint: string, config?: any) {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }
}

export const api = new ApiClient();
export default axiosInstance;
