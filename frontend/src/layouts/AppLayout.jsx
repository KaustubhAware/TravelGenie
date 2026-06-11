import { Outlet } from "react-router-dom";

import DashboardSidebar from "../components/layout/DashboardSidebar";

import DashboardTopbar from "../components/layout/DashboardTopbar";

const AppLayout = () => {

  return (

    <div className="flex min-h-screen bg-[#F7F8F5]">

      {/* SIDEBAR */}

      <DashboardSidebar />

      {/* MAIN */}

      <div className="flex min-w-0 flex-1 flex-col">

        {/* TOPBAR */}

        <DashboardTopbar />

        {/* PAGE */}

        <main className="min-w-0 flex-1 overflow-x-hidden p-4 md:p-6">

          <Outlet />

        </main>

      </div>

    </div>

  );

};

export default AppLayout;
