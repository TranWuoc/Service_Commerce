"use client";
import * as React from "react";
import { InputField } from "../Shared_components/InputField";
import { AuthToggle } from "./AuthToggle";
import { useLocation } from "react-router-dom";
import Button from "../Shared_components/Button";
import { useRegister } from "../../hooks/useRegister";
import { useToast } from "../../hooks/use-toast";
export const RegisterForm: React.FC = () => {
  const location = useLocation();
  const activeTab = location.pathname === "/register" ? "register" : "login";
  const { register } = useRegister();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Kiểm tra dữ liệu
    if (!name || !email || !password || !confirmPassword) {
      toast.toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ các trường.",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast.toast({
        variant: "destructive",
        title: "Mật khẩu không khớp",
        description: "Mật khẩu và xác nhận mật khẩu phải giống nhau.",
      });
      return;
    }

    await register({ name, email, password });
  };

  return (
    <section className="flex flex-col items-center px-20 py-8 w-full max-md:px-5 max-md:py-6 max-md:w-full h-screen">
      <header className="mb-6 text-base">
        <span>Welcome to </span>
        <span className="text-amber-500">LGBTLGBT</span>
      </header>
      <AuthToggle activeTab={activeTab} />

      <form className="w-full flex flex-col justify-between flex-1" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <InputField
            label="Name"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <InputField
            label="Email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="mt-auto">
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

