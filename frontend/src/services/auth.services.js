import api from "@/lib/axiosIstance";

export const register = async(payload) => {
    const res = await api.post("auth/register", payload);
    return res.data
}
export const login = async(payload) => {
    const res = await api.post("auth/login", payload);
    
    return res.data
}
export const refreshToken = async(payload) => {
    const res = await api.post("auth/refresh", payload);
    return res.data  
}
export const logout = async(payload) => {
    const res = await api.post("auth/logout", payload);
    return res.data
}