
import axiosInstance from "../api/axiosInstance";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const { access_token, refresh_token, user } = response.data;

      if (!access_token || !refresh_token) {
        throw new Error("Token không hợp lệ.");
      }

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn trở lại!",
      });

      const userInfo = await axiosInstance.get("/auth/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      const { is_admin, role } = userInfo.data;

      if (is_admin || role === "1") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error: any) {
      console.error("Login error:", error.response?.data?.message || error.message);
      toast.toast({
        title: "Đăng nhập thất bại",
        description: error.response?.data?.message || "Sai tài khoản hoặc mật khẩu.",
      });
    }
  };

  return { login };
};
