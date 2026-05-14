import { useState } from "react";

import Sidebar from "../components/admin/Sidebar";

import DashboardHeader from "../components/admin/DashboardHeader";

export default function AdminLayout({
  children,
  search = "",
  setSearch = () => {},
}) {

  const [sidebarOpen, setSidebarOpen] =
    useState(true);

  /* LOGOUT */

  const logout = () => {

    localStorage.removeItem("token");

    window.location.href =
      "/admin/login";

  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-[#f4f7ff] to-[#eef5ff] flex">

      {/* SIDEBAR */}

      <Sidebar
        sidebarOpen={
          sidebarOpen
        }
        setSidebarOpen={
          setSidebarOpen
        }
        logout={logout}
      />

      {/* MAIN */}

      <div className="flex-1 overflow-y-auto">

        {/* HEADER */}

        <DashboardHeader
          search={search}
          setSearch={setSearch}
        />

        {/* PAGE CONTENT */}

        <div className="p-8">

          {children}

        </div>

      </div>

    </div>

  );
}