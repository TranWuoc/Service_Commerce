import * as React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
<<<<<<< HEAD
  className?: string;
  rightIcon?: React.ReactNode;
=======
  value: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
>>>>>>> master
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder,
<<<<<<< HEAD
  className,
  rightIcon
=======
  value,
  name,
  required = false,
  disabled = false,
  style,
  onChange,
>>>>>>> master
}) => {
  return (
    <div
      className="flex flex-col items-center w-full max-w-[600px] mx-auto mb-6"
      style={style}
    >
      <label className="self-start mb-2 text-xl text-black max-sm:text-xl">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
<<<<<<< HEAD
      <div className="relative w-full">
        <input
          type={type}
          placeholder={placeholder}
          className="px-8 pr-12 py-0 w-full text-2xl bg-white rounded-xl border-solid border-[2.5px] border-neutral-300 h-[40px] text-black-300 max-sm:text-xl max-sm:h-[70px] focus:outline-none focus:border-amber-500"
        />
        {rightIcon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
=======
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
        className="px-8 py-0 w-full text-2xl bg-white rounded-xl border-solid border-[2.5px] border-neutral-300 h-[40px] text-black-900 placeholder:text-gray-400 max-sm:text-xl max-sm:h-[70px] focus:outline-none focus:border-amber-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        style={style}
      />
>>>>>>> master
    </div>
  );
};
