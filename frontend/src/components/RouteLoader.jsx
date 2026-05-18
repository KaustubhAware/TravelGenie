export default function RouteLoader({
  label = "Loading workspace...",
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#f5f9ff]">
      <div className="bg-white border border-gray-200 rounded-2xl px-8 py-6 shadow-sm text-center">
        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
        <p className="text-gray-600 font-medium mt-4">
          {label}
        </p>
      </div>
    </div>
  );
}
