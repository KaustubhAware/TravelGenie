import { motion } from "framer-motion";

const GradientButton = ({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}) => {
  const variantClass =
    variant === "secondary" ? "tg-button-secondary" : "tg-button-primary";

  return (
    <motion.button
      type={type}
      whileTap={{ scale: 0.98 }}
      className={`${variantClass} px-6 py-3.5 text-sm ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default GradientButton;
