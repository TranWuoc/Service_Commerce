import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000, // 10 giây
});

let isRefreshing = false; // Biến đánh dấu xem có đang làm mới token hay không
let failedQueue: { resolve: Function; reject: Function }[] = []; // Hàng đợi các yêu cầu bị lỗi 401

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token && config.url && !config.url.includes("/auth/login")) {
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

    // Nếu nhận được lỗi 401 và yêu cầu chưa thử làm mới token, cũng không phải yêu cầu refresh token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      console.warn("⚠️ Token hết hạn. Đang thử refresh...");

      if (isRefreshing) {
        // Nếu đang refresh, thêm yêu cầu vào hàng đợi
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }

      const accessToken = localStorage.getItem("authToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          isRefreshing = true; // Đánh dấu là đang làm mới token

          const res = await axios.post("http://localhost:8000/api/auth/refresh", {
            access_token: accessToken,
            refresh_token: refreshToken,
          }, {
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          });

          console.log("✅ Refresh thành công:", res.data);

          const newToken = res.data.access_token;
          localStorage.setItem("authToken", res.data.access_token);
          localStorage.setItem("refreshToken", res.data.refresh_token);

          // Cập nhật token vào headers mặc định
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

          // Retry tất cả các yêu cầu trong hàng đợi
          failedQueue.forEach(({ resolve }) => resolve(axiosInstance(originalRequest)));
          failedQueue = []; // Xóa hàng đợi

          return axiosInstance(originalRequest); // Gửi lại yêu cầu gốc với token mới
        } catch (refreshError) {
          console.error("❌ Refresh token lỗi:", refreshError);

          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");

          // Điều hướng đến trang đăng nhập nếu có lỗi
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }

          // Reject tất cả các yêu cầu trong hàng đợi
          failedQueue.forEach(({ reject }) => reject(refreshError));
          failedQueue = []; // Xóa hàng đợi
        } finally {
          isRefreshing = false; // Reset trạng thái sau khi làm mới token xong
        }
      } else {
        console.warn("❌ Không có refresh token. Chuyển hướng login.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");

        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }

        // Reject tất cả các yêu cầu trong hàng đợi
        failedQueue.forEach(({ reject }) => reject(error));
        failedQueue = []; // Xóa hàng đợi
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
