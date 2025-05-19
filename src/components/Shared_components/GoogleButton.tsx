// GoogleLoginButton.tsx
import Button from "./Button";

const GoogleIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 488 512"
  >
    <path
      fill="#fff"
      d="M488 261.8C488 403.3 391.1 496 248 496 110.9 496 0 385.1 0 248S110.9 0 248 0c66.8 0 123 24.5 166.3 64.9l-67.4 64.9C316.3 83.6 284.6 72 248 72c-97 0-176 79-176 176s79 176 176 176c84.2 0 137.4-48 147.2-115.4H248v-92.8h240C487.4 224.5 488 243.6 488 261.8z"
    />
  </svg>
);

export const GoogleLoginButton = () => {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams({
      client_id: "821700928894-63h51cko8dra16gpl3h2ojjnh8736820.apps.googleusercontent.com",
      redirect_uri: "http://localhost:5173/auth/google/callback",
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return (
    <Button
      text="Đăng nhập bằng Google"
      type="google"
      onClick={handleLogin}
      icon={GoogleIcon}
      
    />
  );
};
