import axiosInstance from "../api/axiosInstance";
import { useToast } from "./use-toast";
import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

export const useRegister = () => {
    const toast = useToast();
    const navigate = useNavigate();
  
    const register = useCallback(async ({ name, email, password }: {
      name: string;
      email: string;
      password: string;
    }) => {
      try {
        const res = await axiosInstance.post("/user/create", {
          name,
          email,
          password,
        });
  
        toast.toast({
          title: "Đăng ký thành công!",
          description: "Bạn có thể đăng nhập ngay bây giờ.",
        });
  
        navigate("/login");
      } catch (error: any) {
        toast.toast({
          title: "Đăng ký thất bại",
          description: error.response?.data?.message || "Đã xảy ra lỗi khi tạo tài khoản.",
        });
      }
    }, [navigate, toast]);
  
    return { register };
  };
  
