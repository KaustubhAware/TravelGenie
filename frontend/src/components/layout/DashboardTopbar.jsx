import {
  Bell,
  Search,
  CheckCheck,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import { apiRequest } from "../../services/httpClient";
import { notificationService } from "../../services/notificationService";
import { useAutoRefresh } from "../../hooks/useAutoRefresh";

export default function DashboardTopbar() {

  const [userName, setUserName] =
    useState("Traveler");

  const [userLetter, setUserLetter] =
    useState("T");

  const [notifications, setNotifications] =
    useState([]);

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [open, setOpen] =
    useState(false);

  /* ===================================================== */
  /* GET USER */
  /* ===================================================== */

  useEffect(() => {

    apiRequest("/auth/me")
      .then((res) => {
        const authUser = res.data?.user || {};
        const fullName =
          authUser.full_name ||
          authUser.email?.split("@")[0] ||
          "Traveler";

        setUserName(fullName);
        setUserLetter(fullName.charAt(0).toUpperCase());
      })
      .catch(() => {});

  }, []);

  const loadNotifications = async () => {
    const res = await notificationService.list();
    setNotifications(res.data?.notifications || []);
    setUnreadCount(res.data?.unread_count || 0);
  };

  useAutoRefresh(loadNotifications, {
    intervalMs: 60000,
    immediate: true,
  });

  const markAllRead = async () => {
    await notificationService.markAllRead();
    await loadNotifications();
  };

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

        <div className="relative">

        <button
          onClick={() => setOpen((value) => !value)}
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100"
          aria-label="Notifications"
        >

          <Bell size={18} />

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-[11px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}

        </button>

        {open && (
          <div className="absolute right-0 top-14 z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="font-bold text-slate-900">Notifications</h2>
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs font-semibold text-orange-600"
              >
                <CheckCheck size={14} />
                Mark read
              </button>
            </div>
            <div className="max-h-[360px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="px-4 py-10 text-center text-sm text-slate-500">
                  No notifications yet.
                </div>
              ) : (
                notifications.slice(0, 8).map((item) => (
                  <button
                    key={item.id}
                    onClick={async () => {
                      if (!item.is_read) {
                        await notificationService.markRead(item.id);
                        await loadNotifications();
                      }
                    }}
                    className={`block w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-orange-50 ${
                      item.is_read ? "bg-white" : "bg-orange-50/60"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-bold text-slate-900">{item.title}</p>
                      {!item.is_read && (
                        <span className="mt-1 h-2 w-2 rounded-full bg-orange-500" />
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {item.message || "TravelGenie update"}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        </div>

        {/* USER */}

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-sm font-bold text-white shadow-sm">

          {userLetter}

        </div>

      </div>

    </header>

  );

}
