import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { InputField } from "./InputField";

interface SearchLocationProps {
  onLocationSelect: (data: { lat: number; lon: number; address: string }) => void;
  initialAddress?: string;
  initialCoords?: { lat: number; lon: number };
}

const SearchLocation: React.FC<SearchLocationProps> = ({ 
  onLocationSelect, 
  initialAddress = "", 
  initialCoords 
}) => {
  const [query, setQuery] = useState<string>(initialAddress);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const hasInitialized = useRef(false);

  // Khởi tạo giá trị ban đầu
  useEffect(() => {
    if (initialAddress && !hasInitialized.current && initialCoords) {
      hasInitialized.current = true;
      onLocationSelect({
        lat: initialCoords.lat,
        lon: initialCoords.lon,
        address: initialAddress
      });
    }
  }, [initialAddress, initialCoords, onLocationSelect]);

  useEffect(() => {
    if (query === initialAddress) return;
    
    const fetchSuggestions = async () => {
      if (query.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=vn`
        );
        setSuggestions(response.data);
      } catch (error) {
        console.error("Lỗi khi gọi Nominatim API:", error);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounce);
  }, [query, initialAddress]);

  const handleSelect = (place: any) => {
    const selectedLocation = {
      lat: parseFloat(place.lat),
      lon: parseFloat(place.lon),
      address: place.display_name,
    };
    setQuery(place.display_name);
    setSuggestions([]);
    onLocationSelect(selectedLocation);
        console.log("Selected location:", selectedLocation); // Log thông tin địa điểm đã chọn

  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value === "") {
      onLocationSelect({ lat: 0, lon: 0, address: "" });
    }
  };

  return (
    <div className="relative">
      <InputField
        label="Địa điểm sân"
        type="text"
        placeholder="Nhập tên địa điểm"
        value={query}
        style={{ marginBottom: "1.5rem" }}
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