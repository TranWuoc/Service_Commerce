import axiosInstance from "../api/axiosInstance";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  re_password: string;
  address: string;
  phone_number: string;
  avatar?: string; // nếu có thể không bắt buộc
}

export const useRegister = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const register = useCallback(
    async (formData: FormData) => {
      try {
        const res = await axiosInstance.post("/user/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data", // Đảm bảo gửi dữ liệu đúng định dạng multipart
          },
        });

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
