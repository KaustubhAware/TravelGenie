import {
  Bell,
  Search,
} from "lucide-react";

import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";

import {
  useEffect,
  useState,
} from "react";

export default function DashboardTopbar() {

  const [userName, setUserName] =
    useState("Traveler");

  const [userLetter, setUserLetter] =
    useState("T");

  /* ===================================================== */
  /* GET USER */
  /* ===================================================== */

  useEffect(() => {

    const auth =
      getAuth();

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (user) => {

          if (user) {

            /* ===================================== */
            /* NAME */
            /* ===================================== */

            const fullName =
              user.displayName ||
              user.email
                ?.split("@")[0] ||
              "Traveler";

            setUserName(
              fullName
            );

            /* ===================================== */
            /* LETTER */
            /* ===================================== */

            setUserLetter(
              fullName
                .charAt(0)
                .toUpperCase()
            );

          }

        }
      );

    return () =>
      unsubscribe();

  }, []);

  return (

    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

      {/* ===================================================== */}
      {/* LEFT */}
      {/* ===================================================== */}

      <div>

        <h1 className="text-xl font-bold text-slate-900">

          Hi, {userName} 👋

        </h1>

        <p className="mt-1 text-sm text-slate-500">

          Welcome back to TravelGenie.

        </p>

      </div>

      {/* ===================================================== */}
      {/* RIGHT */}
      {/* ===================================================== */}

      <div className="flex items-center gap-3">

        {/* SEARCH */}

        <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 md:flex">

          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search treks..."
            className="w-[180px] bg-transparent text-sm outline-none placeholder:text-slate-400"
          />

        </div>

        {/* NOTIFICATION */}

        <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100">

          <Bell size={18} />

          <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-orange-500" />

        </button>

        {/* USER */}

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-sm font-bold text-white shadow-sm">

          {userLetter}

        </div>

      </div>

    </header>

  );

}