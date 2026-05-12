import logo from "../assets/logo.svg";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/landing.css";

const NavbarLanding = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path;

  const navItem = (path, label) => (

    <button
      onClick={() => navigate(path)}
      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
        isActive(path)
          ? "text-white"
          : "text-white/80 hover:text-white"
      }`}
    >

      {label}

      {isActive(path) && (
        <span className="absolute left-0 bottom-0 w-full h-[2px] bg-cyan-400 rounded-full"></span>
      )}

    </button>

  );

  return (

    <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-8 pt-5">

      <div className="glass-navbar max-w-7xl mx-auto rounded-2xl px-6 lg:px-10">

        <div className="h-[78px] flex items-center justify-between">

          {/* LOGO */}

          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer"
          >

            <img
              src={logo}
              alt="logo"
              className="h-10 w-10 object-contain"
            />

            <div>

              <h1 className="text-xl font-bold text-white tracking-tight">

                TravelGenie

              </h1>

              

            </div>

          </div>

          {/* NAV LINKS */}

          <div className="hidden lg:flex items-center gap-6">

            {navItem("/", "Home")}

            {navItem("/plan", "Plan Trip")}

            {navItem("/saved", "Saved Trips")}

            {navItem("/admin/login", "Admin")}

          </div>

          {/* BUTTON */}

          <button
            onClick={() => navigate("/plan")}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition duration-300 shadow-lg"
          >

            Get Started

          </button>

        </div>

      </div>

    </nav>

  );
};

export default NavbarLanding;