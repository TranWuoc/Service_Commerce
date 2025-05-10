import * as React from "react";
import { InputField } from "../Shared_components/InputField";
import { AuthToggle } from "./AuthToggle";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../Shared_components/Button";
import { useLogin } from "../../hooks/useLogin";
import { GoogleLoginButton } from "../Shared_components/GoogleButton";

export const LoginForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = location.pathname === "/register" ? "register" : "login";
  const { login } = useLogin();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <section className="flex flex-col items-center px-20 py-8 w-full max-md:px-5 max-md:py-6 h-screen">
      <header className="mb-4 text-base">
        <span>Welcome to </span>
        <span className="text-amber-500">LGBT</span>
      </header>

      <AuthToggle activeTab={activeTab} />

      <form className="w-full  flex flex-col item-center gap-6 mt-20" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <InputField
            id="email"
            label="Email"
            type="text"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="mt-3 flex w-full justify-center items-center space-x-2">
          <Button
            text={activeTab === "login" ? "Login" : "Register"}
            type="primary"
            customStyle={{ width: "48%", height: "60px" }} // Chỉnh độ rộng các nút
          />

        </div>
        <div className="mt-3 flex w-full justify-center items-center space-x-2">
          <GoogleLoginButton customStyle={{ width: "30%", height: "60px" }} /> {/* Đảm bảo cả 2 nút cùng chiều rộng */}
        </div>
        
      </form>
    </section>
  );
};
