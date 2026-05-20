import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaInstagram,
  FaLinkedin,
  FaMountain,
} from "react-icons/fa";

import logo from "../assets/logo.svg";

const footerLinks = {
  Explore: [
    { label: "Trek Catalog", path: "/treks" },
    { label: "Destinations", path: "/destinations" },
    { label: "AI Planner", path: "/login" },
    { label: "Trekking Guides", path: "/blog" },
  ],
  Platform: [
    { label: "Customer Login", path: "/login" },
    { label: "Register", path: "/register" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Operator Login", path: "/admin/login" },
  ],
  Company: [
    { label: "About", path: "/" },
    { label: "Privacy", path: "/" },
    { label: "Terms", path: "/" },
    { label: "Support", path: "/" },
  ],
};

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-white/10 bg-primary-dark text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="TravelGenie"
                className="h-11 w-11 object-contain brightness-0 invert"
              />
              <div>
                <h2 className="font-heading text-2xl font-bold">TravelGenie</h2>
                <p className="text-sm text-white/70">
                  AI-Powered Trekking Operations
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/70">
              Premium SaaS for Himalayan expedition operators: curated treks,
              departures, bookings, and AI-assisted personalization.
            </p>

            <div className="mt-6 flex items-center gap-3 text-white/80">
              <FaMountain className="text-accent" />
              <span className="text-sm">Built for real trekking businesses</span>
            </div>

            <div className="mt-6 flex gap-4">
              {[FaInstagram, FaLinkedin, FaEnvelope].map((Icon, i) => (
                <motion.span
                  key={i}
                  whileHover={{ y: -2 }}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon />
                </motion.span>
              ))}
            </div>
          </motion.div>

          <div className="grid gap-10 sm:grid-cols-3">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-accent">
                  {title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={() => navigate(link.path)}
                        className="text-sm text-white/70 transition hover:text-white"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row">
          <p>Copyright 2026 TravelGenie. Himalayan trekking operations platform.</p>
          <p>Curated expeditions - AI-assisted - Operator-first</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
