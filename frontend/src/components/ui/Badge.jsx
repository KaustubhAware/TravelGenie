const Badge = ({
  children,
  variant = "primary",
  className = "",
}) => {
  const variants = {
    primary: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/10 text-accent-dark border-accent/25",
    dark: "bg-white/10 text-white border-white/15",
    muted: "bg-surface-muted text-ink-muted border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
