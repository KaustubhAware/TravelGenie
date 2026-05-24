import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import DashboardHeader from "../components/admin/DashboardHeader";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-hidden">
      <div className="flex min-h-screen w-full">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          logout={logout}
        />

        <div className="flex flex-1 min-w-0 flex-col overflow-hidden">
          <DashboardHeader
            search={search}
            setSearch={setSearch}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />

          <main className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="w-full p-4 md:p-6 xl:p-8">
              <div className="mx-auto w-full max-w-[1800px]">
                <Outlet context={{ search, setSearch }} />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
