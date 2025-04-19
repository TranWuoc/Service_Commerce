"use client";
import * as React from "react";
import { InputField } from "../Shared_components/InputField";
import { AuthToggle } from "./AuthToggle";
import { useLocation } from "react-router-dom";
import  Button  from "../Shared_components/Button";
export const RegisterForm: React.FC = () => {
  const location = useLocation();
  const activeTab = location.pathname === "/register" ? "register" : "login";

  return (
    <section className="flex flex-col items-center px-20 py-8 w-full max-md:px-5 max-md:py-6 max-md:w-full h-screen">
      <header className="mb-6 text-base">
        <span>Welcome to </span>
        <span className="text-amber-500">LGBTLGBT</span>
      </header>
      <AuthToggle activeTab={activeTab} />

      <form className="w-full flex flex-col justify-between flex-1">
        <div className="space-y-2">
          <InputField label="Name" type="text" placeholder="Full Name" value="" />
          <InputField label="Phone number" type="text" placeholder="Personal Phone Number" value="" />
          <InputField label="Email" type="email" placeholder="Email Address" value="" />
         
        </div>

        <div className="mt-auto flex flex-col items-center">
          <p className="mb-2 text-sm text-center">
            <span>By signing up you agree to </span>
            <a href="#" className="text-amber-500">terms and conditions</a>
          </p>

          <Button
            text="Register"
            type="primary"
            customStyle={{ width: "50%", height: "60px" }}
            onClick={() => {
              // Handle register action here
              console.log("Register button clicked");
            }
            
            }
          />
        </div>
      </form>
    </section>
  );
};
