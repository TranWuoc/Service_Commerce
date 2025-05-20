import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Button from "../Shared_components/Button";
import { CommentOverlay } from "../Comments/CommentsOverLay";
import { useUser } from "../../hooks/useUser";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

const FieldInfo: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [field, setField] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showComments, setShowComments] = React.useState(false);

  const { user } = useUser();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  useEffect(() => {
    if (!id) {
      setError("Không tìm thấy ID sân.");
      setLoading(false);
      return;
    }

    const fetchField = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`http://127.0.0.1:8000/api/fields/${id}`);
        if (!res.ok) {
          throw new Error(`Lỗi khi fetch: ${res.status}`);
        }
        const json = await res.json();
        setField(json.data);
      } catch (e: any) {
        setError(e.message || "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    fetchField();
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10">Đang tải dữ liệu sân...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        Lỗi: {error}
      </div>
    );
  }

  if (!field) {
    return (
      <div className="text-center text-red-500 mt-10">
        Không tìm thấy thông tin sân.
      </div>
    );
  }

  const getStateColor = (stateName: string) => {
    switch (stateName) {
      case "Active":
        return "bg-green-500";
      case "Maintenance":
        return "bg-amber-400";
      case "Suspended":
        return "bg-red-600";
      case "Deactivated":
        return "bg-gray-400";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <>
      {isAdmin ? (
        <div className="self-stretch w-full max-md:mt-8">
          <div className="flex flex-col py-4 px-6 w-full h-[300px] bg-gray-100 rounded-lg shadow-md">
            <div className="flex gap-1 text-lg text-slate-800">
              <div className="font-medium">{field.name}</div>
            </div>

            <div className="flex items-center gap-1 mt-2 text-base text-gray-600">
              <PhoneIcon className="w-5 h-5 text-gray-600" />
              <span>{"0933290303"}</span>
            </div>

            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
              <LocationOnIcon className="w-5 h-5 text-yellow-500" />
              <span>{field.address}</span>
            </div>

            <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
              <AssignmentTurnedInIcon className="w-5 h-5 text-yellow-500" />
              <span
                className={`inline-block w-16 h-3 rounded ${getStateColor(
                  field.state.name
                )}`}
              ></span>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-1 mt-0 text-sm text-gray-600">
                <span className="font-bold text-slate-800">
                  Giá sân: {field.price.toLocaleString()} VND
                </span>
                <span className="font-bold text-slate-800 ml-4">
                  Kiểu sân: {field.category?.name}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                <span className="font-bold text-slate-800">
                  Mô tả: {field.description}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-4 ml-16">
            <Button
              onClick={() => navigate(`/admin/manage/updateField/${field.id}`)}
              text="Chỉnh sửa sân"
              type="primary"
            />
            <Button
              onClick={() => navigate(`/admin/manage/FieldInfo/timetable/${field.id}`)}
              text="Quản lý khung giờ"
              type="primary"
            />
            <Button
              onClick={() => setShowComments(true)}
              text="Bình luận"
              type="tertiary"
            />
            <CommentOverlay
              isOpen={showComments}
              onClose={() => setShowComments(false)}
              fieldInfo={field}
            />
          </div>
        </div>
      ) : (
        <>
          <div
            className={`self-stretch h-75vh w-full max-md:mt-8 ${
              showComments ? "blur-sm" : ""
            }`}
          >
            <div className="flex flex-col py-2 px-4 w-full h-[40vh] bg-white rounded-[30px] shadow-[0px_0px_15px_rgba(0,0,0,0.15)]">
              <div className="flex flex-col w-full h-36">
                <div className="flex gap-1 text-lg text-slate-800">
                  <div className="font-medium">{field.name}</div>
                </div>





























                <div className="flex items-center gap-1 mt-2 text-base text-gray-600">
                  <PhoneIcon className="w-5 h-5 text-gray-600" />
                  <span>{"0933290303"}</span>
                </div>

                <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                  <LocationOnIcon className="w-5 h-5 text-yellow-500" />
                  <span>{field.address}</span>
                </div>

                <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                  <span className="font-bold text-slate-800">
                    Mô tả: {field.description}
                  </span>
                </div>

                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                    <span className="font-bold text-slate-800">
                      Giá sân: {field.price.toLocaleString()} VND
                    </span>
                    <span className="font-bold text-slate-800 ml-4">
                      Kiểu sân: {field.category?.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-between mt-2">
              <Button
                onClick={() =>
                  navigate("/dashboard/booking", {
                    state: {
                      fieldId: field.id,
                      fieldName: field.name,
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

          <CommentOverlay
            isOpen={showComments}
            onClose={() => setShowComments(false)}
            fieldInfo={field}
          />
        </>
      )}
    </>
  );
};
export default FieldInfo;