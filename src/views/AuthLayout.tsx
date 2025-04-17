import React from "react";
import { ImageOverlay } from "../components/Auth/ImageOverlay";

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (

    <main className="flex w-full min-h-[70vh] bg-white">
      {/* Phần bên trái chứa ImageOverlay */}
      <div className="w-1/2 h-[40vh]">
        <ImageOverlay />
      </div>

      <div className="w-1/2 h-screen flex items-center justify-center p-8">
        {children}
      </div>
   </main>
  );
};
