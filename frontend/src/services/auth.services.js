import api from "@/lib/axiosIstance";
import axios from "axios";

export const register = async() => {
    const res = await api.post("/auth/register", );
    return res.data.data
}
export const login = async() => {
    const res = await api.post("/auth/login");
    
    return res.data
}
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