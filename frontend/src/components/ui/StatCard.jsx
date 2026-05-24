import Card from "./Card";

export default function StatCard({
  icon,
  title,
  value,
  change,
}) {

  return (

    <Card className="flex items-start justify-between">

      <div>

        <p className="text-sm text-slate-500 font-medium">

          {title}

        </p>

        <h3 className="mt-3 text-3xl font-black text-slate-900">

          {value}

        </h3>

        {change && (

          <p className="mt-2 text-sm text-emerald-600 font-semibold">

            {change}

          </p>

        )}

      </div>

      {icon && (

        <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 text-xl">

          {icon}

        </div>

      )}

    </Card>

  );

}