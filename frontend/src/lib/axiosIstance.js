import axios from "axios";
import { refreshToken } from "@/services/auth.services";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

const handleLogout = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    // ⛔ kalau error dari refresh sendiri → STOP
    if (originalRequest.url.includes("/auth/refresh")) {
      handleLogout();
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
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
      // 🔥 INI KUNCI UTAMA
      handleLogout();
      return Promise.reject(err);
    }
  }
);


export default api;
