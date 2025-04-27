import UserContext from "../Context/UserContext";
import { useContext } from "react";
// Custom hook để dễ dàng truy cập thông tin người dùng
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};