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
    <section className="flex flex-col items-center px-6 py-8 w-full max-w-xl mx-auto h-screen">
      <header className="mb-4 text-lg">
        <span>Welcome to </span>
        <span className="text-amber-500 font-semibold">SUPPERBOWL</span>
      </header>

      {/* Cố định vị trí AuthToggle */}
      <div className="mb-10">
        <AuthToggle activeTab={activeTab} />
      </div>

      <form
        className="w-full flex flex-col gap-6 min-h-[400px]" // giữ chiều cao cố định
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <InputField
            label="Email"
            type="text"
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
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4">
          <Button
            text="Login"
            type="primary"
            customStyle={{ width: "100%", height: "60px" }}
          />
          <GoogleLoginButton customStyle={{ width: "100%", height: "60px" }} />
        </div>
      </form>
    </section>
  );
};
