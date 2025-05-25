// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axiosInstance from "../api/axiosInstance"; // Đường dẫn tùy dự án

interface User {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      console.log("CheckAuth - response.data:", response.data);
    } catch (error) {
      console.error("Auth check failed", error);
      setUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout"); // Optional: gọi API logout
    } catch (error) {
      console.warn("Logout request failed (safe to ignore)", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
      setUser(null);
    }
  };
  useEffect(() => {
    checkAuth();

    // Tự động check lại khi localStorage thay đổi (như đăng xuất tab khác)
    const onStorageChange = (event: StorageEvent) => {
      if (event.key === "authToken") {
        checkAuth();
      }
    };
    window.addEventListener("storage", onStorageChange);

    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, setUser, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
