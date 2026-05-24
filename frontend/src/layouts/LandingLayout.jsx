import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

import NavbarLanding from "../components/NavbarLanding";
import Footer from "../components/Footer";

/**
 * Public marketing site shell — fixed landing navbar + footer.
 */
const LandingLayout = () => {
  return (
    <motion.div
      className="min-h-screen bg-surface"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >

      <NavbarLanding />

      <main>

        <Outlet />

      </main>

      <Footer />

    </motion.div>
  );
};

export default LandingLayout;