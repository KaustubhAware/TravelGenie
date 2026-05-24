import Button from "./Button";

export default function EmptyState({
  title,
  description,
  buttonText,
  onClick,
}) {

  return (

    <div className="py-20 text-center">

      <div className="max-w-md mx-auto">

        <h3 className="text-3xl font-black text-slate-900">

          {title}

        </h3>

        <p className="mt-4 text-slate-500 leading-relaxed">

          {description}

        </p>

        {buttonText && (

          <Button
            onClick={onClick}
            className="mt-8"
          >

            {buttonText}

          </Button>

        )}

      </div>

    </div>

  );

}