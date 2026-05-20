import { Outlet } from "react-router-dom";
import NavbarApp from "../components/NavbarApp";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7F8F5]">
      
      {/* APP NAVBAR */}
      <NavbarApp />

      {/* MAIN CONTENT */}
      <main className="pt-24 px-4 md:px-6 lg:px-8 pb-10">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default AppLayout;