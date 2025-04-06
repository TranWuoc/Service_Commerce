import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

const Headerbar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer text-amber-500 text-2xl font-bold font-['Poppins'] leading-10 tracking-wider [text-shadow:_0px_4px_4px_rgb(0_0_0_/_0.25)]"
        >
          Super bowl
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-x-20  ml-20 "> {/* Increased gap-x and reduced ml */}
          <a
            href="/"
            className={`text-sm font-semibold ${
              location.pathname === "/" ? "text-gray-900" : "text-amber-500"
            }`}
          >
            Trang chủ
          </a>
          <a
            href="/san"
            className={`text-sm font-semibold ${
              location.pathname === "/san" ? "text-amber-500" : "text-gray-900"
            }`}
          >
            Sân
          </a>
          <a
            href="/thong-tin"
            className={`text-sm font-semibold ${
              location.pathname === "/thong-tin" ? "text-amber-500" : "text-gray-900"
            }`}
          >
            Thông tin
          </a>
          <a
            href="/lien-he"
            className={`text-sm font-semibold ${
              location.pathname === "/lien-he" ? "text-amber-500" : "text-gray-900"
            }`}
          >
            Liên hệ
          </a>
          {/* Smaller Login Button */}
          <div className=" flex items-left ">
            <Button
              text="Đăng nhập"
              type="tertiary"
              onClick={() => navigate("/login")}
              customStyle={{
                height: "50px",
                width: "200px",
                fontSize: "14px",
              }}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Headerbar;