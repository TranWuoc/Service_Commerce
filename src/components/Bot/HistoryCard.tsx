import React from "react";

type HistoryCardProps = {
  name: string;
  address: string;
  time: string;
};

const HistoryCard: React.FC<HistoryCardProps> = ({ name, address,time }) => {
  return (
    <div className="border p-3 rounded w-full shadow hover:shadow-md transition bg-white">
      <p className="font-semibold text-sm mb-1">🏟️ {name}</p>
      <p className="text-sm">
        📍 <span className="font-medium">{address}</span>
      </p>
      <p className="text-sm text-gray-500 mt-1">⏰ {time}</p>
    </div>
  );
};

export default HistoryCard;
