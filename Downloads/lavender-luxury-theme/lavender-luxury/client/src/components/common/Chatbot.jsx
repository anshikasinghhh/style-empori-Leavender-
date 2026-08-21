import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, Bot, User, Loader2 } from "lucide-react";
import api from "../../utils/api";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "🌸 Welcome to **Lavender - The Style Emporio**.\n\nI am Lavender, your AI fashion consultant. I can help you with:\n• Product recommendations (Sarees, Kurtis, Sets)\n• Current offers & coupon codes\n• Delivery, returns & store policies\n• Finding the perfect outfit for any occasion!"
    }
  ]);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || message;
    if (!text.trim() || loading) return;

    const userMsg = {
      sender: "user",
      text: text
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/chat", {
        message: text
      });

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: res.data.reply
        }
      ]);
    } catch (err) {
      console.error("Chatbot frontend error:", err);
      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: err?.response?.data?.reply || "Sorry, I am having trouble connecting right now. Please try again in a moment!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatMessageText = (text) => {
    if (!text) return "";
    // Replace markdown bold
    let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Replace newlines
    formatted = formatted.replace(/\n/g, "<br />");
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  return (
    <>
      {/* Styles for typing dots and scrollbar */}
      <style>{`
        .chat-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: #E8C06A;
          border-radius: 4px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #C9963C;
        }
        
        @keyframes typing-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .typing-dot {
          animation: typing-bounce 1s infinite ease-in-out;
        }
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>

      {/* Floating Chat Trigger Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-premium cursor-pointer border border-gold/30"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageSquare size={24} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose rounded-full border-2 border-white animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window Container */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 z-50 w-auto max-w-[95vw] sm:right-6 sm:left-auto sm:w-[380px] max-h-[85vh] bg-white/95 backdrop-blur-xl rounded-2xl shadow-premium border border-gold-pale flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-brand-gradient p-4 text-white flex items-center justify-between border-b border-gold/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-gold-pale/30">
                  <Bot size={22} className="text-gold-light" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm tracking-tight flex items-center gap-1.5">
                    Lavender Assistant <Sparkles size={13} className="text-gold" />
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-champagne/80 font-medium font-body">Online support</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-scrollbar bg-ivory-warm/20">
              {messages.map((msg, index) => {
                const isBot = msg.sender === "bot";
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-2.5 ${isBot ? "justify-start" : "justify-end"}`}
                  >
                    {isBot && (
                      <div className="w-7 h-7 rounded-full bg-champagne-dark/20 flex items-center justify-center shrink-0 border border-gold-pale">
                        <Bot size={14} className="text-primary" />
                      </div>
                    )}
                    <div
                      className={`text-sm py-2.5 px-4 font-body shadow-card max-w-[78%] leading-relaxed ${
                        isBot
                          ? "bg-champagne-light/70 text-gray-800 border border-gold-pale/40 rounded-2xl rounded-tl-none"
                          : "bg-brand-gradient text-white rounded-2xl rounded-tr-none border border-primary-light/10"
                      }`}
                    >
                      {formatMessageText(msg.text)}
                    </div>
                    {!isBot && (
                      <div className="w-7 h-7 rounded-full bg-primary-light/20 flex items-center justify-center shrink-0 border border-primary-light/30">
                        <User size={14} className="text-primary-light" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-start gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-champagne-dark/20 flex items-center justify-center shrink-0 border border-gold-pale">
                    <Bot size={14} className="text-primary" />
                  </div>
                  <div className="bg-champagne-light/70 py-3.5 px-5 rounded-2xl rounded-tl-none border border-gold-pale/40 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-primary/70 rounded-full typing-dot" />
                    <div className="w-1.5 h-1.5 bg-primary/70 rounded-full typing-dot" />
                    <div className="w-1.5 h-1.5 bg-primary/70 rounded-full typing-dot" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 py-2 bg-ivory-warm/10 border-t border-champagne-light/40 flex items-center gap-2 overflow-x-auto chat-scrollbar">
              {[
                "Show me Sarees",
                "Suggest Wedding Outfit",
                "Current Offers",
                "Return Policy",
                "Contact Support"
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={loading}
                  className="px-3 py-1.5 bg-white hover:bg-gold-pale text-primary text-[11px] font-semibold rounded-full border border-gold-pale/80 shadow-sm transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-champagne/30 bg-white flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask Lavender..."
                disabled={loading}
                className="flex-1 py-2.5 px-4 bg-champagne-light/40 border border-gold-pale/60 rounded-full focus:outline-none focus:border-primary text-sm font-body disabled:opacity-60"
              />
              <button
                onClick={() => handleSend()}
                disabled={!message.trim() || loading}
                className="w-10 h-10 rounded-full bg-brand-gradient hover:opacity-95 text-white flex items-center justify-center shadow-card hover:scale-105 transition-all cursor-pointer disabled:opacity-40 disabled:scale-100 shrink-0"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}