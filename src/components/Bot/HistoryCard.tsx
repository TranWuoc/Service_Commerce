import React from "react";

type HistoryCardProps = {
  name: string;
  address: string;
};

const HistoryCard: React.FC<HistoryCardProps> = ({ name, address }) => {
  return (
    <div className="border p-3 rounded w-full shadow hover:shadow-md transition bg-white">
      <p className="font-semibold text-sm mb-1">🏟️ {name}</p>
      <p className="text-sm">
        📍 <span className="font-medium">{address}</span>
      </p>
    </div>
  );
};

export default HistoryCard;
