import api from "@/lib/axiosIstance.js";

export const register = async (payload) => {
  return api.post("/auth/register", payload);
};

export const login = async (payload) => {
  const res = await api.post("/auth/login", payload);

  // ← simpan token setelah login berhasil
  localStorage.setItem('access_token', res.data.access_token);
  localStorage.setItem('refresh_token', res.data.refresh_token);

  return res.data;
};

export const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refresh_token');

  // ← pakai api instance, bukan axios langsung
  const res = await api.post("/auth/refresh", {}, {
    headers: {
      Authorization: `Bearer ${refresh_token}`,
    },
  });

  // ← update token yang baru (token rotation)
  localStorage.setItem('access_token', res.data.access_token);
  localStorage.setItem('refresh_token', res.data.refresh_token);

  return res.data;
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } catch {
    // ignore
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = "/login";
  }
};