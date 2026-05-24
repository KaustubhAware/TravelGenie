export default function SectionHeader({
  badge,
  title,
  description,
  align = "center",
}) {

  return (

    <div
      className={`max-w-3xl ${
        align === "center"
          ? "mx-auto text-center"
          : ""
      }`}
    >

      {/* ===================================================== */}
      {/* BADGE */}
      {/* ===================================================== */}

      {badge && (

        <div className="inline-flex items-center px-5 py-2 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600 text-sm font-bold tracking-wide mb-6">

          {badge}

        </div>

      )}

      {/* ===================================================== */}
      {/* TITLE */}
      {/* ===================================================== */}

      <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">

        {title}

      </h2>

      {/* ===================================================== */}
      {/* DESCRIPTION */}
      {/* ===================================================== */}

      {description && (

        <p className="mt-6 text-lg text-slate-500 leading-relaxed">

          {description}

        </p>

      )}

    </div>

  );

}