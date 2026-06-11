import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import DashboardHeader from "../components/admin/DashboardHeader";
import { clearAdminAuth } from "../utils/authToken";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState("");

  const logout = () => {
    clearAdminAuth();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="flex min-h-screen w-full">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader
            search={search}
            setSearch={setSearch}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            logout={logout}
          />

          <main className="min-w-0 flex-1 overflow-x-hidden">
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
