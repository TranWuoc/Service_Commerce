import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useAuth();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) {
      setError("Không tìm thấy mã xác thực (code)");
      return;
    }

    const handleLogin = async () => {
      try {
        const response = await axios.post("http://localhost:8000/auth/google/login", { code });
        const { access_token, refresh_token } = response.data;

        if (!access_token || !refresh_token) {
          setError("Không nhận được token từ Google.");
          return;
        }

        localStorage.setItem("authToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);

        // Lấy thông tin người dùng
        const userInfoResponse = await axiosInstance.get("/auth/profile", {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        const userData = userInfoResponse.data;
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData); // Cập nhật AuthContext

        navigate("/dashboard");
      } catch (err: any) {
        setError("Đăng nhập bằng Google thất bại.");
        console.error(err);
      }
    };

    handleLogin();
  }, [searchParams, navigate, setUser]);

  if (error) return <p className="text-red-500">{error}</p>;

  return <p>Đang xử lý đăng nhập...</p>;
};
