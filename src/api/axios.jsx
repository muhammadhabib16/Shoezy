import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// Interceptor untuk MENAMBAHKAN accessToken ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk MENANGANI accessToken yang kedaluwarsa
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Jika error adalah 401 (Unauthorized) dan ini BUKAN request untuk refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Tandai agar tidak mengulang tanpa henti

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        // Panggil endpoint untuk refresh token
        const rs = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`,
          {
            refreshToken: refreshToken,
          }
        );

        const { accessToken } = rs.data;
        localStorage.setItem("accessToken", accessToken);

        // Perbarui header di instance axios default
        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        // Ulangi request yang gagal dengan token baru
        return api(originalRequest);
      } catch (_error) {
        // Jika refresh token juga gagal, logout pengguna
        console.error("Sesi habis, silakan login kembali.", _error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login"; // Redirect paksa
        return Promise.reject(_error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
