"use client";
import * as React from "react";
import { InputField } from "../Shared_components/InputField";
import { AuthToggle } from "./AuthToggle";
import { useLocation } from "react-router-dom";
import  Button  from "../Shared_components/Button";
export const LoginForm: React.FC = () => {
  const location = useLocation(); // Track pathname updates
  const activeTab = location.pathname === "/register" ? "register" : "login";

  return (
    <section className="flex flex-col items-center px-20 py-8 w-full max-md:px-5 max-md:py-6 max-md:w-full h-screen">
      <header className="mb-6 text-base">
        <span>Welcome to </span>
        <span className="text-amber-500">Auto Car</span>
      </header>
      <AuthToggle activeTab={activeTab} /> {/* Correct activeTab tracking */}

      <form className="w-full flex flex-col justify-between flex-1">
        <div className="space-y-4">
          <InputField label="Email" type="text" placeholder="Email Address"  />
          <InputField label="Password" type="password" placeholder="Enter your password" />

          
            <a href="#" className="text-amber-500 text-base">Forgot Password?</a>
          </div>
       

        <div className="mt-auto">
          <Button
            text={activeTab === "login" ? "Login" : "Register"}
            type="primary"
            onClick={() => {
              // Handle login or register action here
              console.log(`${activeTab} button clicked`);
            }
            }
            />
        </div>
      </form>
    </section>
  );
};
