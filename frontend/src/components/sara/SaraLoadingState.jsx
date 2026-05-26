export default function SaraLoadingState() {

  return (

    <div className="flex items-center gap-3 rounded-[28px] bg-white px-6 py-5 shadow-sm w-fit">

      <div className="flex gap-1 text-orange-500">

        <span className="animate-bounce">

          •

        </span>

        <span className="animate-bounce [animation-delay:120ms]">

          •

        </span>

        <span className="animate-bounce [animation-delay:240ms]">

          •

        </span>

      </div>

      <p className="text-sm font-medium text-slate-600">

        Sara is crafting your adventure...

      </p>

    </div>

  );

}