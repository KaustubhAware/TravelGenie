export default function SaraQuestionCard({

  question,

}) {

  return (

    <div className="max-w-2xl rounded-[24px] bg-[#f0f2f5] px-6 py-5 shadow-sm">

      <p className="text-[17px] font-medium leading-relaxed text-slate-800">

        {question}

      </p>

    </div>

  );

}