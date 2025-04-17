"use client";
import * as React from "react";
import { InputField } from "./Shared_components/InputField";
import { useLocation } from "react-router-dom";
<<<<<<< HEAD
import Button from "./Button";
=======
import Button from "./Shared_components/Button";
>>>>>>> master
import { ComboboxDemo } from "./Shared_components/Combobox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
export const FindFieldForm: React.FC = () => {
  const location = useLocation();

  return (
    
      <form className="flex flex-row bg-white dark:bg-zinc-900 shadow-2xl rounded-2xl overflow-hidden border-4 border-orange-400 dark:border-blue-800 ">
        <div className="px-8 py-10 md:px-10">
          <h2 className="text-4xl font-extrabold text-center text-orange-400 dark:text-white">
            Tìm sân nhanh
          </h2>
          <div className="mt-10">
            <div className=" flex flex-col gap-2">
            <Label htmlFor="Vị trí">Vị trí</Label>
            <Input type="Nhập vị trí cần tìm " id="address" placeholder="Nhập vị trí cần tìm" />
            </div>
            <div className="mt-6 flex flex-col gap-2">
            <Label htmlFor="Vị trí">Kiểu sân </Label>
            <ComboboxDemo />
            </div>
            <div className="mt-6">
            <Label htmlFor="Vị trí">Thời gian</Label>
            <Input type="date" id="date" placeholder="Chọn thời gian" />
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
        <img
          src="/Mu.jpg"
          alt="Stadium"
          className="w-[500px] h-[600px] m-0 p-0"
        />
      </form>
  );
};
