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
 <div className="flex items-center  py-3 rounded-2xl w-full gap-4">
  <div className="flex items-center bg-white rounded-xl gap-2 px-3 py-1 h-[50px] w-full max-w-[calc(100%-140px)]">
    <Search className="text-gray-500 flex-shrink-0" />
    <InputField
      type="text"
      placeholder="Tìm kiếm"
      value={searchQuery}
      onChange={(e) => onInputChange(e.target.value)}
      onKeyDown={handleKeyDown}
      style={{
        border: "none",
        boxShadow: "none",
        width: "100%",
        height: "100%",
        fontSize: "1rem",
        padding: "0",
        margin: "0",
        outline: "none",
        backgroundColor: "transparent",
        display: "inline-block",
      }}
      className="flex-1"
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
