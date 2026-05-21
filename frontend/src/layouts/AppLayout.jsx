/* ===================================================== */
/* APP LAYOUT */
/* ===================================================== */

import { Outlet } from "react-router-dom";
import NavbarApp from "../components/NavbarApp";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7F8F5]">

      {/* ===================================================== */}
      {/* APP NAVBAR */}
      {/* ===================================================== */}

      <NavbarApp />

      {/* ===================================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================================== */}

      <main className="px-4 py-6 md:px-6 lg:px-8">

        <div className="mx-auto max-w-7xl">

          <Outlet />

        </div>

      </main>

    </div>
  );
};

export default AppLayout;