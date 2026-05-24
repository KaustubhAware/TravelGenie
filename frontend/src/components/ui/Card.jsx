import clsx from "clsx";

export default function Card({
  children,
  className = "",
  hover = true,
  padding = "md",
  blur = false,
}) {

  const paddings = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (

    <div
      className={clsx(

        "rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300",

        hover &&
          "hover:-translate-y-1 hover:shadow-xl",

        blur &&
          "backdrop-blur-xl bg-white/70",

        paddings[padding],

        className

      )}
    >

      {children}

    </div>

  );

}