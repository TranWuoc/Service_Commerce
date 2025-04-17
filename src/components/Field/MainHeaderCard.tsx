import Button from "../Shared_components/Button";
import { useNavigate } from "react-router-dom";

interface Field {
  id: string;
  name: string;
  address: string;
  price: number;
  category: {
    id: string;
    name: string;
  };
  state: {
    id: string;
    name: string;
  };
  images: string[];

}

interface MainHeaderCardProps {
  field: Field;
}

export function MainHeaderCard({ field }: MainHeaderCardProps) {
  const navigate = useNavigate();
  const imageUrl = field?.images?.[0] || "https://placehold.co/400x400/333/333";

  return (
    <article className="flex flex-col p-4 bg-white rounded-xl shadow-lg h-[420px]">
      <div className="overflow-hidden mb-4 rounded-xl">
        <img
          src={imageUrl}
          alt={`Field ${field?.name || "Unknown"}`}

          className="w-full h-[200px] object-cover flex-shrink-0"
        />
      </div>

      <h3 className="text-lg font-medium leading-7">{field?.name || "No Name"}</h3>
      <p className="text-sm text-gray-500 mb-2">{field?.category?.name || "Unknown Category"}</p>

      <div className="flex text-sm text-gray-500 mb-4 gap-2 min-h-[2.5rem]">
        <div className="flex-1 line-clamp-2">{field?.address || "No Address"}</div>

      </div>

      <div className="flex justify-between text-sm text-gray-500 mb-4 mt-auto">
        <div className="flex-1 text-left">
          Price: {field?.price.toLocaleString()} VND
        </div>
      </div>

      <div className="flex justify-center mt-auto">
        <Button
          text="Select Field"
          type="primary"
          onClick={() =>
            navigate("/dashboard/FieldInfo", {
              state: {
                ...field,
                imageUrl,
              },
            })
          }
        />
      </div>
    </article>
  );
}
