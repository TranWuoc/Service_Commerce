import * as React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Shared_components/Button";

interface CommentHeaderProps {
  onClose: () => void;
  fieldInfo: any; // Thay đổi kiểu dữ liệu phù hợp với fieldInfo
}

export const CommentHeader: React.FC<CommentHeaderProps> = ({
  onClose,
  fieldInfo,
}) => {
  const navigate = useNavigate();


  return (
    <header className="relative pt-9 pr-16 pb-14 pl-20 w-full text-4xl font-semibold text-center text-amber-500 bg-black shadow-none rounded-[50px_50px_0px_0px] max-md:px-5 max-md:max-w-full border-none m-0">
      <Button
        text=""
        type="tertiary"
        onClick={onClose} // Gọi hàm handleBackClick khi nhấn nút
        customStyle={{
          position: "absolute",
          top: "16px",
          right: "16px",
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          padding: "0",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12'/%3E%3C/svg%3E")`,
          backgroundSize: "60%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundColor: "grey",
          boxShadow: "none",
          transition: "background-color 0.3s ease",
        }}
      />
      Bình luận
    </header>
  );
};