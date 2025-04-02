import React, { useState } from 'react';

interface TextInputProps {
  placeholder?: string;
  type?: "text" | "email" | "password";
  onChange?: (value: string) => void;
  width?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  placeholder = "Nhập nội dung...",
  type = "text",
  onChange,
  width = "w-full",
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onChange(event.target.value);
  };

  const baseStyle =
    "p-2 rounded-lg transition-all duration-300 focus:outline-none";

  const styles: Record<string, string> = {
    text: `${baseStyle} bg-white text-gray-700 shadow-md`,
    email: `${baseStyle} bg-white text-gray-700 shadow-md`,
    password: `${baseStyle} bg-white text-gray-700 shadow-md`,
  };

  const inputClass = styles[type] || styles.text;

  return (
    <div className="bg-white text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="flex items-center">
          <input
            type={type}
            placeholder={placeholder}
            className={`${inputClass} ${width} px-4 py-2`}
            value={inputValue}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TextInput;