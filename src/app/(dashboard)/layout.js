import SidebarContainer from "@/components/SidebarContainer";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0E14]">
      {/* The sidebar panel lives explicitly inside this group configuration only */}
      <SidebarContainer />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Protected header navigation panel */}
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6 text-[#F5F6FA]">
          {children}
        </main>
      </div>
    </div>
  );
}