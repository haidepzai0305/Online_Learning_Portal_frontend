import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4500,
        style: {
          maxWidth: "min(420px, 92vw)",
          borderRadius: "12px",
          background: "rgba(22, 23, 29, 0.95)",
          color: "#f3f4f6",
          border: "1px solid rgba(255,255,255,0.08)",
        },
      }}
    />
  </StrictMode>
);
