import SidebarContainer from "@/components/SidebarContainer";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0E14]">
      {/* The sidebar will now ONLY exist inside inner authenticated sub-routes */}
      <SidebarContainer />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Authenticated internal dashboard top header */}
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6 text-[#F5F6FA]">
          {children}
        </main>
      </div>
    </div>
  );
}