import React from "react";
import { useNavigate } from "react-router-dom";

type SanCardProps = {
  image: string;
  name: string;
  soluong: string;
  vitri: string;
  price: string;
  fieldId: string;
};

const Inforcard: React.FC<SanCardProps> = ({
  image,
  name,
  soluong,
  vitri,
  price,
  fieldId,
}) => {
  const navigate = useNavigate();
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
  const handleBooking = () => {
    navigate("/dashboard/booking", {
      state: {
        fieldId: fieldId,
        fieldName: name,
        date: formatDate(new Date(Date.now()))
      },
      // replace: true,
      
    });
   
  };
  return (
    <div className="w-full bg-white rounded-lg shadow hover:shadow-md transition duration-300 p-1 ">
      <div className="w-full h-20 flex items-center justify-center overflow-hidden rounded-md bg-gray-50">
        <img
          src={'http://localhost:8000/'+image}
          alt={name}
          className="object-contain h-full"
        />
      </div>

      <div className="mt-3 flex-1">
        <p className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[20px]">{name}</p>

        <p className="text-xs mt-2 text-gray-600 min-h-[32px]">
          <span className="font-semibold">Loại sân:</span> {soluong}
        </p>
        <p className="text-xs text-gray-600 min-h-[32px]">
          <span className="font-semibold">Địa chỉ:</span> {vitri}
        </p>

        <p className="text-red-600 font-bold text-base mt-2">{price}</p>
      </div>

      <button
        onClick={handleBooking}
        className=" w-full border border-gray-400 text-sm py-2 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition flex items-center justify-center gap-2"
      >
        Đặt sân
      </button>
    </div>
  );
};

export default Inforcard;
