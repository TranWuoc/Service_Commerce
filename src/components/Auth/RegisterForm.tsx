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
const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const rawValue = e.target.value;
  const numericValue = rawValue.replace(/(?!^\+)[^\d]/g, ""); 

  // Giới hạn độ dài
  const isValidFormat = /^(0\d{0,9}|\+84\d{0,9})$/.test(numericValue);

  if (numericValue === "" || isValidFormat) {
    setPhoneNumber(numericValue);
  }
};
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("re_password", confirmPassword);
    formData.append("address", address);
    formData.append("phone_number", phoneNumber);
    if (avatarFile) formData.append("avatar", avatarFile);

    await register(formData);
  };

  const inputCustomClass = "text-base h-[36px] px-3";

  return (
    <section className="flex flex-col items-center px-6 py-8 w-full max-w-xl mx-auto h-screen">
      <header className="mb-4 text-lg">
        <span>Welcome to </span>
        <span className="text-amber-500 font-semibold">SUPPERBOWL</span>
      </header>

      <div className="mb-10">
        <AuthToggle activeTab={activeTab} />
      </div>

      <form
        className="w-full flex flex-col justify-between min-h-[500px]"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <InputField label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} customClass={inputCustomClass} />
          <InputField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} customClass={inputCustomClass} />
          <InputField label="Phone Number" type="text" value={phoneNumber} onChange={handlePhoneChange} customClass={inputCustomClass} />
          <InputField label="Address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} customClass={inputCustomClass} />
          <InputField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} customClass={inputCustomClass} />
          <InputField label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} customClass={inputCustomClass} />
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
            By signing up you agree to{" "}
            <a href="#" className="text-amber-500">terms and conditions</a>
          </p>

          <Button
            text="Register"
            type="primary"
            customStyle={{ width: "48%", height: "60px" }}
          />
        </div>
      </form>
    </section>
  );
};
