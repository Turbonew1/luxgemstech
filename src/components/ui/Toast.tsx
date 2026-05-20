"use client";

import { Toaster as HotToaster } from "react-hot-toast";

export function Toaster() {
  return (
    <HotToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "10px",
          background: "#1a1a2e",
          color: "#fff",
          fontSize: "14px",
        },
        success: {
          iconTheme: { primary: "#c9a96e", secondary: "#fff" },
        },
      }}
    />
  );
}
