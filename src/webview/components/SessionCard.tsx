// SessionCard.tsx — renders one saved checkpoint as an expandable card

import React, { useState } from "react";
import { Session } from "../../services/sessionStore";
import { ReadinessRing } from "./ReadinessRing";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { Timeline } from "./Timeline";

interface Props {
  session: Session;
  onResume: (id: string) => void;
  onDelete: (id: string) => void;
}

export function SessionCard({ session, onResume, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);

  const score = session.readinessScore?.total ?? 0;
  const ago = timeAgo(session.createdAt);

  return (
    <div
      className={`session-card ${expanded ? "expanded" : ""}`}
      onClick={() => setExpanded((v) => !v)}
    >
      {/* ── Top row: title + score ring ── */}
      <div className="card-top">
        <div className="card-left">
          <div className="card-title">{session.title}</div>
          <div className="card-meta">
            {session.projectName && (
              <span className="meta-tag">📁 {session.projectName}</span>
            )}
            {session.branch && (
              <span className="meta-tag">⎇ {session.branch}</span>
            )}
            <span className="meta-tag">🕐 {ago}</span>
            {session.modifiedFiles.length > 0 && (
              <span className="meta-tag">
                ✏️ {session.modifiedFiles.length} file{session.modifiedFiles.length !== 1 ? "s" : ""}
              </span>
            )}
            <span className={`status-badge status-${session.status}`}>
              {session.status}
            </span>
          </div>
        </div>

        {/* Score ring — right side */}
        <div className="score-ring-wrap" onClick={(e) => e.stopPropagation()}>
          <ReadinessRing score={score} />
          <span className="score-label">readiness</span>
        </div>
      </div>

      {/* ── AI Summary (always visible if present) ── */}
      {session.aiSummary && (
        <div className="ai-summary" style={{ marginTop: 12 }}>
          <span className="ai-icon">✨</span>
          <span>{session.aiSummary}</span>
        </div>
      )}

      {/* ── Expanded detail ── */}
      {expanded && (
        <div className="card-detail" onClick={(e) => e.stopPropagation()}>

          {/* Task */}
          <div className="detail-section full">
            <div className="detail-label">What you were working on</div>
            <div className="detail-value">{session.taskDescription || <em className="muted">Not recorded</em>}</div>
          </div>

          {/* Work done */}
          <div className="detail-section">
            <div className="detail-label">Work completed</div>
            <div className="detail-value">
              {session.workCompleted || <span className="detail-value muted">Not recorded</span>}
            </div>
          </div>

          {/* Next step */}
          <div className="detail-section">
            <div className="detail-label">⚡ Next action</div>
            <div className="detail-value" style={{ color: "#a78bfa", fontWeight: 600 }}>
              {session.nextStep || <span className="detail-value muted">Not recorded</span>}
            </div>
          </div>

          {/* Problem */}
          <div className="detail-section">
            <div className="detail-label">Last known problem</div>
            <div className="detail-value">
              {session.lastKnownProblem || <span className="detail-value muted">Not recorded</span>}
            </div>
          </div>

          {/* Active file */}
          <div className="detail-section">
            <div className="detail-label">Active file when saved</div>
            <div className="detail-value" style={{ fontFamily: "monospace" }}>
              {session.activeFile || <span className="detail-value muted">None</span>}
            </div>
          </div>

          {/* Modified files */}
          {session.modifiedFiles.length > 0 && (
            <div className="detail-section full">
              <div className="detail-label">Modified files</div>
              <div className="file-list">
                {session.modifiedFiles.slice(0, 8).map((f) => (
                  <div className="file-item" key={f}>
                    <div className="file-dot" />
                    {f}
                  </div>
                ))}
                {session.modifiedFiles.length > 8 && (
                  <div className="detail-value muted">
                    +{session.modifiedFiles.length - 8} more
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent commits */}
          {session.recentCommits.length > 0 && (
            <div className="detail-section full">
              <div className="detail-label">Recent commits</div>
              <div className="commit-list">
                {session.recentCommits.map((c, i) => {
                  const [hash, ...rest] = c.split(" ");
                  return (
                    <div className="commit-item" key={i}>
                      <span className="commit-hash">{hash}</span>
                      <span className="commit-msg">{rest.join(" ")}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Readiness score breakdown */}
          {session.readinessScore && (
            <div className="detail-section full">
              <div className="detail-label">Readiness score breakdown</div>
              <ScoreBreakdown breakdown={session.readinessScore} />
            </div>
          )}

          {/* Timeline */}
          {session.timeline?.length > 0 && (
            <div className="detail-section full">
              <div className="detail-label">Session timeline</div>
              <Timeline events={session.timeline} />
            </div>
          )}

          {/* Actions */}
          <div className="card-actions full">
            <button
              className="btn btn-resume"
              onClick={() => onResume(session.id)}
            >
              ▶ Resume session
            </button>
            <button
              className="btn btn-danger"
              onClick={() => {
                if (confirm("Delete this checkpoint?")) {
                  onDelete(session.id);
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Converts an ISO timestamp to a "2 hours ago" style string
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   { return "just now"; }
  if (mins < 60)  { return `${mins}m ago`; }
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   { return `${hrs}h ago`; }
  return `${Math.floor(hrs / 24)}d ago`;
}
