"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export default function LexaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: "user" | "lexa"; content: string }[]>([
    { role: "lexa", content: "Hello! I am LEXA, your legal learning assistant. How can I help you with Nigerian or African law today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Failed to reach LEXA");

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "lexa", content: data.response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "lexa", content: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl md:w-[400px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">LEXA AI</h3>
                  <p className="text-[10px] opacity-80">Legal Learning Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 transition-colors hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted text-foreground rounded-tl-none border border-border"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-2 text-sm border border-border rounded-tl-none">
                    <Loader2 size={14} className="animate-spin text-primary" />
                    <span className="text-muted-foreground italic">LEXA is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border p-3 bg-card">
              <div className="flex items-center gap-2 overflow-hidden rounded-xl border border-border bg-background px-3 py-1 focus-within:ring-1 focus-within:ring-primary">
                <input
                  type="text"
                  placeholder="Ask LEXA about law..."
                  className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="text-primary transition-opacity hover:opacity-80 disabled:opacity-30"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20 transition-all hover:shadow-primary/20"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
}
