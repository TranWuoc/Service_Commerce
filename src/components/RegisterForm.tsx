"use client";
import * as React from "react";
import { InputField } from "./InputField";
import { AuthToggle } from "./AuthToggle";
import { useLocation } from "react-router-dom";

export const RegisterForm: React.FC = () => {
  const location = useLocation();
  const activeTab = location.pathname === "/register" ? "register" : "login";

  return (
    <section className="flex flex-col items-center px-20 py-8 w-6/12 max-md:px-5 max-md:py-6 max-md:w-full h-screen">
      <header className="mb-6 text-base">
        <span>Welcome to </span>
        <span className="text-amber-500">Auto Car</span>
      </header>
      <AuthToggle activeTab={activeTab} />

      <form className="w-full max-w-md flex flex-col justify-between flex-1 mt-4">
        <div className="space-y-2">
          <InputField label="Name" type="text" placeholder="Full Name" />
          <InputField label="Phone number" type="text" placeholder="Personal Phone Number" />
          <InputField label="Email" type="email" placeholder="Email Address" />
          <InputField label="NIC" type="text" placeholder="National Identity Card" />
        </div>

        <div className="mt-auto">
          <p className="mb-2 text-sm text-center">
            <span>By signing up you agree to </span>
            <a href="#" className="text-amber-500">terms and conditions</a>
          </p>

          <button
            type="submit"
            className="h-12 text-lg bg-amber-500 rounded-xl cursor-pointer border-[none] text-neutral-50 w-full"
          >
            Register
          </button>
        </div>
      </form>
    </section>
  );
};
