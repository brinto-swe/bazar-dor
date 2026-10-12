"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3500,
        style: {
          border: "1px solid #dce5df",
          borderRadius: "12px",
          color: "#26332c",
        },
        success: { iconTheme: { primary: "#047857", secondary: "#fff" } },
      }}
    />
  );
}
