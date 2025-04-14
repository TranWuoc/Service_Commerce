"use client";

import Button from "./Button";
import { InputField } from "./InputField";
import { Search } from "@mui/icons-material";

export const SearchBar: React.FC = () => {
  return (
    <div className="relative mb-6">
      <div className="flex items-center justify-between px-5 py-3 rounded-2xl w-full h-[70px] max-md:w-full">
        <div className="flex items-center bg-white rounded-xl gap-2 px-3 py-1 w-full max-w-[600px] h-full">
          <Search className="text-gray-500 flex-shrink-0" />
          <InputField
            type="text"
            placeholder="Tìm kiếm"
            value=""
            style={{
              border: "none",
              boxShadow: "none",
              width: "100%",
              height: "100%",
              fontSize: "1rem",
              padding: "0",
              margin: "0",
              backgroundColor: "transparent",
              display: "inline-block", // Change to inline-block
            }}
            className="flex-1" 
          />
        </div>
        <Button variant="primary" text="Tìm kiếm" className="ml-4" />
      </div>
    </div>
  );
};
