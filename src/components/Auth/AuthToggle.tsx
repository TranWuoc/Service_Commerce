"use client";
import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface AuthToggleProps {
  activeTab: "login" | "register";
}

export const AuthToggle: React.FC<AuthToggleProps> = ({ activeTab }) => {
  const navigate = useNavigate();
  const location = useLocation(); 

  React.useEffect(() => {
  }, [location.pathname]);

  const handleClick = (tab: "login" | "register") => {
    if (location.pathname !== `/${tab}`) {
      navigate(`/${tab}`);
    }
  };

  return (
    <div className="flex relative mb-0 bg-black h-[50px] rounded-[35px] w-[400px] max-sm:h-[50px] max-sm:w-[320px]">
      <div
        className={`absolute top-0 h-full w-1/2 bg-amber-500 rounded-[35px] transition-transform duration-300 ${
          activeTab === "register" ? "translate-x-full" : "translate-x-0"
        }`}
      />
      <button
        onClick={() => handleClick("login")}
        className={`relative z-10 w-6/12 text-2xl cursor-pointer transition-colors duration-200 max-sm:text-xl hover:opacity-80 focus:outline-none ${
          activeTab === "login" ? "text-white" : "text-amber-500"
        }`}
      >
        Login
      </button>
      <button
        onClick={() => handleClick("register")}
        className={`relative z-10 w-6/12 text-2xl cursor-pointer transition-colors duration-200 max-sm:text-xl hover:opacity-80 focus:outline-none ${
          activeTab === "register" ? "text-white" : "text-amber-500"
        }`}
      >
        Register
      </button>
    </div>
  );
};
