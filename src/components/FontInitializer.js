"use client";

import { useEffect } from "react";

export default function FontInitializer() {
  useEffect(() => {
    const storedFont = localStorage.getItem("devdeck_fontsize") || "medium";
    const root = document.documentElement;
    switch (storedFont) {
      case "small":
        root.style.fontSize = "14px";
        break;
      case "large":
        root.style.fontSize = "18px";
        break;
      case "medium":
      default:
        root.style.fontSize = "16px";
        break;
    }
  }, []);

  return null;
}