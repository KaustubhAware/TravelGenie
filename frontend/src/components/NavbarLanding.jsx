import { useEffect, useState } from "react";
import logo from "../assets/logo.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaChevronRight,
  FaCompass,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

const NAV_LINKS = [
  { id: "home", label: "Home", path: "/" },
  { id: "treks", label: "Treks", path: "/treks" },
  { id: "destinations", label: "Destinations", path: "/destinations" },
  { id: "ai", label: "AI Planner", path: "/ai-planner" },
  { id: "blog", label: "Guides", path: "/blog" },
];

const NavbarLanding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavLink = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <nav className="fixed left-0 top-0 z-50 w-full px-3 pt-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          animate={{
            backgroundColor: scrolled ? "rgba(22, 51, 40, 0.88)" : "rgba(0, 0, 0, 0.28)",
            borderColor: scrolled ? "rgba(255, 255, 255, 0.14)" : "rgba(255, 255, 255, 0.1)",
          }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border px-4 shadow-2xl backdrop-blur-xl lg:px-6"
        >
          <motion.div
            className="flex h-[72px] items-center justify-between"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              type="button"
              onClick={() => handleNavLink("/")}
              className="flex min-w-0 items-center gap-3 text-left"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/12">
                <img
                  src={logo}
                  alt="TravelGenie"
                  className="h-8 w-8 object-contain"
                />
              </span>
              <span className="min-w-0">
                <span className="font-heading block truncate text-xl font-bold tracking-tight text-white md:text-2xl">
                  TravelGenie
                </span>
                <span className="mt-0.5 hidden text-[11px] uppercase tracking-[0.18em] text-white/55 sm:block">
                  Trekking Ops SaaS
                </span>
              </span>
            </button>

            <div className="hidden items-center rounded-full border border-white/10 bg-white/8 p-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavLink(link.path)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive(link.path)
                      ? "bg-white text-primary"
                      : "text-white/76 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white/78 transition hover:bg-white/10 hover:text-white md:flex"
              >
                <FaUserCircle className="text-base" />
                Login
              </button>

              <motion.button
                type="button"
                onClick={() => navigate("/treks")}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="hidden items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-accent-dark sm:inline-flex"
              >
                <FaCompass />
                Explore Treks
              </motion.button>

              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/8 text-white lg:hidden"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-t border-white/10 pb-4 lg:hidden"
              >
                <div className="flex flex-col gap-1 pt-3">
                  {NAV_LINKS.map((link) => (
                    <button
                      key={link.id}
                      type="button"
                      onClick={() => handleNavLink(link.path)}
                      className={`flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-semibold ${
                        isActive(link.path)
                          ? "bg-white text-primary"
                          : "text-white/88 hover:bg-white/10"
                      }`}
                    >
                      {link.label}
                      <FaChevronRight className="text-xs opacity-70" />
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleNavLink("/treks")}
                    className="mt-2 rounded-xl bg-accent py-3 text-sm font-semibold text-white"
                  >
                    Explore Treks
                  </button>
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
