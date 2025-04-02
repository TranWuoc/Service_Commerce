import * as React from "react";

export const ImageOverlay: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden"> 
      <img
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/5d52a75098326f8f517b71bf0d417b98558a6225"
        className="object-cover w-full h-full"
        alt="Yellow taxis"
      />
      <div className="absolute inset-0 bg-amber-500 bg-opacity-20" />
    </div>
  );
};