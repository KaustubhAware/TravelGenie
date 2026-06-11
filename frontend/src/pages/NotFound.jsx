import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8F5] px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-orange-500">
          404
        </p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900">
          Page not found
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          The page you requested does not exist or has been moved.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            Go home
          </Link>
          <Link
            to="/login"
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
