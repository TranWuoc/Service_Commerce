"use client";

import { useNavigate } from "react-router-dom";
import { InputField } from "../Shared_components/InputField";
import { DropdownMenu } from "../Shared_components/DropdownMenu";
import Button from "../Shared_components/Button";
import { FieldList } from "../Field/FieldList";

export function FieldsSummary() {
  const navigate = useNavigate();

  const handleFieldClick = (field) => {
    navigate("/FieldInfo", { state: field });
  };

  return (
    <div className="w-full">
      {/* Form Section */}
      <form className="w-full bg-white p-4">
        <div className="flex justify-between items-end gap-4 mb-4">
          <div className="w-[30%]">
            <InputField
              label="Pick Up Address"
              placeholder="Start Destination"
              className="!py-1 !px-2 !text-xs !h-8"
            />
          </div>
          <div className="w-[30%]">
            <InputField
              label="Drop off Address"
              placeholder="End Destination"
              className="!py-1 !px-2 !text-xs !h-8"
            />
          </div>
          <div className="w-[30%]">
            <DropdownMenu
              label="Field Size"
              placeholder="Select Field Size"
              options={["5-a-side", "7-a-side", "11-a-side"]}
            />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            type="tertiary"
            text="Search"
            onClick={() => {
              console.log("Search button clicked");
            }}
          />
        </div>
      </form>


      <FieldList />
    </div>
  );
}
