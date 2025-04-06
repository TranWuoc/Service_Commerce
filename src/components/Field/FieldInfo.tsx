import React from "react";
import type { FieldInfo } from "../../types/Field";
import PhoneIcon from "@mui/icons-material/Phone";
import SportsIcon from "@mui/icons-material/Sports";  // Icon sân bóng
import LocationOnIcon from "@mui/icons-material/LocationOn";  // Icon vị trí
import Button from "../Shared_components/Button";  // Import Button

interface FieldInfoProps {
  fieldInfo: FieldInfo;
}

const FieldInfo: React.FC<FieldInfoProps> = ({ fieldInfo }) => {
  return (
    <div className="self-stretch w-full max-md:mt-10">
      <div className="flex flex-col py-4 px-4 w-full bg-white rounded-[30px] shadow-[0px_0px_15px_rgba(0,0,0,0.15)]">
        {/* Bảng chứa tên sân, số điện thoại và vị trí */}
        <div className="flex flex-col w-full">
          {/* Tên sân */}
          <div className="flex gap-2 text-lg text-slate-800">
            <div className="font-medium">{fieldInfo.name}</div>
          </div>
          
          {/* Số điện thoại */}
          <div className="flex items-center gap-2 mt-2 text-base text-gray-600">
            <PhoneIcon className="w-5 h-5 text-gray-600" />
            <span>{fieldInfo.phone || "0933290303"}</span>
          </div>
          
          {/* Vị trí sân */}
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
            <LocationOnIcon className="w-5 h-5 text-yellow-500" />
            <span>{fieldInfo.location}</span>
          </div>
        </div>

        <div className="relative mt-3 w-3/5 pb-[20%] rounded-lg overflow-hidden"></div>

        {/* Bảng chứa Giá sân và Kiểu sân */}
        <div className="flex justify-between mt-3 text-sm w-full items-center">
          <div className="flex flex-col items-center w-1/2">
            <div className="font-semibold uppercase text-stone-300 flex items-center">
              <SportsIcon className="w-5 h-5 text-gray-600 mr-2" />
              Giá sân
            </div>
            <div className="mt-1 font-bold text-slate-800">
              {fieldInfo.price}
            </div>
          </div>
          
          <div className="flex flex-col items-center w-1/2">
            <div className="font-semibold uppercase text-stone-300">
              Kiểu sân
            </div>
            <div className="mt-1 font-bold text-slate-800">
              {fieldInfo.type}
            </div>
          </div>
        </div>
      </div>

      {/* Các Button */}
      <div className="flex gap-3 justify-between mt-3">
        <Button
          onClick={() => console.log("Đặt sân")}
          text="Đặt sân"
          variant="tertiary"
          className="flex-1 py-2 bg-amber-500 rounded-[34px] shadow-[0px_0px_41px_rgba(0,0,0,0.25)] text-white font-bold text-sm hover:bg-amber-600 transition-colors"
        />
        <Button
          onClick={() => console.log("Bình luận")}
          text="Bình luận"
          variant="tertiary"
          className="flex-1 py-2 bg-amber-500 rounded-[34px] shadow-[0px_0px_41px_rgba(0,0,0,0.25)] text-white font-bold text-sm hover:bg-amber-600 transition-colors"
        />
      </div>
    </div>
  );
};

export default FieldInfo;
