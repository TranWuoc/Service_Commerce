"use client";
import { useLocation } from "react-router-dom";

import React, { useState } from "react";
import type { FieldInfo } from "../../types/Field";
import PhoneIcon from "@mui/icons-material/Phone";
import SportsIcon from "@mui/icons-material/Sports";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Button from "../Shared_components/Button";
import { useNavigate } from "react-router-dom";
import { CommentOverlay } from "../Comments/CommentsOverLay";

interface FieldInfoProps {
  fieldInfo: FieldInfo;
}

const FieldInfo: React.FC<FieldInfoProps> = ({ fieldInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showComments, setShowComments] = useState(false);

  // Lấy fieldInfo từ state hoặc prop
  const currentFieldInfo = location.state?.fieldInfo || fieldInfo;

  // Kiểm tra nếu currentFieldInfo không tồn tại
  if (!currentFieldInfo) {
    return (
      <div className="text-center text-red-500">
        Không tìm thấy thông tin sân. Vui lòng thử lại.
      </div>
    );
  }

  return (
    <>
      <div
        className={`self-stretch w-full max-md:mt-10 ${
          showComments ? "blur-sm" : ""
        }`}
      >
        <div className="flex flex-col py-4 px-4 w-full bg-white rounded-[30px] shadow-[0px_0px_15px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col w-full">
            <div className="flex gap-2 text-lg text-slate-800">
              <div className="font-medium">{currentFieldInfo.name}</div>
            </div>

            <div className="flex items-center gap-2 mt-2 text-base text-gray-600">
              <PhoneIcon className="w-5 h-5 text-gray-600" />
              <span>{currentFieldInfo.phone || "0933290303"}</span>
            </div>

            <div className="flex items-center gap-2 mt-3 text-sm text-gray-600">
              <LocationOnIcon className="w-5 h-5 text-yellow-500" />
              <span>{currentFieldInfo.location}</span>
            </div>
          </div>

          <div className="relative mt-3 w-3/5 pb-[20%] rounded-lg overflow-hidden"></div>

          <div className="flex flex-col gap-3 mt-3">
            <div className="flex items-center justify-between gap-1 text-sm text-gray-600">
              <span className="font-bold text-slate-800">
              Gia san:  {currentFieldInfo.price}
              </span>
              <span className="font-bold text-slate-800">
                Kieu san: {currentFieldInfo.type}
              </span>
            </div>


          </div>
        </div>

        <div className="flex gap-3 justify-between mt-3">
          <Button
            onClick={() =>
              navigate("/dashboard/booking", {
                state: { fieldName: currentFieldInfo.name },
                replace: true,
              })
            }
            text="Đặt sân"
            variant="tertiary"
            className="flex-1 py-2 bg-amber-500 rounded-[34px] shadow-[0px_0px_41px_rgba(0,0,0,0.25)] text-white font-bold text-sm hover:bg-amber-600 transition-colors"
          />
          <Button
            onClick={() => setShowComments(true)}
            text="Bình luận"
            variant="tertiary"
            className="flex-1 py-2 bg-amber-500 rounded-[34px] shadow-[0px_0px_41px_rgba(0,0,0,0.25)] text-white font-bold text-sm hover:bg-amber-600 transition-colors"
          />
        </div>
      </div>

      <CommentOverlay
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        fieldInfo={currentFieldInfo} // Truyền fieldInfo hiện tại vào CommentOverlay
      />
    </>
  );
};

export default FieldInfo;