// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu của người dùng
interface User {
  id: string;
  name: string;
  email: string;
  email_verified_at: string | null;
  phone_number: string;
  address: string;
  status: string;
  is_admin: boolean;
}

// Khởi tạo context cho người dùng
const UserContext = createContext<{ user: User | null; setUser: React.Dispatch<React.SetStateAction<User | null>> } | undefined>(undefined);

// Tạo provider để cung cấp state người dùng cho toàn bộ ứng dụng
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Ban đầu người dùng là null (chưa đăng nhập)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook để dễ dàng truy cập thông tin người dùng
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
