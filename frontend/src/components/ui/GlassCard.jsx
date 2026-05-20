import { motion } from "framer-motion";

const GlassCard = ({
  children,
  className = "",
  dark = false,
  hover = false,
  as: Component = "div",
  ...props
}) => {
  const MotionComponent = motion(Component);

  return (
    <MotionComponent
      whileHover={hover ? { y: -4 } : undefined}
      className={`${dark ? "tg-card-dark" : "tg-card"} ${className}`}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export default GlassCard;
