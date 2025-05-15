import React, { useState, useEffect } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { FieldList } from "../Field/FieldList";
import { fetchAllFields, fetchFields, getLocation } from "../../actions/fieldActions";
import { useDebounce } from "../../lib/utils";

export function FieldsSummary({
  onStartLoading,
  onStopLoading,
}: {
  onStartLoading: () => void;
  onStopLoading: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null); // Chỉ lưu 1 loại sân
  const [fields, setFields] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: string; lng: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [autoUseLocation, setAutoUseLocation] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;
  const totalPages = Math.ceil(fields.length / perPage);
  const paginatedFields = fields.slice((currentPage - 1) * perPage, currentPage * perPage);
  const calledRef = React.useRef(false);
  const debouncedQuery = useDebounce(searchQuery, 500);

  const fieldTypes = [
    { id: "cat-uuid-001", name: "Sân 5" },
    { id: "cat-uuid-002", name: "Sân 7" },
    { id: "cat-uuid-003", name: "Sân 11" },
  ];

  // Load tất cả sân
  const loadAllFields = async () => {
    setIsLoading(true);
    const data = await fetchAllFields();
    setFields(data);
    setCurrentPage(1);
    setIsLoading(false);
  };

  // Lấy sân theo vị trí và loại sân
  const fetchFieldsByLocation = async (lat: string, lng: string, categoryId?: string | null) => {
    setIsLoading(true);
    const data = await fetchFields(lat, lng, categoryId ?? null);
    setFields(data);
    setCurrentPage(1);
    setIsLoading(false);
  };

  // Tự động lấy vị trí khi component mount (chỉ chạy khi autoUseLocation=true)
  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    const fetchLocationAndFields = async () => {
      if (!autoUseLocation) {
        await loadAllFields();
        return;
      }
      try {
        const loc = await getLocation();
        setUserLocation(loc);
        await fetchFieldsByLocation(loc.lat, loc.lng, selectedType);
      } catch (error) {
        console.error("Lấy vị trí thất bại, load toàn bộ sân", error);
        await loadAllFields();
      }
    };

    fetchLocationAndFields();
  }, [autoUseLocation, selectedType]);

  // Tìm kiếm địa chỉ qua API Nominatim
  const searchAddress = async (query: string) => {
    if (!query) {
      setAddressSuggestions([]);
      return;
    }
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&addressdetails=1&limit=5&countrycodes=vn`;
    const res = await fetch(url);
    const data = await res.json();
    setAddressSuggestions(data);
  };

  // Tự động gọi searchAddress khi debouncedQuery thay đổi
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      searchAddress(debouncedQuery);
    } else {
      setAddressSuggestions([]);
    }
  }, [debouncedQuery]);

  // Xử lý bấm nút tìm kiếm: tắt tự động lấy vị trí, tìm theo địa chỉ
  const onSearchButtonClick = async () => {
    if (!searchQuery.trim()) return;

    setAutoUseLocation(false); // tắt tự động lấy vị trí

    // Lấy lat/lng từ Nominatim (chỉ lấy kết quả đầu tiên)
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      searchQuery
    )}&addressdetails=1&limit=1&countrycodes=vn`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.length > 0) {
        const lat = data[0].lat;
        const lng = data[0].lon;
        setUserLocation({ lat, lng });
        await fetchFieldsByLocation(lat, lng, selectedType);
      } else {
        await loadAllFields();
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm địa chỉ:", error);
      await loadAllFields();
    }
    setAddressSuggestions([]);
  };

  // Xử lý chọn địa chỉ gợi ý
  const onSelectSuggestion = async (addr: any) => {
    setAutoUseLocation(false); // tắt tự động lấy vị trí
    const lat = addr.lat;
    const lng = addr.lon;
    setUserLocation({ lat, lng });
    setSearchQuery(addr.display_name);
    setAddressSuggestions([]);
    await fetchFieldsByLocation(lat, lng, selectedType);
  };

  // Chọn loại sân (radio) - chỉ chọn 1 loại sân
  const selectFieldType = (typeId: string) => {
    if (selectedType === typeId) {
      setSelectedType(null); // cho phép bỏ chọn nếu click lại
    } else {
      setSelectedType(typeId);
    }
  };

  // Áp dụng filter loại sân (kết hợp với vị trí hiện tại hoặc toàn bộ)
  const applyFilters = async () => {
    if (userLocation) {
      await fetchFieldsByLocation(userLocation.lat, userLocation.lng, selectedType);
    } else {
      await loadAllFields();
    }
    setShowFilters(false);
  };

  // Reset filter và tìm kiếm
  const handleResetFilters = async () => {
    setSelectedType(null);
    setUserLocation(null);
    setSearchQuery("");
    setAddressSuggestions([]);
    setAutoUseLocation(true); // bật lại tự động lấy vị trí
    setShowFilters(false);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl pl-5 font-bold text-gray-800">Danh sách sân bóng</h2>
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          title="Lọc loại sân"
        >
          <FaFilter />
        </button>
      </div>

      <div className="w-full max-w-md px-5 mb-4">
        <div className="flex items-center rounded-md overflow-hidden bg-opacity-100">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo địa chỉ..."
            className="flex-1 px-4 py-2 focus:outline-none h-10"
          />
          <button
            onClick={onSearchButtonClick}
            className="h-10 px-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            <FaSearch />
          </button>
        </div>
        {addressSuggestions.length > 0 && (
          <ul className="mt-1 w-full bg-white border rounded-md shadow max-h-60 overflow-y-auto z-40">
            {addressSuggestions.map((addr, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                onClick={() => onSelectSuggestion(addr)}
              >
                {addr.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {showFilters && (
        <div className="fixed top-[90px] right-4 z-50 w-64 bg-white border shadow-lg rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700">Lọc loại sân</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="space-y-2">
            {fieldTypes.map((type) => (
              <label key={type.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="fieldType"
                  checked={selectedType === type.id}
                  onChange={() => selectFieldType(type.id)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{type.name}</span>
              </label>
            ))}
          </div>

          <button
            className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={applyFilters}
          >
            Áp dụng
          </button>
          <button
            className="w-full mt-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            onClick={handleResetFilters}
          >
            Đặt lại
          </button>
        </div>
      )}

      <div className="pt-4">
        <FieldList fields={paginatedFields} />
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-4">
          {currentPage > 1 && (
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Trang trước
            </button>
          )}
          <span className="text-gray-600 text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Trang sau
            </button>
          )}
        </div>
      )}
    </div>
  );
}
