import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 20000,
});

let isRefreshing = false;
let failedQueue: { resolve: Function; reject: Function }[] = [];

const openRoutes = ["/", "/login", "/register", "/dashboard/vnpay-return", "/dashboard/fieldinfo"];

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    const currentPath = window.location.pathname;
    const isOpenRoute = openRoutes.includes(currentPath);

    if (!isOpenRoute && !token) {
      console.warn("🚫 Không có token. Chuyển hướng login.");
      window.location.href = "/login";
      return Promise.reject(new Error("Chưa đăng nhập"));
    }

    if (!isOpenRoute && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("🔃 Request:", config);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const currentPath = window.location.pathname;
    const isOpenRoute = openRoutes.includes(currentPath);
    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh") &&
      !isOpenRoute
    ) {
    

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      const accessToken = localStorage.getItem("authToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          isRefreshing = true;

          const res = await axios.post(
            "http://localhost:8000/api/auth/refresh",
            {
              access_token: accessToken,
              refresh_token: refreshToken,
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
              },
            }
          );

          console.log("✅ Refresh thành công:", res.data);

          const newToken = res.data.access_token;
          localStorage.setItem("authToken", newToken);
          localStorage.setItem("refreshToken", res.data.refresh_token);

          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

          failedQueue.forEach(({ resolve }) => resolve(axiosInstance(originalRequest)));
          failedQueue = [];
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error("❌ Refresh token lỗi:", refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      console.warn("❌ Không thể refresh. Chuyển hướng login.");
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");

      if (window.location.pathname !== "/login") {
        // Nếu không ở trang login, chuyển hướng về login
        window.location.href = "/login";
      }

      failedQueue.forEach(({ reject }) => reject(error));
      failedQueue = [];

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Hàm xử lý login Google
export const googleLogin = async () => {
  try {
    const res = await axios.get("http://localhost:8000/google/login");

    // Lấy token từ response
    const { access_token, refresh_token } = res.data;

    if (access_token && refresh_token) {
      // Lưu token vào localStorage
      localStorage.setItem("authToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      // Chuyển hướng đến dashboard
      window.location.href = "/dashboard";
    } else {
      throw new Error("Dữ liệu đăng nhập không hợp lệ");
    }
  } catch (error) {
    console.error("❌ Đăng nhập Google lỗi:", error);
    throw error;
  }
};

export default axiosInstance;
