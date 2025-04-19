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
  
 
  const activeTab = location.pathname === "/register" ? "register" : "login";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
  
      const { access_token, refresh_token, user } = response.data;
  
      if (access_token && refresh_token) {
        localStorage.setItem("authToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);
        localStorage.setItem("user", JSON.stringify(user)); 
  
        toast.toast({
          variant: "sucess",
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn trở lại!",
         
        });
        const userInfo = await axiosInstance.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
  
        const { is_admin, role } = userInfo.data;
  

        if (is_admin || role === "1") {
          console.log("Admin user detected, redirecting to admin dashboard.");
          navigate("/admin"); // Điều hướng đến trang Admin
        } else {
          console.log("Non-admin user detected, redirecting to user dashboard.");
          navigate("/dashboard"); // Điều hướng đến trang người dùng
        }
      } else {
        toast.toast({
          variant: "destructive",
          title: "Đăng nhập thất bại",
          description: "Không tìm thấy token trong phản hồi.",
        });
      }
    } catch (error: any) {
      console.error("Login Error:", error.response?.data?.message || error.message);
  
      toast.toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: error.response?.data?.message || "Sai tài khoản hoặc mật khẩu.",
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
