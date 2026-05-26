export default function SaraAIResponse({

  response,

}) {

  /* ===================================================== */
  /* CLEAN TEXT */
  /* ===================================================== */

  const cleanText =
    response

      .replaceAll(
        "**",
        ""
      )

      .trim();

  /* ===================================================== */
  /* SPLIT */
  /* ===================================================== */

  const sections =
    cleanText
      .split("\n\n")
      .filter(
        (s) =>
          s.trim() !==
          ""
      );

  return (

    <div className="space-y-4">

      {sections.map(
        (
          section,
          index
        ) => {

          /* ===================================================== */
          /* TITLE */
          /* ===================================================== */

          const lines =
            section.split("\n");

          const title =
            lines[0];

          const content =
            lines.slice(1);

          return (

            <div
              key={index}
              className="overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm"
            >

              {/* HEADER */}

              <div className="border-b border-slate-100 bg-slate-50 px-5 py-4">

                <h3 className="text-[15px] font-bold text-[#08112b]">

                  {title}

                </h3>

              </div>

              {/* BODY */}

              <div className="space-y-3 px-5 py-4">

                {content.map(
                  (
                    item,
                    i
                  ) => {

                    /* BULLET */

                    if (
                      item.includes(
                        "•"
                      )
                    ) {

                      return (

                        <div
                          key={
                            i
                          }
                          className="flex items-start gap-3"
                        >

                          <div className="mt-2 h-2 w-2 rounded-full bg-orange-500" />

                          <p className="text-sm leading-relaxed text-slate-600">

                            {item.replace(
                              "•",
                              ""
                            )}

                          </p>

                        </div>

                      );

                    }

                    /* NORMAL */

                    return (

                      <p
                        key={i}
                        className="text-sm leading-relaxed text-slate-600"
                      >

                        {item}

                      </p>

                    );

                  }
                )}

              </div>

            </div>

          );

        }
      )}

    </div>

  );

}