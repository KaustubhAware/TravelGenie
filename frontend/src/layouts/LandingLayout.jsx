import {
  Outlet,
  useLocation,
} from "react-router-dom";

import { motion } from "framer-motion";

import NavbarLanding from "../components/NavbarLanding";

import Footer from "../components/Footer";

/**
 * Public marketing site shell
 */

const LandingLayout = () => {

  const location =
    useLocation();

  /* ===================================================== */
  /* AUTH PAGES */
  /* ===================================================== */

  const isAuthPage =

    location.pathname === "/login" ||

    location.pathname === "/register";

  return (

    <motion.div
      className="min-h-screen bg-surface"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.4,
      }}
    >

      {/* ===================================================== */}
      {/* NAVBAR */}
      {/* ===================================================== */}

      {!isAuthPage && (

        <NavbarLanding />

      )}

      {/* ===================================================== */}
      {/* CONTENT */}
      {/* ===================================================== */}

      <main>

        <Outlet />

      </main>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      {!isAuthPage && (

        <Footer />

      )}

    </motion.div>

  );

};

export default LandingLayout;