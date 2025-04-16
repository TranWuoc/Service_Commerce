"use client";
import * as React from "react";
import { InputField } from "../Shared_components/InputField";
import { AuthToggle } from "./AuthToggle";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Shared_components/Button";
import axiosInstance from "../../api/axiosInstance";
import { useToast } from "../../hooks/use-toast"; // Import useToast
import { useEffect } from "react";

export const LoginForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  
  useEffect(() => {
    console.log("Triggering Toast...");
    toast.toast({
      title: "Test Toast",
      description: "This is a test toast",
      status: "success",
      action: "ADD_TOAST"
    });
  }, []);
  const activeTab = location.pathname === "/register" ? "register" : "login";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn hành vi mặc định của form
    try {
      console.log("Email:", email);
      console.log("Password:", password);

      // Gửi yêu cầu đăng nhập
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      console.log("Login Response:", response.data);

      // Lưu token và refresh token vào localStorage
      if (response.data.access_token && response.data.refresh_token) {
        localStorage.setItem("authToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);

        // Hiển thị thông báo thành công
        toast.toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn trở lại!",
          status: "success",  // Đã thêm status
        });

        // Điều hướng đến dashboard
        navigate("/dashboard");
      } else {
        console.error("Token or refreshToken is missing in the response.");
        toast.toast({
          title: "Đăng nhập thất bại",
          description: "Không tìm thấy token trong phản hồi.",
          status: "error", // Đã thêm status
        });
      }
    } catch (error: any) {
      console.error("Login Error:", error.response?.data?.message || error.message);

      // Hiển thị thông báo lỗi
      toast.toast({
        title: "Đăng nhập thất bại",
        description: error.response?.data?.message || "Sai tài khoản hoặc mật khẩu.",
        status: "error", // Đã thêm status
      });
    }
  };

  return (
    <section className="flex flex-col items-center px-20 py-8 w-full max-md:px-5 max-md:py-6 max-md:w-full h-screen">
      <header className="mb-6 text-base">
        <span>Welcome to </span>
        <span className="text-amber-500">Auto Car</span>
      </header>
      <AuthToggle activeTab={activeTab} />

      <form className="w-full flex flex-col justify-between flex-1" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <InputField
            id="email"
            label="Email"
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Cập nhật state email
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} // Cập nhật state password
          />
          <a href="#" className="text-amber-500 text-base">
            Forgot Password?
          </a>
        </div>

        <div className="mt-auto justify-center flex flex-col items-center">
          <Button
            text={activeTab === "login" ? "Login" : "Register"}
            type="primary"
            customStyle={{ width: "50%", height: "60px" }}
          />
        </div>
      </form>
    </section>
  );
};
