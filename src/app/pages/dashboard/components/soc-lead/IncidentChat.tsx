import React, { useState, useRef, useEffect } from "react";
import { geminiService } from "../../../../services/geminiService";
import type { ChatSession } from "@google/generative-ai";
import type { Incident, TimelineEvent } from "../../../../types/dashboard";

interface Message {
  role: "user" | "model";
  text: string;
}

interface IncidentChatProps {
  incident: Incident;
  timeline: TimelineEvent[];
}

const IncidentChat: React.FC<IncidentChatProps> = ({ incident, timeline }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<ChatSession | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = geminiService.createIncidentChat(incident, timeline);
  }, [incident.id, incident, timeline]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chatRef.current!.sendMessage(userMsg);
      const response = await result.response;
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text:
            response.text() ||
            "I encountered an issue processing your request.",
        },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "Error: Could not connect to the AI command agent.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[600px] overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-ey-blue text-white">
        <div className="flex items-center space-x-2">
          <div className="bg-white/20 p-1.5 rounded-lg">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <h3 className="font-bold tracking-tight">AI Command Support</h3>
        </div>
        <span className="text-[10px] font-bold uppercase opacity-60">
          Session Active
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/30"
      >
        {messages.length === 0 && (
          <div className="text-center py-12 px-8">
            <div className="bg-blue-100 text-blue-600 p-4 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-bold text-slate-800">
              Ask about this incident
            </p>
            <p className="text-xs text-slate-400 mt-1">
              "What is the impact?" or "What logs show this?"
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${
                m.role === "user"
                  ? "bg-ey-blue dark:bg-ey-blue text-white rounded-tr-none"
                  : "bg-card border border-border text-foreground shadow-sm rounded-tl-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl rounded-tl-none shadow-sm flex items-center space-x-2">
              <div className="flex space-x-1">
                <div
                  className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a query to AI Command..."
            className="flex-grow bg-muted border-none rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-ey-blue/20 dark:focus:ring-ey-yellow/20 transition-all outline-none"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-ey-blue text-white p-2.5 rounded-xl hover:bg-ey-blue/90 transition-colors shadow-sm disabled:opacity-50"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncidentChat;
