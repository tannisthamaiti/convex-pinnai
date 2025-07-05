// AskImageQuestion.jsx  – UI with light theme + breadcrumb navigation
// -----------------------------------------------------------------------------
// NOTE: No backend logic changed – only styling / layout.

import React, { useState, useRef, useEffect } from "react";
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function AskImageQuestion() {
  const navigate = useNavigate();

  // ─── state ────────────────────────────────────────────────────────────
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [iframeSrc, setIframeSrc] = useState(null);

  // auto-scroll chat
  const chatRef = useRef(null);
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [answer, loading]);

  // ─── handlers ─────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setIframeSrc(file ? URL.createObjectURL(file) : null);
  };

  const handleLoadDemo = async () => {
    const res = await fetch("20.png");
    const blob = await res.blob();
    const file = new File([blob], "20.png", { type: blob.type });
    setImageFile(file);
    setIframeSrc(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setAnswer("");

    try {
      const res = await fetch("https://etscan.org/predict_permeability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setAnswer(data.response || "No answer returned.");
    } catch (err) {
      setAnswer("Error: " + err.message);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };

  // ─── colours / tokens (easy to tweak) ─────────────────────────────────
  const colors = {
    bg: "#ffffff",              // page background
    panel: "#f5f5f5",           // card / panel background
    border: "rgba(0,0,0,0.08)", // subtle grey border
    text: "#222222",            // primary text
    sub: "#555555",             // secondary text
    accent: "#2962ff",          // action colour
  };

  // ──────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        minHeight: "100vh",
        background: colors.bg,
        color: colors.text,
        padding: "2rem 1rem",
        boxSizing: "border-box",
      }}
    >
      {/* ─── Breadcrumb nav ─────────────────────────────────────────── */}
      <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ mb: "1rem" }}>
        <MuiLink
          underline="hover"
          color="inherit"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Home
        </MuiLink>

        <MuiLink
          underline="hover"
          color="inherit"
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </MuiLink>

        {/* current page (non-clickable) */}
        <Typography color="text.primary">Vugs</Typography>
      </Breadcrumbs>

      {/* ─── Heading & tagline ───────────────────────────────────────── */}
      <h1 style={{ textAlign: "center", fontSize: "2.3rem", marginBottom: "0.3rem" }}>
        Interactive Point Viewer
      </h1>
      <p style={{ textAlign: "center", color: colors.sub, marginBottom: "2rem" }}>
        Upload CSV data and images to create interactive visualisations.&nbsp;Select points
        for contextual assistance and explore your data with our intelligent chat interface.
      </p>

      {/* ─── Main two-column grid ───────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 360px",
          gap: "1.25rem",
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        {/* ───── Left column (viewer) ───── */}
        <div
          style={{
            background: colors.panel,
            border: `1px solid ${colors.border}`,
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            padding: "1rem",
          }}
        >
          {/* Upload toolbar */}
          <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
            <label
              htmlFor="fileInput"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                color: colors.text,
                padding: "0.45rem 0.9rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ fontSize: "1.1rem" }}>⬆</span>
              Upload&nbsp;Files
            </label>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            <button
              onClick={handleLoadDemo}
              style={{
                background: colors.accent,
                color: "#fff",
                border: "none",
                padding: "0.45rem 0.9rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Load Demo
            </button>
          </div>

          {/* Image / placeholder canvas */}
          <div
            style={{
              flex: 1,
              background: "#e6e6e6",
              borderRadius: "6px",
              position: "relative",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {iframeSrc ? (
              <iframe
                src={iframeSrc}
                title="Preview"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            ) : (
              <div
                style={{
                  textAlign: "center",
                  color: "#999",
                  fontStyle: "italic",
                  padding: "1rem",
                }}
              >
                Drop your image here or click “Upload Files”
              </div>
            )}
          </div>
        </div>

        {/* ───── Right column (chat) ───── */}
        <div
          style={{
            background: colors.panel,
            border: `1px solid ${colors.border}`,
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            height: "600px",
          }}
        >
          {/* Chat header */}
          <div
            style={{
              padding: "0.85rem 1rem",
              borderBottom: `1px solid ${colors.border}`,
              fontWeight: 600,
            }}
          >
            Chat Assistant
          </div>

          {/* Messages container */}
          <div
            ref={chatRef}
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "1rem",
              fontSize: "0.95rem",
            }}
          >
            {!loading && !answer && (
              <p style={{ color: colors.sub, textAlign: "center", marginTop: "2rem" }}>
                Select points on the image and start chatting to get contextual assistance.
              </p>
            )}

            {loading && (
              <p style={{ fontStyle: "italic", color: colors.sub }}>LLM thinking…</p>
            )}

            {answer && <p style={{ color: colors.accent }}>{answer}</p>}
          </div>

          {/* Input bar */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "0.6rem",
              padding: "0.9rem 1rem",
              borderTop: `1px solid ${colors.border}`,
            }}
          >
            <input
              type="text"
              placeholder="Ask about the selected points…"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              style={{
                flex: 1,
                background: colors.bg,
                border: `1px solid ${colors.border}`,
                borderRadius: "6px",
                padding: "0.55rem 0.8rem",
                color: colors.text,
                fontSize: "0.95rem",
              }}
            />
            <button
              type="submit"
              style={{
                background: colors.accent,
                border: "none",
                color: "#fff",
                padding: "0 1rem",
                borderRadius: "6px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              ➤
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
