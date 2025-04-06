import React, { useState } from "react";

export const FieldPictureGallery: React.FC = () => {
  const images = [
    "https://cdn.builder.io/api/v1/image/assets/TEMP/fb3d2853a0fc16002d4ec9c0f5f4843ad61e4791?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da",
    "https://example.com/field2.jpg",
    "https://example.com/field3.jpg",
    // Add more images as needed
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  };

  return (
    <div className="flex flex-wrap grow max-md:mt-4">
      <div className="relative w-full h-[80vh] rounded-lg overflow-hidden">
        <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out">
          <img
            src={images[currentIndex]}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
            alt={`Field gallery ${currentIndex + 1}`}
          />
        </div>
        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
          <button
            onClick={goToPrevious}
            className="p-2 hover:bg-black/10 rounded-full transition-colors"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/2edeed5233d7c3d2a10db51f92ab9069c566da49?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da"
              className="object-contain w-6 aspect-[0.34] cursor-pointer"
              alt="Previous"
            />
          </button>
          <button
            onClick={goToNext}
            className="p-2 hover:bg-black/10 rounded-full transition-colors"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/299829980b22cfe17f9229c10c4b144fd18a2ee8?placeholderIfAbsent=true&apiKey=47da06657b0341d7b84c9cc9467a69da"
              className="object-contain w-6 aspect-[0.34] cursor-pointer"
              alt="Next"
            />
          </button>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-white" : "bg-white/50"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FieldPictureGallery;
