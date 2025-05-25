import { useState, KeyboardEvent } from "react";
import Button from "./Button";
import { InputField } from "./InputField";
import { Search } from "@mui/icons-material";

interface SearchBarProps {
  searchQuery: string;
  onInputChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onInputChange,
  onSearch,
}) => {
  // Xử lý nhấn Enter
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="relative mb-6">
<div className="flex items-center py-3 rounded-2xl w-full gap-4">
  <div className="flex items-center bg-white rounded-xl px-3 h-[50px] w-full max-w-[calc(100%-140px)]">
    <Search className="text-gray-500 w-5 h-5" />
    <input
      type="text"
      placeholder="Tìm kiếm"
      value={searchQuery}
      onChange={(e) => onInputChange(e.target.value)}
      onKeyDown={handleKeyDown}
      className="ml-2 w-full h-full text-sm placeholder-gray-400 outline-none border-none bg-transparent"
    />
  </div>

  <Button
    variant="primary"
    text="Tìm kiếm"
    onClick={onSearch}
    className="h-[50px] px-4"
  />
</div>

    </div>
  );
};
