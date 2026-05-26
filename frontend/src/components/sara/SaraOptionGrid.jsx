const OPTION_META = {

  /* ===================================================== */
  /* ADVENTURE */
  /* ===================================================== */

  "Fort Treks": {
    emoji: "🏯",
    subtitle:
      "Historic Sahyadri forts",
  },

  Waterfalls: {
    emoji: "🌊",
    subtitle:
      "Scenic waterfall trails",
  },

  Camping: {
    emoji: "⛺",
    subtitle:
      "Nature stay experiences",
  },

  "Monsoon Treks": {
    emoji: "🌧️",
    subtitle:
      "Rainy green adventures",
  },

  "Night Treks": {
    emoji: "🌙",
    subtitle:
      "Moonlight hiking trips",
  },

  "Weekend Getaways": {
    emoji: "🏔️",
    subtitle:
      "Quick escape plans",
  },

  /* ===================================================== */
  /* TRAVEL */
  /* ===================================================== */

  Solo: {
    emoji: "✈️",
    subtitle:
      "Explore independently",
  },

  Couple: {
    emoji: "🥂",
    subtitle:
      "Romantic experiences",
  },

  Friends: {
    emoji: "🎉",
    subtitle:
      "Group fun adventures",
  },

  Family: {
    emoji: "👨‍👩‍👧",
    subtitle:
      "Family-friendly trips",
  },

  "Corporate Group": {
    emoji: "💼",
    subtitle:
      "Team outing experiences",
  },

  /* ===================================================== */
  /* BUDGET */
  /* ===================================================== */

  Budget: {
    emoji: "💸",
    subtitle:
      "Affordable adventures",
  },

  Moderate: {
    emoji: "💰",
    subtitle:
      "Balanced comfort trips",
  },

  Premium: {
    emoji: "👑",
    subtitle:
      "Luxury trekking experience",
  },

  /* ===================================================== */
  /* DIFFICULTY */
  /* ===================================================== */

  Beginner: {
    emoji: "🟢",
    subtitle:
      "Easy and beginner safe",
  },

  Hardcore: {
    emoji: "🔥",
    subtitle:
      "Extreme adventure level",
  },

};

export default function SaraOptionGrid({

  options,

  onSelect,

}) {

  return (

    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">

      {options.map(
        (option) => {

          const meta =
            OPTION_META[
              option
            ];

          return (

            <button
              key={option}
              onClick={() =>
                onSelect(
                  option
                )
              }
              className="group rounded-[24px] border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl"
            >

              {/* EMOJI */}

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-3xl transition-all duration-300 group-hover:bg-orange-100">

                {
                  meta?.emoji
                }

              </div>

              {/* TITLE */}

              <h3 className="mt-5 text-lg font-bold text-[#08112b]">

                {option}

              </h3>

              {/* SUBTITLE */}

              <p className="mt-1 text-sm leading-relaxed text-slate-500">

                {
                  meta?.subtitle
                }

              </p>

            </button>

          );

        }
      )}

    </div>

  );

}