// App.tsx — Main dashboard application for ContextSwitch AI

import React, { useState, useEffect } from "react";
import { Session } from "../services/sessionStore";
import { SessionCard } from "./components/SessionCard";

declare global {
  interface Window {
    __SESSIONS__?: Session[];
    acquireVsCodeApi?: () => {
      postMessage: (msg: unknown) => void;
      setState: (state: unknown) => void;
      getState: () => unknown;
    };
  }
}

// Acquire VS Code API once safely
const vscode = typeof window.acquireVsCodeApi === "function"
  ? window.acquireVsCodeApi()
  : { postMessage: (msg: unknown) => console.log("VS Code message:", msg) };

export function App() {
  const [sessions, setSessions] = useState<Session[]>(() => {
    return window.__SESSIONS__ || [];
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Keep state in sync if window.__SESSIONS__ gets updated or event fires
  useEffect(() => {
    if (window.__SESSIONS__) {
      setSessions(window.__SESSIONS__);
    }
    const handler = () => {
      if (window.__SESSIONS__) {
        setSessions([...window.__SESSIONS__]);
      }
    };
    window.addEventListener("sessions-updated", handler);
    return () => window.removeEventListener("sessions-updated", handler);
  }, []);

  const handleResume = (id: string) => {
    vscode.postMessage({ command: "resumeSession", sessionId: id });
  };

  const handleDelete = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    vscode.postMessage({ command: "deleteSession", sessionId: id });
  };

  const handleSaveNew = () => {
    vscode.postMessage({ command: "saveNew" });
  };

  // Filter sessions
  const filteredSessions = sessions.filter((s) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      s.title.toLowerCase().includes(query) ||
      (s.taskDescription && s.taskDescription.toLowerCase().includes(query)) ||
      (s.projectName && s.projectName.toLowerCase().includes(query)) ||
      (s.branch && s.branch.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "all" || s.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate quick stats
  const totalSessions = sessions.length;
  const avgScore =
    totalSessions > 0
      ? Math.round(
          sessions.reduce((acc, s) => acc + (s.readinessScore?.total || 0), 0) /
            totalSessions
        )
      : 0;

  return (
    <div className="app">
      {/* Top sticky header */}
      <header className="header">
        <div className="header-brand">
          <div className="header-logo">⚡</div>
          <div>
            <div className="header-title">ContextSwitch AI</div>
            <div className="header-sub">
              Your coding session, remembered. Your momentum, restored.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button className="btn btn-primary" onClick={handleSaveNew}>
            <span>+</span> Save Checkpoint
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="main">
        {/* Metric Bar */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "12px 16px",
            }}
          >
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase" }}>
              Total Sessions
            </div>
            <div style={{ fontSize: "20px", fontWeight: "700", marginTop: "4px" }}>
              {totalSessions}
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "12px 16px",
            }}
          >
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase" }}>
              Avg Readiness Score
            </div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: "700",
                marginTop: "4px",
                color: avgScore >= 75 ? "var(--green)" : avgScore >= 50 ? "var(--yellow)" : "var(--red)",
              }}
            >
              {avgScore}
              <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}> / 100</span>
            </div>
          </div>

          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "12px 16px",
            }}
          >
            <div style={{ fontSize: "11px", color: "var(--text-secondary)", textTransform: "uppercase" }}>
              Quick Command
            </div>
            <div style={{ fontSize: "12px", color: "var(--accent-light)", marginTop: "6px", fontFamily: "monospace" }}>
              Cmd+Shift+S / Ctrl+Shift+S
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "20px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "220px" }}>
            <input
              type="text"
              placeholder="Search sessions, tasks, branches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                color: "var(--text-primary)",
                fontSize: "12px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            {(["all", "active", "paused", "resumed"] as const).map((status) => (
              <button
                key={status}
                className={`btn ${statusFilter === status ? "btn-primary" : "btn-ghost"}`}
                style={{ padding: "5px 10px", fontSize: "11px" }}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        <div className="section-header">
          <div className="section-title">Saved Checkpoints</div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Showing {filteredSessions.length} of {totalSessions}
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">🧠</div>
            <h2>No checkpoints found</h2>
            <p>
              Save your current task, git diff, and thoughts before switching context.
              Resume seamlessly whenever you return.
            </p>
            <button className="btn btn-primary" onClick={handleSaveNew}>
              Create your first checkpoint
            </button>
          </div>
        ) : (
          <div className="session-list">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onResume={handleResume}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
