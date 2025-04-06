"use client";
import * as React from "react";
import { InputField } from "./Shared_components/InputField";
import { AuthToggle } from "./Auth/AuthToggle";
import { useLocation } from "react-router-dom";
import Button from "./Shared_components/Button"; 

export const LoginForm: React.FC = () => {
  const location = useLocation(); // Track pathname updates
  const activeTab = location.pathname === "/register" ? "register" : "login";

  return (
    <section className="flex flex-col items-center px-20 py-8 w-6/12 max-md:px-5 max-md:py-6 max-md:w-full h-screen">
      <header className="mb-6 text-base">
        <span>Welcome to </span>
        <span className="text-amber-500">Auto Car</span>
      </header>
      <AuthToggle activeTab={activeTab} /> {/* Correct activeTab tracking */}

      <form className="w-full flex flex-col justify-between flex-1">
        <div className="space-y-4">
          <InputField label="Email" type="email" placeholder="Email Address" />
          <InputField label="Password" type="password" placeholder="Enter your password" />

          <div className="flex justify-between items-center w-[480px] max-md:w-full max-md:max-w-[480px]">
            <label className="flex items-center gap-2 text-base">
              <input type="checkbox" className="w-4 h-4" />
              Remember me
            </label>
            <a href="#" className="text-amber-500 text-base">Forgot Password?</a>
          </div>
        </div>

        <div className="mt-auto">

          <Button
            text="Login"
            type="primary"
            onClick={() => alert("Login button clicked")}
          />
        </div>
      </form>
    </section>
  );
};