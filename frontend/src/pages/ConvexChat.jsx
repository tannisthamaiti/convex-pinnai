import { useEffect, useState, useRef } from "react";
import { faker } from "@faker-js/faker";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const NAME = getOrSetFakeName();
const BOT_NAME = "GeminiBot";

export default function ConvexChat() {
  const messages = useQuery(api.chat.listMessages) ?? [];
  const sendMessage = useMutation(api.chat.sendMessage);
  const [newMessageText, setNewMessageText] = useState("");
  const [visible, setVisible] = useState(true);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userText = newMessageText.trim();
    if (!userText) return;

    await sendMessage({ user: NAME, body: userText });
    setNewMessageText("");

    try {
      const response = await fetch(`https://etscan.org/explain?prompt=${encodeURIComponent(userText)}`);
      const data = await response.json();

      if (data?.response) {
        await sendMessage({ user: BOT_NAME, body: data.response });
      } else {
        await sendMessage({ user: BOT_NAME, body: "Sorry, I couldn’t understand that." });
      }
    } catch (err) {
      await sendMessage({ user: BOT_NAME, body: "⚠️ Failed to fetch response from Gemini." });
    }
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      width: '350px',
      maxHeight: '500px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      backgroundColor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
      zIndex: 1000
    }}>
      <div style={{
        padding: '0.75rem',
        borderBottom: '1px solid #eee',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Ask me about optimal well placement and reservoir data!</span>
        <button
          onClick={() => setVisible(false)}
          style={{
            border: 'none',
            background: 'none',
            fontSize: '1rem',
            cursor: 'pointer',
            color: '#999',
            fontWeight: 'bold'
          }}
          title="Close chat"
        >
          ❌
        </button>
      </div>

      <div
        ref={chatBoxRef}
        style={{
          padding: '1rem',
          overflowY: 'auto',
          flexGrow: 1,
          fontSize: '0.9rem',
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg._id}
            style={{
              backgroundColor: msg.user === NAME ? "#e6f4ff" : "#f0f0f0",
              padding: "0.6rem",
              marginBottom: "0.5rem",
              borderRadius: "6px",
              whiteSpace: "pre-wrap"
            }}
          >
            <strong>{msg.user === NAME ? "You" : "Bot"}:</strong>{" "}
            <span style={{ color: msg.user === NAME ? "#333" : "#007b83" }}>{msg.body}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", borderTop: "1px solid #eee" }}>
        <input
          value={newMessageText}
          onChange={(e) => setNewMessageText(e.target.value)}
          placeholder="Ask a question..."
          style={{
            flex: 1,
            border: "none",
            padding: "0.75rem",
            fontSize: "0.9rem",
            outline: "none"
          }}
        />
        <button
          type="submit"
          disabled={!newMessageText}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "0 1rem",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

function getOrSetFakeName() {
  const NAME_KEY = "tutorial_name";
  const name = sessionStorage.getItem(NAME_KEY);
  if (!name) {
    const newName = faker.person.firstName();
    sessionStorage.setItem(NAME_KEY, newName);
    return newName;
  }
  return name;
}
