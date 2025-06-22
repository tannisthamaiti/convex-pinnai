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
  <div
    style={{
      width: '100%',
      height: 'auto',
      border: 'none',
      borderRadius: 0,
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, sans-serif',
      boxShadow: 'none',
    }}
  >
      <div
    style={{
      padding: '0.5rem 0',
      fontWeight: 600,
      fontSize: '1rem',
      color: '#444',
      marginBottom: '0.5rem',
    }}
>
      Ask me about optimal well placement and reservoir data!
    </div>

    <div
      ref={chatBoxRef}
      style={{
        padding: '1rem',
        overflowY: 'auto',
        maxHeight: 300,
        fontSize: '0.9rem',
        background: '#f9f9f9',
        border: '1px solid #eee',
        borderRadius: '6px',
        marginBottom: '1rem',
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

    <form onSubmit={handleSubmit} style={{ display: "flex" }}>
      <input
        value={newMessageText}
        onChange={(e) => setNewMessageText(e.target.value)}
        placeholder="Ask a question..."
        style={{
          flex: 1,
          border: "1px solid #ccc",
          padding: "0.75rem",
          fontSize: "0.9rem",
          borderRadius: "6px 0 0 6px",
          outline: "none",
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
          fontWeight: "bold",
          borderRadius: "0 6px 6px 0",
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
