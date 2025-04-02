    import React from "react";

    interface ButtonProps {
      text: string;
      type?: "primary" | "secondary";
      onClick: () => void;
    }

    const Button: React.FC<ButtonProps> = ({ text, type = "primary", onClick }) => {
      const baseStyle =
        "px-6 py-2 text-lg font-bold rounded-lg transition-all duration-300 focus:outline-none";

      // Định nghĩa các kiểu button cho 'primary' và 'secondary'
      const styles: Record<string, string> = {
        primary: `${baseStyle} bg-orange-500 text-white shadow-md hover:bg-orange-600 active:bg-orange-700`,
        secondary: `${baseStyle} bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700`,
      };

      // Nếu type không phải 'primary' hoặc 'secondary', mặc định sẽ chọn 'primary'
      const buttonClass = styles[type] || styles.primary;

      return (
        <button className={buttonClass} onClick={onClick}>
          {text}
        </button>
      );
    };

    export default Button;
