import * as React from "react";

export const ImageOverlay: React.FC = () => {
  return (
    <div className=" flex relative w-full h-[100vh] overflow-hidden"> 
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/1/1d/Football_Pallo_valmiina-cropped.jpg"
        className="object-cover w-full h-full"
        alt="Yellow taxis"
      />
      <div className="absolute inset-0 bg-white-500 bg-opacity-20" />
    </div>
  );
};