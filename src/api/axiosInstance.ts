import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // Thay bằng URL API của bạn
  timeout: 10000, // Thời gian chờ (timeout) cho mỗi yêu cầu
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    // Chỉ thêm token nếu không phải là yêu cầu đến endpoint công khai
    if (token && config.url && !config.url.includes("/auth/login")) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log("Request Interceptor:", config);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Access token expired or invalid. Attempting to refresh...");

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // Gửi yêu cầu làm mới token
          const response = await axios.post("http://localhost:8000/api/auth/refresh", {
            refreshToken,
          });

          console.log("Refresh Token Response:", response.data); // Kiểm tra phản hồi từ API

          // Lưu token mới vào localStorage
          if (response.data.access_token) {
            localStorage.setItem("authToken", response.data.access_token);
          } else {
            console.error("AccessToken is missing in the refresh response.");
          }

          // Thử lại yêu cầu ban đầu với token mới
          error.config.headers.Authorization = `Bearer ${response.data.access_token}`;
          return axiosInstance.request(error.config);
        } catch (refreshError) {
          console.error("Refresh token expired or invalid:", refreshError);

          // Xóa token và điều hướng đến trang đăng nhập
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          if (window.location.pathname !== "/login") {
            window.location.href = "/login"; // hoặc dùng navigate("/login")
          }
        }
      } else {
        console.warn("No refresh token available. Logging out...");
        // Xóa token và điều hướng đến trang đăng nhập
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login"; // hoặc dùng navigate("/login")
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;