"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Button from "../Shared_components/Button";
import { CommentOverlay } from "../Comments/CommentsOverLay";
import { useField } from "../../hooks/useField";


const FieldInfo: React.FC = () => {
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const { selectedField, setSelectedField } = useField();

  // ✅ Khôi phục selectedField từ localStorage nếu mất context
  useEffect(() => {
    if (!selectedField) {
      const storedField = localStorage.getItem("selectedField");
      if (storedField) {
        try {
          const parsed = JSON.parse(storedField);
          setSelectedField(parsed);
        } catch (e) {
          console.error("Không thể parse selectedField từ localStorage:", e);
        }
      }
    }
  }, [selectedField, setSelectedField]);

  if (!selectedField) {
    return (
      <div className="text-center text-red-500 mt-10">
        Không tìm thấy thông tin sân. Vui lòng quay lại và chọn lại.
      </div>
    );
  }

  return (
    <>
      <div className={`self-stretch w-full max-md:mt-8 ${showComments ? "blur-sm" : ""}`}>
        <div className="flex flex-col py-2 px-4 w-full bg-white rounded-[30px] shadow-[0px_0px_15px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col w-full">
            {/* Tên sân */}
            <div className="flex gap-1 text-lg text-slate-800 font-medium">
              {selectedField.name}
            </div>

            {/* Số điện thoại */}
            <div className="flex items-center gap-1 mt-2 text-base text-gray-600">
              <PhoneIcon className="w-5 h-5 text-gray-600" />
              <span>0933290303</span>
            </div>

            {/* Địa chỉ */}
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
              <LocationOnIcon className="w-5 h-5 text-yellow-500" />
              <span>{selectedField.address}</span>
            </div>

            {/* Giá sân và Kiểu sân */}
            <div className="flex flex-col gap-1 mt-10 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">
                  Giá sân: {selectedField.price.toLocaleString()} VND
                </span>
                <span className="font-bold text-slate-800">
                  Kiểu sân: {selectedField.category?.name}
                </span>
              </div>
            </div>
        
          </div>
        </div>

        {/* Các nút */}
        <div className="flex gap-2 justify-between mt-2">
          <Button
            onClick={() =>
              navigate("/dashboard/booking", {
                state: {
                  fieldId: selectedField.id,
                  fieldName: selectedField.name,
                },
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

      {/* Overlay bình luận */}
      <CommentOverlay
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        fieldInfo={selectedField}
      />
    </>
  );
};

export default FieldInfo;
