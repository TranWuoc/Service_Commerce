// UserProvider.tsx
import React, { useState } from 'react';
import UserContext from '../Context/UserContext'; // Import kiểu dữ liệu người dùng từ UserType
import { User } from '../types/User'; // Import context
import { useEffect } from 'react';
// Tạo provider để cung cấp state người dùng cho toàn bộ ứng dụng
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Lấy user từ localStorage khi load lần đầu
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
