import React, { useState, useRef, useEffect, HTMLInputTypeAttribute } from "react";
import { Eye, EyeOff } from "lucide-react"; // npm install lucide-react

interface InputFieldProps {
  label: string;
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  value: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  customClass?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options?: { value: string; label: string }[];
  [key: string]: any;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder = "",
  value,
  name,
  required = false,
  disabled = false,
  style,
  customClass = "",
  options,
  onChange,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    setShowPassword(false); // Tự động ẩn khi blur
  };

  const renderInput = () => {
    if (options) {
      return (
        <select
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          onChange={onChange}
          className={`px-8 py-0 w-full text-2xl bg-white rounded-xl border-[2.5px] border-neutral-300 h-[40px] text-black-900 placeholder:text-gray-400 max-sm:text-xl max-sm:h-[70px] focus:outline-none focus:border-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${customClass}`}
          style={style}
          {...rest}
        >
          <option value="" disabled>{placeholder || "Chọn một tùy chọn"}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      );
    }

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <div className="relative w-full">
        <input
          ref={inputRef}
          type={inputType}
          name={name}
          placeholder={placeholder}
          value={value}
          required={required}
          disabled={disabled}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={` px-8 pr-10 w-full text-2xl bg-white rounded-xl border-[2.5px] border-neutral-300 h-[40px] text-black-900 placeholder:text-gray-400 max-sm:text-xl max-sm:h-[70px] focus:outline-none focus:border-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${customClass}`}
          style={style}
          {...rest}
        />
        {isPassword && isFocused && (
          <span
            onMouseDown={(e) => e.preventDefault()} // để tránh mất focus
            onClick={togglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-800"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-[900px] mx-auto" style={style}>
      <label className="self-start mb-2 text-xl text-black max-sm:text-xl">
        {label}
      </label>
      {renderInput()}
    </div>
  );
};
