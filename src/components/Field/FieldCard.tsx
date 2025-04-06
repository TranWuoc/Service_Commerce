import Button from "../Shared_components/Button";
import { useNavigate } from "react-router-dom";

interface FieldCardProps {
  name: string;
  type: string;
  location: string;
  status: string;
  usage: number;
  price: number;
  imageUrl: string;
}

export function FieldCard({
  name,
  type,
  location,
  status,
  usage,
  price,
  imageUrl,
}: FieldCardProps) {
  const navigate = useNavigate();
  return (
    <article className="flex flex-col p-4 bg-white rounded-xl shadow-lg h-full">
      <div className="overflow-hidden mb-4 rounded-xl">
        <img
          src={imageUrl}
          alt={`Field ${name}`}
          className="w-full h-40 object-cover"
        />
      </div>
      <h3 className="text-lg font-medium leading-7">{name}</h3>
      <p className="text-sm text-gray-500 mb-4">{type}</p>
      
      {/* Row for location and usage with vertical divider */}
      <div className="flex text-sm text-gray-500 mb-4 gap-2">
        <div className="flex-1">{location}</div>
        <div className="w-[1px] bg-gray-300 mx-2"></div> {/* Vertical divider */}
        <div className="flex-1 text-center  ">{usage}% Used</div>
      </div>

      {/* Row for price */}
      <div className="flex justify-between text-sm text-gray-500 mb-4 mt-auto">
        <div className="flex-1 text-left">Price: {price.toLocaleString()} VND</div>
      </div>

      {/* Button */}
      <Button
        text="Select Field"
        type="primary"
        onClick={() =>
          navigate("/FieldInfo", {
            state: { name, type, location, status, usage, price, imageUrl },
          })
        }
      />
    </article>
  );
}
