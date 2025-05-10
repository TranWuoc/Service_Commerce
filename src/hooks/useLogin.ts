import axiosInstance from "../api/axiosInstance";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import { useUser } from "./useUser"; 

export const useLogin = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useUser(); 
  const login = async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", { email, password });
      const { access_token, refresh_token } = response.data;

      if (!access_token || !refresh_token) {
        throw new Error("Dữ liệu đăng nhập không hợp lệ.");
      }

      localStorage.setItem("authToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      toast.toast({
        title: "Đăng nhập thành công",
        description: "Chào mừng bạn trở lại!",
      });

      const userInfo = await axiosInstance.get("/auth/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      localStorage.setItem("user", JSON.stringify(userInfo.data));
      setUser(userInfo.data); // 👈 cập nhật context

      const { is_admin, role } = userInfo.data;
      if (is_admin || role === "1") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (error: any) {
      const backendCode = error.response?.data?.code || "UNKNOWN_ERROR";
      const backendMessage = error.response?.data?.message || "Đã xảy ra lỗi không xác định.";

      toast.toast({
        variant: "destructive",
        title: `Lỗi ${backendCode}`,
        description: backendMessage,
      });
    }
  };

  return { login };
};

