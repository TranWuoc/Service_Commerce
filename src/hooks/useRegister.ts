import axiosInstance from "../api/axiosInstance";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useRegister = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const register = useCallback(
    async ({ name, email, password }: { name: string; email: string; password: string }) => {
      try {
        const res = await axiosInstance.post("/user/create", { name, email, password });

        toast.toast({
          title: "Đăng ký thành công!",
          description: "Bạn có thể đăng nhập ngay bây giờ.",
        });

        navigate("/login");
      } catch (error: any) {
        const backendCode = error.response?.data?.code || "UNKNOWN_ERROR";
        const backendMessage = error.response?.data?.message || "Đã xảy ra lỗi khi tạo tài khoản.";

        toast.toast({
          variant: "destructive",
          title: `Lỗi ${backendCode}`,
          description: backendMessage,
        });
      }
    },
    [navigate, toast]
  );

  return { register };
};
