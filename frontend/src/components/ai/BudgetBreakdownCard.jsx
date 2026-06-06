// =====================================================
// frontend/src/components/ai/BudgetBreakdownCard.jsx
// =====================================================

import {
  FaHotel,
  FaUtensils,
  FaBus,
  FaWallet,
} from "react-icons/fa";

export default function BudgetBreakdownCard({
  breakdown = {},
}) {

  // =====================================================
  // ITEMS
  // =====================================================

  const items = [

    {
      label: "Stay",
      value: breakdown.stay || breakdown.hotel || 0,
      icon: <FaHotel />,
    },

    {
      label: "Food",
      value: breakdown.food || 0,
      icon: <FaUtensils />,
    },

    {
      label: "Transport",
      value: breakdown.travel || breakdown.transport || 0,
      icon: <FaBus />,
    },

    {
      label: "Activities",
      value: breakdown.activities || 0,
      icon: <FaWallet />,
    },

    {
      label: "Emergency",
      value: breakdown.misc || breakdown.emergency || 0,
      icon: <FaWallet />,
    },

  ].filter((item) => Number(item.value || 0) > 0);

  if (!items.length) {
    return null;
  }

  return (

    <div className="bg-white border border-gray-200 rounded-[28px] p-6">

      {/* HEADER */}

      <div className="mb-6">

        <h2 className="text-2xl font-bold text-gray-900">

          Budget Breakdown

        </h2>

        <p className="text-gray-500 mt-1">

          AI estimated spending distribution

        </p>

      </div>

      {/* GRID */}

      <div className="grid md:grid-cols-2 gap-4">

        {items.map((item, index) => (

          <div
            key={index}
            className="border border-gray-100 rounded-2xl p-4 flex items-center gap-4 bg-gray-50"
          >

            {/* ICON */}

            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">

              {item.icon}

            </div>

            {/* CONTENT */}

            <div>

              <p className="text-sm text-gray-500">

                {item.label}

              </p>

              <h3 className="text-xl font-bold text-gray-900">

                Rs {item.value}

              </h3>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}
