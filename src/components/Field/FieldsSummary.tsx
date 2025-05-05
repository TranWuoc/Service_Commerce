import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaFilter } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { FieldList } from "../Field/FieldList";
import axiosInstance from "../../api/axiosInstance";

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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [fields, setFields] = useState<any[]>([]);

  const fetchAllFields = async () => {
    try {
      setIsLoading(true);
      setFields([]);
      const response = await axiosInstance.get(`/fields`);
      console.log("Dữ liệu sân từ BE:", response.data);
      setFields(response.data.data);
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilteredFields = async (
    lat: string | null,
    lng: string | null,
    categoryId: string | null
  ) => {
    const params = new URLSearchParams();
    if (categoryId) {
      params.append("category_id", categoryId);
    }
    if (lat && lng) {
      params.append("latitude", lat);
      params.append("longitude", lng);
    }
    
    params.append("page", "1");

    try {
      setIsLoading(true);
      setFields([]);
      const response = await axiosInstance.post(`/fields/filter?${params.toString()}`);
      console.log("Dữ liệu trả về từ BE:", response.data);
      setFields(response.data.data);
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllFields();
  }, []);

  const handleLocationFetch = async () => {
    if (isLoading) return;

    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude.toString();
          const longitude = position.coords.longitude.toString();
          setIsLocationFetched(true);

          const categoryId = selectedTypes.length > 0 ? selectedTypes[0] : null;
          await fetchFilteredFields(latitude, longitude, categoryId);
        },
        (error) => {
          console.error("❌ Lỗi lấy vị trí:", error);
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("⚠️ Trình duyệt không hỗ trợ Geolocation.");
    }
  };

  const applyFilters = async () => {
    const categoryId = selectedTypes.length > 0 ? selectedTypes[0] : null;

    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude.toString();
          const lng = position.coords.longitude.toString();
          setIsLocationFetched(true);

          await fetchFilteredFields(lat, lng, categoryId);
          setIsLoading(false);
        },
        (error) => {
          console.error("Lỗi lấy vị trí khi áp dụng lọc:", error);
          setIsLoading(false);
        }
      );
    } else {
      console.error("⚠️ Trình duyệt không hỗ trợ Geolocation.");
    }

    setShowFilters(false);
  };

  const fieldTypes = [
    { id: "cat-uuid-001", name: "Sân 5" },
    { id: "cat-uuid-002", name: "Sân 7" },
    { id: "cat-uuid-0033", name: "Sân 11" },
  ];

  const toggleFieldType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl pl-5 font-bold text-gray-800">Danh sách sân bóng</h2>

        <div className="flex items-center gap-3 relative">
          <button
            onClick={handleLocationFetch}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
              ${isLocationFetched
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"}
              ${isLoading ? "opacity-70 cursor-wait" : ""}`}
          >
            <FaMapMarkerAlt className="flex-shrink-0" />
            <span className="whitespace-nowrap">
              {isLoading
                ? "Đang tìm..."
                : isLocationFetched
                  ? "Đã xác định vị trí"
                  : "Tìm theo vị trí"}
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              <FaFilter className="flex-shrink-0" />
              <span className="whitespace-nowrap">Lọc</span>
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-50 border border-gray-200 mb-4">
                <div className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-gray-700">Loại sân</h3>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <FiX size={18} />
                    </button>
                  </div>

                  <div className="space-y-2 min-h-[100px]">
                    {fieldTypes.length > 0 ? (
                      fieldTypes.map((type) => (
                        <label
                          key={type.id}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedTypes.includes(type.id)}
                            onChange={() => toggleFieldType(type.id)}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-gray-700">{type.name}</span>
                        </label>
                      ))
                    ) : (
                      <div className="text-gray-500 text-center py-4">
                        Không có loại sân nào
                      </div>
                    )}
                  </div>

                  <button
                    className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={applyFilters}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={showFilters ? "pt-[200px]" : ""}>
        <FieldList fields={fields} />
      </div>
    </div>
  );
}
