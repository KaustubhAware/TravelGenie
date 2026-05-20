import { useState } from "react";

import Sidebar from "../components/admin/Sidebar";
import DashboardHeader from "../components/admin/DashboardHeader";

export default function AdminLayout({
  children,
  search = "",
  setSearch = () => {},
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(230,126,34,0.10),transparent_28rem),linear-gradient(135deg,#0b1d17,#163328_42%,#f7f8f5_42%)] lg:flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        logout={logout}
      />

      <div className="min-w-0 flex-1 overflow-y-auto">
        <DashboardHeader search={search} setSearch={setSearch} />
        <div className="p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
