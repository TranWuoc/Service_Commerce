import * as React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  className?: string;
  rightIcon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder,
  className,
  rightIcon
}) => {
  return (
    <div className="flex flex-col items-center w-full max-w-[600px] mx-auto mb-6">
      <label className="self-start mb-2 text-xl text-black max-sm:text-xl">
        {label}
      </label>
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
    </div>
  );
};
