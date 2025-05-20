import Button from "../Shared_components/Button";
import { useNavigate } from "react-router-dom";
import { useField } from "../../hooks/useField";
import { Field } from "../../types/Field";
import { useUser } from "../../hooks/useUser";

interface MainHeaderCardProps {
  field: Field;
}

export function MainHeaderCard({ field }: MainHeaderCardProps) {
  const navigate = useNavigate();
  const { setSelectedField } = useField();
  const { user } = useUser();

  const getImageUrl = (field: Field) => {
    if (field?.images && field.images.length > 0 && field.images[0].image_url) {
      return `http://127.0.0.1:8000/${field.images[0].image_url}`;
    }
    return "https://placehold.co/400x400/333/333";
  };

  const handleSelectField = () => {
    setSelectedField(field); // vẫn lưu context nếu cần
    navigate(`/dashboard/FieldInfo/${field.id}`);
    console.log(field.id) // chuyển sang trang chi tiết với id trong URL
  };

  return (
    <article className="flex flex-col p-4 bg-white rounded-xl shadow-lg h-[420px]">
      <div className="overflow-hidden mb-4 rounded-xl">
        <img
          src={getImageUrl(field)}
          alt={`Field ${field?.name || "Unknown"}`}
          className="w-full h-[200px] object-cover flex-shrink-0"
        />
      </div>

      <h3 className="text-lg font-medium leading-7">{field?.name || "No Name"}</h3>
      <p className="text-sm mb-2">{field?.category?.name || "Unknown Category"}</p>

      <div className="flex text-sm mb-4 gap-2 min-h-[2.5rem]">
        <div className="flex-1 line-clamp-2">{field?.address || "No Address"}</div>
      </div>

      {field.distance !== undefined && field.distance !== null && (
        <p className="text-sm mb-1">
          Khoảng cách: <span className="text-green-500">{field.distance.toFixed(2)} km</span>
        </p>
      )}

      <div className="flex justify-between text-sm mb-4 mt-auto">
        <div className="flex-1 text-left">
          Price: {field?.price.toLocaleString()} VND
        </div>
      </div>

      <div className="flex justify-center mt-auto">
        {user?.is_admin ? (
          <Button
            text="Edit Field"
            type="primary"
            onClick={() =>
              navigate("/admin/manager", {
                state: { fieldId: field.id },
              })
            }
          />
        ) : (
          <Button text="Xem chi tiết" type="primary" onClick={handleSelectField} />
        )}
      </div>
    </article>
  );
}
