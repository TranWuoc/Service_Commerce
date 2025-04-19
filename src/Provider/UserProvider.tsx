// UserProvider.tsx
import React, { useState } from 'react';
import { ReactNode } from 'react';
import UserContext from '../Context/UserContext'; // Import kiểu dữ liệu người dùng từ UserType
import { User } from '../types/User'; // Import context

// Tạo provider để cung cấp state người dùng cho toàn bộ ứng dụng
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Ban đầu người dùng là null (chưa đăng nhập)

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
