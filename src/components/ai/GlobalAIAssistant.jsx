import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { aiService, normalizeAssistantResponse } from "../../services/api";
import { useLanguage } from "../../lib/i18n";

const starterPrompts = [
  "Summarize the safest next step for a new missing-person report.",
  "What details should I collect before publishing a case alert?",
  "How should volunteers respond after a fresh sighting is reported?",
];

export const GlobalAIAssistant = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      text:
        language === "am"
          ? "የሪዩናይት AI እገዛ እዚህ ነኝ። ስለ ጠፉ ሰዎች ሪፖርት፣ ፍለጋ፣ ወይም ማስተባበር ጠይቁኝ።"
          : "Reunite AI is ready. Ask about reporting, search coordination, sightings, or next steps.",
    },
  ]);

  const quickLinks = useMemo(
    () => [
      { label: "Report Case", path: "/report" },
      { label: "Active Cases", path: "/cases" },
      { label: "Help Desk", path: "/ai" },
    ],
    [],
  );

  const handleSend = async (prompt = input) => {
    const trimmed = prompt.trim();
    if (!trimmed || isSending) return;

    const nextUserMessage = {
      id: Date.now(),
      role: "user",
      text: trimmed,
    };

    setMessages((current) => [...current, nextUserMessage]);
    setInput("");
    setIsSending(true);

    try {
      const result = await aiService.assistant({
        message: trimmed,
        language,
        context: {
          path: location.pathname,
          scope: "global-assistant",
        },
      });

      const payload = normalizeAssistantResponse(result);
      const reply = payload.text;

      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: reply,
        },
      ]);
    } catch (error) {
      toast.error("AI assistant is unavailable right now.");
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text:
            error?.response?.data?.error ||
            error?.message ||
            "AI assistant is unavailable right now.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.08, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta text-white shadow-2xl shadow-terracotta/40 transition-all duration-300 hover:bg-clay"
        aria-label="Open AI assistant"
      >
        <Bot className="h-7 w-7" />
      </motion.button>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-28 right-6 z-40 flex h-[36rem] w-[min(26rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-charcoal px-5 py-5 text-white">
              <div>
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Sparkles className="h-5 w-5 text-terracotta" />
                  <span>AI Coordination Desk</span>
                </div>
                <p className="mt-1.5 text-sm text-white/70">
                  Missing-person guidance from anywhere in the app.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Close AI assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-stone-200 bg-stone-50 px-5 py-4">
              <div className="flex flex-wrap gap-2">
                {quickLinks.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-stone-50 px-5 py-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`max-w-[88%] rounded-2xl px-4 py-3.5 text-base leading-7 ${
                    message.role === "user"
                      ? "ml-auto bg-terracotta text-white"
                      : "bg-white text-stone-800 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-stone-200 bg-white px-5 py-5">
              <div className="flex flex-wrap gap-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-stone-200 px-3.5 py-2 text-left text-sm text-stone-700 transition hover:border-terracotta/30 hover:text-terracotta"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  rows={2}
                  placeholder="Ask the AI what to do next..."
                  className="min-h-[3.5rem] flex-1 rounded-2xl border border-stone-200 px-4 py-3.5 text-base outline-none transition focus:border-terracotta"
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={isSending || !input.trim()}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta text-white transition hover:bg-clay disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default GlobalAIAssistant;
