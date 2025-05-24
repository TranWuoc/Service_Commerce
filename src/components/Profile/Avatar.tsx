// src/components/AvatarMenu.tsx
import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  Avatar,
  IconButton,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export const AvatarMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, setUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  // Lấy profile mới nhất, cập nhật context, rồi chuyển trang Profile
  const handleViewProfile = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const res = await axiosInstance.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem(
        "isAdmin",
        res.data.id === "admin_000" ? "true" : "false"
      );

      if (res.data.id === "admin_000") {
        navigate("/admin/Profile", { state: res.data });
      } else {
        navigate("/dashboard/Profile", { state: res.data });
      }
      handleClose();
    } catch (error: any) {
      if (error.response?.status === 401) {
        await logout();
        navigate("/login");
      } else {
        console.error("Failed to fetch profile", error);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    handleClose();
  };

  return (
    <div className="flex items-center space-x-2">
      <Avatar
        alt={user?.name || "User"}
        src={user?.avatar ? `http://localhost:8000/${user.avatar}` : "profile-image.jpg"}
        sx={{ width: 40, height: 40 }}
      />
      <span className="font-medium text-gray-800">{user?.name || "Loading..."}</span>
      <IconButton onClick={handleClick}>
        <ArrowDropDownIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MenuItem onClick={handleViewProfile}>Xem thông tin tài khoản</MenuItem>
        <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
      </Menu>
    </div>
  );
};
