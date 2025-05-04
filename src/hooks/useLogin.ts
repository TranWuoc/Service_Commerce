import axiosInstance from "../api/axiosInstance";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import { ErrorCode, ErrorMessage } from "../enum/enum"; // Import Enum và thông điệp lỗi

export const useLogin = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const { access_token, refresh_token } = response.data;

      // Kiểm tra nếu không có token hoặc user
      if (!access_token || !refresh_token) {
        throw new Error("Dữ liệu đăng nhập không hợp lệ.");
      }

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      toast.toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn trở lại!",
      });

      // Kiểm tra quyền của người dùng
      const userInfo = await axiosInstance.get("/auth/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const { is_admin, role } = userInfo.data;

      // Điều hướng người dùng đến trang admin hoặc dashboard
      if (is_admin || role === "1") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error: any) {
      const errorCode = error.response?.data?.code || ErrorCode.UNCATEGORIZED_EXCEPTION;
      const errorMessage = error.response?.data?.message || ErrorMessage[errorCode];

      console.error("Login error:", errorMessage);

      toast.toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: errorMessage || "Sai tài khoản hoặc mật khẩu, vui lòng thử lại.",
      });
    }
  };

  return { login };
};
