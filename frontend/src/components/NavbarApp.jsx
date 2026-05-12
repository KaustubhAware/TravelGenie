import logo from "../assets/logo.svg";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  signOut,
} from "firebase/auth";

import { auth } from "../firebase";

const NavbarApp = () => {

  const navigate = useNavigate();

  const location = useLocation();

  /* ================= ACTIVE LINK ================= */

  const isActive = (path) =>
    location.pathname === path;

  /* ================= NAV ITEM ================= */

  const navItem = (path, label) => (

    <button
      onClick={() => navigate(path)}
      className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
        isActive(path)
          ? "text-blue-600"
          : "text-gray-600 hover:text-blue-600"
      }`}
    >

      {label}

      {isActive(path) && (

        <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-600 rounded-full"></span>

      )}

    </button>

  );

  /* ================= LOGOUT ================= */

  const handleLogout = async () => {

    try {

      await signOut(auth);

      navigate("/");

    } catch (error) {

      console.error(error);

    }

  };

  return (

    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="h-[78px] flex items-center justify-between">

          {/* ================================================= */}
          {/* ================= LOGO ========================= */}
          {/* ================================================= */}

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

              <h1 className="text-xl font-bold text-gray-900 tracking-tight">

                TravelGenie

              </h1>

            </div>

          </div>

          {/* ================================================= */}
          {/* ================= NAV LINKS ==================== */}
          {/* ================================================= */}

          <div className="hidden lg:flex items-center gap-6">

            {navItem("/", "Home")}

            {navItem("/plan", "Plan Trip")}

            {navItem("/saved", "Saved Trips")}

            {navItem("/booking", "Booking")}

            {navItem("/admin", "Admin")}

          </div>

          {/* ================================================= */}
          {/* ================= RIGHT BUTTONS ================ */}
          {/* ================================================= */}

          <div className="flex items-center gap-3">

            {/* NEW TRIP */}

            <button
              onClick={() => navigate("/plan")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition duration-300 shadow-sm"
            >

              New Trip

            </button>

            {/* LOGOUT */}

            <button
              onClick={handleLogout}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-6 py-3 rounded-xl text-sm font-semibold transition duration-300"
            >

              Logout

            </button>

          </div>

        </div>

      </div>

    </nav>

  );

};

export default NavbarApp;