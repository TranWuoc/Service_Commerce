import { jwtDecode } from "jwt-decode";
import { useToast} from "./use-toast";
import { useUser } from "./useUser";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext"; 
export const useLogin = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { setUser } = useUser();
const { checkAuth } = useAuth();
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
        variant: "success",
        description: "Chào mừng bạn trở lại!",
      });
      await checkAuth();
      // Giải mã access_token
      const decodedToken: any = jwtDecode(access_token);
      console.log(decodedToken);

      if (decodedToken.sub === "admin_000") {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin");
      } else {
        localStorage.setItem("isAdmin", "false");
        navigate("/dashboard");
      }

      const userInfo = await axiosInstance.get("/auth/profile", {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      localStorage.setItem("user", JSON.stringify(userInfo.data));
      setUser(userInfo.data);

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