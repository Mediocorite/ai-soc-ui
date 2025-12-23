import React, { useState, useRef, useEffect } from "react";
import type { Alert, ChatMessage } from "../../../../types/dashboard";
import { geminiService } from "../../../../services/geminiService";

interface AIChatProps {
  alert: Alert;
}

const AIChat: React.FC<AIChatProps> = ({ alert }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      role: "assistant",
      content: `I've analyzed alert **${alert.id}**. How can I help with the investigation? I have full access to the timeline and entities involved.`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const chat = geminiService.createAnalystChat(alert);
    const result = await chat.sendMessage(input);
    const response = await result.response;

    const assistantMsg: ChatMessage = {
      role: "assistant",
      content: response.text(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
  };

  return (
    <div className="lg:w-96 w-full flex flex-col h-full bg-card border-l border-border">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <h2 className="font-bold text-foreground uppercase tracking-wider text-xs">
            Sentinel AI Agent
          </h2>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                msg.role === "user"
                  ? "bg-ey-blue dark:bg-ey-blue text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              <div className="prose prose-invert prose-sm max-w-none">
                {msg.content}
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 px-2 font-mono">
              {msg.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start gap-2">
            <div className="bg-muted rounded-2xl p-3 space-x-1 flex items-center">
              <div
                className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 border-t border-border bg-card/50"
      >
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInput(e.target.value)
            }
            placeholder="Ask about IPs, hashes, or logic..."
            className="w-full bg-background border border-border rounded-xl py-2.5 pl-4 pr-12 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ey-blue transition-all placeholder:text-muted-foreground/50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-500 hover:text-indigo-400 disabled:opacity-50 disabled:grayscale transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;
