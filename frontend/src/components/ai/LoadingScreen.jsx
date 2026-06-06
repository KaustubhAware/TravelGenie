const loadingSteps = [
  "Analyzing destination...",
  "Finding attractions...",
  "Optimizing budget...",
  "Building itinerary...",
  "Generating AI travel plan...",
];

export default function LoadingScreen() {

  return (

    <div className="flex flex-col items-center justify-center h-full">

      {/* SPINNER */}

      <div className="relative w-24 h-24">

        <div className="absolute inset-0 border-4 border-orange-100 rounded-full"></div>

        <div className="absolute inset-0 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>

      </div>

      {/* TEXT */}

      <div className="mt-10 space-y-3 text-center">

        <h2 className="text-2xl font-bold text-gray-900">

          AI is planning your trip

        </h2>

        <div className="space-y-2">

          {loadingSteps.map((step, index) => (

            <p
              key={index}
              className="text-gray-500 animate-pulse"
            >

              {step}

            </p>

          ))}

        </div>

      </div>

    </div>

  );

}