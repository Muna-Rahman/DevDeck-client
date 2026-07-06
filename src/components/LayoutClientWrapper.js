
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutClientWrapper({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide the global headers/footers on both the Login and Register screens
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (!mounted) {
    return (
      <div className="relative flex min-h-screen flex-col z-10">
        <main className="flex-1 flex flex-col">{children}</main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col z-10">
      {!isAuthPage && <Navbar />}
      
      <main className="flex-1 flex flex-col">
        {children}
      </main>

      {!isAuthPage && <Footer />}
    </div>
  );
}