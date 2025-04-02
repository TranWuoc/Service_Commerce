"use client";
import * as React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder,
}) => {
  return (
    <div className="mb-8 w-[480px] max-md:w-full max-md:max-w-[480px]">
      <label className="mb-0.5 text-2xl text-black max-sm:text-xl">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="px-6 py-0 w-full text-2xl bg-white rounded-xl border-solid border-[2.5px] border-neutral-300 h-[70px] text-neutral-300 max-sm:text-lg max-sm:h-[60px]"
      />
    </div>
  );
};
export default InputField;