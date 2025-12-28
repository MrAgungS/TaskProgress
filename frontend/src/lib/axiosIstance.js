import axios from "axios";
import { refreshToken } from "@/services/auth.services";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
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
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ⛔ if not 401 → STOP
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ⛔ DELETE NEVER ALLOW RETRY
    if (originalRequest.method === "delete") {
      return Promise.reject(error);
    }

    // ⛔ refresh token failed → logout
    if (originalRequest.url.includes("/auth/refresh")) {
      handleLogout();
      return Promise.reject(error);
    }

    // ⛔ prevent infinite loops
    if (originalRequest._retry) {
      handleLogout();
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      await refreshToken();
      return api(originalRequest); // only GET / POST
    } catch (err) {
      handleLogout();
      return Promise.reject(err);
    }
  }
);



export default api;
