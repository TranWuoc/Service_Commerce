import React from "react";

interface ButtonProps {
  text: string;
  type?: "primary" | "secondary" | "tertiary";
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, type = "primary", onClick }) => {
  const baseStyle =
    "w-full max-w-[600px] mx-auto h-[50px] text-3xl font-bold rounded-xl transition-all duration-300 focus:outline-none max-sm:text-2xl max-sm:h-[70px]";

  // Define styles for primary and secondary buttons
  const styles: Record<string, string> = {
    primary: `${baseStyle} bg-orange-500 text-white shadow-md hover:bg-orange-600 active:bg-orange-700`,
    secondary: `${baseStyle} bg-gray-500 text-white hover:bg-gray-600 active:bg-gray-700`,
    tertiary: `${baseStyle} bg-orange-500 text-white shadow-md hover:bg-orange-600 active:bg-orange-700 h-[30px] w-[300px]`,
  };

  const buttonClass = styles[type] || styles.primary;

  return (
    <button className={buttonClass} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
