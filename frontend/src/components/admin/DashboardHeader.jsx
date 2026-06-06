import {
  useEffect,
  useState,
} from "react";

import {
  FaSearch,
  FaBell,
  FaBars,
  FaChevronDown,
  FaSignOutAlt,
} from "react-icons/fa";

import { notificationService } from "../../services/notificationService";

/* ===================================================== */
/* COMPONENT */
/* ===================================================== */

export default function DashboardHeader({
  search,
  setSearch,
  sidebarOpen,
  setSidebarOpen,
  logout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    notificationService
      .list()
      .then((res) => {
        setNotifications(res.data?.notifications || []);
        setUnreadCount(res.data?.unread_count || 0);
      })
      .catch(() => {
        setNotifications([]);
        setUnreadCount(0);
      });
  }, []);

  return (

    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">

      <div className="h-[78px] px-4 md:px-6 xl:px-8 flex items-center justify-between gap-4">

        {/* ===================================================== */}
        {/* LEFT */}
        {/* ===================================================== */}

        <div className="flex items-center gap-4 min-w-0">

          {/* MOBILE SIDEBAR BUTTON */}

          <button
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
            className="lg:hidden w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition"
          >

            <FaBars />

          </button>

          {/* TITLE */}

          <div className="min-w-0">

            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">

              Admin Panel

            </p>

            <h1 className="text-2xl font-bold text-slate-900 truncate">

              Dashboard

            </h1>

          </div>

        </div>

        {/* ===================================================== */}
        {/* RIGHT */}
        {/* ===================================================== */}

        <div className="flex items-center gap-3">

          {/* SEARCH */}

          <div className="hidden md:block relative">

            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="w-[280px] rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />

          </div>

          {/* NOTIFICATIONS */}

          <div className="relative">
            <button
              onClick={() => setNotificationsOpen((value) => !value)}
              className="relative w-11 h-11 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-50 transition"
            >

              <FaBell className="text-sm" />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}

            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-13 z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                <div className="border-b border-slate-100 px-4 py-3">
                  <h3 className="font-bold text-slate-900">Admin Notifications</h3>
                  <p className="text-xs text-slate-500">
                    Booking, vendor, review, and payment alerts
                  </p>
                </div>
                <div className="max-h-[360px] overflow-y-auto p-2">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-slate-500">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.slice(0, 8).map((item) => (
                      <button
                        key={item.id}
                        onClick={async () => {
                          await notificationService.markRead(item.id);
                          setNotifications((current) =>
                            current.map((notification) =>
                              notification.id === item.id
                                ? { ...notification, is_read: true }
                                : notification
                            )
                          );
                          setUnreadCount((count) => Math.max(0, count - 1));
                        }}
                        className={`w-full rounded-xl p-3 text-left transition ${
                          item.is_read
                            ? "hover:bg-slate-50"
                            : "bg-orange-50 hover:bg-orange-100"
                        }`}
                      >
                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {item.message}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ADMIN */}

          <div className="relative">
            <button
              onClick={() => setMenuOpen((value) => !value)}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50 transition"
            >

            {/* AVATAR */}

            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-semibold">

              A

            </div>

            {/* INFO */}

            <div className="hidden md:block text-left">

              <h3 className="text-sm font-semibold text-slate-900">

                Admin

              </h3>

              <p className="text-xs text-slate-500">

                Administrator

              </p>

            </div>

            <FaChevronDown className="hidden md:block text-slate-400 text-xs" />

            </button>

            {menuOpen && (
              <div className="absolute right-0 top-14 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                <div className="border-b border-slate-100 px-3 py-3">
                  <p className="text-sm font-bold text-slate-900">Admin</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
                <button
                  onClick={logout}
                  className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

    </header>

  );

}
