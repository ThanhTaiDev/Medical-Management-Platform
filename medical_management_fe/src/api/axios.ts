import axios from "axios";

// Cấu hình base URL cho API requests
// Nếu VITE_API_URL không có /api ở cuối, tự động thêm
const envUrl = import.meta.env.VITE_API_URL || "http://localhost:9900";
const baseURL = envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`;

// Tạo axios instance với cấu hình mặc định
export const axiosInstance = axios.create({
  baseURL,
  timeout: 30000, // 30 giây timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can add auth token here
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors here
    if (error.response?.status === 401) {
      // TODO: REMOVE THIS CHECK - TEMPORARY BYPASS FOR TESTING
      // Only redirect if we're not in bypass mode (have token)
      const token = localStorage.getItem("accessToken");
      if (token) {
        // Only redirect if we had a token (real auth failure)
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";
      }
      // If no token, just reject without redirect (bypass mode)
    }
    return Promise.reject(error);
  }
);
