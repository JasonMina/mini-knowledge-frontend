import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/query`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg.content }),
});

      const data = await response.json();
      const botMsg = { role: "bot", content: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Error fetching:", err);
      const errorMsg = { role: "bot", content: "⚠️ Error connecting to server" };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="chat-container">
      <h1>🐱 KITT </h1>
      <div className="chat-box">
        {messages.length === 0 ? (
          <div className="empty-state">
            <img src="/KITT.png" alt="logo" className="logo" />
            <p>Start chatting with the KITT from Knight Rider!</p>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                <strong>{m.role === "user" ? "You" : "Bot"}:</strong> {m.content}
              </div>
            ))}
            {loading && <div className="chat-bubble bot">Bot is typing...</div>}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
