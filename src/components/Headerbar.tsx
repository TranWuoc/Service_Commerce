import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
const Headerbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md">
      <nav
        className="mx-auto flex max-w-7xl items-stretch p-6 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="w-44 left-[68px] top-[10px] absolute justify-center text-amber-500 text-2xl font-bold font-['Poppins'] leading-10 tracking-wider [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)] mt-[15px] cursor-pointer"
        >
          Super bowl
        </div>

        {/* Navigation Links */}
        <div className="lg:flex lg:flex-1 lg:items-center lg:justify-end lg:gap-x-12 ">
          <a
            href="/"
            className={`text-sm font-semibold ${
              location.pathname === "/" ? "text-gray-900" : "text-amber-500"
            } border-l border-gray-300 pl-4`}
          >
            Trang chủ
          </a>
          <a
            href="/san"
            className={`text-sm font-semibold ${
              location.pathname === "/san" ? "text-amber-500" : "text-gray-900"
            } border-l border-gray-300 pl-4`}
          >
            Sân
          </a>
          <a
            href="/thong-tin"
            className={`text-sm font-semibold ${
              location.pathname === "/thong-tin" ? "text-amber-500" : "text-gray-900"
            } border-l border-gray-300 pl-4`}
          >
            Thông tin
          </a>
          <a
            href="/lien-he"
            className={`text-sm font-semibold ${
              location.pathname === "/lien-he" ? "text-amber-500" : "text-gray-900"
            } border-l border-gray-300 pl-4`}
          >
            Liên hệ
          </a>
          <Button
            text="Đăng nhập"
            type="primary"
            onClick={() => navigate("/login")}
          />
        </div>
      </nav>
    </header>
  );
};

export default Headerbar;