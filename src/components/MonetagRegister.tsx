"use client";

import { useEffect } from "react";

export default function MonetagRegister() {
  useEffect(() => {
    // Only register in production environment to avoid hot-reloading issues during development
    if (process.env.NODE_ENV !== "production") return;

    if ("serviceWorker" in navigator) {
      const registerSW = async () => {
        try {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("Monetag Service Worker registered successfully with scope:", registration.scope);
        } catch (error) {
          console.error("Monetag Service Worker registration failed:", error);
        }
      };

      // Register after page load to prevent blocking the initial paint
      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
        return () => window.removeEventListener("load", registerSW);
      }
    }
  }, []);

  return null;
}
