import React, { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaFilter, FaSearch } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { FieldList } from "../Field/FieldList";
import { fetchAllFields, fetchFields, getLocation } from "../../actions/fieldActions";
import { useDebounce } from "../../lib/utils";

export function FieldsSummary({ onStartLoading, onStopLoading }: { onStartLoading: () => void; onStopLoading: () => void; }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: string; lng: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLocationButtonActivated, setIsLocationButtonActivated] = useState(false);

  const debouncedQuery = useDebounce(searchQuery, 500);

  const fieldTypes = [
    { id: "cat-uuid-001", name: "Sân 5" },
    { id: "cat-uuid-002", name: "Sân 7" },
    { id: "cat-uuid-003", name: "Sân 11" },
  ];

  const loadAllFields = async () => {
    setIsLoading(true);
    const data = await fetchAllFields();
    setFields(data);
    setIsLoading(false);
  };

  const fetchFieldsByLocation = async (lat: string, lng: string, categoryId?: string | null) => {
    setIsLoading(true);
    const data = await fetchFields(lat, lng, categoryId ?? null);
    setFields(data);
    setIsLoading(false);
  };

  const handleToggleLocation = async () => {
    if (isLocationFetched) {
      setIsLocationFetched(false);
      setIsLocationButtonActivated(false);
      setUserLocation(null);
      await loadAllFields();
    } else {
      try {
        const loc = await getLocation();
        setUserLocation(loc);
        setIsLocationFetched(true);
        setIsLocationButtonActivated(true);
        const categoryId = selectedTypes.length > 0 ? selectedTypes[0] : null;
        await fetchFieldsByLocation(loc.lat, loc.lng, categoryId);
      } catch (err) {
        console.error("Không thể lấy vị trí:", err);
      }
    }
  };

  const toggleFieldType = (typeId: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  const applyFilters = async () => {
    const categoryId = selectedTypes.length > 0 ? selectedTypes[0] : null;
    if (userLocation) {
      await fetchFieldsByLocation(userLocation.lat, userLocation.lng, categoryId);
    } else {
      await loadAllFields();
    }
    setShowFilters(false);
  };

  const handleResetFilters = async () => {
    setSelectedTypes([]);
    setUserLocation(null);
    setSearchQuery("");
    setAddressSuggestions([]);
    setIsLocationFetched(false);
    setIsLocationButtonActivated(false);
    setShowFilters(false);
    await loadAllFields();
  };

  const searchAddress = async (query: string) => {
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

  useEffect(() => {
    loadAllFields();
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl pl-5 font-bold text-gray-800">Danh sách sân bóng</h2>

        <div className="flex items-center gap-2 relative">
          <button
            onClick={handleToggleLocation}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors
              ${isLocationButtonActivated ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800 hover:bg-blue-200"}
              ${isLoading ? "opacity-70 cursor-wait" : ""}`}
          >
            <FaMapMarkerAlt />
            <span className="whitespace-nowrap">
              {
                 isLocationButtonActivated && isLocationFetched
                ? "Đã xác định vị trí (nhấn lại để quay về)"
                : "Tìm theo vị trí"}
            </span>
          </button>

          <button
            onClick={() => setShowFilters((prev) => !prev)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            title="Lọc loại sân"
          >
            <FaFilter />
          </button>
        </div>
      </div>

<div className="w-full max-w-md px-5 mb-4">
 <div className="flex items-center bg-opacity-100 rounded-md overflow-hidden">
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Tìm kiếm theo địa chỉ..."
    className="flex-1 px-4 py-2 focus:outline-none h-10"
  />
  <button
    onClick={async () => {
      if (searchQuery.trim()) {
        await searchAddress(searchQuery);
      }
    }}
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
          onClick={async () => {
            const lat = addr.lat;
            const lng = addr.lon;
            const categoryId = selectedTypes.length > 0 ? selectedTypes[0] : null;
            await fetchFieldsByLocation(lat, lng, categoryId);
            setUserLocation({ lat, lng });
            setSearchQuery(addr.display_name);
            setAddressSuggestions([]);
            setIsLocationFetched(true);
            setIsLocationButtonActivated(false);
          }}
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
                  type="checkbox"
                  checked={selectedTypes.includes(type.id)}
                  onChange={() => toggleFieldType(type.id)}
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
        <FieldList fields={fields} />
      </div>
    </div>
  );
}
