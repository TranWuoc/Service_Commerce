"use client";
import * as React from "react";
import { InputField } from "./InputField";
import { AuthToggle } from "./AuthToggle";
import { useLocation } from "react-router-dom";
import Button from "./Button";
export const FindFieldForm: React.FC = () => {
  const location = useLocation();

  return (
    <section className="flex flex-col items-center px-20 py-8 w-6/12 max-md:px-5 max-md:py-6 max-md:w-full h-screen">
      <form className="bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl overflow-hidden border-4 border-blue-400 dark:border-blue-800">
        <div className="px-8 py-10 md:px-10">
          <h2 className="text-4xl font-extrabold text-center text-orange-400 dark:text-white">
            Tìm sân nhanh
          </h2>
          <p className="text-center text-zinc-600 dark:text-zinc-400 mt-3">
            We missed you, sign in to continue.
          </p>
          <div className="mt-10">
            <div className="relative">
            <InputField label="Vị trí" type="Vị trí" placeholder="Full Name" />
            </div>
            <div className="mt-6">
            <InputField label="Loại sân" type="Loại sân" placeholder="Full Name" />
            </div>
            <div className="mt-6">
            <InputField label="Giá sân" type="Giá sân" placeholder="Full Name" />
            </div>
            <div className="mt-10 flex justify-center ">
              <Button
                text="Tìm sân"
                type="primary"
                onClick={() => alert("Tìm sân")}
                className="w-[250px] h-[60px] text-2xl font-bold"
              />
            </div>
          </div>
        </div>
        <div className="px-8 py-4 bg-blue-200 dark:bg-zinc-800">
          <div className="text-sm text-blue-900 dark:text-blue-300 text-center">
            Don't have an account?
            <a className="font-medium underline" href="#">
              Sign up
            </a>
          </div>
        </div>
      </form>
    </section>
  );
};
