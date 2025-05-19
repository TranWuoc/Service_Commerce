import * as React from "react";

interface DropdownMenuProps {
  label: string;
  placeholder: string;
  options: string[];
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  label,
  placeholder,
  options,
}) => {
  return (
    <div className="flex flex-col items-center w-full max-w-[800px] mx-auto mb-6">
      <label className="self-start mb-2 text-xl text-black max-sm:text-xl">
        {label}
      </label>
      <div className="relative">
        <select className="px-8 py-0 w-full text-2xl bg-white rounded-xl border-solid border-[2.5px] border-neutral-300 h-[40px] text-black max-sm:text-xl max-sm:h-[70px] focus:outline-none focus:border-amber-500">
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
        <i className="ti ti-chevron-down absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
      </div>
    </div>
  );
};
