import * as React from "react";
import { InputField } from "../Shared_components/InputField";
import { AuthToggle } from "./AuthToggle";
import { useLocation } from "react-router-dom";
import Button from "../Shared_components/Button";
import { useLogin } from "../../hooks/useLogin"; 

export const LoginForm: React.FC = () => {
  const location = useLocation();
  const { login } = useLogin(); 

  const activeTab = location.pathname === "/register" ? "register" : "login";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password); 
  };

  return (
    <section className="flex flex-col items-center px-20 py-8 w-full max-md:px-5 max-md:py-6 max-md:w-full h-screen">
      <header className="mb-6 text-base">
        <span>Welcome to </span>
        <span className="text-amber-500">Auto Car</span>
      </header>
      <AuthToggle activeTab={activeTab} />

      <form className="w-full flex flex-col justify-between flex-1" onSubmit={handleSubmit}>
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
          <a href="#" className="text-amber-500 text-base">
            Forgot Password?
          </a>
        </div>

        <div className="mt-auto justify-center flex flex-col items-center">
          <Button
            text={activeTab === "login" ? "Login" : "Register"}
            type="primary"
            customStyle={{ width: "50%", height: "60px" }}
          />
        </div>
      </form>
    </section>
  );
};
