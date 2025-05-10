import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // ✅ import App chứa toàn bộ provider
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <script src="https://accounts.google.com/gsi/client" async defer></script>
    <App /> {/* ✅ App sẽ tự chứa BrowserRouter và AppRouter */}
  </React.StrictMode>
);
