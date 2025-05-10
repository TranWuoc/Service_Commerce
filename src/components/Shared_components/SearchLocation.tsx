import React, { useState, useEffect } from "react";
import axios from "axios";
import { InputField } from "./InputField";

interface SearchLocationProps {
  onLocationSelect: (data: { lat: number; lon: number; address: string }) => void;
}

const SearchLocation: React.FC<SearchLocationProps> = ({ onLocationSelect }) => {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]); // Xóa gợi ý nếu chuỗi nhập quá ngắn
        return;
      }

      try {
        const response = await axios.get("https://nominatim.openstreetmap.org/search", {
          params: {
            q: query,
            format: "json",
            addressdetails: 1,
            limit: 5,
          },
        });
        setSuggestions(response.data);
      } catch (error) {
        console.error("Lỗi khi gọi Nominatim API:", error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 500); // Debounce API call
    return () => clearTimeout(debounce); // Cleanup debounce
  }, [query]);

  const handleSelect = (place: any) => {
    const selectedLocation = {
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
      address: place.display_name,
    };
    console.log("Selected location:", selectedLocation); // Log thông tin địa điểm đã chọn
    setQuery(place.display_name); // Cập nhật giá trị ô nhập
    setSuggestions([]); // Ẩn danh sách gợi ý
    onLocationSelect(selectedLocation); // Gọi callback với dữ liệu đã chọn
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value === "") {
      console.clear(); // Xóa log khi ô nhập trống
      setSuggestions([]); // Xóa danh sách gợi ý
    }
    
  };

  return (
    <div className="relative">
      <InputField
        label="Địa điểm sân"
        type="text"
        placeholder="Nhập tên địa điểm"
        value={query}
        onChange={handleInputChange}
        required
      />

      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded max-h-60 overflow-y-auto">
          {suggestions.map((item) => (
            <li
              key={item.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-left"
              onClick={() => handleSelect(item)}
            >
              {item.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchLocation;