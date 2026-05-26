import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Send,
} from "lucide-react";

import SaraQuestionCard from "../../components/sara/SaraQuestionCard";

import SaraOptionGrid from "../../components/sara/SaraOptionGrid";

import SaraAnswerBubble from "../../components/sara/SaraAnswerBubble";

import SaraLoadingState from "../../components/sara/SaraLoadingState";

import SaraAIResponse from "../../components/sara/SaraAIResponse";

import { chatService } from "../../services/chatService";

/* ===================================================== */
/* OPTIONS */
/* ===================================================== */

const ADVENTURE_OPTIONS = [

  "Fort Treks",

  "Waterfalls",

  "Camping",

  "Monsoon Treks",

  "Night Treks",

  "Weekend Getaways",

];

const TRAVEL_OPTIONS = [

  "Solo",

  "Couple",

  "Friends",

  "Family",

  "Corporate Group",

];

const BUDGET_OPTIONS = [

  "Budget",

  "Moderate",

  "Premium",

];

const DIFFICULTY_OPTIONS = [

  "Beginner",

  "Moderate",

  "Hardcore",

];

export default function SaraAIPlanner() {

  const [step, setStep] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [input, setInput] =
    useState("");

  const chatEndRef =
    useRef(null);

  const [plannerData, setPlannerData] =
    useState({

      adventure: "",

      travelType: "",

      budget: "",

      difficulty: "",

    });

  const [conversation, setConversation] =
    useState([
      {
        type: "question",
        content:
          "Hey! I’m Sara 👋 What type of Maharashtra adventure are you planning today?",
      },
    ]);

  /* ===================================================== */
  /* AUTO SCROLL */
  /* ===================================================== */

  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [conversation, loading]);

  /* ===================================================== */
  /* HANDLE SELECT */
  /* ===================================================== */

  const handleSelect =
    async (
      field,
      value
    ) => {

      const updated = {

        ...plannerData,

        [field]: value,

      };

      setPlannerData(updated);

      /* USER ANSWER */

      setConversation(
        (prev) => [

          ...prev,

          {
            type: "answer",
            content: value,
          },

        ]
      );

      /* FLOW */

      if (step === 1) {

        setTimeout(() => {

          setConversation(
            (prev) => [

              ...prev,

              {
                type: "question",
                content:
                  "Awesome choice! Who are you traveling with?",
              },

            ]
          );

          setStep(2);

        }, 400);

      }

      else if (
        step === 2
      ) {

        setTimeout(() => {

          setConversation(
            (prev) => [

              ...prev,

              {
                type: "question",
                content:
                  "Got it 👍 What’s your preferred budget range?",
              },

            ]
          );

          setStep(3);

        }, 400);

      }

      else if (
        step === 3
      ) {

        setTimeout(() => {

          setConversation(
            (prev) => [

              ...prev,

              {
                type: "question",
                content:
                  "Perfect. What difficulty level are you comfortable with?",
              },

            ]
          );

          setStep(4);

        }, 400);

      }

      else if (
        step === 4
      ) {

        generateAIResponse(
          updated
        );

      }

    };

  /* ===================================================== */
  /* AI RESPONSE */
  /* ===================================================== */

  const generateAIResponse =
    async (
      updated
    ) => {

      setLoading(true);

      try {

        const prompt = `

You are Sara.

You are a modern AI Maharashtra travel assistant.

VERY IMPORTANT RULES:
- Keep responses SHORT.
- Maximum 120 words total.
- No blogs.
- No huge paragraphs.
- Keep response visually clean.
- Use concise formatting.
- Use modern AI assistant style.

FORMAT:

🏔 Recommendation
(2 short lines)

💰 Budget
(1 line)

📍 Location
(1 line)

🗓 Plan
• point
• point
• point

🎒 Carry
• point
• point

⚠️ Safety
• point
• point

USER DETAILS:

Adventure:
${updated.adventure}

Travel Type:
${updated.travelType}

Budget:
${updated.budget}

Difficulty:
${updated.difficulty}

`;

        const res =
          await chatService.sendMessage(
            prompt,
            []
          );

        setConversation(
          (prev) => [

            ...prev,

            {
              type: "response",
              content:
                res?.data
                  ?.reply ||
                "Unable to generate response.",
            },

          ]
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

  /* ===================================================== */
  /* MANUAL CHAT */
  /* ===================================================== */

  const handleManualChat =
    async () => {

      if (!input.trim())
        return;

      const userInput =
        input;

      setConversation(
        (prev) => [

          ...prev,

          {
            type: "answer",
            content:
              userInput,
          },

        ]
      );

      setInput("");

      setLoading(true);

      try {

        const res =
          await chatService.sendMessage(
            userInput,
            []
          );

        setConversation(
          (prev) => [

            ...prev,

            {
              type: "response",
              content:
                res?.data
                  ?.reply ||
                "No response.",
            },

          ]
        );

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }

    };

  /* ===================================================== */
  /* OPTIONS */
  /* ===================================================== */

  let currentOptions =
    [];

  if (step === 1)
    currentOptions =
      ADVENTURE_OPTIONS;

  else if (
    step === 2
  )
    currentOptions =
      TRAVEL_OPTIONS;

  else if (
    step === 3
  )
    currentOptions =
      BUDGET_OPTIONS;

  else if (
    step === 4
  )
    currentOptions =
      DIFFICULTY_OPTIONS;

  /* ===================================================== */
  /* UI */
  /* ===================================================== */

  return (

    <div className="h-[calc(100vh-72px)] overflow-hidden bg-[#f5f5f5]">

      <div className="relative flex h-full flex-col">

        {/* ===================================================== */}
        {/* CHAT AREA */}
        {/* ===================================================== */}

        <div className="flex-1 overflow-y-auto px-5 py-6 md:px-8">

          <div className="mx-auto flex max-w-5xl flex-col gap-4">

            {conversation.map(
              (
                item,
                index
              ) => {

                /* QUESTION */

                if (
                  item.type ===
                  "question"
                ) {

                  return (

                    <div
                      key={
                        index
                      }
                      className="space-y-3"
                    >

                      <SaraQuestionCard
                        question={
                          item.content
                        }
                      />

                      {index ===
                        conversation.length -
                          1 &&
                        step <=
                          4 && (

                          <SaraOptionGrid
                            options={
                              currentOptions
                            }
                            onSelect={(
                              value
                            ) => {

                              if (
                                step ===
                                1
                              ) {

                                handleSelect(
                                  "adventure",
                                  value
                                );

                              }

                              else if (
                                step ===
                                2
                              ) {

                                handleSelect(
                                  "travelType",
                                  value
                                );

                              }

                              else if (
                                step ===
                                3
                              ) {

                                handleSelect(
                                  "budget",
                                  value
                                );

                              }

                              else if (
                                step ===
                                4
                              ) {

                                handleSelect(
                                  "difficulty",
                                  value
                                );

                              }

                            }}
                          />

                        )}

                    </div>

                  );

                }

                /* ANSWER */

                if (
                  item.type ===
                  "answer"
                ) {

                  return (

                    <SaraAnswerBubble
                      key={
                        index
                      }
                      answer={
                        item.content
                      }
                    />

                  );

                }

                /* RESPONSE */

                if (
                  item.type ===
                  "response"
                ) {

                  return (

                    <div
                      key={index}
                      className="max-w-2xl"
                    >

                      <SaraAIResponse
                        response={
                          item.content
                        }
                      />

                    </div>

                  );

                }

                return null;

              }
            )}

            {loading && (

              <SaraLoadingState />

            )}

            <div ref={chatEndRef} />

          </div>

        </div>

        {/* ===================================================== */}
        {/* INPUT */}
        {/* ===================================================== */}

        <div className="border-t border-slate-200 bg-white px-5 py-4">

          <div className="mx-auto flex max-w-5xl items-center gap-3 rounded-[22px] border border-slate-200 bg-[#f8f8f8] px-4 py-3 shadow-sm">

            <input
              type="text"
              placeholder="Start typing here..."
              value={input}
              onChange={(
                e
              ) =>
                setInput(
                  e.target
                    .value
                )
              }
              onKeyDown={(
                e
              ) => {

                if (
                  e.key ===
                  "Enter"
                ) {

                  handleManualChat();

                }

              }}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />

            <button
              onClick={
                handleManualChat
              }
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white transition hover:bg-orange-600"
            >

              <Send
                size={
                  17
                }
              />

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}