import React from "react";
import { ImageOverlay } from "../components/ImageOverlay";

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="flex mx-auto w-full min-h-screen bg-white max-md:flex-col">
      <ImageOverlay />
      {children}
    </main>
  );
};
