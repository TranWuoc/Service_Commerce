import React from "react";
import { useUser } from "../../Context/UserContext"; // Đảm bảo import useUser

export const FieldHeader: React.FC = () => {
  const { user } = useUser(); // Lấy thông tin người dùng từ context

  return (
    <div>
      {/* Kiểm tra nếu có người dùng thì hiển thị tên, nếu không hiển thị mặc định */}
      <div className="text-xl font-semibold tracking-normal text-neutral-950">
        Hello, {user?.name || "Jonitha"} {/* Nếu không có tên người dùng thì hiển thị mặc định */}
      </div>
      <div className="text-sm tracking-wide text-neutral-500">
        Have a nice day
      </div>
    </div>
  );
};
