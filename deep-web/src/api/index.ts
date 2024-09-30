import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

const createApiInstance = (baseURL: string | undefined): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${baseURL}/api`,
  });
  instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("t");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.withCredentials = true;
    return config;
  });
  return instance;
};

export const modelApi = createApiInstance(import.meta.env.VITE_MODEL_BASE_URL);

export const getEventsEndpoint = (endpoint: string) => {
  return `${import.meta.env.VITE_MODEL_BASE_URL}/api/${endpoint}`;
};
