export default function LoadingSpinner({
  text = "Loading...",
}) {

  return (

    <div className="flex flex-col items-center justify-center py-20">

      <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />

      <p className="mt-5 text-slate-500 font-medium">

        {text}

      </p>

    </div>

  );

}