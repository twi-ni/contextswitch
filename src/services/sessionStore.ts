// sessionStore.ts — saves and loads session checkpoints as JSON files
// Stored in VS Code's globalStoragePath so they persist across restarts.

import * as fs from "fs";
import * as path from "path";
import { ScoreBreakdown } from "../scoring/readinessScore";

// The full shape of one saved checkpoint
export interface Session {
  id: string;                    // unique ID: timestamp-based
  title: string;                 // user-provided title
  projectName: string | null;
  workspacePath: string | null;
  branch: string | null;
  taskDescription: string;       // what you were working on
  workCompleted: string;         // what you finished
  lastKnownProblem: string;      // what was broken / blocking
  nextStep: string;              // exactly what to do when resuming
  validationStatus: string;      // are tests passing?
  modifiedFiles: string[];
  untrackedFiles: string[];
  recentCommits: string[];
  diffSummary: string | null;
  activeFile: string | null;
  aiSummary: string | null;      // optional Gemini-generated summary
  readinessScore: ScoreBreakdown;
  timeline: TimelineEvent[];
  createdAt: string;             // ISO timestamp
  status: "active" | "paused" | "resumed";
}

export interface TimelineEvent {
  timestamp: string;
  event: string;                 // human-readable description
  type: "save" | "pause" | "resume" | "switch" | "info";
}

const SESSIONS_FILE = "sessions.json";

// Load all sessions from disk
export function loadSessions(storagePath: string): Session[] {
  const filePath = path.join(storagePath, SESSIONS_FILE);
  try {
    if (!fs.existsSync(filePath)) { return []; }
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw) as Session[];
  } catch {
    return []; // corrupt file — start fresh
  }
}

// Save all sessions back to disk
export function saveSessions(storagePath: string, sessions: Session[]): void {
  // Make sure the storage directory exists
  fs.mkdirSync(storagePath, { recursive: true });
  const filePath = path.join(storagePath, SESSIONS_FILE);
  fs.writeFileSync(filePath, JSON.stringify(sessions, null, 2), "utf8");
}

// Add a new session (or overwrite one with the same id)
export function upsertSession(storagePath: string, session: Session): void {
  const sessions = loadSessions(storagePath);
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = session;  // update existing
  } else {
    sessions.unshift(session); // prepend newest first
  }
  saveSessions(storagePath, sessions);
}

// Generate a unique session ID from the current timestamp
export function generateId(): string {
  return `session_${Date.now()}`;
}
