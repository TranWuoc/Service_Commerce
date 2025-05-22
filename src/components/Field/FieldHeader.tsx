import React from "react";
import { useUser } from "../../hooks/useUser"; 

export const FieldHeader: React.FC = () => {
  const { user } = useUser(); 

  return (
    <div>
      {/* Kiểm tra nếu có người dùng thì hiển thị tên, nếu không hiển thị mặc định */}
      <div className="text-xl pl-2 font-semibold tracking-normal text-neutral-950">
        Hello, {user?.name || "Người dùng"} {/* Nếu không có tên người dùng thì hiển thị mặc định */}
      </div>
      <div className="text-sm pl-2 tracking-wide text-neutral-500">
        Have a nice day
      </div>
    </div>
  );
};
