import axios, { AxiosError } from 'axios';
import { STORAGE_KEYS } from '@/config/constants';
import type { APIError } from '@/types/api';

// Foundation API boundary — the frontend only ever talks to the Go backend here.
// Never call Gemini or any AI provider directly from the browser; AI-related
// requests must go through /api/v1/ai/* on this same client (see AI-ARCHITECTURE.md).
// Base path corrected to match what go-template-main's router actually serves today
// (router/sampleRouter.go mounts `/api`, unversioned) -- API versioning is still an open
// decision (COMPANY-FOUNDATION-BASELINE.md Sec5.1 target: `/api/v1` on both sides before any
// external client depends on it), not resolved by this fix. This only corrects a mismatch that
// would otherwise 404 every real request from HttpAssetRepository.
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<APIError>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
