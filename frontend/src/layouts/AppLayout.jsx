import { Outlet } from "react-router-dom";

import DashboardSidebar from "../components/layout/DashboardSidebar";

import DashboardTopbar from "../components/layout/DashboardTopbar";

const AppLayout = () => {

  return (

    <div className="flex h-screen overflow-hidden bg-[#F7F8F5]">

      {/* SIDEBAR */}

      <DashboardSidebar />

      {/* MAIN */}

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* TOPBAR */}

        <DashboardTopbar />

        {/* PAGE */}

        <main className="flex-1 overflow-y-auto p-6">

          <Outlet />

        </main>

      </div>

    </div>

  );

};

export default AppLayout;