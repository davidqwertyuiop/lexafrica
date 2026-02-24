"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, X, User, Bot, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function LexaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hello! I am LEXA, your legal AI assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setLoading(true);

    // Try the Render backend first, fall back to direct Gemini API call
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "bot", text: data.response }]);
        return;
      }
      // If backend responded but with error, fall through to direct API
    } catch {
      // Backend unreachable, try direct Gemini call below
    }

    // Direct Gemini API fallback
    try {
      const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!geminiKey) {
        setMessages((prev) => [...prev, { role: "bot", text: "I'm having trouble connecting right now. Please check that the API is running and your environment variables are set (NEXT_PUBLIC_GEMINI_API_KEY or NEXT_PUBLIC_API_URL)." }]);
        return;
      }

      const systemPrompt = `You are LEXA, a sophisticated legal AI assistant dedicated to helping Nigerian and African law students. \
Provide clear, authoritative, educational explanations of legal concepts, case law and statutes. \
Be precise, cite specific cases where possible, and use a professional but encouraging tutor-like tone.`;

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${systemPrompt}\n\nStudent question: ${userMessage}` }] }],
          }),
        }
      );

      if (geminiRes.ok) {
        const data = await geminiRes.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          setMessages((prev) => [...prev, { role: "bot", text }]);
          return;
        }
      }
      throw new Error("Gemini API returned no response");
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "bot", text: `I encountered an error: ${err?.message || "Unknown error"}. Please ensure NEXT_PUBLIC_API_URL is set correctly in Vercel to your Render backend URL.` }]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 rounded-2xl bg-blue-600 text-white shadow-2xl hover:bg-blue-700 transition-all z-50 group"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-white dark:bg-neutral-900 border border-border px-3 py-1.5 rounded-lg text-sm text-neutral-900 dark:text-neutral-50 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
            Ask LEXA AI
          </span>
        )}
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[400px] h-[60vh] bg-white dark:bg-neutral-900 rounded-3xl border border-border shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">LEXA Legal Assistant</h3>
                  <p className="text-[10px] text-blue-100">Nigerian Law Specialist</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-blue-600" : "bg-neutral-200 dark:bg-neutral-800"}`}>
                    {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-neutral-100 dark:bg-neutral-800 rounded-tl-none"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="p-3 rounded-2xl text-sm bg-neutral-100 dark:bg-neutral-800 rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="animate-pulse">Analyzing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask a legal question..."
                  className="w-full pl-4 pr-12 py-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border-transparent focus:ring-2 focus:ring-blue-600 outline-none text-sm transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="absolute right-2 top-1.5 p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
