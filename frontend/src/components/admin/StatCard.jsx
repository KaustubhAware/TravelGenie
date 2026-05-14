export default function StatCard({
  title,
  value,
  icon,
  bgColor,
  textColor,
}) {

  return (

    <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-[28px] p-6 shadow-[0_10px_40px_rgba(37,99,235,0.08)] hover:shadow-[0_12px_50px_rgba(37,99,235,0.15)] transition-all duration-300">

      <div className="flex items-center justify-between">

        {/* LEFT */}

        <div>

          <p className="text-gray-500 text-sm">

            {title}

          </p>

          <h2 className={`text-4xl font-bold mt-3 ${textColor}`}>

            {value}

          </h2>

        </div>

        {/* RIGHT */}

        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${bgColor}`}>

          {icon}

        </div>

      </div>

    </div>

  );
}