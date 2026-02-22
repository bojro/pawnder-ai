import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { useAppStore } from '../store/useAppStore';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const { adopterId } = useAppStore.getState();
  if (adopterId) {
    config.headers['X-Adopter-Id'] = adopterId;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message =
      (error.response?.data as { message?: string })?.message ||
      error.message ||
      'An unexpected error occurred';
    console.error('[API Error]', message);
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
