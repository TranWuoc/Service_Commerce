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
  style?: React.CSSProperties;
}

export function FieldCard({
  name,
  type,
  location,
  status,
  usage,
  price,
  imageUrl,
  style,
}: FieldCardProps) {
  const navigate = useNavigate();
  return (
<article className="flex flex-col p-4 bg-white rounded-xl shadow-lg h-[420px]" style={style}>
  <div className="overflow-hidden mb-4 rounded-xl">
    <img
      src={imageUrl}
      alt={`Field ${name}`}
      className="w-full h-[200px] object-cover flex-shrink-0"
    />
  </div>

  <h3 className="text-lg font-medium leading-7">{name}</h3>
  <p className="text-sm text-gray-500 mb-2">{type}</p>

  <div className="flex text-sm text-gray-500 mb-4 gap-2 min-h-[2.5rem]">
    <div className="flex-1 line-clamp-2">{location}</div>
    <div className="w-[1px] bg-gray-300 mx-2"></div>
    <div className="flex-1 text-center">{usage}% Used</div>
  </div>

  <div className="flex justify-between text-sm text-gray-500 mb-4 mt-auto">
    <div className="flex-1 text-left">
      Price: {price.toLocaleString()} VND
    </div>
  </div>

  <div className="flex justify-center mt-auto">
    <Button
      text="Select Field"
      type="primary"
      onClick={() =>
        navigate("/dashboard/FieldInfo", {
          state: { name, type, location, status, usage, price, imageUrl },
        })
      }
    />
  </div>
</article>

  );
} 