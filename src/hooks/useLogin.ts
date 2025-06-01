// src/hooks/useLogin.ts
import { jwtDecode } from "jwt-decode";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

export const useLogin = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const { access_token, refresh_token } = response.data;

      if (!access_token || !refresh_token) {
        throw new Error("Dữ liệu đăng nhập không hợp lệ.");
      }

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      const decodedToken: any = jwtDecode(access_token);
      const isAdmin = decodedToken.sub === "admin_000";

      // Lấy thông tin người dùng
      const userInfo = await axiosInstance.get("/auth/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      localStorage.setItem("user", JSON.stringify(userInfo.data));
      localStorage.setItem("isAdmin", isAdmin ? "true" : "false");
      setUser(userInfo.data);

      toast.toast({
        title: "Đăng nhập thành công",
        variant: "success",
        description: "Chào mừng bạn trở lại!",
      });

      navigate(isAdmin ? "/admin" : "/dashboard");
    } catch (error: any) {
      toast.toast({
        variant: "destructive",
        title: `Lỗi ${error.response?.data?.code || "Đăng nhập thất bại"}`,
        description: error.response?.data?.message || "Vui lòng thử lại.",
      });
    }
  };

  return { login };
};
