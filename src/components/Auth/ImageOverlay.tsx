import * as React from "react";

export const ImageOverlay: React.FC = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden"> 
      <img
        src="https://cdn-i2.vtcnews.vn/upload/2024/12/06/4693654565446164950565166172323134218851978n-11101528.jpg"
        className="object-cover w-full h-full"
        alt="Yellow taxis"
      />
      <div className="absolute inset-0 bg-white-500 bg-opacity-20" />
    </div>
  );
};