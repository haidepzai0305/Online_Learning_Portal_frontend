import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const REFRESH_PATH = import.meta.env.VITE_AUTH_REFRESH_PATH ?? "/auth/token/refresh/";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: Tự động đính kèm Token vào mỗi yêu cầu
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Xử lý lỗi 401 (Hết hạn Token)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 và chưa thử refresh lần nào
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          // Gọi API refresh token
          const res = await axios.post(`${API_BASE_URL}${REFRESH_PATH}`, {
            refresh: refreshToken,
          });

          const { access } = res.data;
          localStorage.setItem("access_token", access);

          // Thử gọi lại request cũ với token mới
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Nếu refresh cũng lỗi (hết hạn cả refresh token) -> Logout luôn
          localStorage.clear();
          window.location.href = "/auth";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
