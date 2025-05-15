"use client";
import * as React from "react";
import { InputField } from "../Shared_components/InputField";
import { AuthToggle } from "./AuthToggle";
import { useLocation } from "react-router-dom";
import Button from "../Shared_components/Button";
import { useRegister } from "../../hooks/useRegister";

export const RegisterForm: React.FC = () => {
  const location = useLocation();
  const activeTab = location.pathname === "/register" ? "register" : "login";
  const { register } = useRegister();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [avatarFile, setAvatarFile] = React.useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("re_password", confirmPassword);
    formData.append("address", address);
    formData.append("phone_number", phoneNumber);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }
    await register(formData);
  };

  const inputCustomClass = "text-base h-[36px] px-3";

  return (
    <section className="flex flex-col items-center px-20 py-8 w-full max-md:px-5 max-md:py-6 max-md:w-full h-screen">
      <header className="mb-6 text-base">
        <span>Welcome to </span>
        <span className="text-amber-500">SUPPERBOWL</span>
      </header>
      <AuthToggle activeTab={activeTab} />

      <form className="mt-5 w-full flex flex-col justify-between flex-1" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <InputField label="Name" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} customClass={inputCustomClass} />
          <InputField label="Email" type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} customClass={inputCustomClass} />

          <InputField label="Phone Number" type="text" placeholder="Your phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} customClass={inputCustomClass} />
          <InputField label="Address" type="text" placeholder="Your address" value={address} onChange={(e) => setAddress(e.target.value)} customClass={inputCustomClass} />

          <InputField label="Password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} customClass={inputCustomClass} />
          <InputField label="Confirm Password" type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} customClass={inputCustomClass} />
        </div>


        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700">Avatar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            className="border rounded px-2 py-1 text-sm w-full"
          />
        </div>

        <div className="mt-auto flex flex-col items-center">
          <p className="mb-2 text-sm text-center">
            <span>By signing up you agree to </span>
            <a href="#" className="text-amber-500">terms and conditions</a>
          </p>

          <Button
            text="Register"
            type="primary"
            customStyle={{ width: "100%", height: "60px" }}
          />
        </div>
      </form>

    </section>
  );
};
