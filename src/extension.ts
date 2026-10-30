// extension.ts — VS Code extension entry point
// Registers all commands and manages the Webview dashboard panel.

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { saveSessionCommand } from "./commands/saveSession";
import { loadSessions, upsertSession } from "./services/sessionStore";

// The dashboard panel — we keep a reference so we don't open duplicates
let dashboardPanel: vscode.WebviewPanel | undefined;

export function activate(context: vscode.ExtensionContext) {
  // globalStoragePath is a folder VS Code provides for persistent extension data
  const storagePath = context.globalStoragePath;
  fs.mkdirSync(storagePath, { recursive: true });

  // --- Command: Save Checkpoint ---
  const saveCmd = vscode.commands.registerCommand(
    "contextswitch.saveSession",
    async () => {
      await saveSessionCommand(storagePath);
      // Refresh dashboard if it's open
      if (dashboardPanel) {
        refreshDashboard(dashboardPanel, storagePath, context.extensionUri);
      }
    }
  );

  // --- Command: Open Dashboard ---
  const dashCmd = vscode.commands.registerCommand(
    "contextswitch.openDashboard",
    () => {
      if (dashboardPanel) {
        // Already open — just bring it to front
        dashboardPanel.reveal(vscode.ViewColumn.One);
      } else {
        dashboardPanel = createDashboardPanel(context);
      }
      refreshDashboard(dashboardPanel!, storagePath, context.extensionUri);
    }
  );

  // --- Handle messages sent FROM the webview TO the extension ---
  context.subscriptions.push(
    saveCmd,
    dashCmd,
    // Listen for webview panel being closed
    {
      dispose: () => {
        dashboardPanel?.dispose();
      },
    }
  );
}

// Creates the VS Code Webview panel for the dashboard
function createDashboardPanel(context: vscode.ExtensionContext): vscode.WebviewPanel {
  const panel = vscode.window.createWebviewPanel(
    "contextswitchDashboard",       // internal ID
    "ContextSwitch AI",             // tab title
    vscode.ViewColumn.One,          // open in first editor column
    {
      enableScripts: true,          // allow React JS to run
      retainContextWhenHidden: true, // don't reload when switching tabs
      localResourceRoots: [
        vscode.Uri.joinPath(context.extensionUri, "dist"),
      ],
    }
  );

  // Handle messages from webview (e.g. "resume session", "delete session")
  panel.webview.onDidReceiveMessage(
    async (message: { command: string; sessionId?: string }) => {
      const storagePath = context.globalStoragePath;

      if (message.command === "resumeSession" && message.sessionId) {
        const sessions = loadSessions(storagePath);
        const session = sessions.find((s) => s.id === message.sessionId);
        if (!session) { return; }

        // Mark it as active
        session.status = "active";
        session.timeline.push({
          timestamp: new Date().toISOString(),
          event: "Session resumed",
          type: "resume",
        });
        upsertSession(storagePath, session);

        // Reopen modified files in the editor
        if (session.workspacePath) {
          for (const file of session.modifiedFiles.slice(0, 3)) {
            const filePath = path.join(session.workspacePath, file);
            if (fs.existsSync(filePath)) {
              const doc = await vscode.workspace.openTextDocument(filePath);
              await vscode.window.showTextDocument(doc, { preview: false });
            }
          }
        }

        // Refresh dashboard to show updated status
        refreshDashboard(panel, storagePath, context.extensionUri);

        vscode.window.showInformationMessage(
          `▶ Resuming: ${session.title}. Next step: ${session.nextStep || "check the dashboard"}`
        );
      }

      if (message.command === "saveNew") {
        await saveSessionCommand(storagePath);
        refreshDashboard(panel, storagePath, context.extensionUri);
      }

      if (message.command === "deleteSession" && message.sessionId) {
        const sessions = loadSessions(storagePath);
        const filtered = sessions.filter((s) => s.id !== message.sessionId);
        const { saveSessions } = await import("./services/sessionStore");
        saveSessions(storagePath, filtered);
        refreshDashboard(panel, storagePath, context.extensionUri);
      }
    }
  );

  panel.onDidDispose(() => {
    dashboardPanel = undefined;
  });

  return panel;
}

// Sends current sessions to the webview so React can render them
function refreshDashboard(
  panel: vscode.WebviewPanel,
  storagePath: string,
  extensionUri: vscode.Uri
) {
  const sessions = loadSessions(storagePath);

  // Build the webview HTML (loads the bundled React JS)
  panel.webview.html = getDashboardHtml(panel.webview, extensionUri, sessions);
}

// Generates the HTML shell that loads the React bundle
function getDashboardHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  sessions: unknown[]
): string {
  // Convert the local dist/webview.js path to a webview-safe URI
  const scriptUri = webview.asWebviewUri(
    vscode.Uri.joinPath(extensionUri, "dist", "webview.js")
  );

  // Pass sessions as JSON embedded in the HTML — React reads window.__SESSIONS__
  const sessionsJson = JSON.stringify(sessions).replace(/</g, "\\u003c");

  return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none';
             script-src ${webview.cspSource} 'unsafe-inline';
             style-src ${webview.cspSource} 'unsafe-inline' https://fonts.googleapis.com;
             font-src https://fonts.gstatic.com;" />
  <title>ContextSwitch AI</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  <script>
    // Inject session data so React can read it without an API call
    window.__SESSIONS__ = ${sessionsJson};
  </script>
  <script src="${scriptUri}"></script>
</body>
</html>`;
}

export function deactivate() {}
