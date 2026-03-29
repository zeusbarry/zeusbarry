"use client";

import { useState, useRef, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { SCENARIOS } from "@/lib/scenarios";
import VoiceButton from "@/components/VoiceButton";
import SpeakButton from "@/components/SpeakButton";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatMessage extends Message {
  feedback?: string | null;
}

export default function ChatPage({ params }: { params: Promise<{ scenarioId: string }> }) {
  const { scenarioId } = use(params);
  const router = useRouter();
  const scenario = SCENARIOS.find((s) => s.id === scenarioId);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedbackEnabled, setFeedbackEnabled] = useState(true);
  const [showTips, setShowTips] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Message d'intro du persona
  useEffect(() => {
    if (!scenario) return;
    const intro = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: [{ role: "user", content: "[DEBUT DU SCENARIO - Presente-toi brièvement selon ton rôle et attends que l'utilisateur engage la conversation]" }],
            scenario: scenario.description,
            personaId: scenario.personaId,
            feedbackEnabled: false,
          }),
        });
        const data = await res.json();
        setMessages([{ role: "assistant", content: data.reply }]);
      } finally {
        setLoading(false);
      }
    };
    intro();
  }, [scenario]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading || !scenario) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
          scenario: scenario.description,
          personaId: scenario.personaId,
          feedbackEnabled,
        }),
      });
      const data = await res.json();
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply, feedback: data.feedback },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Scénario introuvable.</p>
      </div>
    );
  }

  const difficultyColor = {
    facile: "text-green-600 bg-green-50",
    moyen: "text-yellow-600 bg-yellow-50",
    difficile: "text-red-600 bg-red-50",
  }[scenario.difficulty];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => router.push("/")}
          className="text-gray-400 hover:text-gray-600 p-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-2xl">{scenario.emoji}</span>
        <div className="flex-1">
          <h1 className="font-semibold text-gray-900 text-sm">{scenario.title}</h1>
          <p className="text-xs text-gray-500">{scenario.personaName}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${difficultyColor}`}>
          {scenario.difficulty}
        </span>
        <button
          onClick={() => setShowTips(!showTips)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
        >
          💡 Conseils
        </button>
        <button
          onClick={() => setFeedbackEnabled(!feedbackEnabled)}
          className={`text-xs font-medium px-2 py-1 rounded-full transition-colors ${
            feedbackEnabled ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          Feedback {feedbackEnabled ? "ON" : "OFF"}
        </button>
      </div>

      {/* Tips panel */}
      {showTips && (
        <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-3">
          <p className="text-xs font-semibold text-indigo-700 mb-2">💡 Conseils pour ce scénario</p>
          <ul className="space-y-1">
            {scenario.tips.map((tip, i) => (
              <li key={i} className="text-xs text-indigo-600 flex gap-2">
                <span>→</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-2 italic">{scenario.description}</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 max-w-2xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${msg.role === "user" ? "order-2" : ""}`}>
              {msg.role === "assistant" && (
                <p className="text-xs text-gray-400 mb-1 ml-1">{scenario.personaName}</p>
              )}
              <div
                className={`px-4 py-3 rounded-2xl text-sm ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : "bg-white text-gray-800 shadow-sm border rounded-bl-sm"
                }`}
              >
                {msg.content}
                {msg.role === "assistant" && (
                  <div className="mt-1 flex justify-end">
                    <SpeakButton text={msg.content} />
                  </div>
                )}
              </div>
              {msg.feedback && (
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <p className="text-xs text-amber-700">
                    <span className="font-semibold">📊 Feedback : </span>
                    {msg.feedback}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow-sm border rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t px-4 py-3 sticky bottom-0">
        <div className="max-w-2xl mx-auto flex gap-2 items-end">
          <VoiceButton onTranscript={(t) => sendMessage(t)} disabled={loading} />
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Écris ta réponse ou utilise le micro..."
              rows={1}
              className="w-full resize-none rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 max-h-32"
              style={{ minHeight: "44px" }}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white p-2.5 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
