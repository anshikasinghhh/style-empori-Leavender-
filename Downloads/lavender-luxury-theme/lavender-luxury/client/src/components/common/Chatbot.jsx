import React, { useState } from "react";
import api from "../../utils/api";



export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
"🌸 Welcome to Lavender - The Style Emporio.\n\nI can help you with:\n• Product recommendations\n• Sarees, Kurtis, Tops & Sets\n• Offers and discounts\n• Delivery & returns\n• Styling advice\n• Contacting our team"
    }
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = {
      sender: "user",
      text: message
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await api.post("/chat", {
        message
      });

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: res.data.reply
        }
      ]);
    } catch (err) {
  console.error(err);

  setMessages(prev => [
    ...prev,
    {
      sender: "bot",
      text:
        err?.response?.data?.reply ||
        "Sorry, the AI assistant is busy right now. Please try again in a minute."
    }
  ]);
}

    setMessage("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px"
        }}
      >
        💬
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "320px",
            background: "white",
            border: "1px solid #ddd",
            padding: "10px"
          }}
        >
          <h3>Customer Support</h3>

          <div
            style={{
              height: "300px",
              overflowY: "auto"
            }}
          >
            {messages.map((msg, index) => (
              <div key={index}>
                <b>{msg.sender}:</b> {msg.text}
              </div>
            ))}
          </div>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
  {[
    "Show me Sarees",
    "Suggest Wedding Outfit",
    "Current Offers",
    "Return Policy",
    "Contact Support"
  ].map((q) => (
    <button
      key={q}
      onClick={async () => {
  setMessage(q);

  const userMsg = {
    sender: "user",
    text: q
  };

  setMessages(prev => [...prev, userMsg]);

  try {
    const res = await api.post("/chat", {
      message: q
    });

    setMessages(prev => [
      ...prev,
      {
        sender: "bot",
        text: res.data.reply
      }
    ]);
  } catch (err) {
    console.error(err);
  }
}}
      style={{
        margin: "3px",
        padding: "6px 10px",
        borderRadius: "15px",
        border: "1px solid #ccc",
        cursor: "pointer",
        fontSize: "12px"
      }}
    >
      {q}
    </button>
  ))}
</div>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
          />

          <button onClick={sendMessage}>
            Send
          </button>
        </div>
      )}
    </>
  );
}