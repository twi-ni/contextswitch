// saveSession.ts — "ContextSwitch: Save Checkpoint" command
// Collects all context, asks user 4 quick questions, scores it, and saves.

import * as vscode from "vscode";
import { getGitInfo } from "../services/gitService";
import { getWorkspaceInfo } from "../services/workspaceService";
import { calculateReadinessScore } from "../scoring/readinessScore";
import { upsertSession, generateId, Session, TimelineEvent } from "../services/sessionStore";
import { generateSessionSummary } from "../services/aiService";

export async function saveSessionCommand(storagePath: string): Promise<void> {
  const ws = getWorkspaceInfo();

  if (!ws.workspacePath) {
    vscode.window.showErrorMessage(
      "ContextSwitch: No workspace folder open. Open a project folder first."
    );
    return;
  }

  const git = getGitInfo(ws.workspacePath);

  // --- Ask user 4 quick questions ---

  const taskDescription = await vscode.window.showInputBox({
    title: "ContextSwitch — Save Checkpoint (1/4)",
    prompt: "What were you working on?",
    placeHolder: "e.g. Fixing the login bug — JWT token not refreshing correctly",
    ignoreFocusOut: true,
  });
  if (taskDescription === undefined) { return; } // user pressed Escape

  const workCompleted = await vscode.window.showInputBox({
    title: "ContextSwitch — Save Checkpoint (2/4)",
    prompt: "What did you get done so far?",
    placeHolder: "e.g. Traced the issue to authMiddleware.ts, added console logs",
    ignoreFocusOut: true,
    value: "",
  });
  if (workCompleted === undefined) { return; }

  const lastKnownProblem = await vscode.window.showInputBox({
    title: "ContextSwitch — Save Checkpoint (3/4)",
    prompt: "What's the current problem or blocker?",
    placeHolder: "e.g. Token expiry check always returns false even with valid token",
    ignoreFocusOut: true,
    value: "",
  });
  if (lastKnownProblem === undefined) { return; }

  const nextStep = await vscode.window.showInputBox({
    title: "ContextSwitch — Save Checkpoint (4/4)",
    prompt: "What's the very next thing to do when you return?",
    placeHolder: "e.g. Check the token expiry field name — might be 'exp' not 'expiry'",
    ignoreFocusOut: true,
    value: "",
  });
  if (nextStep === undefined) { return; }

  // Show progress while we compute score + optional AI summary
  await vscode.window.withProgress(
    { location: vscode.ProgressLocation.Notification, title: "ContextSwitch: Saving checkpoint…" },
    async (progress) => {

      progress.report({ message: "Calculating readiness score…" });

      const score = calculateReadinessScore({
        taskDescription,
        modifiedFiles: git.modifiedFiles,
        lastKnownProblem,
        nextStep,
        validationStatus: null,  // not asked in this version
        recentCommits: git.recentCommits,
        branch: git.branch,
        activeFile: ws.activeFile,
      });

      progress.report({ message: "Generating AI summary (optional)…" });

      // Read Gemini key from VS Code settings (user sets it once)
      const config = vscode.workspace.getConfiguration("contextswitch");
      const apiKey: string | undefined = config.get("geminiApiKey") || undefined;

      const aiSummary = await generateSessionSummary({
        apiKey,
        taskDescription,
        modifiedFiles: git.modifiedFiles,
        lastKnownProblem,
        nextStep,
        branch: git.branch,
      });

      progress.report({ message: "Saving…" });

      const now = new Date().toISOString();
      const timeline: TimelineEvent[] = [
        { timestamp: now, event: "Checkpoint saved", type: "save" },
      ];

      const session: Session = {
        id: generateId(),
        title: taskDescription.slice(0, 60) || "Untitled session",
        projectName: ws.projectName,
        workspacePath: ws.workspacePath,
        branch: git.branch,
        taskDescription,
        workCompleted,
        lastKnownProblem,
        nextStep,
        validationStatus: "",
        modifiedFiles: git.modifiedFiles,
        untrackedFiles: git.untrackedFiles,
        recentCommits: git.recentCommits,
        diffSummary: git.diffSummary,
        activeFile: ws.activeFile,
        aiSummary,
        readinessScore: score,
        timeline,
        createdAt: now,
        status: "paused",
      };

      upsertSession(storagePath, session);

      // Show result
      const label = score.total >= 80
        ? "🟢 Great checkpoint!"
        : score.total >= 50
        ? "🟡 Good checkpoint"
        : "🔴 Incomplete checkpoint";

      vscode.window.showInformationMessage(
        `${label} Readiness score: ${score.total}/100`,
        "Open Dashboard"
      ).then((choice) => {
        if (choice === "Open Dashboard") {
          vscode.commands.executeCommand("contextswitch.openDashboard");
        }
      });
    }
  );
}
