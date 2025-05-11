import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance";

export const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");
    console.log("code", code);
    if (!code) {
      setError("Không tìm thấy mã xác thực (code)");
      return;
    }

    const handleLogin = async () => {
      try {
        // Gửi code về backend để đổi lấy access token
        const response = await axios.post("http://localhost:8000/auth/google/login", { code });

        const { access_token, refresh_token } = response.data;

        if (!access_token || !refresh_token) {
          setError("Không nhận được token từ Google.");
          return;
        }
        localStorage.setItem("authToken", access_token);
        localStorage.setItem("refreshToken", refresh_token);


        const userInfoResponse = await axiosInstance.get("/auth/profile", {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        localStorage.setItem("user", JSON.stringify(userInfoResponse.data));


        navigate("/dashboard");
      } catch (err: any) {
        
      }
    };

    handleLogin();
  }, [searchParams, navigate]);

  if (error) return <p className="text-red-500">{error}</p>;

  return <p>Đang xử lý đăng nhập...</p>;
};
