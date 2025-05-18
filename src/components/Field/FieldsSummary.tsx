import React, { useState, useEffect, useRef } from "react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { FieldList } from "../Field/FieldList";
import { fetchAllFields, fetchFields, getLocation } from "../../actions/fieldActions";
import { useDebounce } from "../../lib/utils";

const fieldTypes = [
  { id: "cat-uuid-001", name: "Sân 5" },
  { id: "cat-uuid-002", name: "Sân 7" },
  { id: "cat-uuid-003", name: "Sân 11" },
];

export function FieldsSummary({ onStartLoading, onStopLoading }: { onStartLoading: () => void; onStopLoading: () => void }) {
  const [fields, setFields] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: string; lng: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [autoUseLocation, setAutoUseLocation] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;
  const totalPages = Math.ceil(fields.length / perPage);
  const paginatedFields = fields.slice((currentPage - 1) * perPage, currentPage * perPage);
  const debouncedQuery = useDebounce(searchQuery, 500);

  const calledRef = useRef(false);

  const handleFetchFields = async (lat: string, lng: string, categoryId?: string | null) => {
    setIsLoading(true);
    try {
      const data = await fetchFields(lat, lng, categoryId ?? null);
      setFields(data);
    } catch (error) {
      console.error("Lỗi khi gọi API lọc sân, fallback sang fetchAllFields:", error);
      const fallback = await fetchAllFields();
      setFields(fallback);
    } finally {
      setCurrentPage(1);
      setIsLoading(false);
    }
  };

  const loadAllFields = async () => {
    setIsLoading(true);
    const data = await fetchAllFields();
    setFields(data);
    setCurrentPage(1);
    setIsLoading(false);
  };

  const fetchLocationAndFields = async () => {
    if (!autoUseLocation) {
      await loadAllFields();
      return;
    }

    try {
      const loc = await getLocation();
      setUserLocation(loc);
      await handleFetchFields(loc.lat, loc.lng, selectedType);
    } catch (error) {
      console.error("Lấy vị trí thất bại, fallback loadAllFields:", error);
      await loadAllFields();
    }
  };

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;
    fetchLocationAndFields();
  }, [autoUseLocation, selectedType]);

  const searchAddress = async (query: string) => {
    if (!query) return setAddressSuggestions([]);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=vn`;
    const res = await fetch(url);
    const data = await res.json();
    setAddressSuggestions(data);
  };

  useEffect(() => {
    if (debouncedQuery.length > 2) {
      searchAddress(debouncedQuery);
    } else {
      setAddressSuggestions([]);
    }
  }, [debouncedQuery]);

  const onSearchButtonClick = async () => {
    if (!searchQuery.trim()) return;

    setAutoUseLocation(false);
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=1&countrycodes=vn`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setUserLocation({ lat, lng: lon });
        await handleFetchFields(lat, lon, selectedType);
      } else {
        await loadAllFields();
      }
    } catch (error) {
      console.error("Lỗi tìm kiếm địa chỉ:", error);
      await loadAllFields();
    }

    setAddressSuggestions([]);
  };

  const onSelectSuggestion = async (addr: any) => {
    setAutoUseLocation(false);
    setSearchQuery(addr.display_name);
    setUserLocation({ lat: addr.lat, lng: addr.lon });
    setAddressSuggestions([]);
    await handleFetchFields(addr.lat, addr.lon, selectedType);
  };

  const selectFieldType = (typeId: string) => {
    setSelectedType((prev) => (prev === typeId ? null : typeId));
  };

  const applyFilters = async () => {
    if (userLocation) {
      await handleFetchFields(userLocation.lat, userLocation.lng, selectedType);
    } else {
      await loadAllFields();
    }
    setShowFilters(false);
  };

  const handleResetFilters = async () => {
    setSelectedType(null);
    setUserLocation(null);
    setSearchQuery("");
    setAddressSuggestions([]);
    setAutoUseLocation(true);
    setShowFilters(false);
    await fetchLocationAndFields();
  };

  return (
    <div className="w-full">
      {/* Header + Filter Button */}
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

      {/* Search box */}
      <div className="w-full max-w-md px-5 mb-4 relative z-50">
        <div className="flex items-center bg-white rounded-md overflow-hidden shadow-sm">
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

        {/* Suggestions */}
        {addressSuggestions.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow max-h-60 overflow-y-auto">
            {addressSuggestions.map((addr, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                onClick={() => onSelectSuggestion(addr)}
              >
                {addr.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Filter Dropdown */}
      {showFilters && (
        <div className="fixed top-[90px] right-4 z-50 w-64 bg-white border shadow-lg rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700">Lọc loại sân</h3>
            <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
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

          <button onClick={applyFilters} className="w-full mt-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Áp dụng
          </button>
          <button onClick={handleResetFilters} className="w-full mt-2 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Đặt lại
          </button>
        </div>
      )}

      {/* Field list */}
      <div className="pt-4">
        <FieldList fields={paginatedFields} />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-4">
          {currentPage > 1 && (
            <button onClick={() => setCurrentPage((prev) => prev - 1)} className="px-4 py-2 bg-blue-500 text-white rounded">
              Trang trước
            </button>
          )}
          <span className="text-gray-600 text-sm">
            Trang {currentPage} / {totalPages}
          </span>
          {currentPage < totalPages && (
            <button onClick={() => setCurrentPage((prev) => prev + 1)} className="px-4 py-2 bg-blue-500 text-white rounded">
              Trang sau
            </button>
          )}
        </div>
      )}
    </div>
  );
}
