"use client";

import Sidebar from "./Sidebar";
import { useSidebar } from "@/context/SidebarContext";

export default function SidebarContainer() {
  const { isSidebarCollapsed } = useSidebar();
  return <Sidebar isCollapsed={isSidebarCollapsed} />;
}