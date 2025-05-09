import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { FieldList } from "../Field/FieldList";

export function FieldsSummary({
  onStartLoading,
  onStopLoading,
  location,
}: {
  onStartLoading: () => void;
  onStopLoading: () => void;
  location: { lat: number; lon: number } | null;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [isFieldTypeVisible, setIsFieldTypeVisible] = useState(false);
  const [geoWatchId, setGeoWatchId] = useState<number | null>(null);

  const handleLocationFetch = () => {
    if (geoWatchId !== null) {
      // Nếu đã có việc tìm vị trí, hủy bỏ việc theo dõi
      navigator.geolocation.clearWatch(geoWatchId);
      setGeoWatchId(null);
      setIsLoading(false); // Dừng quá trình tìm kiếm
      setIsLocationFetched(false); // Reset trạng thái
      console.log("Đã hủy việc tìm vị trí.");
    } else {
      // Nếu chưa tìm vị trí, bắt đầu tìm kiếm
      setIsLoading(true);
      if (navigator.geolocation) {
        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`Tọa độ: Lat: ${latitude}, Lon: ${longitude}`);
            setIsLocationFetched(true);
            setIsLoading(false);
          },
          (error) => {
            console.error("❌ Lỗi lấy vị trí:", error);
            setIsLoading(false);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
        setGeoWatchId(watchId); // Lưu id của việc theo dõi
      } else {
        console.error("⚠️ Trình duyệt không hỗ trợ Geolocation.");
        setIsLoading(false);
      }
    }
  };

  const toggleFieldTypeList = () => {
    setIsFieldTypeVisible(!isFieldTypeVisible);
  };

  return (
    <div className="w-full">
      <h2 className="mb-4 text-lg font-medium leading-7">
        Available Fields Overview
      </h2>

      {/* Đặt các nút trong một container Flex với hàng ngang */}
      <div className="flex justify-end gap-4 mb-4 relative">
        {/* Nút "Tìm sân gần nhất" */}
        <button
          className="flex items-center p-2 bg-gray-200 rounded-full"
          onClick={handleLocationFetch}
        >
          <FaMapMarkerAlt className="text-xl" />
          {isLocationFetched ? "Đã tìm sân gần nhất" : "Tìm sân gần nhất"}
        </button>

        {/* Nút "Lọc theo kiểu sân" */}
        <button
          className="flex items-center p-2 bg-gray-200 rounded-full"
          onClick={toggleFieldTypeList}
        >
          <FaSearch className="text-xl" />
          Lọc theo kiểu sân
        </button>

        {/* Hiển thị danh sách kiểu sân nếu có */}
        {isFieldTypeVisible && (
          <div className="absolute top-full right-0 p-2 bg-white shadow-md rounded-md mt-2.5 w-48">
            <ul className="text-sm">
              <li>Sân 5</li>
              <li>Sân 7</li>
              <li>Sân 11</li>
            </ul>
          </div>
        )}
      </div>

      <FieldList />
    </div>
  );
}
