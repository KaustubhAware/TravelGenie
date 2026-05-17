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
      label: "Hotel",
      value: breakdown.hotel || 0,
      icon: <FaHotel />,
    },

    {
      label: "Food",
      value: breakdown.food || 0,
      icon: <FaUtensils />,
    },

    {
      label: "Transport",
      value: breakdown.transport || 0,
      icon: <FaBus />,
    },

    {
      label: "Emergency",
      value: breakdown.emergency || 0,
      icon: <FaWallet />,
    },

  ];

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

            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">

              {item.icon}

            </div>

            {/* CONTENT */}

            <div>

              <p className="text-sm text-gray-500">

                {item.label}

              </p>

              <h3 className="text-xl font-bold text-gray-900">

                ₹ {item.value}

              </h3>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}