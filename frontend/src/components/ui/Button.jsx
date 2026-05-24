import clsx from "clsx";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  icon = null,
  className = "",
  ...props
}) {

  /* ===================================================== */
  /* VARIANTS */
  /* ===================================================== */

  const variants = {

    primary:
      "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20",

    secondary:
      "bg-slate-900 hover:bg-slate-800 text-white",

    outline:
      "border border-slate-300 hover:border-slate-400 bg-white text-slate-900",

    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700",

    success:
      "bg-emerald-500 hover:bg-emerald-600 text-white",

    danger:
      "bg-red-500 hover:bg-red-600 text-white",

  };

  /* ===================================================== */
  /* SIZES */
  /* ===================================================== */

  const sizes = {

    sm:
      "h-10 px-4 text-sm rounded-xl",

    md:
      "h-12 px-6 text-sm rounded-2xl",

    lg:
      "h-14 px-8 text-base rounded-2xl",

  };

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <button
      className={clsx(

        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed",

        variants[variant],

        sizes[size],

        fullWidth && "w-full",

        className

      )}

      disabled={loading}

      {...props}
    >

      {/* LOADING */}

      {loading && (

        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />

      )}

      {/* ICON */}

      {!loading && icon}

      {/* TEXT */}

      <span>

        {children}

      </span>

    </button>

  );

}