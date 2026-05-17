// =====================================================
// frontend/src/components/ai/BudgetCard.jsx
// =====================================================

import { FaWallet } from "react-icons/fa";

export default function BudgetCard({
  cost = 0,
}) {

  return (

    <div className="bg-blue-50 border border-blue-100 rounded-[28px] p-6">

      <div className="flex items-center gap-4">

        {/* ICON */}

        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">

          <FaWallet className="text-blue-600 text-2xl" />

        </div>

        {/* CONTENT */}

        <div>

          <p className="text-sm text-gray-500">

            Estimated Budget

          </p>

          <h2 className="text-3xl font-bold text-gray-900 mt-1">

            ₹ {cost}

          </h2>

        </div>

      </div>

    </div>

  );

}