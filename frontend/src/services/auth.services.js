import api from "@/lib/axiosIstance";
import axios from "axios";

export const register = async(payload) => {
  return api.post("/auth/register",payload );
}
export const login = async (payload) => {
  return api.post("/auth/login", payload);
};
export const refreshToken = async() => {
    return axios.post(
        "http://localhost:5000/api/auth/refresh",
        {},
        { withCredentials: true }
    );
}
export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    // ignore
  } finally {
    window.location.href = "/login";
  }
};