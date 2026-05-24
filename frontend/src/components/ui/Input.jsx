import clsx from "clsx";

export default function Input({
  label,
  error,
  className = "",
  ...props
}) {

  return (

    <div className="w-full">

      {label && (

        <label className="block text-sm font-semibold text-slate-700 mb-2">

          {label}

        </label>

      )}

      <input
        className={clsx(

          "w-full h-12 rounded-2xl border border-slate-300 bg-white px-4 text-sm outline-none transition-all duration-200",

          "focus:border-orange-500 focus:ring-4 focus:ring-orange-100",

          error &&
            "border-red-500 focus:ring-red-100",

          className

        )}

        {...props}
      />

      {error && (

        <p className="mt-2 text-sm text-red-500">

          {error}

        </p>

      )}

    </div>

  );

}