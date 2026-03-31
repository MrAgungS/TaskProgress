import axios from "axios";
import { refreshToken } from "@/services/auth.services";

const api = axios.create({
  baseURL: "http://localhost:3030/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

const handleLogout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  }
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    if (originalRequest.method === "delete") {
      return Promise.reject(error);
    }
    if (originalRequest.url.includes("/auth/refresh")) {
      handleLogout();
      return Promise.reject(error);
    }
    if (originalRequest._retry) {
      handleLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshToken();
      return api(originalRequest);
    } catch (err) {
      handleLogout();
      return Promise.reject(err);
    }
  },
);

export default api;
