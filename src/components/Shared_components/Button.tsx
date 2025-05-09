import React from "react";

interface ButtonProps {
  text: string;
  type?: "primary" | "secondary" | "tertiary";
  onClick: () => void;
  customStyle?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  text,
  type = "primary",
  onClick,
  customStyle,
}) => {
  const baseStyle =
    "font-semibold text-white h-[50px] rounded-[110px] shadow-[0px_0px_4.3px_rgba(0,0,0,0.25)] transition-all duration-300 focus:outline-none";

  const styles: Record<string, string> = {
    primary: `${baseStyle} bg-amber-500 hover:bg-amber-600 active:bg-amber-700 w-[180px] text-lg`,
    secondary: `${baseStyle} bg-gray-500 hover:bg-gray-600 active:bg-gray-700 w-[180px] text-lg`,
    tertiary: `${baseStyle} bg-amber-500 hover:bg-amber-600 active:bg-amber-700 w-[180px] text-lg`,
  };

  const buttonClass = styles[type] || styles.primary;

  return (
    <button className={buttonClass} onClick={onClick} style={customStyle}>
      {text}
    </button>
  );
};

export default Button;
