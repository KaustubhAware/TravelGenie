import clsx from "clsx";

export default function Badge({
  children,
  variant = "primary",
  className = "",
}) {

  const variants = {

    primary:
      "bg-orange-100 text-orange-700",

    success:
      "bg-emerald-100 text-emerald-700",

    danger:
      "bg-red-100 text-red-700",

    warning:
      "bg-yellow-100 text-yellow-700",

    info:
      "bg-blue-100 text-blue-700",

    dark:
      "bg-slate-900 text-white",

  };

  return (

    <span
      className={clsx(

        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",

        variants[variant],

        className

      )}
    >

      {children}

    </span>

  );

}