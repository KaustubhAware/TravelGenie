import { useState } from "react";
import { FaPaperPlane, FaRobot } from "react-icons/fa";
import { chatService } from "../../services/chatService";
import { useFirebaseAuth } from "../../hooks/useFirebaseAuth";
import LoadingSpinner from "../../components/ui/LoadingSpinner";

const STARTERS = [
  "Best monsoon treks near Pune under ₹5k",
  "Weekend camping in Lonavala",
  "Kalsubai trek packing list",
  "Konkan coastal tour for families",
];

export default function AIChatAssistant() {
  const { user, authReady } = useFirebaseAuth();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm TravelGenie AI. Ask me about destinations, budgets, or packages.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", content: trimmed };
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await chatService.sendMessage(
        trimmed,
        messages.filter((m) => m.role !== "system")
      );
      const reply =
        res?.data?.reply ||
        "I could not generate a response. Please try again.";

      setMessages([
        ...nextHistory,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...nextHistory,
        {
          role: "assistant",
          content:
            "Something went wrong. Please check your connection and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!authReady) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <p className="text-slate-600">Please sign in to use the AI assistant.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-10rem)] max-w-4xl flex-col rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-5 text-white">
        <div className="flex items-center gap-3">
          <FaRobot className="text-2xl" />
          <div>
            <h1 className="text-xl font-bold">TravelGenie AI Assistant</h1>
            <p className="text-sm text-white/80">
              Personalized trip ideas powered by AI
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 p-6 bg-slate-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-orange-500 text-white"
                  : "bg-white border border-slate-200 text-slate-700"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce [animation-delay:120ms]">•</span>
                <span className="animate-bounce [animation-delay:240ms]">•</span>
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-slate-200 p-4 bg-white">
        <div className="mb-3 flex flex-wrap gap-2">
          {STARTERS.map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => sendMessage(starter)}
              className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50"
            >
              {starter}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about trips, budgets, destinations..."
            className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center justify-center rounded-xl bg-orange-500 px-5 py-3 text-white disabled:opacity-50"
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
}
