import {
  useEffect,
  useState,
} from "react";

import logo from "../assets/logo.svg";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  FaBars,
  FaCompass,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

const NAV_LINKS = [

  {
    label: "Home",
    path: "/",
  },

  {
    label: "Packages",
    path: "/dashboard/packages",
  },

  {
    label: "AI Planner",
    path: "/dashboard/ai-planner",
  },

];

const NavbarLanding = () => {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {

    const onScroll = () =>

      setScrolled(
        window.scrollY > 20
      );

    onScroll();

    window.addEventListener(
      "scroll",
      onScroll,
      { passive: true }
    );

    return () =>

      window.removeEventListener(
        "scroll",
        onScroll
      );

  }, []);

  const isActive = (path) =>

    location.pathname === path;

  return (

    <nav className="fixed top-0 left-0 w-full z-50 px-4 pt-4">

      <div className="max-w-7xl mx-auto">

        <motion.div
          animate={{
            backgroundColor:
              scrolled

                ? "rgba(15,23,42,0.92)"

                : "rgba(15,23,42,0.55)",
          }}
          className="rounded-[28px] border border-white/10 backdrop-blur-xl shadow-2xl px-6"
        >

          <div className="h-[82px] flex items-center justify-between">

            {/* LOGO */}

            <button
              onClick={() =>
                navigate("/")
              }
              className="flex items-center gap-4"
            >

              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">

                <img
                  src={logo}
                  alt="TravelGenie"
                  className="w-10 h-10"
                />

              </div>

              <div className="text-left">

                <h2 className="text-4xl font-black text-white">

                  TravelGenie

                </h2>

                <p className="text-white/60 text-xs uppercase tracking-[0.25em] mt-1">

                  Trekking Ops SaaS

                </p>

              </div>

            </button>

            {/* DESKTOP NAV */}

            <div className="hidden lg:flex items-center gap-2 bg-white/5 border border-white/10 rounded-full p-2">

              {NAV_LINKS.map((item) => (

                <button
                  key={item.path}
                  onClick={() =>
                    navigate(item.path)
                  }
                  className={`px-5 py-3 rounded-full text-sm font-bold transition ${
                    isActive(item.path)

                      ? "bg-white text-slate-900"

                      : "text-white/80 hover:bg-white/10"
                  }`}
                >

                  {item.label}

                </button>

              ))}

            </div>

            {/* ACTIONS */}

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  navigate("/login")
                }
                className="hidden md:flex items-center gap-2 text-white font-semibold hover:text-orange-400 transition"
              >

                <FaUserCircle />

                Login

              </button>

              <button
                onClick={() =>
                  navigate(
                    "/dashboard/packages"
                  )
                }
                className="hidden sm:flex h-14 px-7 rounded-full bg-orange-500 hover:bg-orange-600 transition text-white font-bold items-center gap-3"
              >

                <FaCompass />

                Explore Treks

              </button>

              {/* MOBILE */}

              <button
                onClick={() =>
                  setMobileOpen(
                    !mobileOpen
                  )
                }
                className="lg:hidden w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center"
              >

                {mobileOpen

                  ? <FaTimes />

                  : <FaBars />
                }

              </button>

            </div>

          </div>

          {/* MOBILE MENU */}

          <AnimatePresence>

            {mobileOpen && (

              <motion.div
                initial={{
                  height: 0,
                  opacity: 0,
                }}
                animate={{
                  height: "auto",
                  opacity: 1,
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                }}
                className="overflow-hidden lg:hidden border-t border-white/10"
              >

                <div className="py-5 flex flex-col gap-3">

                  {NAV_LINKS.map((item) => (

                    <button
                      key={item.path}
                      onClick={() => {

                        navigate(
                          item.path
                        );

                        setMobileOpen(
                          false
                        );

                      }}
                      className="h-12 rounded-2xl bg-white/5 text-white font-semibold"
                    >

                      {item.label}

                    </button>

                  ))}

                </div>

              </motion.div>

            )}

          </AnimatePresence>

        </motion.div>

      </div>

    </nav>

  );

};

export default NavbarLanding;