export default function SaraAnswerBubble({

  answer,

}) {

  return (

    <div className="flex justify-end">

      <div className="rounded-[18px] bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-sm">

        {answer}

      </div>

    </div>

  );

}