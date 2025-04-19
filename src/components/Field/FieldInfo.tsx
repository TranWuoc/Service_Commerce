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
import { useUser } from "../../Context/UserContext";

interface FieldInfoProps {
  fieldInfo: FieldInfo;
}

const FieldInfo: React.FC<FieldInfoProps> = ({ fieldInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();
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
        className={`self-stretch w-full max-md:mt-8 ${showComments ? "blur-sm" : ""}`}
      >
        <div className="flex flex-col py-2 px-4 w-full bg-white rounded-[30px] shadow-[0px_0px_15px_rgba(0,0,0,0.15)]">
          <div className="flex flex-col w-full">
            <div className="flex gap-1 text-lg text-slate-800">
              <div className="font-medium">{currentFieldInfo.name}</div>
            </div>

            <div className="flex items-center gap-1 mt-2 text-base text-gray-600">
              <PhoneIcon className="w-5 h-5 text-gray-600" />
              <span>{currentFieldInfo.phone || "0933290303"}</span>
            </div>

            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
              <LocationOnIcon className="w-5 h-5 text-yellow-500" />
              <span>{currentFieldInfo.address}</span>
            </div>

            <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
              <span className="font-bold text-slate-800">
                Giá sân: {currentFieldInfo.price} VND
              </span>
              <span className="font-bold text-slate-800">
                Kiểu sân: {currentFieldInfo.category?.name}
              </span>
            </div>
          </div>

          <div className="relative mt-2 w-3/5 pb-[15%] rounded-lg overflow-hidden">
            {currentFieldInfo.images && currentFieldInfo.images.length > 0 && (
              <img
                src={currentFieldInfo.images[0]}
                alt={currentFieldInfo.name}
                className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
          </div>
        </div>

        <div className="flex gap-2 justify-between mt-2">
        {user?.is_admin ? (
            <>
              <Button
                onClick={() => navigate("/admin/manager", { state: { fieldId: currentFieldInfo.id } })}
                text="Chỉnh sửa"
                variant="primary"
                className="flex-1 py-2 bg-blue-500 rounded-[34px] shadow-[0px_0px_41px_rgba(0,0,0,0.25)] text-white font-bold text-sm hover:bg-blue-600 transition-colors"
              />
              <Button
                onClick={() => {
                  if (window.confirm("Bạn có chắc chắn muốn xoá sân này?")) {
                    console.log("Xoá sân:", currentFieldInfo.id);
                    // Thêm logic xoá sân tại đây
                  }
                }}
                text="Xoá sân"
                variant="danger"
                className="flex-1 py-2 bg-red-500 rounded-[34px] shadow-[0px_0px_41px_rgba(0,0,0,0.25)] text-white font-bold text-sm hover:bg-red-600 transition-colors"
              />
            </>
          ) : (
            <>
              <Button
                onClick={() =>
                  navigate("/dashboard/booking", {
                    state: { fieldId: currentFieldInfo.id, fieldName: currentFieldInfo.name },
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
            </>
          )}
        </div>
      </div>

      <CommentOverlay
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        fieldInfo={currentFieldInfo}
      />
    </>
  );
};

export default FieldInfo;
