// UserContext.ts
import { createContext, useContext } from 'react';
import { User } from '../types/User'; // Import kiểu dữ liệu người dùng từ UserType

// Định nghĩa context cho người dùng
const UserContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
} | undefined>(undefined);

// Custom hook để dễ dàng truy cập thông tin người dùng
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
